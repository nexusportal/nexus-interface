import React, { useState, useCallback, useEffect } from 'react'

import { i18n } from '@lingui/core'

import { t } from '@lingui/macro'

import { Frame } from 'arwes'

import { useLauncher } from '../../hooks/useLauncher'

import { useActiveWeb3React } from 'app/services/web3'

import { useTransactionAdder } from 'app/state/transactions/hooks'

import Button from 'app/components/Button'

import Typography from 'app/components/Typography'

import Web3Connect from 'app/components/Web3Connect'

import TransactionConfirmationModal from 'app/modals/TransactionConfirmationModal'

import { HeadlessUiModal } from 'app/components/Modal'

import LaunchedTokens from './LaunchedTokens'

const MIN_INITIAL_LIQUIDITY = '1'

export default function TokenLauncher() {
  const { account } = useActiveWeb3React()
  const { createToken, isLoading, nativeFee } = useLauncher()
  const addTransaction = useTransactionAdder()
  
  const [activeView, setActiveView] = useState<'launcher' | 'tokens'>('launcher')
  
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
    lpPercent: '95',
    devPercent: '4',
    initialLiquidity: MIN_INITIAL_LIQUIDITY,
    description: '',
    website: '',
    logo: null as File | null,
  })

  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const [pendingTx, setPendingTx] = useState(false)

  const handleCreateToken = useCallback(async () => {
    if (!account) return
    if (!formData.name || !formData.symbol || !formData.totalSupply || !formData.lpPercent || !formData.devPercent || !formData.logo || !formData.website || Number(formData.initialLiquidity) < Number(MIN_INITIAL_LIQUIDITY)) {
      alert('Please fill in all required fields and ensure initial liquidity meets minimum requirement')
      return
    }
    
    const urlPattern = /^https?:\/\/.+\..+/
    if (!urlPattern.test(formData.website)) {
      alert('Please enter a valid website URL (must start with http:// or https://)')
      return
    }

    setPendingTx(true)
    setShowConfirm(true)

    try {
      const result = await createToken({
        name: formData.name,
        symbol: formData.symbol,
        totalSupply: formData.totalSupply,
        lpPercent: formData.lpPercent,
        devPercent: formData.devPercent,
        initialLiquidity: formData.initialLiquidity,
        description: formData.description,
        website: formData.website,
        logoFile: formData.logo // Make sure to pass the logo file
      })

      setTxHash(result.hash)

    } catch (error) {
      console.error(error)
      setShowConfirm(false)
    }

    setPendingTx(false)
  }, [account, formData, createToken, addTransaction])

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
  }, [txHash])

  useEffect(() => {
    if (!txHash) return;
    setPendingTx(false);
  }, [txHash])

  const handleLPChange = (value: string) => {
    const lpValue = Number(value)
    if (lpValue >= 0 && lpValue <= 99) {
      setFormData(prev => ({
        ...prev,
        lpPercent: value,
        devPercent: (99 - lpValue).toString()
      }))
    }
  }

  const handleDevChange = (value: string) => {
    const devValue = Number(value)
    if (devValue >= 0 && devValue <= 50) {
      setFormData(prev => ({
        ...prev,
        devPercent: value,
        lpPercent: (99 - devValue).toString()
      }))
    }
  }

  const validateImage = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return 'Logo must be JPG, PNG, or GIF format'
    }

    const maxSize = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > maxSize) {
      return 'Logo must be under 2MB'
    }

    return null
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const error = validateImage(file)
    if (error) {
      alert(error)
      e.target.value = '' // Reset input
      return
    }

    setFormData(prev => ({ ...prev, logo: file }))
  }

  return (
    <div className="flex flex-col mt-12">
      <div className="flex justify-center gap-4 mb-8">
        <Frame
          animate
          level={activeView === 'launcher' ? 3 : 1}
          corners={4}
          layer={activeView === 'launcher' ? 'success' : 'primary'}
          className="hover:opacity-80 transition duration-200"
        >
          <button
            className={`px-8 py-3 text-sm font-bold ${
              activeView === 'launcher' ? 'text-green' : 'text-blue'
            } hover:brightness-110 transition duration-200`}
            onClick={() => setActiveView('launcher')}
          >
            Launch Token
          </button>
        </Frame>

        <Frame
          animate
          level={activeView === 'tokens' ? 3 : 1}
          corners={4}
          layer={activeView === 'tokens' ? 'success' : 'primary'}
          className="hover:opacity-80 transition duration-200"
        >
          <button
            className={`px-8 py-3 text-sm font-bold ${
              activeView === 'tokens' ? 'text-green' : 'text-blue'
            } hover:brightness-110 transition duration-200`}
            onClick={() => setActiveView('tokens')}
          >
            Token List
          </button>
        </Frame>
      </div>

      {activeView === 'launcher' ? (
        <div className="flex flex-wrap">
          <div className="w-full md:w-[calc(100%-316px)] md:mr-4">
            <Frame animate level={3} corners={4} layer='primary'>
              <div className="flex flex-col gap-4 p-4" style={{ maxWidth: '480px' }}>
                <Typography variant="h3" weight={700} className="text-high-emphesis mb-4">
                  {i18n._(t`Launch Your Token`)}
                </Typography>

                <Typography variant="sm" className="text-grey">
                  Launch your own token! There is a {nativeFee} XDC fee to launch a token and minimum liquidity of 1000 XDC required. 
                  1% of the token supply will be allocated as fees, which are distributed to NEXU stakers!
                  Most Liquidity is added to Nexus and then burnt!
                </Typography>

                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="w-[200px]">
                      <Typography variant="lg" className="text-grey mb-2">🖼️ Token Logo*</Typography>
                      <Frame
                        animate
                        level={3}
                        corners={2}
                        layer='primary'
                        className="aspect-square relative" // Added relative for positioning
                      >
                        <div className="flex flex-col items-center justify-center w-full h-full p-4">
                          {formData.logo ? (
                            <div className="relative w-full h-full">
                              <img
                                src={URL.createObjectURL(formData.logo)}
                                alt="Token Logo Preview"
                                className="w-full h-full object-contain"
                              />
                              <button
                                onClick={() => setFormData(prev => ({ ...prev, logo: null }))}
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red flex items-center justify-center hover:bg-red/80 transition-colors"
                              >
                                <span className="text-white text-sm">×</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-500 rounded">
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/gif"
                                className="hidden"
                                id="logo-upload"
                                onChange={handleLogoChange}
                              />
                              <label htmlFor="logo-upload" className="cursor-pointer text-center">
                                <Typography variant="sm" className="text-secondary">
                                  Click to upload logo
                                  <br />
                                  <span className="text-xs">(JPG, PNG, or GIF under 2MB)</span>
                                </Typography>
                              </label>
                            </div>
                          )}
                        </div>
                      </Frame>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Typography variant="lg" className="text-grey">🏷️ Token Name *</Typography>
                        <Frame animate level={3} corners={2} layer='primary'>
                          <input
                            className="w-full p-2 rounded bg-dark-900 text-grey text-sm"
                            placeholder="e.g. Ethereum"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </Frame>
                      </div>

                      <div className="space-y-2">
                        <Typography variant="lg" className="text-grey">💎 Token Symbol *</Typography>
                        <Frame animate level={3} corners={2} layer='primary'>
                          <input
                            className="w-full p-2 rounded bg-dark-900 text-grey text-sm"
                            placeholder="e.g. ETH"
                            value={formData.symbol}
                            onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                          />
                        </Frame>
                      </div>

                      <div className="space-y-2">
                        <Typography variant="lg" className="text-grey">📊 Total Supply *</Typography>
                        <Frame animate level={3} corners={2} layer='primary'>
                          <input
                            className="w-full p-2 rounded bg-dark-900 text-grey text-sm"
                            type="number"
                            placeholder="e.g. 1000000"
                            value={formData.totalSupply}
                            onChange={(e) => setFormData(prev => ({ ...prev, totalSupply: e.target.value }))}
                          />
                        </Frame>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Typography variant="lg" className="text-grey">🔥 LP Allocation % *</Typography>
                      <Frame animate level={3} corners={2} layer='primary'>
                        <input
                          className="w-full p-2 rounded bg-dark-900 text-grey text-sm"
                          type="number"
                          placeholder="Maximum 99%"
                          value={formData.lpPercent}
                          onChange={(e) => handleLPChange(e.target.value)}
                        />
                      </Frame>
                    </div>

                    <div className="space-y-2">
                      <Typography variant="lg" className="text-grey">💻 Dev Allocation % *</Typography>
                      <Frame animate level={3} corners={2} layer='primary'>
                        <input
                          className="w-full p-2 rounded bg-dark-900 text-grey text-sm"
                          type="number"
                          placeholder="Maximum 50%"
                          value={formData.devPercent}
                          onChange={(e) => handleDevChange(e.target.value)}
                        />
                      </Frame>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Typography variant="lg" className="text-grey">💰 Initial Liquidity (XDC) *</Typography>
                      <Frame animate level={3} corners={2} layer='primary'>
                        <input
                          className="w-full p-2 rounded bg-dark-900 text-grey text-sm"
                          type="number"
                          min={MIN_INITIAL_LIQUIDITY}
                          placeholder={`Minimum ${MIN_INITIAL_LIQUIDITY} XDC`}
                          value={formData.initialLiquidity}
                          onChange={(e) => {
                            const value = Number(e.target.value)
                            if (value >= Number(MIN_INITIAL_LIQUIDITY)) {
                              setFormData(prev => ({ ...prev, initialLiquidity: e.target.value }))
                            }
                          }}
                        />
                      </Frame>
                      <Typography variant="xs" className="text-secondary">
                        Minimum initial liquidity: {MIN_INITIAL_LIQUIDITY} XDC
                      </Typography>
                    </div>

                    <div className="space-y-2">
                      <Typography variant="lg" className="text-grey">🌐 Link *</Typography>
                      <Frame animate level={3} corners={2} layer='primary'>
                        <input
                          className="w-full p-2 rounded bg-dark-900 text-grey text-sm"
                          placeholder="e.g. https://example.com"
                          value={formData.website}
                          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        />
                      </Frame>
                      <Typography variant="xs" className="text-secondary">
                        Must include https:// or http://
                      </Typography>
                    </div>

                    <div className="space-y-2">
                      <Typography variant="lg" className="text-grey">📝 Description</Typography>
                      <Frame animate level={3} corners={2} layer='primary'>
                        <textarea
                          className="w-full p-2 rounded bg-dark-900 text-grey text-sm"
                          placeholder="Describe your token..."
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                        />
                      </Frame>
                    </div>
                  </div>
                </div>
              </div>
            </Frame>
          </div>

          <div className="w-full mt-4 md:w-[300px] md:mt-0">
            <Frame animate level={3} corners={4} layer='primary'>
              <div className="p-4 space-y-4">
                <Typography variant="h3" weight={700} className="text-high-emphesis mb-4">
                  {i18n._(t`Token Preview`)}
                </Typography>

                {formData.logo && (
                  <img
                    src={URL.createObjectURL(formData.logo)}
                    alt="Token Logo Preview"
                    className="w-16 h-16 mx-auto rounded-full"
                  />
                )}

                <div className="space-y-2">
                  <Typography variant="sm">Name: {formData.name || '-'}</Typography>
                  <Typography variant="sm">Symbol: {formData.symbol || '-'}</Typography>
                  <Typography variant="sm">Total Supply: {formData.totalSupply ? Number(formData.totalSupply).toLocaleString() : '-'}</Typography>
                  <Typography variant="sm">Website: {formData.website || '-'}</Typography>
                  <Typography variant="sm">Description: {formData.description || '-'}</Typography>
                </div>

                <div className="border-t border-dark-700 pt-4 space-y-2">
                  <Typography variant="sm">🔥 LP: {formData.lpPercent}% ({formData.totalSupply ? (Number(formData.totalSupply) * Number(formData.lpPercent) / 100).toLocaleString() : '-'} tokens)</Typography>
                  <Typography variant="sm">💻 Dev: {formData.devPercent}% ({formData.totalSupply ? (Number(formData.totalSupply) * Number(formData.devPercent) / 100).toLocaleString() : '-'} tokens)</Typography>
                  <Typography variant="sm">🏦 Fee: 1% ({formData.totalSupply ? (Number(formData.totalSupply) * 0.01).toLocaleString() : '-'} tokens)</Typography>
                  <Typography variant="sm">Initial Liquidity: {formData.initialLiquidity} XDC</Typography>
                  <Typography variant="sm">Launch Fee: {nativeFee} XDC</Typography>
                </div>

                <div className="border-t border-dark-700 pt-4">
                  <Typography variant="lg" className="text-high-emphesis">
                    Total Cost: {Number(formData.initialLiquidity) + Number(nativeFee)} XDC
                  </Typography>
                </div>

                <div className="mt-4">
                  {!account ? (
                    <Web3Connect size="lg" color="blue" className="w-full" />
                  ) : (
                    <Button
                      fullWidth
                      color="blue"
                      onClick={handleCreateToken}
                      disabled={pendingTx}
                    >
                      {i18n._(t`Create Token`)}
                    </Button>
                  )}
                </div>
              </div>
            </Frame>
          </div>

          {showConfirm && (
            <TransactionConfirmationModal
              isOpen={showConfirm}
              onDismiss={handleDismissConfirmation}
              attemptingTxn={pendingTx}
              hash={txHash}
              content={() => (
                <HeadlessUiModal.Header
                  header={i18n._(t`Confirming Token Launch`)}
                  onClose={handleDismissConfirmation}
                />
              )}
              pendingText={"Creating Token..."}
            />
          )}
        </div>
      ) : (
        <LaunchedTokens />
      )}
    </div>
  )
}


























