import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import Dashboard from "pages/Dashboard/Dashboard";
import Signin from "pages/Signin/Signin";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import NotFound from "pages/NotFound/NotFound";
import Account from "pages/Account/Account";
import Campaign from "pages/Campaign/Campaign";
import { Modal } from "antd";

function App() {
  const navigate = useNavigate();
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isTokenExpired = useCallback(() => {
    const expiresIn = localStorage.getItem("access_token_expires");
    if (expiresIn === null) return true;
    if (expiresIn) {
      const currentTime = Date.now();
      const expirationTime = parseInt(expiresIn, 10);
      const isExpired = currentTime > expirationTime;

      return isExpired;
    }
    return false;
  }, []);
  useEffect(() => {
    setIsLoginPage(window.location.pathname === "/");
  }, []);
  useEffect(() => {
    if (isTokenExpired() && !isLoginPage && !isModalVisible) {
      setIsModalVisible(true);
    } else if (!isTokenExpired() && isModalVisible) {
      setIsModalVisible(false);
    }
  }, [isTokenExpired, isLoginPage, isModalVisible]);

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/");
  };
  return (
    <div>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/account" element={isTokenExpired() ? <Navigate to="/" /> : <Account />} />
        <Route path="/dashboard" element={isTokenExpired() ? <Navigate to="/" /> : <Dashboard />} />
        <Route path="/campaign" element={isTokenExpired() ? <Navigate to="/" /> : <Campaign />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Modal
        title="Session Expired"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Your session has expired. Please log in again.</p>
      </Modal>
    </div>
  );
}

export default App;
