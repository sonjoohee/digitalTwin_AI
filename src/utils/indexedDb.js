import axios from "axios";
import { setShouldLogout } from "../AtomStates";

const liveurl = "https://ladybird-needed-lately.ngrok-free.app"//"https://1.212.65.42:18080";
const localurl = "http://localhost:8000";

const serverUrl = liveurl;

const delay = 10;

//! /////////////////////////////
//! Login & Signup API functions
//! /////////////////////////////

// 로그인 요청
export const login = async (email, password) => {
  let auto_login = localStorage.getItem("auto_login");
  if (auto_login === null || auto_login === "" || auto_login === "false") auto_login = false;
  else auto_login = true;

  try {
      const response = await axios.post(`${serverUrl}/api/user/login/`,
        {
          user_email: email,
          password: password,
          auto_login: auto_login,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error during normal login:", error);
      throw error;
    }
    // return {
    //     access: "1234567890",
    //     user_email: "test@example.com",
    //     user_name: "아무개",
    //     phone_number: "01012345678",
    // };
};

// 유저 정보 요청
export const userInfo = async () => {
    try {
        let token = sessionStorage.getItem("accessToken");
            if (!token) {
              const res = await requestAccessToken();
              sessionStorage.setItem('accessToken', res.access);
              token = res.access;
            }
        const response = await axios.get(`${serverUrl}/api/user/info/`, {
            headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
            },
        });
        return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        const res = await requestAccessToken();
        sessionStorage.setItem('accessToken', res.access);
        return await userInfo();
      }
      console.error("Error during user info:", error);
      throw error;
    }
    // return {
    //     user_name: "아무개",
    //     user_email: "test@example.com",
    // }
};

// 액세스 토큰 재발급 요청
export const requestAccessToken = async () => {
  let auto_login = localStorage.getItem("auto_login");
  if (auto_login === null || auto_login === "" || auto_login === "false") auto_login = false;
  else auto_login = true;

  try {
    const res = await axios.post(`${serverUrl}/api/tokens/refresh/`,
      {
        auto_login: auto_login,
      },
      {
        withCredentials: true,           //  HttpOnly 쿠키(refresh Token) 함께 전송
        headers: {
          "Content-Type": "application/json",
          'ngrok-skip-browser-warning': 'true',
        }
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error during request access token:", err);
    setShouldLogout(true);
  }
};
