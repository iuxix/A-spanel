import React, { useState, useEffect } from "react";
import { FaWallet, FaUser, FaCogs, FaHistory, FaPlus } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import OrderSection from "../components/OrderSection";
import AddFundsModal from "../components/AddFundsModal";

const QR_URL = "https://files.catbox.moe/r3twin.jpg";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showFunds, setShowFunds] = useState(false);

  // Automatic: Get Firebase user and balance (no user stub left for you)
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const d = await getDoc(doc(db, "users", u.uid));
        setBalance(d.exists() ? d.data().balance : 0);
      }
    });
    return unsub;
  }, []);

  async function refreshBalance() {
    if (!user) return;
    const d = await getDoc(doc(db, "users", user.uid));
    setBalance(d.exists() ? d.data().balance : 0);
  }

  return (
    <div style={{ background: "linear-gradient(112deg,#eefcf7 67%,#f4fafe 100%)", minHeight: "100vh", fontFamily: "Poppins,sans-serif", color: "#153e28" }}>
      {/* Header */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #e0efe7",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "21px 28px 20px 28px", boxShadow: "0 2px 16px #1be88510", position: "sticky", top: 0, zIndex: 13
      }}>
        <div style={{
          fontWeight: 900, color: "#18b795", fontSize: "2.06em", letterSpacing: ".5px", display: "flex", alignItems: "center"
        }}>
          <img src="/logo.png" alt="logo" style={{ height: 44, marginRight: 15, borderRadius: 8, background: "#fff" }} />
          LuciXFire Panel
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <div style={{
            color: "#2cd27c", background: "#e9fff6", borderRadius: 15,
            padding: "10px 25px", fontWeight: 700, fontSize: "1.13em", display: "flex", alignItems: "center", boxShadow: "0 1.5px 14px #19feb024"
          }}>
            <FaWallet color="#18b795" style={{ marginRight: 10 }} />
            ₹{balance.toFixed(2)}
          </div>
          <button style={{
            background: "linear-gradient(90deg,#18b795,#fbcb0a 70%)",
            color: "#fff", border: "none", borderRadius: 12, padding: "10px 21px",
            fontWeight: 800, fontSize: "1.14em", boxShadow: "0 2px 11px #15ffc015", cursor: "pointer"
          }} onClick={() => setShowFunds(true)}>
            <FaPlus style={{ marginBottom: -3, marginRight: 9 }} /> Add Funds
          </button>
          <button style={{
            fontSize: "1.08em", color: "#68a1fb", background: "none",
            border: "none", borderRadius: 8, padding: "10px 12px", cursor: "pointer"
          }}>
            <FaHistory />
          </button>
          <button style={{
            fontSize: "1.08em", color: "#26bb77", background: "none",
            border: "none", borderRadius: 8, padding: "10px 12px", cursor: "pointer"
          }}>
            <FaUser />
          </button>
          <button style={{
            fontSize: "1.08em", color: "#ffa13c", background: "none", border: "none",
            borderRadius: 8, padding: "10px 12px", cursor: "pointer"
          }}>
            <FaCogs />
          </button>
        </div>
      </nav>

      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(93deg,#18b795 50%,#058fff 104%)",
        color: "#fff", borderRadius: 18,
        margin: "34px auto 0 auto", maxWidth: 800, padding: "38px 30px 27px 44px", boxShadow: "0 4px 30px #13cfc939",
        display: "flex", alignItems: "center", gap: 52
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: "2.09em", marginBottom: 4 }}>
            Welcome to <span style={{ color: "#fffb85" }}>LuciXFire Panel</span>
          </div>
          <div style={{ opacity: .97, fontWeight: 500, marginBottom: 8 }}>
            Your SMM dashboard: live wallet, instant orders, and analytics.
            <br />
            <span style={{ fontWeight: 700, color: "#fff" }}>Start a new order or top up your wallet.</span>
          </div>
          <div style={{ display: "flex", gap: 19, marginTop: 16 }}>
            <button style={{
              background: "linear-gradient(93deg,#fbf241,#2de398 90%)",
              color: "#232", fontWeight: 800, fontSize: "1.1em", border: "none", borderRadius: 11, padding: "10px 31px", cursor: "pointer"
            }}>
              New Order
            </button>
            <button style={{
              background: "linear-gradient(92deg,#fff,#3fd9f9 0%,#14c674 97%)",
              color: "#153a19", fontWeight: 800, fontSize: "1.1em", border: "none", borderRadius: 11, padding: "10px 31px", cursor: "pointer"
            }} onClick={() => setShowFunds(true)}>
              Add Funds
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "flex", gap: 22, justifyContent: "center", margin: "38px 0 27px" }}>
        {[
          { label: "Orders", value: "4,892", color: "#24e880" },
          { label: "Wallet", value: "₹" + balance.toFixed(2), color: "#58aaff" },
          { label: "Success Rate", value: "99.3%", color: "#fac000" },
          { label: "Refill/Refund", value: "100%", color: "#26d4d6" }
        ].map(st => (
          <div key={st.label} style={{
            background: "#fff", borderRadius: 17, minWidth: 170, padding: "23px 24px", fontWeight: 800, fontSize: "1.23em", color: st.color, boxShadow: "0 1.5px 19px #05eebd19", textAlign: "center"
          }}>
            <div style={{ fontSize: "1.41em", marginBottom: 3 }}>{st.value}</div>
            <div style={{ fontWeight: 700, fontSize: ".97em", color: "#183b2d" }}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* New Order Section — no user stub needed, everything linked by UID */}
      <OrderSection user={user} balance={balance} refreshBalance={refreshBalance} />

      {/* Add Funds Modal */}
      {showFunds &&
        <AddFundsModal user={user} onClose={() => setShowFunds(false)} refresh={refreshBalance} qrUrl={QR_URL} />}
    </div>
  );
}
