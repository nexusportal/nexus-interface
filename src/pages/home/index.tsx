import { ThemeProvider, Loading, Project, Words, Heading, Paragraph, Frame, createTheme, SoundsProvider, createSounds, Link, withSounds } from 'arwes';
import Head from 'next/head';
import { TridentBody } from 'app/layouts/Trident';
import { LOGO } from 'app/components/CurrencyLogo/CurrencyLogo';
import { ChainId } from '@sushiswap/core-sdk';

const AnimatedContent = ({ show, children }: { show: boolean; children: React.ReactNode }) => {
    return show ? <>{children}</> : null;
};

export default function Farm(): JSX.Element {
    return (
        <>
            <Head>
                <title>NEXUS | Home</title>
                <meta key="description" name="description" content="NEXUS AMM" />
                <meta key="twitter:description" name="twitter:description" content="NEXUS AMM" />
                <meta key="og:description" property="og:description" content="NEXUS AMM" />
            </Head>

            <TridentBody>
                <Project animate header="✨ Welcome To The Nexus Portal">
                    {(anim: { entered: boolean }) => (
                        <AnimatedContent show={anim.entered}>
                            <div className="mb-4 text-sm font-normal content md:text-base">
                                <p>
                                    Create your own markets and trade your favorite assets.
                                    Stake LPs or single sided tokens and earn multi-rewards.
                                    Stake NEXU in multi-staking and earn LPs, NEXU and more.
                                </p>
                                <br />
                                <p>
                                    Create ecosystem superfarms or stakes to incetivize and reward users for interacting with your token or LP.
                                </p>
                                <Link href="https://docs.thenexusportal.io/guide/nexus-generator/superfarm-request" target="_blank" rel="noreferrer">
                                    <span className="text-lg font-bold md:text-xl text-green">
                                        Apply Now
                                    </span>
                                </Link>
                            </div>
                        </AnimatedContent>
                    )}
                </Project>

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
                                {/* <iframe
                                    style={{
                                        width: '100%',
                                        height: '500px', // Adjust height as needed
                                        border: 'none'
                                    }}
                                    src="https://www.geckoterminal.com/xdc/pools/0xfcabba53dac7b6b19714c7d741a46f6dad260107?embed=1&info=1&swaps=1"
                                    frameBorder="0"
                                    allow="clipboard-write"
                                    allowFullScreen
                                    title="GeckoTerminal Embed"
                                /> */}
                            </div>
                        </div>
                    </div>
                </Frame>


                <Frame animate={true} corners={3} className="w-full" layer='primary'>
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
                                    COMING SOON! See the beta on the devnet now by using the network switch toggle.
                                </p>
                            </div>
                        </div>
                    </div>
                </Frame>


            </TridentBody>
        </>
    );
}
