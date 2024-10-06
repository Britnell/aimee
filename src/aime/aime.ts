import * as db from "./db";

type FunctionType = (value: any) => any;

export function pipe(initialValue: any, ...functions: FunctionType[]) {
  return functions.reduce((acc, fn) => fn(acc), initialValue);
}

export const queryCoder = (prompt: string) =>
  queryOllama("deepseek-coder-v2:latest")(prompt);

export const queryOllama =
  (model: "deepseek-coder-v2:latest" | "gemma2:27b" | "llama3.2:3b") =>
  (prompt: string) =>
    fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        keep_alive: "1m",
      }),
    })
      .then((res) => res.json())
      .then((res) => res.response);

export const queryMlx = (path: string) => (prompt: string) =>
  fetch("http://localhost:8080" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
    .then((res) => res.json())
    .then((res) => res.response);

export const getSqlQuery = (str: string) => {
  try {
    // const match = str.match(/<Query>([\s\S]*?)<\/Query>/);
    const match = str.match(/```sql([\s\S]*?)```/);
    return match[1];
  } catch (e) {
    return null;
  }
};

export const generateSQLprompt = (query: string) => {
  const date = new Date();
  const schema = db.getSchema();

  return `
You are an advanced SQL query generator for a calendar and habit tracking system using SQLite. You can generate queries to store and retrieve user data from the db.

Important SQL Guidelines:
- one SQL query per user request
- Always mark the SQL with markdown  \`\`\`sql"  code tags
- Use 'RETURNING *;' for INSERT statements
- Use date('now', '+x days') for date queries
- LIMIT queries to 10 results unless specified otherwise
- ORDER BY date ASC for chronological order

## Here is an Example
User: When do i have Tennis this week? 
\`\`\`sql
Select * from Event 
where date >= date('now') 
  and date < date('now', '+7 days') 
  and title LIKE '%Tennis%'
  ORDER BY date DESC
  LIMIT 10 ;
\`\`\`


Current Information
- Today is ${date.toUTCString()}
- Date format DD/MM (European)

Database Schema:
${schema}

User Query: ${query}

Provide the SQL query to address the user's request.`;
};

export const generateSummaryPrompt = ({
  query,
  data,
}: {
  query: string;
  data: string;
  sql?: string;
}) => {
  const date = new Date();

  return `
Generate a concise, helpful response to the user's calendar/habit tracking query. Use the provided data without repeating it fully. Confirm successful insertions when applicable. Avoid unnecessary introductions or conclusions.

Today's date: ${date.toUTCString()}
Date format: DD/MM (European)

User Query: ${query}
Returned Data: ${data}

Provide a brief, informative response suitable for text-to-speech output.`;
};

export const generateAdminPrompt = (query: string) => {
  const schema = db.getSchema();
  console.log(schema);

  return `
You are an advanced SQL query generator for a flexible calendar and habit tracking system using SQLite. You are the admin in charge of the application. If the user requests a new feature then you can implement this by modifying the sql Table schema.
  
Schema Modification Rules:
- You can ADD new columns to existing tables
- You can modify column constraints (e.g., making a column nullable)
- NEVER remove or drop columns or tables
- Create new tables only when absolutely necessary, generally a users request for new capabilities should be carried out with current schema if possible
- hence you are allowed to deny unreasonable requests, that are not in the scope of the applicaiton
- when modifying the table : Explain the rationale for the change & consider data integrity and potential impact
- You can not perform any data migration steps, so you can only make changes that you can make safely with just one SQL query.


Database Schema:
${schema}

User Query: ${query}

Provide the SQL query to address the user's request.`;
};
