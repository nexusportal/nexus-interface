import { ChainId, Currency, JSBI, NATIVE, Token, MASTERCHEF_ADDRESS } from '@sushiswap/core-sdk'
import { ARBITRUM_TOKENS, MATIC_TOKENS, NEXUS, XDAI_TOKENS, USDT, USDC, DAI } from 'app/config/tokens'
import { Chef, PairType } from 'app/features/onsen/enum'
import { useProphetPoolInfos, useRewardTokens, useUserInfo } from 'app/features/onsen/hooks'
import { aprToApy } from 'app/functions/convert'
import {
  useAverageBlockTime,
  useCeloPrice,
  useEthPrice,
  useFantomPrice,
  useFusePrice,
  useGnoPrice,
  useMagicPrice,
  useMaticPrice,
  useMovrPrice,
  useOhmPrice,
  useOneDayBlock,
  useOnePrice,
  useSpellPrice,
  useSushiPrice,
  useSushiPairs,
  useFarms,
} from 'app/services/graph'
import { useActiveWeb3React } from 'app/services/web3'
import { useSingleCallResult, useSingleContractMultipleData } from 'app/state/multicall/hooks'
import { useTokenBalances } from 'app/state/wallet/hooks'
import { useMemo } from 'react'
import { farms, swapPairs } from 'app/constants/farmlist'
import { getAddress } from 'app/functions'

import { useMasterChefContract, useMulticall2Contract } from '.'
import { getChainIdString } from 'app/config/wallets'

export function useMasterChefRewardReduction() {
  const contract = useMasterChefContract(false)

  const info = useSingleCallResult(contract, 'nextReductionBlock')?.result
  const reductionRateInfo = useSingleCallResult(contract, 'REDUCTION_RATE')?.result
  const periodInfo = useSingleCallResult(contract, 'REDUCTION_PERIOD')?.result
  const nexusPerBlockInfo = useSingleCallResult(contract, 'nexusPerBlock')?.result

  const value = info?.[0]
  const reducitonRateValue = reductionRateInfo?.[0];
  const periodInfoValue = periodInfo?.[0];
  const nexusPerBlockValue = nexusPerBlockInfo?.[0]

  const amount1 = value ? JSBI.BigInt(value.toString()) : undefined
  const amount2 = reducitonRateValue ? JSBI.BigInt(reducitonRateValue.toString()) : undefined
  const amount3 = periodInfoValue ? JSBI.BigInt(periodInfoValue.toString()) : undefined
  const amount4 = nexusPerBlockValue ? JSBI.BigInt(nexusPerBlockValue.toString()) : undefined


  const nextReductionBlock = useMemo(() => {
    if (amount1) {
      return JSBI.toNumber(amount1)
    }
    return 0
  }, [amount1])

  const reducitonRate = useMemo(() => {
    if (amount2) {
      return JSBI.toNumber(amount2) / 1e4
    }
    return 0
  }, [amount2])
  const period = useMemo(() => {
    if (amount3) {
      return JSBI.toNumber(amount3)
    }
    return 0
  }, [amount3])

  const rewardPerblock =  useMemo(() => {
    if (amount4) {
      const rewardPerblock = JSBI.toNumber(amount4) / 1e18
      return rewardPerblock
    }
    return 0
  }, [amount4])

  return {
    nextReductionBlock,
    reducitonRate,
    period,
    rewardPerblock
  }
}

export function useMasterChefTotalAllocPoint() {
  const contract = useMasterChefContract(false)

  const info = useSingleCallResult(contract, 'totalAllocPoint')?.result

  const value = info?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return useMemo(() => {
    if (amount) {
      const totalAllocPoint = JSBI.toNumber(amount)
      return totalAllocPoint
    }
    return 0
  }, [amount])
}
export function useMasterChefAllFarms() {
  const contract = useMasterChefContract(false)

  const farmLengthBig = useSingleCallResult(contract, 'poolLength')?.result?.[0]
  const amount = farmLengthBig ? JSBI.BigInt(farmLengthBig.toString()) : undefined
  const farmLength = useMemo(() => {
    if (amount) {
      return JSBI.toNumber(amount)
    }
    return 0
  }, [amount])

  const args = useMemo(() => {
    if (farmLength < 1) return [];
    const argsArr = Array.from({ length: farmLength }, (_, index) => [`${index}`]);
    return argsArr;
  }, [farmLength])
  // @ts-ignore TYPE NEEDS FIXING
  const res = useSingleContractMultipleData(contract, "poolInfo", args)

  return useMemo(() => {
    if (args && args.length > 0 && res.length > 0) {
      if (!res.every(ele => ele.result !== undefined)) return []
      return res.map((ele, index) => {
        return {
          accSushiPerShare: '',
          allocPoint: 15,
          balance: 0,
          chef: 0,
          id: index.toString(),
          lastRewardTime: 0,
          owner: {
            id: '0x58Bd25E8A922550Df320815575B632B011b7F2B8',
            totalAllocPoint: 100,
          },
          pair: ele?.result?.[0],
          slpBalance: 0,
          userCount: '1',
        }
      }).filter((item, pos, ary) => !pos || item.pair !== ary[pos - 1].pair);
    }
    return []
  }, [args, res])
}

export default function useFarmRewards() {
  const { account, chainId: activeChainId } = useActiveWeb3React();

  let chainId = activeChainId;

  if (!account) {
    chainId = 50;
  }

  // @ts-ignore TYPE NEEDS FIXING
  // const positions = usePositions(chainId)

  // console.log({ positions })

  const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })

  // @ts-ignore TYPE NEEDS FIXING
  // const farms = useFarms({ chainId })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chain = getChainIdString(chainId);

  // const farmsList = useMasterChefAllFarms()
  const { poolInfos } = useProphetPoolInfos()

  const liquidityTokens = useMemo(() => {
    // if (!farmsList || farmsList.length < 1) return []
    return farms[chain].map((farm: any) => {
      // console.log(farm, getAddress(farm.pair))
      const token = new Token(parseInt(chain), getAddress(farm.pair), 18, 'NLP', 'NEXUS LP Token')
      return token;
    })
    // return []
  }, [farms[chain]])
  // const farmAddresses = useMemo(() => poolInfos.map((farm: any) => farm.lpToken), [poolInfos])

  const stakedBalaces = useTokenBalances(chainId ? MASTERCHEF_ADDRESS[chainId] : undefined, liquidityTokens)

  // const swapPairs = useSushiPairs({
  //   chainId,
  //   variables: {
  //     where: {
  //       id_in: farmAddresses.map((item: any) => {return item; }),
  //     },
  //   },
  //   shouldFetch: !!farmAddresses,
  // })

  // const swapPairs1d = useSushiPairs({
  //   chainId,
  //   variables: {
  //     block: block1d,
  //     where: {
  //       id_in: farmAddresses.map(toLower),
  //     },
  //   },
  //   shouldFetch: !!block1d && !!farmAddresses,
  // })

  // const kashiPairs = useKashiPairs({
  //   chainId,
  //   variables: { where: { id_in: farmAddresses.map(toLower) } },
  //   shouldFetch: !!farmAddresses,
  // })

  const averageBlockTime = useAverageBlockTime({ chainId })

  const masterChefV1TotalAllocPoint = useMasterChefTotalAllocPoint() //useMasterChefV1TotalAllocPoint()
  const { rewardPerblock: masterChefV1SushiPerBlock } = useMasterChefRewardReduction() // useMasterChefV1SushiPerBlock()

  const [
    sushiPrice,
    ethPrice,
    maticPrice,
    gnoPrice,
    onePrice,
    spellPrice,
    celoPrice,
    fantomPrice,
    movrPrice,
    ohmPrice,
    fusePrice,
    magicPrice,
  ] = [
      useSushiPrice(),
      useEthPrice(),
      useMaticPrice(),
      useGnoPrice(),
      useOnePrice(),
      useSpellPrice(),
      useCeloPrice(),
      useFantomPrice(),
      useMovrPrice(),
      useOhmPrice(),
      useFusePrice(),
      useMagicPrice(),
    ]

  const prolPrice = 0

  const blocksPerDay = 86400 / Number(averageBlockTime)

  // @ts-ignore TYPE NEEDS FIXING

  const map = (pool) => {
    // TODO: Deal with inconsistencies between properties on subgraph
    pool.owner = pool?.owner || pool?.masterChef || pool?.miniChef
    pool.balance = pool?.balance || pool?.slpBalance
    const liquidityToken = new Token(parseInt(chain), getAddress(pool.pair), 18, 'NLP', "NEXUS LP Token")
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const stakedAmount = useUserInfo(pool, liquidityToken);

    // @ts-ignore TYPE NEEDS FIXING
    const rewardTokensOfPool = useRewardTokens(pool);

    const amount = parseFloat(stakedAmount ? stakedAmount?.toSignificant(10) : '0')

    // // @ts-ignore TYPE NEEDS FIXING
    const swapPair = swapPairs[chain]?.find((pair: any) => pair.id.toLowerCase() === pool.pair.toLowerCase())
    // // @ts-ignore TYPE NEEDS FIXING
    // const swapPair1d = swapPairs1d?.find((pair) => pair.id === pool.pair)
    // // @ts-ignore TYPE NEEDS FIXING
    // const kashiPair = kashiPairs?.find((pair) => pair.id === pool.pair)

    const pair = swapPair // || kashiPair

    const type = swapPair?.type ? swapPair.type : PairType.SWAP // swapPair ? PairType.SWAP : PairType.KASHI

    const blocksPerHour = 3600 / averageBlockTime

    function getRewards() {
      // TODO: Some subgraphs give sushiPerBlock & sushiPerSecond, and mcv2 gives nothing
      const sushiPerBlock =
        pool?.owner?.sushiPerBlock / 1e18 ||
        (pool?.owner?.sushiPerSecond / 1e18) * averageBlockTime ||
        masterChefV1SushiPerBlock

      pool.owner.totalAllocPoint = masterChefV1TotalAllocPoint

      const allocPoint = poolInfos?.find((poolInfo) => poolInfo.id === pool.id)?.allocPoint ?? 0;

      pool.allocPoint = allocPoint;

      // @ts-ignore TYPE NEEDS FIXING
      const rewardPerBlock = (allocPoint / pool.owner.totalAllocPoint) * sushiPerBlock
      // const defaultReward = {
      //   currency: SUSHI[ChainId.ETHEREUM],
      //   rewardPerBlock,

      //   rewardPerDay: rewardPerBlock * blocksPerDay,
      //   rewardPrice: sushiPrice,
      // }


      const defaultReward = {
        token: 'NEXU',
        icon: '/NEXUS.png',
        rewardPerBlock,
        currency: NEXUS[chain],
        rewardPerDay: rewardPerBlock * blocksPerDay,
        rewardPrice: prolPrice,
        remainAmount: 0,
      }

      let rewards: { currency: Currency; rewardPerBlock: number; rewardPerDay: number; rewardPrice: number }[] = [...[defaultReward], ...rewardTokensOfPool]
      // rewardTokensOfPool.concat()
      if (pool.chef === Chef.MASTERCHEF_V2) {
        // override for mcv2...
        pool.owner.totalAllocPoint = masterChefV1TotalAllocPoint

        // CVX-WETH hardcode 0 rewards since ended, can remove after swapping out rewarder
        if (pool.id === '1') {
          pool.rewarder.rewardPerSecond = 0
        }

        // vestedQUARTZ to QUARTZ adjustments
        if (pool.rewarder.rewardToken === '0x5dd8905aec612529361a35372efd5b127bb182b3') {
          pool.rewarder.rewardToken = '0xba8a621b4a54e61c442f5ec623687e2a942225ef'
          pool.rewardToken.id = '0xba8a621b4a54e61c442f5ec623687e2a942225ef'
          pool.rewardToken.symbol = 'vestedQUARTZ'
          // pool.rewardToken.derivedETH = pair?.token1?.derivedETH
          pool.rewardToken.decimals = 18
        }

        const decimals = 10 ** pool.rewardToken.decimals

        if (pool.rewarder.rewardToken !== '0x0000000000000000000000000000000000000000') {
          const rewardPerBlock =
            pool.rewardToken.symbol === 'ALCX'
              ? pool.rewarder.rewardPerSecond / decimals
              : pool.rewardToken.symbol === 'LDO'
                ? (77160493827160493 / decimals) * averageBlockTime
                : (pool.rewarder.rewardPerSecond / decimals) * averageBlockTime

          const rewardPerDay =
            pool.rewardToken.symbol === 'ALCX'
              ? (pool.rewarder.rewardPerSecond / decimals) * blocksPerDay
              : pool.rewardToken.symbol === 'LDO'
                ? (77160493827160493 / decimals) * averageBlockTime * blocksPerDay
                : (pool.rewarder.rewardPerSecond / decimals) * averageBlockTime * blocksPerDay

          const rewardPrice = pool.rewardToken.derivedETH * ethPrice

          const reward = {
            currency: new Token(
              ChainId.ETHEREUM,
              getAddress(pool.rewardToken.id),
              Number(pool.rewardToken.decimals),
              pool.rewardToken.symbol,
              pool.rewardToken.name
            ),
            rewardPerBlock,
            rewardPerDay,
            rewardPrice,
          }
          rewards[1] = reward
        }
      } else if (pool.chef === Chef.MINICHEF) {
        const sushiPerSecond = ((allocPoint / pool.miniChef.totalAllocPoint) * pool.miniChef.sushiPerSecond) / 1e18
        const sushiPerBlock = sushiPerSecond * averageBlockTime
        const sushiPerDay = sushiPerBlock * blocksPerDay

        const rewardPerSecond =
          pool.rewarder.rewardPerSecond && chainId === ChainId.ARBITRUM
            ? pool.rewarder.rewardPerSecond / 1e18
            : ((allocPoint / pool.miniChef.totalAllocPoint) * pool.rewarder.rewardPerSecond) / 1e18

        const rewardPerBlock = rewardPerSecond * averageBlockTime

        const rewardPerDay = rewardPerBlock * blocksPerDay

        const reward = {
          [ChainId.MATIC]: {
            currency: NATIVE[ChainId.MATIC],
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: maticPrice,
          },
          [ChainId.XDAI]: {
            currency: XDAI_TOKENS.GNO,
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: gnoPrice,
          },
          [ChainId.HARMONY]: {
            currency: NATIVE[ChainId.HARMONY],
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: onePrice,
          },
          [ChainId.CELO]: {
            currency: NATIVE[ChainId.CELO],
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: celoPrice,
          },
          [ChainId.MOONRIVER]: {
            currency: NATIVE[ChainId.MOONRIVER],
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: movrPrice,
          },
          [ChainId.FUSE]: {
            currency: NATIVE[ChainId.FUSE],
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: fusePrice,
          },
          [ChainId.FANTOM]: {
            currency: NATIVE[ChainId.FANTOM],
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: fantomPrice,
          },
        }

        if (chainId === ChainId.FUSE) {
          // Secondary reward only
          rewards[0] = reward[ChainId.FUSE]
        } else {
          // @ts-ignore TYPE NEEDS FIXING
          rewards[0] = {
            ...defaultReward,
            rewardPerBlock: sushiPerBlock,
            rewardPerDay: sushiPerDay,
          }
          // @ts-ignore TYPE NEEDS FIXING
          if (chainId in reward) {
            // @ts-ignore TYPE NEEDS FIXING
            rewards[1] = reward[chainId]
          }
        }

        if (chainId === ChainId.ARBITRUM && ['9', '11'].includes(pool.id)) {
          rewards[1] = {
            currency: ARBITRUM_TOKENS.SPELL,
            rewardPerBlock,
            rewardPerDay,
            rewardPrice: spellPrice,
          }
        }
        if (chainId === ChainId.ARBITRUM && ['12'].includes(pool.id)) {
          rewards[1] = {
            currency: ARBITRUM_TOKENS.gOHM,
            rewardPerBlock,
            rewardPerDay,
            rewardPrice: ohmPrice,
          }
        }
        if (chainId === ChainId.ARBITRUM && ['13'].includes(pool.id)) {
          rewards[1] = {
            currency: ARBITRUM_TOKENS.MAGIC,
            rewardPerBlock,
            rewardPerDay,
            rewardPrice: magicPrice,
          }
        }
        if (chainId === ChainId.MATIC && ['47'].includes(pool.id)) {
          const rewardTokenPerSecond = 0.00000462962963
          const rewardTokenPerBlock = rewardTokenPerSecond * averageBlockTime
          const rewardTokenPerDay = 0.4
          rewards[1] = {
            currency: MATIC_TOKENS.gOHM,
            rewardPerBlock: rewardTokenPerBlock,
            rewardPerDay: rewardTokenPerDay,
            rewardPrice: ohmPrice,
          }
        }
      } else if (pool.chef === Chef.OLD_FARMS) {
        const sushiPerSecond = ((allocPoint / pool.miniChef.totalAllocPoint) * pool.miniChef.sushiPerSecond) / 1e18
        const sushiPerBlock = sushiPerSecond * averageBlockTime
        const sushiPerDay = sushiPerBlock * blocksPerDay

        const rewardPerSecond =
          pool.rewarder.rewardPerSecond && chainId === ChainId.ARBITRUM
            ? pool.rewarder.rewardPerSecond / 1e18
            : ((allocPoint / pool.miniChef.totalAllocPoint) * pool.rewarder.rewardPerSecond) / 1e18

        const rewardPerBlock = rewardPerSecond * averageBlockTime

        const rewardPerDay = rewardPerBlock * blocksPerDay

        const reward = {
          [ChainId.CELO]: {
            currency: NATIVE[ChainId.CELO],
            rewardPerBlock,
            rewardPerDay: rewardPerSecond * 86400,
            rewardPrice: celoPrice,
          },
        }

        // @ts-ignore TYPE NEEDS FIXING
        rewards[0] = {
          ...defaultReward,
          rewardPerBlock: sushiPerBlock,
          rewardPerDay: sushiPerDay,
        }

        // @ts-ignore TYPE NEEDS FIXING
        if (chainId in reward) {
          // @ts-ignore TYPE NEEDS FIXING
          rewards[1] = reward[chainId]
        }
      }

      return rewards
    }

    const rewards = getRewards()

    let balance = Number(pool.balance / 1e18) // swapPair ? Number(pool.balance / 1e18) : pool.balance / 10 ** kashiPair.token0.decimals

    if (stakedBalaces) {
      const stakedBalance = Object.values(stakedBalaces).find(
        (token) => token.currency.address.toLowerCase() === pool.pair.toLowerCase()
      )

      if (stakedBalance) {
        balance = parseFloat(stakedBalance.toExact())
      }
    }

    // const tvl = (balance / Number(pair.totalSupply)) * Number(pair.reserveUSD)
    const totalLockedLP = poolInfos?.find((poolInfo) => poolInfo.id === pool.id)?.totalLockedLP ?? 0;

    const tvl = totalLockedLP

    // const tvl = swapPair
    //   ? (balance / Number(swapPair.totalSupply)) * Number(swapPair.reserveUSD)
    //   : balance * kashiPair.token0.derivedETH * ethPrice

    const feeApyPerYear = pair
      ? aprToApy((((((pair?.volumeUSD - pair?.volumeUSD) * 0.0025) / 7) * 365) / pair?.reserveUSD) * 100, 3650) / 100
      : 0

    // const feeApyPerYear =
    //   swapPair && swapPair1d
    //     ? aprToApy((((pair?.volumeUSD - swapPair1d?.volumeUSD) * 0.0025 * 365) / pair?.reserveUSD) * 100, 3650) / 100
    //     : 0

    const feeApyPerMonth = feeApyPerYear / 12
    const feeApyPerDay = feeApyPerMonth / 30
    const feeApyPerHour = feeApyPerDay / blocksPerHour

    const roiPerBlock =tvl > 0?
      rewards.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.rewardPerBlock * currentValue.rewardPrice
      }, 0) / tvl : 0

    const rewardAprPerHour = roiPerBlock * blocksPerHour
    const rewardAprPerDay = rewardAprPerHour * 24
    const rewardAprPerMonth = rewardAprPerDay * 30
    const rewardAprPerYear = rewardAprPerMonth * 12

    const roiPerHour = rewardAprPerHour + feeApyPerHour
    const roiPerMonth = rewardAprPerMonth + feeApyPerMonth
    const roiPerDay = rewardAprPerDay + feeApyPerDay
    const roiPerYear = rewardAprPerYear + feeApyPerYear

    // const position = positions.find((position) => position.id === pool.id && position.chef === pool.chef)

    return {
      ...pool,
      pair: {
        ...pair,
        decimals: 18,
        type,
      },
      balance,
      feeApyPerHour,
      feeApyPerDay,
      feeApyPerMonth,
      feeApyPerYear,
      rewardAprPerHour,
      rewardAprPerDay,
      rewardAprPerMonth,
      rewardAprPerYear,
      roiPerBlock,
      roiPerHour,
      roiPerDay,
      roiPerMonth,
      roiPerYear,
      rewards,
      tvl,
      amount,
    }
  }

  return (
    farms[chain].map(map)
    // .filter((farm) => {
    //   return (
    //     // @ts-ignore TYPE NEEDS FIXING
    //     (swapPairs && swapPairs.find((pair) => pair.id === farm.pair)) ||
    //     // @ts-ignore TYPE NEEDS FIXING
    //     (kashiPairs && kashiPairs.find((pair) => pair.id === farm.pair))
    //   )
    // })
    // .map(map)
  )
}
