import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { USER_NAME, USER_EMAIL, SHOULD_LOGOUT } from '../AtomStates';
import { userInfo, requestAccessToken } from './indexedDB';

// 토큰 존재 여부 확인 및 유저 정보 로드
export const RequireToken = () =>{
    const location = useLocation();
    const token = sessionStorage.getItem('accessToken');
    const [name, setUserName] = useAtom(USER_NAME);
    const [email, setUserEmail] = useAtom(USER_EMAIL);
    const [shouldLogout, setShouldLogout] = useAtom(SHOULD_LOGOUT);
    const [tokenRequested, setTokenRequested] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const requestingRef = useRef(false);
  
    // 유저 정보 필요 여부
    const needInfo = !name || !email;
    const inFlightRef = useRef(false);
  
    // 토큰이 없을 때 1회 갱신 시도
    useEffect(() => {
      if (token || requestingRef.current || tokenRequested) return;

      requestingRef.current = true;

      const tryRequestAccessToken = async () => {
        try {
          const res = await requestAccessToken();
          sessionStorage.setItem('accessToken', res.access);
        } catch (err) {

        } finally {
          requestingRef.current = false;
          setTokenRequested(true);
        }
      };

      tryRequestAccessToken();
    }, [token, tokenRequested, setShouldLogout]);
    
    // 유저 정보 요청
    useEffect(() => {
      if (!token || !needInfo || inFlightRef.current) return;
  
      inFlightRef.current = true;
  
      const fetchUserInfo = async () => {
        try {
          setIsFetching(true);
          const res = await userInfo();
          setUserName(res.user_name);
          setUserEmail(res.user_email);
          setShouldLogout(false);
        } catch (err) {
          console.error('userInfo failed:', err);
          sessionStorage.removeItem('accessToken');
          setShouldLogout(true);  
        } finally {
          inFlightRef.current = false;
          setIsFetching(false);
        }
      };
      fetchUserInfo();
    }, [token, needInfo, setUserName, setUserEmail]);

    // RequestAccessToken API 요청 실패시 로그아웃
    if (shouldLogout) {
      sessionStorage.removeItem('accessToken');
      localStorage.removeItem('auto_login');
      return <Navigate to="/" replace />;
    }

    // 1) 토큰 없으면 1회 갱신 시도 (요청 중엔 렌더 보류)
    if (!token) {
      if (!tokenRequested) {
        return 
      }
      return <Navigate to="/" replace state={{ from: location }} />;
    }

    if (needInfo && (isFetching || !inFlightRef.current)) {
      return
    }
  
    return <Outlet />;
  }

// 로그인 상태에서 로그인/회원가입 페이지 접근 제한
export const RedirectIfLoggedIn = () =>{
  const token = sessionStorage.getItem("accessToken");
  const [tokenRequested, setTokenRequested] = useState(false);
  const requestingRef = useRef(false);
  const [shouldLogout, setShouldLogout] = useAtom(SHOULD_LOGOUT);

  // 토큰이 없을 때 1회 갱신 시도
  useEffect(() => {
    setShouldLogout(false);
    if (token || requestingRef.current || tokenRequested) return;

    requestingRef.current = true;

    const tryRequestAccessToken = async () => {
      try {
        const res = await requestAccessToken();
        sessionStorage.setItem('accessToken', res.access);
      } catch (err) {
        setShouldLogout(true);
      } finally {
        requestingRef.current = false;
        setTokenRequested(true);
      }
    };

    tryRequestAccessToken();
  }, [token, tokenRequested, setShouldLogout]);

  if (!token || shouldLogout) return <Outlet />;           // 비로그인 → 페이지 보여주기

  // 로그인 상태면 보호 구역으로
  return <Navigate to="/DashBoard" replace />;
}