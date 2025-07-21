import React, { useState } from "react";
import { FaWhatsapp, FaInstagram, FaTelegramPlane, FaYoutube, FaFacebookF, FaTiktok, FaTwitter, FaGlobe } from "react-icons/fa";

const categories = [
  { name: "Instagram", icon: <FaInstagram color="#E4405F"/>, color: "#fff6fa" },
  { name: "YouTube",   icon: <FaYoutube color="#F00"/>, color: "#fff6f6" },
  { name: "Telegram",  icon: <FaTelegramPlane color="#229ED9"/>, color: "#f6fbff" },
  { name: "Facebook",  icon: <FaFacebookF color="#1877F3"/>, color: "#f3f9ff" },
  { name: "TikTok",    icon: <FaTiktok color="#111"/>, color: "#f7f8fa" },
  { name: "Twitter",   icon: <FaTwitter color="#1D9BF0"/>, color: "#f6fcff" },
  { name: "Others",    icon: <FaGlobe color="#14b67e"/>, color: "#f6fff6" }
];

// Example real SMM services, prices set to be cheaper than typical panel rates
const allServices = [
  // Instagram
  {cat:"Instagram", title:"IG Reels Views (No Drop)", desc:"Instant | 10M/Day | Lifetime refill", price: 0.11, min: 100, max: 1000000},
  {cat:"Instagram", title:"IG Followers [Stable]", desc:"Real | 0% Drop | 1k-500k | 3h avg", price: 16.5, min: 100, max: 500000},
  {cat:"Instagram", title:"IG Likes [Non Drop]", desc:"HQ | Instant | No Drop", price: 4.5, min: 50, max: 50000},
  // YouTube
  {cat:"YouTube", title:"YT Subscribers [Fast]", desc:"Fastest Delivery | 100% Real", price: 59, min: 10, max: 50000},
  {cat:"YouTube", title:"YT Views [Safe]", desc:"Lifetime | HR & Watchtime | 1M/Day", price: 0.06, min: 100, max: 1000000},
  {cat:"YouTube", title:"YT Likes [HQ]", desc:"Organic | Non-drop", price: 5.1, min: 20, max: 20000},
  // Telegram
  {cat:"Telegram", title:"TG Members [Instant]", desc:"Indian & Int'l | 1M/Day", price: 39, min: 100, max: 200000},
  {cat:"Telegram", title:"TG Post Views", desc:"No Drop | Same Day | Best Price", price: 0.045, min: 500, max: 1000000},
  // Facebook
  {cat:"Facebook", title:"FB Page Likes [Safe]", desc:"Lifetime | Refill 365D | Real", price: 18, min: 50, max: 100000},
  // TikTok
  {cat:"TikTok", title:"TikTok Followers", desc:"Non-Drop | Fastest | Global", price: 22.5, min: 100, max: 100000},
  // Twitter
  {cat:"Twitter", title:"Twitter Followers [Safe]", desc:"Non Drop | 365 Days Refill", price: 15, min: 100, max: 100000},
  // Others
  {cat:"Others", title:"Website Traffic Booster", desc:"Geo-Targeted | Real Visitors", price: 0.25, min: 1000, max: 10000000}
];

export default function Dashboard() {
  const [selectedCat, setSelectedCat] = useState(categories[0].name);
  const [selected, setSelected] = useState(null);
  const [link, setLink] = useState("");
  const [qty, setQty] = useState("");
  const [msg, setMsg] = useState("");

  const filteredServices = allServices.filter(s => s.cat === selectedCat);

  function handleOrder(e) {
    e.preventDefault();
    if (!selected || !link || !qty) return setMsg("❌ Fill all fields.");
    if (qty < selected.min || qty > selected.max) return setMsg(`❌ Quantity: Min ${selected.min} - Max ${selected.max}`);
    setMsg(`✅ Order Placed: ${selected.title} × ${qty}`);
    setLink(""); setQty(""); setSelected(null);
  }

  return (
    <div style={{
      minHeight:"100vh", background:"#f7fafb"
    }}>
      {/* Header */}
      <div style={{
        background:"#fff",
        padding:"30px 0 16px 0",
        boxShadow:"0 1px 18px #22e2b911"
      }}>
        <div style={{
          maxWidth:900, margin:"0 auto", display:"flex",
          justifyContent:"space-between", alignItems:"center"
        }}>
          <div style={{fontSize:"2em",fontWeight:900, color:"#13ac7e", letterSpacing:"1.2px"}}>
            <img src="/logo.png" alt="logo" style={{
              width:50, height:50, borderRadius:19, marginRight:15, verticalAlign: "middle", background:"#fff", boxShadow:"0 3px 18px #2be2e40d"
            }}/>
            LuciXFire Panel Dashboard
          </div>
          <Link to="/" style={{fontWeight:600, color:"#1aadfa",fontSize:"1.16em"}}>Home</Link>
        </div>
      </div>

      {/* Categories */}
      <div style={{
        display:"flex", flexWrap:"wrap", justifyContent:"center",gap:16,
        maxWidth:920, margin:"32px auto 0"
      }}>
        {categories.map(c => (
          <button key={c.name}
            style={{
              background: selectedCat === c.name ? "#e5fff3" : c.color,
              border: selectedCat === c.name ? "2.5px solid #18d87d" : "1.5px solid #f0f8f2",
              borderRadius: 17,
              fontWeight:800,
              fontSize:"1.11em",
              minWidth:"115px",
              boxShadow:"0 2px 18px #15e3b712",
              padding:"15px 17px", cursor:"pointer",
              display:"flex",alignItems:"center",gap:14
            }}
            onClick={()=>{setSelectedCat(c.name);setSelected(null);setMsg("");}}
          >{c.icon}{c.name}</button>
        ))}
      </div>

      {/* Services */}
      <div style={{
        maxWidth:680, margin:"38px auto 0", background:"#fff",
        borderRadius:19, boxShadow:"0 5px 33px #0defd93c", padding:"30px 17px 22px 17px"
      }}>
        <div style={{
          fontWeight:900, fontSize:"1.37em", marginBottom:15,
          color:"#1b846b"
        }}>{selectedCat} Services</div>
        <div style={{
          display:"flex", flexDirection:"column",gap:18, marginBottom:10
        }}>
          {filteredServices.map(s =>
            <div key={s.title} onClick={()=>{setSelected(s);setMsg("");}}
              style={{
                background:selected&&selected.title===s.title?"#e6fff6":"#fafffd",
                border:selected&&selected.title===s.title?"2.4px solid #22e97f":"1.4px solid #eafcef",
                borderRadius:11,padding:"17px 13px",fontWeight:700,fontSize:"1.09em",
                display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",
                boxShadow:"0 2px 7px #23e9cf09"
              }}>
              <div>
                <div style={{fontWeight:800, color:"#0abd4e"}}>{s.title}</div>
                <div style={{color:"#1d4052",fontWeight:500,fontSize:".97em",margin:"4px 0 0 0"}}>{s.desc}</div>
                <div style={{fontWeight:500,fontSize:".98em",color:"#19b57d",marginTop:6}}>
                  ₹{s.price} per 1K | Min {s.min} | Max {s.max}
                </div>
              </div>
              <div style={{
                background:"#22eadd",borderRadius:"50%",color:"#fff",
                width:39,height:39,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.26em"
              }}>
                {categories.find(c=>c.name===s.cat)?.icon}
              </div>
            </div>
          )}
        </div>
        {selected &&
          <form onSubmit={handleOrder} style={{background:"#f7fcf8",borderRadius:13,boxShadow:"0 2px 14px #22be7a18",padding:"16px 12px",marginTop:7}}>
            <div style={{fontWeight:700,marginBottom:10,color:"#0e9963"}}>{selected.title}</div>
            <div style={{display:"flex",gap:16,marginBottom:11}}>
              <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Paste link" style={{
                flex:2,padding:"12px 8px",borderRadius:9,border:"1.2px solid #a8f5d7",fontSize:"1em"
              }}/>
              <input type="number" value={qty} onChange={e=>setQty(e.target.value)} placeholder="Quantity" style={{
                flex:1, padding:"12px 8px",borderRadius:9,border:"1.2px solid #a8f5d7",fontSize:"1em"
              }}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:700}}>Total: </span>
              <span style={{fontWeight:800,color:"#ffb42b"}}>
                ₹{selected.price && qty ? ((selected.price*qty)/1000).toFixed(2) : "0.00"}
              </span>
            </div>
            {msg && <div style={{
              marginTop:7,
              color:msg.startsWith("✅")?"#12905c":"#e42b54",
              fontWeight:700
            }}>{msg}</div>}
            <button style={{
              marginTop:11,
              width:"100%",
              background:"linear-gradient(90deg,#1de37e,#ffd532 98%)",
              color: "#222", border: "none",
              borderRadius: 9,
              fontWeight: 800, fontSize: "1.19em",
              padding:"13px 0",cursor:"pointer"
            }}>Place Order</button>
          </form>
        }
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:17}}>
          <a href="https://wa.me/?text=Hi!%20I%20need%20SMM%20Panel%20help%20on%20LuciXFire%20Panel" target="_blank" rel="noreferrer"
            style={{
              display:"flex",alignItems:"center",gap:6,
              background:"#20d660",color:"#fff",fontWeight:700,padding:"8px 18px",
              borderRadius:12,textDecoration:"none",boxShadow:"0 2px 10px #38e49a15"
            }}>
            <FaWhatsapp style={{fontSize:"1.2em"}}/> WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
}
