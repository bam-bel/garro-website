import { openCall, respond } from "./dialogue.js";
import { keyIntent, matchIntent, redact } from "./intents.js";
import { scriptVersion } from "./script.am.js";
import { demoMembers } from "./synthetic.js";
export function createLocalApi(members = demoMembers) {
    const consent = new Map(members.map(member => [member.record.memberId, member.voiceConsent]));
    const log = [];
    let session = null, count = 0;
    const voiced = (step) => ({ say: { text: step.say.text, spoken: step.say.speech, lines: step.say.lines }, audio: null,
        speech_failed: false, ended: step.ended, outcome: step.state.outcome, flags: step.state.flags, stage: step.state.stage });
    return async (path, options = {}) => {
        if (path === '/status') {
            return { status: 200, body: { speech: false, static: true, script_version: scriptVersion,
                    members: members.map(({ record, note }) => ({ id: record.memberId, name: record.memberName, cooperative: record.cooperativeName,
                        consent: consent.get(record.memberId) === true, note })), log } };
        }
        let body = null;
        try {
            body = typeof options.body === 'string' ? JSON.parse(options.body) : null;
        }
        catch {
            body = null;
        }
        if (path === '/calls') {
            const member = members.find(item => item.record.memberId === body?.member_id);
            if (!member)
                return { status: 404, body: { error: 'Unknown member' } };
            if (consent.get(member.record.memberId) !== true)
                return { status: 409, body: { refused: 'no_voice_consent' } };
            const step = openCall(member.record);
            session = { id: 'local-' + ++count, record: member.record, state: step.state };
            return { status: 201, body: { call_id: session.id, ...voiced(step) } };
        }
        const turn = /^\/calls\/([^/]+)\/turns$/.exec(path);
        if (!turn)
            return { status: 404, body: { error: 'Not found' } };
        if (!session || session.id !== turn[1])
            return { status: 404, body: { error: 'Call not found or already ended' } };
        const key = typeof body?.key === 'string' && /^[0-9]$/.test(body.key) ? body.key : null;
        const text = typeof body?.text === 'string' ? body.text.trim().slice(0, 300) : '';
        if (!key && !text)
            return { status: 400, body: { error: 'Send text or one key' } };
        const heard = key ? { transcript: key, intent: keyIntent(key, session.state.stage), via: 'keypad' }
            : { transcript: redact(text), intent: matchIntent(text, session.state.stage), via: 'text' };
        const step = respond(session.record, session.state, heard.intent);
        session.state = step.state;
        if (step.ended) {
            const { record, state } = session;
            session = null;
            if (state.outcome)
                log.unshift({ member: record.memberName, outcome: state.outcome, flags: state.flags, turns: state.turns });
            log.length = Math.min(log.length, 50);
            if (state.outcome === 'opted_out')
                consent.set(record.memberId, false);
        }
        return { status: 200, body: { heard, ...voiced(step), log } };
    };
}
