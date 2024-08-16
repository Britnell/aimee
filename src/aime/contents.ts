import { findOne, textContent } from "domutils";
import * as htmlparser2 from "htmlparser2";

export const getAryatara = async () => {
  const body = await fetch("https://aryatara.de/programm/kalender.html").then(
    (res) => res.text()
  );
  const dom = htmlparser2.parseDocument(body);

  const cont = findOne(
    (el) => el.attributes.find((at) => at.name === "id")?.value === "container",
    dom.childNodes
  );

  if (!cont) return "";
  const table = findOne((el) => el.name === "table", cont.childNodes);

  if (!table) return "";
  const txt = textContent(table);

  return txt;
};
