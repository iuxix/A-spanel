import React from "react";
import { Link } from "react-router-dom";
import {
  FaWallet, FaWhatsapp, FaChartLine, FaRegUserCircle,
  FaInstagram, FaFacebookF, FaYoutube, FaGlobe, FaTiktok, FaTelegramPlane,
} from "react-icons/fa";

export default function Dashboard() {
  return (
    <div style={{
      background: "linear-gradient(100deg,#fafffc 65%,#eafcff 100%)",
      minHeight: "100vh",
      padding: "0 0 40px 0"
    }}>
      <nav style={{
        background: "#fff", boxShadow:"0 2px 20px #e1f9f6", borderBottom:"1.4px solid #e8f7fb",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0 18px 0", position:"sticky", top:0, zIndex:40
      }}>
        <div style={{display:"flex",alignItems:"center"}}>
          <img src="/logo.png" alt="LuciXFire logo" style={{height:46, borderRadius:15,marginLeft:20,marginRight:11}} />
          <span style={{fontWeight:900,fontSize:"2em", letterSpacing:"1px",color:"#13d89e"}}>LuciXFire Panel</span>
        </div>
        <div style={{display:"flex",alignItems:"center",marginRight:26,gap:13}}>
          <span style={{
            display:"flex",alignItems:"center",background:"#f5fff6",padding:"7px 21px",
            borderRadius:18,fontWeight:800,color:"#128c5b",fontSize:"1.11em",boxShadow:"0 1px 6px #19f98f1c"
          }}><FaWallet style={{marginRight:6}}/>₹1,500.00</span>
          <img src="/profile.jpg" alt="Me" style={{height:42,borderRadius:"50%",boxShadow:"0 2px 16px #2ef8e115"}} />
        </div>
      </nav>
      
      {/* Welcome & Widgets */}
      <div style={{
        maxWidth:1200,margin:"0 auto",display:"flex",gap:26,flexWrap:"wrap",marginTop:30,justifyContent:"space-between"
      }}>
        {/* Widget Column */}
        <div style={{flex:"1 1 360px",minWidth:330,maxWidth:390}}>
          <div style={{
            background: "linear-gradient(103deg,#eaffdf 5%,#fbf8ff 100%)",
            borderRadius:22, boxShadow:"0 4px 24px #b3ffe723", padding:"29px 21px",marginBottom:22
          }}>
            <div style={{fontWeight:900,fontSize:"1.2em",color:"#1e7647"}}>Welcome back 👋</div>
            <div style={{margin:"14px 0",color:"#507234",fontWeight:700}}>
              Username: <span style={{color:"#18adfd",fontWeight:600}}>MyUser123</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginTop:13}}>
              <FaWallet color="#11d992" size={22}/> <b>Wallet Balance:</b>
              <span style={{fontWeight:900,fontSize:"1.17em",color:"#04bc86"}}>₹1,500.00</span>
            </div>
            <div style={{marginTop:25,display:"flex",gap:12}}>
              <Link to="/addfunds" style={ctaBtn("#ffbe23", "#13e97a")}>
                + Add Funds
              </Link>
              <Link to="/support" style={ctaBtn("#55e3fd", "#11d9ab")}>
                <FaWhatsapp style={{marginRight:5}}/> Support
              </Link>
            </div>
          </div>
          <div style={{
            background:"linear-gradient(97deg,#ffe48e 4%,#bbfff0 90%)",
            borderRadius:15,padding:"18px 18px 12px",marginBottom:17,boxShadow:"0 1px 12px #fedb5540"
          }}>
            <div style={{fontWeight:900,fontSize:"1.13em",color:"#fd8526"}}>Notice</div>
            <div style={{color:"#4a734f",margin:"9px 0 5px"}}>UPI deposits must be ₹100+. DM support via WhatsApp for instant wallet updates.</div>
          </div>
        </div>

        {/* Order/Actions/Main Card Column */}
        <div style={{flex: "6 1 600px", minWidth:390, maxWidth:730, width:"100%"}}>
          {/* Order Now Card */}
          <div style={{
            background:"linear-gradient(94deg,#fffaf7 5%,#e3fdff 97%)",
            boxShadow:"0 2px 23px #bbfbef15",
            borderRadius:22,padding:"29px 28px",marginBottom:28
          }}>
            <div style={{fontWeight:900,fontSize:"1.22em",color:"#12496e",marginBottom:13}}>New Order 🚀</div>
            <form style={{display:"flex",flexWrap:"wrap",gap:22,alignItems:"center",marginBottom:7}}>
              <select style={orderInput}>
                <option>Instagram Followers</option>
                <option>Facebook Likes</option>
                <option>Telegram Subscribers</option>
                <option>Tiktok Views</option>
                <option>More...</option>
              </select>
              <input type="text" placeholder="Paste Link" style={orderInput}/>
              <input type="number" placeholder="Quantity" style={orderInput}/>
              <button style={{
                ...ctaBtn("#21e073", "#fbaf09"),fontWeight:800,fontSize:"1.07em",marginTop:2
              }}>Place Order</button>
            </form>
            <div style={{fontSize:".99em",color:"#158f6e",marginTop:3}}>
              Minimum order: 10, Maximum: 100,000 | Average time: 10 minutes
            </div>
          </div>
          
          {/* Orders Table / History */}
          <div style={{
            background:"linear-gradient(90deg,#d0fffa 4%,#ffeec2 90%)",
            borderRadius:22,padding:"22px 19px 13px",boxShadow:"0 1.8px 28px #34ede822",marginBottom:33
          }}>
            <div style={{fontWeight:900,fontSize:"1.12em",marginBottom:15,color:"#235e67"}}>Recent Orders</div>
            <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 8px"}}>
              <thead>
                <tr style={{fontWeight:700,color:"#23a565"}}>
                  <th style={{paddingBottom:6}}>Order ID</th>
                  <th>Service</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <DashboardOrderRow oid="7845121" name="Instagram Followers" q={2000} dt="2024-07-20" st="Processing" color="#beb216"/>
                <DashboardOrderRow oid="7845122" name="Telegram Members" q={500} dt="2024-07-20" st="Completed" color="#37c96a"/>
                <DashboardOrderRow oid="7845123" name="YT Likes" q={215} dt="2024-07-20" st="Refilled" color="#28bae3"/>
                <DashboardOrderRow oid="7845124" name="FB Reactions" q={3050} dt="2024-07-20" st="Cancelled" color="#e94c40"/>
                {/* ...fetch more */}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Services/Platforms Grid */}
      <div style={{maxWidth:1100,margin:"29px auto 51px",textAlign:"center"}}>
        <h2 style={{fontWeight:900, fontSize:"2em",marginBottom:12,letterSpacing:"-1px"}}>Available Platforms</h2>
        <div style={{
          display:"flex",flexWrap:"wrap",justifyContent:"center",gap:22,marginTop:10
        }}>
          {[
            {label:"Instagram",icon:<FaInstagram color="#E4405F" />,bg:"#fff3f8"},
            {label:"Facebook", icon:<FaFacebookF color="#0866FF"/>, bg:"#eaf5fd"},
            {label:"YouTube",icon:<FaYoutube color="#FF0000"/>, bg:"#fff5ee"},
            {label:"Telegram",icon:<FaTelegramPlane color="#229ED9"/>, bg:"#eaf8ff"},
            {label:"Tiktok",icon:<FaTiktok color="#000"/>,bg:"#f7f7fa"},
            {label:"LinkedIn",icon:<FaLinkedinIn color="#0A66C2"/>, bg:"#eef5fb"},
            {label:"Discord",icon:<FaDiscord color="#5865F2"/>, bg:"#f6f4ff"},
            {label:"Website Traffic",icon:<FaGlobe color="#2CC45C"/>, bg:"#f7fdf6"},
          ].map(({label,icon,bg}) =>
            <div key={label} style={{
              width:68,height:68,borderRadius:34,background:bg,display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 1.5px 12px #12ecd91a",margin:"5px"
            }}>
              <span style={{fontSize:"2.2em"}} title={label}>{icon}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardOrderRow({oid, name, q, dt, st, color}) {
  // Custom colored status chip
  return (
    <tr style={{background:"#fff",borderRadius:13,boxShadow:"0 0 9px #05eeb911"}}>
      <td style={{padding:"13px 5px",fontWeight:800,color:"#33959e"}}>#{oid}</td>
      <td style={{padding:"13px 13px",fontWeight:700,color:"#204b76"}}>{name}</td>
      <td style={{padding:"13px 5px",fontWeight:700,color:"#7943da"}}>{q}</td>
      <td style={{padding:"13px 7px"}}>
        <span style={{
          display:"inline-block",minWidth:68,padding:"7px 20px",borderRadius:7,
          fontWeight:800,background:color+"22",color,
          fontSize:".97em",textShadow:"0 1px 8px #f8f8fa"
        }}>{st}</span>
      </td>
      <td style={{padding:"13px 13px",fontWeight:500,color:"#5fa658",fontSize:".97em"}}>{dt}</td>
    </tr>
  );
}

function ctaBtn(start, end) {
  return {
    background: `linear-gradient(90deg,${start},${end})`,
    color: "#fff",
    borderRadius: "14px",
    fontWeight: 800,
    fontSize: "1.09em",
    textDecoration: "none",
    border: "none",
    padding: "12px 30px",
    boxShadow: "0 2px 16px #16eeb61a"
  };
}

const orderInput = {
  borderRadius: "10px",
  border: "1.5px solid #e2ebf9",
  background: "#fafdff",
  fontWeight: 600,
  color: "#1e3554",
  fontSize: "1.08em",
  padding: "14px 14px",
  flex: "1 1 140px",
  minWidth:100
};
