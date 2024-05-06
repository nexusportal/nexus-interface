import { SwitchHorizontalIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
import { BentoboxIcon, WalletIcon } from 'app/components/Icon'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import { getChainIdString } from 'app/config/wallets'
import { Feature } from 'app/enums/Feature'
import ActionItem from 'app/features/portfolio/ActionsModal/ActionItem'
import { setBalancesActiveModal } from 'app/features/portfolio/portfolioSlice'
import { useBalancesSelectedCurrency } from 'app/features/portfolio/useBalancesDerivedState'
import { ActiveModal } from 'app/features/trident/types'
import { featureEnabled } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { getTokenInfo, useAllTokensList } from 'app/state/lists/hooks'
import { useRouter } from 'next/router'
import React, { FC, useCallback, useEffect } from 'react'

interface ActionViewProps {
  onClose(): void
}

const ActionView: FC<ActionViewProps> = ({ onClose }) => {
  const { chainId } = useActiveWeb3React()
  const currency = useBalancesSelectedCurrency()
  const dispatch = useAppDispatch()
  const { i18n } = useLingui()
  const router = useRouter()

  const swapActionHandler = useCallback(async () => {
    // @ts-ignore TYPE NEEDS FIXING
    if (featureEnabled(Feature.TRIDENT, chainId)) {
      if (currency?.isNative) return router.push('/trident/swap')
      // @ts-ignore TYPE NEEDS FIXING
      return router.push(`/trident/swap?&tokens=${NATIVE[chainId].symbol}&tokens=${currency?.wrapped.address}`)
    }

    if (currency?.isNative) return router.push('/swap')

    return router.push(`/swap?inputCurrency=${currency?.wrapped.address}`)
  }, [chainId, currency?.isNative, currency?.wrapped.address, router])

  const alltokenslist = useAllTokensList(chainId)

  const addToken = useCallback(async (tokenAddress, tokenSymbol, tokenDecimals) => {
    if (!tokenAddress || !tokenSymbol || !tokenDecimals || !chainId) return;
    const ethereum = window.ethereum;
    if (!ethereum || !ethereum.isMetaMask) {
      console.log('Please install MetaMask.');
      return;
    }
    let tokenImage = getTokenInfo(alltokenslist.tokens, tokenAddress, getChainIdString(chainId))
    try {
      // @ts-ignore TYPE NEEDS FIXING
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log('Token was successfully added!');
      } else {
        console.log('Token was not added.');
      }
    } catch (error) {
      console.log('Error while adding token:', error);
    }
  }, [chainId])

  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={i18n._(t`Available actions`)} onClose={() => onClose()} />
      <ActionItem
        svg={<SwitchHorizontalIcon width={24} />}
        label={i18n._(t`Swap ${currency?.symbol}`)}
        onClick={swapActionHandler}
      />
      <ActionItem
        svg={<SwitchHorizontalIcon width={24} />}
        label={i18n._(t`Add to Metamask`)}
        onClick={() => addToken(currency?.wrapped.address, currency?.symbol, currency?.decimals)}
      />
      {/*@ts-ignore TYPE NEEDS FIXING*/}
      {featureEnabled(Feature.BENTOBOX, chainId) && (
        <>
          <ActionItem
            svg={null}
            // svg={<BentoboxIcon width={20} height={20} />}
            label={i18n._(t`Deposit ${currency?.symbol} to BentoBox`)}
            onClick={() => dispatch(setBalancesActiveModal(ActiveModal.DEPOSIT))}
          />
          <ActionItem
            svg={<WalletIcon width={20} height={20} />}
            label={i18n._(t`Withdraw ${currency?.symbol} to Wallet`)}
            onClick={() => dispatch(setBalancesActiveModal(ActiveModal.WITHDRAW))}
          />
        </>
      )}
    </div>
  )
}

export default ActionView
