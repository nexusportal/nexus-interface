import { BigNumber } from '@ethersproject/bignumber'
import { useCallback, useState, useMemo } from 'react'

interface SortConfig {
  key: string
  direction: 'ascending' | 'descending'
}

function getNested(theObject: any, path: string, separator = '.') {
  try {
    return path
      .replace('[', separator)
      .replace(']', '')
      .split(separator)
      .reduce((obj, property) => {
        return obj[property]
      }, theObject)
  } catch (err) {
    return undefined
  }
}

export default function useSortableData(items: any[], config: SortConfig | null = null) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(config)

  const sortedItems = useMemo(() => {
    let sortableItems = [...items]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any = a[sortConfig.key]
        let bValue: any = b[sortConfig.key]

        // Special handling for nested properties using dot notation
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.')
          aValue = keys.reduce((obj: any, key: string) => obj?.[key], a)
          bValue = keys.reduce((obj: any, key: string) => obj?.[key], b)
        }

        // Special handling for allocPoint percentage
        if (sortConfig.key === 'allocPoint') {
          aValue = (a.allocPoint * 100) / a.owner.totalAllocPoint
          bValue = (b.allocPoint * 100) / b.owner.totalAllocPoint
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

  const requestSort = useCallback(
    (key: string) => {
      let direction: 'ascending' | 'descending' = 'descending'
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') {
        direction = 'ascending'
      }
      setSortConfig({ key, direction })
    },
    [sortConfig]
  )

  return { items: sortedItems, requestSort, sortConfig }
}
