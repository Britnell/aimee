import type { APIRoute } from "astro";
import { queryCoder, queryOllama } from "../../aime/aime";

export const GET: APIRoute = async () => {
  console.log("PING");
  const r = await queryCoder("ok?");
  console.log(r);

  return new Response("ok");
};
