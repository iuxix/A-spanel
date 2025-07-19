import React from "react";
export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-left">
        <h1>
          Boost Your <br />
          <span className="highlight">Social Media Presence 🚀</span>
        </h1>
        <p>
          With LuciXFire's Advanced SMM Panel <span className="hash">#1</span>
        </p>
        <p>
          Unleash growth across top platforms. Fast delivery, unbeatable prices, and
          24/7 support.
        </p>
        <a href="/signup" className="btn-main">Sign Up Today</a>
      </div>
      <div className="hero-right">
        <img src="/logo.png" alt="Rocket" className="rocket-img" />
      </div>
    </section>
  );
}
