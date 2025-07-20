import React from "react";
import Navbar from "../components/Navbar";
import OrderSection from "../components/OrderSection";

export default function Dashboard() {
  return (
    <div className="dashboard-bg">
      <Navbar />
      <OrderSection />
    </div>
  );
}
