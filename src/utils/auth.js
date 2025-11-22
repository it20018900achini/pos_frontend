export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // convert to ms

    return Date.now() > exp;
  } catch (e) {
    return true; // invalid token also considered expired
  }
};
