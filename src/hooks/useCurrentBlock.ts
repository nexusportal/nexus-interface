import { BigNumber } from '@ethersproject/bignumber'

import { useSingleCallResult } from '../state/multicall/hooks'
import { useMulticall2Contract } from './useContract'
import { JSBI } from '@sushiswap/core-sdk'
import { useMemo } from 'react'

// gets the current timestamp from the blockchain
export default function useCurrentBlock(): number {
  const multicall = useMulticall2Contract()
  const value = useSingleCallResult(multicall, 'getBlockNumber')?.result?.[0]
  const curBlock = value ? JSBI.BigInt(value.toString()) : undefined

  return useMemo(() => {
    if (curBlock) {
      return JSBI.toNumber(curBlock)
    }
    return 0
  }, [curBlock])
}
