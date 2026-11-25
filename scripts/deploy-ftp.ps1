# Uploads web/dist to the messoric.com hosting (Zergaw, CentOS Web Panel) over FTP with TLS.
# Login comes from web/deploy-login.local (git-ignored). The password is passed to curl on stdin,
# so it never appears on the command line or in the output.
#
#   powershell -File scripts/deploy-ftp.ps1 -List     # log in and list the remote folder only
#   powershell -File scripts/deploy-ftp.ps1 -DryRun   # show what would be uploaded
#   powershell -File scripts/deploy-ftp.ps1           # upload
param([switch]$List, [switch]$DryRun, [switch]$Diag)
$ErrorActionPreference = 'Stop'
$OutputEncoding = New-Object Text.UTF8Encoding $false

$root = Split-Path $PSScriptRoot -Parent
$loginFile = Join-Path $root 'deploy-login.local'
if (-not (Test-Path $loginFile)) { throw "Missing $loginFile. Fill in FTP_USER and FTP_PASSWORD first." }

$cfg = @{}
foreach ($line in Get-Content $loginFile -Encoding UTF8) {
  if ($line -match '^\s*([A-Z_]+)\s*=(.*)$') { $cfg[$Matches[1]] = $Matches[2].Trim() }
}
foreach ($k in 'FTP_USER', 'FTP_PASSWORD') { if (-not $cfg[$k]) { throw "$k is empty in deploy-login.local" } }
$ftpHost = if ($cfg['FTP_HOST']) { $cfg['FTP_HOST'] } else { 'zpanel2.zergaw.com' }
$remoteDir = if ($cfg['FTP_DIR']) { $cfg['FTP_DIR'].Trim('/') } else { 'public_html' }

$cred = ($cfg['FTP_USER'] + ':' + $cfg['FTP_PASSWORD']).Replace('\', '\\').Replace('"', '\"')
$curlConfig = "user = `"$cred`""

function Invoke-Curl([string[]]$curlArgs) {
  # Windows PowerShell cannot pipe reliably into curl -K -, so the login goes into a temp file
  # readable only by this user, deleted straight after the call.
  $tmp = [IO.Path]::GetTempFileName()
  try {
    $acl = New-Object Security.AccessControl.FileSecurity
    $acl.SetAccessRuleProtection($true, $false)
    $me = [Security.Principal.WindowsIdentity]::GetCurrent().Name
    $acl.AddAccessRule((New-Object Security.AccessControl.FileSystemAccessRule($me, 'FullControl', 'Allow')))
    Set-Acl -Path $tmp -AclObject $acl
    [IO.File]::WriteAllText($tmp, $curlConfig + "`n", (New-Object Text.UTF8Encoding $false))
    if ($Diag) {
      # Verbose FTP log with every line that could carry the password removed.
      cmd /c "curl.exe -v -sS -K `"$tmp`" --ssl-reqd --connect-timeout 20 --max-time 60 $($curlArgs -join ' ') 2>&1" |
        Where-Object { $_ -notmatch 'PASS|USER' }
    } else {
      curl.exe -sS -K $tmp --ssl-reqd --connect-timeout 20 @curlArgs
    }
    $code = $LASTEXITCODE
  } finally {
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  }
  if ($code -ne 0) { throw "curl failed (exit $code) for: $($curlArgs[-1])" }
}

if ($List) {
  Invoke-Curl @('--list-only', "ftp://$ftpHost/$remoteDir/")
  return
}

$dist = Join-Path $root 'dist'
if (-not (Test-Path (Join-Path $dist 'index.html'))) { throw 'No dist/index.html. Run npm run build first.' }

$files = Get-ChildItem $dist -Recurse -File
foreach ($f in $files) {
  $rel = $f.FullName.Substring($dist.Length + 1).Replace('\', '/')
  if ($DryRun) { "would upload $rel"; continue }
  Invoke-Curl @('--ftp-create-dirs', '--retry', '2', '-T', $f.FullName, "ftp://$ftpHost/$remoteDir/$rel")
  "uploaded $rel"
}
"done: $($files.Count) files to $remoteDir on $ftpHost"
