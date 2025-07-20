import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{
      background: "linear-gradient(112deg,#f2fff9 60%,#e5f5fa 100%)",
      minHeight: "100vh",
      paddingBottom: 40
    }}>
      {/* NAVBAR */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #f3f7fb",
        padding: "20px 0 17px 0",
        marginBottom: 0,
        boxShadow: "0 1px 12px #c6eaff17",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ fontWeight: 900, color: "#29e9e2", fontSize: "2em", marginLeft: 22, letterSpacing: 1.2 }}>
          LuciXFire Panel
        </div>
        <div style={{marginRight:15}}>
          <Link to="/login" style={{
            background: "linear-gradient(90deg,#17deb0,#6ddcff)",
            color: "#fff", borderRadius: 19, fontWeight: 700, fontSize: "1.12em",
            padding: "10px 30px", marginRight: 9, textDecoration: "none", boxShadow: "0 2px 6px #10f8ff12"
          }}>Sign In</Link>
          <Link to="/signup" style={{
            background: "linear-gradient(90deg,#fed700,#39fa7c 98%)",
            color: "#222", borderRadius: 19, fontWeight: 700, fontSize: "1.12em",
            padding: "10px 30px", marginRight: 9, textDecoration: "none"
          }}>Sign Up</Link>
          <Link to="/admin" style={{
            background: "linear-gradient(90deg,#5e22ec 14%,#ffad05 97%)",
            color: "#fff", borderRadius: 19, fontWeight: 700, fontSize: "1.12em",
            padding: "10px 22px", textDecoration: "none"
          }}>Admin Login</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        maxWidth: 1160, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 30, padding: "46px 6vw 30px 6vw"
      }}>
        <div style={{ flex: "1 1 400px", minWidth: 270 }}>
          <h1 style={{ fontSize: "2.3em", lineHeight: 1.14, fontWeight: 800, margin: "7px 0 22px", letterSpacing: -2 }}>
            Boost Your Social Media Presence <span style={{ color: "#24e07c" }}>⚡</span> <br />
            with LuciXFire Panel #1
          </h1>
          <div style={{ fontSize: "1.16em", marginBottom: 21, color: "#1b2c67", lineHeight: 1.63 }}>
            LuciXFire Panel is your one stop for rapid, affordable, all-in-one Social Media Marketing.<br />
            <b>Wallet, instant stats, refill automation, and real-time admin approval — for resellers and brands.</b>
          </div>
          <ul style={{ paddingLeft: 23, margin: "0 0 30px 0", color: "#172928" }}>
            <li style={{ marginBottom: 8 }}>🌟 10+ Categories: Instagram, YouTube, Telegram &amp; more</li>
            <li style={{ marginBottom: 8 }}>💸 Instant top-up and secure refund system</li>
            <li style={{ marginBottom: 8 }}>🛡️ Admin-monitored, live support, zero downtime</li>
            <li>💬 24/7 WhatsApp API support</li>
          </ul>
          <Link to="/signup" style={{
            background: "linear-gradient(90deg,#feda4a,#18d381 90%)",
            color: "#093f14", borderRadius: 21, fontWeight: 900, fontSize: "1.17em",
            padding: "13px 45px", textDecoration: "none", letterSpacing: "1px", boxShadow: "0 2px 16px #2ad88518"
          }}>Create Free Account 🚀</Link>
        </div>
        <div style={{
          flex: "1 1 320px", display:"flex", justifyContent: "center",
          paddingTop:12, minHeight:250
        }}>
          {/* Make sure the image exists in /public! */}
          <img
            src="/mobile-likes.png"
            style={{ maxWidth: "300px", width: "93vw", borderRadius: "40px", boxShadow: "0 6px 34px #15ffbf14", background:"#fff" }}
            alt="LuciXFire Panel Hero" />
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background:"#fff", padding:"37px 0 27px 0", marginTop:32 }}>
        <h2 style={{textAlign:"center", fontWeight:900, marginBottom:25}}>How It Works</h2>
        <div style={{
          maxWidth:1100, margin:"0 auto", display:"flex", flexWrap: "wrap", justifyContent:"space-around", gap:33
        }}>
          {[
            {
              title: "Create an Account & Add Balance",
              icon: "📝",
              desc: "Register, deposit minimum ₹100+ by UPI/QR, and get your wallet activated."
            },
            {
              title: "Select Your Social Service",
              icon: "🎯",
              desc: "Browse, search & pick real followers, views or members for any social platform."
            },
            {
              title: "Paste Details & Watch Results",
              icon: "🚀",
              desc: "Paste link, set quantity, submit order! Track & chat with admin live any time."
            }
          ].map((step, idx) =>
            <div key={idx} style={{
              background: "#f7fcff",
              borderRadius: 20,
              boxShadow: "0 2px 18px #91ffc418",
              padding: "29px 30px",
              minWidth: 220,
              maxWidth: 340,
              flex:"1 1 260px", marginBottom:19, textAlign:"center"
            }}>
              <div style={{fontSize:"2.4em",marginBottom:14}}>{step.icon}</div>
              <div style={{fontWeight:700, fontSize:"1.16em", marginBottom:6}}>{step.title}</div>
              <div style={{color:"#1f7d49",fontSize:"1em"}}>{step.desc}</div>
            </div>
          )}
        </div>
      </div>

      {/* SOCIAL HERO + STATS */}
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center",
        background: "#fff", maxWidth: 1100, margin: "35px auto 0", borderRadius: 22, boxShadow: "0 2px 12px #1dfbe922"
      }}>
        <img src="/rocket-hero.png"
            alt="Smart SMM"
            style={{width:110,margin:"35px 23px"}} />
        <div>
          <div style={{fontWeight:900,fontSize:"1.41em",margin:"12px 0 9px"}}>Best SMM Panel For Agencies & Resellers</div>
          <div style={{color:"#1a4a59",fontSize:"1em",marginBottom:13}}>
            LuciXFire helps agencies &amp; social media pros manage clients easier.<br/>
            Fully automated, trusted by 3k+ Indian resellers.<br/>
            <span style={{color:'#10db5b'}}>Try us now—just ₹100 deposit!</span>
          </div>
          <Link to="/dashboard"
                style={{
                  background:"linear-gradient(90deg,#23e156,#16ccfa 97%)",
                  color:"#fff", fontWeight:800, borderRadius:19, fontSize:"1.07em",
                  padding:"11px 38px", textDecoration:"none"
                }}
          >See Dashboard Examples</Link>
        </div>
      </div>

      {/* Large Feature Icons (bottom) */}
      <div style={{maxWidth:1180,margin:"60px auto 35px",textAlign:"center",padding:"0 16px"}}>
        <h2 style={{fontWeight:900,letterSpacing: "-2px",fontSize:"2.1em",marginBottom:15,marginTop:0}}>Why LuciXFire Panel?</h2>
        <div style={{ fontSize: "1.14em", color: "#0d314c", marginBottom: "17px" }}>
          Trusted by creators, agencies, and business owners for <b>platform reach, brand authenticity,</b> and <b>growth support</b>.<br/>
          Fully refilled, fast support, bot-free, on mobile and desktop—try us free!
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 25, marginTop:18 }}>
          {["Instagram","Facebook","YouTube","Telegram","Twitter","Tiktok","LinkedIn","Discord"].map((net, idx) =>
            <div key={net}
              style={{
                width: 62, height: 62, borderRadius: 33, display: "flex", alignItems: "center", justifyContent: "center",
                background: "#fff", margin: "3px", boxShadow: "0 0 9px #18b6ef11"
              }}>
              <img src={`/social-icons/${net.toLowerCase()}.png`}
                alt={net} style={{ width: 35, height: 35 }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
