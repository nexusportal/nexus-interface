import { NATIVE, NEXU, ROUTER_ADDRESS, WETH9_ADDRESS } from '@sushiswap/core-sdk';
import Container from 'app/components/Container';
import { NAV_CLASS } from 'app/components/Header/styles';
import useMenu from 'app/components/Header/useMenu';
import LanguageSwitch from 'app/components/LanguageSwitch';
import Web3Network from 'app/components/Web3Network';
import Web3Status from 'app/components/Web3Status';
import { classNames } from 'app/functions';
import useIsCoinbaseWallet from 'app/hooks/useIsCoinbaseWallet';
import { useActiveWeb3React } from 'app/services/web3';
import { useDexWarningOpen, useToggleDexWarning } from 'app/state/application/hooks';
import { useETHBalances } from 'app/state/wallet/hooks';
import Link from 'next/link';
import React, { FC, useState, useEffect } from 'react';
import XRPLogo from '../../../public/XRP.png';
import XDCLogo from '../../../public/XDC.png';
import NEXULogo from '../../../public/NEXUS.png';
import routerABI from 'app/constants/abis/router.json';
import LogoImage from '../../../public/icons/icon-72x72.png';
import ExternalLink from '../ExternalLink';
import { NavigationItem } from './NavigationItem';
import axios from 'axios';
import Web3 from 'web3';
import { ChainId } from '@sushiswap/core-sdk';
import RPC from '../../config/rpc';
import { ThemeProvider, Loading, Project, Words, Heading, Paragraph, Frame, createTheme, SoundsProvider, createSounds, Button, withSounds, Logo } from 'arwes';

const HEADER_HEIGHT = 70;
const XDC_MAINNET_CHAIN_ID = ChainId.XDC;
const XRPL_CHAIN_ID = ChainId.XRPL;
const APOTHEM_CHAIN_ID = ChainId.APOTHEM;

const Desktop: FC = () => {
  const menu = useMenu();
  const { account, chainId, library } = useActiveWeb3React();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];
  const isCoinbaseWallet = useIsCoinbaseWallet();
  const [showAlert, setShowAlert] = useState(true);

  const toggleWarning = useToggleDexWarning();
  const showUseDexWarning = useDexWarningOpen();

  const [nativePrice, setNativePrice] = useState<number | null>(null);
  const [nexuPrice, setNexuPrice] = useState<string>('Loading');

  const effectiveChainId = account ? chainId ?? XDC_MAINNET_CHAIN_ID : XDC_MAINNET_CHAIN_ID;
  const rpcUrl = RPC[effectiveChainId];
  const web3 = new Web3(rpcUrl);
  const nativeTokenId = effectiveChainId === XRPL_CHAIN_ID ? 'ripple' : 'xdce-crowd-sale';

  useEffect(() => {
    const fetchNativePrice = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${nativeTokenId}&vs_currencies=usd`);
        if (!response.data || !response.data[nativeTokenId]) {
          console.warn(`No data for token ID: ${nativeTokenId}`);
          setNativePrice(null);
          return;
        }
        const price = response.data[nativeTokenId].usd;
        setNativePrice(price);
      } catch (error) {
        console.error('Failed to fetch native token price:', error);
        setNativePrice(null);
      }
    };

    fetchNativePrice();
    const interval = setInterval(() => {
      fetchNativePrice();
    }, 10000);
    return () => clearInterval(interval);
  }, [effectiveChainId]);

  useEffect(() => {
    const fetchNexuPrice = async () => {
      try {
        const tokenDecimals = 18;
        const amountIn = web3.utils.toBN('1').mul(web3.utils.toBN(10 ** tokenDecimals));

        const routerAddress = ROUTER_ADDRESS[effectiveChainId];
        if (!routerAddress) {
          console.warn('Router address not found for chain ID:', effectiveChainId);
          setNexuPrice('N/A');
          return;
        }

        const routerContract = new web3.eth.Contract(routerABI as any, routerAddress);

        const nexuAddress = NEXU[effectiveChainId];
        const weth9Address = WETH9_ADDRESS[effectiveChainId];
        if (!nexuAddress || !weth9Address) {
          console.warn('NEXU or WETH9 address not found for chain ID:', effectiveChainId);
          setNexuPrice('N/A');
          return;
        }

        const amounts = await routerContract.methods.getAmountsOut(amountIn, [nexuAddress, weth9Address]).call();
        const outputAmount = amounts[1];
        const nexuPrice = (nativePrice! * parseFloat(outputAmount)) / (10 ** tokenDecimals);

        setNexuPrice(nexuPrice.toString());
      } catch (error) {
        console.error('Failed to fetch NEXU price:', error);
        setNexuPrice('N/A');
      }
    };

    if (nativePrice !== null) {
      fetchNexuPrice();
      const interval = setInterval(() => {
        fetchNexuPrice();
      }, 10000);
      return () => clearInterval(interval);
    } else {
      setNexuPrice('N/A');
    }
  }, [nativePrice, effectiveChainId]);

  return (
    <>
      <header className="fixed z-20 hidden w-full lg:block" style={{ height: HEADER_HEIGHT }}>
        <nav className={classNames("bg-dark-900/20 backdrop-blur-md", NAV_CLASS)}>
          <Container maxWidth="7xl" className="mx-auto">
            {/* {showUseDexWarning && (
              <div className="py-2 px-4 text-[1rem] text-high-emphesis bg-[#eb4326] relative">
                <div className="absolute right-1 top-1">
                  <div
                    className="flex items-center justify-center w-6 h-6 cursor-pointer hover:text-white"
                    onClick={toggleWarning}
                  >
                    <XIcon width={24} height={24} className="text-high-emphesis" />
                  </div>
                </div>
                <Typography variant="xs" weight={700} className="py-0 px-4 text-[1rem] text-high-emphesis bg-[#eb4326]">
                  {`You are using the NEXUS Swap Beta platform on the Songbird Canary Network. NEXUSSwap is
                  a brand new DEX on the Songbird Network. Liquidity is decentralized and added by users. Please be aware of the associated risks with using DeFi
                  platforms.`}
                </Typography>
              </div>
            )} */}

            <div className="flex items-center justify-between gap-4 px-6 py-2">
              <div className="flex gap-4">
                <div className="flex items-center mr-4">
                  <ExternalLink target='_self' href="/">
                    <Logo animate resources={LogoImage.src} size={50} alt="Logo" />
                  </ExternalLink>
                </div>

                {menu.map((node) => {
                  return <NavigationItem node={node} key={node.key} />;
                })}
              </div>

              <div className="flex items-center justify-end gap-2">
                {library && (library.provider.isMetaMask || isCoinbaseWallet) && (
                  <div className="hidden sm:inline-block">
                    <Web3Network />
                  </div>
                )}
                <Frame level={3} corners={3} className="w-100" layer='primary'>
                  <div className="flex items-center w-auto text-sm font-bold rounded shadow cursor-pointer pointer-events-auto select-none whitespace-nowrap hover:bg-blue-100/25" style={{ transition: 'background-color 0.5s ease' }}>
                    {account && chainId && userEthBalance && (
                      <Link href="/portfolio" passHref={true}>
                        <a className="hidden px-3 text-high-emphesis text-bold md:block">
                          {userEthBalance?.toSignificant(6)} {NATIVE[effectiveChainId as keyof typeof NATIVE].symbol}
                        </a>
                      </Link>
                    )}
                    <Web3Status />
                  </div>
                </Frame>
              </div>
            </div>
          </Container>

          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <img src={effectiveChainId === XRPL_CHAIN_ID ? XRPLogo.src : XDCLogo.src} className="rounded-md" width="30px" height="30px" alt="Native Token Logo" />
              <span className="ml-2">
                {nativePrice !== null ? `$${nativePrice.toFixed(4)}` : <Loading animate small />}
              </span>
            </div>
            <div className="flex items-center ml-4">
              <img src={NEXULogo.src} className="rounded-md" width="25px" height="25px" alt="NEXU Logo" />
              <span className="ml-2">
                {nexuPrice !== 'N/A' ? `$${parseFloat(nexuPrice).toFixed(4)}` : <Loading animate small />}
              </span>
            </div>
          </div>
        </nav>
      </header>
      <div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />
    </>
  );
};

export default Desktop;
