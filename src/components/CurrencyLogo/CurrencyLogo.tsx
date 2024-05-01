/* eslint-disable @next/next/no-img-element */
import { ChainId, Currency, Token, WNATIVE } from '@sushiswap/core-sdk'
import useHttpLocations from 'app/hooks/useHttpLocations'
import { WrappedTokenInfo } from 'app/state/lists/wrappedTokenInfo'
import React, { FunctionComponent, useMemo } from 'react'
import NEXUS from '../../../public/NEXUS.png'
import WXRP from '../../../public/WXRP.png'
import XVM from '../../../public/XVM.png'
import BTC from '../../../public/BTC.png'
import ETH from '../../../public/ETH.png'
import WAN from '../../../public/WAN.png'
import FXD from '../../../public/FXD.png'
import USDT from '../../../public/USDT.png'
import USDC from '../../../public/USDC.png'
import ONE from '../../../public/ONE.png'
import TWO from '../../../public/TWO.png'
import THREE from '../../../public/THREE.png'
import AIR from '../../../public/images/token/apothem/AIR.png'
import FIRE from '../../../public/images/token/apothem/FIRE.png'
import EARTH from '../../../public/images/token/apothem/EARTH.png'
import SPACE from '../../../public/images/token/apothem/SPACE.png'
import WATER from '../../../public/images/token/apothem/WATER.png'

import XRP from '../../../public/XRP.png'
import XDC from '../../../public/XDC.png'
import WXDC from '../../../public/WXDC.png'

// import Image from '../../components/Image'
import Logo, { UNKNOWN_ICON } from '../Logo'
import { isSupportedChainId } from 'app/config/wallets'




// import PRO_Logo3Gold from '../../../public/PRO_Logo3Gold.png'

const BLOCKCHAIN = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.BSC]: 'binance',
  [ChainId.CELO]: 'celo',
  [ChainId.FANTOM]: 'fantom',
  [ChainId.AVALANCHE_TESTNET]: 'fuji',
  [ChainId.FUSE]: 'fuse',
  [ChainId.HARMONY]: 'harmony',
  [ChainId.HECO]: 'heco',
  [ChainId.MATIC]: 'matic',
  [ChainId.MOONRIVER]: 'moonriver',
  [ChainId.OKEX]: 'okex',
  [ChainId.PALM]: 'palm',
  [ChainId.TELOS]: 'telos',
  [ChainId.XDAI]: 'xdai',
  [ChainId.ARBITRUM]: 'arbitrum',
  [ChainId.AVALANCHE]: 'avalanche',
  [ChainId.XRPL]: 'xrpl',
  [ChainId.XDC]: 'xdc',
  [ChainId.APOTHEM]: 'txdc',
}

// @ts-ignore TYPE NEEDS FIXING
export const getCurrencyLogoUrls = (currency): string[] => {
  const urls: string[] = []

  if (currency.chainId in BLOCKCHAIN) {
    // urls.push(
    //   // @ts-ignore TYPE NEEDS FIXING
    //   `https://raw.githubusercontent.com/sushiswap/logos/main/network/${BLOCKCHAIN[currency.chainId]}/${currency.address
    //   }.jpg`
    // )
    // urls.push(
    //   // @ts-ignore TYPE NEEDS FIXING
    //   `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/${BLOCKCHAIN[currency.chainId]}/assets/${currency.address
    //   }/logo.png`
    // )
    // urls.push(
    //   // @ts-ignore TYPE NEEDS FIXING
    //   `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${BLOCKCHAIN[currency.chainId]}/assets/${currency.address
    //   }/logo.png`
    // )

    if (isSupportedChainId(currency.chainId)) {
      // const hostname = window.location.hostname
      // const protocal = window.location.protocol
      // console.log('window.origin', window.origin)
      urls.push(
        // @ts-ignore TYPE NEEDS FIXING
        `https://raw.githubusercontent.com/nexusportal/token-list/main/assets/token/${currency.chainId}/${currency.symbol}.png`
      )
      urls.push(
        // @ts-ignore TYPE NEEDS FIXING
        `https://raw.githubusercontent.com/nexusportal/token-list/main/assets/token/${currency.chainId}/${currency.symbol}.jpg`
      )

      // urls.push(
      //   // @ts-ignore TYPE NEEDS FIXING
      //   `${window.origin}/${currency.symbol}.png`
      // )
    }
  }
  return urls
}

const AvalancheLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/avax.jpg'
const BinanceCoinLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/bnb.jpg'
const EthereumLogo = 'https://raw.githubusercontent.com/sushiswap/sushiswap-interface/master/public/images/native-tokens/eth.png'
const FantomLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/ftm.jpg'
const HarmonyLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/one.jpg'
const HecoLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/heco.jpg'
const MaticLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/polygon.jpg'
const MoonbeamLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/eth.jpg'
const OKExLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/okt.jpg'
const xDaiLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/xdai.jpg'
const CeloLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/celo.jpg'
const PalmLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/palm.jpg'
const MovrLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/movr.jpg'
const FuseLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/fuse.jpg'
const TelosLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/telos.jpg'
const XRPLLogo = 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png'
const XDCLogo = 'https://s2.coinmarketcap.com/static/img/coins/64x64/2634.png'

const LOGO: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: EthereumLogo,
  [ChainId.KOVAN]: EthereumLogo,
  [ChainId.RINKEBY]: EthereumLogo,
  [ChainId.ROPSTEN]: EthereumLogo,
  [ChainId.GÖRLI]: EthereumLogo,
  [ChainId.FANTOM]: FantomLogo,
  [ChainId.FANTOM_TESTNET]: FantomLogo,
  [ChainId.MATIC]: MaticLogo,
  [ChainId.MATIC_TESTNET]: MaticLogo,
  [ChainId.XDAI]: xDaiLogo,
  [ChainId.BSC]: BinanceCoinLogo,
  [ChainId.BSC_TESTNET]: BinanceCoinLogo,
  [ChainId.MOONBEAM_TESTNET]: MoonbeamLogo,
  [ChainId.AVALANCHE]: AvalancheLogo,
  [ChainId.AVALANCHE_TESTNET]: AvalancheLogo,
  [ChainId.HECO]: HecoLogo,
  [ChainId.HECO_TESTNET]: HecoLogo,
  [ChainId.HARMONY]: HarmonyLogo,
  [ChainId.HARMONY_TESTNET]: HarmonyLogo,
  [ChainId.OKEX]: OKExLogo,
  [ChainId.OKEX_TESTNET]: OKExLogo,
  [ChainId.ARBITRUM]: EthereumLogo,
  [ChainId.ARBITRUM_TESTNET]: EthereumLogo,
  [ChainId.CELO]: CeloLogo,
  [ChainId.PALM]: PalmLogo,
  [ChainId.PALM_TESTNET]: PalmLogo,
  [ChainId.MOONRIVER]: MovrLogo,
  [ChainId.FUSE]: FuseLogo,
  [ChainId.TELOS]: TelosLogo,
  [ChainId.XRPL]: XRPLLogo,
  [ChainId.XDC]: XDCLogo,
  [ChainId.APOTHEM]: XDCLogo,
  // [ChainId.HARDHAT]: ""
}

export interface CurrencyLogoProps {
  currency?: Currency
  size?: string | number
  style?: React.CSSProperties
  className?: string
}

const CurrencyLogo: FunctionComponent<CurrencyLogoProps> = ({ currency, size = '24px', className, style }) => {

  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI || currency.tokenInfo.logoURI : undefined
  )

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative || currency?.equals(WNATIVE[currency.chainId])) {
      // @ts-ignore TYPE NEEDS FIXING
      return [LOGO[currency.chainId], UNKNOWN_ICON]
    }

    if (currency?.isToken) {
      const defaultUrls = [...getCurrencyLogoUrls(currency)]
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, ...defaultUrls, UNKNOWN_ICON]
      }
      return defaultUrls
    }

    return [UNKNOWN_ICON]
  }, [currency, uriLocations])



  if (currency?.equals(WNATIVE[currency.chainId]) && currency?.chainId === ChainId.XRPL) {
    return <img alt="img" src={WXRP.src} width={size} height={size} className={className} />
  }

  if (currency?.isNative && currency?.chainId === ChainId.XRPL) {
    return <img alt="img" src={XRP.src} width={size} height={size} className={className} />
  }
  if (currency?.equals(WNATIVE[currency.chainId]) && (currency?.chainId === ChainId.APOTHEM || currency?.chainId === ChainId.XDC)) {
    return <img alt="img" src={XDC.src} width={size} height={size} className={className} />
  }

  if (currency?.isNative && (currency?.chainId === ChainId.APOTHEM || currency?.chainId === ChainId.XDC)) {
    return <img alt="img" src={XDC.src} width={size} height={size} className={className} />
  }

  if (currency?.chainId === ChainId.XRPL) {
    if (currency.symbol === 'XRP') {
      return <img alt="img" src={XRP.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'WXRP') {
      return <img alt="img" src={WXRP.src} width={size} height={size} className={className} />
    }
    if (currency.symbol === 'NEXU') {
      return <img alt="img" src={NEXUS.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'NEXUS') {
      return <img alt="img" src={NEXUS.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'THREE') {
      return <img alt="img" src={THREE.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'TWO') {
      return <img alt="img" src={TWO.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'ONE') {
      return <img alt="img" src={ONE.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'WXRP') {
      return <img alt="img" src={WXRP.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'wUSDT') {
      return <img alt="img" src={USDT.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'wUSDC') {
      return <img alt="img" src={USDC.src} width={size} height={size} className={className} />
    }

  }
  if (currency?.chainId === ChainId.APOTHEM) {
    if (currency.symbol === 'XDC') {
      return <img alt="img" src={XDC.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'WXDC') {
      return <img alt="img" src={WXDC.src} width={size} height={size} className={className} />
    }
    if (currency.symbol === 'NEXU') {
      return <img alt="img" src={NEXUS.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'NEXUS') {
      return <img alt="img" src={NEXUS.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'AIR') {
      return <img alt="img" src={AIR.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'WATER') {
      return <img alt="img" src={WATER.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'FIRE') {
      return <img alt="img" src={FIRE.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'EARTH') {
      return <img alt="img" src={EARTH.src} width={size} height={size} className={className} />
    }

    if (currency.symbol === 'SPACE') {
      return <img alt="img" src={SPACE.src} width={size} height={size} className={className} />
    }
    if (currency.symbol === 'xBTC') {
      return <img alt="img" src={BTC.src} width={size} height={size} className={className} />
    }
    if (currency.symbol === 'xETH') {
      return <img alt="img" src={ETH.src} width={size} height={size} className={className} />
    }
    if (currency.symbol === 'xXRP') {
      return <img alt="img" src={XRP.src} width={size} height={size} className={className} />
    }
    if (currency.symbol === 'xUSDT') {
      return <img alt="img" src={USDT.src} width={size} height={size} className={className} />
    }
    if (currency.symbol === 'xUSDC') {
      return <img alt="img" src={USDC.src} width={size} height={size} className={className} />
    }
    if (currency.symbol === 'WAN') {
      return <img alt="img" src={WAN.src} width={size} height={size} className={className} />
    }
    if (currency.symbol === 'FXD') {
      return <img alt="img" src={FXD.src} width={size} height={size} className={className} />
    }
  }
  if (currency?.chainId === ChainId.XDC) {
    if (currency.symbol === 'NEXU') {
      return <img alt="img" src={NEXUS.src} width={size} height={size} className={className} />
    }
  }





  if (currency instanceof Token) {
    if (currency.chainId === ChainId.XRPL) {
      if (currency.symbol === 'NEXUS') {
        return <img alt="img" src={NEXUS.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'XVM') {
        return <img alt="img" src={XVM.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'XRP') {
        return <img alt="img" src={XRP.src} width={size} height={size} className={className} />
      }
      if (currency.symbol === 'WXRP') {
        return <img alt="img" src={WXRP.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'wBTC') {
        return <img alt="img" src={BTC.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'WETH') {
        return <img alt="img" src={WXRP.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'wWAN') {
        return <img alt="img" src={WAN.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'FXD') {
        return <img alt="img" src={FXD.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'wUSDT') {
        return <img alt="img" src={USDT.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'wUSDC') {
        return <img alt="img" src={USDC.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'XRP') {
        return <img alt="img" src={XRP.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'WXRP') {
        return <img alt="img" src={WXRP.src} width={size} height={size} className={className} />
      }

    }

    if (currency?.chainId === ChainId.APOTHEM) {
      if (currency.symbol === 'XDC') {
        return <img alt="img" src={XDC.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'WXDC') {
        return <img alt="img" src={WXDC.src} width={size} height={size} className={className} />
      }
      if (currency.symbol === 'NEXU') {
        return <img alt="img" src={NEXUS.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'NEXUS') {
        return <img alt="img" src={NEXUS.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'AIR') {
        return <img alt="img" src={AIR.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'WATER') {
        return <img alt="img" src={WATER.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'FIRE') {
        return <img alt="img" src={FIRE.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'EARTH') {
        return <img alt="img" src={EARTH.src} width={size} height={size} className={className} />
      }

      if (currency.symbol === 'SPACE') {
        return <img alt="img" src={SPACE.src} width={size} height={size} className={className} />
      }
      if (currency.symbol === 'xBTC') {
        return <img alt="img" src={BTC.src} width={size} height={size} className={className} />
      }
      if (currency.symbol === 'xETH') {
        return <img alt="img" src={ETH.src} width={size} height={size} className={className} />
      }
      if (currency.symbol === 'xXRP') {
        return <img alt="img" src={XRP.src} width={size} height={size} className={className} />
      }
      if (currency.symbol === 'xUSDT') {
        return <img alt="img" src={USDT.src} width={size} height={size} className={className} />
      }
      if (currency.symbol === 'xUSDC') {
        return <img alt="img" src={USDC.src} width={size} height={size} className={className} />
      }
      if (currency.symbol === 'WAN') {
        return <img alt="img" src={WAN.src} width={size} height={size} className={className} />
      }
      if (currency.symbol === 'FXD') {
        return <img alt="img" src={FXD.src} width={size} height={size} className={className} />
      }
    }
    if (currency?.chainId === ChainId.XDC) {
      // return <img alt="img" src={XDC.src} width={size} height={size} className={className} />
    }
  }

  if (currency instanceof WrappedTokenInfo) {
    if (currency.tokenInfo.chainId === ChainId.XRPL) {

      if (currency.tokenInfo.symbol === 'NEXUS') {
        return <img alt="img" src={NEXUS.src} width={size} height={size} className={className} />
      }
      if (currency.tokenInfo.symbol === 'XRP') {
        return <img alt="img" src={XRP.src} width={size} height={size} className={className} />
      }
      if (currency.tokenInfo.symbol === 'WXRP') {
        return <img alt="img" src={WXRP.src} width={size} height={size} className={className} />
      }
    }
    if (currency.tokenInfo.chainId === ChainId.APOTHEM) {

      if (currency.tokenInfo.symbol === 'NEXUS') {
        return <img alt="img" src={NEXUS.src} width={size} height={size} className={className} />
      }
      if (currency.tokenInfo.symbol === 'XDC') {
        return <img alt="img" src={XDC.src} width={size} height={size} className={className} />
      }
      if (currency.tokenInfo.symbol === 'WXDC') {
        return <img alt="img" src={WXDC.src} width={size} height={size} className={className} />
      }
    }
    if (currency.tokenInfo.chainId === ChainId.XDC) {
      if (currency.tokenInfo.symbol === 'NEXUS') {
        return <img alt="img" src={NEXUS.src} width={size} height={size} className={className} />
      }
      if (currency.tokenInfo.symbol === 'WXDC') {
        return <img alt="img" src={XDC.src} width={size} height={size} className={className} />
      }
      // return <img alt="img" src={NEXUS.src} width={size} height={size} className={className} />
    }
  }

  return <Logo srcs={srcs} width={size} height={size} alt={currency?.symbol} className={className} style={style} />
}

export default CurrencyLogo
