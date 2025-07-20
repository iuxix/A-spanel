import React from "react";
import SignupForm from "../components/SignupForm";
import Navbar from "../components/Navbar";

export default function SignupPage() {
  return (
    <div className="auth-bg">
      <Navbar />
      <div className="auth-container">
        <SignupForm />
      </div>
    </div>
  );
}
