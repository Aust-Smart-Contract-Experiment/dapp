//此页面用于演示合约调用
import React, {useEffect, useState} from 'react';

import {Breadcrumb, Input, Layout, Toast, Typography,Tooltip} from '@douyinfe/semi-ui';


import "@douyinfe/semi-ui/dist/css/semi.css";
import {ethers,Contract} from "ethers";
import {IconClock, IconCreditCard, IconGlobeStroke, IconLink, IconSearch} from "@douyinfe/semi-icons";
import Link from "next/link";
import {useRouter} from "next/router";


//此页面用于处理众筹合约的部署
const CrowdCallContent = ({contractAddress}) => {
    const { Header, Footer, Sider, Content } = Layout;
    const [provider,setProvider] = useState();
    const [contract,setContract] = useState();
    const [sentValue,setSentValue] = useState();
    const [account,setAccount] = useState();
    const [endTime,setEndTime] = useState();
    const [ftBalance,setFtBalance] = useState();
    const [totalGoal,setTotalGoal] = useState();
    const [totalRaised,setTotalRaised] =useState();
    const [url,setUrl] =useState();
    const [owner,setOwner]=useState();
    const CONTRACT_ABI = [
        "function contribute() public",
        "function balanceOf(address _owner) public view returns (uint256 balance)",
        "function endTime() public view returns (uint256)",
        "function totalEthGoal() public view returns (uint256)",
        "function totalEthRaised() public view returns (uint256)",
        "function withdrawFunds() public",
        "function goalReached() public view returns (bool)",
        "function convertEthAmountValue(uint256 ethAmount) public view  returns(uint256)",
        "function evaluateGoal() public",//onlyOwner,时间到了，reached为false
        "function refund() public",
        "function owner() public view returns (address)",
    ];

    const {Text} = Typography;


    const newContract = async () => {
        const providerWeb3 = await new ethers.BrowserProvider(window.ethereum);
        setProvider(providerWeb3);
        const currenAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(currenAccounts[0])
        window.ethereum.on("accountsChanged",function(accountsChange) {
            setAccount(accountsChange[0]);
        })
        const signer = await providerWeb3.getSigner(currenAccounts[0]);
        const contract = await new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
        setContract(contract);
    }
    useEffect(() => {
        newContract();
    }, []);

    //contribute
    const Contribute = async ()=>{
        try {
            await newContract();
            const tx = await contract.contribute({
                value: ethers.parseEther(sentValue)
            });
            await tx.wait()
            let opts = {
                content: 'Contribute ETH Success! The tx hash is:'+tx.hash,
                duration: 3,
                theme: 'light',
            };
            Toast.success(opts)
        }catch (error){
            Toast.error(error.message)
        }

    }

    //查询代币余额
    const FtBalance = async () => {
        await newContract();
        const balance = await contract.balanceOf(account);
        const bigIntBalance = BigInt(balance); // 将balance转换为BigInt类型
        const formattedBalance = (bigIntBalance / 10n**18n).toString().slice(0, 5); // 将BigInt类型的balance除以10的18次方，然后截取前四位数字
        setFtBalance(formattedBalance);
        console.log(formattedBalance);
    }
    //获取截止时间
    useEffect(() =>{
        if(!contract)
            return ;
        const getEndTime = async () => {

            const endTime = await contract.endTime(); // 获取Unix时间戳
            const endTimeNumber = Number(endTime); // 将BigInt类型的endTime转换为普通数字类型
            const date = new Date(endTimeNumber * 1000); // 将Unix时间戳转换为毫秒时间戳并创建Date对象
            const utc8Date = new Date(date.getTime() + (8 * 60 * 60 * 1000)); // 将日期时间调整为UTC+8时区
            const formattedEndTime = utc8Date.toUTCString(); // 将日期时间格式化为字符串
            setEndTime(formattedEndTime);
            console.log(formattedEndTime);
        }
         getEndTime()
    },[contract])

    //查询总众筹目标
    const getTotalGoal = async () => {
        const totalGoalBigInt = BigInt(await contract.totalEthGoal());
        const totalGoalStr = totalGoalBigInt.toString();
        const totalGoal = parseFloat(totalGoalStr);
        setTotalGoal(totalGoal);
    }

    //查询已经筹集的金额
    const getTotalRaised = async () => {
        const totalRaisedWei = Number(await contract.totalEthRaised());
        const totalRaisedEther = Number(totalRaisedWei) ; // 将BigInt转换为数字并除以10的18次方
        const totalRaisedEtherStr = totalRaisedEther.toFixed(2); // 保留两位小数
        setTotalRaised(totalRaisedEtherStr);
        console.log(totalRaisedWei);
        console.log(totalRaisedEther)
    }
     const withdrawFunds = async () =>{
        try{
            await newContract()
            const tx = await contract.withdrawFunds()
            await tx.wait()
            let opts = {
                content: 'Withdraw Funds Success! The tx hash is:'+tx.hash,
                duration: 3,
                theme: 'light',
            };
            Toast.success(opts)
        }catch(error){
            Toast.error(error.message)
        }

     }
     //查询筹集状态
    const getReached = async () =>{
        const goalReached = await contract.goalReached();
        let opts = {
            content: 'The GoalReached is:'+goalReached,
            duration: 3,
            theme: 'light',
        };
        Toast.info(opts)
    }
    //查询喂价
    const convertValue = async () =>{
        await newContract();
        const usdAmount = await contract.convertEthAmountValue(1)
        let opts = {
            content: 'The Current Feed ETH/USD is: 1/'+usdAmount,
            duration: 3,
            theme: 'light',
        };
        Toast.info(opts)
    }
     //取消众筹
    const cancelFund = async () =>{
        try{
            await newContract();
            const tx = await contract.evaluateGoal()
            await tx.wait()
            let opts = {
                content: 'The CrowdFunding has been canceled,The tx hash is:'+tx.hash,
                duration: 3,
                theme: 'light',
            };
            Toast.warning(opts)
        }catch (error){
            Toast.error(error.message)
        }

    }
    //退款
    const reFund = async () =>{
        try {
            await newContract();
            const tx = await contract.refund()
            await tx.wait()
            let opts = {
                content: 'Your donation has been refunded,The tx hash is:'+tx.hash,
                duration: 3,
                theme: 'light',
            };
            Toast.success(opts)
        }catch (error){
            Toast.error(error.message)
        }
    }
    const router = useRouter();


    useEffect(() =>{
        const generateMintContentUrl = () => {
            const url = `${router.basePath}/MintContent?contractAddress=${encodeURIComponent(contractAddress)}`;
            setUrl(url)
        };
        generateMintContentUrl()
    },[contractAddress])


    return (

        <Content
            style={{
                padding: '24px',
                backgroundColor: 'var(--semi-color-bg-0)',
            }}
        >
            <Breadcrumb
                style={{
                    marginBottom: '24px',
                }}
                routes={['ChainRaise', 'CrowdFundingCall']}
            />
            <div
                style={{
                    borderRadius: '10px',
                    border: '1px solid var(--semi-color-border)',
                    height: '376px',
                    padding: '32px',
                }}
            >
                <div className="container">
                    <h2 style={{textAlign:"center",color:"rgba(var(--semi-grey-9), 1)"}}>ChainRaise-众筹主页面</h2>
                    <h3 style={{color:"rgba(var(--semi-grey-9), 1)",textAlign:'center'}} >当前合约地址为: <a href={`https://sepolia.etherscan.io/address/${contractAddress}`} style={{color:"rgba(var(--semi-blue-2), 1)",textDecoration:"none"}}>{contractAddress}</a></h3>
                    <h5 style={{textAlign:"center",color:"rgba(var(--semi-grey-9), 1)"}}>截止时间(UTC+8)：<a style={{color:"rgba(var(--semi-yellow-4), 1)"}}>{endTime}</a></h5>
                    <h5 style={{textAlign:"center",color:"rgba(var(--semi-grey-9), 1)"}}>目标/已筹集[<a style={{color:"rgba(var(--semi-red-5), 1)"}}>{totalGoal}</a>/<a style={{color:"rgba(var(--semi-green-5), 1)"}}>{totalRaised}</a>]</h5>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        id="sentValue"
                        value={sentValue}
                        onChange={(e) => setSentValue(e.target.value)}
                        placeholder="请输入发送金额"
                    />
                        <Tooltip
                            position='top'
                            content='请仔细检查发送ETH数量'>
                    <button onClick={Contribute}>contribute</button>
                        </Tooltip>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip
                            position='top'
                            content='查询当前账户的FT数量'>
                        <button onClick={FtBalance}>查询余额</button>
                        </Tooltip>
                        <h4 style={{ color:"rgba(var(--semi-grey-9), 1)",marginLeft: '10px' }}>余额(ERC20)为：<a style={{color:"rgba(var(--semi-purple-2), 1)"}}>{ftBalance}</a></h4>
                    </div>
                    <button onClick={getTotalGoal} style={{}}>众筹总目标</button>
                    <button onClick={getTotalRaised} style={{marginLeft:20}}>已筹集目标</button>
                    <Tooltip
                        position='top'
                        content='众筹达到后，管理员可提取'>
                    <button onClick={withdrawFunds}style={{marginLeft:20}}>提取存款</button>
                    </Tooltip>
                    <button onClick={getReached}style={{marginLeft:20}}>众筹状态</button>
                    <Tooltip
                        position='top'
                        content='获取当前的Sepolia Data Feed'>
                    <button onClick={convertValue}style={{marginLeft:20}}>获取喂价</button>
                    </Tooltip>
                    <br/>
                    <br/>
                    <Tooltip
                        position='top'
                        content='众筹目标未达成，管理员标记状态为众筹取消'>
                    <button onClick={cancelFund}style={{}}>取消众筹</button>
                    </Tooltip>
                    <Tooltip
                        position='top'
                        content='众筹取消后，用户可退款'>
                    <button onClick={reFund}style={{marginLeft:20}}>退款</button>
                    </Tooltip>
                </div>
            </div>
            <style jsx>
                {`
                 button {
                    padding: 9px 16px;
                    max-height: 40px;
                    border-color: #c8f8b8;
                    color: #e7c8a1;
                    background-color: #f1ebc5;
                    border-radius: 8px;
                    align-items: center;
                    font-size: 16px;
                    font-weight: 500;
                    text-align: center;
                    font-weight: bold;
                    cursor: pointer;
                  }
                   input {
                    border-top-style: hidden;
                    border-right-style: hidden;
                    border-left-style: hidden;
                    border-bottom-style: groove;
                    font-size: 16px;
                    width: 100%;
                    border-color: rgba(4, 4, 5, 0.1);
                    line-height: 32px;
                  }
                `}
            </style>
        </Content>

    );
};

export default CrowdCallContent;
