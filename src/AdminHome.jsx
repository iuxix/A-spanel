import React, { useState } from "react";
import AdminLogin from "../components/AdminLogin";
import AdminPanel from "../components/AdminPanel";
export default function AdminHome() {
  const [logged, setLogged] = useState(false);
  return logged ? <AdminPanel /> : <AdminLogin onSuccess={()=>setLogged(true)} />;
}
