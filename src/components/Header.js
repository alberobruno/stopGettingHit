import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <Link to="/" className="link" style={{ color: "black" }}>
        <p>Back to Matches</p>
      </Link>
    </div>
  );
};

export default Header;
