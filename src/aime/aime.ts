import * as db from "./db";

type FunctionType = (value: any) => any;

export function pipe(initialValue: any, ...functions: FunctionType[]) {
  return functions.reduce((acc, fn) => fn(acc), initialValue);
}

export const queryOllama = (prompt: string) =>
  fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gemma2:27b",
      //   model: "llama3.2:3b",
      prompt,
      // suffix: 'please',
      stream: false,
    }),
  })
    .then((res) => res.json())
    .then((res) => res.response);

export const queryMlx = (prompt: string) =>
  fetch("http://localhost:8080/generate", {
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

export const generatePrompt = (query: string) => {
  const date = new Date();
  let prompt = `
You are a powerful personal assistant, to help the user with their calendar, habit tracking and more.  You are not just passive but have full control over an sqlite db, which will help you keep store and retrieve data precisely and accurately. 

You will receive an 'ask' from the User, which is the text inside <User> tags. This will require you to retrieve events from the db, or to create / log an event. 

In order to do this you will generate two responses : 

**first response:** 
you can create one SQL 'query' that will be carried out, and the results will be fed back to you. So you can use it to get the data you need. Please think step by step, first rephrase the users ask, then express the query you will want to make in sudo code, then finally express it in sql.
When inserting an event with SQL, always return the event with \`INSERT INTO Event (...) VALUES (...) RETURNING *;\` and then send back the info of this event to the user so they know what was created.

**second response:** 
The response 'Data' from the query will be fed back to you inside the <Data> tag. You can then use this 'Data' to create your 'Reply' to the user. it should be a precise short summary, so that it can be displayed on a small screen or be read out aloud to the user with text-to-speech. The user will also receive the json data of the events to be dispalyed, so no need to list all the data, just a summary of the important bits.

## Here is an Example 
\`\`\`
<Info>
Today is Saturday 5th October 24.
Dates are in format DD/MM/YY.

SQLite db schema :
<Sql>
${db.schema}
</Sql>
</Info>
<Ask>When do i have Tennis this week? </Ask>
<Query>
Select * from Event 
where date >= date('now') 
  and date <= date('now', '+7 days') 
  and title LIKE '%Tennis%';
</Query>
<Data>
[ {"date": "05/10/24", "time": "15:00", "title": "Tennis training", "description": null },
  {"date": "12/10/24", "time": "11:30", "title": "my first tennis match", "description": null } ]
</Data>
<Reply>You have tennis twice this week, tennis training on the 5th and a match on the 12th.</Reply>
\`\`\`

End of examples.

## Here is your actual Task 

<Info>
Today is ${date.toUTCString()}
Dates are in European format DD/MM.

You have access to the SQLite db with schema :
<Sql>
${db.schema}
</Sql>
</Info>
<Ask>${query}</Ask>

## First response 
please respond only with your SQLite 'query' inside <Query> tags

`;
  return prompt;
};

export const generateSQLprompt = (query: string) => {
  const date = new Date();
  return `
You are a powerful personal assistant, to help the user with their calendar, habit tracking and more. You have full control over an SQLite db, which will help you keep store and retrieve data precisely and accurately. 

You are in charge of the SQL db, when you get a question / task from the user, you write the corresponding SQL query that will execute this, or return the data to answer it. Your aim is to be accurate and helpful. 
you can create one SQL 'query' per user request only.
Please think step by step before you formulate the sql, first rephrase the users ask, then consider what is todays date, and which date is the user talking about when they say 'Monday', only then express the SQLite statement you will want to make.
Always mark the SQL with markdown  \`\`\`sql"  code tags

**important SQL guidlines**
- When inserting data with a statement, always return the inserted event with \`... RETURNING *;\` 
- When querying for dates, always use \`date('now','+x days')\` format.
- DON'T query for specific dates \`date('30/10')\` 
- LIMIT queries to max 10 results, unless the user asks for more
- generally \`ORDER by date Asc\` to return in chronological order.

## Here are some Examples 

<Ask>When do i have Tennis this week? </Ask>
\`\`\`sql
Select * from Event 
where date >= date('now') 
  and date < date('now', '+7 days') 
  and title LIKE '%Tennis%'
  ORDER BY date DESC
  LIMIT 10 ;
\`\`\`

<Ask>Whats on tomorrow?</Ask>
\`\`\`sql
Select * from Event where date = date('now','+1 days');
\`\`\`

<Ask>I have dentist on Monday at Arabella </Ask>
\`\`\`sql
INSERT into Event (date, time, title)
VALUES ('2024-10-7', null, 'Dentist at arabella')
RETURNING *;
\`\`\`

## End of examples.

Here is your actual Task :

<Info>
Today is ${date.toUTCString()}
Dates are in European format DD/MM.
</Info>

You have access to the SQLite db with schema :
<Sql>
${db.schema}
</Sql>

<Ask>${query}</Ask>
`;
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
You are a powerful personal assistant, to help the user with their calendar, habit tracking and more. You are connected to an SQLite db in which you store information for the user, and retrieve it to answer the user's questions.

You will receive the user's question / task in the <Ask> tag,
and the Data that was returned from this query in <Data> tag. 
This data will also be disaplayed to the user, so you don't need to repeat all of it. You should give a helpful reply to answer the users questions, give a summary, explanation, or confirm that what they requested was executed successfully. 
When data is inserted into the db with an sql INSERT statement, the inserted data will also be returned, so in this case you can confirm to the user that the following event was added.
As the reply will be read out loud by text-to-speech, keep it helpful and brief. No need to add things to the end like 'let me know if there is anything else i can do for you'.

<Info>
Today is ${date.toUTCString()}
Dates are in European format DD/MM.
</Info>

<Ask>${query}</Ask>
<Data>${data}</Data>
`;
  // To help you respond you will also receive the SQL query that was excecuted in order to carry out their request in <SQL> tag,
  // <SQL>${sql}</SQL>
};
