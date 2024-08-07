import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, JSBI, Token, Trade as V2Trade, TradeType } from '@sushiswap/core-sdk'
import Banner from 'app/components/Banner'
import Button from 'app/components/Button'
import RecipientField from 'app/components/RecipientField'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import ConfirmSwapModal from 'app/features/legacy/swap/ConfirmSwapModal'
import SwapCallbackError from 'app/features/legacy/swap/SwapCallbackError'
import SwapDetails from 'app/features/legacy/swap/SwapDetails'
import UnsupportedCurrencyFooter from 'app/features/legacy/swap/UnsupportedCurrencyFooter'
import HeaderNew from 'app/features/trade/HeaderNew'
import SwapAssetPanel from 'app/features/trident/swap/SwapAssetPanel'
import { classNames } from 'app/functions'
import confirmPriceImpactWithoutFee from 'app/functions/prices'
import { warningSeverity } from 'app/functions/prices'
import { computeFiatValuePriceImpact } from 'app/functions/trade'
import { useAllTokens, useCurrency } from 'app/hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from 'app/hooks/useApproveCallback'
import useENSAddress from 'app/hooks/useENSAddress'
import useIsArgentWallet from 'app/hooks/useIsArgentWallet'
import { useIsSwapUnsupported } from 'app/hooks/useIsSwapUnsupported'
import { useSwapCallback } from 'app/hooks/useSwapCallback'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import useWalletSupportsOpenMev from 'app/hooks/useWalletSupportsOpenMev'
import useWrapCallback, { WrapType } from 'app/hooks/useWrapCallback'
import { SwapLayout, SwapLayoutCard } from 'app/layouts/SwapLayout'
import TokenWarningModal from 'app/modals/TokenWarningModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useDexWarningOpen } from 'app/state/application/hooks'
import { Field, setRecipient } from 'app/state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'app/state/swap/hooks'
import { useExpertModeManager, useUserOpenMev, useUserSingleHopOnly } from 'app/state/user/hooks'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga'
import Head from 'next/head'
import LogoImage from '../../../../public/NEXUS2.png'
import Link from 'next/link';
import { ChartsIcon } from 'app/components/Icon'


import { fetchAPI } from '../../../lib/api'
import ExternalLink from 'app/components/ExternalLink'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
// @ts-ignore: Unreachable code error
// eslint-disable-next-line simple-import-sort/imports
import { Arwes, Logo, Words, ThemeProvider, Heading, Paragraph, Frame, createTheme, SoundsProvider, createSounds, withSounds } from 'arwes';

import { Contract } from '@ethersproject/contracts';
import factoryABI from 'app/constants/abis/uniswap-v2-factory.json'


const CONFIG: Record<number, { factoryAddress: string, geckoBaseURL: string, wrappedTokenAddress: string }> = {
  51: {
    factoryAddress: '0xAf2977827a72e3CfE18104b0EDAF61Dd0689cd31',
    geckoBaseURL: 'https://www.geckoterminal.com/apothem/pools/',
    wrappedTokenAddress: '0x951857744785e80e2de051c32ee7b25f9c458c42',
  },
  50: {
    factoryAddress: '0xAf2977827a72e3CfE18104b0EDAF61Dd0689cd31',
    geckoBaseURL: 'https://www.geckoterminal.com/xdc/pools/',
    wrappedTokenAddress: '0x951857744785e80e2de051c32ee7b25f9c458c42',
  },
  140002: {
    factoryAddress: 'XRP_FACTORY_CONTRACT_ADDRESS',
    geckoBaseURL: 'https://www.geckoterminal.com/xrp/pools/',
    wrappedTokenAddress: '0xWrappedTokenAddressForChain140002',
  },
};




export async function getServerSideProps() {
  try {
    const { data } = await fetchAPI('/banners?populate=image')
    return {
      props: { banners: data || [] },
    }
  } catch (e) {
    return {
      props: { banners: [] },
    }
  }
}

/* @ts-ignore TYPE NEEDS FIXING */
const Swap = ({ banners }) => {
  const { i18n } = useLingui()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { account, library } = useActiveWeb3React()
  const defaultTokens = useAllTokens()
  const [isExpertMode] = useExpertModeManager()
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, parsedAmount, currencies, inputError: swapInputError, allowedSlippage, to } = useDerivedSwapInfo()
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]

  const [geckoTerminalURL, setGeckoTerminalURL] = useState('');
  const [showChart, setShowChart] = useState(false);


  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  // dismiss warning if all imported tokens are in active lists
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens)
    })

  const balance = useBentoOrWalletBalance(account ? account : undefined, currencies[Field.INPUT], true)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)

  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
          [Field.INPUT]: parsedAmount,
          [Field.OUTPUT]: parsedAmount,
        }
        : {
          [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
          [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
        },
    [independentField, parsedAmount, showWrap, trade]
  )


  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT])
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT])
  const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: V2Trade<Currency, Currency, TradeType> | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? /* @ts-ignore TYPE NEEDS FIXING */
      parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const userHasSpecifiedInputOutput = Boolean(
    /* @ts-ignore TYPE NEEDS FIXING */
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )

  const routeNotFound = !trade?.route

  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  const signatureData = undefined

  const handleApprove = useCallback(async () => {
    await approveCallback()
    // if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
    //   try {
    //     await gatherPermitSignature()
    //   } catch (error) {
    //     // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
    //     if (error?.code !== USER_REJECTED_TRANSACTION) {
    //       await approveCallback()
    //     }
    //   }
    // } else {
    //   await approveCallback()
    // }
  }, [approveCallback])
  // }, [approveCallback, gatherPermitSignature, signatureState])

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  useEffect(() => {
    const fetchLPAddress = async () => {
      if (currencies.INPUT && currencies.OUTPUT && library) {
        const { chainId } = await library.getNetwork(); // Get the current chain ID
        const config = CONFIG[chainId];

        if (config) {
          const factoryContract = new Contract(
            config.factoryAddress,
            factoryABI,
            library.getSigner()
          );

          const inputAddress = (currencies.INPUT.isNative)
            ? config.wrappedTokenAddress
            : (currencies.INPUT as Token).address;

          const outputAddress = (currencies.OUTPUT.isNative)
            ? config.wrappedTokenAddress
            : (currencies.OUTPUT as Token).address;

          try {
            const lpAddress = await factoryContract.getPair(inputAddress, outputAddress);
            console.log(`LP Address: ${lpAddress}`);
            const url = `${config.geckoBaseURL}${lpAddress}?embed=1&info=1&swaps=0`;
            console.log(`Gecko Terminal URL: ${url}`);
            setGeckoTerminalURL(url);
          } catch (error) {
            console.error('Error fetching LP address:', error);
          }
        } else {
          console.error('Unsupported chain ID:', chainId);
        }
      }
    };

    fetchLPAddress();
  }, [currencies.INPUT, currencies.OUTPUT, library]);




  const [useOpenMev] = useUserOpenMev()
  const walletSupportsOpenMev = useWalletSupportsOpenMev()

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    to,
    signatureData,
    /* @ts-ignore TYPE NEEDS FIXING */
    null,
    walletSupportsOpenMev && useOpenMev
  )

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
      return
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      showConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    })
    swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
        })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
                ? 'Swap w/o Send + recipient'
                : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            singleHopOnly ? 'SH' : 'MH',
          ].join('/'),
        })

        ReactGA.event({
          category: 'Routing',
          action: singleHopOnly ? 'Swap with multihop disabled' : 'Swap with multihop enabled',
        })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [
    swapCallback,
    priceImpact,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade?.inputAmount?.currency?.symbol,
    trade?.outputAmount?.currency?.symbol,
    singleHopOnly,
  ])

  // warnings on slippage
  // const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);
  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact
    )
  }, [priceImpact, trade])

  const isArgentWallet = useIsArgentWallet()

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({
      showConfirm: false,
      tradeToConfirm,
      attemptingTxn,
      swapErrorMessage,
      txHash,
    })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  )

  const swapIsUnsupported = useIsSwapUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const priceImpactCss = useMemo(() => {
    switch (priceImpactSeverity) {
      case 0:
      case 1:
      case 2:
      default:
        return 'text-low-emphesis'
      case 3:
        return 'text-yellow'
      case 4:
        return 'text-red'
    }
  }, [priceImpactSeverity])

  const showUseDexWarning = useDexWarningOpen()


  return (
    <>
      <Head>
        <title>NEXUS Swap | DEX</title>
        <meta key="description" name="description" content="NEXUSSwap AMM" />
        <meta key="twitter:description" name="twitter:description" content="NEXUSSwap AMM" />
        <meta key="og:description" property="og:description" content="NEXUSSwap AMM" />
      </Head>



      <ConfirmSwapModal
        isOpen={showConfirm}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        // @ts-ignore TYPE NEEDS FIXING
        recipient={recipient}
        allowedSlippage={allowedSlippage}
        onConfirm={handleSwap}
        swapErrorMessage={swapErrorMessage}
        onDismiss={handleConfirmDismiss}
      />
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
      />


      <Link href="/">
        <a>
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-full text-center">
              <div className="inline-block relative">
                <div className="" style={{ height: '125px', width: '125px' }}>
                  <Logo animate size={125} />
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>


      <SwapLayoutCard>
        <div className="px-2">
          <HeaderNew inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
        </div>
        <div className="flex justify-end gap-2 pt-2 px-2">
          {['25', '50', '75', '100'].map((multiplier, i) => (
            <Button
              variant="outlined"
              size="xs"
              color={'blue'}
              key={i}
              onClick={() => {
                if (!balance) return;
                handleTypeInput(balance.multiply(multiplier).divide(100).toExact())
                // @ts-ignore TYPE NEEDS FIXING
                // setDepositValue(balance.multiply(multiplier).divide(100).toExact())
              }}
              className={classNames(
                'text-md border border-opacity-50',
                'focus:ring-blue border-blue'
              )}
            >
              {multiplier === '100' ? 'MAX' : multiplier + '%'}
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <SwapAssetPanel
            spendFromWallet={true}
            header={(props) => (
              <SwapAssetPanel.Header
                {...props}
                label={
                  independentField === Field.OUTPUT && !showWrap ? i18n._(t`Swap from (est.):`) : i18n._(t`Swap from:`)
                }
              />
            )}
            currency={currencies[Field.INPUT]}
            value={formattedAmounts[Field.INPUT]}
            onChange={handleTypeInput}
            onSelect={handleInputSelect}
          />
          <div className="z-0 flex justify-center -mt-6 -mb-6">
            <div
              role="button"
              className="p-1.5 rounded-full  shadow-md "
              onClick={() => {
                setApprovalSubmitted(false) // reset 2 step UI for approvals
                onSwitchTokens()
              }}
            >
              <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" />
            </div>
          </div>
          <SwapAssetPanel
            spendFromWallet={true}
            header={(props) => (
              <SwapAssetPanel.Header
                {...props}
                label={independentField === Field.INPUT && !showWrap ? i18n._(t`Swap to (est.):`) : i18n._(t`Swap to:`)}
              />
            )}
            currency={currencies[Field.OUTPUT]}
            value={formattedAmounts[Field.OUTPUT]}
            onChange={handleTypeOutput}
            onSelect={handleOutputSelect}
            priceImpact={priceImpact}
            priceImpactCss={priceImpactCss}
          />
          {isExpertMode && <RecipientField recipient={recipient} action={setRecipient} />}
          {Boolean(trade) && (
            <SwapDetails
              inputCurrency={currencies[Field.INPUT]}
              outputCurrency={currencies[Field.OUTPUT]}
              trade={trade}
              recipient={recipient ?? undefined}
            />
          )}

          {trade && routeNotFound && userHasSpecifiedInputOutput && (
            <Typography variant="xs" className="py-2 text-center">
              {i18n._(t`Insufficient liquidity for this trade.`)}{' '}
              {singleHopOnly && i18n._(t`Try enabling multi-hop trades`)}
            </Typography>
          )}

          {swapIsUnsupported ? (
            <Button color="red" disabled fullWidth className="rounded-2xl md:rounded">
              {i18n._(t`Unsupported Asset`)}
            </Button>
          ) : !account ? (
            <Web3Connect color="blue" variant="filled" fullWidth className="rounded-2xl md:rounded" />
          ) : showWrap ? (
            <Button
              fullWidth
              color="blue"
              disabled={Boolean(wrapInputError)}
              onClick={onWrap}
              className="rounded-2xl md:rounded"
            >
              {wrapInputError ??
                (wrapType === WrapType.WRAP
                  ? i18n._(t`Wrap`)
                  : wrapType === WrapType.UNWRAP
                    ? i18n._(t`Unwrap`)
                    : null)}
            </Button>
          ) : showApproveFlow ? (
            <div>
              {approvalState !== ApprovalState.APPROVED && (
                <Button
                  fullWidth
                  loading={approvalState === ApprovalState.PENDING}
                  onClick={handleApprove}
                  disabled={approvalState !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                  className="rounded-2xl md:rounded"
                >
                  {i18n._(t`Approve ${currencies[Field.INPUT]?.symbol}`)}
                </Button>
              )}
              {approvalState === ApprovalState.APPROVED && (
                <Button
                  color={isValid && priceImpactSeverity > 2 ? 'red' : 'gradient'}
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap()
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      })
                    }
                  }}
                  fullWidth
                  id="swap-button"
                  disabled={
                    !isValid || approvalState !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                  }
                  className="rounded-2xl md:rounded"
                >
                  {priceImpactSeverity > 3 && !isExpertMode
                    ? i18n._(t`Price Impact High`)
                    : priceImpactSeverity > 2
                      ? i18n._(t`Swap Anyway`)
                      : i18n._(t`Swap`)}
                </Button>
              )}
            </div>
          ) : (
            <Button
              color={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'red' : 'gradient'}
              fullWidth
              onClick={() => {
                if (isExpertMode) {
                  handleSwap()
                } else {
                  setSwapState({
                    tradeToConfirm: trade,
                    attemptingTxn: false,
                    swapErrorMessage: undefined,
                    showConfirm: true,
                    txHash: undefined,
                  })
                }
              }}
              id="swap-button"
              disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
              className="rounded-2xl md:rounded"
            >
              {swapInputError
                ? swapInputError
                : priceImpactSeverity > 3 && !isExpertMode
                  ? i18n._(t`Price Impact Too High`)
                  : priceImpactSeverity > 2
                    ? i18n._(t`Swap Anyway`)
                    : i18n._(t`Swap`)}
            </Button>
          )}
          {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
          {swapIsUnsupported ? <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} /> : null}
        </div>
      </SwapLayoutCard>

      {/* Chart */}
      {account && (
        <Frame
          animate={true}
          level={3}
          corners={4}
          layer='success'
          onClick={() => setShowChart(!showChart)}
          className="py-2 mx-auto text-center bg-transparent w-max cursor-pointer"
        >
          <div className="px-3 py-2 flex items-center space-x-2">
            <ChartsIcon width={20} />
            <span>{showChart ? 'Hide Chart' : 'Show Chart'}</span>
          </div>
        </Frame>
      )}


      <br />
      <span className="text-lg font-bold md:text-xl text-green">
      </span>

      <div>
        {/* Desktop View */}
        <div className="desktop-view">
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
            <div style={{ marginRight: '20px' }}> {/* Container for the chart */}
              {showChart && (
                <Frame
                  animate
                  corners={4}
                  layer="primary"
                  style={{ width: '1000px', height: '500px', display: 'flex' }}
                >
                  <iframe
                    src={geckoTerminalURL + '&swaps=1'} // Ensure trades are shown
                    style={{ width: '1000px', height: '500px', display: 'flex', border: 'none' }}
                    allowFullScreen
                  ></iframe>
                </Frame>
              )}
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="mobile-view">
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', width: '100%' }}>
            <div style={{ margin: '1px', maxWidth: '100%' }}> {/* Container for the chart */}
              {showChart && (
                <Frame animate corners={4} layer="primary" style={{ width: '100%', height: '500px', display: 'flex' }}>
                  <iframe
                    src={geckoTerminalURL + '&swaps=1'} // Ensure trades are shown
                    style={{ width: '100%', height: '500px', display: 'flex', border: 'none' }}
                    allowFullScreen
                  ></iframe>
                </Frame>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
    .desktop-view {
      display: none;
    }
    .mobile-view {
      display: block;
    }
    @media (min-width: 768px) {
      .desktop-view {
        display: block;
      }
      .mobile-view {
        display: none;
      }
    }
  `}</style>
      </div>





      <Banner banners={banners} />
    </>
  )
}

Swap.Layout = SwapLayout('swap-page')
export default Swap
