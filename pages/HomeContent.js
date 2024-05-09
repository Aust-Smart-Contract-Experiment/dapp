import React, {useEffect, useState} from 'react';
import {
    Layout,
    Breadcrumb,
    Image,
    Typography,
    LocaleProvider
} from '@douyinfe/semi-ui';
import {
    IconHelpCircle,
    IconBytedanceLogo,
    IconHome,
    IconHistogram,
    IconLive,
    IconSetting,
    IconLock, IconUnlock, IconCalendar, IconGithubLogo,
} from '@douyinfe/semi-icons';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';
import "@douyinfe/semi-ui/dist/css/semi.css";
import {IllustrationSuccess, IllustrationSuccessDark} from "@douyinfe/semi-illustrations";
import Head from "next/head";


const HomeContent = () => {
    const { Header, Footer, Sider, Content } = Layout;
    const {Title,Paragraph,Text} = Typography;

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
                routes={['ChainRaise', 'Home']}
            />
            <div
                style={{
                    borderRadius: '10px',
                    border: '1px solid var(--semi-color-border)',
                    height: '376px',
                    padding: '32px',
                }}
            >

                <div className="container" >
                    <Image
                        className="image"
                        width={360}
                        height={350}
                        src="../static/crowdfunding.png"
                        style={{float:"right"}}
                    />
                   <h1 style={{textAlign:"center",color:"rgba(var(--semi-light-green-2), 1)",fontSize:"28px",backgroundColor:"rgba(var(--semi-orange-1), 1)"}}>Chain Raise</h1>
                    <div  style={{position: 'relative',marginLeft:"60px"}}>
                        <div style={{marginLeft:"0px"}}>
                    <Title heading={2}>自我主权🔐</Title>
                    <Text style={{fontSize:'18px',color:""}}>
                        使用私钥控制您的账户
                        <br></br>
                        所有信息都将记录上链
                    </Text>
                        </div>

                        <div style={{marginLeft:"120px"}}>
                    <Title heading={2}>ChainLink预言机🕵️</Title>
                    <Text style={{fontSize:'18px',color:""}}>
                        使用VRF随机数铸造NFT
                        <br></br>
                        结合Data Feed获取最新价格
                    </Text>
                        </div>

                        <div style={{marginLeft:"300px"}}>
                    <Title heading={2}>代码开源📃</Title>
                    <Text style={{fontSize:'18px',color:""}}>
                        核心众筹业务合约开源
                        <br></br>
                        透明 可信 可查询
                    </Text>

                        </div>
                    </div>
                    <br/>

                    <Text style={{color:"slateblue",textAlign:'center'}} icon={<IconGithubLogo />}>开源地址:<a href="https://github.com/henryhugyq/dapp" style={{textDecoration:"none",color:"rgba(var(--semi-grey-4), 1)"}}>https://github.com/henryhugyq/dapp</a></Text>
                </div>
            </div>
        </Content>

    );
};

export default HomeContent;
