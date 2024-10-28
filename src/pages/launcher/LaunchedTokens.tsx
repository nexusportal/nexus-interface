import React, { useEffect, useState } from 'react'
import { Frame } from 'arwes'
import Typography from 'app/components/Typography'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { ExternalLinkIcon } from '@heroicons/react/solid'

interface TokenData {
  name: string
  symbol: string
  address: string
  price: number
  price_5m: number
  price_1h: number
  price_24h: number
  price_7d: number
  volume_24h: number
  volume_24h_change: number
  total_volume: number
  created_at: string
  tvl: number
  market_cap: number
  holders: number
  audit: boolean
}

type SortConfig = {
  key: keyof TokenData
  direction: 'asc' | 'desc'
}

export default function LaunchedTokens() {
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'created_at', direction: 'desc' })
  const [recentlyLaunched, setRecentlyLaunched] = useState<TokenData | null>(null)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch('https://api.geckoterminal.com/api/v2/networks/xdc/tokens')
        const data = await response.json()
        setTokens(data.tokens)
      } catch (error) {
        console.error('Error fetching tokens:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  useEffect(() => {
    if (recentlyLaunched) {
      setTokens(prevTokens => [recentlyLaunched, ...prevTokens])
      setRecentlyLaunched(null)
    }
  }, [recentlyLaunched])

  const handleSort = (key: keyof TokenData) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  const sortedTokens = [...tokens].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  return (
    <Frame animate level={3} corners={4} layer='primary'>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark-900">
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('name')}>
                Token Info
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('price')}>
                Price
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('price_5m')}>
                5m
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('price_1h')}>
                1h
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('price_24h')}>
                24h
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('price_7d')}>
                7d
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('volume_24h')}>
                24h Vol
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('volume_24h_change')}>
                24h Vol Chg
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('total_volume')}>
                Total Vol
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('created_at')}>
                Created ▼
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('tvl')}>
                TVL
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('market_cap')}>
                Market Cap
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('holders')}>
                Holders
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary cursor-pointer" onClick={() => handleSort('audit')}>
                Audit
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={14} className="px-4 py-3 text-center">
                  <Typography variant="sm" className="text-secondary">Loading...</Typography>
                </td>
              </tr>
            ) : sortedTokens.map((token, i) => (
              <tr key={token.address} className={i % 2 === 0 ? 'bg-dark-800' : 'bg-dark-900'}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <Typography variant="sm" className="text-blue">{token.name}</Typography>
                      <Typography variant="xs" className="text-secondary">{token.symbol}</Typography>
                    </div>
                    <a 
                      href={`https://explorer.xinfin.network/tokens/${token.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue hover:text-high-emphesis"
                    >
                      <ExternalLinkIcon width={16} height={16} />
                    </a>
                  </div>
                </td>
                <td className="px-4 py-3 text-blue">${token.price.toFixed(6)}</td>
                <td className="px-4 py-3 text-blue">{token.price_5m.toFixed(2)}%</td>
                <td className="px-4 py-3 text-blue">{token.price_1h.toFixed(2)}%</td>
                <td className="px-4 py-3 text-blue">{token.price_24h.toFixed(2)}%</td>
                <td className="px-4 py-3 text-blue">{token.price_7d.toFixed(2)}%</td>
                <td className="px-4 py-3 text-blue">${token.volume_24h.toLocaleString()}</td>
                <td className="px-4 py-3 text-blue">{token.volume_24h_change.toFixed(2)}%</td>
                <td className="px-4 py-3 text-blue">${token.total_volume.toLocaleString()}</td>
                <td className="px-4 py-3 text-secondary">{new Date(token.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-blue">${token.tvl.toLocaleString()}</td>
                <td className="px-4 py-3 text-blue">${token.market_cap.toLocaleString()}</td>
                <td className="px-4 py-3 text-blue">{token.holders.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${token.audit ? 'bg-green text-high-emphesis' : 'bg-red text-high-emphesis'}`}>
                    {token.audit ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  )
}
