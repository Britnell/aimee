import type { APIRoute } from "astro";
import { checkAuth } from "../../lib";
import { elevenRead } from "../../aime/eleven";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const auth = checkAuth(request);
    if (!auth) throw new Error("auth");

    const text = await request.text();
    const resp = await elevenRead(text);
    const blob = await resp.blob();

    return new Response(blob, {
      status: 200,
      headers: resp.headers,
    });
  } catch (e) {
    console.log(e);
    return new Response("boo");
  }
};
