import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployContract } from "../helpers/deployHelpers";
import { InnNFT } from "../typechain/InnNFT";

describe("InnNFT.sol", () => {
  let accounts: SignerWithAddress[], deployer: SignerWithAddress, investor: SignerWithAddress;
  let innNFT: InnNFT;

  before(async () => {
    accounts = await ethers.getSigners();
    deployer = accounts[0];

    innNFT = await deployContract("InnNFT");
  });

  it("should properly deploy a Inn NFT with name and symbol", async () => {
    const name = await innNFT.name();
    const symbol = await innNFT.symbol();

    expect(innNFT.address).to.not.be.undefined;

    expect(name).to.equal("Inn NFT");
    expect(symbol).to.equal("INN");
  });

  it("should successfully mint a new Inn NFT", async () => {
    const tokenURIPath = "https://gateway.pinata.cloud/ipfs/QmbgUesgEojZmkRuwiuhBBgesspX7qs5c1t3c2QsK15LNH/json/0.json";

    await innNFT.mint(tokenURIPath);

    const balanceOfOwner = await innNFT.balanceOf(deployer.address);
    expect(balanceOfOwner).to.equal(1);

    const tokenURI = await innNFT.tokenURI(1);
    expect(tokenURI).to.equal(tokenURIPath);

    const tokenCount = await innNFT.tokenCount();
    expect(tokenCount).to.equal(1);
  });
});
