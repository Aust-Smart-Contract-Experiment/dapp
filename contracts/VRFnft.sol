// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//这里使用的chainlink-VRF v2.5
import {IVRFCoordinatorV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "./CrowdFunding.sol";

contract VRFnft is ERC721, ERC721Enumerable, ERC721URIStorage,VRFConsumerBaseV2Plus {
    uint256 private _nextTokenId;
    //VRF参数
    uint256 s_subscriptionId;
    address s_owner;
    IVRFCoordinatorV2Plus COORDINATOR;
    address vrfCoordinator = 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B;
    bytes32 s_keyHash = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
    uint32 callbackGasLimit = 520000;
    uint16 requestConfirmations = 3;
    uint32 numWords =  1;
    
    address public crowdfundingContract;


    //引用BAYC的metadata
    string constant META_DATA_1 = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/11";
    string constant META_DATA_2 = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/22";
    string constant META_DATA_3 = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/33";

    mapping (uint256 => uint256 ) public requestIdToTokenId;//requestID -> tokenID
    event TokenMinted(address indexed owner, uint256 tokenId);


    //！owner和ConfirmedOwnerWithProposal冲突！//
    constructor(address _crowdfundingContract,uint256 subscriptionId)
        ERC721("MyToken", "MTK")
        VRFConsumerBaseV2Plus(vrfCoordinator)
    {
         COORDINATOR = IVRFCoordinatorV2Plus(
            0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B
        );
        s_subscriptionId = subscriptionId;
        crowdfundingContract = _crowdfundingContract;
    }
    modifier onlyContributors() {
        require(Crowdfunding(crowdfundingContract).isContributor(msg.sender), "Caller is not a contributor");
        _;
    }

    //根据随机数去为tokenId随机匹配metadata
     function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 randomNumber = randomWords[0];
        uint256 tokenId = requestIdToTokenId[requestId];
        if(randomNumber %3 ==0){
            _setTokenURI(tokenId, META_DATA_1);
        }else if(randomNumber %3 == 1){
            _setTokenURI(tokenId, META_DATA_2);
        }else {
            _setTokenURI(tokenId, META_DATA_3);
        }
    }

    //众筹结束开启mintOpen
    function safeMint() public onlyContributors{
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        //_setTokenURI(tokenId, uri);
        uint requestId = COORDINATOR.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: s_keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
       requestIdToTokenId[requestId] = tokenId;
       emit TokenMinted(msg.sender, tokenId);
    }
   
    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
