// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract Crowdfunding is ERC20 {
    //data feeds地址对为Seploia ETH/USD
    AggregatorV3Interface internal dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    using SafeMath for uint256;

    address public owner;
    uint256 public totalEthGoal ;
    uint256 public endTime;
    uint256 public totalEthRaised;
    bool public goalReached;

    enum CrowdFundingState {
        Active,
        Failed,
        Successful,
        Withdrawn
    }
    CrowdFundingState public currentState;
    
    mapping(address => uint256) public contributions;
    mapping(address => bool) public isContributor;

    event GoalReached(uint256 totalEthRaised);
    event Contribution(address contributor, uint256 amount);

    constructor(uint256 _totalEthGoal, uint256 _endTime) ERC20("0XCFTOKEN","0XFT"){
        owner = msg.sender;
        totalEthGoal = _totalEthGoal;
        endTime = block.timestamp + _endTime;
        _mint(owner, 10000 * 10 ** decimals());  
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }
    //向地址发送以太币，接收对应的Token凭证，换算比例为1u=2FT
    function contribute() public payable {
        require(msg.value >= 1e16,"Contribution must be at least 0.01 ethers");
        require(block.timestamp < endTime, "Crowdfunding has ended");
        require(!goalReached, "Goal already reached");

        uint256 _amount = msg.value;  // 使用实际发送的以太币数量,这个单位是wei
        uint256 _amountEth = _amount/1e18;
        

        contributions[msg.sender] = contributions[msg.sender].add(_amount);
        totalEthRaised = totalEthRaised.add(_amountEth);

        emit Contribution(msg.sender, _amountEth);
        isContributor[msg.sender] = true;

        if (totalEthRaised >= totalEthGoal) {
            goalReached = true;
            emit GoalReached(totalEthRaised);
        }
       // uint256 tokenAmount = _amountEth.mul(100); 
        //根据ETH换算出U，1u=2FT
       uint256 tokenAmount = convertEthAmountValue(msg.value).mul(2);
        _transfer(owner, msg.sender, tokenAmount);

      
    }
   //支持将合约存款提取到owner地址
    function withdrawFunds() public onlyOwner {
        require(goalReached, "Goal not reached");
        payable(owner).transfer(address(this).balance);
    }

    //支持销毁多余的erc20 token
    function burnToken(uint _amount) public{
        _burn(msg.sender,_amount);
    }

    function convertEthAmountValue(uint256 ethAmount) public view  returns(uint256){
        (
            /* uint80 roundID */,
            int answer,//eth价格
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        //这里换算的是U，所以是10 ** 8次方
        return(ethAmount * uint256(answer) / (10 ** 8));
    }

    // 众筹结束且未达到目标时，更新状态
    function evaluateGoal() public onlyOwner {
        require(block.timestamp > endTime, "Crowdfunding is still active");
        require(!goalReached, "Goal was reached");
        currentState = CrowdFundingState.Failed;
    }

    // 退款函数
    function refund() public {
        require(currentState == CrowdFundingState.Failed, "Goal was reached or still active");
        require(contributions[msg.sender] > 0, "No contribution found");

        // 计算要退还的金额
        uint256 contribution = contributions[msg.sender];
        contributions[msg.sender] = 0;

        // 发送退款
        (bool success, ) = payable(msg.sender).call{value: contribution}("");
        require(success, "Refund transfer failed");
    }


}

