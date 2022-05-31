import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Main from "./components/Main.jsx";
import stakingAbi from "../src/ABI/Staking.json";
import frickleAbi from "../src/ABI/FrickleABI.json";
import { ethers } from "ethers";

function App() {
  const [wallet, setWallet] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [frickleContract, setFrickleContract] = useState(null);

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const account = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setWallet(account);
  };
  useEffect(() => {
    if (!wallet) return;
    const createContract = async () => {
      //////// The Contract object //////////
      // Staking Contract//
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const stakingAddress = "0xEee1c56C7E88c5CB4042424584E6B43070E4daC6";
      const stakingContract = new ethers.Contract(
        stakingAddress,
        stakingAbi,
        signer
      );
      setStakingContract(stakingContract);
      console.log(stakingContract);
      /////// Frickle Coin Contract ////////
      const frickleAddress = "0xebC2ce52E42134042a02AF4f5889b9786eBf2018";
      const frickleContract = new ethers.Contract(
        frickleAddress,
        frickleAbi,
        signer
      );
      setFrickleContract(frickleContract);
      console.log(frickleContract);
    };
    createContract();
  }, [wallet]);

  return (
    <div className="App">
      <Navbar wallet={wallet} connectWallet={connectWallet} />
      <Main
        wallet={wallet}
        stakingContract={stakingContract}
        frickleContract={frickleContract}
      />
    </div>
  );
}

export default App;
