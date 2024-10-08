import type { APIRoute } from "astro";
// import { queryClaude } from "../../aime/claude";
// import { checkAuth } from "../../lib";
import { db, query, schema } from "../../aime/db";

export const prerender = false;

export const GET: APIRoute = async ({}) => {
  try {
    const q = `SELECT *
FROM Event
WHERE date >= date('now')
  AND date < date('now', '+3 days')
ORDER BY date, time;`;

    const seed = `INSERT INTO Event (date, time, title, description)
VALUES
    ('2024-10-05', '14:00', 'Weekend Project Planning', 'Outline goals for the coming week'),
    ('2024-10-06', '10:00', 'Sunday Brunch', 'Team building event'),
    ('2024-10-07', '09:00', 'Weekly Team Standup', 'Review priorities for the week'),
    ('2024-10-08', '11:00', 'Client Meeting', 'Discuss project requirements'),
    ('2024-10-09', '14:00', 'Interview - Junior Developer', 'First round interview for dev position'),
    ('2024-10-10', '10:30', 'Product Roadmap Review', 'Quarterly roadmap planning session'),
    ('2024-10-11', '15:00', 'Tech Talk: AI in Production', 'Guest speaker on AI implementation'),
    ('2024-10-11', '16:30', 'Interview Debrief', 'Discuss candidates from recent interviews'),
    ('2024-10-12', '12:00', 'Team Lunch', 'Celebrate project milestone');`;

    const row = `INSERT INTO Event (date, time, title, description)
    VALUES ('2024-10-10', null, 'Birthday!', 'maybe meal / cinem? ')
    RETURNING *;`;

    //  `Delete from Event`;
    // SELECT sql FROM sqlite_master WHERE type='table';
    // ALTER TABLE Event DROP COLUMN description;
    // ALTER TABLE Event ADD COLUMN value INTEGER CHECK(value IS NULL OR (value >= 1 AND value <= 10));
    // ALTER TABLE Event ADD COLUMN type TEXT DEFAULT 'event' CHECK( type IN ('appointment','event','to-do','habit') );
    // ALTER TABLE Event RENAME COLUMN tag TO type;
    // ALTER TABLE Event ADD COLUMN value TEXT CHECK( value IS NULL OR  value IN ('done') OR  (CAST(value AS INTEGER) BETWEEN 1 AND 10)  );
    // ALTER TABLE Event ADD COLUMN habit TEXT CHECK( habit IN ('meditation', 'exercise', 'headache') );
    const data = query(`
      
    `);
    console.log({ data });

    return new Response("ok", {
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return new Response("Boo", {
      status: 200,
    });
  }
};
