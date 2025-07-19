import React from "react";
import StatCards from "../components/StatsCards";
import ServiceIcons from "../components/ServiceIcons";
export default function Dashboard() {
  return (
    <div className="dashboard-bg">
      <h1>Welcome to your SMM Dashboard 👋</h1>
      <StatCards />
      <ServiceIcons />
      <button className="btn-fund">Add Funds</button>
      <button className="btn-order">New Order</button>
      {/* Add more dashboard sections as you build */}
    </div>
  );
}
