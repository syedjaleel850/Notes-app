import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup'; // 1. Import the new component
import Notes from './components/Notes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* 2. Add the signup route */}
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
