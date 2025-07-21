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
          fontWeight: 900, color: "#16b687",
          fontSize: "2em", marginLeft: 24, letterSpacing: "1.2px", fontFamily: "Poppins,sans-serif"
        }}>
          LuciXFire Panel
        </div>
        <div style={{marginRight:20, display:"flex", gap:13}}>
          {/* All nav buttons are bold colorful gradients */}
          <Link to="/login" style={{
            background: "linear-gradient(92deg,#26e47a 6%,#3fd7ef 94%)",
            color: "#fff", padding: "12px 32px",
            borderRadius: "16px", fontWeight: 700, fontSize: "1.13em",
            textDecoration: "none", boxShadow: "0 2px 11px #13f6ea10", border: "none"
          }}>Sign In</Link>
          <Link to="/signup" style={{
            background: "linear-gradient(90deg,#ffbe23 4%,#13e97a 98%)",
            color: "#fff", padding: "12px 32px",
            borderRadius: "16px", fontWeight: 700, fontSize: "1.13em",
            textDecoration: "none", boxShadow: "0 2px 11px #fae94814", border: "none"
          }}>Sign Up</Link>
          <Link to="/admin" style={{
            background: "linear-gradient(92deg,#372ae2 7%,#f9c004 91%)",
            color: "#fff", padding: "12px 32px",
            borderRadius: "16px", fontWeight: 700, fontSize: "1.13em",
            textDecoration: "none", boxShadow: "0 2px 11px #bfc9ff10", border: "none"
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

      {/* LOGIN CARD */}
      <div style={{
        maxWidth: 520,
        margin: "0 auto 35px",
        borderRadius: 29,
        background: "#fff",
        boxShadow: "0 12px 44px #d2f9ef26",
        border: "1px solid #ecf0f6",
        padding: "36px 23px 24px", position: "relative"
      }}>
        <div style={{
          fontWeight: 900, fontSize: "1.32em", letterSpacing: "-1px",
          marginBottom: 20, textAlign: "center", fontFamily: "Poppins,sans-serif"
        }}>Sign in to Your Account</div>
        <form style={{
          display:"flex", flexDirection: "column", gap: 16, marginBottom: 9
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
          {/* Error message here if needed:
          <div style={{color:"#fa3c53",fontWeight:700,textAlign:"center"}}>❌ Invalid password</div>*/}
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
