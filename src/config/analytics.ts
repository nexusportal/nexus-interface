import { ChainId } from '@sushiswap/core-sdk'

const analytics = {
  [ChainId.ETHEREUM]: 'https://analytics.sushi.com',
  [ChainId.MATIC]: 'https://analytics-polygon.sushi.com',
  [ChainId.FANTOM]: 'https://analytics-ftm.sushi.com',
  [ChainId.BSC]: 'https://analytics-bsc.sushi.com',
  [ChainId.XDAI]: 'https://analytics-xdai.sushi.com',
  [ChainId.HARMONY]: 'https://analytics-harmony.sushi.com',
  [ChainId.ARBITRUM]: 'https://analytics-arbitrum.sushi.com',
  [ChainId.XRPL]: 'https://analytics-xrpl.sushi.com',
  [ChainId.XDC]: 'https://analytics-xdc.sushi.com',
  [ChainId.APOTHEM]: 'https://analytics-txdc.sushi.com',
}

export default analytics
