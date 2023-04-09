import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const data = useLocation().state.data;
  const id = useLocation().state.id;
  const player1 = useLocation().state.player1;
  const player2 = useLocation().state.player2;

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
