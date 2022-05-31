const { expect } = require("chai");
const { ethers } = require("hardhat");
const { moveBlocks } = require("./utils/move-blocks");
const { moveTime } = require("./utils/move-time");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);
const SECONDS_IN_A_DAY = 86400;

describe("Staking Test", async function () {
  let staking, rewardToken, deployer, dai, stakeAmount, addr1, addr2;

  beforeEach(async function () {
    // Get Contract Factories
    const RewardToken = await ethers.getContractFactory("RewardToken");
    const Staking = await ethers.getContractFactory("Staking");
    // Get Signers
    [deployer, addr1, addr2] = await ethers.getSigners();
    // Deploy Contracts
    rewardToken = await RewardToken.deploy();
    staking = await Staking.deploy(rewardToken.address, rewardToken.address);
    // Sends tokens to Address 2
    await rewardToken.transfer(addr2.address, toWei(200000));
    // Other Constants
    stakeAmount = toWei(100000);
  });

  it("Allows users to stake and claim rewards", async function () {
    // Account 1 stakes
    await rewardToken.approve(staking.address, stakeAmount);
    await staking.stake(stakeAmount);
    const startingEarned = await staking.earned(deployer.address);
    console.log(`Starting Earned Account 1: ${startingEarned}`);
    // Account 2 stakes
    await rewardToken.connect(addr2).approve(staking.address, stakeAmount);
    await staking.connect(addr2).stake(stakeAmount);
    const startingEarned2 = await staking.connect(addr2).earned(addr2.address);
    console.log(`Starting Earned Account 2: ${startingEarned2}`);

    // Move time and blocks to generate rewards
    await moveTime(SECONDS_IN_A_DAY);
    await moveBlocks(1);

    // Check Rewards again after time has past
    const endingEarned = await staking.earned(deployer.address);
    console.log(`Ending Earned Account 1: ${endingEarned}`);
    const endingEarned2 = await staking.connect(addr2).earned(addr2.address);
    console.log(`Ending Earned Account 2: ${endingEarned2}`);
  });
});
