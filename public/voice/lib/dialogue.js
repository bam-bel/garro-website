import { say } from "./script.am.js";
export const limits = { confirmTries: 2, unknownStreak: 2, questionTurns: 8 };
const flag = (state, added) => state.flags.includes(added) ? state.flags : [...state.flags, added];
const end = (state, outcome, utterance, flags = state.flags) => ({ state: { ...state, stage: 'ended', outcome, last: utterance, flags }, say: utterance, ended: true });
const stay = (state, utterance, changes = {}) => ({ state: { ...state, unknownStreak: 0, ...changes, last: utterance }, say: utterance, ended: false });
export function openCall(record) {
    const greeting = say.greeting(record);
    return { state: { stage: 'confirm', confirmTries: 0, unknownStreak: 0, turns: 0, last: greeting, flags: [], outcome: null },
        say: greeting, ended: false };
}
export function respond(record, state, intent) {
    if (state.stage === 'ended')
        throw new Error('Call already ended');
    if (intent === 'stop_calls')
        return end(state, 'opted_out', say.stopCalls(), flag(state, 'opt_out_requested'));
    if (state.stage === 'confirm') {
        if (intent === 'yes')
            return stay(state, say.summary(record), { stage: 'questions' });
        if (intent === 'no')
            return end(state, 'wrong_person', say.wrongPerson());
        if (intent === 'goodbye')
            return end(state, 'not_confirmed', say.goodbye());
        const tries = state.confirmTries + 1;
        const flags = intent === 'secret' ? flag(state, 'secret_offered') : state.flags;
        if (tries >= limits.confirmTries)
            return end({ ...state, confirmTries: tries }, 'not_confirmed', say.notConfirmed(), flags);
        return stay(state, intent === 'secret' ? say.noSecrets() : say.confirmRetry(record), { confirmTries: tries, flags });
    }
    const turns = state.turns + 1;
    const counted = { ...state, turns };
    if (intent === 'goodbye' || intent === 'no')
        return end(counted, 'completed', say.goodbye());
    if (turns > limits.questionTurns)
        return end(counted, 'turn_limit', say.limit());
    switch (intent) {
        case 'secret': return stay(counted, say.noSecrets(), { flags: flag(state, 'secret_offered') });
        case 'deliveries': return stay(counted, say.deliveries(record));
        case 'payment': return stay(counted, say.payment(record));
        case 'repeat': return stay(counted, say.summary(record));
        case 'staff': return stay(counted, say.staff(), { flags: flag(state, 'staff_follow_up') });
        case 'dispute': return stay(counted, say.dispute(), { flags: flag(state, 'dispute') });
        case 'other_person': return stay(counted, say.ownRecordOnly(), { flags: flag(state, 'asked_about_other_person') });
        case 'money_request': return stay(counted, say.noMoney(), { flags: flag(state, 'money_request') });
        case 'out_of_scope': return stay(counted, say.outOfScope());
        default: {
            const streak = state.unknownStreak + 1;
            if (streak >= limits.unknownStreak)
                return end({ ...counted, unknownStreak: streak }, 'not_understood', say.limit());
            return stay(counted, say.unknown(), { unknownStreak: streak });
        }
    }
}
