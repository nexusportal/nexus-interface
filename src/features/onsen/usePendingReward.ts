import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, NEXU } from '@sushiswap/core-sdk'
import { Fraction } from 'app/entities/bignumber'
import { useCloneRewarderContract, useComplexRewarderContract, useNexusGeneratorContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3/hooks/useActiveWeb3React'
import { useBlockNumber } from 'app/state/application/hooks'
import { useEffect, useMemo, useState } from 'react'

import { Chef } from './enum'
import { formatEther, parseUnits } from '@ethersproject/units'

// @ts-ignore TYPE NEEDS FIXING
const usePending = (farm) => {
  const [balance, setBalance] = useState<Record<string, string>>({})

  const { chainId, account, library } = useActiveWeb3React()
  const currentBlockNumber = useBlockNumber()

  // const cloneRewarder = useCloneRewarderContract(farm?.rewarder?.id)

  // const complexRewarder = useComplexRewarderContract(farm?.rewarder?.id)

  const nexusGenRewarder = useNexusGeneratorContract()
  const contract = useMemo(
    () => ({
      // [ChainId.ETHEREUM]: cloneRewarder,
      // [ChainId.MATIC]: complexRewarder,
      // [ChainId.XDAI]: complexRewarder,
      // [ChainId.HARMONY]: complexRewarder,
      // [ChainId.ARBITRUM]: cloneRewarder,
      // [ChainId.CELO]: complexRewarder,
      // [ChainId.MOONRIVER]: complexRewarder,
      // [ChainId.FUSE]: complexRewarder,
      // [ChainId.FANTOM]: complexRewarder,
      [chainId?chainId: ChainId.XRPL]: nexusGenRewarder,
    }),
    [nexusGenRewarder, chainId]
  )

  useEffect(() => {
    async function fetchPendingReward() {
      try {
        let bal: Record<string, string> = {};
        // @ts-ignore TYPE NEEDS FIXING
        const pending = await contract[chainId]?.pendingNexusByUser(farm.id, account)
        const format = parseFloat(formatEther(pending)).toFixed(4);
        bal[NEXU[chainId?chainId:ChainId.XRPL]] = format;
        // @ts-ignore TYPE NEEDS FIXING
        const rewardTokens = farm.rewards.filter((item, i)=> item.currency.symbol !== "NEXU");
        for(let i=0; i< rewardTokens.length; i++) {
          // @ts-ignore TYPE NEEDS FIXING
          const pendingR = await contract[chainId]?.pendingRewardToken(farm.id, i, account);
          const formatR = parseFloat(formatEther(pendingR)).toFixed(4);
          bal[rewardTokens[i].currency.address] = formatR;
        }
        setBalance(bal); 
      } catch (error) {
        console.error(error)
      }
    }
    // id = 0 is evaluated as false
    if (
      account &&
      nexusGenRewarder &&
      farm &&
      library &&
      chainId
    ) {
      fetchPendingReward()
    }
  }, [account, currentBlockNumber, nexusGenRewarder, farm, library, contract, chainId])

  return balance
}

export default usePending
