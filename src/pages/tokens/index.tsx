import Container from 'app/components/Container'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Frame, Loading, Heading } from 'arwes'
import Typography from 'app/components/Typography'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { ExternalLinkIcon, GlobeIcon, InformationCircleIcon } from '@heroicons/react/solid'
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
import { Dialog } from '@headlessui/react'
import { Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
  totalSupply: string
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

// Add helper function to format total supply
const formatTotalSupply = (supply: string | undefined) => {
  if (!supply) return '-'
  const num = parseFloat(supply)
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`
  }
  return num.toLocaleString()
}

// Add this helper function at the top with other helpers
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      // You could add a toast notification here if you want
      console.log('Copied to clipboard')
    })
    .catch((err) => {
      console.error('Failed to copy:', err)
    })
}

interface DescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  token: TokenData | null
}

// Update the DescriptionModal component
const DescriptionModal = ({ isOpen, onClose, token }: DescriptionModalProps) => {
  const [showCopied, setShowCopied] = useState(false);

  if (!isOpen || !token) return null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(token.tokenAddress);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000); // Hide after 2 seconds
  };

  // Update the address and copy button section
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <Frame
          animate
          level={3}
          corners={4}
          layer='primary'
          className="relative bg-dark-900 max-w-2xl w-full"
        >
          <div className="p-5">
            {/* Header with Logo */}
            <div className="flex items-center gap-4 mb-5">
              {token.logoUrl && (
                <Image
                  src={token.logoUrl}
                  alt={token.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="text-2xl font-bold text-grey mb-1">
                  {token.name} <span className="text-secondary">({token.symbol})</span>
                </h3>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://xdcscan.com/token/${token.tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue hover:text-high-emphesis text-sm"
                  >
                    {truncateAddress(token.tokenAddress)}
                  </a>
                  <div className="relative flex items-center gap-1">
                    <button
                      onClick={handleCopy}
                      className="text-secondary hover:text-high-emphesis transition-colors"
                    >
                      <span role="img" aria-label="copy" className="text-sm">
                        📋
                      </span>
                    </button>
                    {showCopied && (
                      <span className="absolute left-full ml-2 whitespace-nowrap text-xs text-green animate-fade-in-out">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Token Information Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <Frame animate level={2} corners={2} className="p-4">
                <div className="space-y-3">
                  <h4 className="text-grey font-medium">Token Details</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-grey">Total Supply:</span>{' '}
                      <span className="text-secondary">{formatTotalSupply(token.totalSupply)}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-grey">Market Cap:</span>{' '}
                      <span className="text-secondary">{formatMarketCap(token.marketCap)}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-grey">Price:</span>{' '}
                      <span className="text-secondary">{formatPrice(token.price)}</span>
                    </p>
                  </div>
                </div>
              </Frame>

              <Frame animate level={2} corners={2} className="p-4">
                <div className="space-y-3">
                  <h4 className="text-grey font-medium">Launch Details</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-grey">LP Allocation:</span>{' '}
                      <span className="text-secondary">{token.lpAllocation}%</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-grey">Dev Allocation:</span>{' '}
                      <span className="text-secondary">{token.devAllocation}%</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-grey">Initial Liquidity:</span>{' '}
                      <span className="text-secondary">{token.initialLiquidity} XDC</span>
                    </p>
                  </div>
                </div>
              </Frame>
            </div>

            {/* Description */}
            <Frame animate level={2} corners={2} className="p-4 mb-5">
              <div className="space-y-2">
                <h4 className="text-grey font-medium">Description</h4>
                <p className="text-sm text-secondary whitespace-pre-wrap">
                  {token.description || 'No description available'}
                </p>
              </div>
            </Frame>

            {/* Links */}
            <Frame animate level={2} corners={2} className="p-4 mb-5">
              <div className="space-y-2">
                <h4 className="text-grey font-medium">Links</h4>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={token.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue hover:text-high-emphesis text-sm flex items-center gap-1"
                  >
                    🌐 Website
                  </a>
                  <a
                    href={`https://xdcscan.com/token/${token.tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue hover:text-high-emphesis text-sm flex items-center gap-1"
                  >
                    🔍 Token Contract
                  </a>
                  <a
                    href={`https://xdcscan.com/token/${token.lpAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue hover:text-high-emphesis text-sm flex items-center gap-1"
                  >
                    🌊 LP Contract
                  </a>
                  <a
                    href={`https://geckoterminal.com/xdc/pools/${token.lpAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue hover:text-high-emphesis text-sm flex items-center gap-1"
                  >
                    📊 Chart
                  </a>
                  <a
                    href={`/legacy/swap/${token.tokenAddress}`}
                    className="text-blue hover:text-high-emphesis text-sm flex items-center gap-1"
                  >
                    <span role="img" aria-label="swap" className="text-base">
                      💱
                    </span>
                  </a>
                  <a href={`https://xdcscan.com/token/${token.lpAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue hover:text-high-emphesis"
                  >
                    <span role="img" aria-label="liquidity pool" className="text-base">
                      🌊
                    </span>
                  </a>
                </div>
              </div>
            </Frame>

            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-blue hover:bg-blue/80 text-high-emphesis px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Frame>
      </div>
    </div>
  );
};

export default function Tokens() {
  // ALL hooks at the top
  const { chainId } = useActiveWeb3React()
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<keyof TokenData>('launchDate')
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [xdcPrice, setXdcPrice] = useState<number | null>(null)
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)

  // useEffect after state hooks
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
  }, [])

  // Chain check AFTER all hooks
  if (chainId !== ChainId.XDC) {
    return (
      <Container id="tokens-page" className="py-4 md:py-8 lg:py-12" maxWidth="7xl">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Frame animate level={3} corners={4} layer='alert'>
            <div className="p-4">
              <Typography variant="lg" className="text-high-emphesis text-center">
                Launcher Is Only Available On XDC!
              </Typography>
            </div>
          </Frame>
        </div>
      </Container>
    )
  }

  // Add filtered tokens
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

  // Add handleSort function
  const handleSort = (column: keyof TokenData | 'price' | 'marketCap') => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column as keyof TokenData)
      setSortDirection('asc')
    }
  }

  // Add handleTokenClick function
  const handleTokenClick = (token: TokenData) => {
    setSelectedToken(token)
    setIsDescriptionModalOpen(true)
  }

  return (
    <Container id="tokens-page" className="py-4 md:py-8 lg:py-12" maxWidth="7xl">
      <Head>
        <title>Tokens | NEXUSSwap</title>
        <meta key="description" name="description" content="NEXUSSwap tokens." />
        <meta key="twitter:description" name="twitter:description" content="NEXUSSwap tokens." />
        <meta key="og:description" property="og:description" content="NEXUSSwap tokens." />
      </Head>

      <div className="flex items-center justify-start gap-10 px-10 mb-6">
        <Loading animate />
        <Heading className="!m-0">
          TOKENS BETA
        </Heading>
      </div>

      <div className="flex flex-col gap-4">
        {/* Search Box - Made responsive */}
        <div className="w-full px-2 sm:px-4">
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

        {/* Wrap both header and content in the same scrollable container */}
        <div className="w-full overflow-x-auto px-2 sm:px-4">
          <div className="min-w-[1000px]">
            {/* Table Header */}
            <Frame animate level={3} corners={4} layer='primary'>
              <div className="grid grid-cols-9">
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

                {/* Total Supply */}
                <div className="flex gap-1 items-center cursor-pointer justify-end p-3"
                  onClick={() => handleSort('totalSupply')}>
                  <Typography variant="sm" weight={700}>
                    Total Supply 📈
                  </Typography>
                  {sortBy === 'totalSupply' && (
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

            {/* Table Content */}
            <Frame animate level={3} corners={4} layer='primary' className="mt-3">
              <div className="divide-y divide-dark-900">
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
                      <div
                        key={token.tokenAddress}
                        className={classNames(
                          'p-4 cursor-pointer transition-colors duration-200 hover:bg-green/20',
                          i % 2 === 0 ? 'bg-dark-800' : 'bg-dark-900'
                        )}
                        onClick={() => handleTokenClick(token)}
                      >
                        <div className="grid grid-cols-9 gap-4 items-center">
                          {/* Token Info */}
                          <div className="col-span-2 flex items-center gap-3">
                            <div className="w-12 h-12 flex-shrink-0">
                              {token.logoUrl && (
                                <Image
                                  src={token.logoUrl}
                                  alt={token.name}
                                  width={48}
                                  height={48}
                                  className="rounded-full object-cover"
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
                                  href={`https://xdcscan.com/token/${token.tokenAddress}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-high-emphesis"
                                >
                                  {truncateAddress(token.tokenAddress)}
                                </a>
                              </Typography>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {token.website && (
                                  <a href={token.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue hover:text-high-emphesis"
                                  >
                                    <span role="img" aria-label="website" className="text-base">
                                      🌐
                                    </span>
                                  </a>
                                )}
                                <a href={`https://geckoterminal.com/xdc/pools/${token.lpAddress}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue hover:text-high-emphesis"
                                >
                                  <span role="img" aria-label="gecko terminal" className="text-base">
                                    📊
                                  </span>
                                </a>
                                <a
                                  href={`/legacy/swap/${token.tokenAddress}`}
                                  className="text-blue hover:text-high-emphesis"
                                >
                                  <span role="img" aria-label="swap" className="text-base">
                                    💱
                                  </span>
                                </a>
                                <a href={`https://xdcscan.com/token/${token.lpAddress}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue hover:text-high-emphesis"
                                >
                                  <span role="img" aria-label="liquidity pool" className="text-base">
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

                          {/* Total Supply - Moved here */}
                          <div className="text-right">
                            <Typography variant="xs" className="text-secondary">
                              {formatTotalSupply(token.totalSupply)}
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
          </div>
        </div>

        {/* Pagination - Made responsive */}
        <div className="w-full px-2 sm:px-4">
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
        </div>
      </div>

      <DescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => {
          setIsDescriptionModalOpen(false);
          setSelectedToken(null);
        }}
        token={selectedToken}
      />
    </Container>
  )
}
