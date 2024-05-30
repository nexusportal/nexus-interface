import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
// import Button from 'app/components/Button'
import ExternalLink from 'app/components/ExternalLink'
// import QuestionHelper from 'app/components/QuestionHelper'
import Search from 'app/components/Search'
import Typography from 'app/components/Typography'
import { NEXUS } from 'app/config/tokens'
// import { PROPHET_SACRIFICE_ADDRESS } from 'app/constants'
import { Chef, PairType } from 'app/features/onsen/enum'
import FarmList from 'app/features/onsen/FarmList'
import { classNames } from 'app/functions'
// import OnsenFilter from 'app/features/onsen/FarmMenu'
import useFarmRewards from 'app/hooks/useFarmRewards'
import useFuse from 'app/hooks/useFuse'
import { useOracleDistributorCovertAmount } from 'app/hooks/useOracleDistributor'
// import useProphetSacrifice, { useProphetSacrificeAmount } from 'app/hooks/useProphetSacrifice'
import { TridentBody } from 'app/layouts/Trident'
import { useActiveWeb3React } from 'app/services/web3'
import { useDexWarningOpen, useWalletModalToggle } from 'app/state/application/hooks'
import { useTokenBalance } from 'app/state/wallet/hooks'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMasterChefRewardReduction } from 'app/hooks/useFarmRewards'
import React, { useState } from 'react'
import { ThemeProvider, Loading, Project, Words, Heading, Paragraph, Frame, createTheme, SoundsProvider, createSounds, Link, withSounds } from 'arwes';
import useCurrentBlock from "app/hooks/useCurrentBlock"

const AnimatedContent = ({ show, children }: { show: boolean; children: React.ReactNode }) => {
  return show ? <>{children}</> : null;
};

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

export default function Farm(): JSX.Element {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  const currentBlock = useCurrentBlock();

  const router = useRouter()
  const type = router.query.filter === null ? 'all' : (router.query.filter as string)

  const FILTER = {
    // @ts-ignore TYPE NEEDS FIXING
    all: (farm) => farm.allocPoint !== '0' && farm.chef !== Chef.OLD_FARMS,
    // @ts-ignore TYPE NEEDS FIXING
    portfolio: (farm) => farm?.amount && farm.amount > 0,
    // @ts-ignore TYPE NEEDS FIXING
    sushi: (farm) => farm.pair.type === PairType.SWAP && farm.allocPoint !== '0',
    // @ts-ignore TYPE NEEDS FIXING
    kashi: (farm) => farm.pair.type === PairType.KASHI && farm.allocPoint !== '0',
    // @ts-ignore TYPE NEEDS FIXING
    '2x': (farm) =>
      (farm.chef === Chef.MASTERCHEF_V2 || farm.chef === Chef.MINICHEF) &&
      farm.rewards.length > 1 &&
      farm.allocPoint !== '0',
    // @ts-ignore TYPE NEEDS FIXING
    old: (farm) => farm.chef === Chef.OLD_FARMS,
  }

  const rewards = useFarmRewards()
  // const rewards: any[] = [];

  const { reducitonRate, period, nextReductionBlock, rewardPerblock } = useMasterChefRewardReduction();

  const data = rewards.filter((farm) => {
    // @ts-ignore TYPE NEEDS FIXING
    return type in FILTER ? FILTER[type](farm) : true
  })

  const options = {
    keys: ['pair.id', 'pair.token0.symbol', 'pair.token1.symbol'],
    threshold: 0.4,
  }

  const { result, term, search } = useFuse({
    data,
    options,
  })

  const showUseDexWarning = useDexWarningOpen()

  const [pendingTx, setPendingTx] = useState(false)

  const { account } = useActiveWeb3React()

  // const oracleBalance = useTokenBalance(account ?? undefined, NEXUS)

  // const sacrificeOracle = useTokenBalance(PROPHET_SACRIFICE_ADDRESS ?? undefined, NEXUS)

  // const enabled = sacrificeOracle ? sacrificeOracle.greaterThan(ZERO) : false

  // const { burnPro } = useProphetSacrifice()

  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()

  // const burnProClick = async () => {
  //   if (!walletConnected) {
  //     toggleWalletModal()
  //   } else {
  //     setPendingTx(true)

  //     const success = await sendTx(() => burnPro())
  //     if (!success) {
  //       setPendingTx(false)
  //       return
  //     }

  //     setPendingTx(false)
  //   }
  // }

  const [foundry, treasury, burned, prophet, total] = useOracleDistributorCovertAmount()

  // const [burnAmount, stakerAmount] = useProphetSacrificeAmount()

  const [isAllFarms, setIsAllFarms] = useState(false);


  const toggleFarms = () => {
    setIsAllFarms(!isAllFarms);
    const newPath = isAllFarms ? '/farm' : '/farm?filter=portfolio';
    router.push(newPath);
  };

  return (
    <>
      <Head>
        <title>NEXUS Swap | Farm</title>
        <meta key="description" name="description" content="NEXUSSwap AMM" />
        <meta key="twitter:description" name="twitter:description" content="NEXUSSwap AMM" />
        <meta key="og:description" property="og:description" content="NEXUSSwap AMM" />
      </Head>

      {/* <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`Onsen Menu`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Earn fees and rewards by depositing and staking your tokens to the platform.`)}
          </Typography>
        </div>
        <div className="flex gap-3">
          <Button id="btn-create-new-pool" size="sm">
            <a
              href="https://docs.google.com/document/d/19bL55ZTjKtxlom2CpVo6K8jL1e-OZ13y6y9AQgw_qT4"
              target="_blank"
              rel="noreferrer"
            >
              {i18n._(t`Apply for Onsen`)}
            </a>
          </Button>
        </div>
      </TridentHeader> */}
      <TridentBody>
        <div className={classNames('flex flex-col w-full gap-6', showUseDexWarning && 'mt-5')}>
          {/* <div className="flex items-center justify-center">
            <div
              className={classNames('flex flex-col flex-wrap p-4 rounded bg-dark-900', !showUseDexWarning && 'mt-3')}
            >
              <div className="flex flex-row justify-center mb-3">
                <img src={LogoImage.src} width={40} height={40} className="mr-5" alt="Logo" />
                <img src={PROLOGO.src} width={40} height={40} alt="Logo" />
              </div>

              <div className="flex flex-row mb-3">
                <p className="text-lg font-bold md:text-2xl md:font-medium text-high-emphesis">
                  {i18n._(t`Prophet Sacrifice`)}
                </p>

                <QuestionHelper
                  className="!bg-dark-800 !shadow-xl p-2"
                  text={`The Prophet Sacrifice receives NEXUS from the Oracle Distributor and sacrifices it to buy and burn PRO. Some of the PRO could be distributed to stakers.`}
                />
              </div>

              <div className="flex flex-col flex-grow text-base md:mb-3">
                <p>
                  <span>&#128293;</span> Oracle Sacrificed: <span>{prophet?.toSignificant(6)}</span>
                </p>
                <p>
                  <span>&#128293;</span> PRO Burned: <span>{burnAmount?.toSignificant(6)}</span>
                </p>

                <p>
                  <span>&#128512;</span> NEXUS Available:{' '}
                  <span className={classNames(enabled ? 'text-green' : 'text-red')}>{enabled ? 'Yes' : 'No'}</span>
                </p>

                {oracleBalance?.equalTo(ZERO) && (
                  <div className="mt-2 text-base text-red">{`Your oracle balance is zero, so you cannot dist/burn olp`}</div>
                )}

                <div className="flex justify-center mt-4">
                  <Button
                    color={'gradient'}
                    size={'sm'}
                    variant={'filled'}
                    disabled={pendingTx || !account || !enabled || oracleBalance?.equalTo(ZERO)}
                    onClick={burnProClick}
                    className="inline-flex items-center px-8 font-bold text-white rounded-full cursor-pointer bg-gradient-to-r from-yellow to-red"
                  >
                    {`DIST/BURN`}
                  </Button>
                </div>
              </div>
            </div>
          </div> */}

          <Project animate header="🌟The Nexus Generator⚡">
            {(anim: { entered: boolean }) => (
              <AnimatedContent show={anim.entered}>
                <div className="mb-4 text-sm font-normal content md:text-base">
                  <p>
                    The Nexus Generator superfarm mints and distributes NEXU proportionally to Liquidity Providers each block.
                    The Nexus Generator also acts as an ecosystem superfarm that can distribute multi-rewards to LP Tokens or single side Token stakes.
                    10% of the block rewards are channeled to the Nexus Core Multi-Staking System.
                  </p>
                  <br />
                  <p>
                    The Rewards column shows which pairs receive NEXU as well as SuperFarm rewards. The rewards are proportionally distributed to NLP Stakers of that pair each day.
                    The more NLPs you stake the more of the daily NEXU reward you will get.
                  </p>
                  <Link href="https://docs.thenexusportal.io/guide/nexus-generator/superfarm-request" target="_blank" rel="noreferrer">
                    <span className="text-lg font-bold md:text-xl text-green">
                      Request An Ecosystem Superfarm
                    </span>
                  </Link>
                  <br />


                </div>
              </AnimatedContent>
            )}
          </Project>

          <Frame animate={true}
            corners={3}
            className="w-full"
            layer='primary'
          >
            <div className='w-full sm:w-auto bg-transparent'>
              <Frame className='!p-0 !pb-1'>
                <div className="flex items-center justify-start gap-10 px-10">
                  <Loading animate />
                  <Heading className="!m-0">
                    NEXUS CYCLES
                  </Heading>
                </div>

              </Frame>
              <div className="bg-transparent py-4 px-4 w-full sm:w-auto">
                <div className="mb-4 text-sm font-normal content md:text-base">
                  <p>
                    The supply generation of NEXU decreases every day by a small percentage of {(100 - reducitonRate).toFixed(4)}%. NEXU distribution parameters can change pending Governance vote.
                  </p>
                </div>
                <div className="mb-4 text-sm font-normal content md:text-base">
                  <p>Reduction Rate: <span className='font-bold text-green'>{(100 - reducitonRate).toFixed(4)}%</span></p>
                  <p>Reduction Period: <span className='font-bold text-green'>{period}</span></p>
                  <p>Current NEXU Per Block: <span className='font-bold text-green'>{rewardPerblock.toFixed(4)}</span></p>
                  <p>Next NEXU Reduction Block: <span className='font-bold text-green'>{period > 0 ? (nextReductionBlock + (Math.floor((period + currentBlock - nextReductionBlock) / period) * period)) : nextReductionBlock}</span></p>
                </div>
                <div className="w-full h-5 bg-gray-900 ">
                  <div className="bg-green h-5 max-w-[100%] opacity-70"
                    style={{
                      width: `${(period > 0 ? (
                        ((currentBlock - nextReductionBlock - Math.floor((currentBlock - nextReductionBlock) / period) * period) * 100) / period
                      ) : 0).toFixed(0)}%`,
                    }}>
                  </div>
                </div>
              </div>
            </div>
          </Frame>

          <Frame animate={true} corners={3} className="w-full" layer='alert'>
            <div className='w-full bg-transparent'>
              <div className="bg-transparent py-4 px-4 w-full">
                <div className="mb-4 text-sm font-normal content md:text-base">
                  <p>
                    Nexus token generation is currently offline. Nexus generation will likely start at 1 NEXU per block soon after the airdrop!
                  </p>
                  <p>
                    XINU rewards are active for testing at 1 XINU per block, but they will be ramped up soon! See the below coming rewards settings.
                  </p>
                  <p>
                    <ul>
                      <li>100B to WXDC/XINU at 1000 XINU per block. 30B per year.</li>
                      <li>30B to WXDC/NEXU at 300 XINU per block. 9B per year.</li>
                      <li>20B to XINU single at 200 XINU per block. 6B per year.</li>
                      <li>10B to NEXU single at 100 XINU per block. 3B per year.</li>
                      <li>10B to WXDC single at 100 XINU per block. 3B per year.</li>
                      <li>10B to FXD single at 100 XINU per block. 3B per year.</li>
                    </ul>
                  </p>


                </div>
              </div>
            </div>
          </Frame>

          <div className="flex flex-row justify-between items-center w-full space-x-1">
            {/* Frame (Button) */}
            <Frame
              animate={true}
              level={3}
              corners={4}
              layer='success'
              onClick={toggleFarms}
              className="py-1 text-center bg-transparent cursor-pointer"
              style={{ flex: 1, maxWidth: '175px', height: '32px' }}
            >
              <div className="px-3 hover:bg-green-500/50" style={{ transition: 'background-color 0.3s ease' }}>
                <span>{isAllFarms ? 'All Farms' : 'Your Farms'}</span>
              </div>
            </Frame>

            {/* Search Component */}
            <div style={{ flex: 1, maxWidth: 'calc(100% - 210px)' }}>
              <Search search={search} term={term} />
            </div>
          </div>



          <FarmList farms={result} term={term} />
        </div>
      </TridentBody>
    </>
  )
}
