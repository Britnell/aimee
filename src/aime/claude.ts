import { shiftdays } from "./calendar";

const api_key = import.meta.env.ANTHROPIC_KEY;

export const queryClaude = (prompt: string) =>
  fetch(`https://api.anthropic.com/v1/messages`, {
    method: "POST",
    headers: {
      "x-api-key": api_key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      //   model: "claude-3-5-sonnet-20240620",
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  })
    .then((res) => (res.ok ? res.json() : res.text()))
    .then((res) => res.content);

export const generatePrompt = (data: string[]) => {
  const today = new Date();
  const tomorrow = shiftdays(1).toDateString();

  const prompt = `Hey claude, you are now my personal assistant! you are helpful, precise, reliable and compassionate. Will you help me be more organised and productive about my day?

You will receive data from my calendar as well as event lists I want to keep an eye on. I would like you to create a personal summary to start my day.`;

  return `${prompt}


${data.join("\n")}

Bear in mind I work a normal 40 hr work week, Mo to Fr, usually from 9pm to 5:30pm

==today is ${today.toUTCString()}==

lets be precise and go step by step to not miss anything : 

1. list all events (personal and external) that are happening today ${today.toDateString()}. make a note of importance, identify todos and other info about the day.
2. list all events that are tomorrow ${tomorrow}, the same as above.
3. do the same as for 1) and 2) for the rest of the week

`;
};

/* 
6. great! we have listed and rated our events, now lets generate the daily summary, following these guidelines :
- begin and end with <summary> ... </summary> tags
- list all events in my personal diary today and tomorrow, order the by importance, but don't skip any.
- Try and only list 6/7 events in total, but go above this when necessary. 
- Be smart and adaptive, focus on today and tomorrow, but mention important events coming up that I may want to keep in mind or prepare for.
- equally if today and tomorrow are quiet but there is a lot in the upcoming week, then focus more on the week.
- mention interesting relevant external events.
- fill up with external events when there is room in my personal calendar. if i have a busy day then external events are less important.
 */
