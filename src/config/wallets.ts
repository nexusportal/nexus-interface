import { ChainId } from '@sushiswap/core-sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from 'app/entities/connectors'

import RPC from './rpc'

// const supportedChainIds = Object.values(ChainId) as number[]
export const supportedChainIds = [ChainId.XDC, ChainId.APOTHEM, ChainId.XRPL]

export const getChainIdString = (chainId: number | undefined) => {
  const chain = chainId === ChainId.APOTHEM ? "51" : chainId === ChainId.XRPL ? "1440002" : "50"
  return chain;
}

export const isSupportedChainId = (chainId: number | undefined) => {
  if (!chainId) return false;
  return supportedChainIds.includes(chainId);
}

export const network = new NetworkConnector({
  defaultChainId: ChainId.XDC,
  urls: RPC,
})

export const injected = new InjectedConnector({
  supportedChainIds,
})

export interface WalletInfo {
  connector?: (() => Promise<AbstractConnector>) | AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'injected.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  METAMASK_MOBILE: {
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Open in MetaMask app.',
    href: 'https://metamask.app.link/dapp/dex.thenexusportal.io',
    color: '#E8831D',
    mobile: true,
    mobileOnly: true,
  },
}
