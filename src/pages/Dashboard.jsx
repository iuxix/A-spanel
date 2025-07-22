import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, doc, getDoc, addDoc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [balance, setBalance] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState("");
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");
  const [link, setLink] = useState("");
  const [orderError, setOrderError] = useState("");
  const [loading, setLoading] = useState(true);

  // Listen to logged in user
  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        setUser(usr);
        // Real-time balance
        onSnapshot(doc(db, "users", usr.uid), (docSnap) => {
          setBalance(docSnap.exists() ? (docSnap.data().balance || 0) : 0);
        });
      }
    });
  }, []);

  // Services loader
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "services"), (snapshot) => {
      setServices(
        snapshot.docs.map((doc) => ({
          id: doc.id, ...doc.data()
        }))
      );
      setLoading(false);
    });
    return unsub;
  }, []);

  async function handleOrder(e) {
    e.preventDefault();
    setOrderError(""); setOrderSuccess("");
    if (!selected || !qty || !link) {
      setOrderError("❌ Please fill all fields."); return;
    }
    if (parseInt(qty) < selected.min || parseInt(qty) > selected.max) {
      setOrderError("❌ Quantity: Min " + selected.min + " - Max " + selected.max); return;
    }
    const charge = ((selected.price * parseInt(qty)) / 1000);
    if (charge > balance) {
      setOrderError(`❌ Insufficient balance. Please add funds.`); return;
    }
    // Create order
    await addDoc(collection(db, "orders"), {
      user: user.uid,
      service_id: selected.id,
      qty: parseInt(qty),
      link,
      charge,
      status: "pending",
      timestamp: Date.now()
    });
    // Deduct balance
    await updateDoc(doc(db, "users", user.uid), {
      balance: balance - charge
    });
    setOrderSuccess(`✅ Order placed: ${qty} x ${selected.title}`);
    setQty(""); setLink(""); setSelected(null);
  }

  // Animate for balance and order cards
  const cardAnim = { initial:{opacity:0,y:40}, animate:{opacity:1,y:0}, exit:{opacity:0,y:40}};
  const secAnim = { initial:{opacity:0}, animate:{opacity:1}, exit:{opacity:0}};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(109deg,#f4fff7 80%,#f1fbff 100%)",
        padding: "0 10vw 60px 10vw"
      }}
    >
      {/* Balance Section */}
      <motion.div {...cardAnim} transition={{duration:0.5}} style={{
        background: "#fff",
        borderRadius: 19,
        padding: "23px 32px",
        maxWidth: 450,
        margin: "35px auto 25px",
        boxShadow: "0 6px 30px #33f69a13",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: 800,
        fontSize: "1.27em"
      }}>
        <div style={{color:"#1ac28b",display:"flex",alignItems:"center"}}>
          <span style={{fontSize:"2em",marginRight:14}}>💰</span>
          Balance
        </div>
        <motion.span
          key={balance}
          initial={{ scale: 0.7, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
          style={{
            color: "#18bb47",
            fontWeight: 900,
            fontSize: "1.24em",
            letterSpacing: 1.2,
            minWidth: 100,
            textAlign: "right"
          }}
        >
          ₹{balance.toFixed(2)}
        </motion.span>
      </motion.div>

      {/* Order Section */}
      <motion.div {...cardAnim} transition={{duration:0.65}} style={{
        background: "#fff",
        borderRadius: 17,
        maxWidth: 490,
        margin: "0 auto 25px auto",
        padding: "27px 18px 21px",
        boxShadow: "0 8px 40px #cdfdf218",
        position: "relative"
      }}>
        <h2 style={{
          textAlign: "center", fontWeight: 900, fontSize: "1.25em", letterSpacing: "-1px", marginBottom: "19px"
        }}>New Order <span role="img" aria-label="lightning">⚡</span></h2>
        <form onSubmit={handleOrder} autoComplete="off" style={{display:"flex",flexDirection:"column",gap:13,alignItems:"stretch"}}>
          <label>Service</label>
          <select
            value={selected ? selected.id : ""}
            style={{
              padding: "13px 10px", fontWeight: 600, fontSize: "1.07em", borderRadius: 12, border: "1.2px solid #e2efff",
              background: "#f8ffff"
            }}
            onChange={e => {
              const srv = services.find(s => s.id === e.target.value);
              setSelected(srv || null);
              setOrderError(""); setOrderSuccess("");
            }}
          >
            <option value="">Select Service…</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.title} ({s.price}/1K)</option>
            ))}
          </select>

          {selected && (
            <motion.div {...secAnim} transition={{duration:0.3}}>
              <div style={{fontSize:".98em",background:"#f7fdff",borderRadius:7,padding:"9px 10px",marginBottom:6}}>
                <b>{selected.desc}</b><br/>
                <span style={{color:"#25bc8b"}}>Min: {selected.min} – Max: {selected.max} | Est: {selected.avgtime}</span>
              </div>
            </motion.div>
          )}

          <label>Link</label>
          <input
            type="text"
            placeholder="Paste post/profile link"
            style={{
              borderRadius: 10, padding: "13px 12px", border: "1.1px solid #e5eefe",
              background: "#fafdff", fontSize: "1.07em"
            }}
            value={link}
            onChange={e => setLink(e.target.value)}
          />
          <label>Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            style={{
              borderRadius: 10, padding: "13px 12px", border: "1.1px solid #e5eefe",
              background: "#fafdff", fontSize: "1.07em"
            }}
            value={qty}
            min={selected?.min}
            max={selected?.max}
            onChange={e => setQty(e.target.value)}
          />

          {/* Charge */}
          <motion.div
            {...secAnim}
            transition={{ duration: 0.23 }}
            style={{
              margin: "12px 0 14px 0",
              color: "#27c65c",
              fontWeight: 700,
              fontSize: "1.08em",
              textAlign: "right"
            }}
          >
            Charge: ₹
            {qty && selected
              ? ((selected.price * Number(qty)) / 1000).toFixed(2)
              : "0.00"}
          </motion.div>

          {/* Errors and Success */}
          {orderError && <motion.div {...secAnim} transition={{duration:0.22}} style={{color:"#e94a64",fontWeight:710,textAlign:"center",marginBottom:6}}>{orderError}</motion.div>}
          {orderSuccess && <motion.div {...secAnim} transition={{duration:0.22}} style={{color:"#12bf61",fontWeight:710,textAlign:"center",marginBottom:6}}>{orderSuccess}</motion.div>}

          <motion.button
            type="submit"
            whileTap={{scale:0.96}}
            style={{
              background: "linear-gradient(90deg,#1ee083,#fbcf12 99%)",
              color: "#fff", fontWeight: 900, fontSize: "1.13em",
              border: "none", borderRadius: "12px", padding: "15px 0", marginTop:2,
              cursor: "pointer", boxShadow: "0 2px 13px #30eacb16"
            }}
          >
            Place Order
          </motion.button>
        </form>
      </motion.div>

      {/* Helpful Hints / Animated Stats (OPTIONAL) */}
      <motion.div
        {...cardAnim}
        transition={{duration:0.6}}
        style={{
          maxWidth: 700,
          margin: "38px auto 0",
          padding: "25px 28px",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 5px 25px #bff8e40d",
          display:"flex",
          gap:32,
          justifyContent:"space-evenly",
          fontWeight:700,
          fontSize:"1.09em"
        }}>
        <motion.div animate={{y:[8,-8,8]}} transition={{duration:2,repeat:Infinity,type:"spring"}}>💰 Refill/bonus offers weekly</motion.div>
        <motion.div animate={{y:[-7,7,-7]}} transition={{duration:2,repeat:Infinity,type:"spring",delay:0.4}}>🚀 Orders start instantly after admin approval</motion.div>
        <motion.div animate={{y:[7,-7,7]}} transition={{duration:2,repeat:Infinity,type:"spring",delay:0.8}}>🔒 All wallet funds are secure & tracked</motion.div>
      </motion.div>
    </div>
  );
}
