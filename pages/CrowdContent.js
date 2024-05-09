import React, {useEffect, useState} from 'react';
import {  useNavigate } from "react-router-dom";
import {useRouter} from "next/router";
import {
    Layout,
    Nav,
    Button,
    Breadcrumb,
    Tooltip,
    Toast,
    Typography,
    Spin,
    Divider
} from '@douyinfe/semi-ui';
import {
    IconHelpCircle,
    IconBytedanceLogo,
    IconHome,
    IconHistogram,
    IconLive,
    IconSetting,
    IconLock, IconUnlock, IconCalendar, IconLink, IconSemiLogo, IconCode, IconLayers,
} from '@douyinfe/semi-icons';


import "@douyinfe/semi-ui/dist/css/semi.css";
import {IllustrationSuccess, IllustrationSuccessDark} from "@douyinfe/semi-illustrations";
import Head from "next/head";
import {ethers} from "ethers";
import contractAbi from "../contracts/CrowdFundingABI.json";
import contractBytecode from "../contracts/CrowdFundingByteCode.json";

//此页面用于处理众筹合约的部署
const CrowdContent = ({goToCrowdCallContent }) => {
    const { Title ,Text} = Typography;
    const { Header, Footer, Sider, Content } = Layout;

    const[contractAddress,setContractAddress] = useState();
    const[deployHash,setDeployHash] = useState();
    const [loading, setLoading] = useState(false);
    //初始值为众筹目标和众筹时间
    const[ethGoal,setEthGoal] = useState();
    const[endTime,setEndTime] = useState();

    async function deployContract() {
        // 检查MetaMask是否已经安装
        if (!window.ethereum) {
            console.error('MetaMask is not installed');
            return;
        }

        //这里使用的是ethers Web3Provider
        const providerWeb3 = new ethers.BrowserProvider(window.ethereum);
        //所有账号
        const currenAccounts = await window.ethereum.request({ method: "eth_requestAccounts", });
        //第一个账号
        const signer = await providerWeb3.getSigner(currenAccounts[0]);

        // 创建合约工厂
        const contractFactory = new ethers.ContractFactory(contractAbi, contractBytecode, signer);
        setLoading(true)
        // 部署合约并传入两个int类型的初始值{众筹目标，截止时间},创建BaseContract
            const CrowdFundingContract = await contractFactory.deploy(ethGoal,endTime);
            const contractAddress = await CrowdFundingContract.getAddress();
            setContractAddress(contractAddress);

            await CrowdFundingContract.deploymentTransaction().wait();
            setLoading(false)
            const deployHash = CrowdFundingContract.deploymentTransaction().hash;
            setDeployHash(deployHash);
        let opts = {
            content: 'Deploy Contract Success! The tx hash is:'+deployHash,
            duration: 3,
            theme: 'light',
        };
       Toast.success(opts)
       //部署后跳转
       goToCrowdCallContent(contractAddress);
    }


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
                routes={['ChainRaise', 'CrowdFundingDeploy']}
            />
            <div
                style={{
                    borderRadius: '10px',
                    border: '1px solid var(--semi-color-border)',
                    height: '376px',
                    padding: '32px',
                }}
            >
                <Title style={{textAlign:"center",color:"rgba(var(--semi-indigo-1), 1)"}}>🦋部署众筹合约</Title>
                <br/>
                <br/>

                <div className="container">
                    <Title heading={3} style={{textAlign:"center",color:"rgba(var(--semi-green-2), 1)"}}>🐛构造器参数初始化</Title>
                    <input
                        type="text"
                        id="ethGoal"
                        value={ethGoal}
                        onChange={(e) => setEthGoal(e.target.value)}
                        placeholder="请输入众筹目标（ETH）"
                    />
                    <input
                        type="text"
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        placeholder="请输入截止时间（unix秒）"
                    />
                    <Tooltip
                        position='top'
                        content='请仔细检查初始化参数'>
                    <button onClick={deployContract} style={{marginLeft:"400px"}}>点击部署</button>
                    </Tooltip>
                </div>
                <Divider margin='12px'>
                    <IconLayers />
                </Divider>
                <Text link={{href: 'https://github.com/henryhugyq/abc/blob/main/CrowdFundingABI.json'}} icon={<IconCode />} underline>ABI</Text>
                <br/>
                <Text link={{href: 'https://github.com/henryhugyq/abc/blob/main/CrowdFundingByteCode.json'}}  icon={<IconCode />} underline>Bytecode</Text>
                <br/>
                {loading && <Spin tip="请签名交易并等待打包确认...">
                    <div

                    >
                    </div>
                </Spin>}
            </div>
            <style jsx>
                {`
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
                .container {
                  border: 4px solid #eebb5e; 
                  border-radius: 15px; 
                  padding: 20px;
                  margin: 0 auto;
                  width: fit-content;
                }
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
`}
            </style>
        </Content>
    );
};

export default CrowdContent;
