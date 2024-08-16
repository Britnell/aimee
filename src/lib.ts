//
const name = import.meta.env.COOKIE_NAME;
const value = import.meta.env.COOKIE_VALUE;

export const checkAuth = (req: Request) => {
  const ck = req.headers.get("cookie");
  if (!ck) return false;

  return !!ck
    ?.split(";")
    .map((ck) => ck.trim().split("="))
    .find(([k, v]) => k === name && v === value);
};
