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
                <Project animate header="Welcome To The Nexus Portal">
                    {(anim: { entered: boolean }) => (
                        <AnimatedContent show={anim.entered}>
                            <div className="mb-4 text-sm font-normal content md:text-base">
                                <p>
                                    Create your own markets and trade your favorite assets.
                                </p>
                                <br />
                                <p>
                                    Create ecosystem superfarms or stakes to incetiveze and rewards users for interating with your token or LP.
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
                    <div className='w-full sm:w-auto bg-transparent'>
                        <Frame className='!p-0 !pb-1'>
                            <div className="flex items-center justify-start gap-10 px-10">
                                <div style={{ width: 40, height: 40 }}> {/* Set your desired dimensions */}
                                    <img src={LOGO[ChainId.XDC]} alt="XDC Network" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <Heading className="!m-0">
                                    XDC Network
                                </Heading>
                            </div>
                        </Frame>
                        <div className="bg-transparent py-4 px-4 w-full sm:w-auto">
                            <div className="mb-4 text-sm font-normal content md:text-base">
                                <p>
                                    Explore TradeFi RWAs, and more on XDC Network.
                                </p>
                                {/* <p>Reduction Rate: <span className='font-bold text-green'>datagohere</span></p>
                                <p>Reduction Period: <span className='font-bold text-green'>datagohere</span></p>
                                <p>Current NEXU Per Block: <span className='font-bold text-green'>datagohere</span></p>
                                <p>Next NEXU Reduction Block: <span className='font-bold text-green'>datagohere</span></p> */}
                            </div>
                        </div>
                    </div>
                </Frame>

                <Frame animate={true} corners={3} className="w-full" layer='primary'>
                    <div className='w-full sm:w-auto bg-transparent'>
                        <Frame className='!p-0 !pb-1'>
                            <div className="flex items-center justify-start gap-10 px-10">
                                <div style={{ width: 40, height: 40 }}> {/* Set your desired dimensions */}
                                    <img src={LOGO[ChainId.XRPL]} alt="XDC Network" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <Heading className="!m-0">
                                    XRP EVM Network
                                </Heading>
                            </div>
                        </Frame>
                        <div className="bg-transparent py-4 px-4 w-full sm:w-auto">
                            <div className="mb-4 text-sm font-normal content md:text-base">
                                <p>
                                    COMING SOON! See the beta on the devenet for no.
                                </p>
                            </div>
                        </div>
                    </div>
                </Frame>
            </TridentBody>
        </>
    );
}
