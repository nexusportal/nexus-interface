import { ChainId } from '@sushiswap/core-sdk'
import { NETWORK_ICON } from 'app/config/networks'
import NetworkModel from 'app/modals/NetworkModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useNetworkModalToggle } from 'app/state/application/hooks'
import Image from 'next/image'
import React from 'react'
import XRP from '../../../public/XRP.png'
import XDC from '../../../public/XDC.png'
// @ts-ignore: Unreachable code error
// eslint-disable-next-line simple-import-sort/imports
import { Arwes, ThemeProvider, Button, Heading, Paragraph, Frame, createTheme, SoundsProvider, createSounds, withSounds } from 'arwes';
function Web3Network(): JSX.Element | null {
  const { chainId } = useActiveWeb3React()

  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (

    <div
      className="flex items-center text-sm font-bold rounded cursor-pointer pointer-events-auto select-none whitespace-nowrap"
      onClick={() => toggleNetworkModal()}
    >
      <Frame
        level={3}
        corners={2}
        className="w-100"
        layer='primary'>
        <div className="grid items-center grid-flow-col  justify-center  h-[36px] w-[36px] text-sm rounded pointer-events-auto auto-cols-max text-secondary hover:bg-blue-100/25" style={{ transition: 'background-color 0.5s ease' }}>
          {/*@ts-ignore TYPE NEEDS FIXING*/}

          {
          chainId === ChainId.XRPL ? (
            <img
              src={XRP.src}
              alt="XRP"
              width={22}
              height={22}
              style={{ width: '22px', height: '22px' }}
            />
          ) :(chainId === ChainId.XDC ||chainId === ChainId.APOTHEM ) ?  (
            <img
              src={XDC.src}
              alt="XDC"
              width={22}
              height={22}
              style={{ width: '22px', height: '22px' }}
            />
          ) : (
            <div className="w-[22px] h-[22px] relative">
              <img
                src={NETWORK_ICON[chainId as keyof typeof NETWORK_ICON]}
                alt={`Network ${chainId}`}
                className="rounded-md"
                width="22"
                height="22"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  console.error('Failed to load network icon:', e)
                  // Optionally set a fallback image
                  // e.currentTarget.src = '/fallback-icon.png'
                }}
              />
            </div>
          )}

          {/* <Image src={NETWORK_ICON[chainId]} alt="Switch Network" className="rounded-md" width="22px" height="22px" /> */}
        </div>
      </Frame>
      <NetworkModel />
    </div>
  )
}

export default Web3Network
