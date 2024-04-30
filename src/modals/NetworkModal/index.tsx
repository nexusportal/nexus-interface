import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { NETWORK_ICON, NETWORK_LABEL } from 'app/config/networks'
import { classNames } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { ApplicationModal } from 'app/state/application/actions'
import { useModalOpen, useNetworkModalToggle } from 'app/state/application/hooks'
// @ts-ignore TYPE NEEDS FIXING
import Image from 'next/image'
import React, { FC } from 'react'
import XRP from '../../../public/XRP.png'
import XDC from '../../../public/xdcpay.png'
import { supportedChainIds } from 'app/config/wallets'


export const SUPPORTED_NETWORKS: {
  [key: number]: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.XRPL]: {
    chainId: '0x15f902',
    chainName: 'Ripple XRPL',
    nativeCurrency: {
      name: 'Ripple',
      symbol: 'XRP',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-evm-sidechain.xrpl.org'],
    blockExplorerUrls: ['https://evm-sidechain.xrpl.org/'],
  },
  [ChainId.APOTHEM]: {
    chainId: '0x33',
    chainName: 'Apothem Testnet',
    nativeCurrency: {
      name: 'XDC',
      symbol: 'TXDC',
      decimals: 18,
    },
    rpcUrls: ['https://erpc.apothem.network'],
    blockExplorerUrls: ['https://apothem.blocksscan.io'],
  },
  [ChainId.XDC]: {
    chainId: '0x32',
    chainName: 'XDC',
    nativeCurrency: {
      name: 'XDC',
      symbol: 'XDC',
      decimals: 18,
    },
    rpcUrls: ['https://erpc.xinfin.network/'],
    blockExplorerUrls: ['https://xdcscan.io'],
  },
}

const NetworkModal: FC = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <HeadlessUiModal.Controlled isOpen={networkModalOpen} onDismiss={toggleNetworkModal}>
      <div className="flex flex-col gap-4">
        <HeadlessUiModal.Header header={i18n._(t`Select a network`)} onClose={toggleNetworkModal} />
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">
          {supportedChainIds.map((key: ChainId, i: number) => {
            if (chainId === key) {
              return (
                <div
                  key={i}
                  className="bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 w-full px-4 py-3 rounded border border-purple cursor-default"
                >
                  {key === ChainId.XRPL ? (
                    <img src={XRP.src} className="rounded-md" width="32px" height="32px" />
                  ) : (key === ChainId.XDC || key === ChainId.APOTHEM) ? (
                    <img src={XDC.src} className="rounded-md" width="32px" height="32px" />
                  ) : (
                    <Image
                      // @ts-ignore TYPE NEEDS FIXING
                      src={NETWORK_ICON[key]}
                      alt="Switch Network"
                      className="rounded-md"
                      width="32px"
                      height="32px"
                    />
                  )}

                  <Typography weight={700} className="text-high-emphesis">
                    {NETWORK_LABEL[key]}
                  </Typography>
                </div>
              )
            }
            return (
              <button
                key={i}
                onClick={async () => {
                  console.debug(`Switching to chain ${key}`, SUPPORTED_NETWORKS[key])
                  toggleNetworkModal()
                  const params = SUPPORTED_NETWORKS[key]
                  try {
                    await library?.send('wallet_switchEthereumChain', [{ chainId: `0x${key.toString(16)}` }, account]).then(() => {
                      location.reload()
                    })
                  } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    // @ts-ignore TYPE NEEDS FIXING
                    if (switchError.code === 4902) {
                      try {
                        await library?.send('wallet_addEthereumChain', [params, account])
                      } catch (addError) {
                        // handle "add" error
                        console.error(`Add chain error ${addError}`)
                      }
                    }
                    console.error(`Switch chain error ${switchError}`)
                    // handle other "switch" errors
                  }
                }}
                className={classNames(
                  'bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 w-full px-4 py-3 rounded border border-dark-700 hover:border-blue'
                )}
              >
                {/*@ts-ignore TYPE NEEDS FIXING*/}
                {
                  key === ChainId.XRPL ? (
                    <img src={XRP.src} className="rounded-md" width="32px" height="32px" />
                  ) : (key === ChainId.XDC || key === ChainId.APOTHEM) ? (
                    <img src={XDC.src} className="rounded-md" width="32px" height="32px" />
                  ) : (
                    <Image
                      // @ts-ignore TYPE NEEDS FIXING
                      src={NETWORK_ICON[key]}
                      alt="Switch Network"
                      className="rounded-md"
                      width="32px"
                      height="32px"
                    />
                  )}

                {/* <Image src={NETWORK_ICON[key]} alt="Switch Network" className="rounded-md" width="32px" height="32px" /> */}
                <Typography weight={700} className="text-high-emphesis">
                  {NETWORK_LABEL[key]}
                </Typography>
              </button>
            )
          })}
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}

export default NetworkModal
