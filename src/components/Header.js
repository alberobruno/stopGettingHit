import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <p>
        <Link to="/">Back to Matches</Link>
      </p>
    </div>
  );
};

export default Header;
