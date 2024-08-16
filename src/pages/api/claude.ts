import type { APIRoute } from "astro";
import { queryClaude } from "../../aime/claude";
import { checkAuth } from "../../lib";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const auth = checkAuth(request);
    if (!auth) throw new Error("auth");

    const prompt = await request.text();
    const resp = await queryClaude(prompt);
    return new Response(JSON.stringify(resp));
  } catch (e) {
    console.log(e);
    return new Response("boo");
  }
};
