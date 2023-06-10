import React, { useEffect, useState } from "react";
import { abi, contractAddresses } from "../constansts";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");
  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  // to get the entrance fee from the smart contract
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const numOfPlayersFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromCall = (await getRecentWinner()).toString();
    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(numOfPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
    // console.log(entranceFee);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };

  return raffleAddress ? (
    <div>
      <button
        onClick={async function () {
          await enterRaffle({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error),
          });
        }}
        disabled={isLoading || isFetching}
      >
        Enter Raffle{" "}
        {isLoading || isFetching ? (
          <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
        ) : (
          <div></div>
        )}
      </button>
      <p>
        The Lottery Entrance Fee is:
        {ethers.utils.formatUnits(entranceFee, "ether")} ETH
      </p>
      <p>Number of Players: {numPlayers}</p>
      <p>Recent Winner: {recentWinner}</p>
    </div>
  ) : (
    <div>No Raffle Address Exists</div>
  );
}

export default LotteryEntrance;
