import React, { ReactNode, HTMLAttributes } from "react";

const Error = ({ children, ...props }) => {
  return (
    <div
      style={{ color: "#f23838", textAlign: "start", margin: "0.5rem 0" }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Error;
