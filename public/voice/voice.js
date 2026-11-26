// Browser side of the voice agent demo. No libraries. Talks only to this computer (/voice/api).
const $ = id => document.getElementById(id);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const refusals = {
  no_voice_consent: 'ለዚህ አባል የስልክ ጥሪ ፈቃድ አልተመዘገበም፤ ረዳቱ አይደውልም። (No recorded consent for calls: the agent refuses to call.)',
  inactive_member: 'አባሉ ንቁ አይደለም። (Member is not active.)',
  invalid_phone: 'የስልክ ቁጥሩ ትክክል አይደለም። (Phone number is not valid.)',
  outside_calling_hours: 'ከጥሪ ሰዓት ውጭ ነው። (Outside calling hours.)',
  attempt_limit: 'የዛሬው የጥሪ ሙከራ ገደብ ሞልቷል። (Daily attempt limit reached.)'
};
const outcomes = {
  completed: 'ተጠናቋል (completed)', wrong_person: 'ሌላ ሰው አነሳ (wrong person, nothing disclosed)',
  not_confirmed: 'ማንነት አልተረጋገጠም (identity not confirmed, nothing disclosed)', opted_out: 'ጥሪ እንዳይደረግ ጠይቀዋል (asked for no more calls)',
  turn_limit: 'የጥያቄ ገደብ (question limit reached)', not_understood: 'አልተግባባንም (not understood twice)'
};
const flags = {
  staff_follow_up: 'ሠራተኛ ያነጋግር (staff to follow up)', dispute: 'ቅሬታ (member disputes a figure)',
  opt_out_requested: 'ፈቃድ ይሰረዝ (record consent withdrawal)', secret_offered: 'ሚስጥር ሊናገሩ ነበር (offered a secret; warned)',
  money_request: 'የገንዘብ ጥያቄ (asked for money action; refused)', asked_about_other_person: 'ስለ ሌላ ሰው ጠየቁ (asked about someone else; refused)'
};
const chips = { confirm: ['አዎ', 'አይደለም'], questions: ['ስንት አስረከብኩ?', 'ክፍያዬ ተከፍሏል?', 'ድገም', 'የባለቤቴን ክፍያ ንገረኝ', 'ገንዘብ ላኩልኝ', 'ልክ አይደለም', 'አትደውሉልኝ', 'ይበቃል'] };

let speechOn = false, chosen = null, callId = null, stage = null, busy = false, recorder = null;

// On a plain website there is no server: the page then carries the conversation logic itself (see src/voice/local-api.ts).
const local = globalThis.voiceLocalApi;
async function api(path, options) {
  if (local) return local(path, options);
  const response = await fetch('/voice/api' + path, options);
  return { status: response.status, body: await response.json().catch(() => ({})) };
}
const json = body => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

function bubble(kind, text, small) {
  const node = el('div', 'bubble ' + kind, text);
  if (small) node.append(el('small', '', small));
  $('talk').append(node);
  node.scrollIntoView({ block: 'nearest' });
}

function renderMembers(members) {
  $('members').replaceChildren(...members.map(member => {
    const button = el('button', 'member');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(chosen === member.id));
    button.append(el('strong', '', member.name), el('small', '', member.cooperative),
      el('small', member.consent ? '' : 'no', member.consent ? 'የጥሪ ፈቃድ፦ አለ' : 'የጥሪ ፈቃድ፦ የለም'), el('em', '', member.note));
    button.addEventListener('click', () => { if (!callId) { chosen = member.id; renderMembers(members); controls(); } });
    const item = el('li');
    item.append(button);
    return item;
  }));
}
function renderLog(log) {
  if (!log?.length) return;
  $('log').replaceChildren(...log.map(entry => {
    const item = el('li');
    item.append(el('strong', '', entry.member), document.createTextNode(' · ' + (outcomes[entry.outcome] ?? entry.outcome)));
    if (entry.flags.length) item.append(el('br'), ...entry.flags.map(flag => el('span', 'flag', flags[flag] ?? flag)));
    return item;
  }));
}
function renderChips() {
  $('chips').replaceChildren(...(chips[stage] ?? []).map(text => {
    const button = el('button', '', text);
    button.type = 'button';
    button.addEventListener('click', () => turn(json({ text }), text));
    return button;
  }));
}
function controls() {
  const live = Boolean(callId) && !busy;
  $('call').disabled = !chosen || Boolean(callId) || busy;
  $('hangup').disabled = !callId;
  $('mic').disabled = !live || !speechOn;
  $('text').disabled = !live;
  $('say').querySelector('button').disabled = !live;
  for (const key of $('keys').children) key.disabled = !live;
  for (const chip of $('chips').children) chip.disabled = !live;
}

let playing = null;
function play(base64) {
  playing?.pause();
  if (!base64) return;
  playing = new Audio('data:audio/wav;base64,' + base64);
  playing.play().catch(() => {});
}
function agentSays(body) {
  bubble('agent', body.say.text, body.audio ? 'ረዳቱ ተናገረ (spoken aloud)' : speechOn && body.speech_failed ? 'የድምፅ አገልግሎቱ አልመለሰም (speech service failed; text only)' : 'ረዳቱ የሚናገረው ጽሑፍ (the exact words the agent would speak)');
  play(body.audio);
  stage = body.ended ? null : body.stage;
  if (body.ended) {
    callId = null;
    bubble('note', 'ጥሪው ተዘግቷል · ' + (outcomes[body.outcome] ?? ''));
    $('call-status').textContent = 'ጥሪው ተዘግቷል። ሌላ አባል መርጠው እንደገና መደወል ይችላሉ።';
  }
  renderChips();
}

async function startCall() {
  busy = true; controls();
  $('talk').replaceChildren();
  $('call-status').textContent = 'እየደወለ ነው…';
  const { status, body } = await api('/calls', json({ member_id: chosen }));
  busy = false;
  if (status === 409) {
    bubble('note', refusals[body.refused] ?? 'ጥሪው አልተፈቀደም።');
    $('call-status').textContent = 'ጥሪው አልተደረገም።';
  } else if (status === 201) {
    callId = body.call_id;
    $('call-status').textContent = local ? 'ጥሪው ተነስቷል። በቁልፍ ወይም በጽሑፍ ይመልሱ።' : 'ጥሪው ተነስቷል። በቁልፍ፣ በጽሑፍ ወይም በድምፅ ይመልሱ።';
    agentSays(body);
  } else $('call-status').textContent = 'ጥሪውን መጀመር አልተቻለም።';
  controls();
}

async function turn(options, shown) {
  if (!callId || busy) return;
  busy = true; controls();
  if (shown) bubble('member', shown);
  const { status, body } = await api('/calls/' + callId + '/turns', options);
  busy = false;
  if (status === 200) {
    if (body.heard.via === 'speech') bubble('member', body.heard.transcript || '…', 'የተሰማው (what the speech model heard) · ' + body.heard.intent);
    agentSays(body);
    renderLog(body.log);
    if (body.ended) refresh();
  } else if (status === 404) {
    callId = null; stage = null; renderChips();
    $('call-status').textContent = 'ጥሪው ጊዜው አልፏል።';
  } else bubble('note', body.error ?? 'ስህተት ተፈጥሯል።');
  controls();
}

// Microphone: record plain 16 kHz mono WAV in the browser, a format the speech service accepts.
function wav(chunks, rate) {
  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const input = new Float32Array(length);
  let offset = 0;
  for (const chunk of chunks) { input.set(chunk, offset); offset += chunk.length; }
  const step = rate / 16000, count = Math.floor(length / step);
  const view = new DataView(new ArrayBuffer(44 + count * 2));
  const text = (at, value) => [...value].forEach((char, i) => view.setUint8(at + i, char.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, 36 + count * 2, true); text(8, 'WAVEfmt '); view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, 16000, true); view.setUint32(28, 32000, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true); text(36, 'data'); view.setUint32(40, count * 2, true);
  for (let i = 0; i < count; i++) {
    const from = Math.floor(i * step), to = Math.min(length, Math.floor((i + 1) * step));
    let sum = 0;
    for (let j = from; j < to; j++) sum += input[j];
    const sample = Math.max(-1, Math.min(1, sum / Math.max(1, to - from)));
    view.setInt16(44 + i * 2, sample * 0x7FFF, true);
  }
  return view.buffer;
}
async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
  const context = new AudioContext(), source = context.createMediaStreamSource(stream), node = context.createScriptProcessor(4096, 1, 1);
  const chunks = [];
  node.onaudioprocess = event => chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
  source.connect(node); node.connect(context.destination);
  playing?.pause();
  const timer = setTimeout(stopRecording, 8000);
  recorder = { stop: async () => {
    clearTimeout(timer);
    node.disconnect(); source.disconnect(); stream.getTracks().forEach(track => track.stop());
    const rate = context.sampleRate;
    await context.close();
    return wav(chunks, rate);
  } };
  $('mic').classList.add('live');
  $('mic').textContent = '■ ጨርሻለሁ';
}
async function stopRecording() {
  if (!recorder) return;
  const current = recorder;
  recorder = null;
  $('mic').classList.remove('live');
  $('mic').textContent = 'ተናገር';
  const audio = await current.stop();
  await turn({ method: 'POST', headers: { 'Content-Type': 'audio/wav' }, body: audio });
}

async function refresh() {
  const { body } = await api('/status');
  speechOn = Boolean(body.speech);
  $('mode').textContent = speechOn
    ? 'Speech is ON: the agent speaks and listens through the speech service. Synthetic members only.'
    : body.static
      ? 'Demo with invented members. It runs inside your browser: nothing you type is sent anywhere, and there is no sound in this version. The text is what the agent would say on a call. The Amharic wording is a draft under review.'
      : 'Text mode: no speech key was given, so nothing is spoken. The text shown is exactly what the agent would say. Keys and typing work.';
  $('mic').hidden = Boolean(body.static);
  $('mode').classList.toggle('on', speechOn);
  renderMembers(body.members ?? []);
  renderLog(body.log);
  controls();
}

for (const key of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']) {
  const button = el('button', '', key);
  button.type = 'button';
  button.disabled = true;
  button.setAttribute('aria-label', 'ቁልፍ ' + key);
  button.addEventListener('click', () => turn(json({ key }), '' + key));
  $('keys').append(button);
}
$('call').addEventListener('click', startCall);
$('hangup').addEventListener('click', () => {
  playing?.pause();
  callId = null; stage = null; renderChips();
  bubble('note', 'ስልኩ ተዘግቷል።');
  $('call-status').textContent = 'ስልኩ ተዘግቷል።';
  controls();
});
$('mic').addEventListener('click', () => (recorder ? stopRecording() : startRecording().catch(() => bubble('note', 'ማይክሮፎኑን መጠቀም አልተቻለም። (Microphone not available.)'))));
$('say').addEventListener('submit', event => {
  event.preventDefault();
  const text = $('text').value.trim();
  if (!text) return;
  $('text').value = '';
  turn(json({ text }), text);
});
refresh().catch(() => { $('mode').textContent = 'The demo server is not answering.'; });
