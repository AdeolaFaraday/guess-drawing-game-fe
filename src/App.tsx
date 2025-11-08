import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Lobby from './components/Lobby';
import DrawingGame from './drawing-game/DrawingGame';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/game/:room/:userName" element={<DrawingGame />} />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
