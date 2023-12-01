import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DiscordIcon, GithubIcon, TwitterIcon } from 'app/components/Icon'
import useIsCoinbaseWallet from 'app/hooks/useIsCoinbaseWallet'
// import Typography from 'app/components/Typography'
// import { Feature } from 'app/enums'
// import { featureEnabled } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useNetworkModalToggle } from 'app/state/application/hooks'
// import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Arwes, ThemeProvider, Button, Heading, Paragraph, Frame, createTheme, SoundsProvider, createSounds, withSounds } from 'arwes';

import LogoImage from '../../../public/XRP.png'
import XDCLOGO from '../../../public/xdcpay.png'
import Container from '../Container'
import { XDC } from '@sushiswap/core-sdk'
// import Image from 'next/image'
// import { ChainId } from '@sushiswap/core-sdk'
// import { NETWORK_ICON } from 'app/config/networks'

const docUrls = {
  1440002: "https://docs.thenexusportal.io/",
  50: "https://docs.thenexusportal.io/",
  51: "https://docs.thenexusportal.io/"
}
const Footer = () => {
  const { i18n } = useLingui()
  const { library, chainId } = useActiveWeb3React()
  const isCoinbaseWallet = useIsCoinbaseWallet()

  const toggleNetworkModal = useNetworkModalToggle()

  return (
    <div className="z-10 w-full  mt-10">
      <Frame animation={true}>
        <Container maxWidth="7xl" className="px-6 mx-auto">
          <div className="gap-3 py-2 xs:px-6 sm:gap-4 flex justify-between">
            <div className="flex col-span-2 gap-3 sm:col-span-1">
              {/* <div className="flex items-center justify-start gap-2">
              <div className="">
                <Image src="https://app.sushi.com/images/logo.svg" alt="Nexus logo" width="28px" height="28px" />
              </div>
              <Typography variant="h2" weight={700} className="tracking-[0.02em] scale-y-90 hover:text-high-emphesis">
                Nexus
              </Typography>
            </div> */}
              {/* <Typography variant="xs" className="text-low-emphesis">
              {i18n._(t`Our community is building a comprehensive decentralized trading platform for the future of finance. Join
              us!`)}
            </Typography> */}
              <div className="flex flex-wrap justify-between items-center align-middle gap-4">
                <a href="https://twitter.com/PoweredByNEXUS" className='' target="_blank" rel="noreferrer">
                  <TwitterIcon width={24} className="text-low-emphesis max-w-none" />
                </a>

                {/* <a href="https://t.me/NexusOffical" target="_blank" rel="noreferrer">
                <TelegramIcon width={16} className="text-low-emphesis" />
              </a>
              <a href="https://www.youtube.com/channel/" target="_blank" rel="noreferrer">
                <YoutubeIcon width={16} className="text-low-emphesis" />
              </a> */}

                <a href="https://discord.com/invite/nexusportal" target="_blank" rel="noreferrer">
                  <DiscordIcon width={24} className="text-low-emphesis" />
                </a>

                <a href="https://github.com/nexusportal" target="_blank" rel="noreferrer">
                  <GithubIcon width={24} className="text-low-emphesis" />
                </a>

                <a href={(chainId == 50 || chainId == 1440002) ? docUrls[chainId] : docUrls[51]} target="_blank" rel="noreferrer">
                  <span className="text-low-emphesis">{i18n._(t`Docs`)}</span>
                </a>

                <a href={(chainId == 50 || chainId == 1440002) ? docUrls[chainId] : docUrls[51] + "/about-nexus/privacy"} target="_blank" rel="noreferrer">
                  <span className="text-low-emphesis">{i18n._(t`Privacy`)}</span>
                </a>
              </div>
            </div>
            {/* <div className="flex flex-col gap-1 text-right">
            <Typography variant="xs" weight={700} className="mt-2.5 hover:text-high-emphesis">
              {i18n._(t`Products`)}
            </Typography>
            <Link
              href={featureEnabled(Feature.TRIDENT, chainId || 1) ? '/trident/pools' : '/legacy/pools'}
              passHref={true}
            >
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Liquidity Pools`)}
              </Typography>
            </Link>
            <Link href="/lend" passHref={true}>
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Lending`)}
              </Typography>
            </Link>
            <Link href="/miso" passHref={true}>
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Launchpad`)}
              </Typography>
            </Link>
            <a href="https://shoyunft.com" target="_blank" rel="noreferrer">
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Shoyu NFT`)}
              </Typography>
            </a>
            <Link href="/tools" passHref={true}>
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Tools`)}
              </Typography>
            </Link>
          </div> */}
            {/* <div className="flex flex-col gap-1 md:text-right lg:text-right"> */}
            {/* <Typography variant="xs" weight={700} className="mt-2.5 hover:text-high-emphesis">
              <a href="https://help.thenexusportal.io" target="_blank" rel="noreferrer">
                {i18n._(t`Help`)}
              </a>
            </Typography> */}
            {/* <a href="https://docs.sushi.com" target="_blank" rel="noreferrer">
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`What is Nexus?`)}
              </Typography>
            </a>
            <a href="https://discord.gg/NVPXN4e" target="_blank" rel="noreferrer">
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Ask on Discord`)}
              </Typography>
            </a>
            <a href="https://twitter.com/sushiswap" target="_blank" rel="noreferrer">
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Ask on Twitter`)}
              </Typography>
            </a>
            <a href="https://forum.sushi.com" target="_blank" rel="noreferrer">
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Ask on Forum`)}
              </Typography>
            </a> */}
            {/* </div> */}
            {/* <div className="flex flex-col gap-1 text-right xs:text-right md:text-left lg:text-right">
            <Typography variant="xs" weight={700} className="mt-2.5 hover:text-high-emphesis">
              {i18n._(t`Developers`)}
            </Typography>
            <a href="https://docs.sushi.com" target="_blank" rel="noreferrer">
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`GitBook`)}
              </Typography>
            </a>
            <a href="https://github.com/sushiswap" target="_blank" rel="noreferrer">
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`GitHub`)}
              </Typography>
            </a>
            <a href="https://dev.sushi.com" target="_blank" rel="noreferrer">
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Development`)}
              </Typography>
            </a>
            <a href="https://docs.openmev.org" target="_blank" rel="noreferrer">
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Nexus Relay`)}
              </Typography>
            </a>
          </div> */}
            {/* <div className="flex flex-col gap-1 md:text-right lg:text-right">
            <Typography variant="xs" weight={700} className="mt-2.5 hover:text-high-emphesis">
              {i18n._(t`Governance`)}
            </Typography>
            <a href="https://forum.sushi.com" target="_blank" rel="noreferrer">
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Forum & Proposals`)}
              </Typography>
            </a>
            <a href="https://snapshot.org/#/sushigov.eth" target="_blank" rel="noreferrer">
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Vote`)}
              </Typography>
            </a>
          </div> */}

            <div className="flex flex-row justify-center gap-1 text-right sm:justify-end">
              <div className="flex items-center ">
                <a href={chainId == 1440002 ? "https://xrpl.org/" : ""} target="_blank" rel="noreferrer">
                  <img src={chainId == 1440002 ? LogoImage.src : XDCLOGO.src} className={'h-[50px] max-w-none'} alt="Logo" />
                </a>
              </div>
              {/* <Typography variant="xs" weight={700} className="mt-2.5 hover:text-high-emphesis">
              {i18n._(t`Protocol`)}
            </Typography>
            <a
              href="https://docs.google.com/document/d/19bL55ZTjKtxlom2CpVo6K8jL1e-OZ13y6y9AQgw_qT4"
              target="_blank"
              rel="noreferrer"
            >
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Apply for Onsen`)}
              </Typography>
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSecahmrXOJytn-wOUB8tEfONzOTP4zjKqz3sIzNzDDs9J8zcA/viewform"
              target="_blank"
              rel="noreferrer"
            >
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Apply for Miso`)}
              </Typography>
            </a> */}

              {/* <Link href="/vesting" passHref={true}>
              <Typography variant="xs" className="text-low-emphesis hover:text-high-emphesis">
                {i18n._(t`Vesting`)}
              </Typography>
            </Link> */}
            </div>
          </div>
        </Container>
      </Frame>
    </div>
  )
}

export default Footer
