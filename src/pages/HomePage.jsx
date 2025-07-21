import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram, FaFacebookF, FaYoutube, FaTelegramPlane, FaTwitter, FaTiktok,
  FaSpotify, FaLinkedinIn, FaDiscord, FaGlobe, FaUserAlt, FaLock, FaWhatsapp
} from "react-icons/fa";

// Social service icon/branding grid for the section at the bottom
const socialServices = [
  { label: "Instagram", icon: <FaInstagram color="#E4405F" />, bg: "#fff3f8" },
  { label: "Facebook", icon: <FaFacebookF color="#1877F3" />, bg: "#f0f7ff" },
  { label: "YouTube", icon: <FaYoutube color="#FF0000" />, bg: "#fff5f3" },
  { label: "Telegram", icon: <FaTelegramPlane color="#229ED9" />, bg: "#f1f9ff" },
  { label: "Twitter", icon: <FaTwitter color="#1D9BF0" />, bg: "#f3faff" },
  { label: "Tiktok", icon: <FaTiktok color="#000" />, bg: "#f5f5f5" },
  { label: "Spotify", icon: <FaSpotify color="#1ED760" />, bg: "#f8fff3" },
  { label: "LinkedIn", icon: <FaLinkedinIn color="#0A66C2" />, bg: "#f4f6fa" },
  { label: "Discord", icon: <FaDiscord color="#5865F2" />, bg: "#f6f4ff" },
  { label: "Website", icon: <FaGlobe color="#2CC45C" />, bg: "#f7fdf6" }
];

export default function HomePage() {
  return (
    <div style={{
      background: "linear-gradient(112deg,#f7fff7 62%,#eafffa 100%)",
      minHeight: "100vh",
      paddingBottom: 40
    }}>
      {/* Navbar */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #eef5fb",
        padding: "26px 0 19px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position:"sticky",top:0,zIndex:100
      }}>
        <div style={{
          fontWeight: 900, color: "#16b687", fontSize: "2em",
          marginLeft: 24, letterSpacing: "1.2px",
          fontFamily: "Poppins,sans-serif", display: "flex", alignItems: "center"
        }}>
          <img src="/logo.png" alt="LuciXFire Panel Logo"
               style={{height:48, width:48, borderRadius:12, marginRight:16, background:"#fff"}} />
          LuciXFire Panel
        </div>
        <div style={{marginRight:20, display:"flex", gap:13}}>
          <Link to="/login" style={{
            background: "linear-gradient(92deg,#26e47a 6%,#3fd7ef 94%)",
            color: "#fff", padding: "12px 32px", borderRadius: "16px",
            fontWeight: 700, fontSize: "1.13em", textDecoration: "none", border: "none"
          }}>Sign In</Link>
          <Link to="/signup" style={{
            background: "linear-gradient(90deg,#ffbe23 4%,#13e97a 98%)",
            color: "#fff", padding: "12px 32px", borderRadius: "16px",
            fontWeight: 700, fontSize: "1.13em", textDecoration: "none", border: "none"
          }}>Sign Up</Link>
          <Link to="/admin" style={{
            background: "linear-gradient(92deg,#372ae2 7%,#f9c004 91%)",
            color: "#fff", padding: "12px 32px", borderRadius: "16px",
            fontWeight: 700, fontSize: "1.13em", textDecoration: "none", border: "none"
          }}>Admin</Link>
        </div>
      </nav>
      
      {/* Hero */}
      <div style={{
        maxWidth: 1150, margin: "0 auto",
        display:"flex", flexWrap:"wrap", alignItems:"center",
        gap:30, padding:"32px 6vw 15px 6vw"
      }}>
        <div style={{flex:"1 1 440px", minWidth:270}}>
          <h1 style={{
            fontSize: "2.05em", lineHeight: 1.16, fontWeight: 900,
            margin: "15px 0 14px", letterSpacing:"-1.0px", color:"#202d45"
          }}>
            Boost Your Social Media Presence<br/>
            with <span style={{ color: "#ffbe20" }}>LuciXFire Panel</span> <span style={{fontSize:"1.1em"}}>#1</span>
          </h1>
          <div style={{
            fontWeight:"600",
            fontSize: "1.16em", marginBottom: 19,
            color: "#22493b", lineHeight: "1.66"
          }}>
            Cheapest &amp; fastest SMM platform for influencers, agencies, and marketers.<br/>
            Wallet, API, instant analytics, <b>auto refill</b>, real admin, <span style={{ color: "#19cc9b" }}>24/7 WhatsApp</span>.
          </div>
          <ul style={{paddingLeft:19, margin:"-2px 0 26px 0", color:"#144131", fontWeight:600, fontSize:"1.06em"}}>
            <li style={{marginBottom:8}}>🌟 10+ Categories: Instagram, YouTube, Telegram, more</li>
            <li style={{marginBottom:8}}>💸 Deposit from ₹100, refund guaranteed</li>
            <li>👑 Trusted by 3000+ Indian resellers. Track and refill any order.</li>
          </ul>
          <Link to="/signup" style={{
            display:"inline-block", fontWeight: 700, textDecoration: "none",
            padding: "15px 46px", fontSize: "1.07em",
            background: "linear-gradient(90deg,#21e073,#fbaf09 97%)",
            color: "#fff", borderRadius: 21, marginTop:7,
            boxShadow: "0 2px 16px #2ad88513"
          }}>
            Sign Up Today
          </Link>
        </div>
        <div style={{
          flex:"1 1 320px", display:"flex", justifyContent:"center", minHeight:220
        }}>
          <img
            src="/mobile-likes.png"
            alt="LuciXFire Hero"
            style={{
              maxWidth:"270px", width:"88vw", borderRadius:"33px",
              boxShadow:"0 7px 28px #2abaab18", background:"#fff"
            }}
          />
        </div>
      </div>

      {/* Login Card */}
      <div style={{
        maxWidth: 520,
        margin: "0 auto 35px",
        borderRadius: 29,
        background: "#fff",
        boxShadow: "0 12px 44px #d2f9ef26",
        border: "1px solid #ecf0f6",
        padding: "36px 23px 24px"
      }}>
        <div style={{
          fontWeight: 900, fontSize: "1.32em", letterSpacing: "-1px", marginBottom: 20, textAlign: "center"
        }}>Sign in to Your Account</div>
        <form style={{
          display:"flex", flexDirection: "column", gap: 16,
          marginBottom: 9
        }}>
          <input type="text" placeholder="Username Or Email"
            style={{
              width: "100%",
              borderRadius: "11px",
              border: "1.3px solid #e2e6ee",
              background: "#fafdff",
              padding: "15px 14px",
              fontSize: "1.09em",
              fontWeight: 600,
              outline: "none"
            }} autoComplete="username"/>
          <input type="password" placeholder="Password"
            style={{
              width: "100%",
              borderRadius: "11px",
              border: "1.3px solid #e2e6ee",
              background: "#fafdff",
              padding: "15px 14px",
              fontSize: "1.09em",
              fontWeight: 600,
              outline: "none"
            }} autoComplete="current-password"/>
          <button type="button" style={{
            background: "linear-gradient(90deg,#19f477,#0aa06b 97%)",
            color: "#fff",
            borderRadius: "11px",
            fontWeight: 900,
            fontSize: "1.11em",
            padding: "13px 0",
            width: "100%",
            marginBottom: 7,
            border: "none"
          }}>Sign In</button>
          <button type="button" style={{
            background: "linear-gradient(90deg,#FF5858,#F09819)",
            color: "#fff",
            borderRadius: "11px",
            fontWeight: 900,
            fontSize: "1.11em",
            padding: "13px 0",
            width: "100%",
            border: "none"
          }}>Login with Google</button>
        </form>
        <div style={{
          display:"flex", flexWrap:"wrap", justifyContent: "center", alignItems: "center",
          gap: 12, fontSize: "1em", color: "#30a366", marginTop: 8, textAlign:"center"
        }}>
          <span>Do not have an account?</span>
          <Link to="/signup" style={{ color: "#ffa703", fontWeight: 700 }}>Sign up</Link>
          <Link to="/forgot" style={{ color: "#2bbbef", marginLeft: 7 }}>Forgot Password?</Link>
        </div>
      </div>

      {/* How It Works */}
      <div style={{ maxWidth:900, margin:"0 auto 39px" }}>
        <h2 style={{
          textAlign:"center", fontWeight:900, fontSize:"1.46em",
          marginTop:14,marginBottom:28, letterSpacing:"-1px", color:"#242d43"
        }}>
          How It Works
        </h2>
        <div style={{padding:"0 10px 0 10px"}}>
          <div style={{
            padding: "28px 10px", display: "flex", alignItems: "center", marginBottom: 20,
            background: "#fff", borderRadius: 19, boxShadow: "0 2px 13px #2defe013", maxWidth: 670, marginLeft: "auto", marginRight: "auto"
          }}>
            <span style={{fontSize:"2.2em",marginRight:20}}>
              <FaUserAlt color="#21e073"/>
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.11em", marginBottom: 2, color: "#19373a" }}>
                Create An Account &amp; Add Balance
              </div>
              <div style={{ fontSize: ".99em", color: "#217a54", lineHeight: "1.52" }}>
                Create your account and deposit funds (min ₹100).
              </div>
            </div>
          </div>
          <div style={{
            padding: "28px 10px", display: "flex", alignItems: "center", marginBottom: 20,
            background: "#fff", borderRadius: 19, boxShadow: "0 2px 13px #2defe013", maxWidth: 670, marginLeft: "auto", marginRight: "auto"
          }}>
            <span style={{fontSize:"2.2em",marginRight:20}}>
              <FaLock color="#ffbe23"/>
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.11em", marginBottom: 2, color: "#19373a" }}>
                Select Your Targeted Service
              </div>
              <div style={{ fontSize: ".99em", color: "#217a54", lineHeight: "1.52" }}>
                Pick your social service from the order dashboard.
              </div>
            </div>
          </div>
          <div style={{
            padding: "28px 10px", display: "flex", alignItems: "center", marginBottom: 20,
            background: "#fff", borderRadius: 19, boxShadow: "0 2px 13px #2defe013", maxWidth: 670, marginLeft: "auto", marginRight: "auto"
          }}>
            <span style={{fontSize:"2.2em",marginRight:20}}>
              <FaWhatsapp color="#21e073"/>
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.11em", marginBottom: 2, color: "#19373a" }}>
                Provide Link, Quantity &amp; Watch Results!
              </div>
              <div style={{ fontSize: ".99em", color: "#217a54", lineHeight: "1.52" }}>
                Paste details, preview pricing, and submit. Track, refill, refund, or chat with admin anytime.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        background: "#fff", borderRadius: 21, boxShadow: "0 4px 24px #d2f6d426",
        maxWidth: 410, margin: "0 auto 27px", padding: "26px 22px"
      }}>
        {/* ...stats as in your code... */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <span style={{fontSize:"2em",marginRight:13}}>🧾</span>
          <span style={{ fontWeight: 900, fontSize: "1.17em", color: "#184b39" }}>726724</span>
          <span style={{ marginLeft: 12, color: "#1f1f1f" }}>Total Orders</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <span style={{fontSize:"2em",marginRight:13}}>💸</span>
          <span style={{ fontWeight: 900, fontSize: "1.10em", color: "#215991" }}>$0.001/1K</span>
          <span style={{ marginLeft: 12, color: "#1f1f1f" }}>Starting Price</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <span style={{fontSize:"2em",marginRight:13}}>💬</span>
          <span style={{ fontWeight: 900, fontSize: "1.11em", color: "#32cc69" }}>24/7</span>
          <span style={{ marginLeft: 12, color: "#1f1f1f" }}>Fastest Support</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{fontSize:"2em",marginRight:13}}>🎉</span>
          <span style={{ fontWeight: 900, fontSize: "1.11em", color: "#cc32b2" }}>3058+</span>
          <span style={{ marginLeft: 12, color: "#1f1f1f" }}>Happy Clients</span>
        </div>
      </div>

      {/* Services Grid Section */}
      <div style={{ maxWidth:900, margin:"53px auto 32px",textAlign:"center" }}>
        <h2 style={{ fontWeight:900, fontSize:"2em", marginBottom:8 }}>Top SMM Services We Provide</h2>
        <div style={{
          display:"flex",flexWrap:"wrap",justifyContent:"center",gap:22,marginTop:13
        }}>
          {socialServices.map(({label,icon,bg}) =>
            <div key={label} style={{
              width:64, height:64, borderRadius:32, background: bg,
              display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 11px #22ffee08", margin:"2px"
            }}>
              <span style={{fontSize:"2em"}} title={label}>{icon}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
