import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{
      background: "linear-gradient(112deg,#f7fff7 62%,#eafffa 100%)",
      minHeight: "100vh",
      paddingBottom: 40
    }}>
      {/* Top Navbar */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #eef5fb",
        padding: "26px 0 19px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position:"sticky",top:0,zIndex:100
      }}>
        <div style={{
          fontWeight: 900, color: "#0ad078",
          fontSize: "2em", marginLeft: 24, letterSpacing: "1.2px", fontFamily: "Poppins,sans-serif"
        }}>
          LuciXFire Panel
        </div>
        <div style={{marginRight:20, display:"flex", gap:13}}>
          <Link to="/login" style={mainBtn("#1fee7c", "#68e0ee", "#fff")}>Sign In</Link>
          <Link to="/signup" style={mainBtn("#ftc061", "#fbbf23", "#232")}>Sign Up</Link>
          <Link to="/admin" style={mainBtn("#4657fa", "#ffc805", "#fff")}>Admin</Link>
        </div>
      </nav>

      {/* Hero Block */}
      <div style={{
        maxWidth: 1150, margin: "0 auto",
        display:"flex", flexWrap:"wrap", alignItems:"center",
        gap:30, padding:"40px 6vw 20px 6vw"
      }}>
        <div style={{flex:"1 1 450px", minWidth:270}}>
          <h1 style={{
            fontSize: "2.2em", lineHeight: 1.13, fontWeight: 900,
            margin: "9px 0 15px", letterSpacing:"-1.2px", color:"#202d45"
          }}>
            Boost Your Social Media Presence<br/>
            with <span style={{ color: "#ffbe20" }}>LuciXFire Panel</span> #1
          </h1>
          <div style={{
            fontSize: "1.16em", marginBottom: 17,
            color: "#234142", lineHeight: "1.7"
          }}>
            <b>Cheapest &amp; Fastest SMM</b> services for all social media.<br/>
            Wallet, API, analytics, auto refill, 24/7 WhatsApp support.
          </div>
          <ul style={{paddingLeft:18, margin:"2px 0 25px 0", color:"#194635", fontWeight:600}}>
            <li style={{marginBottom:6}}>🌟 10+ Categories: Instagram, YouTube, Telegram, more</li>
            <li style={{marginBottom:6}}>💸 Deposit from ₹100, instant refund &amp; full trust</li>
            <li>👑 Used by 3K+ Indian resellers—API, refill, tracking</li>
          </ul>
          <Link to="/signup" style={{
            display:"inline-block", fontWeight: 700, textDecoration: "none",
            padding: "15px 46px", fontSize: "1.07em",
            background: "linear-gradient(90deg,#21e073,#fbaf09 97%)",
            color: "#fff", borderRadius: 21, marginTop:6,
            boxShadow:"0 2px 16px #2ad88513"
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

      {/* LOGIN CARD */}
      <div style={{
        maxWidth: 500,
        margin: "0 auto 35px",
        borderRadius: 29,
        background: "#fff",
        boxShadow: "0 8px 50px #c1f1ff28",
        border: "1px solid #ecf0f6",
        padding: "38px 25px 25px", position: "relative"
      }}>
        <div style={{
          fontWeight: 900, fontSize: "1.35em", letterSpacing: "-1px",
          marginBottom: 19, textAlign: "center", fontFamily: "Poppins,sans-serif"
        }}>Sign in to Your Account</div>
        <form style={{
          display:"flex", flexDirection: "column", gap: 16,
          marginBottom: 7
        }}>
          <div style={{display:"flex", gap:10, flexDirection:"row", width:"100%"}}>
            <input type="text" placeholder="Username Or Email" style={loginInput("13px 13px 13px 13px")} autoComplete="username"/>
            <input type="password" placeholder="Password" style={loginInput("13px 13px 13px 13px")} autoComplete="current-password"/>
          </div>
          <button type="button" style={mainBtn("#29ff6b", "#25e1c6", "#fff", "100%", 12)}>Sign in</button>
          <button type="button"
                  style={{...mainBtn("#FFC371", "#FF5F6D", "#fff", "100%", 12),
                    background: "linear-gradient(90deg,#FF5858,#F09819)", marginTop:0}}>
            Login with Google
          </button>
        </form>
        <div style={{
          display:"flex", flexWrap:"wrap", justifyContent: "center", alignItems: "center",
          gap: 12, fontSize: "1em", color: "#2ea385", marginTop: 6, textAlign:"center"
        }}>
          <span>Do not have an account?</span>
          <Link to="/signup" style={{ color: "#ffb103", fontWeight: 700 }}>Sign up</Link>
          <Link to="/forgot" style={{ color: "#2bbbef", marginLeft:7 }}>Forgot Password?</Link>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{maxWidth:900,margin:"0 auto 39px"}}>
        <h2 style={{
          textAlign:"center", fontWeight:900, fontSize:"1.46em",
          marginTop:14,marginBottom:28, letterSpacing:"-1px", color:"#242d43"
        }}>
          How It Works
        </h2>
        <div style={{padding:"0 10px 0 10px"}}>
          {[
            {icon: "/social-icons/account-gradient.png", title: "Create An Account & Add Balance", desc: "Create your account and deposit funds (min ₹100)."},
            {icon: "/social-icons/bag-gradient.png", title: "Select Your Targeted Service", desc: "Pick your social service from the order dashboard."},
            {icon: "/social-icons/link-gradient.png", title: "Provide Link, Quantity & Watch Results!", desc: "Paste details, preview pricing, and submit your order. Track, refill, refund, or chat live with admin anytime."}
          ].map((step, idx) => (
            <div key={step.title} style={{
              padding: "31px 13px",
              display: "flex", alignItems: "center", marginBottom: 19,
              background: "#fff", borderRadius: 19, boxShadow: "0 2px 13px #2defe013", maxWidth: 670, marginLeft: "auto", marginRight: "auto"
            }}>
              <img src={step.icon} alt="" style={{ width: 63, height: 63, marginRight: 18, borderRadius:"50%", background:"#f9fcff"}} />
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.17em", marginBottom: 2, color: "#19373a" }}>
                  {step.title}
                </div>
                <div style={{ fontSize: "1.01em", color: "#217a54", lineHeight: "1.56" }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        background: "#fff", borderRadius: 21, boxShadow: "0 4px 24px #d2f6d426",
        maxWidth: 410, margin: "0 auto 27px", padding: "26px 22px"
      }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <img src="/social-icons/calc.png" alt="" style={{ width: 38, marginRight: 13 }} />
          <span style={{ fontWeight: 900, fontSize: "1.17em", color: "#184b39" }}>726724</span>
          <span style={{ marginLeft: 12, color: "#1f1f1f" }}>Total Orders</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <img src="/social-icons/dollar.png" alt="" style={{ width: 34, marginRight: 13 }} />
          <span style={{ fontWeight: 900, fontSize: "1.1em", color: "#215991" }}>$0.001/1K</span>
          <span style={{ marginLeft: 12, color: "#1f1f1f" }}>Starting Price</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <img src="/social-icons/support.png" alt="" style={{ width: 34, marginRight: 13 }} />
          <span style={{ fontWeight: 900, fontSize: "1.11em", color: "#32cc69" }}>24/7</span>
          <span style={{ marginLeft: 12, color: "#1f1f1f" }}>Fastest Support</span>
        </div>
        <div style={{ display: "flex", alignItems: "center"}}>
          <img src="/social-icons/party.png" alt="" style={{ width: 34, marginRight: 13 }} />
          <span style={{ fontWeight: 900, fontSize: "1.11em", color: "#cc32b2" }}>3058+</span>
          <span style={{ marginLeft: 12, color: "#1f1f1f" }}>Happy Clients</span>
        </div>
      </div>

      {/* Best SMM / Rocket / Services */}
      <div style={{
        background: "linear-gradient(90deg,#fefd8b 10%,#2cfcb1 100%)",
        borderRadius:"32px", maxWidth:900, margin:"32px auto 32px", boxShadow:"0 0 44px #41ffd711", padding:"18px 17px 27px"
      }}>
        <div style={{display:"flex", flexWrap:"wrap", alignItems:"center",gap:23,justifyContent:"center"}}>
          <img src="/rocket-hero.png" alt="" style={{
            width:80, height:80, borderRadius:"50%", boxShadow:"0 1px 12px #e9e9ee", background:"#fff"
          }} />
          <div>
            <h3 style={{margin:"9px 0 7px 0",color:"#1fad59",fontWeight:900,fontSize:"1.17em"}}>Best SMM Panel For Resellers</h3>
            <div style={{fontWeight:600,fontSize:"1.06em",marginBottom:7, color:"#2d363a"}}>
              Cheapest, top-rated Indian reseller SMM panel. Wallet from ₹100, full analytics.<br/>
            </div>
            <Link style={{
              color:"#fff", background:"linear-gradient(90deg,#ff9107,#13d596)", borderRadius:14, padding:"12px 31px",
              fontWeight:700, fontSize:"1.05em", textDecoration:"none", boxShadow:"0 2px 12px #39e4b825"
            }} to="/signup">Create Account</Link>
          </div>
        </div>
        {/* Big Circular Service Grid */}
        <div style={{
          display:"flex",flexWrap:"wrap",justifyContent:"center",gap:18,marginTop:23
        }}>
          {["instagram","facebook","youtube","telegram","twitter","tiktok","linkedin","discord","web"].map((name) =>
            <div key={name} style={{
              width:59,height:59,borderRadius:36,display:"flex",alignItems:"center",justifyContent:"center",
              background:"#f8ffff", boxShadow:"0 0 10px #1affed10", margin:"3px"
            }}>
              <img src={`/social-icons/${name}.png`} style={{width:34,height:34}} alt={name}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- BUTTON & INPUT STYLE HELPERS ---

function mainBtn(col1, col2, txt, width="auto", radius=13) {
  return {
    background: `linear-gradient(90deg,${col1},${col2})`,
    color: txt,
    borderRadius: radius,
    fontWeight: 700,
    padding: "13px 38px",
    fontSize: "1.09em",
    border: "none",
    textDecoration: "none",
    boxShadow: "0 2px 14px #1ae7fc17",
    cursor: "pointer",
    width,
    transition: "filter .12s"
  };
}

function loginInput(pad="14px 14px") {
  return {
    width: "100%",
    borderRadius: "12px",
    border: "1.2px solid #e2e6ee",
    background: "#fafdff",
    padding: pad,
    fontSize: "1.1em",
    fontWeight: 600,
    outline: "none"
  };
}
