import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection, getDocs, updateDoc, deleteDoc, doc, setDoc
} from "firebase/firestore";

export default function AdminPanel() {
  const [funds, setFunds] = useState([]);
  const [qr, setQr] = useState("");
  const [qrInput, setQrInput] = useState("");
  const [qrSaved, setQrSaved] = useState("");

  // Load fund requests and current QR image on mount
  useEffect(() => {
    getDocs(collection(db, "deposits")).then(ps =>
      setFunds(ps.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    getDocs(collection(db, "settings")).then(snap => {
      const docSet = snap.docs.find(d => d.id === "general");
      if (docSet && docSet.data().fundQR) {
        setQr(docSet.data().fundQR);
        setQrInput(docSet.data().fundQR);
      }
    });
  }, []);

  // Accept: remove from list, update user balance (example only here), remove from Firestore
  async function handleAction(f, action) {
    if (action === "accept") {
      // (In production: increment user balance here)
      await deleteDoc(doc(db, "deposits", f.id));
      setFunds(funds => funds.filter(x => x.id !== f.id));
      // Optional: show notification
    }
    if (action === "reject") {
      await deleteDoc(doc(db, "deposits", f.id));
      setFunds(funds => funds.filter(x => x.id !== f.id));
    }
  }

  // Save QR
  async function handleQrSave(e) {
    e.preventDefault();
    await setDoc(doc(db, "settings", "general"), { fundQR: qrInput }, { merge: true });
    setQr(qrInput);
    setQrSaved("URL saved!");
    setTimeout(() => setQrSaved(""), 1200);
  }

  return (
    <div style={{
      maxWidth: 900, margin: "36px auto",
      background: "#fff", borderRadius: 17,
      boxShadow: "0 6px 24px #cdf6fa29",
      color: "#173e26",
      padding: "37px 20px"
    }}>
      {/* QR Management */}
      <div style={{marginBottom:30}}>
        <div style={{fontWeight:800,fontSize:"1.15em",marginBottom:7}}>
          Change Add Funds <span style={{color:"#13b08e"}}>QR/URL</span>
        </div>
        <form onSubmit={handleQrSave} style={{display:"flex",alignItems:"center",gap:13,flexWrap:"wrap"}}>
          <input
            value={qrInput}
            onChange={e => setQrInput(e.target.value)}
            placeholder="Paste UPI QR/URL here"
            style={{
              borderRadius:8,padding:"12px",border:"1.2px solid #e2ebf4",
              fontSize:"1.11em",width:320,maxWidth:"94%"
            }}
          />
          <button type="submit" style={{
            background:"linear-gradient(90deg,#f8ac44,#18e887)",
            color:"#fff", fontWeight:700, border:"none",borderRadius:9,
            padding:"11px 24px",fontSize:"1.10em",cursor:"pointer"
          }}>{qrSaved ? qrSaved : "Save"}</button>
        </form>
        {qr && (
          <img src={qr} alt="UPI QR" style={{
            display:"block",height:92,borderRadius:10,margin:"14px 0 3px 0",background:"#f5faf7",objectFit:"contain"
          }}/>
        )}
      </div>

      {/* Payment Requests */}
      <div>
        <h2 style={{fontWeight:700, fontSize:"1.12em", marginBottom:15}}>Pending Fund Requests</h2>
        <div style={{
          background:"#f8fcff",borderRadius:12,padding:"10px 6px",margin:"1px 0 0 0"
        }}>
          {funds.length === 0 &&
            <div style={{color:"#bbb",padding:"14px 0", textAlign:"center"}}>No fund requests.</div>
          }
          {funds.map((f) => (
            <div key={f.id}
              style={{
                margin:"0 0 17px 0", padding:"18px 16px 13px", borderRadius:8,
                background: "#fff", boxShadow:"0 1.5px 8px #e2f7ec1e",
                display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10
              }}>
              <div>
                <div><strong>Amount:</strong> <span style={{color:"#159d40",fontWeight:800}}>{f.amount} INR</span></div>
                <div>{f.proof && (
                  <a href={f.proof} target="_blank" rel="noreferrer" style={{fontWeight:600,color:"#25aeeb",textDecoration:"underline"}}>View Proof</a>
                )}</div>
              </div>
              <div style={{display:"flex",gap:11}}>
                <button onClick={()=>handleAction(f,"accept")}
                  style={{
                    background:"linear-gradient(90deg,#18e417,#bee83f)",color:"#144c22",
                    border:"none",borderRadius:8,fontWeight:700,padding:"10px 25px",fontSize:".99em",cursor:"pointer"
                  }}>
                  Accept
                </button>
                <button onClick={()=>handleAction(f,"reject")}
                  style={{
                    background:"linear-gradient(90deg,#ff3131,#fac356)",color:"#fff",
                    border:"none",borderRadius:8,fontWeight:700,padding:"10px 18px",fontSize:".99em",cursor:"pointer"
                  }}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
