import React from "react";
import comingsoon from "./comingsoon.gif";

export default function ComingSoon() {
  return (
    <div className="mt-5">
      <img
        src={comingsoon}
        alt="coming soon..."
        style={{ width: "70%", margin: "auto", display: "block" }}
      />
    </div>
  );
}
