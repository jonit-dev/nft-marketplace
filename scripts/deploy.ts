// We require the Hardhat Runtime Environment explicitly here. This is optional

import hre from "hardhat";

import { deployContract, generateABI, IABIOutput } from "../helpers/deployHelpers";
import { InnNFT } from "../typechain/InnNFT";
import { NFTMarketplace } from "../typechain/NFTMarketplace";

async function main() {
  // * 1) Add the deploy contract below
  // * 2) Then, just insert it into the abiOutputs array

  const innNFT = await deployContract<InnNFT>("InnNFT");
  const nftMarketplace = await deployContract<NFTMarketplace>("NFTMarketplace", {
    args: [1],
  });

  const abiOutputs: IABIOutput[] = [
    {
      contract: innNFT,
      name: "InnNFT",
    },
    {
      contract: nftMarketplace,
      name: "NFTMarketplace",
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

export { deployContract };
