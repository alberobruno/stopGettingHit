import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <p>
        <Link to="/" className="link" style={{ color: "black" }}>
          Back to Matches
        </Link>
      </p>
    </div>
  );
};

export default Header;
