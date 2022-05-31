// We require the Hardhat Runtime Environment explicitly here. This is optional

import { Contract } from "ethers";
import fs from "fs";
import hre from "hardhat";

import path from "path";
import { deployContract } from "../helpers/deployHelpers";
import { InnNFT } from "../typechain/InnNFT";

interface IABIOutput {
  contract: Contract;
  name: string;
}

async function main() {
  // * 1) Add the deploy contract below
  // * 2) Then, just insert it into the abiOutputs array

  const innNFT = await deployContract<InnNFT>("InnNFT");
  const abiOutputs: IABIOutput[] = [
    {
      contract: innNFT,
      name: "InnNFT",
    },
  ];
  generateABI(abiOutputs);

  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0];

  await innNFT.mint("https://gateway.pinata.cloud/ipfs/QmbgUesgEojZmkRuwiuhBBgesspX7qs5c1t3c2QsK15LNH/json/0.json");

  const balanceOf = await innNFT.balanceOf(deployer.address);

  console.log(`Transferring to ${deployer.address}`);

  console.log("Balance of Rinkeby wallet: ", balanceOf.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

function generateABI(abiOutputs: IABIOutput[]) {
  for (const output of abiOutputs) {
    const artifactPath = path.resolve(__dirname, `../artifacts/contracts/${output.name}.sol/${output.name}.json`);

    const artifact = fs.readFileSync(artifactPath);

    const artifactData = JSON.parse(artifact.toString());
    const networkName = hre.network.name;
    const chainId = hre.network.config.chainId;
    artifactData.address = output.contract.address;
    artifactData.network = {
      name: networkName,
      chainId: chainId,
    };

    fs.writeFileSync(artifactPath, JSON.stringify(artifactData));

    console.log("Saving Contract data on file: ", artifactPath);
  }
}

export { deployContract };
