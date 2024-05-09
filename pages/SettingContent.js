import React, {useEffect, useState} from 'react';
import {
    Layout,
    Nav,
    Button,
    Breadcrumb,
    Avatar,
    Dropdown,
    Toast,
    Popover,
    Empty,
    Image,
} from '@douyinfe/semi-ui';
import {
    IconHelpCircle,
    IconBytedanceLogo,
    IconHome,
    IconHistogram,
    IconLive,
    IconSetting,
    IconLock, IconUnlock, IconCalendar,
} from '@douyinfe/semi-icons';
import { ethers } from 'ethers';

import "@douyinfe/semi-ui/dist/css/semi.css";
import {IllustrationSuccess, IllustrationSuccessDark} from "@douyinfe/semi-illustrations";
import Head from "next/head";

const SettingContent = () => {
    const { Header, Footer, Sider, Content } = Layout;
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
                routes={['ChainRaise','Setting']}
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
                    <Image
                        className="image"
                        width={360}
                        height={200}
                        src=""
                    />
                    <p></p>
                    <b className="text"> This is Setting Pages</b>
                    <p></p>

                </div>
            </div>
        </Content>
    );
};

export default SettingContent;
