import { ChainId } from '@sushiswap/core-sdk'

const RPC: { [chainId: number]: string } = {

  [ChainId.ETHEREUM]: 'https://sgb.ftso.com.au/ext/bc/C/rpc',
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network',
  [ChainId.MATIC]: 'https://polygon-rpc.com/',
  [ChainId.MATIC_TESTNET]: 'https://rpc-mumbai.matic.today',
  [ChainId.XDAI]: 'https://rpc.xdaichain.com',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
  [ChainId.MOONBEAM_TESTNET]: 'https://rpc.testnet.moonbeam.network',
  [ChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [ChainId.AVALANCHE_TESTNET]: 'https://api.avax-test.network/ext/bc/C/rpc',
  [ChainId.HECO]: 'https://http-mainnet.hecochain.com',
  [ChainId.HECO_TESTNET]: 'https://http-testnet.hecochain.com',
  [ChainId.HARMONY]: 'https://api.harmony.one',
  [ChainId.HARMONY_TESTNET]: 'https://api.s0.b.hmny.io',
  [ChainId.OKEX]: 'https://exchainrpc.okex.org',
  [ChainId.OKEX_TESTNET]: 'https://exchaintestrpc.okex.org',
  [ChainId.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
  [ChainId.PALM]: 'https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
  [ChainId.FUSE]: 'https://rpc.fuse.io',
  [ChainId.CELO]: 'https://forno.celo.org',
  [ChainId.MOONRIVER]: 'https://rpc.moonriver.moonbeam.network',
  [ChainId.TELOS]: 'https://mainnet.telos.net/evm',
  [ChainId.XRPL]: 'https://rpc-evm-sidechain.xrpl.org',
  [ChainId.XDC]: 'https://erpc.xinfin.network/',
  [ChainId.APOTHEM]: 'https://erpc.apothem.network',
}

export default RPC
