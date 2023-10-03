export const farms = [
  //TWO / THREE
  {
    accSushiPerShare: '',
    allocPoint: 10,
    balance: 0,
    chef: 0,
    id: '0',
    lastRewardTime: 12505142,
    owner: {
      id: '0x58Bd25E8A922550Df320815575B632B011b7F2B8',
      totalAllocPoint: 100,
    },
    pair: '0xa047e33ef82473db9f0e39dc52da1b9484e768e3',
    slpBalance: 0,
    userCount: '1',
  },
  // ONE / THREE
  {
    accSushiPerShare: '',
    allocPoint: 10,
    balance: 0,
    chef: 0,
    id: '1',
    lastRewardTime: 12505142,
    owner: {
      id: '0x58Bd25E8A922550Df320815575B632B011b7F2B8',
      totalAllocPoint: 100,
    },
    pair: '0x23c2cfd4028bca4a79e0238716000fb0a2f4a1f9',
    slpBalance: 0,
    userCount: '0',
  },
  //ONE/TWO
  {
    accSushiPerShare: '',
    allocPoint: 10,
    balance: 0,
    chef: 0,
    id: '2',
    lastRewardTime: 12505142,
    owner: {
      id: '0x58Bd25E8A922550Df320815575B632B011b7F2B8',
      totalAllocPoint: 100,
    },
    pair: '0x61cd5d62f23acd3620377279b943aaa8ecf612f7',
    slpBalance: 0,
    userCount: '0',
  },
  {
    accSushiPerShare: '',
    allocPoint: 10,
    balance: 0,
    chef: 0,
    id: '3',
    lastRewardTime: 12505142,
    owner: {
      id: '0x58Bd25E8A922550Df320815575B632B011b7F2B8',
      totalAllocPoint: 100,
    },
    pair: '0xa84f27d52eb96d8a5caf03350472c077f5c970ea',
    slpBalance: 0,
    userCount: '0',
  },
  // //NEXU/WETH
  {
    accSushiPerShare: '',
    allocPoint: 10,
    balance: 0,
    chef: 0,
    id: '4',
    lastRewardTime: 12505142,
    owner: {
      id: '0x58Bd25E8A922550Df320815575B632B011b7F2B8',
      totalAllocPoint: 100,
    },
    pair: '0xb0a0021675fba794bbd530f575e71211e7947ae2',
    slpBalance: 0,
    userCount: '0',
  },
  {
    accSushiPerShare: '',
    allocPoint: 10,
    balance: 0,
    chef: 0,
    id: '5',
    lastRewardTime: 12505142,
    owner: {
      id: '0x58Bd25E8A922550Df320815575B632B011b7F2B8',
      totalAllocPoint: 100,
    },
    pair: '0x4cb3ba9e8fb8074a267bee119dc9bd0c793c36ea',
    slpBalance: 0,
    userCount: '0',
  },
]
export const swapPairs: {
  decimals: number;
  id: string;
  reserve0: number;
  reserve1: number;
  reserveETH: number;
  reserveUSD: number;
  timestamp: number;
  token0: { derivedETH: number, id: string, name: string, symbol: string, totalSupply: number };
  token0Price: number;
  token1: { derivedETH: number, id: string, name: string, symbol: string, totalSupply: number };
  token1Price: number;
  totalSupply: number;
  trackedReserveETH: number;
  txCount: number;
  untrackedVolumeUSD: number;
  volumeUSD: number;
  type?: number;
}[] = [
    //NEXU/XRP
    {
      decimals: 18,
      id: '0xa047e33ef82473db9f0e39dc52da1b9484e768e3',
      reserve0: 9990.04,
      reserve1: 1.001,
      reserveETH: 2,
      reserveUSD: 10,
      timestamp: 1621898381,
      token0: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0xe8e01cbBE3f0ef723C9F13d260477335a4C0a948',
        name: 'Wrapped XRP',
        symbol: 'WXRP',
        totalSupply: 1680,
      },
      token0Price: 0.00048,
      token1: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0x2Ce736fCCD5924Ac434cFb58D812c8809d1f0109',
        name: 'TOKENTHREE',
        symbol: 'THREE',
        totalSupply: 1680,
      },

      token1Price: 0.2,
      totalSupply: 0.316227765016,
      trackedReserveETH: 1183.351142427706157233201110976883,
      txCount: 81365,
      untrackedVolumeUSD: 46853.79482616671033425777223395,
      volumeUSD: 4684.23711596607606598865310647,
    },
    //ONE/THREE
    {
      decimals: 18,
      id: '0x23c2cfd4028bca4a79e0238716000fb0a2f4a1f9',
      reserve0: 9990.04,
      reserve1: 1.001,
      reserveETH: 2,
      reserveUSD: 10,
      timestamp: 1621898381,
      token0: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0xE268aDBDBAEC092C3822dCc00b47CBCE58A9E49e',
        name: 'Nexus Token',
        symbol: 'NEXU',
        totalSupply: 1680,
      },
      token0Price: 0.00048,
      token1: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0xe8e01cbBE3f0ef723C9F13d260477335a4C0a948',
        name: 'Wrapped XRP',
        symbol: 'WXRP',
        totalSupply: 1680,
      },

      token1Price: 0.2,
      totalSupply: 0.316227765016,
      trackedReserveETH: 1183.351142427706157233201110976883,
      txCount: 81365,
      untrackedVolumeUSD: 46853.79482616671033425777223395,
      volumeUSD: 4684.23711596607606598865310647,
    },
    //ONE/TWO
    {
      decimals: 18,
      id: '0x61cd5d62f23acd3620377279b943aaa8ecf612f7',
      reserve0: 9990.04,
      reserve1: 1.001,
      reserveETH: 2,
      reserveUSD: 10,
      timestamp: 1621898381,
      token0: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0xE268aDBDBAEC092C3822dCc00b47CBCE58A9E49e',
        name: 'Nexu Token',
        symbol: 'NEXU',
        totalSupply: 1680,
      },
      token0Price: 0.00048,
      token1: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0xEb7541D63C9d7E922E7f58A7bAA83c4C5fB91060',
        name: 'TOKENTWO',
        symbol: 'TWO',
        totalSupply: 1680,
      },
      token1Price: 0.2,
      totalSupply: 0.316227765016,
      trackedReserveETH: 1183.351142427706157233201110976883,
      txCount: 81365,
      untrackedVolumeUSD: 46853.79482616671033425777223395,
      volumeUSD: 4684.23711596607606598865310647,
    },
    //NEXU/WETH
    {
      decimals: 18,
      id: '0xb0a0021675fba794bbd530f575e71211e7947ae2',
      reserve0: 9990.04,
      reserve1: 1.001,
      reserveETH: 2,
      reserveUSD: 10,
      timestamp: 1621898381,
      token0: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0x2Ce736fCCD5924Ac434cFb58D812c8809d1f0109',
        name: 'TOKENTHREE',
        symbol: 'THREE',
        totalSupply: 1680,
      },
      token0Price: 0.00048,
      token1: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0xEb7541D63C9d7E922E7f58A7bAA83c4C5fB91060',
        name: 'TOKENTWO',
        symbol: 'TWO',
        totalSupply: 1680,
      },

      token1Price: 0.2,
      totalSupply: 0.316227765016,
      trackedReserveETH: 1183.351142427706157233201110976883,
      txCount: 81365,
      untrackedVolumeUSD: 46853.79482616671033425777223395,
      volumeUSD: 4684.23711596607606598865310647,
    },
    //NEXU/WETH
    {
      decimals: 18,
      id: '0x4cb3ba9e8fb8074a267bee119dc9bd0c793c36ea',
      reserve0: 9990.04,
      reserve1: 1.001,
      reserveETH: 2,
      reserveUSD: 10,
      timestamp: 1621898381,
      token0: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0x2Ce736fCCD5924Ac434cFb58D812c8809d1f0109',
        name: 'TOKENTHREE',
        symbol: 'THREE',
        totalSupply: 1680,
      },
      token0Price: 0.00048,
      token1: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0xE268aDBDBAEC092C3822dCc00b47CBCE58A9E49e',
        name: 'Nexu Token',
        symbol: 'NEXU',
        totalSupply: 1680,
      },

      token1Price: 0.2,
      totalSupply: 0.316227765016,
      trackedReserveETH: 1183.351142427706157233201110976883,
      txCount: 81365,
      untrackedVolumeUSD: 46853.79482616671033425777223395,
      volumeUSD: 4684.23711596607606598865310647,
    },
    //NEXU/WETH
    {
      decimals: 18,
      id: '0xa84f27d52eb96d8a5caf03350472c077f5c970ea',
      reserve0: 9990.04,
      reserve1: 1.001,
      reserveETH: 2,
      reserveUSD: 10,
      timestamp: 1621898381,
      token0: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0xEb7541D63C9d7E922E7f58A7bAA83c4C5fB91060',
        name: 'TOKENTWO',
        symbol: 'TWO',
        totalSupply: 1680,
      },
      token0Price: 0.00048,
      token1: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0xe8e01cbBE3f0ef723C9F13d260477335a4C0a948',
        name: 'Wrapped XRP',
        symbol: 'WXRP',
        totalSupply: 1680,
      },

      token1Price: 0.2,
      totalSupply: 0.316227765016,
      trackedReserveETH: 1183.351142427706157233201110976883,
      txCount: 81365,
      untrackedVolumeUSD: 46853.79482616671033425777223395,
      volumeUSD: 4684.23711596607606598865310647,
    },
    //NEXU/WETH
    {
      decimals: 18,
      id: '0xa84f27d52eb96d8a5caf03350472c077f5c970ea',
      reserve0: 9990.04,
      reserve1: 1.001,
      reserveETH: 2,
      reserveUSD: 10,
      timestamp: 1621898381,
      token0: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0xEb7541D63C9d7E922E7f58A7bAA83c4C5fB91060',
        name: 'TOKENTWO',
        symbol: 'TWO',
        totalSupply: 1680,
      },
      token0Price: 0.00048,
      token1: {
        derivedETH: 0.0003068283960261003490764609134664169,
        id: '0xe8e01cbBE3f0ef723C9F13d260477335a4C0a948',
        name: 'Wrapped XRP',
        symbol: 'WXRP',
        totalSupply: 1680,
      },

      token1Price: 0.2,
      totalSupply: 0.316227765016,
      trackedReserveETH: 1183.351142427706157233201110976883,
      txCount: 81365,
      untrackedVolumeUSD: 46853.79482616671033425777223395,
      volumeUSD: 4684.23711596607606598865310647,
    },
  ]