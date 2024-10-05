import Db from "better-sqlite3";

export const db = new Db("store.db");

export const schema = `
CREATE TABLE Event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    time TEXT,
    title TEXT NOT NULL,
    description TEXT
);
`;

export const query = (sql: string) => {
  const stmt = db.prepare(sql);
  try {
    return stmt.all();
  } catch (e) {
    return stmt.run();
  }
};

// db.exec(schema);
