import type { APIRoute } from "astro";
import * as db from "../../aime/db";
import {
  generatePrompt,
  getSqlQuery,
  queryMlx,
  queryOllama,
} from "../../aime/aime";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.json();
    if (!form.query) throw new Error(" no query");

    const prompt = generatePrompt(form.query);
    console.log(form.query);
    // console.log({ prompt });
    // const query = await queryOllama(prompt);
    const query = await queryMlx(prompt);
    console.log({ query });

    const sql = getSqlQuery(query);
    if (!sql) throw new Error(" no cmd?");
    console.log({ sql });

    const data = db.query(sql);
    console.log(" Data rows : ", data.length);

    const promptTwo = `<Query>${sql}</Query>
    <Data>${JSON.stringify(data)}</Data>

    ## Now give only your final 'Reply' summary which will be read aloud to the user.`;
    // console.log({ promptTwo });

    const Qtwo = await queryOllama(promptTwo);
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
