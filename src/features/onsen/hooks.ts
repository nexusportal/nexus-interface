import { Zero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { ChainId, CurrencyAmount, JSBI, MASTERCHEF_V2_ADDRESS, MASTERCHEF_ADDRESS, MINICHEF_ADDRESS, SUSHI, Currency, Token } from '@sushiswap/core-sdk'
import { OLD_FARMS } from 'app/config/farms'
import {
  useMasterChefContract,
  useMasterChefV2Contract,
  useMiniChefContract,
  useOldFarmsContract,
} from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from 'app/state/multicall/hooks'
import concat from 'lodash/concat'
import zip from 'lodash/zip'
import { useCallback, useMemo } from 'react'
import { ethers } from "ethers"
import { getTokenInfo, useAllTokensList } from 'app/state/lists/hooks'
import { NEXUS } from 'app/config/tokens'

import { Chef } from './enum'
import { getChainIdString, isSupportedChainId } from 'app/config/wallets'
import { formatEther } from '@ethersproject/units'

export function useChefContract(chef: Chef) {
  const masterChefContract = useMasterChefContract()
  const masterChefV2Contract = useMasterChefV2Contract()
  const miniChefContract = useMiniChefContract()
  const oldFarmsContract = useOldFarmsContract()
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefContract,
      [Chef.MASTERCHEF_V2]: masterChefV2Contract,
      [Chef.MINICHEF]: miniChefContract,
      [Chef.OLD_FARMS]: oldFarmsContract,
    }),
    [masterChefContract, masterChefV2Contract, miniChefContract, oldFarmsContract]
  )
  return useMemo(() => {
    return contracts[chef]
  }, [contracts, chef])
}

export function useChefContracts(chefs: Chef[]) {
  const masterChefContract = useMasterChefContract()
  const masterChefV2Contract = useMasterChefV2Contract()
  const miniChefContract = useMiniChefContract()
  const oldFarmsContract = useOldFarmsContract()
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefContract,
      [Chef.MASTERCHEF_V2]: masterChefV2Contract,
      [Chef.MINICHEF]: miniChefContract,
      [Chef.OLD_FARMS]: oldFarmsContract,
    }),
    [masterChefContract, masterChefV2Contract, miniChefContract, oldFarmsContract]
  )
  return chefs.map((chef) => contracts[chef])
}

// @ts-ignore TYPE NEEDS FIXING
export function useUserInfo(farm, token) {
  const { account } = useActiveWeb3React()

  const contract = useChefContract(farm.chef)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [account])

  const result = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result
  const value = result?.[0] ?? undefined;

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined
}

// @ts-ignore TYPE NEEDS FIXING
export function useRewardTokens(farm) {
  const { chainId } = useActiveWeb3React()
  const contract = useChefContract(farm.chef)
  const args = [String(farm.id)];
  const result = useSingleCallResult(args ? contract : null, 'getRewardTokenInfo', args)?.result;
  const value = result?.[0];
  const chain = getChainIdString(chainId);
  const alltokenslist = useAllTokensList(chainId)
  // @ts-ignore TYPE NEEDS FIXING
  let rewards: { currency: Currency; rewardPerBlock: number; rewardPerDay: number; rewardPrice: number, remainAmount: number, token: string, icon: string }[] = value?.map((item, ind) => {
    let re = parseFloat(ethers.utils.formatEther(item.distRate));
    let remainAmount = parseFloat(ethers.utils.formatEther(item.remainAmount));
    let token = getTokenInfo(alltokenslist.tokens, item.rewardToken, chain);
    return {
      rewardPerBlock: re,
      rewardPerDay: 24 * 60 * 60 * re,
      rewardPrice: 0,
      remainAmount: remainAmount,
      currency: new Token(parseInt(chain), item.rewardToken, token?.decimals ?? 18, token?.symbol ?? "Unknown", token?.name ?? "Unknown Token"),
      token: token?.symbol ?? "Unknown",
      icon: token?.logoURI ?? "Unknown.png",
    }
  }) ?? []
  return rewards.filter((ele) => ele.token != "Unknown");
}

// @ts-ignore TYPE NEEDS FIXING
export function usePendingSushi(farm) {
  const { account, chainId } = useActiveWeb3React()
  const chain = getChainIdString(chainId);
  const contract = useChefContract(farm.chef)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'pendingNexusByUser', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  // @ts-ignore TYPE NEEDS FIXING
  return amount ? CurrencyAmount.fromRawAmount(NEXUS[chain], amount) : undefined
}

// @ts-ignore TYPE NEEDS FIXING
export function usePendingRewards(farm) {
  const { account, chainId } = useActiveWeb3React()

  const contract = useChefContract(farm.chef)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    // @ts-ignore TYPE NEEDS FIXING
    return farm.rewards.map((item, i) => [parseInt(farm.id), i, account])
  }, [farm, account])

  // @ts-ignore TYPE NEEDS FIXING
  const result = useSingleContractMultipleData(args ? contract : null, 'pendingRewardToken', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  // @ts-ignore TYPE NEEDS FIXING
  return amount ? CurrencyAmount.fromRawAmount(NEXUS[chain], amount) : undefined
}

// @ts-ignore TYPE NEEDS FIXING
export function usePendingToken(farm, contract) {
  const { account } = useActiveWeb3React()

  const args = useMemo(() => {
    if (!account || !farm) {
      return
    }
    return [String(farm.pid), String(account)]
  }, [farm, account])

  const pendingTokens = useSingleContractMultipleData(
    args ? contract : null,
    'pendingTokens',
    // @ts-ignore TYPE NEEDS FIXING
    args.map((arg) => [...arg, '0'])
  )

  return useMemo(() => pendingTokens, [pendingTokens])
}
export function useProphetPoolInfos() {
  const contract = useChefContract(Chef.MASTERCHEF)

  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const args = useMemo(() => {
    if (!numberOfPools) {
      return
    }
    return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [String(pid)])
  }, [numberOfPools])

  // @ts-ignore TYPE NEEDS FIXING
  const res = useSingleContractMultipleData(args ? contract : null, 'poolInfo', args)

  const poolInfos = useMemo(() => {
    if (!res) {
      return []
    }
    return res.map((data, i) => {
      let totalLockedLP = data.result?.totalLockedLP ? data.result.totalLockedLP : Zero;
      return {
        // @ts-ignore TYPE NEEDS FIXING
        id: args[i][0],
        allocPoint: data.result?.allocPoint?.toNumber() || 0,
        lpToken: data.result?.lpToken,
        lastRewardBlock: data.result?.lastRewardBlock || Zero,
        accSushiPerShare: data.result?.accNexusPerShare || Zero,
        totalLockedLP: parseFloat(formatEther(totalLockedLP))
        // @ts-ignore TYPE NEEDS FIXING
        // pendingTokens: data?.[2]?.result,
      }
    })
  }, [args, res])

  const farmsList = useMemo(() => {
    if (args && args.length > 0 && res.length > 0) {
      if (!res.every(ele => ele.result !== undefined)) return []
      return res.map((ele, index) => {
        return {
          accSushiPerShare: '',
          allocPoint: ele?.result?.allocPoint?.toNumber() || 0,
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

  return {
    poolInfos, farmsList
  }
}
export function useChefPositions(contract?: Contract | null, rewarder?: Contract | null, chainId = undefined) {
  const { account } = useActiveWeb3React()

  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return
    }
    return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [String(pid), String(account)])
  }, [numberOfPools, account])

  // @ts-ignore TYPE NEEDS FIXING
  const pendingSushi = useSingleContractMultipleData(args ? contract : null, 'pendingNexusByUser', args)
  // console.log("Pending Sushi: ", pendingSushi)

  // @ts-ignore TYPE NEEDS FIXING
  const userInfo = useSingleContractMultipleData(args ? contract : null, 'userInfo', args)

  // const pendingTokens = useSingleContractMultipleData(
  //     rewarder,
  //     'pendingTokens',
  //     args.map((arg) => [...arg, '0'])
  // )

  const getChef = useCallback(() => {
    // @ts-ignore TYPE NEEDS FIXING
    if (MASTERCHEF_ADDRESS[chainId] === contract.address) {
      return Chef.MASTERCHEF
      // @ts-ignore TYPE NEEDS FIXING
    } else if (MASTERCHEF_V2_ADDRESS[chainId] === contract.address) {
      return Chef.MASTERCHEF_V2
      // @ts-ignore TYPE NEEDS FIXING
    } else if (MINICHEF_ADDRESS[chainId] === contract.address) {
      return Chef.MINICHEF
      // @ts-ignore TYPE NEEDS FIXING
    } else if (OLD_FARMS[chainId] === contract.address) {
      return Chef.OLD_FARMS
    }
  }, [chainId, contract])

  return useMemo(() => {
    if (!pendingSushi && !userInfo) {
      return []
    }
    return zip(pendingSushi, userInfo)
      .map((data, i) => ({
        // @ts-ignore TYPE NEEDS FIXING
        id: args[i][0],
        // @ts-ignore TYPE NEEDS FIXING
        pendingSushi: data[0].result?.[0] || Zero,
        // @ts-ignore TYPE NEEDS FIXING
        amount: data[1].result?.[0] || Zero,
        chef: getChef(),
        // pendingTokens: data?.[2]?.result,
      }))
      .filter(({ pendingSushi, amount }) => {
        return (pendingSushi && !pendingSushi.isZero()) || (amount && !amount.isZero())
      })
  }, [args, getChef, pendingSushi, userInfo])
}

export function usePositions(chainId: ChainId | undefined) {
  const [masterChefV1Positions, masterChefV2Positions, miniChefPositions] = [
    // @ts-ignore TYPE NEEDS FIXING
    useChefPositions(useMasterChefContract(), undefined, chainId),
    // @ts-ignore TYPE NEEDS FIXING
    useChefPositions(useMasterChefV2Contract(), undefined, chainId),
    // @ts-ignore TYPE NEEDS FIXING
    useChefPositions(useMiniChefContract(), undefined, chainId),
  ]
  return concat(masterChefV1Positions, masterChefV2Positions, miniChefPositions)
}
