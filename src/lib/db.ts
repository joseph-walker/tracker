import Dexie from 'dexie';

import type { Emotion } from './emotions';

export interface EmotionEvent {
    id?: number;
    emotions: Emotion[];
    date: Date;
    note?: string;
}

class Database extends Dexie {
    events: Dexie.Table<EmotionEvent, Required<EmotionEvent>["id"]>;

    constructor() {
        super("EmotionTracker");

        this.version(1).stores({
            events: "++id, date"
        });
    }
}

export const db = new Database();

db.open().catch(function (reason) {
    throw new Error(reason);
});

db.on("populate", function () {
    db.events.add({
        emotions: ["excited", "glad"],
        note: "Today I was excited and glad because I decided to start tracking my feelings. :)",
        date: new Date()
    });
});
