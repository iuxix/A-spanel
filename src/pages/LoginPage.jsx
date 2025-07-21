import React from "react";
import LoginForm from "../components/LoginForm";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  return (
    <div className="auth-bg">
      <Navbar />
      <div className="auth-container">
        <LoginForm />
      </div>
    </div>
  );
}
