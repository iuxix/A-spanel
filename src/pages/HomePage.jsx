import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{background: "linear-gradient(112deg,#f2faf7 60%,#eafaff 100%)", minHeight: "100vh", paddingBottom: 32}}>
      {/* Top Navbar */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #eef5fb",
        padding: "22px 0 20px 0", boxShadow: "0 2px 13px #36f9ff0c",
        display: "flex", alignItems: "center", justifyContent: "space-between", position:"sticky",top:0,zIndex:100
      }}>
        <div style={{
          fontWeight: 900, color: "#18c7b4",
          fontSize: "2em", marginLeft: 24, letterSpacing: "1.2px"
        }}>
          LuciXFire Panel
        </div>
        <div style={{marginRight:"16px", display:"flex", gap:"13px"}}>
          <Link to="/login" className="main-btn green">Sign In</Link>
          <Link to="/signup" className="main-btn yellow">Sign Up</Link>
          <Link to="/admin" className="main-btn dark">Admin</Link>
        </div>
      </nav>
      {/* Hero */}
      <div style={{
        maxWidth:1160, margin:"0 auto", display:"flex", flexWrap:"wrap", alignItems:"center", gap:30, padding:"55px 6vw 20px 6vw"
      }}>
        <div style={{ flex:"1 1 425px", minWidth:270 }}>
          <h1 style={{ fontSize: "2.2em", lineHeight: 1.13, fontWeight: 900, margin: "7px 0 18px", letterSpacing: "-2px" }}>
            Boost Your Social Media Presence<br/>with <span style={{ color: "#f6b702" }}>LuciXFire Panel</span> #1
          </h1>
          <span style={{
            display: "block", fontSize: "1.1em", marginBottom: 17,
            color: "#133152", lineHeight: "1.72"
          }}>
            <b>Cheapest &amp; Fastest SMM</b> services for all social media.<br/>
            Auto wallet, API, full order analytics &amp; live support.
          </span>
          <ul style={{ paddingLeft: 18, margin: "2px 0 28px 0", color: "#183441" }}>
            <li style={{marginBottom:7}}>🌟 10+ Categories: Instagram, YouTube, Telegram, more</li>
            <li style={{marginBottom:7}}>💸 Deposit from ₹100, instant refund &amp; 24/7 WhatsApp</li>
            <li>👑 Used by 3000+ Indian resellers — auto refill, order tracking</li>
          </ul>
          <Link to="/signup" className="main-btn yellow" style={{ fontSize:"1.09em", padding:"14px 49px", fontWeight:700 }}>Sign Up Free</Link>
        </div>
        <div style={{ flex:"1 1 330px", display:"flex", justifyContent:"center",alignItems:"center"}}>
          <img
            src="/rocket-hero.png"
            alt="LuciXFire Panel Rocket"
            style={{
              maxWidth:"270px", width:"88vw", borderRadius:"33px",
              boxShadow:"0 7px 28px #2abaab32", background:"#fff"
            }}
          />
        </div>
      </div>
      {/* Custom Auth Card */}
      <div style={{
        maxWidth:470, margin:"0 auto 26px",borderRadius:31,background:"#fff",boxShadow:"0 4px 39px #cef8ff19", padding:"33px 18px",border:"1px solid #edeff6"
      }}>
        <div style={{fontWeight:900, fontSize:"1.3em", letterSpacing: "-1px", marginBottom: 9, textAlign:"center"}}>
          Sign in to Your Account
        </div>
        <form>
          <div style={{display:"flex",gap:10,marginBottom:11}}>
            <input placeholder="Username Or Email" style={authInput}/>
            <input placeholder="Password" type="password" style={authInput}/>
          </div>
          <div style={{display:"flex",gap:14,marginBottom:10}}>
            <button type="button" className="main-btn green" style={{flex:1}}>Sign In</button>
            <button type="button" className="main-btn" style={{
              flex:1, background:"linear-gradient(90deg,#FF5858,#F09819)",color:"#fff"
            }}>Login with Google</button>
          </div>
        </form>
        <div style={{
          display:"flex",justifyContent:"center",alignItems:"center",gap:10,
          fontSize:"1em", color:"#2ea385"
        }}>
          <span>Do not have an account?</span>
          <Link to="/signup" style={{color:"#f6b702",fontWeight:600}}>Sign up</Link>
          <Link to="/forgot" style={{color:"#2bbbef",marginLeft:8}}>Forgot Password?</Link>
        </div>
      </div>
      {/* "How It Works" Vertical Timeline */}
      <div style={{maxWidth:930,margin:"0 auto 40px"}}>
        <h2 style={{textAlign:"center",fontWeight:900,fontSize:"1.51em",marginTop:9,marginBottom:19}}>How It Works</h2>
        <div style={{padding:"0 13px"}}>
          {[
            {
              icon:"/social-icons/account-gradient.png",
              title: "Create An Account & Add Balance",
              desc: "Begin your journey by signing up and creating your account. To get started, deposit funds (min ₹100)."
            },
            {
              icon:"/social-icons/bag-gradient.png",
              title: "Select Your Targeted Service",
              desc: "Choose your services from the Services/New Order section. Find and order as needed."
            },
            {
              icon:"/social-icons/link-gradient.png",
              title: "Provide Link, Quantity & Watch Results!",
              desc: "Paste links, pick quantity, view total cost. Track, refill, or refund any order (live admin support too)."
            }
          ].map((step, idx) =>
            <div key={step.title} style={{
              padding: "29px 10px", display:"flex", alignItems:"center", marginBottom:11,
              background:"#fff", borderRadius:23, boxShadow:"0 2px 14px #23efe013",maxWidth:650,marginLeft:"auto",marginRight:"auto"
            }}>
              <img src={step.icon} alt="" style={{width:59,height:59,marginRight:15}}/>
              <div>
                <div style={{fontWeight:700,fontSize:"1.13em",marginBottom:1}}>{step.title}</div>
                <div style={{fontSize:".99em",color:"#306134",lineHeight:"1.5"}}>{step.desc}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Orange/Green Info Card and SMM Services */}
      <div style={{background:"linear-gradient(90deg,#fef698 20%,#39e4b8 100%)", borderRadius:"32px",maxWidth:950,margin:"30px auto 32px",boxShadow:"0 0 44px #41ffd711",padding:"16px 16px 29px 16px"}}>
        <div style={{display:"flex", flexWrap:"wrap", alignItems:"center",gap:23,justifyContent:"center"}}>
          <img src="/likephone.png" style={{
            width:75,height:75,borderRadius:"50%",boxShadow:"0 2px 17px #eee9",background:"#fff"}}
          />
          <div>
            <h3 style={{margin:"8px 0 5px 0",color:"#1ead59",fontWeight:900,fontSize:"1.22em"}}>Best SMM Panel For Resellers</h3>
            <div style={{fontWeight:600,fontSize:"1.07em",marginBottom:7}}>Cheapest, most powerful Indian reseller SMM panel. Deposit ₹100+, try any service.</div>
            <Link style={{
              color:"#fff",background:"linear-gradient(90deg,#ff9137,#12de8b)",borderRadius:13,padding:"11px 27px",
              fontWeight:700, fontSize:"1.07em",textDecoration:"none", boxShadow:"0 2px 9px #39e4b819"
            }} to="/signup">Create Account</Link>
          </div>
        </div>
      </div>
      {/* Live Stats */}
      <div style={{
        display:"flex", flexWrap:"wrap",justifyContent:"center",alignItems:"center",
        background:"#fff", maxWidth:1100, margin:"15px auto 0", borderRadius:21, boxShadow:"0 2px 9px #46f0aa12"
      }}>
        {[
          { icon:"/social-icons/calc.png", value:"726724", label:"Total Orders" },
          { icon:"/social-icons/dollar.png", value:"$0.001/1K", label:"Starting Price" },
          { icon:"/social-icons/support.png", value:"24/7", label:"Fastest Support" },
          { icon:"/social-icons/party.png", value:"3058+", label:"Happy Clients" }
        ].map((stat, idx) =>
          <div key={stat.label} style={{padding:"24px 35px",fontSize:"1.13em",display:"flex",alignItems:"center"}}>
            <img src={stat.icon} style={{width:33,marginRight:13}} />
            <span>
              <b style={{fontSize:"1.15em"}}>{stat.value}</b>
              <br/><span style={{color:"#12ace7",fontWeight:700}}>{stat.label}</span>
            </span>
          </div>
        )}
      </div>
      {/* SMM Service grid */}
      <div style={{ maxWidth:1080, margin:"35px auto 45px" }}>
        <h2 style={{ fontWeight:900, fontSize:"2em", textAlign:"center",marginBottom:7 }}>Top SMM Services We Provide</h2>
        <p style={{textAlign:"center",color:"#25526a",marginBottom:12,fontSize:"1.08em"}}>
          Instagram, Facebook, YouTube, Telegram, Twitter, Tiktok, LinkedIn, Discord, Website traffic and more—plus refills, refunds, API, 24/7.
        </p>
        <div style={{
          display:"flex",flexWrap:"wrap",justifyContent:"center",gap:19,marginTop:9
        }}>
          {["instagram","facebook","youtube","telegram","twitter","tiktok","linkedin","discord","web"].map((name) =>
            <div key={name} style={{
              width:59,height:59,borderRadius:36,display:"flex",alignItems:"center",justifyContent:"center",
              background:"#f8ffff", boxShadow:"0 0 9px #1affed0a",
              margin:"3px"
            }}>
              <img src={`/social-icons/${name}.png`} style={{width:34,height:34}} alt={name}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const authInput = {
  flex:1,
  borderRadius:"10px",
  border:"1px solid #e2e6ee",
  background:"#fafdff",
  padding:"14px 13px",
  fontSize:"1.1em",
  fontWeight:700
};
