import type { APIRoute } from "astro";
import * as db from "../../aime/db";
import {
  generatePrompt,
  generateSQLprompt,
  generateSummaryPrompt,
  getSqlQuery,
  pipe,
  queryMlx,
  queryOllama,
} from "../../aime/aime";
import { queryClaude } from "../../aime/claude";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.json();
    if (!form.query) throw new Error(" no query");

    console.log(form.query);

    const Qone = await pipe(
      form.query,
      generateSQLprompt,
      // (x)=>{ console.log(x); return x; }
      queryClaude
    );
    console.log({ Qone });

    const sql = getSqlQuery(Qone);
    if (!sql) throw new Error(" no cmd?");
    console.log({ sql });

    const data = db.query(sql);
    console.log(" Data rows : ", data, data.length);

    const Qtwo = await pipe(
      {
        query: form.query,
        data: JSON.stringify(data),
      },
      generateSummaryPrompt,
      queryClaude
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
