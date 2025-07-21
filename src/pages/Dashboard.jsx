import React, { useState } from "react";
import { FaWallet, FaUser, FaCogs, FaHistory, FaPlus, FaCreditCard } from "react-icons/fa";

const QR_URL = "https://files.catbox.moe/r3twin.jpg";
const DASH_COLOR = "#18b795";
const PANEL_NAME = "LuciXFire Panel";

export default function Dashboard() {
  const [showFunds, setShowFunds] = useState(false);

  return (
    <div style={{
      background: "linear-gradient(112deg,#eefcf7 67%,#f4fafe 100%)",
      minHeight: "100vh",
      fontFamily: "Poppins, sans-serif",
      color: "#173444",
      padding: 0,
      minWidth: 340
    }}>
      {/* Header */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #e0efe7",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "21px 28px 20px 28px",
        boxShadow: "0 2px 16px #1be88510",
        position: "sticky", top: 0, zIndex: 13
      }}>
        <div style={{
          fontWeight: 900, color: DASH_COLOR, fontSize: "2.06em", letterSpacing: ".5px", display: "flex", alignItems: "center"
        }}>
          <img src="/logo.png" alt="logo" style={{height:44,marginRight:15,borderRadius:8,background:"#fff"}} />
          {PANEL_NAME}
        </div>
        <div style={{display:"flex",gap:18,alignItems:"center"}}>
          <div style={{
            color: "#2cd27c", background: "#e9fff6", borderRadius: 15,
            padding: "10px 25px", fontWeight: 700, fontSize: "1.13em", display:"flex",alignItems:"center",boxShadow:"0 1.5px 14px #19feb024"
          }}>
            <FaWallet color="#18b795" style={{marginRight:10}} />
            ₹3,180.00
          </div>
          <button style={{
            background: `linear-gradient(90deg,${DASH_COLOR},#fbcb0a 70%)`,
            color: "#fff", border: "none", borderRadius: 12, padding: "10px 21px",
            fontWeight: 800, fontSize: "1.14em", boxShadow: "0 2px 11px #15ffc015", cursor:"pointer"
          }} onClick={() => setShowFunds(true)}>
            <FaPlus style={{marginBottom:-3,marginRight:9}} /> Add Funds
          </button>
          <div style={{ display:"flex",gap:13,alignItems:"center" }}>
            <button style={{
              fontSize:"1.08em",color:"#68a1fb",background:"none",border:"none",borderRadius:8,padding:"10px 12px",cursor:"pointer"
            }}>
              <FaHistory />
            </button>
            <button style={{
              fontSize:"1.08em",color:"#26bb77",background:"none",border:"none",borderRadius:8,padding:"10px 12px",cursor:"pointer"
            }}>
              <FaUser />
            </button>
            <button style={{
              fontSize:"1.08em",color:"#ffa13c",background:"none",border:"none",borderRadius:8,padding:"10px 12px",cursor:"pointer"
            }}>
              <FaCogs />
            </button>
          </div>
        </div>
      </nav>

      {/* Welcome Banner */}
      <div style={{
        background: `linear-gradient(93deg,${DASH_COLOR} 50%,#058fff 104%)`,
        color:"#fff",borderRadius:18,
        margin: "34px auto 0 auto", maxWidth:800, padding:"38px 30px 27px 44px",boxShadow:"0 4px 30px #13cfc939",
        display:"flex",alignItems:"center",gap:52
      }}>
        <div>
          <div style={{fontWeight:800,fontSize:"2.1em",marginBottom:4}}>
            Welcome to <span style={{color:"#fffb85"}}>{PANEL_NAME}</span>
          </div>
          <div style={{opacity:.97,fontWeight:500,marginBottom:8}}>
            Complete SMM dashboard: place orders, track wallet, and see analytic stats in one click!<br/>
            <span style={{fontWeight:700,color:"#fff"}}>Start a new order or top up your wallet.</span>
          </div>
          <div style={{display:"flex",gap:19,marginTop:16}}>
            <button style={{
              background: "linear-gradient(93deg,#fbf241,#2de398 90%)",
              color:"#232",fontWeight:800,fontSize:"1.1em",border:"none",borderRadius:11,padding:"10px 31px",cursor:"pointer"
            }}>
              New Order
            </button>
            <button style={{
              background: "linear-gradient(92deg,#fff,#3fd9f9 0%,#14c674 97%)",
              color: "#153a19", fontWeight:800, fontSize:"1.1em", border:"none", borderRadius:11, padding:"10px 31px",cursor:"pointer"
            }} onClick={() => setShowFunds(true)}>
              Add Funds
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{display:"flex",gap:22,justifyContent:"center",margin:"38px 0 27px"}}>
        {[
          {label:"Orders", value:"4,892", color:"#24e880"},
          {label:"Wallet", value:"₹3,180", color:"#58aaff"},
          {label:"Success Rate", value:"99.3%", color:"#fac000"},
          {label:"Refill/Refund", value:"100%", color:"#26d4d6"}
        ].map(st => (
          <div key={st.label} style={{
            background:"#fff",borderRadius:17,minWidth:170,padding:"23px 24px",fontWeight:800,fontSize:"1.23em",color:st.color,boxShadow:"0 1.5px 19px #05eebd19",textAlign:"center"
          }}>
            <div style={{fontSize:"1.41em",marginBottom:3}}>{st.value}</div>
            <div style={{fontWeight:700,fontSize:".97em", color:"#183b2d"}}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* New Order Section */}
      <div style={{
        background:"#fff",borderRadius:19,maxWidth:540,margin:"0 auto",padding:"32px 22px 24px",boxShadow:"0 2px 17px #28eac410"
      }}>
        <h2 style={{fontWeight:900,fontSize:"1.38em",letterSpacing: "-0.5px",color:DASH_COLOR,marginBottom:19}}>Place a New Order</h2>
        <form>
          <label style={{fontWeight:700,marginBottom:5,display:"inline-block",color:"#124e39"}}>Service</label>
          <select style={{
            width:"100%",borderRadius:9,padding:"13px 11px",fontWeight:600,border:"1.3px solid #e1fcf1",background:"#fafdff",fontSize:"1.07em",marginBottom:15
          }}>
            <option>Instagram Followers</option>
            <option>YouTube Views</option>
            <option>Telegram Members</option>
            <option>Spotify Plays</option>
            <option>Facebook Likes</option>
          </select>
          <label style={{fontWeight:700,marginBottom:4,display:"inline-block",color:"#124e39"}}>Link</label>
          <input type="text" placeholder="Paste your link" style={{
            width:"100%",borderRadius:9,padding:"13px 10px",marginBottom:16,
            border:"1.2px solid #d7fcf0",background:"#fafdff",fontSize:"1.03em"
          }}/>
          <label style={{fontWeight:700,marginBottom:4,display:"inline-block",color:"#124e39"}}>Quantity</label>
          <input type="number" placeholder="Quantity (Min 100)" style={{
            width:"100%",borderRadius:9,padding:"13px 10px",marginBottom:25,
            border:"1.2px solid #d7fcf0",background:"#fafdff",fontSize:"1.03em"
          }}/>
          <button type="submit" style={{
            width:"100%",background: `linear-gradient(90deg,${DASH_COLOR} 30%,#fbba0a 100%)`, color:"#fff",
            fontWeight:900,fontSize:"1.15em",border:"none",borderRadius:11,padding:"14px 0",marginTop:2,cursor:"pointer"
          }}>
            Order Now
          </button>
        </form>
      </div>

      {/* ADD FUNDS MODAL */}
      {showFunds && (
        <div style={{
          position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:1000,background:"rgba(80,120,120,0.17)",display:"flex",alignItems:"center",justifyContent:"center"
        }}>
          <div style={{
            background:"#fff",borderRadius:19,padding:"34px 30px 24px",boxShadow:"0 2px 44px #23f0f027",minWidth:330,maxWidth:420,position:"relative"
          }}>
            <button style={{
              position:"absolute",right:12,top:12,border:"none",background:"none",fontSize:"2em",color:"#ef3a47",cursor:"pointer",fontWeight:900
            }} onClick={()=>setShowFunds(false)}>&times;</button>
            <div style={{fontWeight:900,fontSize:"1.23em",marginBottom:15,color:DASH_COLOR}}>Add Funds</div>
            <div style={{
              background:"#f8fffb",borderRadius:12,padding:"12px 13px",marginBottom:12,display:"flex",alignItems:"center",gap:13
            }}>
              <FaWallet color={DASH_COLOR} size={27} style={{marginRight:8}}/>
              <div>
                <div style={{fontWeight:700}}>Minimum Deposit: <span style={{color:"#16c685"}}>₹100</span></div>
                <div style={{fontWeight:600,color:"#1993f0"}}>Scan UPI QR or use UPI ID below</div>
              </div>
            </div>
            <img src={QR_URL} alt="UPI QR" style={{width:170,borderRadius:16,boxShadow:"0 1px 16px #d3fee919",display:"block",margin:"0 auto 13px"}} />
            <div style={{
              textAlign:"center",margin:"12px 0 8px",fontWeight:700,color:"#13794e",fontSize:"1.09em"
            }}>
              UPI: <span style={{color:"#0abf9f"}}>boraxdealer@fam</span>
            </div>
            <div style={{margin:"18px 0 6px",fontWeight:600,color:"#888"}}>Upload Payment Screenshot</div>
            <input type="file" accept="image/*" style={{
              color:"#21bc98",fontSize:"1em",marginBottom:9
            }}/>
            <button style={{
              background:`linear-gradient(92deg,#11eea6 37%,#f6bf27 99%)`,color:"#fff",
              border:"none",borderRadius:11,padding:"13px 0",fontWeight:900,fontSize:"1.12em",width:"100%",marginTop:7
            }}>Submit &amp; Add</button>
          </div>
        </div>
      )}
    </div>
  );
}
