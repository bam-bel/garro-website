import { Decimal } from 'decimal.js';
import { dateAm, integerAm, moneyAm, moneyDigits, quantityAm } from "./numbers.am.js";
export const scriptVersion = 'voice-am-draft-1';
const units = new Map([
    ['l', 'ሊትር'], ['ml', 'ሚሊሊትር'], ['g', 'ግራም'], ['kg', 'ኪሎግራም'], ['t', 'ቶን'], ['piece', 'ፍሬ']
]);
export function unitAm(unit) {
    const trimmed = unit.trim();
    return /^[\p{Script=Ethiopic} ]+$/u.test(trimmed) ? trimmed : units.get(trimmed.toLowerCase()) ?? null;
}
const fixed = (text) => () => text;
const lines = {
    greeting: (cooperative, name) => () => `ጤና ይስጥልኝ። ይህ ከ${cooperative} የተደወለ ራስ-ሰር የመረጃ ጥሪ ነው። ከ${name} ጋር ነው የምነጋገረው? አዎ ከሆነ አንድን፣ አይደለም ከሆነ ሁለትን ይጫኑ፤ ወይም አዎ ወይም አይደለም ይበሉ።`,
    confirmRetry: (name) => () => `ይቅርታ፣ አልሰማሁዎትም። ${name} ነዎት? አዎ ከሆነ አንድን፣ አይደለም ከሆነ ሁለትን ይጫኑ።`,
    wrongPerson: fixed('ይቅርታ፣ ስለረበሽኩዎ። መልካም ቀን ይሁንልዎ።'),
    notConfirmed: fixed('ማንነትዎን ማረጋገጥ ስላልቻልኩ መረጃውን መናገር አልችልም። እባክዎ የማኅበሩን ጽሕፈት ቤት ያነጋግሩ። መልካም ቀን ይሁንልዎ።'),
    period: (startsOn, endsOn) => spoken => `ከ${dateAm(startsOn, spoken)} እስከ ${dateAm(endsOn, spoken)} ባለው የክፍያ ጊዜ፦`,
    noPeriod: fixed('ገና የተዘጋ የክፍያ ጊዜ የለም። እስካሁን የተመዘገበው፦'),
    noDeliveries: fixed('የተመዘገበ ርክክብ የለም።'),
    delivery: (item, unit) => spoken => {
        const count = spoken ? integerAm(item.count) : String(item.count);
        const quantity = spoken ? quantityAm(item.quantity) : new Decimal(item.quantity).toFixed();
        return `${item.commodityNameAm}፦ ${count} ጊዜ አስረክበዋል፤ ጠቅላላ ${quantity} ${unit}።`;
    },
    deliveryCountOnly: (item) => spoken => `${item.commodityNameAm}፦ ${spoken ? integerAm(item.count) : String(item.count)} ጊዜ አስረክበዋል።`,
    paymentPeriodOpen: fixed('የዚህ ጊዜ ሂሳብ ገና አልተዘጋም፤ ክፍያው ገና አልተሰላም።'),
    paymentNothingDue: fixed('በዚህ ጊዜ የሚከፈልዎ ክፍያ አልተመዘገበም።'),
    paymentPreparing: (amount) => spoken => amount
        ? `ክፍያዎ ${spoken ? moneyAm(amount) : moneyDigits(amount)} ነው። ማኅበሩ እያዘጋጀው ነው፤ ገና ወደ ባንክ አልተላከም።`
        : 'ክፍያዎን ማኅበሩ እያዘጋጀው ነው፤ ገና ወደ ባንክ አልተላከም።',
    paymentSent: (amount) => spoken => `ክፍያዎ ${spoken ? moneyAm(amount) : moneyDigits(amount)} ነው። የክፍያ መመሪያው ወደ ባንክ ተልኳል፤ ባንኩ ገና አላረጋገጠም።`,
    paymentPaid: (amount) => spoken => `${spoken ? moneyAm(amount) : moneyDigits(amount)} በባንክ ተከፍሎዎታል።`,
    paymentFailed: fixed('ባንኩ ክፍያዎን መፈጸም አልቻለም። የማኅበሩ ሠራተኞች እየተከታተሉት ነው። እባክዎ ጽሕፈት ቤቱን ያነጋግሩ።'),
    menu: fixed('ስለ ርክክብዎ እንደገና ለመስማት አንድን፣ ስለ ክፍያዎ ሁለትን ይጫኑ፤ ወይም በቃልዎ ይጠይቁ። ለመጨረስ ዘጠኝን ይጫኑ።'),
    unknown: fixed('ይቅርታ፣ አልገባኝም። ስለ ርክክብዎ አንድን፣ ስለ ክፍያዎ ሁለትን፣ ሁሉንም ለመድገም ሦስትን፣ የማኅበሩ ሠራተኛ እንዲያነጋግርዎ ዜሮን፣ ለመጨረስ ዘጠኝን ይጫኑ።'),
    ownRecordOnly: fixed('ስለ እርስዎ ርክክብና ክፍያ ብቻ ነው መናገር የምችለው። ስለ ሌላ ሰው መረጃ መስጠት አልችልም።'),
    noMoney: fixed('እኔ መረጃ ብቻ ነው የማነበው። ገንዘብ መላክ፣ ብድር መስጠት ወይም የክፍያ መመሪያ መቀበል አልችልም። ለዚህ የማኅበሩን ጽሕፈት ቤት ያነጋግሩ።'),
    noSecrets: fixed('እባክዎ የሚስጥር ቁጥርዎን፣ የይለፍ ቃልዎን ወይም የባንክ ሂሳብ ቁጥርዎን በስልክ ለማንም አይንገሩ። ማኅበሩ በስልክ በፍጹም አይጠይቅዎትም።'),
    outOfScope: fixed('ይህን ጥያቄ መመለስ አልችልም። ስለ ርክክብዎና ስለ ክፍያዎ ብቻ ነው መረጃ ያለኝ።'),
    staff: fixed('ጥያቄዎ ለማኅበሩ ሠራተኞች ተመዝግቧል። ጽሕፈት ቤቱንም በአካል ማነጋገር ይችላሉ።'),
    dispute: fixed('መዝገቡን መቀየር አልችልም። ቅሬታዎ ለማኅበሩ ሠራተኞች ተመዝግቧል፤ እነሱ ያጣሩታል።'),
    stopCalls: fixed('እሺ። ከእንግዲህ እንዳይደወልልዎ የጠየቁት ተመዝግቧል። መልካም ቀን ይሁንልዎ።'),
    goodbye: fixed('ስለ ጊዜዎ አመሰግናለሁ። መልካም ቀን ይሁንልዎ።'),
    limit: fixed('ለዛሬ ይበቃናል። ተጨማሪ ጥያቄ ካለዎ የማኅበሩን ጽሕፈት ቤት ያነጋግሩ። መልካም ቀን ይሁንልዎ።')
};
export const lineIds = Object.keys(lines);
export const personalLines = new Set(['greeting', 'confirmRetry', 'period', 'delivery', 'deliveryCountOnly',
    'paymentPreparing', 'paymentSent', 'paymentPaid']);
function utter(...pieces) {
    return {
        text: pieces.map(([, line]) => line(false)).join(' '),
        speech: pieces.map(([, line]) => line(true)).join(' '),
        lines: pieces.map(([id]) => id)
    };
}
const single = (id) => utter([id, lines[id]]);
function periodPiece(record) {
    return record.period ? ['period', lines.period(record.period.startsOn, record.period.endsOn)] : ['noPeriod', lines.noPeriod];
}
function deliveryPieces(record) {
    const items = record.deliveries.filter(item => item.count > 0);
    if (!items.length)
        return [['noDeliveries', lines.noDeliveries]];
    return items.map((item) => {
        const unit = unitAm(item.unit);
        return unit ? ['delivery', lines.delivery(item, unit)] : ['deliveryCountOnly', lines.deliveryCountOnly(item)];
    });
}
function paymentPiece({ payment }) {
    switch (payment.state) {
        case 'paid':
            if (payment.amount)
                return ['paymentPaid', lines.paymentPaid(payment.amount)];
            break;
        case 'sent_to_bank':
            if (payment.amount)
                return ['paymentSent', lines.paymentSent(payment.amount)];
            break;
        case 'preparing': return ['paymentPreparing', lines.paymentPreparing(payment.amount)];
        case 'failed': return ['paymentFailed', lines.paymentFailed];
        case 'period_open': return ['paymentPeriodOpen', lines.paymentPeriodOpen];
        case 'nothing_due': return ['paymentNothingDue', lines.paymentNothingDue];
    }
    return ['paymentPreparing', lines.paymentPreparing(null)];
}
export function everyUtterance(record) {
    return [say.greeting(record), say.confirmRetry(record), say.summary(record), say.deliveries(record), say.payment(record),
        say.wrongPerson(), say.notConfirmed(), say.unknown(), say.ownRecordOnly(), say.noMoney(), say.noSecrets(), say.outOfScope(),
        say.staff(), say.dispute(), say.stopCalls(), say.goodbye(), say.limit()];
}
export const say = {
    greeting: (record) => utter(['greeting', lines.greeting(record.cooperativeName, record.memberName)]),
    confirmRetry: (record) => utter(['confirmRetry', lines.confirmRetry(record.memberName)]),
    summary: (record) => utter(periodPiece(record), ...deliveryPieces(record), paymentPiece(record), ['menu', lines.menu]),
    deliveries: (record) => utter(periodPiece(record), ...deliveryPieces(record)),
    payment: (record) => utter(paymentPiece(record)),
    wrongPerson: () => single('wrongPerson'),
    notConfirmed: () => single('notConfirmed'),
    unknown: () => single('unknown'),
    ownRecordOnly: () => single('ownRecordOnly'),
    noMoney: () => single('noMoney'),
    noSecrets: () => single('noSecrets'),
    outOfScope: () => single('outOfScope'),
    staff: () => single('staff'),
    dispute: () => single('dispute'),
    stopCalls: () => single('stopCalls'),
    goodbye: () => single('goodbye'),
    limit: () => single('limit')
};
