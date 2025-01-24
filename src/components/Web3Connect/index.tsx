import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { classNames } from 'app/functions'
import { useWalletModalToggle } from 'app/state/application/hooks'
import React, { FC, Fragment, useCallback, useRef, useState, useEffect } from 'react'
import { Activity } from 'react-feather'
import Button, { ButtonProps } from '../Button'
// @ts-ignore: Unreachable code error
// eslint-disable-next-line simple-import-sort/imports
import { Arwes, ThemeProvider, Heading, Paragraph, Frame, createTheme, SoundsProvider, createSounds, withSounds } from 'arwes';
import Typography from 'app/components/Typography'
import { useMediaQuery } from 'react-responsive'
import { injected } from 'app/config/wallets'

export default function Web3Connect({ color = 'gray', size = 'sm', className = '', ...rest }: ButtonProps) {
  const { i18n } = useLingui()
  const toggleWalletModal = useWalletModalToggle()
  const { error, activate } = useWeb3React()
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const [localError, setLocalError] = useState<Error | undefined>(error)

  useEffect(() => {
    setLocalError(error)
    if (error) {
      const timer = setTimeout(() => {
        setLocalError(undefined)
      }, 10000) // Reset after 10 seconds
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleClick = useCallback(() => {
    if (isMobile) {
      activate(injected).catch((err) => {
        setLocalError(err)
      })
    } else {
      toggleWalletModal()
    }
  }, [isMobile, toggleWalletModal, activate])

  return localError ? (
    <Frame
      animate={true}
      level={3}
      corners={4}
      layer='alert'
      onClick={handleClick}
      variant="outlined"
      color={color}
      className="py-2 mx-auto text-center bg-transparent w-max"
      size={size}
      {...rest}
    >
      <div
        className="flex items-center justify-center px-1 py-0 font-semibold text-white bg-opacity-75 border-red bg-red hover:bg-opacity-100"
      >
        <div className="mr-1">
          <Activity className="w-4 h-4" />
        </div>
        <span className='py-2 px-2'>
          {localError instanceof UnsupportedChainIdError ? i18n._(t`Wrong Network!`) : i18n._(t`Error`)}
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
      onClick={handleClick}
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