// auth.js
import Cookies from "js-cookie";
import { auth } from "./firebaseConfig"; // Adjust the import path as needed
import { initializeProfile, updateProfile } from "@/redux-state/fbProfileSlice";
import store from "@/redux-state/store";
import { getExpiry, setExpiry } from "./tokenExpiry";
import { get } from "http";

export const setAuthTokenCookie = (token) => {
  const expirationTime = new Date(new Date().getTime() + 60 * 58 * 1000);
  setExpiry(expirationTime);
  Cookies.set("token", token, { expires: expirationTime, path: "/" });
};

export const getAuthTokenCookie = () => {
  return Cookies.get("token");
};

export const removeAuthTokenCookie = () => {
  Cookies.remove("token");
};

const isCookieExpired = () => {
  const expirationTime = new Date(getExpiry());
  if (!expirationTime) {
    return true;
  }
  const now = new Date();
  return now >= new Date(expirationTime);
};

const refreshToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const res = await user.getIdTokenResult(true);
    //@ts-ignore
    const idToken = res.token;
    //@ts-ignore
    const claims = res.claims;
    console.log("claims", claims);
    store.dispatch(initializeProfile());
    store.dispatch(
      updateProfile({
        //@ts-ignore
        name: claims.name,
        //@ts-ignore
        email: claims.email,
        //@ts-ignore
        role: claims.role,
      })
    );
    setAuthTokenCookie(idToken);
    return idToken;
  }
  return null;
};

export const getValidToken = async () => {
  let token = getAuthTokenCookie();
  if (!token || isCookieExpired()) {
    token = await refreshToken();
  }
  return token;
};
