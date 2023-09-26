import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { classNames } from 'app/functions'
import { useWalletModalToggle } from 'app/state/application/hooks'
import React, { FC, Fragment, useCallback, useRef } from 'react'
import { Activity } from 'react-feather'
import Button, { ButtonProps } from '../Button'
// @ts-ignore: Unreachable code error
// eslint-disable-next-line simple-import-sort/imports
import { Arwes, ThemeProvider, Heading, Paragraph, Frame, createTheme, SoundsProvider, createSounds, withSounds } from 'arwes';
import Typography from 'app/components/Typography'

export default function Web3Connect({ color = 'gray', size = 'sm', className = '', ...rest }: ButtonProps) {
  const { i18n } = useLingui()
  const toggleWalletModal = useWalletModalToggle()
  const { error } = useWeb3React()
  // @ts-ignore

  return error ? (
    <Frame
      animate={true}
      level={3}
      corners={4}
      layer='alert'
      onClick={toggleWalletModal}
      variant="outlined"
      color={color}
      className="py-2 mx-auto text-center bg-transparent w-max"
      size={size}
      {...rest}
    >
      <div
        className="flex items-center justify-center px-1 py-0 font-semibold text-white bg-opacity-75 border-red bg-red hover:bg-opacity-100"
        onClick={toggleWalletModal}
      >
        <div className="mr-1">
          <Activity className="w-4 h-4" />
        </div>
        <span className='py-2 px-2'>
          {error instanceof UnsupportedChainIdError ? i18n._(t`Wrong Network!`) : i18n._(t`Error`)}
        </span>
      </div>
    </Frame>

  ) : (
    <Frame
      animate={true}
      level={3}
      corners={4}
      layer='success'
      id="connect-wallet"
      onClick={toggleWalletModal}
      variant="outlined"
      color={color}
      className="py-2 mx-auto text-center bg-transparent w-max"
      size={size}
      {...rest}
    >

      <div className="px-3 py-2">
        <span className='py-2 px-2'>
          {i18n._(t`Connect`)}
        </span>
      </div>

    </Frame>
  )
}