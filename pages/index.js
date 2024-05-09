import { useState, useEffect } from 'react'
import {Contract, ethers, } from 'ethers';
import Head from "next/head";

function Home() {
    //ethers v6
    const [account, setAccount] = useState();
    const [balance, setBalance] = useState();
    const [chainId,setChainId] = useState();
    const [contract, setContract] = useState();
    const [contract2,setContract2] = useState();
    const [provider,setProvider] = useState();
    const [blockNumber,setBlockNumber] = useState();
    const [id,setId] = useState();

    const [to,setTo] = useState();
    const[amount,setAmount] = useState();

    const[greet,setGreeting] = useState();
    // let constract = new Contract("",abi,singer)

    //合约地址和可读abi
    const MYTOKEN_ADDRESS = "0x76f5c15b459044542169151f335575f501cf5ec0";
    const MYTOKEN_ABI = [
        "function getGreeting() public view returns (string memory)",
        "function setGreeting(string memory _greeting) public",
    ];


    //供应链合约的地址和abi
    const SUPPLY_ADDRESS = "0xb970639804e67bf0b925a6e3f703e9362ab92f59";
    const SUPPLY_ABI = [
        "function getProduct(uint _productId) public view returns (string memory, string memory, string memory, string memory, bool)",
    ];
    //点击按钮的时候登录
    const connectOnclick = async() => {
        if (!window.ethereum) {
           alert("Metamask not installed")
           return ;
        }
        //这里使用的是ethers BrowserProvider
        const providerWeb3 =  await new ethers.BrowserProvider(window.ethereum);
        setProvider(providerWeb3);
        //获取账户
        const currenAccount = await window.ethereum.request({method: "eth_requestAccounts",});
        setAccount(currenAccount[0]);
        window.ethereum.on("accountsChanged",function(accountsChange) {
            setAccount(accountsChange[0]);
        })
        //获取signer来创建contract实例
        const signer = await providerWeb3.getSigner();

        //合约1
        const contract = await new Contract(MYTOKEN_ADDRESS,MYTOKEN_ABI,signer);
        setContract(contract)

        //合约2
        const contract2 = await new Contract(SUPPLY_ADDRESS,SUPPLY_ABI,signer);
        setContract2(contract2)

        //获取余额
        const currentBalance = await providerWeb3.getBalance(currenAccount[0]);
     setBalance(ethers.formatEther(currentBalance));

     let blockNumber = await providerWeb3.getBlockNumber();
     setBlockNumber(blockNumber)

    //切换账号并获取余额
    window.ethereum.on("accountsChanged", function (accountsChange) {
        setAccount(accountsChange[0]);
        providerWeb3.getBalance(accountsChange[0]).then((result) => {
            setBalance(ethers.formatEther(result))
        });
    })
    //获取chainId
    const chainId = await window.ethereum.request({method:"eth_chainId"})
    window.ethereum.on("chainChanged", handleChainChanged);
    setChainId(chainId)

}

    //实现转账功能
    const sendTransaction = async() =>{
      const signer = await provider.getSigner();
      const tx = {
            to: to,
            value:ethers.parseEther(amount)
        };
        const response =await signer.sendTransaction(tx);
        console.log(response.hash)
        alert(response.hash)
    }

    const setGreet = async() =>{
        try {
            let tx = await contract.setGreeting(greet)
            //等待上链
            await tx.wait()
            alert(tx.hash)
            console.log(tx)
        }catch (error){
            alert(error.message)
        }
    }
    const getGreet = async() =>{
        console.log(contract)
        try{ let a  = await contract.getGreeting();
            alert(a);
        }catch (error){
            alert(error)
        }
        }


    const getProduct = async() =>{
        try {
            let products = await contract2.getProduct(id)
            alert(products)
        }catch (error){
            alert(error.message)
        }
    }

    function handleChainChanged(chainId) {
        window.location.reload();
    }



    return (


        <>
            <Head>
                <link rel="shortcut icon" href="../static/cat.png" />
                <title>2024-Dapp</title>
            </Head>

            <div className="top">
                <a href="/" style={{float:"left",color:"#2B333E",textDecoration:"none",fontSize:"28px",borderRadius:"8px"}}>Home</a>
                <a href="vote" style={{marginLeft:"20px",color:"#2B333E",textDecoration:"none",fontSize:"28px",borderRadius:"8px"}}>Vote</a>
                <a href="ChainRaise" style={{marginLeft:"20px",color:"#2B333E",textDecoration:"none",fontSize:"28px",borderRadius:"8px"}}>ChainRaise</a>
                {account ?
                    <button href="#" style={{ float: 'right' }} >🔐Connected</button>
                    :
                    <button href="#" style={{ float: 'right' }}onClick={connectOnclick} >🔓️Connect Wallet</button>
                }
            </div>
            <div className="container">

                    <h1 id="title" style={{textAlign:'center' ,color:"deepskyblue"}}>🦄 Wallet Info</h1>
                        <h2 style={{color:"#8ABCD1"}}>Network Type:{chainId}</h2>
                        <h2 style={{color:"#1661AB"}}>Account:{account}</h2>
                        <h2 style={{color:"#1661AB"}}>Balance:{balance}</h2>
                        <h2 style={{color:"#1661AB"}}>BlockNumber:{blockNumber}</h2>

                        <hr/>

                    <h1 id="title" style={{textAlign:'center' ,color:"#B0D992"}}>🐸 Transfer ETH</h1>
                        <h2 style={{color:"#8DB799"}}>Recipient Address:</h2>
                        <input
                            type="text"
                            id="toAddress"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder="Enter recipient address|eg:0xbb6CA689d846e658544308ae4EBf4C623702E047"
                        />
                        <h2 style={{color:"#8DB799"}}>Amount (ETH):</h2>
                        <input
                            type="text"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount in ETH|eg:0.01"
                        />
                        <br></br>
                        <button onClick={sendTransaction}>Send</button>

                        <hr/>

                        <h1 id="title" style={{textAlign:'center' ,color:"#E9B6BE"}}>🌷 Call Contract</h1>
                        <input
                            type="text"
                            id="greet"
                            value={greet}
                            onChange={(e) => setGreeting(e.target.value)}
                            placeholder="Set the Value to the Blockchain"
                        />
                        <button  onClick={setGreet}>Set The Value</button>
                        <button  onClick={getGreet}>Get The Value</button>

                        <hr/>

                        <h1 id="title" style={{textAlign:'center' ,color:"#bcf1eb"}}>🐏SupplyChain</h1>
                        <input
                            type="text"
                            id="id"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="Input the ID to get the Products detail"
                        />
                        <button  onClick={getProduct}>Get The Products</button>
                        <h4 style={{textAlign:'center',color:"grey"}}>The Greeting Contract Address is <a href="https://www.oklink.com/cn/sepolia-test/address/0x76f5c15b459044542169151f335575f501cf5ec0" style={{textDecoration:"none",color:"lightslategrey"}}>0x76f5c15b459044542169151f335575f501cf5ec0</a></h4>
                        <h5 style={{color:"chocolate",textAlign:'center'}}>Read the doc🦊<a href="https://docs.metamask.io/wallet/">https://docs.metamask.io/wallet/</a></h5>
                        <h5 style={{color:"slateblue",textAlign:'center'}}>Ethers.js v6🍃<a href="https://docs.ethers.org/v6/">https://docs.ethers.org/v6/</a></h5>


            </div>


            <style jsx>
                {`
                  * {
                    box-sizing: border-box;
                  }

                  body {
                    font-family: Arial;
                    padding: 10px;
                    background: #f1f1f1;
                  }


                  .top {
                    overflow: hidden;
                    background-color: #E5DFD5;
                    padding: 10px;
                    margin-top: 0;
                  }

                  .top button {
                    padding: 9px 16px;
                    max-height: 40px;
                    border-color: #a0b0ee;
                    color: #eacd76;
                    background-color: white;
                    border-radius: 8px;
                    align-items: center;
                    font-size: 16px;
                    text-align: center;
                    font-weight: bold;
                    cursor: pointer;
                  }

                  .container input {
                    border-top-style: hidden;
                    border-right-style: hidden;
                    border-left-style: hidden;
                    border-bottom-style: groove;
                    font-size: 16px;
                    width: 100%;
                    border-color: rgba(4, 4, 5, 0.1);
                    line-height: 32px;
                  }

                  .container button {
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
                  
                  .custom-alert {
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                    padding: 10px;
                    border-radius: 5px;
                }




                `}
            </style>

        </>
    )
}

export default Home;

