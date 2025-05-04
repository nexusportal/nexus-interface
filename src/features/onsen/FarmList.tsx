import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Dots from 'app/components/Dots'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import { OnsenModalView } from 'app/features/onsen/enum'
import FarmListItemDetails from 'app/features/onsen/FarmListItemDetails'
import { usePositions } from 'app/features/onsen/hooks'
import { selectOnsen, setOnsenModalOpen, setOnsenModalState, setOnsenModalView } from 'app/features/onsen/onsenSlice'
import { TABLE_TR_TH_CLASSNAME, TABLE_WRAPPER_DIV_CLASSNAME } from 'app/features/trident/constants'
import { classNames } from 'app/functions'
import { useInfiniteScroll } from 'app/hooks/useInfiniteScroll'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useAllTokensList } from 'app/state/lists/hooks'
import React, { FC, useCallback, useState, useMemo, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
// @ts-ignore: Unreachable code error
// eslint-disable-next-line simple-import-sort/imports
import { Arwes, ThemeProvider, Heading, Paragraph, Frame, createTheme, SoundsProvider, createSounds, withSounds } from 'arwes';
import FarmListItem from './FarmListItem'
import FarmFilterButtons from './FarmFilterButtons'

interface SortIconProps {
  id?: string
  direction?: 'ascending' | 'descending'
  active: boolean
}

const SortIcon: React.FC<SortIconProps> = ({ id, active, direction }) => {
  if (!id || !direction || !active) return <></>
  if (direction === 'ascending') return <ChevronUpIcon width={12} height={12} />
  if (direction === 'descending') return <ChevronDownIcon width={12} height={12} />
  return <></>
}

interface Farm {
  id: string
  rewards: {
    currency: {
      symbol: string
      icon?: string
    }
    rewardPerDay: string
    rewardPerBlock: string
  }[]
  pair: {
    token0?: {
      symbol: string
    }
    token1?: {
      symbol: string
    }
  }
  tvl: number
  allocPoint: number
  owner: {
    totalAllocPoint: number
  }
  [key: string]: any // Allow string indexing for dynamic property access
}

interface FarmListProps {
  farms: Farm[]
  term?: string
}

interface SortConfig {
  key: string
  direction: 'ascending' | 'descending'
}

const useSortableData = (items: Farm[], config: SortConfig | null = null) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(config)

  const sortedItems = useMemo(() => {
    const sortableItems = [...items]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any
        let bValue: any

        if (sortConfig.key === 'allocPoint') {
          aValue = (a.allocPoint / a.owner.totalAllocPoint) * 100
          bValue = (b.allocPoint / b.owner.totalAllocPoint) * 100
        } else {
          // Handle nested property access
          const keys = sortConfig.key.split('.')
          aValue = keys.reduce((obj, key) => obj?.[key], a)
          bValue = keys.reduce((obj, key) => obj?.[key], b)
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [items, sortConfig])

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'descending'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'descending'
    ) {
      direction = 'ascending'
    }
    setSortConfig({ key, direction })
  }

  return { items: sortedItems, requestSort, sortConfig }
}

// @ts-ignore TYPE NEEDS FIXING
const FarmList: React.FC<FarmListProps> = ({ farms, term }) => {
  const { chainId } = useActiveWeb3React()
  const tokenList = useAllTokensList(chainId)

  // Get unique reward tokens and stake tokens
  const rewardTokens = useMemo(() => {
    const tokenMap = new Map<string, { symbol: string; icon?: string }>()
    farms.forEach((farm: Farm) => {
      farm.rewards.forEach((reward) => {
        if (!tokenMap.has(reward.currency.symbol)) {
          const tokenInfo = tokenList.tokens.find(t => t.symbol === reward.currency.symbol)
          tokenMap.set(reward.currency.symbol, {
            symbol: reward.currency.symbol,
            icon: tokenInfo?.logoURI
          })
        }
      })
    })
    return Array.from(tokenMap.values())
  }, [farms, tokenList])

  // Get unique stake tokens
  const stakeTokens = useMemo(() => {
    const defaultTokens = [
      { 
        symbol: 'NEXU',
        icon: tokenList.tokens.find(t => t.symbol === 'NEXU')?.logoURI
      },
      { 
        symbol: 'WXDC',
        icon: tokenList.tokens.find(t => t.symbol === 'WXDC')?.logoURI
      },
      { 
        symbol: 'psXDC',
        icon: tokenList.tokens.find(t => t.symbol === 'psXDC')?.logoURI
      },
      { 
        symbol: 'pstXDC',
        icon: tokenList.tokens.find(t => t.symbol === 'pstXDC')?.logoURI
      },
      { 
        symbol: 'XINU',
        icon: tokenList.tokens.find(t => t.symbol === 'XINU')?.logoURI
      }
    ]
    // Add any additional stake tokens from farms
    farms.forEach((farm: Farm) => {
      if (farm.pair.token0?.symbol) {
        const symbol = farm.pair.token0.symbol
        if (!defaultTokens.some(t => t.symbol === symbol)) {
          const tokenInfo = tokenList.tokens.find(t => t.symbol === symbol)
          if (tokenInfo) {
            defaultTokens.push({
              symbol,
              icon: tokenInfo.logoURI
            })
          }
        }
      }
      if (farm.pair.token1?.symbol) {
        const symbol = farm.pair.token1.symbol
        if (!defaultTokens.some(t => t.symbol === symbol)) {
          const tokenInfo = tokenList.tokens.find(t => t.symbol === symbol)
          if (tokenInfo) {
            defaultTokens.push({
              symbol,
              icon: tokenInfo.logoURI
            })
          }
        }
      }
    })
    return defaultTokens
  }, [farms, tokenList])

  // Initialize with NEXU selected for stake tokens
  const [activeStakeTokens, setActiveStakeTokens] = useState<string[]>(['NEXU'])

  const toggleStakeToken = (symbol: string) => {
    setActiveStakeTokens(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(t => t !== symbol)
      } else {
        return [...prev, symbol]
      }
    })
  }

  // Filter farms based on active stake tokens
  const filteredFarms = useMemo(() => {
    let filtered = [...farms];

    // Filter by stake tokens if any are selected
    if (activeStakeTokens.length > 0) {
      filtered = filtered.filter((farm: Farm) => {
        const farmStakeTokens = [
          farm.pair.token0?.symbol,
          farm.pair.token1?.symbol
        ].filter(Boolean);
        return activeStakeTokens.some(selectedToken => farmStakeTokens.includes(selectedToken));
      });
    }

    return filtered;
  }, [farms, activeStakeTokens]);

  // Update numDisplayed when filtered farms change
  useEffect(() => {
    setNumDisplayed(filteredFarms.length);
  }, [filteredFarms]);

  const { items, requestSort, sortConfig } = useSortableData(filteredFarms, {
    key: 'tvl',
    direction: 'descending'
  });

  const { i18n } = useLingui()
  const positions = usePositions(chainId)
  const [numDisplayed, setNumDisplayed] = useState(items.length) // Initially display all items
  const [selectedFarm, setSelectedFarm] = useState<any>()
  const dispatch = useAppDispatch()
  const { open } = useAppSelector(selectOnsen)

  const handleDismiss = useCallback(() => {
    setSelectedFarm(undefined)
    dispatch(setOnsenModalView(undefined))
  }, [dispatch])

  const positionIds = positions.map((el) => el.id)

  return items ? (
    <>
      <div className={classNames(TABLE_WRAPPER_DIV_CLASSNAME)} style={{ overflow: "scroll", padding: "10px" }}>
        <FarmFilterButtons
          stakeTokens={stakeTokens}
          activeStakeTokens={activeStakeTokens}
          onToggleStakeToken={toggleStakeToken}
        />
        <Frame animate={true}
          corners={3}
          className="width__set"
          layer='primary'>
          <div className="grid grid-cols-6 min-w-[768px]">
            <div
              className={classNames('flex gap-1 items-center cursor-pointer', TABLE_TR_TH_CLASSNAME(0, 6))}
              onClick={() => requestSort('pair.token0.symbol')}
            >
              <Typography variant="sm" weight={700}>
                {i18n._(t`Farm`)}
              </Typography>
              <SortIcon id={sortConfig?.key} direction={sortConfig?.direction} active={sortConfig?.key === 'symbol'} />
            </div>
            <div
              className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(1, 6))}
              onClick={() => requestSort('tvl')}
            >
              <Typography variant="sm" weight={700}>
                {i18n._(t`TVL`)}
              </Typography>
              <SortIcon id={sortConfig?.key} direction={sortConfig?.direction} active={sortConfig?.key === 'tvl'} />
            </div>
            <div className={classNames('flex gap-1 items-center justify-end', TABLE_TR_TH_CLASSNAME(2, 6))}>
              <Typography variant="sm" weight={700}>
                {i18n._(t`Rewards`)}
              </Typography>
            </div>
            <div
              className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(3, 6))}
              onClick={() => requestSort('rewards[0].rewardPerDay')}
            >
              <Typography variant="sm" weight={700}>
                {i18n._(t`NEXU/Day`)}
              </Typography>
              <SortIcon id={sortConfig?.key} direction={sortConfig?.direction} active={sortConfig?.key === 'rewards[0].rewardPerDay'} />
            </div>
            <div
              className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(4, 6))}
              onClick={() => requestSort('rewards[0].rewardPerBlock')}
            >
              <Typography variant="sm" weight={700}>
                {i18n._(t`NEXU/Block`)}
              </Typography>
              <SortIcon id={sortConfig?.key} direction={sortConfig?.direction} active={sortConfig?.key === 'rewards[0].rewardPerBlock'} />
            </div>
            <div
              className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(5, 6))}
              onClick={() => requestSort('allocPoint')}
            >
              <Typography variant="sm" weight={700}>
                {i18n._(t`NEXU%`)}
              </Typography>
              <SortIcon id={sortConfig?.key} direction={sortConfig?.direction} active={sortConfig?.key === 'allocPoint'} />
            </div>
          </div>
        </Frame>
        <Frame animate={true}
          corners={3}
          className="mt-3 width__set"
          layer='primary'>
          <div className="divide-y divide-dark-900  min-w-[768px]">
            <InfiniteScroll
              dataLength={numDisplayed}
              next={() => setNumDisplayed(items.length)} // Ensure it loads all items
              hasMore={numDisplayed < items.length} // Continue loading until all items are displayed
              loader={null}
            >
              {items.slice(0, numDisplayed).map((farm, index) => (
                <FarmListItem
                  key={index}
                  farm={farm}
                  onClick={() => {
                    setSelectedFarm(farm)
                    dispatch(
                      setOnsenModalState({
                        view: positionIds.includes(farm.id) ? OnsenModalView.Position : OnsenModalView.Liquidity,
                        open: true,
                      })
                    )
                  }}
                />
              ))}
            </InfiniteScroll>
          </div>
        </Frame>
      </div>
      <HeadlessUiModal.Controlled
        isOpen={open}
        onDismiss={() => dispatch(setOnsenModalOpen(false))}
        afterLeave={handleDismiss}
      >
        {selectedFarm && (
          <FarmListItemDetails farm={selectedFarm} onDismiss={() => dispatch(setOnsenModalOpen(false))} />
        )}
      </HeadlessUiModal.Controlled>
    </>
  ) : (
    <div className="w-full py-6 text-center">{term ? <span>No Results.</span> : <Dots>Loading</Dots>}</div>
  )
}

export default FarmList
