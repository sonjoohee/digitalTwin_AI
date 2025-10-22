import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const OrganismChatbotPopup = ({ isOpen, onClose }) => {
  // --- State Management ---
  // useState의 초기값 함수를 사용하여 컴포넌트가 처음 로드될 때 localStorage에서 데이터를 가져옵니다.
  const [messages, setMessages] = useState(() => {
    try {
      const storedMessages = localStorage.getItem('chatMessages');
      // 저장된 메시지가 있거나, 내용이 있는 배열이면 파싱해서 반환합니다.
      if (storedMessages && storedMessages !== '[]') {
        return JSON.parse(storedMessages);
      }
      // 없으면 초기 메시지를 반환합니다.
      return [
        {
          id: 1,
          sender: 'bot',
          text: '안녕하세요! 저는 이 디지털 트윈의 AI 챗봇입니다. 궁금한 점을 질문해 주시면 성실하게 답변해드리겠습니다.',
        },
      ];
    } catch (error) {
      console.error("Error reading chat messages from localStorage", error);
      return []; // 오류 발생 시 빈 배열 반환
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const contentsRef = useRef(null);
  const inputRef = useRef(null);

  // 메시지가 업데이트될 때마다 localStorage에 저장하고 스크롤을 맨 아래로 이동시킵니다.
  useLayoutEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    if (isOpen && contentsRef.current) {
      contentsRef.current.scrollTop = contentsRef.current.scrollHeight;
    }
  }, [isOpen, messages, isTyping]);

  // isTyping 상태가 false로 변경될 때 (봇 응답 완료 시) input에 포커스를 줍니다.
  useEffect(() => {
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  if (!isOpen) {
    return null;
  }

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isTyping) return;

    const textToProcess = inputValue;
    
    // 먼저 사용자 메시지를 화면에 표시하고 입력창을 비웁니다.
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToProcess,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 봇의 응답을 시뮬레이션합니다. (await를 사용하여 비동기 작업을 기다립니다)
    await new Promise(resolve => setTimeout(resolve, 1500));

      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `'${textToProcess}'에 대한 답변입니다. 여기에 AI의 답변이 표시됩니다.`,
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContainer 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header>
          <Title>AI 챗봇</Title>
        </Header>
        <Contents 
          ref={contentsRef} 
          // 팝업이 열릴 때 스크롤 점프 현상을 막기 위해 초기에는 숨깁니다.
          style={{ opacity: isOpen ? 1 : 0 }}
        >
          {messages.map((msg) => (
            <ChatItem key={msg.id} sender={msg.sender}>
              <ChatBox sender={msg.sender}>
                <p>{msg.text}</p>
              </ChatBox>
            </ChatItem>
          ))}
          {isTyping && (
            <ChatItem sender="bot">
              <ChatBox sender="bot">
                <TypingIndicator />
              </ChatBox>
            </ChatItem>
          )}
        </Contents>
        <ChatFooter>
          <ChatInput>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="질문을 입력해주세요..."
              disabled={isTyping}
            />
            <button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
              전송
            </button>
          </ChatInput>
        </ChatFooter>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default OrganismChatbotPopup;

const palette = {
  primary: '#226fff',
  white: '#ffffff',
  gray800: '#333333',
  gray700: '#555555',
  gray500: '#888888',
  gray300: '#cccccc',
  outlineGray: '#e0e0e0',
  chatGray: '#f5f5f5',
};

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* display: flex; */ /* PopupContainer를 absolute로 위치시키므로 flex는 불필요 */
  z-index: 10;
`;

const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #282c34; /* 불투명한 어두운 차콜 색상으로 변경 */
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
  position: absolute;
  top: 20px;
  left: 120px; 
  width: 60%;
  max-width: 600px;
  height: calc(100vh - 100px); /* 화면 높이에 맞춰 조절, 상하 여백 20px씩 고려 */
  overflow: hidden;
  z-index: 10; /* 오버레이보다 높은 z-index를 가짐 */
`;

const Header = styled.div`
  padding: 20px;
  // border-bottom: 1px solid ${palette.outlineGray};
  border-bottom: 1px solid ${palette.gray700};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${palette.white}; /* 텍스트 색상을 흰색으로 변경 */
`;

const Contents = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #3c4043; /* 어두운 테마에 맞는 배경색으로 변경 */
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-behavior: smooth;
  overscroll-behavior: contain; /* 스크롤 체이닝 방지 */
`;

const ChatItem = styled.div`
  display: flex;
  justify-content: ${(props) => (props.sender === 'user' ? 'flex-end' : 'flex-start')};
  width: 100%;
`;

const ChatBox = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: ${(props) =>
    props.sender === 'user'
      ? '18px 18px 0 18px' // user
      : '18px 18px 18px 0'}; /* bot */
  background-color: ${(props) =>
    props.sender === 'user' ? '#00529B' : palette.white}; /* 사용자 말풍선 색상 변경 */
  color: ${(props) => (props.sender === 'user' ? palette.white : palette.gray800)};
  border: ${(props) => (props.sender === 'bot' ? `1px solid ${palette.outlineGray}` : 'none')};
  word-break: break-word;

  p {
    margin: 0;
    line-height: 1.5;
  }
`;

const ChatFooter = styled.div`
  padding: 12px;
  // border-top: 1px solid ${palette.outlineGray};
  border-top: 1px solid ${palette.gray700};
  background: #282c34; /* 배경색 통일 */
`;

const ChatInput = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 96%;
  padding: 8px 12px;
  border-radius: 50px;
  border: 1px solid ${palette.gray700}; /* 테두리 색상 변경 */
  transition: border-color 0.3s ease;  

  &:focus-within {
    border-color: ${palette.primary};
  }

  input {
    flex-grow: 1;
    border: none;
    outline: none;
    font-size: 1rem;
    background: transparent;
    color: ${palette.white}; /* 입력 텍스트 색상 변경 */

    &::placeholder {
      color: ${palette.gray300};
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  button {
    flex-shrink: 0;
    padding: 8px 16px;
    border: none;
    border-radius: 20px;
    // background-color: ${palette.primary};
    background-color: #00529B;
    color: ${palette.white};
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;

    &:disabled {
      background-color: ${palette.gray300};
      cursor: not-allowed;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${palette.gray300}; /* 닫기 버튼 색상 변경 */
  line-height: 1;
  z-index: 11;
`;

const flash = keyframes`
  0% { background-color: ${palette.gray500}; box-shadow: 12px 0 ${palette.gray500}, -12px 0 ${palette.gray300}; }
  50% { background-color: ${palette.gray300}; box-shadow: 12px 0 ${palette.gray300}, -12px 0 ${palette.gray500}; }
  100% { background-color: ${palette.gray500}; box-shadow: 12px 0 ${palette.gray500}, -12px 0 ${palette.gray300}; }
`;

const TypingIndicator = styled.div`
  width: 6px;
  height: 6px;
  margin: 8px 12px;
  border-radius: 50%;
  background: ${palette.gray500};
  box-shadow: 12px 0 ${palette.gray500}, -12px 0 ${palette.gray500};
  position: relative;
  animation: ${flash} 0.5s ease-out infinite alternate;
`;