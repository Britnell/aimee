import type { APIRoute } from "astro";
import { getAryatara } from "../../aime/contents";
import { checkAuth } from "../../lib";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  //
  try {
    const auth = checkAuth(request);
    if (!auth) throw new Error("auth");

    const med = await getAryatara();

    return new Response(med);
  } catch (e) {
    console.log(e);
    return new Response("boo");
  }
};
