// storage.ts
import {Subject, StudySession} from '../types';

let subjects: Subject[] = [];
let sessions: StudySession[] = [];

export const storageUtils = {
    async saveSubjects(newSubjects: Subject[]): Promise<void> {
        subjects = newSubjects;
        console.log('Subjects saved to memory:', subjects);
    },

    async loadSubjects(): Promise<Subject[]> {
        console.log('Loading subjects from memory:', subjects);
        return subjects;
    },

    async saveSessions(newSessions: StudySession[]): Promise<void> {
        sessions = newSessions;
        console.log('Sessions saved to memory:', sessions);
    },

    async loadSessions(): Promise<StudySession[]> {
        console.log('Loading sessions from memory:', sessions);
        return sessions;
    },
};