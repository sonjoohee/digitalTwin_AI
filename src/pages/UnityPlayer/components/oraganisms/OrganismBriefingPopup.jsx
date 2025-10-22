import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

// --- API 호출 시뮬레이션 ---
const sampleBriefings = [
  `### 성능 분석 리포트\n\n**CPU 사용률:**\n- **평균:** 45%\n- **최대:** 82% (데이터 처리 피크 시)\n\n**분석:** 현재 시스템은 안정적이나, 데이터 처리량 증가 시 CPU 사용률이 임계점에 가까워질 수 있습니다.`,
  `### 최근 이슈\n\n- **데이터 유실:** 특정 센서 노드에서 간헐적인 데이터 유실 현상 발견 (원인 분석 중)\n- **렌더링 지연:** 고밀도 객체 영역에서 프레임 드랍 발생 (최적화 필요)`,
  `### 향후 로드맵 (Q3)\n\n- **AI 모델 고도화 (v2.2)**\n  - 강화학습 모델 도입\n  - 이상 감지 패턴 추가\n- **시각화 기능 강화**\n  - 3D 히트맵 기능 추가`,
];
let briefingIndex = 0;

/**
 * 새로운 브리핑 데이터를 가져오는 API 함수를 시뮬레이션합니다.
 * @returns {Promise<string>} 새로운 마크다운 데이터
 */
const fetchNewBriefingData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newData = sampleBriefings[briefingIndex % sampleBriefings.length];
      briefingIndex++;
      // 현재 시간을 데이터에 추가하여 매번 다른 내용처럼 보이게 함
      resolve(`\n\n---\n\n**[${new Date().toLocaleTimeString()}]**\n\n${newData}`);
    }, 1000); 
  });
};


const OrganismBriefingPopup = ({ isOpen, onClose }) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const contentsRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const loadAndAppendData = async () => {
        setIsLoading(true);

        const storedData = localStorage.getItem('briefingData') || '### 프로젝트 브리핑: Alpha-7';

        const newData = await fetchNewBriefingData();

        const combinedData = storedData + newData;

        setMarkdownContent(combinedData);

        localStorage.setItem('briefingData', combinedData);

        setIsLoading(false);
      };

      loadAndAppendData();
    }
  }, [isOpen]);

  // 데이터 로딩이 완료될 때마다 스크롤을 맨 아래로 이동시킵니다.
  useEffect(() => {
    if (!isLoading && contentsRef.current) {
      const { scrollHeight, clientHeight } = contentsRef.current;
      contentsRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [isLoading, markdownContent]);

  if (!isOpen) {
    return null;
  }

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContainer 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header>
          <Title>브리핑</Title>
        </Header>
        <Contents ref={contentsRef}>
          {isLoading ? (
            <p>새로운 브리핑을 가져오는 중...</p>
          ) : (
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          )}
        </Contents>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default OrganismBriefingPopup;

// --- Styled Components ---

const palette = {
  white: '#ffffff',
  gray700: '#555555',
  gray300: '#cccccc',
  outlineGray: '#e0e0e0',
};

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
`;

const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #282c34; /* 불투명한 어두운 차콜 색상 */
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
  position: absolute;
  top: 20px;
  left: 120px; 
  width: 60%;
  max-width: 600px;
  height: calc(100vh - 100px);
  overflow: hidden;
  z-index: 10;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${palette.gray700};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${palette.white};
`;

const Contents = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #3c4043;
  color: ${palette.white};
  overscroll-behavior: contain; /* 스크롤 체이닝 방지 */
  line-height: 1.6;

  /* react-markdown으로 렌더링된 HTML 태그 스타일링 */
  // h3 {
  //   margin-top: 0;
  //   color: #61dafb; /* React 로고 색상 활용 */
  //   border-bottom: 1px solid ${palette.gray700};
  //   padding-bottom: 10px;
  // }

  // h4 {
  //   margin-top: 24px;
  //   margin-bottom: 8px;
  //   color: #a9a9a9;
  // }

  // ul {
  //   padding-left: 20px;
  // }

  // p {
  //   margin: 8px 0;
  // }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${palette.gray300};
  line-height: 1;
  z-index: 11;
`;