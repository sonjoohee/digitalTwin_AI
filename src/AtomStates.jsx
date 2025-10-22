import { atom, getDefaultStore } from "jotai";

const store = getDefaultStore();

// 로그인
export const USER_NAME = atom("");
export const USER_EMAIL = atom("");
export const USER_PHONE_NUMBER = atom("");
export const SHOULD_LOGOUT = atom(false);
export const setShouldLogout = (value) => {
  store.set(SHOULD_LOGOUT, value);
};
