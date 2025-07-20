import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{
      background: "linear-gradient(112deg,#f2fff9 60%,#e5f5fa 100%)",
      minHeight: "100vh",
      paddingBottom: 30
    }}>
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #f3f7fb",
        padding: "20px 0 17px 0",
        marginBottom: 0,
        boxShadow: "0 1px 12px #c6eaff17",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ fontWeight: 900, color: "#2ad881", fontSize: "2em", marginLeft: 22, letterSpacing: 1.2 }}>fastsmmpanel</div>
        <div style={{marginRight:15}}>
          <Link to="/login" style={{
            background: "linear-gradient(90deg,#17deb0,#6ddcff)",
            color: "#fff", borderRadius: 19, fontWeight: 700, fontSize: "1.12em",
            padding: "10px 30px", marginRight: 10, textDecoration: "none", boxShadow: "0 2px 6px #10f8ff12"
          }}>Sign In</Link>
          <Link to="/signup" style={{
            background: "linear-gradient(90deg,#fed700,#39fa7c 98%)",
            color: "#222", borderRadius: 19, fontWeight: 700, fontSize: "1.12em",
            padding: "10px 30px", textDecoration: "none"
          }}>Sign Up</Link>
        </div>
      </nav>

      {/* Hero/CTA Section */}
      <div style={{
        maxWidth: 1160, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 30, padding: "43px 6vw 22px 6vw"
      }}>
        <div style={{ flex: "1 1 400px", minWidth: 270 }}>
          <h1 style={{ fontSize: "2.3em", lineHeight: 1.14, fontWeight: 800, margin: "7px 0 19px", letterSpacing: -2 }}>
            Boost Your Social Media Presence <span style={{ color: "#2ad881" }}>⚡</span>
          </h1>
          <div style={{ fontSize: "1.18em", marginBottom: 23, color: "#1b3457", lineHeight: 1.63 }}>
            The world’s fastest, <span style={{ color: "#14d117", fontWeight: 700 }}>affordable</span> SMM services.
            <br />
            <b>Automatic orders, wallet, analytics, and real-time refills</b> — for agencies, resellers, and brands.
          </div>
          <ul style={{ paddingLeft: 23, margin: "0 0 35px 0", color: "#172928" }}>
            <li style={{ marginBottom: 8 }}>🌟 <b>10+ Categories:</b> IG, YouTube, Telegram, Facebook, &amp; more</li>
            <li style={{ marginBottom: 8 }}>💸 <b>Wallet System:</b> UPI/crypto/top-up, instant order + refund</li>
            <li style={{ marginBottom: 8 }}>🛡️ <b>100% Safe & Secure. Admin-monitored, live approval</b></li>
            <li>💬 <b>24/7 WhatsApp API support</b></li>
          </ul>
          <Link to="/signup" style={{
            background: "linear-gradient(90deg,#feda4a,#23e860 90%)",
            color: "#093f14", borderRadius: 21, fontWeight: 900, fontSize: "1.17em",
            padding: "13px 45px 13px 45px", textDecoration: "none",
            letterSpacing: "1px", boxShadow: "0 2px 16px #2ad88518"
          }}>Create Free Account 🚀</Link>
        </div>
        <div style={{ flex: "1 1 320px", display:"flex", justifyContent: "center" }}>
          <img
            src="/rocket-hero.png"
            style={{ maxWidth: "335px", width: "93vw", borderRadius: "49px", boxShadow: "0 7px 40px #1de1451b" }}
            alt="rocket fastsmmpanel" />
        </div>
      </div>

      {/* How it Works Section */}
      <div style={{ background:"#fff", padding:"35px 0 25px 0", marginTop:33 }}>
        <h2 style={{textAlign:"center", fontWeight:900, marginBottom:19, letterSpacing: -1}}>How It Works</h2>
        <div style={{
          maxWidth:1100, margin:"0 auto", display:"flex", flexWrap: "wrap", justifyContent:"space-around", gap:30
        }}>
          {[
            {
              title: "Create An Account & Add Balance",
              icon: "👤",
              desc: "Sign up and add balance via UPI or crypto. Secure wallet for instant orders and refunds."
            },
            {
              title: "Select Your Targeted Service",
              icon: "💼",
              desc: "Choose from wide range: Instagram, Telegram, YouTube, and more. Our real-time API keeps data fresh."
            },
            {
              title: "Provide Link, Quantity & Watch Results!",
              icon: "🔗",
              desc: "Submit details and see progress live in your dashboard, track, refill, or refund instantly."
            }
          ].map((step, idx) =>
            <div key={idx} style={{
              background: "#f8fefd",
              borderRadius: 20,
              boxShadow: "0 2px 16px #12efc218",
              padding: "27px 35px", minWidth:220, maxWidth:340, flex:"1 1 250px", marginBottom:17
            }}>
              <div style={{fontSize:"2.5em",marginBottom:14,textAlign:"center"}}>{step.icon}</div>
              <div style={{fontWeight:700, fontSize:"1.18em", marginBottom:7, textAlign:"center"}}>{step.title}</div>
              <div style={{color:"#207047",fontSize:"1em",textAlign:"center"}}>{step.desc}</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats and CTA Bar */}
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center",
        background: "#fff", maxWidth: 1100, margin: "40px auto 0", borderRadius: 20, boxShadow: "0 2px 9px #45ebae09"
      }}>
        {[
          { value: "726,724", label: "Total Orders", emoji: "🧾" },
          { value: "$0.001/1K", label: "Starting Price", emoji: "💰" },
          { value: "24/7", label: "Fastest Support", emoji: "💬" },
          { value: "3058+", label: "Happy Clients", emoji: "🎉" }
        ].map((stat, idx) =>
          <div key={idx} style={{ padding: "33px 37px", fontSize: "1.13em", display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "2em", marginRight: 15 }}>{stat.emoji}</span>
            <span>
              <b style={{ fontSize: "1.17em" }}>{stat.value}</b>
              <br /><span style={{ color: "#0594e2", fontWeight: 600 }}>{stat.label}</span>
            </span>
          </div>
        )}
      </div>

      {/* Services CTA with Large Icons */}
      <div style={{maxWidth:1280,margin:"60px auto 45px",textAlign:"center"}}>
        <h2 style={{fontWeight:900,letterSpacing: "-2px",fontSize:"2.16em",marginBottom:13}}>Top SMM Services We Provide</h2>
        <div style={{ fontSize: "1.16em", color: "#1c314c", marginBottom: "17px" }}>
          At <b>fastsmmpanel</b>, you get all services — IG, YouTube, Telegram, Facebook, LinkedIn, Twitter, Tiktok, Website & more.<br/>
          <span style={{ color: "#09e37b" }}>Automated, refillable, and live-supported 24/7.</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 25, margin: "0", padding:"12px 0 0 0" }}>
          {["instagram","facebook","youtube","telegram","twitter","tiktok","linkedin","discord","website"].map(net =>
            <div key={net}
              style={{
                width: 63, height: 63, borderRadius: 33, display: "flex", alignItems: "center", justifyContent: "center",
                background: net === "instagram" ? "#ffe7f0"
                  : net === "facebook" ? "#e7f4ff"
                  : net === "youtube" ? "#fff3ee"
                  : net === "telegram" ? "#eaf9ff"
                  : net === "twitter" ? "#eaf8ff"
                  : net === "linkedin" ? "#ececff"
                  : net === "tiktok" ? "#ececec"
                  : net === "website" ? "#e9ffe6" : "#f5f5fa",
                margin: "3px"
              }}>
              <img src={`/social-icons/${net}.png`}
                alt={net} style={{ width: 34, height: 34 }} />
            </div>
          )}
        </div>
        <Link to="/dashboard"
              style={{
                marginTop: "24px", display:"inline-block",
                background:"linear-gradient(90deg,#4cff81,#0ebbef 90%)",
                color:"#fff", fontWeight:900, borderRadius:20, fontSize:"1.19em",
                padding:"15px 68px", textDecoration:"none", boxShadow: "0 2px 9px #1cd2e840"
              }}
        >
          View All Services &rarr;
        </Link>
      </div>
    </div>
  );
}
