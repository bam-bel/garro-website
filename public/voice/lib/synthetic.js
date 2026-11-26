const dairy = { tenantId: 'demo-tenant-1', cooperativeName: 'ሙከራ የወተት ማኅበር' };
const coffee = { tenantId: 'demo-tenant-2', cooperativeName: 'ሙከራ የቡና አምራቾች ማኅበር' };
const period = { startsOn: '2026-11-10', endsOn: '2026-11-19' };
const milk = (quantity, count) => ({ commodityNameAm: 'ጥሬ ወተት', unit: 'L', quantity, count });
export const demoMembers = [
    { voiceConsent: true, note: 'Paid by the bank',
        record: { source: 'synthetic', memberId: 'demo-1', ...dairy, memberName: 'አበበ ከበደ', period, deliveries: [milk('118.500', 9)], payment: { state: 'paid', amount: '6162.00' } } },
    { voiceConsent: true, note: 'Payment instruction sent, bank has not confirmed',
        record: { source: 'synthetic', memberId: 'demo-2', ...dairy, memberName: 'ጫልቱ ዲሪባ', period, deliveries: [milk('83.000', 8)], payment: { state: 'sent_to_bank', amount: '4350.50' } } },
    { voiceConsent: true, note: 'Bank could not pay',
        record: { source: 'synthetic', memberId: 'demo-3', ...dairy, memberName: 'ደስታ ታደሰ', period, deliveries: [milk('40.250', 5)], payment: { state: 'failed', amount: '2093.00' } } },
    { voiceConsent: true, note: 'Another sector: two products, payment being prepared',
        record: { source: 'synthetic', memberId: 'demo-4', ...coffee, memberName: 'ሙሉ ገብሬ', period,
            deliveries: [{ commodityNameAm: 'ቀይ እሸት ቡና', unit: 'kg', quantity: '212.000', count: 4 }, { commodityNameAm: 'ማር', unit: 'kg', quantity: '15.500', count: 1 }],
            payment: { state: 'preparing', amount: '18240.75' } } },
    { voiceConsent: true, note: 'No period closed yet',
        record: { source: 'synthetic', memberId: 'demo-5', ...dairy, tenantId: 'demo-tenant-3', memberName: 'ቶሎሳ ጉተማ', period: null, deliveries: [milk('12.000', 2)], payment: { state: 'period_open', amount: null } } },
    { voiceConsent: false, note: 'No consent for calls: the agent must refuse to call',
        record: { source: 'synthetic', memberId: 'demo-6', ...dairy, memberName: 'ሀና ተስፋዬ', period, deliveries: [milk('61.000', 7)], payment: { state: 'paid', amount: '3172.00' } } }
];
