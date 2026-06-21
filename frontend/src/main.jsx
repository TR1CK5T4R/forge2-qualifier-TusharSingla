import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BoardList from './components/BoardList.jsx';
import BoardView from './components/BoardView.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<BoardList />} />
          <Route path="boards/:boardId" element={<BoardView />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>,
)
