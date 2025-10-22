import React, { useState } from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";
import styled from 'styled-components'; 
import ChatbotPopup from '../components/oraganisms/OrganismChatbotPopup.jsx';
import BriefingPopup from '../components/oraganisms/OrganismBriefingPopup.jsx';

const UnityPlayer = () => {
  const { unityProvider, isLoaded } = useUnityContext({
    // public 폴더를 기준으로 경로를 작성합니다.
    loaderUrl: "Unity/Builds/Builds.loader.js",
    dataUrl: "Unity/Builds/Builds.data",
    frameworkUrl: "Unity/Builds/Builds.framework.js",
    codeUrl: "Unity/Builds/Builds.wasm",
    webglContextAttributes: {
      "keyboard-input": 0,
    },
  });

  const [activePopup, setActivePopup] = useState(null);

  return (
    <React.Fragment>
     
      {isLoaded && (
        <ButtonContainer>
          <StyledButton onClick={() => setActivePopup('chatbot')} isActive={activePopup === 'chatbot'}>챗봇</StyledButton>
          <StyledButton onClick={() => setActivePopup('briefing')} isActive={activePopup === 'briefing'}>브리핑</StyledButton>
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
  z-index: 11; /* 팝업(z-index: 10)보다 위에 오도록 수정 */
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: ${(props) =>
    props.isActive ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)'};
  // border: 2px solid #61dafb;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7); // 마우스 오버 효과 추가
  }
`;