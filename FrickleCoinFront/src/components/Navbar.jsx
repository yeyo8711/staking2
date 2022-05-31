import React from "react";
import logo from "../images/logo.png";

const Navbar = ({ wallet, connectWallet }) => {
  return (
    <div className="flex flex-row justify-between nav text-white p-8 border-b-2  top">
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div>
        <h1 className="text-xl font-bold mt-8 ">FrickleCoin</h1>
      </div>
      {!wallet ? (
        <button className="button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <span className="mt-8">{`${wallet.toString().slice(0, 6)}...${wallet
          .toString()
          .slice(35, 42)}`}</span>
      )}
    </div>
  );
};

export default Navbar;
