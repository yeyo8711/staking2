require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  solidity: "0.8.7",
  networks: {
    bsc: {
      url: process.env.BSC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      bsc: process.env.BSC_API,
    },
  },
};
