//로그인
import React from 'react';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// import { H1 } from "../../../../assets/styles/Typography";
import LoginForm from "../components/molecules/LoginForm";
// import { useDynamicViewport } from "../../../../assets/DynamicViewport";

const OrganismIncLogin = () => {
  // useDynamicViewport("width=800"); // 특정페이지에서만 pc화면처럼 보이기
  const navigate = useNavigate();
  return (
    <>
      <ContentsWrap>
        <MainContent Wide>
          <LoginWrap>
            <TitleSection>
              <h1 style={{ margin: 0}}>디지털 트윈 AI</h1>
              <DescriptionText>
                디지털 트윈 모델 모범 시범
              </DescriptionText>
            </TitleSection>
            <LoginForm />
            {/* <BusinessInfoWrap>
              <p>아직 계정이 없으신가요?</p>
              <a href="/Signup"
                style={{
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/Signup");
                }}
              >
                가입하기
              </a>
            </BusinessInfoWrap> */}
          </LoginWrap>
        </MainContent>
      </ContentsWrap>
    </>
  );
};

export default OrganismIncLogin;

const LoginWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 610px;
  width: 100%;
  margin: 156px auto 0;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 56px;
`;

const DescriptionText = styled.p`
  font-family: "Pretendard", "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.55;
  color: #7A7A7A;
  text-align: center;
  margin: 0;
`;

const ContentsWrap = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? "column" : "row")};
  gap: ${(props) => (props.isMobile ? "20px" : "40px")};
  padding: ${(props) => (props.isMobile ? "20px" : "0 4px 0 0")};
  min-height: 100vh;
  box-sizing: border-box;
`;

const MainContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: ${(props) =>
    props.Wide
      ? "1024px"
      : props.Wide1030
      ? "1030px"
      : props.Wide1240
      ? "1240px"
      : "820px"};
  // max-width: 1024px;
  // min-height: 100vh;
  width: 100%;
  justify-content: flex-start;
  padding: 57px 0 40px;
  margin: 0 auto;
  // padding: ${(props) => (props.isMobile ? "0" : "0 20px")};
`;

const BusinessInfoWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row !important;
  gap: 12px;
  font-size: 1rem;
  color: #7A7A7A;
  margin-top: 40px;

  p {
    font-weight: 500;
    color: #7a7a7a;
    margin: 0;
  }

  a {
    color: #0453f4;
    text-decoration: underline;
    font-weight: 700;
  }
`;