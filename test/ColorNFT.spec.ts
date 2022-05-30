import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";

import { ethers } from "hardhat";
import { deployContract } from "../helpers/deployHelpers";
import { ColorNFT } from "../typechain/ColorNFT";

describe("ColorNFT.sol", () => {
  let accounts: SignerWithAddress[], deployer: SignerWithAddress, investor: SignerWithAddress;
  let colorNFT: ColorNFT;

  before(async () => {
    accounts = await ethers.getSigners();
    deployer = accounts[0];

    colorNFT = await deployContract("ColorNFT");
  });

  it("should properly deploy a color NFT with name and symbol", async () => {
    const name = await colorNFT.name();
    const symbol = await colorNFT.symbol();

    expect(name).to.equal("Color NFT");
    expect(symbol).to.equal("COLOR");
  });
});
