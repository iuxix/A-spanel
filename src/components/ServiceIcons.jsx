import React from "react";
const icons = [
  { icon: "fab fa-instagram", style: { background: "#ed4956" } },
  { icon: "fab fa-facebook-f", style: { background: "#1877f3" } },
  { icon: "fab fa-youtube", style: { background: "#ff0000" } },
  { icon: "fab fa-twitter", style: { background: "#1da1f2" } },
  { icon: "fab fa-telegram-plane", style: { background: "#229bd7" } },
  { icon: "fab fa-tiktok", style: { background: "#000" } },
  { icon: "fab fa-whatsapp", style: { background: "#25d366" } },
  { icon: "fab fa-snapchat-ghost", style: { background: "#fffc00", color: "#333" } },
  { icon: "fab fa-linkedin-in", style: { background: "#2867b2" } },
];
export default function ServiceIcons() {
  return (
    <div className="service-icon-circle">
      {icons.map((i, idx) => (
        <span className="circle-icon" style={i.style} key={idx}>
          <i className={i.icon}></i>
        </span>
      ))}
    </div>
  );
}
