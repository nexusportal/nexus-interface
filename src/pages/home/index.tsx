import React from 'react';
import {
    ThemeProvider, Loading, Project, Words, Header, Heading, Paragraph, Frame, Button,
    createTheme, SoundsProvider, createSounds, Link, withSounds, Logo
} from 'arwes';
import Head from 'next/head';
import { TridentBody } from 'app/layouts/Trident';
import { LOGO } from 'app/components/CurrencyLogo/CurrencyLogo';
import { ChainId } from '@sushiswap/core-sdk';
import NFTLogo from '../../../public/profile.png';
import NEXULogo from '../../../public/NEXUS.png';

const icons = [
    { src: '/svg-loaders/audio.svg', label: '' },
    { src: '/svg-loaders/ball-triangle.svg', label: '' },
    { src: '/svg-loaders/circles.svg', label: '' },
    { src: '/svg-loaders/grid.svg', label: '' },
    { src: '/svg-loaders/oval.svg', label: '' },
    { src: '/svg-loaders/rings.svg', label: '' },
    { src: '/svg-loaders/puff.svg', label: '' },
    { src: '/svg-loaders/three-dots.svg', label: '' },
    { src: '/svg-loaders/tail-spin.svg', label: '' },
    { src: '/svg-loaders/spinning-circles.svg', label: '' },
    { src: '/svg-loaders/bars.svg', label: '' },
];

const IconsGrid = () => (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        {icons.map((icon, index) => (
            <div key={index} style={{ marginRight: '40px', padding: '15px', width: '70px' }}>
                <img
                    src={icon.src}
                    alt={icon.label}
                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                />
                <p>{icon.label}</p>
            </div>
        ))}
    </div>
);

interface AnimatedContentProps {
    show: boolean;
    children: React.ReactNode;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({ show, children }) => (show ? <>{children}</> : null);

interface AnimProps {
    entered: boolean;
}

export default function Farm() {
    return (
        <>
            <Head>
                <title>NEXUS | Home</title>
                <meta key="description" name="description" content="NEXUS AMM" />
                <meta key="twitter:description" name="twitter:description" content="NEXUS AMM" />
                <meta key="og:description" property="og:description" content="NEXUS AMM" />
            </Head>

            <TridentBody>

                <Frame animate={true} corners={3} className="w-full" layer='primary'>
                    <span className="text-lg font-bold md:text-xl text-green" style={{ display: 'inline-block', marginRight: '40px', padding: '15px' }}>
                        NEXUS CORES ARE ACTIVE
                    </span>
                    <div className="">
                        <IconsGrid />
                    </div>
                </Frame>

                <Project animate header="✨ Welcome To The Nexus Portal">
                    {(anim: AnimProps) => (
                        <AnimatedContent show={anim.entered}>
                            <div className="mb-4 text-sm font-normal content md:text-base">
                                <p>
                                    The Nexus is a multi-dimensional DeFi protocol that is ushering in the next generation of galactic financial infrastructure.
                                </p>
                                <br />
                                <p>
                                    Create your own markets and trade your favorite assets on multiple networks.
                                    Stake LPs or single sided tokens and earn multi-rewards through the Nexus Generator superfarm.
                                    Stake NEXU in multi-staking and earn multiple rewads in LPs, NEXU and more.
                                </p>
                            </div>
                        </AnimatedContent>
                    )}
                </Project>

                <Frame animate={true} corners={3} className="w-full" layer='primary'>
                    <div className='w-full bg-transparent'>
                        <Frame className='!p-0 !pb-1'>
                            <div className="flex items-center justify-start" style={{ alignItems: 'center' }}>
                                <div style={{ width: 40, height: 40, margin: '10px 20px' }}>
                                    <img src={NEXULogo.src} alt="Nexus Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <Heading className="!m-0">
                                    Nexus Token
                                </Heading>
                            </div>
                        </Frame>
                        <div className="bg-transparent py-4 px-4 w-full">
                            <div className="mb-4 text-sm font-normal content md:text-base">
                                <p>
                                    Nexus Token is coming to XDC Network soon!
                                </p>
                                <p>
                                    Mass airdrop to 60K addresses!
                                </p>
                                <p>
                                    The Nexus Rewards will be turned on soon! Earn NEXU, XINU and more through the superfarm!
                                </p>

                            </div>
                        </div>
                    </div>
                </Frame>

                <Frame animate={true} corners={3} className="w-full" layer='primary'>
                    <div className='w-full bg-transparent'>
                        <Frame className='!p-0 !pb-1'>
                            <div className="flex items-center justify-start" style={{ alignItems: 'center' }}>
                                <div style={{ width: 40, height: 40, margin: '10px 20px' }}>
                                    <img src={NFTLogo.src} alt="alien Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <Heading className="!m-0">
                                    Nexus Celestials NFTs
                                </Heading>
                            </div>
                        </Frame>
                        <div className="bg-transparent py-4 px-4 w-full">
                            <div className="mb-4 text-sm font-normal content md:text-base">
                                <p>
                                    The Nexus Celestial are the gaurdians of the Nexus Core.
                                </p>
                                <p>
                                    Each Nexus Celestial has a unique powerlevel.
                                </p>
                                <p>
                                    Some NFTS can multiply the power of your NEXU if time-locked in Multistaking.
                                </p>

                            </div>
                            <Button
                                animate
                                layer='success'
                                onClick={() => window.location.href = 'https://minter.thenexusportal.io/'}
                                style={{
                                    maxWidth: '175px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 0.3s ease',
                                    padding: '0'
                                }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                <span className="relative z-10">Mint Celestial</span>
                            </Button>
                        </div>

                    </div>
                </Frame>

                <Project animate header="🌟 Nexus Generator Ecosystem Superfarms">
                    {(anim: AnimProps) => (
                        <AnimatedContent show={anim.entered}>
                            <div className="mb-4 text-sm font-normal content md:text-base">
                                <p>
                                    Create ecosystem superfarms or stakes to incentivize and reward users for interacting with your token or LP.
                                </p>
                                <br />
                                <Button
                                    animate
                                    layer='success'
                                    onClick={() => window.location.href = 'https://docs.thenexusportal.io/guide/nexus-generator/superfarm-request'}
                                    style={{
                                        maxWidth: '175px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background-color 0.3s ease',
                                        padding: '0'
                                    }}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                    <span className="relative z-10">Request Superfarm</span>
                                </Button>

                                {/* <Link href="https://docs.thenexusportal.io/guide/nexus-generator/superfarm-request" target="_blank" rel="noreferrer">
                                    <span className="text-lg font-bold md:text-xl text-green">
                                        Request Superfarm
                                    </span>
                                </Link> */}
                            </div>
                        </AnimatedContent>
                    )}
                </Project>


                <Header animate>
                    <span className="text-lg font-bold md:text-xl text-green" style={{ display: 'inline-block', marginRight: '40px', padding: '15px' }}>
                        NETWORKS
                    </span>
                </Header>


                <Frame animate={true} corners={3} className="w-full" layer='primary'>
                    <div className='w-full bg-transparent'>
                        <Frame className='!p-0 !pb-1'>
                            <div className="flex items-center justify-start" style={{ alignItems: 'center' }}>
                                <div style={{ width: 40, height: 40, margin: '10px 20px' }}>
                                    <img src={LOGO[ChainId.XDC]} alt="XDC Network" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <Heading className="!m-0">
                                    XDC Network
                                </Heading>
                            </div>
                        </Frame>
                        <div className="bg-transparent py-4 px-4 w-full">
                            <div className="mb-4 text-sm font-normal content md:text-base">
                                <p>
                                    Explore TradeFi, RWAs, Memes, and more on XDC Network.
                                </p>
                                <div>
                                    <p>Website: <Link href="https://xdc.org/" target="_blank" rel="noreferrer"><span className="text-lg font-bold md:text-xl text-gray">xdc.org</span></Link></p>
                                    <p>Network name: <span className="text-lg font-bold md:text-xl text-gray">XinFin XDC Network</span></p>
                                    <p>RPC URL: <Link href="https://rpc.xdc.org/" target="_blank" rel="noreferrer"><span className="text-lg font-bold md:text-xl text-gray">https://rpc.xdc.org/</span></Link></p>
                                    <p>RPC URL: <Link href="https://erpc.xinfin.network/" target="_blank" rel="noreferrer"><span className="text-lg font-bold md:text-xl text-gray">https://erpc.xinfin.network/</span></Link></p>
                                    <p>RPC URL: <Link href="https://erpc.xdcrpc.com/" target="_blank" rel="noreferrer"><span className="text-lg font-bold md:text-xl text-gray">https://erpc.xdcrpc.com/</span></Link></p>
                                    <p>Chain ID: <span className="text-lg font-bold md:text-xl text-gray">50</span></p>
                                    <p>Currency symbol: <span className="text-lg font-bold md:text-xl text-gray">XDC</span></p>
                                    <p>Block explorer URL: <Link href="https://xdc.blocksscan.io/" target="_blank" rel="noreferrer"><span className="text-lg font-bold md:text-xl text-gray">https://xdc.blocksscan.io/</span></Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Frame>


                <Frame animate corners={3} className="w-full" layer='primary'>
                    <div className='w-full bg-transparent'>
                        <Frame className='!p-0 !pb-1'>
                            <div className="flex items-center justify-start" style={{ alignItems: 'center' }}>
                                <div style={{ width: 40, height: 40, margin: '10px 20px' }}>
                                    <img src={LOGO[ChainId.XRPL]} alt="XRP Network" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <Heading className="!m-0">
                                    XRP EVM Network
                                </Heading>
                            </div>
                        </Frame>
                        <div className="bg-transparent py-4 px-4 w-full">
                            <div className="mb-4 text-sm font-normal content md:text-base">
                                <p>
                                    COMING SOON TO MAINNET! See the beta on the devnet now by using the network switch toggle. Check out the Nexus Validator on the devnet!
                                </p>
                                <div>
                                    <p>Website: <Link href="https://xrpl.org/" target="_blank" rel="noreferrer"><span className="text-lg font-bold md:text-xl text-gray">xrpl.org</span></Link></p>
                                    <p>Network name: <span className="text-lg font-bold md:text-xl text-gray">eXRP</span></p>
                                    <p>RPC URL: <Link href="https://rpc-evm-sidechain.xrpl.org" target="_blank" rel="noreferrer"><span className="text-lg font-bold md:text-xl text-gray">https://rpc-evm-sidechain.xrpl.org</span></Link></p>
                                    <p>Chain ID: <span className="text-lg font-bold md:text-xl text-gray">1440002</span></p>
                                    <p>Currency symbol: <span className="text-lg font-bold md:text-xl text-gray">eXRP</span></p>
                                    <p>Block explorer URL: <Link href="https://evm-sidechain.xrpl.org" target="_blank" rel="noreferrer"><span className="text-lg font-bold md:text-xl text-gray">https://evm-sidechain.xrpl.org/</span></Link></p>
                                </div>
                            </div>

                            <Button
                                animate
                                layer='success'
                                onClick={() => window.location.href = 'https://validators.evm-sidechain.xrpl.org/xrp/validators/ethmvaloper1djhpzrgnrn7x8vhyeaqfpaeg47tqu75y5nyqec'}
                                style={{
                                    maxWidth: '175px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 0.3s ease',
                                    padding: '0'
                                }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                <span className="relative z-10">Nexus Validator</span>
                            </Button>
                        </div>
                    </div>
                </Frame>
            </TridentBody>
        </>
    );
}
