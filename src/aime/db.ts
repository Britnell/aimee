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

export const getSchema = () => {
  const res = db
    .prepare(`SELECT sql FROM sqlite_master WHERE type='table';`)
    .all();
  return res
    .map((row: { sql: string }) => row.sql)
    .filter((sql: string) => !sql.includes("sqlite_sequence"))
    .join("\n");
};
// db.exec(schema);
