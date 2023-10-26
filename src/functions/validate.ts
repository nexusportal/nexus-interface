// CONVENTION isFoo -> boolean

import { getAddress as getAddressOrigin } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { Token } from '@sushiswap/core-sdk'
import { TokenAddressMap } from 'app/state/lists/hooks'
import { BytesLike, hexDataLength, hexDataSlice, concat } from '@ethersproject/bytes'
import { keccak256 } from '@ethersproject/keccak256'
import { Logger } from "@ethersproject/logger";
import { version } from "@ethersproject/address/src.ts/_version"
const logger = new Logger(version);

/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export function isZero(hexNumberString: string): boolean {
  return /^0x0*$/.test(hexNumberString)
}

export const isEmptyValue = (text: string) =>
  BigNumber.isBigNumber(text)
    ? BigNumber.from(text).isZero()
    : text === '' || text.replace(/0/g, '').replace(/\./, '') === ''

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    let addr = value
    if (value.startsWith("xdc")) {
      addr = "0x" + value.substring(3);
    }
    return getAddressOrigin(addr)
  } catch {
    return false
  }
}

export function getAddress(value: string | undefined): string {
  try {
    if(!value) return "";
    let addr = value
    if (value.startsWith("xdc")) {
      addr = "0x" + value.substring(3);
    }
    return getAddressOrigin(addr)
  } catch {
    return ""
  }
}

export function prefixXDCAddr(etherAddr: string | undefined): string {
  try {
    if (!etherAddr) return "";
    let addr = "";
    if (etherAddr.startsWith("0x")) {
      addr = "xdc" + getAddressOrigin(etherAddr).substring(2);
    } else {
      addr = getAddressOrigin(etherAddr);
    }
    return addr;
  } catch {
    return ""
  }
}

export function isTokenOnList(tokenAddressMap: TokenAddressMap, token?: Token): boolean {
  return Boolean(token?.isToken && tokenAddressMap[token.chainId]?.[token.address])
}

export function getCreate2Address(from: string, salt: BytesLike, initCodeHash: BytesLike): string {
  if (hexDataLength(salt) !== 32) {
    logger.throwArgumentError("salt must be 32 bytes", "salt", salt);
  }
  if (hexDataLength(initCodeHash) !== 32) {
    logger.throwArgumentError("initCodeHash must be 32 bytes", "initCodeHash", initCodeHash);
  }
  return getAddress(hexDataSlice(keccak256(concat(["0xff", getAddress(from), salt, initCodeHash])), 12))
}
