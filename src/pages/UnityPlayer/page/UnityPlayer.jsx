import React from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";

// 컴포넌트 내부에 스타일 객체를 직접 정의합니다.
// CSS 속성은 camelCase로 작성합니다 (e.g., background-color -> backgroundColor).
function UnityPlayer() {
  const { unityProvider, isLoaded, loadingProgression, initialisationError } = useUnityContext({
    // public 폴더를 기준으로 경로를 작성합니다.
    loaderUrl: "Unity/Builds/Builds.loader.js",
    dataUrl: "Unity/Builds/Builds.data",
    frameworkUrl: "Unity/Builds/Builds.framework.js",
    codeUrl: "Unity/Builds/Builds.wasm",
  });

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
        <div style={styles.loadingOverlay}>
          <p>Loading... ({loadingPercentage}%)</p>
        </div>
      )}
      {/* 로딩이 완료되면 버튼들을 화면 우측 상단에 표시합니다. */}
      {isLoaded && (
        <div style={styles.buttonContainer}>
          <button style={styles.button}>챗봇</button>
          <button style={styles.button}>브리핑</button>
        </div>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{ width: "100vw", height: "100vh", visibility: isLoaded ? "visible" : "hidden" }}
      />
    </React.Fragment>
  );
}

export default UnityPlayer;

const styles = {
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#282c34',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 'calc(10px + 2vmin)',
    zIndex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 2, // 다른 요소들 위에 오도록 z-index를 높게 설정
    display: 'flex',
    flexDirection: 'column', // 버튼을 세로로 나열
    gap: '10px', // 버튼 사이의 간격
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 검정 배경
    border: '2px solid #61dafb', // App.css에 있던 링크 색상 활용
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }
};
