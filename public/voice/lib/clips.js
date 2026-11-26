import { everyUtterance } from "./script.am.js";
export async function clipId(speech) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(speech));
    return [...new Uint8Array(digest)].slice(0, 8).map(byte => byte.toString(16).padStart(2, '0')).join('');
}
export function demoSpeech(members) {
    return [...new Set(members.flatMap(member => everyUtterance(member.record).map(utterance => utterance.speech)))];
}
