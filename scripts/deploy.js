const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contracts here:
  // const RewardToken = await ethers.getContractFactory("RewardToken");
  // const rewardToken = await RewardToken.deploy();
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(
    rewardToken.address,
    rewardToken.address
  );

  console.log("Reward Token address:  ", rewardToken.address);
  console.log("Staking contract address ", staking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
