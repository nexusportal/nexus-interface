import { CurrencyAmount, JSBI, SUSHI, Token, ChainId } from '@sushiswap/core-sdk'
import { NEXUS } from 'app/config/tokens'
import { useSingleCallResult } from 'app/state/multicall/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback, useMemo } from 'react'

import { useOracleDistributorContract } from './useContract'
import { useActiveWeb3React } from 'app/services/web3'

const useOracleDistributor = () => {
  const addTransaction = useTransactionAdder()
  const distributorContract = useOracleDistributorContract()

  const convert = useCallback(async () => {
    try {
      const tx = await distributorContract?.LPConvert()
      return tx
    } catch (e) {
      return e
    }
  }, [addTransaction, distributorContract])

  return { convert }
}

export function useOracleDistributorEnableCheck() {
  const distributorContract = useOracleDistributorContract()

  const result = useSingleCallResult(distributorContract, 'LPEnalbe')?.result

  const value = result?.[0]

  return value
}

export function useOracleDistributorCovertAmount() {
  const {chainId} = useActiveWeb3React(); 
  const chain = chainId==50?"50": chainId==51?"51":"1440002"
  const contract = useOracleDistributorContract()

  const result = useSingleCallResult(contract, 'nexusTreasuryTotalAmount')?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  const result1 = useSingleCallResult(contract, 'nexusTreasuryTotalAmount')?.result

  const value1 = result1?.[0]

  const amount1 = value1 ? JSBI.BigInt(value1.toString()) : undefined

  const result2 = useSingleCallResult(contract, 'nexusBurnTotalAmount')?.result

  const value2 = result2?.[0]

  const amount2 = value2 ? JSBI.BigInt(value2.toString()) : undefined

  const result3 = useSingleCallResult(contract, 'nexusMultiStakingTotalAmount')?.result

  const value3 = result3?.[0]

  const amount3 = value3 ? JSBI.BigInt(value3.toString()) : undefined

  const result4 = useSingleCallResult(contract, 'nexusTotalAmount')?.result

  const value4 = result4?.[0]

  const amount4 = value4 ? JSBI.BigInt(value4.toString()) : undefined

  return useMemo(() => {
    if (amount && amount1 && amount2 && amount3 && amount4) {
      const foundry = CurrencyAmount.fromRawAmount(NEXUS[chain], amount)
      const treasury = CurrencyAmount.fromRawAmount(NEXUS[chain], amount1)
      const burned = CurrencyAmount.fromRawAmount(NEXUS[chain], amount2)
      const multiStaking = CurrencyAmount.fromRawAmount(NEXUS[chain], amount3)
      const total = CurrencyAmount.fromRawAmount(NEXUS[chain], amount4)
      return [foundry, treasury, burned, multiStaking, total]
    }
    return [undefined, undefined, undefined, undefined, undefined]
  }, [amount, amount1, amount2, amount3, amount4])
}

export default useOracleDistributor
