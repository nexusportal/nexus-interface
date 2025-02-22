import { classNames } from 'app/functions'
import React, { FC, useState } from 'react'

import Image from '../Image'

export const UNKNOWN_ICON = 'https://raw.githubusercontent.com/sushiswap/icons/master/token/unknown.png'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

interface LogoProps {
  srcs: string[]
  width: string | number
  height: string | number
  alt?: string
  className?: string
  style?: React.CSSProperties
  unoptimized?: boolean
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: FC<LogoProps> = ({ srcs, width, height, alt = '', className, style, unoptimized }) => {
  const [, refresh] = useState<number>(0)
  const src = srcs.find((src) => !BAD_SRCS[src])
  return (
    <div className="rounded-full" style={{ width, height, ...style }}>
      <Image
        src={src || UNKNOWN_ICON}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh((i) => i + 1)
        }}
        width={width}
        height={height}
        alt={alt}
        layout="fixed"
        className={classNames('rounded-full', className)}
        unoptimized={unoptimized}
      />
    </div>
  )
}

export default Logo
