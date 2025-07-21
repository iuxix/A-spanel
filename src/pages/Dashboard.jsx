import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import OrderSection from "../components/OrderSection";
import AddFundsModal from "../components/AddFundsModal";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const [showFunds, setShowFunds] = useState(false);
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);

  // Get user and their balance
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (acc) => {
      if (acc) {
        setUser(acc);
        const userDoc = await getDoc(doc(db, "users", acc.uid));
        setBalance(userDoc.exists() ? userDoc.data().balance || 0 : 0);
      }
    });
    return () => unsub();
  }, []);

  // Called when funds are accepted, reloads user balance
  async function refreshBalance() {
    if (!user) return;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    setBalance(userDoc.exists() ? userDoc.data().balance || 0 : 0);
  }

  return (
    <div style={{ background: "#f9fff7", minHeight: "100vh", paddingBottom: 40 }}>
      <Navbar />
      <div style={{
        maxWidth: 1050, margin: "0 auto", display: "flex",
        alignItems: "center", justifyContent: "space-between", padding: "32px 25px 5px"
      }}>
        <h1 style={{ fontWeight: 900, fontSize: "1.18em", color: "#0e9047" }}>
          LuciXFire SMM Dashboard
        </h1>
        <div style={{
          padding: "11px 25px", borderRadius: 17,
          background: "linear-gradient(90deg,#f5ff89 30%,#84ffdb 90%)",
          fontWeight: 800, color: "#0a714a", fontSize: "1.15em"
        }}>
          Balance: ₹{balance.toFixed(2)}
          <button style={{
            marginLeft: 15, background: "#29d67b", border: "none", borderRadius: 10,
            color: "#fff", fontWeight: 700, padding: "7px 20px", cursor: "pointer"
          }}
          onClick={() => setShowFunds(true)}>Add Funds</button>
        </div>
      </div>
      <OrderSection user={user} balance={balance} refreshBalance={refreshBalance} />
      {showFunds &&
        <AddFundsModal
          user={user}
          onClose={() => setShowFunds(false)}
          onDepositApproved={refreshBalance}
        />
      }
    </div>
  );
}
