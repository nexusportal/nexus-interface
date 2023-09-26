import { AddressMap, ChainId, JSBI, Percent } from '@sushiswap/core-sdk'

// TODO: Move some of this to config level...

// TODO: update weekly with new constant
export const WEEKLY_MERKLE_ROOT =
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-13/merkle-10959148-11550728.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-14/merkle-10959148-11596364.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-15/merkle-10959148-11641996.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-16/merkle-10959148-11687577.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-17/merkle-10959148-11733182.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-18/merkle-10959148-11778625.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-19/merkle-10959148-11824101.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-20/merkle-10959148-11869658.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-21/merkle-10959148-11915191.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-22/merkle-10959148-11960663.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-23/merkle-10959148-12006121.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-24/merkle-10959148-12051484.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-24/protocol-claim.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-24/merkle-10959148-12051484-2.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-25/merkle-10959148-12096934.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-26/merkle-10959148-12142433.json'
  'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-27/merkle-10959148-12171394.json'

export const PROTOCOL_MERKLE_ROOT =
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/protocol/merkle-10959148-12171394.json'
  'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/protocol-02/merkle-10959148-12171394.json'

export const NetworkContextName = 'NETWORK'

// 30 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%

// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%

// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')

export const ONE_HUNDRED_PERCENT = new Percent('1')

export const ANALYTICS_URL: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'https://analytics.sushi.com',
  [ChainId.MATIC]: 'https://analytics-polygon.sushi.com',
  [ChainId.FANTOM]: 'https://analytics-ftm.sushi.com',
  [ChainId.BSC]: 'https://analytics-bsc.sushi.com',
  [ChainId.XDAI]: 'https://analytics-xdai.sushi.com',
  [ChainId.HARMONY]: 'https://analytics-harmony.sushi.com',
  [ChainId.ARBITRUM]: 'https://analytics-arbitrum.sushi.com',
  [ChainId.FUSE]: 'https://analytics-fuse.sushi.com',
  [ChainId.MOONRIVER]: 'https://analytics-moonriver.sushi.com',
  [ChainId.CELO]: 'https://analytics-celo.sushi.com',
  [ChainId.XRPL]: 'https://analytics-xrpl.sushi.com',
}

export const EIP_1559_ACTIVATION_BLOCK: { [chainId in ChainId]?: number } = {
  [ChainId.ETHEREUM]: 12965000,
  [ChainId.ROPSTEN]: 10499401,
  [ChainId.GÖRLI]: 5062605,
  [ChainId.RINKEBY]: 8897988,
}

export const MASTERCHEF_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd',
  [ChainId.ROPSTEN]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  [ChainId.RINKEBY]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  [ChainId.GÖRLI]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  [ChainId.KOVAN]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  [ChainId.XRPL]: '0x6F8B1Cbc84da880c9b5D443f8EF70f6161017300',
}

export const NEXU_DISTRIBUTOR_ADDRESS = '0xD8351Aa4a3c577b9B7Db70d736A913D35E698929'

export const PROPHET_SACRIFICE_ADDRESS = '0x5BB7874602aB5Bfecef55177701e667355B8aE2c'

export const NEXUS_NFT_ADDRESS = '0x22A65cFc5092649f9608e180f8Da6720FCdB9897'

export const NEXUS_NFT_WEIGHT_ADDRESS = '0xa96d4Dfb9EED8824cae29fA0b7e62c72b5e51018'

export const NEXUS_NFT_MULTISTAKING_ADDRESS =  '0x8Ad2D1A537fe16d1C619fD877a26FA584798107f'

export const MULTISTAKING_DISTRIBUTOR_ADDRESS = '0xD8351Aa4a3c577b9B7Db70d736A913D35E698929'


export const PRO_ORALCE_DISTRIBUTOR_ADDRESS = '0x5b23CA41820cbaD7ee7359e165d16d7238a0DA83'

export const nexuTokenAddress = '0xE268aDBDBAEC092C3822dCc00b47CBCE58A9E49e';
export const wXRPAddress = '0xe8e01cbBE3f0ef723C9F13d260477335a4C0a948';
export const routerAddress = '0xd1aEb8a6B0C5453A303903F4BDE11a75D351c3bf';



