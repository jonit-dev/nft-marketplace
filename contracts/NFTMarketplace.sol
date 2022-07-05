// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard {
  address payable public immutable feeAccount; // account that receives fees;
  uint256 public immutable feePercent; //fee percentage on sales

  uint256 itemCount;

  // marketplace Item
  struct Item {
    uint256 itemId;
    IERC721 nft;
    uint256 tokenId;
    uint256 price;
    address payable seller;
    bool sold;
  }

  event Offered(uint256 itemId, address indexed nft, uint256 tokenId, uint256 price, address indexed seller);

  mapping(uint256 => Item) public items;

  constructor(uint256 _feePercent) {
    feeAccount = payable(msg.sender);
    feePercent = _feePercent;
  }

  function makeItem(
    IERC721 _nft,
    uint256 _tokenId,
    uint256 _price
  ) external nonReentrant {
    require(_nft.ownerOf(_tokenId) == msg.sender, "You are not the owner of this token");
    // require(!items[_tokenId].sold, "This token is already sold");
    require(_price > 0, "Price must be greater than 0.");

    itemCount++;

    //! Requires approval!
    _nft.transferFrom(msg.sender, address(this), _tokenId); //transfer the NFT ownership to the marketplace SC

    items[itemCount] = Item(itemCount, _nft, _tokenId, _price, payable(msg.sender), false);

    emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
  }
}
