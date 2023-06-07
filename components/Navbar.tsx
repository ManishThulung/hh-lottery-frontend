import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

function Navbar() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;

    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(account, "asd");

      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("here");
      }
    });
  }, []);

  return (
    <>
      {account ? (
        <div>Connected to {account}</div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();

            window.localStorage.setItem("connected", "injected");
          }}
          className="bg-blue-800 text-white text-3xl font-normal"
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </>
  );
}

export default Navbar;
