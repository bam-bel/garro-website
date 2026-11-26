const folds = [
    [0x1210, 0x1200, 7], [0x1280, 0x1200, 7], [0x1220, 0x1230, 7], [0x12D0, 0x12A0, 7], [0x1340, 0x1338, 7]
];
export function normalizeAm(text) {
    let out = '';
    for (const char of text.normalize('NFC').toLowerCase()) {
        let code = char.codePointAt(0);
        for (const [from, to, length] of folds)
            if (code >= from && code < from + length)
                code = to + (code - from);
        if (code === 0x1203)
            code = 0x1200;
        if (code === 0x12A3)
            code = 0x12A0;
        out += String.fromCodePoint(code);
    }
    return out.replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}
const words = (...list) => list.map(normalizeAm);
const has = (text, list) => list.some(word => text.includes(word));
const hasWord = (text, list) => { const tokens = text.split(' '); return list.some(word => tokens.includes(word)); };
const secretWords = words('ፒን', 'ሚስጥር ቁጥር', 'የሚስጥር', 'የይለፍ', 'ፓስወርድ', 'ሂሳብ ቁጥር', 'አካውንት ቁጥር', 'የባንክ ቁጥር', 'pin', 'password');
const moneyWords = words('ገንዘብ ላክ', 'ገንዘብ ላኩ', 'ብር ላክ', 'ብር ላኩ', 'ላኩልኝ', 'ላክልኝ', 'አስተላልፍ', 'ብድር', 'አበድር', 'ቅድሚያ ክፍያ', 'ቅድሚያ ስጡ', 'ሂሳቤን ቀይር', 'አካውንቴን ቀይር', 'ክፈሉልኝ', 'ክፈልልኝ');
const otherPersonWords = words('የባለቤቴ', 'የባሌ', 'የሚስቴ', 'የጎረቤቴ', 'የወንድሜ', 'የእህቴ', 'የአባቴ', 'የእናቴ', 'የልጄ', 'የሌላ', 'ሌላ አባል', 'ሌላ ሰው', 'የእሱ', 'የእሷ', 'የእነሱ');
const stopWords = words('አትደው', 'አይደው', 'አይደወል', 'እንዳትደው', 'እንዳይደው', 'እንዳይደወል', 'መደወል አቁ', 'መደወል ተዉ', 'መደወሉን አቁ', 'ጥሪ አቁ', 'ጥሪውን አቁ', 'ጥሪ አልፈልግ');
const disputeWords = words('ልክ አይደለም', 'ትክክል አይደለም', 'ስህተት', 'ተሳስቷል', 'ተሳስታችኋል', 'ቅሬታ', 'አልደረሰኝም', 'አልተቀበልኩም', 'አልገባልኝም', 'ጎድሏል');
const staffWords = words('ሠራተኛ', 'ሰው አገናኙኝ', 'ሰው ያነጋግረኝ', 'ጽሕፈት ቤት', 'ኃላፊ', 'ጸሐፊ');
const repeatWords = words('ድገም', 'ድገሚ', 'ድገሙ', 'እንደገና', 'ደግመህ', 'ደግመሽ');
const endWords = words('ይበቃል', 'በቃኝ', 'ይበቃኛል', 'ደህና ሁን', 'ደህና ሁኚ', 'ደህና ሁኑ', 'ቻው', 'ጨርሻለሁ');
const paymentWords = words('ክፍያ', 'ብር', 'ገንዘብ', 'ተከፈለ', 'ተከፍሏል', 'ከፈላችሁ', 'ባንክ', 'ስንት ደረሰ');
const deliveryWords = words('ርክክ', 'አስረከ', 'አስረክ', 'ያስረከ', 'ማስረከ', 'መጠን', 'ስንት ጊዜ', 'ምን ያህል', 'ስንት');
const thanksWords = words('አመሰግናለሁ', 'እግዚአብሔር ይስጥልኝ');
const noWords = words('አይደለም', 'አይደለሁም', 'ተሳስተዋል', 'አላውቀውም', 'አላውቃትም');
const noShort = words('አይ', 'አይይ', 'የለም');
const isNo = (text) => has(text, noWords) || hasWord(text, noShort);
const yesWords = words('አዎ', 'አዎን', 'እሺ', 'ነኝ', 'ትክክል', 'ልክ ነው', 'እኔ ነኝ');
const digitRun = /[0-9፩-፼](?:[\s-]?[0-9፩-፼]){3,}/u;
const digitSpan = /[0-9፩-፼](?:[\s-]?[0-9፩-፼])+/gu;
const digitWords = new Set(words('ዜሮ', 'አንድ', 'ሁለት', 'ሦስት', 'አራት', 'አምስት', 'ስድስት', 'ሰባት', 'ስምንት', 'ዘጠኝ'));
const mask = '[ቁጥር ተሰርዟል]';
function wordRuns(text, least, replace) {
    const out = [];
    let run = [], found = false;
    const flush = () => {
        if (run.length >= least) {
            found = true;
            out.push(replace ? mask : run.join(' '));
        }
        else
            out.push(...run);
        run = [];
    };
    for (const token of text.split(/\s+/u)) {
        if (digitWords.has(normalizeAm(token)))
            run.push(token);
        else {
            flush();
            out.push(token);
        }
    }
    flush();
    return { found, text: out.join(' ') };
}
export const looksSecret = (text) => digitRun.test(text) || wordRuns(text, 4, false).found || has(normalizeAm(text), secretWords);
export const redact = (text) => wordRuns(text, 3, true).text.replace(digitSpan, mask);
export function matchIntent(raw, stage) {
    if (looksSecret(raw))
        return 'secret';
    const text = normalizeAm(raw);
    if (!text)
        return 'unknown';
    if (has(text, stopWords))
        return 'stop_calls';
    if (stage === 'confirm') {
        if (isNo(text))
            return 'no';
        if (has(text, yesWords))
            return 'yes';
        return has(text, endWords) ? 'goodbye' : 'unknown';
    }
    if (has(text, moneyWords))
        return 'money_request';
    if (has(text, otherPersonWords))
        return 'other_person';
    if (has(text, disputeWords))
        return 'dispute';
    if (has(text, staffWords))
        return 'staff';
    if (has(text, repeatWords))
        return 'repeat';
    if (has(text, endWords))
        return 'goodbye';
    if (has(text, paymentWords))
        return 'payment';
    if (has(text, deliveryWords))
        return 'deliveries';
    if (has(text, thanksWords))
        return 'goodbye';
    if (isNo(text))
        return 'no';
    if (has(text, yesWords))
        return 'yes';
    return 'unknown';
}
export function keyIntent(key, stage) {
    if (stage === 'confirm')
        return key === '1' ? 'yes' : key === '2' ? 'no' : 'unknown';
    return { '1': 'deliveries', '2': 'payment', '3': 'repeat', '0': 'staff', '9': 'goodbye' }[key] ?? 'unknown';
}
