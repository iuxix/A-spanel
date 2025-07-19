import React from "react";
import StatsCards from "../components/StatsCards";
import ServiceIcons from "../components/ServiceIcons";
export default function Dashboard() {
  return (
    <div className="dashboard-bg">
      <h1>Welcome to your SMM Dashboard 👋</h1>
      <StatsCards />
      <ServiceIcons />
      <button className="btn-fund">Add Funds</button>
      <button className="btn-order">New Order</button>
      {/* Add bonus banners and dashboard sections as needed */}
    </div>
  );
}
