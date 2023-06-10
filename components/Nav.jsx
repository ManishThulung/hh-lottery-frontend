import React from "react";
import { ConnectButton } from "web3uikit";

function Nav() {
  return (
    <div>
      <ConnectButton moralisAuth={false} />
    </div>
  );
}

export default Nav;
