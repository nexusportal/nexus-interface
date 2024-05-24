/* eslint-disable @next/next/no-img-element */
import { ZERO, ChainId, NEXU_DISTRIBUTOR_ADDRESS } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import { NEXUS } from 'app/config/tokens'
import { useNextOracleDistributeTime, useProOracleDistributeAction } from 'app/hooks/useProOracleDistributor'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenBalance } from 'app/state/wallet/hooks'
import React, { useEffect, useMemo, useState } from 'react'
import useCountDown from 'react-countdown-hook'
import { Token } from '@sushiswap/core-sdk';

import NEXUSImage from '../../../public/XINU.png'
import { getChainIdString } from 'app/config/wallets'

export const getDateStringFromSeconds = (miliseconds: number) => {
  if (miliseconds === 0 || isNaN(miliseconds)) {
    return ''
  }

  let d = Number(miliseconds / 1000)

  const days = Math.floor(miliseconds / 1000 / 3600 / 24)

  var h = Math.floor((d - days * 3600 * 24) / 3600)
  var m = Math.floor((d % 3600) / 60)
  var s = Math.floor((d % 3600) % 60)

  var hDisplay = h > 0 ? h + (h == 1 ? 'h ' : 'h ') : ''
  var mDisplay = m > 0 ? m + (m == 1 ? 'm ' : 'm ') : ''
  var sDisplay = s > 0 ? s + (s == 1 ? 's' : 's') : ''
  var sss = hDisplay + mDisplay + sDisplay

  var dayDisplay = days > 0 ? days + (days == 1 ? 'd ' : 'd ') : ''
  return dayDisplay + sss
}


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

const OracleDistributor = () => {
  var current = Date.now()

  const nextDistributeTime = useNextOracleDistributeTime()

  const leftTime = useMemo(() => {
    if (nextDistributeTime && nextDistributeTime * 1000 > current) {
      return nextDistributeTime * 1000 - current
    }
    return 0
  }, [current, nextDistributeTime])

  const [timeLeft, { start, pause, resume, reset }] = useCountDown(leftTime)

  const possible = useMemo(() => {
    if (nextDistributeTime && leftTime === 0) {
      return true;
    }
    return false;
  }, [nextDistributeTime, leftTime])

  const harvestScheduleDateString = getDateStringFromSeconds(timeLeft)

  useEffect(() => {
    if (leftTime && start) {
      start(leftTime)
    }
  }, [leftTime, start])

  const [pendingTx, setPendingTx] = useState(false)

  const { account, chainId } = useActiveWeb3React()
  const chain = getChainIdString(chainId)

  const { distribute } = useProOracleDistributeAction()

  const proDistribute = async () => {
    if (!account) {
      return
    } else {
      setPendingTx(true)

      const success = await sendTx(() => distribute())
      if (!success) {
        setPendingTx(false)
        return
      }

      setPendingTx(false)
    }
  }

  const XINU_ADDRESS = '0x834a6CD4cc361e4B9B1694D2E9Df3eEB0Cb45C5A';
  const XINU = new Token(
    50,
    XINU_ADDRESS,
    18,
    'XINU',
    'XINU Token'
  );

  // const balance = useTokenBalance(NEXU_DISTRIBUTOR_ADDRESS[parseInt(chain)], NEXUS[chain])
  const balance = useTokenBalance(NEXU_DISTRIBUTOR_ADDRESS[parseInt(chain)], XINU)

  return (
    <div className="flex flex-row items-center mt-3 space-x-2 text-lg font-normal text-left text-primary">
      <div>
        <Button
          size="sm"
          className="p-6"
          color={'gradient'}
          onClick={proDistribute}
          disabled={pendingTx || balance?.equalTo(ZERO) || !possible}
        >
          <img src={NEXUSImage.src} alt="NEXUS" width={40} height={40} />
        </Button>
      </div>
      <div className="flex flex-col text-base">
        <div>
          XINU LEFT: <span>{balance?.toSignificant(6)}</span>
        </div>
        <div>
          NEXT DIST:{' '}
          <span className="ml-1 font-medium text-white">{timeLeft === 0 ? 'Now' : harvestScheduleDateString}</span>
        </div>
      </div>
    </div>
  )
}

export default OracleDistributor
