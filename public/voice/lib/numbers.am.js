import { Decimal } from 'decimal.js';
const ones = ['', 'አንድ', 'ሁለት', 'ሦስት', 'አራት', 'አምስት', 'ስድስት', 'ሰባት', 'ስምንት', 'ዘጠኝ'];
const tens = ['', 'አሥር', 'ሃያ', 'ሠላሳ', 'አርባ', 'ሃምሳ', 'ስልሳ', 'ሰባ', 'ሰማንያ', 'ዘጠና'];
const scales = [[1000000000n, 'ቢሊዮን'], [1000000n, 'ሚሊዮን'], [1000n, 'ሺህ']];
const months = ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'];
function belowThousand(value) {
    const parts = [];
    const hundreds = Math.floor(value / 100), rest = value % 100;
    if (hundreds)
        parts.push(ones[hundreds], 'መቶ');
    const ten = Math.floor(rest / 10), one = rest % 10;
    if (ten === 1 && one)
        parts.push('አሥራ', ones[one]);
    else {
        if (ten)
            parts.push(tens[ten]);
        if (one)
            parts.push(ones[one]);
    }
    return parts.join(' ');
}
export function integerAm(value) {
    let rest = BigInt(value);
    if (rest < 0n || rest >= 1000000000000n)
        throw new RangeError('Number outside the spoken range');
    if (rest === 0n)
        return 'ዜሮ';
    const parts = [];
    for (const [size, name] of scales) {
        const count = rest / size;
        if (count)
            parts.push(belowThousand(Number(count)), name);
        rest %= size;
    }
    if (rest)
        parts.push(belowThousand(Number(rest)));
    return parts.join(' ');
}
export function quantityAm(value) {
    const amount = new Decimal(value);
    if (!amount.isFinite() || amount.isNegative())
        throw new RangeError('Quantity must be zero or more');
    const [whole, fraction] = amount.toFixed().split('.');
    const spoken = integerAm(BigInt(whole));
    return fraction ? spoken + ' ነጥብ ' + [...fraction].map(digit => digit === '0' ? 'ዜሮ' : ones[Number(digit)]).join(' ') : spoken;
}
export function moneyAm(value) {
    const amount = new Decimal(value);
    if (!amount.isFinite() || amount.isNegative())
        throw new RangeError('Amount must be zero or more');
    const [birr, santim] = amount.toFixed(2).split('.');
    const cents = Number(santim);
    if (birr === '0' && cents)
        return integerAm(cents) + ' ሳንቲም';
    return integerAm(BigInt(birr)) + ' ብር' + (cents ? ' ከ' + integerAm(cents) + ' ሳንቲም' : '');
}
export function moneyDigits(value) {
    return new Decimal(value).toFixed(2) + ' ብር';
}
export function toEthiopian(isoDate) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
    if (!match)
        throw new RangeError('Expected a YYYY-MM-DD date');
    const [year, month, day] = match.slice(1).map(Number);
    const a = Math.floor((14 - month) / 12), y = year + 4800 - a, m = month + 12 * a - 3;
    const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    const since = jdn - 1723856, r = since % 1461, n = r % 365 + 365 * Math.floor(r / 1460);
    return {
        year: 4 * Math.floor(since / 1461) + Math.floor(r / 365) - Math.floor(r / 1460),
        month: Math.floor(n / 30) + 1, day: n % 30 + 1
    };
}
export function dateAm(isoDate, spoken) {
    const { month, day } = toEthiopian(isoDate);
    return months[month - 1] + ' ' + (spoken ? integerAm(day) : String(day));
}
