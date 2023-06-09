import { NATIVE } from '@sushiswap/core-sdk'
import Container from 'app/components/Container'
import { NAV_CLASS } from 'app/components/Header/styles'
import useMenu from 'app/components/Header/useMenu'
import LanguageSwitch from 'app/components/LanguageSwitch'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import { classNames } from 'app/functions'
import useIsCoinbaseWallet from 'app/hooks/useIsCoinbaseWallet'
import { useActiveWeb3React } from 'app/services/web3'
import { useDexWarningOpen, useToggleDexWarning } from 'app/state/application/hooks'
import { useETHBalances } from 'app/state/wallet/hooks'
import Link from 'next/link'
import React, { FC, useState, useEffect } from 'react';
import XRPLogo from '../../../public/XRP.png'
import NEXULogo from '../../../public/NEXUS.png'
import routerABI from 'app/constants/abis/router.json';
import LogoImage from '../../../public/icons/icon-72x72.png'
import ExternalLink from '../ExternalLink'
import { NavigationItem } from './NavigationItem'
// @ts-ignore: Unreachable code error
// eslint-disable-next-line simple-import-sort/imports
import { Arwes, Logo, ThemeProvider, Button, Heading, Paragraph, Frame, createTheme, SoundsProvider, createSounds, withSounds } from 'arwes';
import axios from 'axios';
import Web3 from 'web3';
import { ChainId } from '@sushiswap/core-sdk';
import RPC from '../../config/rpc';

const rpcUrl = RPC[ChainId.XRPL]; // Change the ChainId value according to your requirement
const web3 = new Web3(rpcUrl);

// Contracts for calculating NEXU ERC-20 token price
const nexuTokenAddress = '0x3965c4716091A1008db59D85a684DbA075950145';
const wXRPAddress = '0xe4f5C213dD18F732547bb16bB1A3e8BB0bc01dD4';
const routerAddress = '0x7AdE46144F5B14f72BF6918e8434356112a07C39';

const HEADER_HEIGHT = 70

const Desktop: FC = () => {
  const menu = useMenu()
  const { account, chainId, library } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const isCoinbaseWallet = useIsCoinbaseWallet()
  const [showAlert, setShowAlert] = useState(true)

  const toggleWarning = useToggleDexWarning()
  const showUseDexWarning = useDexWarningOpen()

  const [xrpPrice, setXrpPrice] = useState('');
  const [nexuPrice, setNexuPrice] = useState('');


  useEffect(() => {
    const fetchXrpPrice = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd');
        const price = response.data.ripple.usd; // Access the price using response.data.ripple.usd
        setXrpPrice(price);
      } catch (error) {
        console.error('Failed to fetch XRP price:', error);
      }
    };

    fetchXrpPrice();
    const interval = setInterval(() => {
      fetchXrpPrice();
    }, 10000); // 10000 milliseconds = 10 seconds
    return () => clearInterval(interval);

  }, []);

  useEffect(() => {
    const fetchNexuPrice = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd');
        const xrpPrice = response.data.ripple.usd;

        const tokenDecimals = 18; // Assuming the token has 18 decimal places
        const amountIn = web3.utils.toBN('1').mul(web3.utils.toBN(10 ** tokenDecimals));

        // Create the contract instance for the router
        const routerContract = new web3.eth.Contract(routerABI as any, routerAddress);


        // Get the output amounts
        const amounts = await routerContract.methods.getAmountsOut(amountIn, [nexuTokenAddress, wXRPAddress]).call();

        // Get the output amount for the token
        const outputAmount = amounts[1];

        // Calculate the NEXU token price based on the XRP price and output amount
        const nexuPrice = (xrpPrice * outputAmount / 2) / (10 ** tokenDecimals);

        setNexuPrice(nexuPrice.toString());
      } catch (error) {
        console.error('Failed to fetch NEXU price:', error);
      }
    };

    fetchNexuPrice();

    const interval = setInterval(() => {
      fetchNexuPrice();
    }, 10000); // 10000 milliseconds = 10 seconds
    return () => clearInterval(interval);

  }, []);




  return (
    <>
      <header className="fixed z-20 hidden w-full lg:block" style={{ height: HEADER_HEIGHT }}>
        <nav className={classNames(showUseDexWarning && 'before:backdrop-blur-[20px]')}>
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
                  <ExternalLink href="https://www.thenexusportal.io">
                    <Logo animate resources={LogoImage.src} size={50} alt="Logo" />
                    {/* <Image src="/logo.png" alt="NEXUSSwap logo" width="24px" height="24px" /> */}
                  </ExternalLink>
                </div>

                {menu.map((node) => {
                  return <NavigationItem node={node} key={node.key} />
                })}
              </div>


              <div className="flex items-center justify-end gap-2">
                {library && (library.provider.isMetaMask || isCoinbaseWallet) && (
                  <div className="hidden sm:inline-block">
                    <Web3Network />

                  </div>

                )}
                <Frame animate={true}
                  level={3}
                  corners={3}
                  className="w-100"
                  layer='primary'>
                  <div className="flex items-center w-auto text-sm font-bold rounded shadow cursor-pointer pointer-events-auto select-none whitespace-nowrap">
                    {account && chainId && userEthBalance && (
                      <Link href="/portfolio" passHref={true}>
                        <a className="hidden px-3 text-high-emphesis text-bold md:block">
                          {/*@ts-ignore*/}
                          {userEthBalance?.toSignificant(6)} {NATIVE[chainId || 1].symbol}
                        </a>
                      </Link>
                    )}
                    <Web3Status />
                  </div>
                </Frame>
                <div className="hidden lg:flex">
                  <LanguageSwitch />
                </div>
              </div>
            </div>
          </Container>

          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <img src={XRPLogo.src} className="rounded-md" width="30px" height="30px" alt="XRP Logo" />
              <span className="ml-2">${parseFloat(xrpPrice).toFixed(4)}</span>
            </div>
            <div className="flex items-center ml-4">
              <img src={NEXULogo.src} className="rounded-md" width="25px" height="25px" alt="NEXU Logo" />
              <span className="ml-2">${parseFloat(nexuPrice).toFixed(4)}</span>
            </div>
          </div>


        </nav>
      </header>
      <div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />
    </>
  )
}

export default Desktop
