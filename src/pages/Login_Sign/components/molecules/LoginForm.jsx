import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { ThemeProvider, css } from "styled-components";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { isValidEmail } from "../atoms/AtomValidation";
import {
  login,
} from "../../../../utils/indexedDb";
import { useAtom } from "jotai";
import { USER_EMAIL, USER_NAME } from "../../../../AtomStates";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const [, setUserName] = useAtom(USER_NAME);
  const [, setUserEmail] = useAtom(USER_EMAIL);
  
  const navigate = useNavigate();

  useEffect(() => {
    setErrorStatus("");
  }, [setErrorStatus]);

  const validateForm = () => {
    if (!email || !password) {
      setErrorStatus("모든 필드를 입력해주세요.");
      return false;
    }
    if (!isValidEmail(email)) {
      setErrorStatus("유효한 이메일 주소를 입력해주세요.");
      return false;
    }
    return true;
  };

  const handleLogin = async (autoLogin) => {
    localStorage.setItem("auto_login", autoLogin);
    setErrorStatus("");
    if (!validateForm()) return;

    try {
      let result;

      result = await login(email, password);

      const accessToken = result.access;
      sessionStorage.setItem("accessToken", accessToken);
      setUserName(result.name);
      setUserEmail(result.user_email);

    //   // 기기 타입 감지 및 저장 (로그인 시점)
    //   const DeviceDetectionService = (
    //     await import("../../../../utils/DeviceDetectionService")
    //   ).default;
    //   const deviceType = DeviceDetectionService.detectDevice();
    //   DeviceDetectionService.saveToSession(deviceType);
    //   console.log("🔐 로그인 시 기기 감지 및 저장:", deviceType);

      navigate("/DashBoard");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorStatus(error.response.data.message);
      } else {
        setErrorStatus("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
          <LoginFormContainer>
            <div>
              <label htmlFor="email">
                아이디<span>*</span>
              </label>
              <CustomInput
                Small
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="입력해주세요"
              />
            </div>

            <div>
              <label htmlFor="password">
                비밀번호<span>*</span>
              </label>
              <CustomInput
                Small
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="입력해주세요"
              />

              <TogglePasswordButton onClick={togglePasswordVisibility}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </TogglePasswordButton>
            </div>

            <div>
              <InlineRow>
                <label htmlFor="autoLogin">자동로그인</label>
                <CustomInput
                  Small
                  id="autoLogin"
                  type="checkbox"
                  width="auto"
                  checked={autoLogin}
                  onChange={(e) => setAutoLogin(e.target.checked)}
                />
              </InlineRow>
            </div>
            {/* <PasswordResetLink>
              <a onClick={handlePasswordRestClick}>비밀번호 찾기</a>
            </PasswordResetLink> */}

            <StyledLoginButton
              onClick={() => handleLogin(autoLogin)}
              disabled={!email || !password}
            >
              로그인
            </StyledLoginButton>

            {errorStatus && <ErrorMessage>{errorStatus}</ErrorMessage>}


          </LoginFormContainer>
      </ThemeProvider>
    </>
  );
};
export default LoginForm;

const LoginFormContainer = styled.div`
  width: 100%;

  > div {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-size: 0.875rem;
      text-align: left;
      display: flex;
      align-items: flex-start;
      gap: 5px;

      span {
        color: #FF0000;
      }
    }

    + div {
      margin-top: 20px;
    }
  }
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: 0;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-family: "Pretendard", "Poppins";
  color: #888;

  &:focus {
    outline: none;
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.875rem;
  color: #FF0000;
  margin-top: 20px;
  text-align: center;
`;

// const PasswordResetLink = styled.div`
//   margin: 20px auto 20px;
//   text-align: right;
//   cursor: pointer;

//   a {
//     color: #7A7A7A;
//     font-size: 0.875rem;
//   }

//   a:hover {
//     text-decoration: underline;
//   }
// `;

const StyledLoginButton = styled.button`
  width: 100%;
  font-family: "Pretendard", "Poppins";
  color: #FFFFFF;
  padding: 14px 16px;
  border-radius: 8px;
  border: none;
  background-color: #304767;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    background: #d0d6e1;
    color: #ffffff;
    pointer-events: none;
  }
`;



const theme = {
    breakpoints: {
      // mobile: '480px',
      // tablet: '768px',
      smobile: "320px", // 작은사이즈 모바일
      mobile: "440px",
      tablet: "810px",
      desktop: "1024px",
      iphone: "1024px", // 아이폰도 모바일로 적용
    },
  };

const getStatusColor = (props) => {
    if (props.status === "error") return "#ff2f3e";
    if (props.status === "valid") return "#ccc";
    if (props.disabled) return "#f6f6f6";
    return "#E0E4EB";
  };

const CustomInput = styled.input`
  box-sizing: border-box;
  width: ${(props) => props.width || "100%"};
  font-family: "Pretendard", "Poppins";
  font-size: 1rem;
  background-color: #F1F4F9;
  line-height: 1.2;
  color: ${(props) =>
    props.status === "error" ? "#ff2f3e" : "#212121"};
  padding: ${(props) =>
    props.Small ? "13px 16px" : props.Medium ? "13px 20px" : "16px 20px"};
  border-radius: ${(props) => (props.Round ? "50px" : "5px")};
  border: 1px solid ${(props) =>
    props.status === "error" ? "#ff2f3e" : "#ffffff"};
  outline: none;
  transition: all 0.5s;

  ${(props) =>
    props.Floating &&
    css`
      font-size: 0.94rem;
      line-height: 1;
      padding: 15px 12px;
      border-radius: 4px;
      border: 1px solid ${getStatusColor};

      + span {
        position: absolute;
        top: -8px;
        left: 12px;
        padding: 0 4px;
        background: #fff;
      }
    `}

  ${(props) =>
    props.Edit &&
    css`
      font-size: 1rem;
      line-height: 1.3;
      padding: 0;
      border: 0;

      + span {
        position: absolute;
        top: -8px;
        left: 12px;
        padding: 0 4px;
        background: #fff;
      }
    `}

  ${(props) =>
    props.NoLine &&
    css`
      font-size: 1rem;
      line-height: 1.55;
      padding: 0;
      border: 0;
    `}

  &:focus, &:hover {
    border-color: ${(props) =>
      props.status === "error"
        ? "#ff2f3e"
        : props.status === "valid"
        ? "#ccc"
        : "#226fff"};

    ${(props) =>
      props.Floating &&
      `
      + span {
        color: ${(props) =>
          props.status === "error"
            ? "#ff2f3e"
            : props.status === "valid"
            ? "#ccc"
            : "#226fff"};
      }
    `}
  }

  &:disabled {
    background: ${props => props.fix ? '#fff' : '#f6f6f6'};
    cursor: not-allowed;

    &:hover {
      border-color: #ccc;
    }
  }

  &::placeholder {
    font-size: ${(props) =>
      props.Small ? "0.875rem" : props.Medium ? "1rem" : "1rem"};
    color: #ccc;
  }
`;

const InlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;