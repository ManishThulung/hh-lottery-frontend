import React from "react";
import { useMoralis } from "react-moralis";

function Navbar() {
  const { enableWeb3 } = useMoralis();
  return (
    <>
      <button
        onClick={async () => {
          await enableWeb3();
        }}
        className="bg-blue-800 text-white text-3xl font-normal"
      >
        Connect
      </button>
    </>
  );
}

export default Navbar;
