import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployContract } from "../helpers/deployHelpers";
import { toWei } from "../helpers/utilsHelper";
import { InnNFT, NFTMarketplace } from "../typechain";

describe("NFTMarketplace.sol", () => {
  let accounts: SignerWithAddress[], deployer: SignerWithAddress, investor: SignerWithAddress;
  let nftMarketplace: NFTMarketplace;
  let innNFT: InnNFT;

  before(async () => {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    investor = accounts[1];

    innNFT = await deployContract("InnNFT");

    nftMarketplace = await deployContract(
      "NFTMarketplace",
      {
        args: [1],
      },
      false
    );
  });

  it("should have a fee percent associated with it, and a fee account that's the same as the deployer account", async () => {
    const feePercent = await nftMarketplace.feePercent();

    expect(feePercent).to.be.equal(1);

    const feeAccount = await nftMarketplace.feeAccount();

    expect(feeAccount).to.be.equal(deployer.address);
  });

  describe("Making marketplace items", () => {
    beforeEach(async () => {
      const tokenURIPath =
        "https://gateway.pinata.cloud/ipfs/QmbgUesgEojZmkRuwiuhBBgesspX7qs5c1t3c2QsK15LNH/json/0.json";

      await innNFT.connect(deployer).mint(tokenURIPath);

      await innNFT.connect(deployer).setApprovalForAll(nftMarketplace.address, true);
    });

    it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async () => {
      await expect(nftMarketplace.connect(deployer).makeItem(innNFT.address, 1, toWei(1)))
        .to.emit(nftMarketplace, "Offered")
        .withArgs(1, innNFT.address, 1, toWei(1), deployer.address);

      //owner of NFT should now be the marketplace

      const owner = await innNFT.ownerOf(1);
      expect(owner).to.be.equal(nftMarketplace.address);

      // verify if the item that was added to the marketplace has the correct fields;

      const item = await nftMarketplace.items(1);

      expect(item.itemId).to.equal(1);
      expect(item.nft).to.equal(innNFT.address);
      expect(item.price).to.equal(toWei(1));
      expect(item.seller).to.equal(deployer.address);
      expect(item.sold).to.equal(false);
    });

    it("should fail if we try to makeItem in our markeplace with price of zero", async () => {
      await expect(nftMarketplace.connect(deployer).makeItem(innNFT.address, 2, 0)).to.be.revertedWith(
        "Price must be greater than 0."
      );
    });

    it("should throw an error if msg.sender tries to sell an NFT that it doesn't own", async () => {
      await expect(nftMarketplace.connect(investor).makeItem(innNFT.address, 1, toWei(1))).to.be.revertedWith(
        "You are not the owner of this token"
      );
    });
  });
});
