import type { APIRoute } from "astro";
import { fetchCalendar } from "../../aime/calendar";
import { checkAuth } from "../../lib";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const auth = checkAuth(request);
    if (!auth) throw new Error("auth");

    const data = await fetchCalendar(-3, 7);

    return new Response(JSON.stringify(data), {
      headers: {
        contents: "application/json",
      },
    });
  } catch (e) {
    console.log(e);
    return new Response("boo");
  }
};
