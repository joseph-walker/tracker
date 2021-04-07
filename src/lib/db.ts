import Dexie from 'dexie';

import type { Emotion } from './emotions';

export interface Event {
    id?: number;
    emotions: Emotion[];
    date: Date;
}

class Database extends Dexie {
    events: Dexie.Table<Event, Required<Event>["id"]>;

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
        date: new Date()
    });
});
