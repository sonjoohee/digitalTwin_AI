import './App.css';
import UnityPlayer from './pages/UnityPlayer/page/UnityPlayer';
import LoginPage from './pages/Login_Sign/pages/LoginPage';
// import { RequireToken, RedirectIfLoggedIn } from './utils/guards';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<UnityPlayer />} />
          {/* <Route path="/login" element={
            <RedirectIfLoggedIn>
              <LoginPage />
            </RedirectIfLoggedIn>} />
          <Route path="/" element={
            <RequireToken>
              <UnityPlayer />
            </RequireToken>} /> */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;
