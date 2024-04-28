import Dexie from 'dexie';

export const db = new Dexie('qbikeDB');
db.version(1).stores({
  widgets: 'id'
});

db.on("populate", () => {
    console.log("one time populate database");
    db.widgets.bulkAdd([
        { id: "hr", name: "bpm", top: 50, left: 50, color: "rgb(255, 204, 204)" },
        { id: "pw", name: "watt", top: 50, left: 250, color: "rgb(204, 230, 255)" },
        { id: "erg", name: "erg", top: 50, left: 450, color: "rgb(230, 204, 255)" },
        { id: "sp", name: "km/h", top: 50, left: 650, color: "rgb(204, 255, 204)" },
        { id: "ca", name: "rpm", top: 50, left: 850, color: "rgb(255, 235, 204)" },
    ]);
});