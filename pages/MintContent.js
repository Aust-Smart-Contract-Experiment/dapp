import React, {useEffect, useState} from 'react';
import {
    Layout,
    Breadcrumb,
    Typography,
    Toast,
    Tooltip,
    Image, Space,
    Carousel, Spin,
    Divider
} from '@douyinfe/semi-ui';

import "@douyinfe/semi-ui/dist/css/semi.css";
import {IllustrationSuccess, IllustrationSuccessDark} from "@douyinfe/semi-illustrations";
import Head from "next/head";
import {useRouter} from "next/router";
import {ethers} from "ethers";



const MintContent = ({contractAddress2}) => {
    const { Header, Footer, Sider, Content } = Layout;
    const {Title,Paragraph,Text} = Typography;
    const router = useRouter();
    const [owner,setOwner] =useState();
    const [provider,setProvider] = useState();
    const [contract,setContract] = useState();
    const [account,setAccount] = useState();
    const [tokenId,setTokenId] = useState();
    const [nftlink,setNftLink] =useState();
    const [loading, setLoading] = useState(false);

    const MINT_CONTRACT_ADDRESS = "0x3e3cc53e0ef27c631134fc6879fa72c69dca6907"
    const MINT_ABI = [
        "function safeMint() public",
        "event TokenMinted(address indexed owner, uint256 tokenId)",
    ];
    const style = {
        width: '32%',
        height: '350px',
    };

    const titleStyle = {
        position: 'absolute',
        top: '250px',
        left: '5px',
        color: '#1C1F23',
        fontSize:"30px"
    };

    const colorStyle = {
        color: '#3b82e1'
    };
    const imgList = [
        '../static/img_2.png',
        '../static/img_1.png',
        '../static/img.png',
    ];
    const textList = [
        ['NFT 1', 'QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/11'],
        ['NFT 2', 'QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/22'],
        ['NFT 3', 'QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/33'],
    ];

    const newContract = async () => {
        const providerWeb3 = await new ethers.BrowserProvider(window.ethereum);
        setProvider(providerWeb3);
        const currenAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(currenAccounts[0])
        window.ethereum.on("accountsChanged",function(accountsChange) {
            setAccount(accountsChange[0]);
        })
        const signer = await providerWeb3.getSigner(currenAccounts[0]);
        const contract = await new ethers.Contract(contractAddress2, MINT_ABI, signer);
        setContract(contract);
    }
    useEffect(() => {
        newContract();
    }, []);
    const safeMint = async ()=>{
        try {


            setLoading(true)

            await newContract()

            const tx = await contract.safeMint();


            await tx.wait()

            contract.on("TokenMinted", (owner, tokenId) => {
                console.log(`Token minted with tokenId: ${tokenId}`);
                setTokenId(tokenId)
                event.removeListener();
            });

            console.log("id++" + tokenId)
            let opts = {
                content: 'Mint VRF NFT Success! The tx hash is:' + tx.hash,
                duration: 5,
                theme: 'light',
            };
            Toast.success(opts)
            let multiLineOpts = {
                content: (
                    <>
                        <div>暂未监听到ID</div>
                        <div style={{marginTop: 8}}>
                            <Text
                                link={{href: 'https://testnets.opensea.io/assets/sepolia/'}}>前往opensea</Text>
                            <Text
                                link={{href: 'https://vrf.chain.link/sepolia/38682364881791566444629463752903983233442276211092913406418450536704825806346'}}
                                style={{marginLeft: 20}}>
                                前往VRF控制台
                            </Text>
                        </div>
                    </>
                ),
                duration: 8,
            };

            setLoading(false)

            if (!tokenId) {
                Toast.warning(multiLineOpts)
            }
        }catch (error){
            Toast.error(error.message)
        }

    }

    useEffect(() =>{
        const getLink = async () => {
            if(!tokenId){
                return ;
            }
            const openseaLink = `https://testnets.opensea.io/assets/sepolia/${contractAddress2}/${tokenId}`;
            setNftLink(openseaLink)
        }
        getLink()
    },tokenId)
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
                routes={['ChainRaise',  'Mint']}
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
                    <div  style={{ position: 'relative' }}>
                    <Carousel style={style} theme='primary' speed={600} animation='fade'>
                        {
                            imgList.map((src, index) => {
                                return (
                                    <div key={index} style={{ backgroundSize: 'cover', backgroundImage: `url(${src})` }}>
                                        <Space vertical align='start' spacing='medium' style={titleStyle}>

                                            <Title heading={2} style={colorStyle}>{textList[index][0]}</Title>
                                            <Space vertical align='start'>
                                                <Paragraph style={colorStyle}>{textList[index][1]}</Paragraph>
                                                <Paragraph style={colorStyle}>{textList[index][2]}</Paragraph>
                                            </Space>
                                        </Space>
                                    </div>
                                );
                            })
                        }
                    </Carousel>
                    <Image
                        width={700}
                        height={400}
                        style={{
                            marginLeft:"400px",
                            marginTop:"-400px"
                        }}
                        src="../static/chainlink.png"
                    />
                        <div
                        className="mintTitle">
                            随机铸造凭证
                        </div>
                    </div>
                    <Tooltip
                        position='top'
                        content='基于VRF随机匹配metadata'>
                <button onClick={safeMint}>铸造您的NFT</button>
                    </Tooltip>
                    <div className="link">
                        <a style={{color:"#A2A46D"}}>
                            查看您的NFT:
                        <a href={nftlink} target="_blank" rel="noopener noreferrer" style={{color:"chocolate"}}>
                            {nftlink}
                            {loading && <Spin tip="请签名交易并等待监听id">
                                <div

                                >
                                </div>
                            </Spin>}
                        </a>
                        </a>
                    </div>
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

                 .mintTitle {
                   position: absolute;
                   top: 50%;
                   left: 50%;
                   transform: translate(-50%, -50%);
                   writing-mode: vertical-rl;
                   text-align: center;
                   white-space: nowrap;
                   width: auto;
                   height: 100px;
                   line-height: 100px;
                   color: #4cb1f8;
                   font-size: 35px;
                   font-weight: bold;
                   margin-left: 550px;
                   padding: 0 10px;
                 }

                 .link {
                   border: 2px solid #9bdff8; 
                   border-radius: 10px; 
                   padding: 5px; 
                   margin-top: -37px;
                   margin-left: 230px;
                   width: 900px; 
                 }
               `}
           </style>
        </Content>
    );
};

export default MintContent;
