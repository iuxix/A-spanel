import React, { useEffect } from "react";
import StatsCards from "../components/StatsCards";
import ServiceIcons from "../components/ServiceIcons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, user => {
      if (!user) navigate("/login");
    });
    return () => unsub();
  }, [navigate]);

  return (
    <div className="dashboard-bg">
      <h1>Welcome to your SMM Dashboard 👋</h1>
      <StatsCards />
      <ServiceIcons />
      <button className="btn-fund">Add Funds</button>
      <button className="btn-order">New Order</button>
    </div>
  );
}
