/* eslint-disable @next/next/no-img-element */
// import { XIcon } from '@heroicons/react/solid'
// import Typography from 'app/components/Typography'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { ZERO } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Container from 'app/components/Container'
import { ProphetStaking } from 'app/components/ProphetStaking'
import QuestionHelper from 'app/components/QuestionHelper'
import { SelectedOracles } from 'app/components/SelectedOracles'
import { NEXUS } from 'app/config/tokens'
import { Feature } from 'app/enums'
import { classNames } from 'app/functions'
import NetworkGuard from 'app/guards/Network'
import useOracleDistributor, {
  useOracleDistributorCovertAmount,
  useOracleDistributorEnableCheck,
} from 'app/hooks/useOracleDistributor'
import {
  useCheckPossibleDistribute,
  useProStakingDistributeAction,
  useProStakingInfo,
  useTotalDistributedReward,
} from 'app/hooks/useProstaking'
import { useActiveWeb3React } from 'app/services/web3'
import {
  useDexWarningOpen,
  useProStakingWarningOpen,
  useToggleProStakingWarning,
  useWalletModalToggle,
} from 'app/state/application/hooks'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'app/modals/TransactionConfirmationModal'
import { useTokenBalance } from 'app/state/wallet/hooks'
import Head from 'next/head'
import React, { useState, useEffect, useCallback } from 'react'

import NexusDiff from '../../../public/NEXUS2.png'
import OracleDistributor from './OracleDistributor'
import { swapPairs } from 'app/constants/farmlist'
import { useTransactionAdder } from 'app/state/transactions/hooks'
// @ts-ignore: Unreachable code error
// eslint-disable-next-line simple-import-sort/imports
import { Arwes, Logo, List, Link, ThemeProvider, Heading, Paragraph, Frame, createTheme, SoundsProvider, createSounds, withSounds, Project, Words } from 'arwes';
import { lowerCase } from 'lodash'
import PuffLoader from 'public/svg-loaders/puff.svg';

const AnimatedContent = ({ show, children }: { show: boolean; children: React.ReactNode }) => {
  return show ? <>{children}</> : null;
};


const INPUT_CHAR_LIMIT = 18

const tabStyle = 'flex justify-center items-center h-full w-full rounded-lg cursor-pointer text-sm md:text-base'
const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-dark-900`
const inactiveTabStyle = `${tabStyle} text-secondary`

const buttonStyle =
  'flex justify-center items-center w-full h-14 rounded font-bold md:font-medium md:text-lg mt-5 text-sm focus:outline-none focus:ring'
const buttonStyleEnabled = `${buttonStyle} text-high-emphesis bg-gradient-to-r from-pink-red to-light-brown hover:opacity-90`
const buttonStyleInsufficientFunds = `${buttonStyleEnabled} opacity-60`
const buttonStyleDisabled = `${buttonStyle} text-secondary bg-dark-700`
const buttonStyleConnectWallet = `${buttonStyle} text-high-emphesis bg-blue hover:bg-opacity-90`
const sendTx = async (txFunc: () => Promise<any>): Promise<boolean> => {
  let success = true
  try {
    const ret = await txFunc()
    if (ret?.error) {
      success = false
    }
  } catch (e) {
    console.error(e)
    success = false
  }
  return success
}

const ProStaking = () => {
  const { totalProAmount, totalxOracleAmount, totalPoolSize, totalNFTCount } = useProStakingInfo()

  const distributedReward = useTotalDistributedReward()

  const showUseDexWarning = useDexWarningOpen()

  // const showWarning = useProStakingWarningOpen()

  // const toggleWarning = useToggleProStakingWarning()

  const { distribute } = useProStakingDistributeAction()
  const addTransaction = useTransactionAdder()

  const possibleDistribute = useCheckPossibleDistribute()

  const [pendingTx, setPendingTx] = useState(false)
  const [txHash, setTxHash] = useState<string>('')
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [selectPro, setSelectPro] = useState(false);
  const [selectCon, setSelectCon] = useState(false);
  const { account, chainId } = useActiveWeb3React()
  const chain = chainId == 50 ? "50" : chainId == 1440002 ? "1440002" : "51"

  const onProDistribute = async () => {
    setPendingTx(true)
    setShowConfirm(true);
    setSelectPro(true);
    try {
      const tx = await distribute()
      setTxHash(tx.hash);
      addTransaction(tx, { summary: 'Distribute To MultiStaking' })
    } catch (error) {
      setShowConfirm(false)
      console.log(error)
    }
    setPendingTx(false)
    setSelectPro(false);
  }

  const oracleBalance = useTokenBalance(account ?? undefined, NEXUS[chain])
  const enabled = useOracleDistributorEnableCheck()
  const [foundry, treasury, burned, multiStaking, total] = useOracleDistributorCovertAmount()

  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()
  const { convert } = useOracleDistributor()

  const lpConvertClick = async () => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setPendingTx(true)
      setShowConfirm(true);
      setSelectCon(true);
      try {
        const tx = await convert();
        setTxHash(tx.hash);
        addTransaction(tx, { summary: 'Convert LPs To NEXUS' })
      } catch (error) {
        setShowConfirm(false)
        console.log(error)
      }
      setPendingTx(false)
      setSelectCon(false);
    }
  }

  const getTokensOfPair = (nlpAddress: string) => swapPairs[chain].find(item => item.id.toLocaleLowerCase() === nlpAddress.toLocaleLowerCase())

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
  }, [txHash])

  useEffect(() => {
    if (!txHash) return;
    setPendingTx(false);
  }, [txHash])
  if (showConfirm) return (
    <>
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={pendingTx}
        hash={txHash}
        content={
          <ConfirmationModalContent
            title={i18n._(t`You will receive`)}
            onDismiss={handleDismissConfirmation}
            topContent={null}
            bottomContent={null}
          />
        }
        pendingText={"Harnessing..."}
      />
    </>
  )
  else return (
    <Container id="staking-page" className="py-4 md:py-8 lg:py-12" maxWidth="5xl">
      <Head>
        <title key="title">NEXUS Swap | Staking</title>
        <meta key="description" name="description" content="ProStaking" />
        <meta key="twitter:url" name="twitter:url" content="https://dex.thenexusportal.io/stake" />
        <meta key="twitter:title" name="twitter:title" content="STAKE NEXUS" />
        <meta key="twitter:description" name="twitter:description" content="ProStaking" />
        {/* <meta key="twitter:image" name="twitter:image" content="https://app.sushi.com/images/xsushi-sign.png" /> */}
        <meta key="og:title" property="og:title" content="STAKE NEXUS" />
        {/* <meta key="og:url" property="og:url" content="https://app.sushi.com/stake" /> */}
        {/* <meta key="og:image" property="og:image" content="https://app.sushi.com/images/xsushi-sign.png" /> */}
        <meta key="og:description" property="og:description" content="ProStaking" />
      </Head>
      {/* {showWarning && (
        <div className="py-2 px-4 text-[1rem] text-high-emphesis bg-[#eb4326] relative">
          <div className="absolute right-1 top-1">
            <div
              className="flex items-center justify-center w-6 h-6 cursor-pointer hover:text-white"
              onClick={toggleWarning}
            >
              <XIcon width={24} height={24} className="text-high-emphesis" />
            </div>
          </div>
          <Typography variant="xs" weight={700} className="py-0 px-4 text-[1rem] text-high-emphesis bg-[#eb4326]">
            {`WARNING: THIS FEATURE IS STILL IN THE EXPERIMENTAL/TESTING STAGE. IT IS NOT RECOMMENDED TO STAKE MORE THAN 3% OF YOUR HOLDINGS! 
USE AT YOUR OWN RISK!`}
          </Typography>
        </div>
      )} */}

      <div className="flex flex-col w-full min-h-full">
        <div className={classNames('', showUseDexWarning && 'mt-5')}>
          <div style={{ padding: 20 }}>
            <Project animate header="🌌Nexus Core NEXU + NFT Multi-Staking🛸">
              {(anim: { entered: boolean }) => (
                <AnimatedContent show={anim.entered}>
                  <div className="mb-4 text-sm font-normal content md:text-base">
                    <p>
                      Stake NEXU & THE NEXUS NFTs simultaneously or independently to harvest the rewards generated by the Nexus Factory, Nexus Diffuser & Nexus Generator.
                      This multi-staking system is capable of distributing a variety of tokens and token pairs. Some tokens are NEXU, Nexus NLPs, SuperFarm deposit fees and more.
                      Examples of some NLPs may be NEXU/WBTC, NEXU/USDT, and all other pairs that are not assigned to burn NEXU in the Diffuser.
                    </p>
                    <br />
                    <p>
                      10% of the rewards per block are automatically distributed to the Nexus Core Multi-Staking System anytime someone interacts with the Nexus Generator system.
                    </p>
                    <Link href="https://docs.thenexusportal.io/guide/nexus-core-multi-staking" target="_blank" rel="noreferrer">
                      <span className="text-lg font-bold md:text-xl text-green">
                        LEARN MORE
                      </span>
                    </Link>
                  </div>
                </AnimatedContent>
              )}
            </Project>
            <br />
            <Project animate header="Parameters📜">
              {(anim: { entered: boolean }) => (
                <AnimatedContent show={anim.entered}>
                  <div className="mb-4 text-sm font-normal content md:text-base">
                    <List node="ul" bullet="•">
                      <li>
                        Stake just NEXU with or without a time-lock. The time-lock multiplies your NEXU Power giving you a larger share of the pool.
                      </li>
                      <li>
                        Stake just NEXUS NFTs, without a time-lock. For the NFT weight to receive the power of the time-lock multiplier you must stake the minimum amount of NEXU one time and you must also stake the minimum NEXU amount per NFT.
                      </li>
                      <li>
                        Consequences for breaking the spacetime barrier: Forfeit 50% of your locked NEXU. Half of this NEXU gets sent to the void.
                        Half goes back to the Loyal Stakers.
                      </li>
                      <li>
                        If you are not yet wise, it is recommended to experiment with the system using negligible amounts of tokens before going all in.
                      </li>
                      <li>
                        Your Pool Share percentage will change as other Nexus travelers move in and out of the pool.
                      </li>
                    </List>
                  </div>
                </AnimatedContent>
              )}
            </Project>
          </div>

          <div className="flex flex-wrap gap-4 top-area">
            <div className="w-full md:w-[300px]  md:mt-0">
              <Frame animate={true}
                level={3}
                corners={4}
                layer='primary'>
                <div className="flex flex-col gap-3 p-2 md:p-4 pt-4 rounded-[16px]  bg-opacity-25 shadow-md ">
                  <div className="flex flex-col flex-grow w-full rounded">
                    <div className="flex flex-col flex-wrap">
                      <div className="relative">
                        <div className="flex flex-col items-center mb-4">
                          <div className="relative">
                            <div className="flex flex-col items-center mb-4">
                              <div className="relative">
                                <img
                                  src="/svg-loaders/puff.svg"
                                  alt="Loader"
                                  className="absolute top-0 left-0 w-full h-full z-0"
                                />
                                <img
                                  src={NexusDiff.src}
                                  alt="Nexus sign"
                                  className="w-[180px] h-[180px] relative z-10"
                                />
                                {/* <div className="absolute bottom-4 right-4 transform translate-x-0 translate-y-0">
                                  <Logo animate size={150} />
                                </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row mb-3">
                        <div className="self-end text-lg font-bold md:text-xl text-high-emphesis md:mb-1">

                          Nexus Diffuser
                        </div>

                        <QuestionHelper
                          className="!bg-dark-800 !shadow-xl p-2"
                          text={`BE AWARE OF GAS SPENDING WHEN CALLING DIFFUSE! The Nexus Diffuser receives DEX swap fees (NLPs) and Atomically splits them. A portion of the fees are used to buy and burn NEXU, the rest of the NLPs are distributed to the Nexus Core Multi-Staking.`}
                        />
                      </div>

                      <div className="flex flex-col flex-grow text-base md:mb-3">
                        <p>
                          <span>&#128512;</span> NLP Available:{' '}
                          <span className={classNames(enabled ? 'text-green' : 'text-red')}>
                            {enabled ? 'Yes' : 'No'}
                          </span>
                        </p>
                        <p>
                          <span>&#128293; </span> NEXU Burned: <span>{burned?.toSignificant(6)}</span>
                          {/* &#127835; */}
                        </p>
                        <p>
                          <span>&#127789;</span> NEXU MultiStaking: <span>{multiStaking?.toSignificant(6)}</span>
                        </p>
                        <p>
                          <span>&#127974;</span> NEXU Treasury: <span>{treasury?.toSignificant(6)}</span>
                        </p>

                        {oracleBalance?.equalTo(ZERO) && (
                          <div className="mt-2 text-base text-red">{`Your NEXU balance is zero, so you cannot dist/burn nlp`}</div>
                        )}

                        <div className="flex justify-center mt-4">
                          <Button
                            color={'gradient'}
                            size={'sm'}
                            variant={'filled'}
                            loading={pendingTx && selectCon}
                            disabled={!!(pendingTx || !account || !enabled || oracleBalance?.equalTo(ZERO))}
                            onClick={() => lpConvertClick()}
                            className="inline-flex items-center px-8 font-bold text-white rounded-full cursor-pointer bg-gradient-to-r from-blue to-green"
                          >
                            {`DIFFUSE`}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Frame>
            </div>
            <Frame animate={true}
              level={3}
              corners={4}
              layer='primary'
              className="flex flex-1 w-full"
            >
              <div className=" flex-1 flex gap-3 p-2 md:p-4 pt-4 rounded-[16px]  bg-opacity-25 shadow-md">
                <div className="w-full sm:w-1/2 md:pt-10">
                  <div className="self-end text-lg font-bold md:text-xl text-high-emphesis md:mb-1">
                    {i18n._(t`Global Stats🌎`)}
                  </div>

                  <p>{`Current Global Pool Size:  ${totalPoolSize ? totalPoolSize.toSignificant(6) : ''}`}</p>
                  <p>{`Total NEXU Locked:  ${totalProAmount ? totalProAmount.toSignificant(6) : ''}`}</p>
                  <p>{`Total NEXU NFTs Locked:  ${totalNFTCount ? totalNFTCount : ''}`}</p>
                  <p>{`Total NEXU Collateral Locked:  ${totalxOracleAmount ? totalxOracleAmount.toSignificant(6) : ''
                    }`}</p>

                  <Button
                    size="sm"
                    className="mt-3"
                    color={'gradient'}
                    loading={pendingTx && selectPro}
                    onClick={() => onProDistribute()}
                    disabled={(pendingTx || !possibleDistribute) && selectPro}
                  >
                    {`Distribute`}
                  </Button>
                  <OracleDistributor />
                  <br />
                  <br />
                  <br />
                  <br />
                </div>

                <div className="w-full mt-5 sm:w-1/2 sm:mt-0 md:pt-10">
                  <div className="self-end text-lg font-bold md:text-xl text-high-emphesis md:mb-1">
                    {i18n._(t`Distributed`)}
                  </div>

                  {distributedReward.map((item, index) => {
                    if (item.token.symbol === "NLP") {
                      const pair = getTokensOfPair(item.token.address);
                      return <p key={`rewardinfo-${index}`}>{`${pair?.token0.symbol}/${pair?.token1.symbol}: ${item.amount ? item.amount.toSignificant(6) : ''
                        }`}</p>;
                    }
                    return <p key={`rewardinfo-${index}`}>{`${item.token.symbol}: ${item.amount ? item.amount.toSignificant(6) : ''
                      }`}</p>
                  })}
                </div>
              </div>
            </Frame>
          </div>

          <ProphetStaking totalPoolSize={totalPoolSize} />
          <SelectedOracles />
        </div>
      </div>
    </Container>
  )
}
ProStaking.Guard = NetworkGuard(Feature.VESTING)
export default ProStaking
