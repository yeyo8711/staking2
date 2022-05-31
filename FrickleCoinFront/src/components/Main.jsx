import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const toWei = (num) => ethers.utils.parseUnits(num.toString(), 9);
const fromWei = (num) => ethers.utils.formatUnits(num, 9);

const Main = ({ stakingContract, frickleContract, wallet }) => {
  const [totalRewards, setTotalRewards] = useState(0);
  const [rewardPerToken, setRewardPerToken] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(0);
  const [input, setInput] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [unstakeInput, setUnstakeInput] = useState(0);
  //// Get Total Rewards //////
  useEffect(() => {
    if (wallet && frickleContract) {
      const getRewards = async () => {
        const total = await frickleContract.balanceOf(
          "0xEee1c56C7E88c5CB4042424584E6B43070E4daC6"
        );
        setTotalRewards(fromWei(total));
        // Get token Balance //
        const inWallet = await frickleContract.balanceOf(wallet.toString());
        setTokenBalance(fromWei(inWallet));
      };
      getRewards();
    }
  }, [wallet, frickleContract]);
  /// Get Reward Per Token ////
  useEffect(() => {
    if (stakingContract) {
      const getRewards = async () => {
        const rewardPerToken = await stakingContract.rewardPerToken();
        setRewardPerToken(fromWei(rewardPerToken));
        refreshRewards();
      };
      getRewards();
    }
  }, [wallet, stakingContract]);

  const refreshRewards = async () => {
    if (wallet && stakingContract) {
      const availRewards = await stakingContract.earned(wallet[0]);
      setRewardBalance(fromWei(availRewards));
      const totalStake = await stakingContract.s_balances(wallet[0]);
      setStakedBalance(fromWei(totalStake));
    }
  };

  const submitInput = async (e) => {
    e.preventDefault();
    setInput(e.target.value);
  };
  const stake = async (e) => {
    e.preventDefault();
    if (input === 0) return;
    if (wallet && stakingContract) {
      const approval = await frickleContract.approve(
        stakingContract.address,
        toWei(input)
      );
      await approval.wait();
      await stakingContract.stake(toWei(input));
    }
  };

  const claim = async () => {
    if (input === 0) return;
    if (wallet && stakingContract) {
      await stakingContract.claimReward();
    }
  };
  const unstake = async () => {
    await stakingContract.withdraw(toWei(unstakeInput));
  };

  return (
    <div className="min-h-screen flex flex-row flex-nowrap justify-center align-middle bg-black text-white gap-3 main">
      {/* ---------- Stake tokens---------*/}
      <div className="flex h-48 flex-nowrap flex-col justify-between border-2 boxes mt-5 p-5 rounded-md">
        <h1 className="mt-2 text-center">Stake Your Frickles!</h1>
        <div className="flex flex-row text-center text-white">
          Your Available Tokens: {Number(tokenBalance).toFixed(2)}
        </div>
        <div className="mt-5">
          <form className="flex flex-row justify-between ">
            <input
              className="w-13 text-black max-h-7 mt-1"
              onChange={(e) => submitInput(e)}
              onSubmit={(e) => e.preventDefault()}
            />
            <button
              className="border-2 border-white-500 rounded-lg p-1 ml-2 buttonn"
              onClick={(e) => stake(e)}
            >
              Stake
            </button>
          </form>
        </div>
      </div>
      {/* ---------- View reward tokens---------*/}
      <div className="flex  flex-nowrap flex-col justify-between border-2 boxes mt-5 p-5 rounded-md max-h-80	">
        <h1 className="mt-2 text-center text-lg text-">View Your Rewards</h1>
        <div className="flex flex-row text-center text-white">
          Your Total Staked: {Number(stakedBalance).toFixed(2)}
        </div>
        <div className="flex flex-row text-center text-white">
          Your Available Rewards: {Number(rewardBalance).toFixed(6)}
        </div>
        <div className="mt-5 justify-center flex flex-row">
          <button
            className="border-2 border-white-500 rounded-lg p-1 mr-1 buttonn"
            onClick={refreshRewards}
          >
            Refresh
          </button>
          <button
            className="border-2 border-white-500 rounded-lg p-1 ml-1 buttonn"
            onClick={claim}
          >
            Claim
          </button>
        </div>
        <div>
          <form className="flex flex-row" onSubmit={(e) => e.preventDefault()}>
            <input
              className="w-13 text-black max-h-7 mt-1"
              onChange={(e) => setUnstakeInput(e.target.value)}
            />
            <button
              className="border-2 border-white-500 rounded-lg p-1 ml-1 buttonn"
              onClick={unstake}
            >
              Unstake
            </button>
          </form>
        </div>
      </div>
      {/* ---------- View reward tokens---------*/}
      <div className="flex  flex-nowrap flex-col justify-between border-2 boxes mt-5 p-5 rounded-md min-h-fit max-h-80">
        <h1 className="mt-2 text-center text-xl">Rewards Pool</h1>
        <div className="flex flex-row text-center text-white rewards">
          Total Rewards Available: {Number(totalRewards).toFixed(2)}
        </div>
        <div className="flex flex-row text-center text-white rewards">
          Current APY: {(Number(rewardPerToken) / 1).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default Main;
