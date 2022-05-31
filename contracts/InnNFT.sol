// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract InnNFT is ERC721URIStorage {
  uint256 public tokenCount = 0;

  constructor() ERC721("Inn NFT", "INN") {}

  // The following functions are overrides required by Solidity.

  function mint(string memory _tokenURI) external returns (uint256) {
    tokenCount++;
    _safeMint(msg.sender, tokenCount);
    _setTokenURI(tokenCount, _tokenURI);
    return (tokenCount); //return NFT token ID
  }
}
