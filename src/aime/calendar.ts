import { google } from "googleapis";

const CALENDAR_CLIENT_ID = import.meta.env.CALENDAR_CLIENT_ID;
const CALENDAR_CLIENT_SECRET = import.meta.env.CALENDAR_CLIENT_SECRET;
const CALENDAR_REDIRECT = import.meta.env.CALENDAR_REDIRECT;

const CALENDAR_ACCESS = import.meta.env.CALENDAR_ACCESS;
const CALENDAR_REFRESH = import.meta.env.CALENDAR_REFRESH;
const CALENDAR_ID = import.meta.env.CALENDAR_ID;

export const fetchCalendar = async (daysbefore: number, daysafter: number) => {
  const oauth2Client = new google.auth.OAuth2(
    CALENDAR_CLIENT_ID,
    CALENDAR_CLIENT_SECRET,
    CALENDAR_REDIRECT
  );

  oauth2Client.setCredentials({
    access_token: CALENDAR_ACCESS,
    refresh_token: CALENDAR_REFRESH,
    scope: "https://www.googleapis.com/auth/calendar",
    token_type: "Bearer",
    expiry_date: 1723317462123,
  });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  const from = shiftdays(daysbefore);
  const to = shiftdays(daysafter);

  const res = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: from.toISOString(),
    timeMax: to.toISOString(),
  });

  const readableDate = (str: string) => new Date(str).toUTCString();

  const data = res.data.items?.map((ev) => ({
    start: readableDate(ev.start?.dateTime || ev.start?.date || ""),
    end: readableDate(ev.end?.dateTime || ev.end?.date || ""),
    name: ev.summary,
    details: ev.description,
  }));
  return data;
};

export const shiftdays = (days: number) => {
  const today = new Date();
  today.setDate(today.getDate() + days);
  return today;
};
