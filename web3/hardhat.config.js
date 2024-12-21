require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

if (!process.env.PRIVATE_KEY) {
  console.error("ERROR: PRIVATE_KEY is not set in the .env file.");
  process.exit(1);
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "voltaTestnet",  // Set default network
  solidity: {
    version: "0.8.28",  // Use Solidity 0.8.28
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: true,  // Enable Yul optimization
        },
      },
      viaIR: true,  // Enable Intermediate Representation optimization
    },
  },
  networks: {
    voltaTestnet: {
      url: "https://volta-rpc.energyweb.org",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 73799,
      gasPrice: 20000000000, // Set custom gas price (20 Gwei)
      gas: 8000000,         // Set custom gas limit
    },
    localhost: {
      url: "http://127.0.0.1:8545", // Local testing with Hardhat/Ganache
      chainId: 31337,
    },
    hardhat: {
      chainId: 1337, // Internal Hardhat network
    },
  },
};
