import React, { useEffect, useState } from 'react'
import { Frame } from 'arwes'
import Typography from 'app/components/Typography'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { ExternalLinkIcon, GlobeIcon } from '@heroicons/react/solid'
import { db } from '../../config/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { formatDistanceToNow } from 'date-fns'
import classNames from 'classnames'
import { useActiveWeb3React } from 'app/services/web3'
import ERC20_ABI from 'app/constants/abis/erc20.json'
import PAIR_ABI from 'app/constants/abis/pair.json'
import axios from 'axios'
import Web3 from 'web3'
import RPC from 'app/config/rpc'
import { ChainId } from '@sushiswap/core-sdk'
import { Contract } from '@ethersproject/contracts'

interface TokenData {
  name: string
  symbol: string
  tokenAddress: string
  lpAddress: string
  description: string
  website: string
  logoUrl: string
  launchDate: Date
  lpAllocation: string
  devAllocation: string
  initialLiquidity: string
  chainId: string
  createdAt: Date
  poolData?: {
    marketCap: string | null
    price: string | null
    volume24h: string | null
    priceChange24h: string | null
    priceChange7d: string | null
    priceChange30d: string | null
  }
  price?: number
  marketCap?: number
}

// Helper function to truncate address
const truncateAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Update the formatPrice helper
const formatPrice = (price: number | undefined) => {
  if (!price) return '-'
  return price < 0.01 
    ? `$${price.toFixed(6)}` 
    : `$${price.toFixed(2)}`
}

// Add formatMarketCap helper
const formatMarketCap = (marketCap: number | undefined) => {
  if (!marketCap) return '-'
  
  if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(1)}B`
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(1)}M`
  } else if (marketCap >= 1e3) {
    return `$${(marketCap / 1e3).toFixed(1)}K`
  } else {
    return `$${marketCap.toFixed(0)}`
  }
}

// Add formatChange helper
const formatChange = (change: string | null) => {
  if (!change) return '-'
  const num = parseFloat(change)
  const color = num > 0 ? 'text-green' : num < 0 ? 'text-red' : 'text-secondary'
  return <span className={color}>{num > 0 ? '+' : ''}{num.toFixed(2)}%</span>
}

// Add price calculation functions
const calculateTokenPrice = async (lpAddress: string, tokenAddress: string, library: any) => {
  try {
    const pair = new Contract(lpAddress, PAIR_ABI, library)
    const token = new Contract(tokenAddress, ERC20_ABI, library)
    
    const reserves = await pair.getReserves()
    const token0 = await pair.token0()
    
    // Determine which reserve is token and which is XDC
    const [tokenReserve, xdcReserve] = token0.toLowerCase() === tokenAddress.toLowerCase() 
      ? [reserves[0], reserves[1]]
      : [reserves[1], reserves[0]]
    
    // Calculate price in XDC
    const priceInXdc = xdcReserve / tokenReserve
    
    // TODO: Multiply by XDC price in USD to get USD price
    return priceInXdc
  } catch (error) {
    console.error('Error calculating price:', error)
    return null
  }
}

const calculateMarketCap = async (tokenAddress: string, price: number, library: any) => {
  try {
    const token = new Contract(tokenAddress, ERC20_ABI, library)
    const totalSupply = await token.totalSupply()
    return totalSupply * price
  } catch (error) {
    console.error('Error calculating market cap:', error)
    return null
  }
}

export default function LaunchedTokens() {
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<keyof TokenData>('launchDate')
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [xdcPrice, setXdcPrice] = useState<number | null>(null)

  // First fetch tokens
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const tokensQuery = query(collection(db, 'tokens'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(tokensQuery)
        const tokensList = snapshot.docs.map(doc => ({
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          launchDate: doc.data().launchDate?.toDate()
        })) as TokenData[]
        setTokens(tokensList)
      } catch (error) {
        console.error('Error fetching tokens:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, []) // Only fetch tokens once on mount

  // Filter tokens
  const filteredTokens = tokens.filter(token => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      (token.name?.toLowerCase() || '').includes(searchTermLower) ||
      (token.symbol?.toLowerCase() || '').includes(searchTermLower) ||
      (token.tokenAddress?.toLowerCase() || '').includes(searchTermLower)
    )
  })

  // Get current page tokens
  const currentTokens = filteredTokens.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  )

  // Add function to fetch XDC price
  useEffect(() => {
    const fetchXdcPrice = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=xdce-crowd-sale&vs_currencies=usd')
        if (response.data && response.data['xdce-crowd-sale']) {
          setXdcPrice(response.data['xdce-crowd-sale'].usd)
        }
      } catch (error) {
        console.error('Failed to fetch XDC price:', error)
      }
    }

    fetchXdcPrice()
    const interval = setInterval(fetchXdcPrice, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Add function to calculate token price and market cap
  const calculateTokenData = async (token: TokenData) => {
    if (!token.lpAddress || !token.tokenAddress || !xdcPrice) return null

    const web3 = new Web3(RPC[ChainId.XDC])
    const pair = new web3.eth.Contract(PAIR_ABI as any, token.lpAddress)
    const tokenContract = new web3.eth.Contract(ERC20_ABI as any, token.tokenAddress)

    try {
      const reserves = await pair.methods.getReserves().call()
      const token0 = await pair.methods.token0().call()
      const totalSupply = await tokenContract.methods.totalSupply().call()

      // Determine which reserve is token and which is XDC
      const [tokenReserve, xdcReserve] = token0.toLowerCase() === token.tokenAddress.toLowerCase()
        ? [reserves[0], reserves[1]]
        : [reserves[1], reserves[0]]

      // Calculate price in XDC then convert to USD
      const priceInXdc = xdcReserve / tokenReserve
      const priceInUsd = priceInXdc * xdcPrice

      // Calculate market cap
      const marketCap = (totalSupply / 1e18) * priceInUsd

      return {
        price: priceInUsd,
        marketCap: marketCap
      }
    } catch (error) {
      console.error('Error calculating token data:', error)
      return null
    }
  }

  // Update the price and market cap calculation effect
  useEffect(() => {
    const calculatePricesAndMarketCaps = async () => {
      if (!xdcPrice || !tokens.length) return

      const web3 = new Web3(RPC[ChainId.XDC])
      let updatedTokens = [...tokens]

      try {
        // Process tokens sequentially to avoid rate limits
        for (const token of updatedTokens) {
          if (!token.lpAddress || !token.tokenAddress) continue

          try {
            console.log('Calculating for token:', token.symbol, {
              lpAddress: token.lpAddress,
              tokenAddress: token.tokenAddress
            })

            const pair = new web3.eth.Contract(PAIR_ABI as any, token.lpAddress)
            const tokenContract = new web3.eth.Contract(ERC20_ABI as any, token.tokenAddress)

            const [reserves, token0, totalSupply, decimals] = await Promise.all([
              pair.methods.getReserves().call(),
              pair.methods.token0().call(),
              tokenContract.methods.totalSupply().call(),
              tokenContract.methods.decimals().call()
            ])

            console.log('Got token data:', {
              reserves,
              token0,
              totalSupply,
              decimals
            })

            const [tokenReserve, xdcReserve] = token0.toLowerCase() === token.tokenAddress.toLowerCase()
              ? [reserves[0], reserves[1]]
              : [reserves[1], reserves[0]]

            const tokenReserveAdjusted = Number(tokenReserve) / (10 ** Number(decimals))
            const xdcReserveAdjusted = Number(xdcReserve) / (10 ** 18)
            
            const priceInXdc = xdcReserveAdjusted / tokenReserveAdjusted
            const priceInUsd = priceInXdc * xdcPrice

            const totalSupplyAdjusted = Number(totalSupply) / (10 ** Number(decimals))
            const marketCap = totalSupplyAdjusted * priceInUsd

            console.log('Calculated values:', {
              priceInUsd,
              marketCap
            })

            token.price = priceInUsd
            token.marketCap = marketCap
          } catch (error) {
            console.error(`Error calculating data for ${token.symbol}:`, error)
          }
        }

        setTokens(updatedTokens)
      } catch (error) {
        console.error('Error calculating prices:', error)
      }
    }

    calculatePricesAndMarketCaps()
  }, [tokens.length, xdcPrice]) // Only recalculate when tokens list changes or XDC price updates

  // Move handleSort inside component to access state
  const handleSort = (column: keyof TokenData | 'price' | 'marketCap') => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column as keyof TokenData)
      setSortDirection('asc')
    }

    const sortedTokens = [...tokens].sort((a, b) => {
      let aValue = a[column as keyof TokenData]
      let bValue = b[column as keyof TokenData]

      // Handle special cases for price and marketCap
      if (column === 'price') {
        aValue = a.price || 0
        bValue = b.price || 0
      } else if (column === 'marketCap') {
        aValue = a.marketCap || 0
        bValue = b.marketCap || 0
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue 
          : bValue - aValue
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc' 
          ? aValue.getTime() - bValue.getTime() 
          : bValue.getTime() - aValue.getTime()
      }

      return 0
    })

    setTokens(sortedTokens)
  }

  return (
    <>
      {/* Search Box */}
      <div className="flex flex-row justify-between items-center w-full space-x-1 mb-6">
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search by name, symbol, or address..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(0)
            }}
            className="w-full p-2 rounded bg-dark-900 text-grey text-sm border border-dark-700 focus:border-blue"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto" style={{ padding: "10px" }}>
        <div className="min-w-[1200px]">
          <Frame animate level={3} corners={4} layer='primary'>
            <div className="grid grid-cols-8">
              {/* Token Info */}
              <div className="col-span-2 flex gap-1 items-center cursor-pointer p-3"
                   onClick={() => handleSort('name')}>
                <Typography variant="sm" weight={700}>
                  Token 📜
                </Typography>
                {sortBy === 'name' && (
                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>

              {/* Price */}
              <div className="flex gap-1 items-center cursor-pointer justify-end p-3"
                   onClick={() => handleSort('price')}>
                <Typography variant="sm" weight={700}>
                  Price 💰
                </Typography>
                {sortBy === 'price' && (
                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>

              {/* Market Cap */}
              <div className="flex gap-1 items-center cursor-pointer justify-end p-3"
                   onClick={() => handleSort('marketCap')}>
                <Typography variant="sm" weight={700}>
                  Market Cap 📊
                </Typography>
                {sortBy === 'marketCap' && (
                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>

              {/* Dev Allocation */}
              <div className="flex gap-1 items-center cursor-pointer justify-end p-3"
                   onClick={() => handleSort('devAllocation')}>
                <Typography variant="sm" weight={700}>
                  Dev Alloc 👨‍💻
                </Typography>
                {sortBy === 'devAllocation' && (
                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>

              {/* LP Allocation */}
              <div className="flex gap-1 items-center cursor-pointer justify-end p-3"
                   onClick={() => handleSort('lpAllocation')}>
                <Typography variant="sm" weight={700}>
                  LP Alloc 🔥
                </Typography>
                {sortBy === 'lpAllocation' && (
                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>

              {/* Initial Liquidity */}
              <div className="flex gap-1 items-center cursor-pointer justify-end p-3"
                   onClick={() => handleSort('initialLiquidity')}>
                <Typography variant="sm" weight={700}>
                  Initial XDC 💎
                </Typography>
                {sortBy === 'initialLiquidity' && (
                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>

              {/* Created */}
              <div className="flex gap-1 items-center cursor-pointer justify-end p-3"
                   onClick={() => handleSort('createdAt')}>
                <Typography variant="sm" weight={700}>
                  Created ⏰
                </Typography>
                {sortBy === 'createdAt' && (
                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </div>
          </Frame>
        </div>
      </div>

      <Frame animate level={3} corners={4} layer='primary' className="mt-3">
        <div className="divide-y divide-dark-900 min-w-[1200px]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <Typography variant="lg" className="text-secondary">
                  Loading tokens...
                </Typography>
              </div>
            </div>
          ) : currentTokens.length === 0 ? (
            <div className="p-4 text-center">
              <Typography variant="sm" className="text-secondary">
                {searchTerm ? 'No tokens found matching your search' : 'No tokens found'}
              </Typography>
            </div>
          ) : (
            currentTokens.map((token, i) => {
              return (
                <div key={token.tokenAddress} className={classNames('p-4', i % 2 === 0 ? 'bg-dark-800' : 'bg-dark-900')}>
                  <div className="grid grid-cols-8 gap-4 items-center">
                    {/* Token Info */}
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-12 h-12 flex-shrink-0">
                        {token.logoUrl && (
                          <img 
                            src={token.logoUrl} 
                            alt={token.name} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <Typography variant="lg" className="text-blue font-bold truncate">
                            {token.website ? (
                              <a 
                                href={token.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-high-emphesis"
                              >
                                {token.name}
                              </a>
                            ) : token.name}
                          </Typography>
                          <Typography variant="sm" className="text-secondary whitespace-nowrap">
                            [{token.symbol}]
                          </Typography>
                        </div>
                        <Typography variant="xs" className="text-secondary truncate">
                          <a 
                            href={`https://explorer.xinfin.network/tokens/${token.tokenAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-high-emphesis"
                          >
                            {truncateAddress(token.tokenAddress)}
                          </a>
                        </Typography>
                        <div className="flex gap-2 mt-1">
                          {token.website && (
                            <a href={token.website} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-blue hover:text-high-emphesis"
                            >
                              <span role="img" aria-label="website" className="text-lg">
                                🌐
                              </span>
                            </a>
                          )}
                          <a href={`https://geckoterminal.com/xdc/pools/${token.lpAddress}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-blue hover:text-high-emphesis"
                          >
                            <span role="img" aria-label="gecko terminal" className="text-lg">
                              🦎📊
                            </span>
                          </a>
                          <a href={`/swap?inputCurrency=ETH&outputCurrency=${token.tokenAddress}`}
                             className="text-blue hover:text-high-emphesis"
                          >
                            <span role="img" aria-label="swap" className="text-lg">
                              ♻️
                            </span>
                          </a>
                          <a href={`https://explorer.xinfin.network/tokens/${token.lpAddress}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-blue hover:text-high-emphesis"
                          >
                            <span role="img" aria-label="liquidity pool" className="text-lg">
                              🌊
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Price - calculated from LP */}
                    <div className="text-right">
                      <Typography variant="xs" className="text-secondary">
                        {formatPrice(token.price)}
                      </Typography>
                    </div>

                    {/* Market Cap - calculated */}
                    <div className="text-right">
                      <Typography variant="xs" className="text-secondary">
                        {formatMarketCap(token.marketCap)}
                      </Typography>
                    </div>

                    {/* Dev Allocation - from Firebase */}
                    <div className="text-right">
                      <Typography variant="xs" className="text-secondary">
                        {token.devAllocation}%
                      </Typography>
                    </div>

                    {/* LP Allocation - from Firebase */}
                    <div className="text-right">
                      <Typography variant="xs" className="text-secondary">
                        {token.lpAllocation}%
                      </Typography>
                    </div>

                    {/* Initial Liquidity - from Firebase */}
                    <div className="text-right">
                      <Typography variant="xs" className="text-secondary">
                        {token.initialLiquidity} XDC
                      </Typography>
                    </div>

                    {/* Created */}
                    <div className="text-right">
                      <Typography variant="xs" className="text-secondary">
                        {formatDistanceToNow(token.createdAt, { addSuffix: true })}
                      </Typography>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Frame>

      {/* Pagination */}
      <Frame animate level={3} corners={4} layer='primary'>
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
          <div className="flex items-center gap-2">
            <Typography variant="sm" className="text-secondary whitespace-nowrap">
              Showing {filteredTokens.length} {searchTerm ? 'matching ' : ''}tokens
            </Typography>
            <select 
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value))
                setPage(0)
              }}
              className="bg-dark-900 text-secondary p-1 rounded"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <Typography variant="sm" className="text-secondary whitespace-nowrap">
              {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredTokens.length)} of {filteredTokens.length}
            </Typography>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                disabled={page === 0}
                className="p-1 text-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(prev => prev + 1)}
                disabled={(page + 1) * rowsPerPage >= filteredTokens.length}
                className="p-1 text-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </Frame>
    </>
  )
}
