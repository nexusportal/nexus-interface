import { ChainId, Token } from '@sushiswap/core-sdk'

export const USDC = new Token(ChainId.XRPL, '0x0BDbb2Ea54a368232d6F3a8F96125eED1E93EA52', 18, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.XRPL, '0xFBbC26Cc2e974dC848e1FDC95860D57aB4Ed233d', 18, 'USDT', 'Tether USD')
export const WBTC = new Token(ChainId.XRPL, '0x1C9447EFcF0a8F06aB28360310272872FA0D938b', 18, 'WBTC', 'Wrapped Bitcoin')
export const WETH = new Token(ChainId.XRPL, '0xe8e01cbBE3f0ef723C9F13d260477335a4C0a948', 18, 'WXRPL', 'Wrapped XRPL EVM')
export const WXRP = new Token(ChainId.XRPL, '0xe8e01cbBE3f0ef723C9F13d260477335a4C0a948', 18, 'WXRPL', 'Wrapped XRPL EVM')
export const TOKENONE = new Token(ChainId.XRPL, '0x77926DA2d20D32f6F1F5f65621296290d589caA9', 18, 'ONE', 'TOKENONE')
export const TOKENTWO = new Token(ChainId.XRPL, '0xEb7541D63C9d7E922E7f58A7bAA83c4C5fB91060', 18, 'TWO', 'TOKENTWO')
export const TOKENTHREE = new Token(ChainId.XRPL, '0x2Ce736fCCD5924Ac434cFb58D812c8809d1f0109', 18, 'THREE', 'TOKENTHREE')

export const NEXUS = new Token(ChainId.XRPL, '0xE268aDBDBAEC092C3822dCc00b47CBCE58A9E49e', 18, 'NEXU', 'Nexus')