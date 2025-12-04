const hre = require("hardhat");

async function main() {
  console.log("Deploying Mastermind contract...");

  const Mastermind = await hre.ethers.getContractFactory("Mastermind");
  const mastermind = await Mastermind.deploy();

  await mastermind.waitForDeployment();

  const address = await mastermind.getAddress();
  console.log(`Mastermind deployed to: ${address}`);
  console.log("\nNext steps:");
  console.log(`1. Update CONTRACT_ADDRESS in lib/contract-abi.ts to: ${address}`);
  console.log(`2. Verify contract: npx hardhat verify --network celo ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
