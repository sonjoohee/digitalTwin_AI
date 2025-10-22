import React, { useState } from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";
import styled from 'styled-components'; 
import ChatbotPopup from '../components/oraganisms/OrganismChatbotPopup.jsx';
import BriefingPopup from '../components/oraganisms/OrganismBriefingPopup.jsx';

const UnityPlayer = () => {
  const { unityProvider, isLoaded, loadingProgression, initialisationError } = useUnityContext({
    // public 폴더를 기준으로 경로를 작성합니다.
    loaderUrl: "Unity/Builds/Builds.loader.js",
    dataUrl: "Unity/Builds/Builds.data",
    frameworkUrl: "Unity/Builds/Builds.framework.js",
    codeUrl: "Unity/Builds/Builds.wasm",
    webglContextAttributes: {
      // 이 설정을 추가하여 React의 키보드 입력을 허용합니다.
      // Unity 2021.2 이상 버전에서는 이 설정이 기본값이지만,
      // 이전 버전에서는 명시적으로 추가해주는 것이 좋습니다.
      "keyboard-input": 0,
    },
  });

  // 팝업 상태를 관리하기 위한 state ('chatbot', 'briefing', 또는 null)
  const [activePopup, setActivePopup] = useState(null);

  // 로딩 진행률을 퍼센트로 변환합니다.
  const loadingPercentage = Math.round(loadingProgression * 100);

  // 초기화 오류가 있으면 화면에 표시합니다.
  if (initialisationError) {
    console.error("Unity initialisation error:", initialisationError);
    return <p>Error loading Unity instance. Check the console for details.</p>;
  }

  return (
    <React.Fragment>
      {!isLoaded && (
        <LoadingOverlay>
          <p>Loading... ({loadingPercentage}%)</p>
        </LoadingOverlay>
      )}
      {/* 로딩이 완료되면 버튼들을 화면 좌측 상단에 표시합니다. */}
      {isLoaded && (
        <ButtonContainer>
          <StyledButton onClick={() => setActivePopup('chatbot')}>챗봇</StyledButton>
          <StyledButton onClick={() => setActivePopup('briefing')}>브리핑</StyledButton>
        </ButtonContainer>
      )}
      <ChatbotPopup isOpen={activePopup === 'chatbot'} onClose={() => setActivePopup(null)} />
      <BriefingPopup isOpen={activePopup === 'briefing'} onClose={() => setActivePopup(null)} />
      <Unity
        unityProvider={unityProvider}
        style={{ width: "100vw", height: "100vh", visibility: isLoaded ? "visible" : "hidden" }}
      />
    </React.Fragment>
  );
}

export default UnityPlayer;


const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #282c34;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: calc(10px + 2vmin);
  z-index: 1;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  // border: 2px solid #61dafb;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7); // 마우스 오버 효과 추가
  }
`;