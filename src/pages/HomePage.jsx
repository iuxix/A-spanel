import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatsCards from "../components/StatsCards";
import ServiceIcons from "../components/ServiceIcons";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsCards />
        <section>
          <h2 style={{ textAlign: "center", margin: "30px 0 12px" }}>
            Top SMM Services We Provide
          </h2>
          <ServiceIcons />
        </section>
      </main>
    </>
  );
}
