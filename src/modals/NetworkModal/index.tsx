import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { NETWORK_ICON, NETWORK_LABEL } from 'app/config/networks'
import { useActiveWeb3React } from 'app/services/web3'
import { ApplicationModal } from 'app/state/application/actions'
import { useModalOpen, useNetworkModalToggle } from 'app/state/application/hooks'
// @ts-ignore TYPE NEEDS FIXING
import Image from 'next/image'
import React, { FC } from 'react'
import XRP from '../../../public/XRP.png'
import XDC from '../../../public/XDC.png'
import { supportedChainIds } from 'app/config/wallets'
import { Frame } from 'arwes'

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
    rpcUrls: [
      'https://rpc.xinfin.network/',
      'https://erpc.xinfin.network/',
      'https://erpc.xdcrpc.com/'
    ],
    blockExplorerUrls: ['https://xdc.blocksscan.io'],
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {supportedChainIds.map((key: ChainId, i: number) => {
            const isCurrentChain = chainId === key
            const layer = isCurrentChain ? 'success' : 'primary'

            return (
              <Frame
                key={i}
                animate={true}
                level={3}
                corners={4}
                layer={layer}
                className="cursor-pointer w-full p-0"
                onClick={async () => {
                  if (!isCurrentChain) {
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
                  }
                }}
                style={{ marginBottom: '10px' }}
              >
                <div className={`flex items-center gap-4 px-4 py-3 rounded hover:bg-green-500/50`} style={{ transition: 'background-color 0.3s ease' }}>
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
              </Frame>
            )
          })}
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}

export default NetworkModal
