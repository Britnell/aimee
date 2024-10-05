import * as db from "./db";

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
    const match = str.match(/<Query>([\s\S]*?)<\/Query>/);
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
