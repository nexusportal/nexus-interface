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
  [ChainId.APOTHEM]: 'https://analytics-apothem.sushi.com',
  [ChainId.XDC]: 'https://analytics-xdc.sushi.com',
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
  [ChainId.XRPL]: '0x42704Eec2B9CE8e1a18d6686365AFB7AE3CFc6E4',
  [ChainId.XDC]: '0x42704Eec2B9CE8e1a18d6686365AFB7AE3CFc6E4',
  [ChainId.APOTHEM]: '0xdE6e71E23eD53d2151687a8e2F6040c1E5D2D7cb',
}

export const NEXU_DISTRIBUTOR_ADDRESS: AddressMap = {
  [ChainId.XRPL]: '0x8E3d9073283d685bd4193923bA61D511C2cF2e94',
  [ChainId.XDC]: '0xC73F62e87bCF3F0b70a0bb49569f5C0BBa6b937B',
  [ChainId.APOTHEM]: '0xC73F62e87bCF3F0b70a0bb49569f5C0BBa6b937B',
}

export const PROPHET_SACRIFICE_ADDRESS: AddressMap = {
  [ChainId.XRPL]: '0x5BB7874602aB5Bfecef55177701e667355B8aE2c',
  [ChainId.XDC]: '0x5BB7874602aB5Bfecef55177701e667355B8aE2c',
  [ChainId.APOTHEM]: '0x5BB7874602aB5Bfecef55177701e667355B8aE2c',
}
export const NEXUS_NFT_ADDRESS: AddressMap = {
  [ChainId.XRPL]: '0xC9e107660ee34487212239F56fD0a4f696dFb33e',
  [ChainId.XDC]: '0x7174515087DE0b1dE50fADC076124284De5E17B3',
  [ChainId.APOTHEM]: '0x7174515087DE0b1dE50fADC076124284De5E17B3',
}
export const NEXUS_NFT_WEIGHT_ADDRESS: AddressMap = {
  [ChainId.XRPL]: '0xa96d4Dfb9EED8824cae29fA0b7e62c72b5e51018',
  [ChainId.XDC]: '0x220B919824F2D9546C08d1104bfae09b60B698A8',
  [ChainId.APOTHEM]: '0x220B919824F2D9546C08d1104bfae09b60B698A8',
}
export const NEXUS_NFT_MULTISTAKING_ADDRESS: AddressMap = {
  [ChainId.XRPL]: '0x8c11b4Ee3d1B48129102B9afFe498AdC65F477BD',
  [ChainId.XDC]: '0x11C921B311FF37dd2DA55D43d477AD9E8876Aa31',
  [ChainId.APOTHEM]: '0x11C921B311FF37dd2DA55D43d477AD9E8876Aa31',
}
export const MULTISTAKING_DISTRIBUTOR_ADDRESS: AddressMap = {
  [ChainId.XRPL]: '0x6ab2913205C2Ece6A837000DD389Eb56F978eC35',
  [ChainId.XDC]: '0xCd472092d063a921beF71ee2d3986C1d6c24Aa22',
  [ChainId.APOTHEM]: '0xCd472092d063a921beF71ee2d3986C1d6c24Aa22',
}
export const PRO_ORALCE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [ChainId.XRPL]: '0x5b23CA41820cbaD7ee7359e165d16d7238a0DA83',
  [ChainId.XDC]: '0x5b23CA41820cbaD7ee7359e165d16d7238a0DA83',
  [ChainId.APOTHEM]: '0x5b23CA41820cbaD7ee7359e165d16d7238a0DA83',
}
export const nexuTokenAddress: AddressMap = {
  [ChainId.XRPL]: '0xE268aDBDBAEC092C3822dCc00b47CBCE58A9E49e',
  [ChainId.XDC]: '0x997B6116f9Ec280E39C196D797b42eFA3E76B0F4',
  [ChainId.APOTHEM]: '0x997B6116f9Ec280E39C196D797b42eFA3E76B0F4',
}
export const wXRPAddress: AddressMap = {
  [ChainId.XRPL]: '0xe8e01cbBE3f0ef723C9F13d260477335a4C0a948',
  [ChainId.XDC]: '0xF686c5A86d3AE6182E0E015b411BD01cD8b06662',
  [ChainId.APOTHEM]: '0xF686c5A86d3AE6182E0E015b411BD01cD8b06662',
}
export const routerAddress: AddressMap = {
  [ChainId.XRPL]: '0xd1aEb8a6B0C5453A303903F4BDE11a75D351c3bf',
  [ChainId.XDC]: '0xA07C07943bca3B237f23ceCd41D162d84925427e',
  [ChainId.APOTHEM]: '0xA07C07943bca3B237f23ceCd41D162d84925427e',
}



