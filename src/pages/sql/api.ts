import type { APIRoute } from "astro";
import * as db from "../../aime/db";
import {
  generateSQLprompt,
  generateSummaryPrompt,
  getSqlQuery,
  pipe,
  queryCoder,
  queryMlx,
  queryOllama,
} from "../../aime/aime";

export const prerender = false;

const print = (x: any) => {
  console.log(x);
  return x;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.json();
    if (!form.query) throw new Error(" no query");
    console.log(form.query);

    const Qone = await pipe(
      form.query,
      generateSQLprompt,
      // print,
      queryOllama("deepseek-coder-v2:latest")
    );
    const sql = getSqlQuery(Qone);
    if (!sql) {
      console.log({ Qone });
      throw new Error(" no cmd?");
    }
    console.log({ sql });
    const data = db.query(sql);
    console.log(" Rows returned : ", data.length);

    const Qtwo = await pipe(
      {
        query: form.query,
        data: JSON.stringify(data),
      },
      generateSummaryPrompt,
      queryOllama("llama3.2:3b")
    );
    console.log("q2");
    console.log({ Qtwo });

    return new Response(
      JSON.stringify({
        data,
        reply: Qtwo,
      }),
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log(e);
    return new Response(`{ error: ${e} }`, {
      status: 200,
    });
  }
};
