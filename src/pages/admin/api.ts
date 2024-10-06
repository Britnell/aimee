import type { APIRoute } from "astro";
import * as db from "../../aime/db";
import {
  generateAdminPrompt,
  getSqlQuery,
  pipe,
  queryCoder,
} from "../../aime/aime";

export const prerender = false;

const print = (x) => {
  console.log(x);
  return x;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.json();
    if (!form.query) throw new Error(" no query");
    console.log(form.query);

    const Qone = await pipe(form.query, generateAdminPrompt, queryCoder);
    const sql = getSqlQuery(Qone);
    if (!sql) {
      console.log({ Qone });
      throw new Error(" no cmd?");
    }
    console.log({ sql });
    const data = db.query(sql);
    console.log(" Rows returned : ", data.length);

    return new Response(
      JSON.stringify({
        data,
        sql,
        reply: Qone,
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
