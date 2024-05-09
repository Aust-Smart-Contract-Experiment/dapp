import React, {useEffect, useState} from 'react';
import {
    Layout,
    Nav,
    Button,
    Avatar,
    Dropdown,
    Toast,
    Popover,
    Empty,
    Tooltip,
    Notification, Banner,
    LocaleProvider,
} from '@douyinfe/semi-ui';
import {
    IconHelpCircle,
    IconBytedanceLogo,
    IconHome,
    IconHistogram,
    IconLive,
    IconSetting,
    IconLock, IconUnlock, IconCalendar, IconBeaker, IconPuzzle, IconGallery, IconGlobe, IconSun, IconMoon,
} from '@douyinfe/semi-icons';
import "@douyinfe/semi-ui/dist/css/semi.css";
import {IllustrationSuccess, IllustrationSuccessDark} from "@douyinfe/semi-illustrations";
import Head from "next/head";
import HomeContent from "./HomeContent";
import SettingContent from "./SettingContent";
import MintContent from "./MintContent";
import CrowdContent from "./CrowdContent";
import {Contract, ethers} from "ethers";
import CrowdCallContent from "./CrowdCallContent";
import MintDeploy from "./MintDeploy";
import en_GB from "@douyinfe/semi-ui/lib/es/locale/source/en_GB";
import ja_JP from '@douyinfe/semi-ui/lib/es/locale/source/ja_JP';



function chainRaise() {
    const { Header, Footer, Sider, Content } = Layout;
    const [selectedKey, setSelectedKey] = useState('Home');
    const [account, setAccount] = useState();
    const [balance, setBalance] = useState();
    const [provider,setProvider] = useState();
    const [blockNumber,setBlockNumber] = useState();
    const [contractAddress, setContractAddress] = useState(null);
    const [contractAddress2, setContractAddress2] = useState(null);
    const [switchStatus,setswitchStatus] = useState(true)




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
        //获取余额
        const currentBalance = await providerWeb3.getBalance(currenAccount[0]);
        setBalance(ethers.formatEther(currentBalance));
        //切换账号并获取余额
        window.ethereum.on("accountsChanged", function (accountsChange) {
            setAccount(accountsChange[0]);
            providerWeb3.getBalance(accountsChange[0]).then((result) => {
                setBalance(ethers.formatEther(result))
            });
        })


            Notification.success({
                title: 'Connected to Wallet',
                content: 'You have successfully connected to your wallet.',
                duration: 3,
                position: 'topLeft'
            });
    }
    const handleMenuClick = (itemKey) => {
        setSelectedKey(itemKey);

    };

    const goToCrowdCallContent = (address) => {
        setSelectedKey('CrowdCallContent'); // 更新 selectedKey
        setContractAddress(address); // 存储合约地址
    };

    const goToMintContent = (address2) => {
        setSelectedKey('MintContent'); // 更新 selectedKey
        setContractAddress2(address2); // 存储合约地址
    };


    const ToastBalance = async ()=>{
        let opts = {
            content: 'Hi,Your Balance is<'+ balance + ">ETH",
            duration: 3,
            theme:"light"
        }
        Toast.info(opts)
    }
    //显示账户
    const ToastAccount = async ()=>{
        let opts = {
            content: 'Hi,Your Account is<'+ account + ">",
            duration: 3,
            theme:"light"
        }
        Toast.info(opts)
    }

    const switchMode = () => {
        const body = document.body;
        if (body.hasAttribute('theme-mode')) {
            body.removeAttribute('theme-mode');

            setswitchStatus(true)
        } else {
            body.setAttribute('theme-mode', 'dark');
            setswitchStatus(false)

        }
    };


    return (
        <>

         <Head>
             <link rel="shortcut icon" href="../static/crowdfunding.png" />
             <title>Chain Raise</title>
         </Head>
        <Layout style={{ border: '1px solid var(--semi-color-border)' }}>
            <Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
                <Banner
                    type="info"
                    description="请使用metamask链接到此网站"
                />
                <div>
                    <Nav mode="horizontal" defaultSelectedKeys={['Home']}>
                        <Nav.Header>
                            <IconCalendar style={{ height: '36px', fontSize: 36 ,color:"rgba(var(--semi-indigo-4), 1)"}} />
                        </Nav.Header>
                        <span
                            style={{
                                color: 'var(--semi-color-text-2)',
                            }}
                        >
                            <span
                                style={{
                                    marginRight: '24px',
                                    color: 'rgba(var(--semi-light-blue-3), 1)',
                                    fontWeight: '600',
                                }}
                            >
                               ChainRaise
                            </span>

                        </span>
                        <Nav.Footer>

                            {switchStatus ?
                                <Tooltip
                                    position='bottom'
                                    content='切换到黑夜模式'>
                                <Button
                                theme="borderless"
                                onClick={switchMode}
                                icon={<IconSun />}
                                style={{
                                    color: 'rgba(var(--semi-orange-4), 1)',
                                    marginRight: '12px',
                                }}
                            />
                                </Tooltip>:
                                <Tooltip
                                    position='bottom'
                                    content='切换到白天模式'>
                                <Button
                                    theme="borderless"
                                    onClick={switchMode}
                                    icon={<IconMoon />}
                                    style={{
                                        color: 'rgba(var(--semi-yellow-4), 1)',
                                        marginRight: '12px',
                                    }}
                                />
                                </Tooltip>
                            }

                            <Popover
                            content={
                                <Empty
                                    title={'ChainRaise Tips'}
                                    description="1.使用metamask链接到此网站|
                                    2.NFT铸造使用VRF随机数随机匹配metadata,部署合约后请将铸造合约地址在VRF控制台添加为Consumer|3.众筹板块需要先部署合约再操作，每次刷新将重置部署界面"
                                    style={{ width: 400, margin: '0 auto', display: 'flex', padding: 20 }}
                                />
                            }
                        >
                                <Button
                                    theme="borderless"
                                    icon={<IconHelpCircle size="large" />}
                                    style={{
                                        color: 'rgba(var(--semi-indigo-1), 1)',
                                        marginRight: '12px',
                                    }}
                                />

                        </Popover>
                            {account ?
                                <>

                                <Button
                                    href="#"
                                    theme="borderless"
                                    style={{  color: 'rgba(var(--semi-cyan-1), 1)', marginRight: '12px',}}
                                    icon={<IconLock size="large"/>}
                                />
                                    <Dropdown
                                        render={
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={ToastAccount} icon={<IconGlobe /> } style={{color:"rgba(var(--semi-teal-8), 1)"}}>Account</Dropdown.Item>
                                                <Dropdown.Item onClick={ToastBalance} icon={<IconGallery />}style={{color:"rgba(var(--semi-yellow-6), 1)"}}>Balance</Dropdown.Item>
                                            </Dropdown.Menu>
                                        }
                                    >
                                    <Avatar
                                        alt="beautiful cat"
                                        src="../static/cat_head.jpg"
                                        style={{ margin: 4 }}
                                        />
                                    </Dropdown>
                                </>
                                :
                                <Tooltip
                                    position='bottom'
                                    content='点此按钮连接钱包'>
                                <Button
                                    href="#"
                                    theme="borderless"
                                    style={{
                                    color: 'rgba(var(--semi-cyan-1), 1)',
                                    marginRight: '12px',}}
                                    onClick={connectOnclick}
                                    icon={<IconUnlock size="large"/>}

                                />
                                </Tooltip>

                            }



                        </Nav.Footer>
                    </Nav>
                </div>
            </Header>
            <Layout>
                <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
                    <Nav
                        style={{ maxWidth: 220, height: '100%' }}
                        items={[
                            { itemKey: 'Home', text: '首页',icon: <IconHome size="large" />,onClick: () => handleMenuClick('Home')},
                            { itemKey: 'Mint', text: '铸造面板', icon: <IconPuzzle size="large" /> ,onClick: () => handleMenuClick('Mint')},
                            { itemKey: 'Crowd', text: '众筹面板', icon: <IconBeaker size="large" /> ,onClick: () => handleMenuClick('Crowd')},
                            { itemKey: 'Setting', text: '设置', icon: <IconSetting size="large" />, onClick: () => handleMenuClick('Setting')},
                        ]}

                        footer={{
                            collapseButton: true,
                        }}
                    />
                </Sider>
                {/* 这里根据 selectedKey 的值来渲染不同的页面内容 */}
                {selectedKey === 'Home' && <HomeContent />}
                {selectedKey === 'Mint' && <MintDeploy
                    goToMintContent={goToMintContent}/>}
                {selectedKey === 'MintContent' && (
                    <MintContent
                        contractAddress2={contractAddress2}
                    />
                )}
                {selectedKey === 'Crowd' && <CrowdContent
                    goToCrowdCallContent={goToCrowdCallContent} />}
                {selectedKey === 'CrowdCallContent' && (
                    <CrowdCallContent
                        contractAddress={contractAddress}
                    />
                )}
                {selectedKey === 'Setting' && <SettingContent />}

            </Layout>
            <Footer
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '20px',
                    color: 'var(--semi-color-text-2)',
                    backgroundColor: 'rgba(var(--semi-grey-0), 1)',
                }}
            >
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <span>Copyright © 2024-DAPP ChainRaise @Ethereum Sepolia </span>
                </span>

            </Footer>
        </Layout>
        </>
    );
}

export default chainRaise
