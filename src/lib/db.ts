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
        emotions: ["aggravated", "puzzled"],
        note: "This is the placeholder entry. Lorem ipsum dolor sit amet.",
        date: new Date()
    });
});
