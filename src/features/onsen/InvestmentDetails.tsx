import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, CurrencyAmount, JSBI, Token, USD, ZERO } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'

import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import { useKashiPair } from 'app/features/kashi/hooks'
import { easyAmount, formatNumber } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'app/modals/TransactionConfirmationModal'
import { useExpertModeManager } from 'app/state/user/hooks'
import { PairType } from './enum'
import { useUserInfo } from './hooks'
import useMasterChef from './useMasterChef'
import usePendingReward from './usePendingReward'
import { useTotalSupply } from 'app/hooks/useTotalSupply'
import { useV2Pair } from 'app/hooks/useV2Pairs'
import usePending from './usePendingReward'

// @ts-ignore TYPE NEEDS FIXING
const RewardRow = ({ value, symbol }) => {
  return (
    <Typography weight={700} className="text-high-emphesis">
      {value}{' '}
      <Typography component="span" className="text-secondary">
        {symbol}
      </Typography>
    </Typography>
  )
}

// @ts-ignore TYPE NEEDS FIXING
const InvestmentDetails = ({ farm }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const { harvest } = useMasterChef(farm.chef)
  const router = useRouter()
  const addTransaction = useTransactionAdder()
  // const kashiPair = useKashiPair(farm.pair.id)
  const [pendingTx, setPendingTx] = useState(false)
  const [txHash, setTxHash] = useState<string>('')
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const token0 = useCurrency(farm.pair.token0?.id)
  const token1 = useCurrency(farm.pair.token1?.id)

  const liquidityToken = new Token(
    // @ts-ignore TYPE NEEDS FIXING
    chainId,
    getAddress(farm.pair.id),
    farm.pair.type === PairType.KASHI ? Number(farm.pair.asset.decimals) : 18,
    farm.pair.type === PairType.SINGLE ? farm.pair.symbol : farm.pair.type === PairType.KASHI ? 'KMP' : 'NLP',
    farm.pair.name
  )

  const stakedAmount = useUserInfo(farm, liquidityToken)

  // const kashiAssetAmount =
  //   kashiPair &&
  //   stakedAmount &&
  //   easyAmount(
  //     BigNumber.from(stakedAmount.quotient.toString()).mulDiv(
  //       // @ts-ignore TYPE NEEDS FIXING
  //       kashiPair.currentAllAssets.value,
  //       // @ts-ignore TYPE NEEDS FIXING
  //       kashiPair.totalAsset.base
  //     ),
  //     // @ts-ignore TYPE NEEDS FIXING
  //     kashiPair.asset
  //   )

  const pending = usePending(farm)

  // const positionFiatValue = CurrencyAmount.fromRawAmount(
  //   // @ts-ignore TYPE NEEDS FIXING
  //   USD[chainId],
  //   farm.pair.type === PairType.KASHI
  //     ? // @ts-ignore TYPE NEEDS FIXING
  //       kashiAssetAmount?.usdValue.toString() ?? ZERO
  //     : JSBI.BigInt(
  //         ((Number(stakedAmount?.toExact() ?? '0') * farm.pair.reserveUSD) / farm.pair.totalSupply)
  //           // @ts-ignore TYPE NEEDS FIXING
  //           .toFixed(USD[chainId].decimals)
  //           // @ts-ignore TYPE NEEDS FIXING
  //           .toBigNumber(USD[chainId].decimals)
  //       )
  // )

  // @ts-ignore TYPE NEEDS FIXING
  const secondaryRewardOnly = [ChainId.FUSE].includes(chainId)

  async function onHarvest() {
    setPendingTx(true)
    setShowConfirm(true);
    try {
      const tx = await harvest(farm.id)
      setTxHash(tx.hash);
      addTransaction(tx, {
        summary: i18n._(t`Harvest ${farm.pair.token0.name}/${farm.pair.token1?.name}`),
      })
    } catch (error) {
      setShowConfirm(false)
      console.error(error)
    }
    setPendingTx(false)

  }

  const [, pair] = useV2Pair(token0 ?? undefined, token1 ?? undefined)

  // liquidity values
  const totalSupply = useTotalSupply(liquidityToken)

  const reserve0 = pair?.token0?.address === token0?.wrapped?.address ? pair?.reserve0 : pair?.reserve1

  const reserve1 = pair?.token1?.address === token1?.wrapped?.address ? pair?.reserve1 : pair?.reserve0

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
    <>
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-2 bg-dark-1000/40">
        <div className="flex justify-between">
          <Typography variant="xs" weight={700} className="text-secondary">
            {i18n._(t`Your Deposits`)}
          </Typography>
          <Typography variant="xs" className="flex gap-1 text-secondary">
            {formatNumber(stakedAmount?.toSignificant(6) ?? 0)} {farm.pair.token0.symbol}
            {farm.pair.token1 && '-'}
            {farm.pair.token1?.symbol}
            <Typography variant="xs" weight={700} className="text-high-emphesis" component="span">
              {/* {formatNumber(positionFiatValue?.toSignificant(6) ?? 0, true)} */}
            </Typography>
          </Typography>
        </div>
        {[PairType.KASHI, PairType.SWAP].includes(farm.pair.type) && (
          <div className="flex items-center gap-2">
            {/*@ts-ignore TYPE NEEDS FIXING*/}
            {token0 && <CurrencyLogo currency={token0} size={18} />}
            {farm.pair.type === PairType.KASHI && (
              <RewardRow
                symbol={token0?.symbol}
                // @ts-ignore TYPE NEEDS FIXING
                value={formatNumber(kashiAssetAmount?.value.toFixed(kashiPair.asset.tokenInfo.decimals) ?? 0)}
              />
            )}
            {farm.pair.type === PairType.SWAP && reserve0 && stakedAmount && totalSupply && (
              // <RewardRow
              //   value={formatNumber(
              //     (farm.pair.reserve0 * Number(stakedAmount?.toExact() ?? 0)) / farm.pair.totalSupply
              //   )}
              //   symbol={token0?.symbol}
              // />

              <RewardRow
                value={formatNumber(reserve0?.multiply(stakedAmount).divide(totalSupply).toSignificant(6))}
                symbol={token0?.symbol}
              />
            )}
          </div>
        )}
        {farm.pair.type === PairType.SWAP && reserve0 && stakedAmount && totalSupply && (
          <div className="flex items-center gap-2">
            {token1 && <CurrencyLogo currency={token1} size={18} />}
            {/* <RewardRow
              value={formatNumber((farm.pair.reserve1 * Number(stakedAmount?.toExact() ?? 0)) / farm.pair.totalSupply)}
              symbol={token1?.symbol}
            /> */}

            <RewardRow
              value={formatNumber(reserve1?.multiply(stakedAmount).divide(totalSupply).toSignificant(6))}
              symbol={token1?.symbol}
            />
          </div>
        )}
      </HeadlessUiModal.BorderedContent>
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-2 bg-dark-1000/40">
        <div className="flex justify-between">
          <Typography variant="xs" weight={700} className="text-secondary">
            {i18n._(t`Your Rewards`)}
          </Typography>
          <Typography variant="xs" weight={700} className="text-high-emphesis" component="span">
            {/* {formatNumber(rewardValue, true)} */}
          </Typography>
        </div>
        <div className='flex justify-start gap-4 flex-wrap text-left'>
          {/* @ts-ignore TYPE NEEDS FIXING */}
          {farm?.rewards?.map((reward, i) => {
            return (
              <div key={i} className="flex items-center gap-1">
                <div>
                  <CurrencyLogo currency={reward.currency} size={40} />
                </div>
                <div>
                  <RewardRow
                    value={pending[reward.currency.address]}
                    symbol={reward.currency.symbol}
                  />
                  <div className="text-[11px]">
                    Your Rate: <span className='font-bold'>{(reward.rewardPerBlock * parseFloat(formatNumber(stakedAmount?.toSignificant(6))) / parseFloat(farm.tvl)).toFixed(4)}
                      ={(parseFloat(formatNumber(stakedAmount?.toSignificant(6))) * 100 / parseFloat(farm.tvl)).toFixed(2)}%</span>
                  </div>
                  <div className="text-[11px]">
                    Rate:<span className='font-bold'> {reward.rewardPerBlock.toFixed(4)}</span>
                  </div>
                  <div className="text-[11px]">
                    Max: <span className='font-bold'>{reward.currency.symbol !== "NEXU" ? reward.remainAmount.toFixed(0) : "1,100,000,000"}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </HeadlessUiModal.BorderedContent>
      {farm.pair.type === PairType.KASHI && (
        <Button
          fullWidth
          color="blue"
          variant="empty"
          size="sm"
          className="!italic"
          onClick={() => router.push(`/lend/${farm.pair.id}`)}
        >
          {i18n._(t`View details on Kashi`)}
        </Button>
      )}
      <Button
        loading={pendingTx}
        fullWidth
        color="gradient"
        disabled={pendingTx}
        onClick={() => onHarvest()}
      >
        {i18n._(t`HARNESS REWARDS`)}
      </Button>
    </>
  )
}

export default InvestmentDetails
