import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { Frame } from 'arwes'
import { useState } from 'react'

interface TokenInfo {
  symbol: string
  icon?: string
}

interface FilterButtonProps {
  token: TokenInfo
  isActive: boolean
  onToggle: (symbol: string) => void
}

const FilterButton: React.FC<FilterButtonProps> = ({ token, isActive, onToggle }) => {
  const [imgError, setImgError] = useState(false)

  const handleImgError = () => {
    setImgError(true)
  }

  return (
    <Frame
      animate={true}
      corners={2}
      className={classNames(
        'px-3 py-2 cursor-pointer transition-all duration-200 hover:opacity-80',
        isActive ? 'bg-blue' : 'bg-dark-800'
      )}
      onClick={() => onToggle(token.symbol)}
    >
      <div className="flex items-center gap-2">
        {token.icon && !imgError ? (
          <div className="w-5 h-5 rounded-full overflow-hidden">
            <img 
              src={token.icon}
              alt={token.symbol} 
              width={20}
              height={20}
              onError={handleImgError}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-dark-800 flex items-center justify-center">
            <Typography variant="sm" className="text-secondary">
              {token.symbol.charAt(0)}
            </Typography>
          </div>
        )}
        <Typography variant="sm" weight={700} className="text-high-emphesis">
          {token.symbol}
        </Typography>
      </div>
    </Frame>
  )
}

interface FarmFilterButtonsProps {
  stakeTokens: TokenInfo[]
  activeStakeTokens: string[]
  onToggleStakeToken: (symbol: string) => void
}

const FarmFilterButtons: React.FC<FarmFilterButtonsProps> = ({
  stakeTokens,
  activeStakeTokens,
  onToggleStakeToken,
}) => {
  const { i18n } = useLingui()

  return (
    <div className="flex gap-8 mb-4">
      <div>
        <Typography variant="sm" weight={700} className="mb-2">
          {i18n._(t`Filter by Token`)}
        </Typography>
        <div className="flex flex-wrap gap-2">
          {stakeTokens.map((token) => (
            <FilterButton
              key={token.symbol}
              token={token}
              isActive={activeStakeTokens.includes(token.symbol)}
              onToggle={onToggleStakeToken}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FarmFilterButtons 