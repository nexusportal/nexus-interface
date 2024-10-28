import { useCallback, useState, useEffect } from 'react';

import { ethers, Contract } from 'ethers';

import { useActiveWeb3React } from 'app/services/web3';

import LAUNCHER_ABI from '../pages/launcher/launcher_abi.json';

const LAUNCHER_ADDRESS = "0xE68cDB51c2Cd93989eb2252254E2253dB1affe46";

const TOKEN_LIST_URL = "https://raw.githubusercontent.com/nexusportal/token-list/main/tokens.json";

export const useLauncher = () => {

  const { account, chainId, library } = useActiveWeb3React();

  const [isLoading, setIsLoading] = useState(false);
  const [nativeFee, setNativeFee] = useState<string>('1000'); // Default value

  // Add useEffect to fetch nativeFee when component mounts
  useEffect(() => {
    const fetchNativeFee = async () => {
      if (!library) return
      try {
        const contract = new Contract(LAUNCHER_ADDRESS, LAUNCHER_ABI, library)
        const fee = await contract.nativeFee()
        setNativeFee(ethers.utils.formatEther(fee))
      } catch (error) {
        console.error('Error fetching native fee:', error)
      }
    }
    fetchNativeFee()
  }, [library])

  const createToken = useCallback(async ({
    name,
    symbol,
    totalSupply,
    lpPercent,
    devPercent,
    initialLiquidity,
    description,
    website,
    logoFile
  }) => {
    if (!library || !account) throw new Error('Wallet not connected');

    setIsLoading(true);

    try {
      const signer = library.getSigner();
      const contract = new Contract(LAUNCHER_ADDRESS, LAUNCHER_ABI, signer);

      // Convert totalSupply to wei (18 decimals)
      const totalSupplyInWei = ethers.utils.parseUnits(totalSupply, 18);
      
      // Convert initialLiquidity to wei
      const liquidityInWei = ethers.utils.parseEther(initialLiquidity);

      const tx = await contract.createToken(
        name,
        symbol,
        totalSupplyInWei, // This is now in wei
        Number(lpPercent),
        Number(devPercent),
        ethers.constants.AddressZero,
        liquidityInWei, // This is now in wei
        true,
        { 
          value: ethers.utils.parseEther('2') // 2 XDC fee
        }
      );

      const receipt = await tx.wait();

      return {
        hash: tx.hash,
        explorerUrl: chainId === 50
          ? "https://explorer.xinfin.network/tx/" 
          : "https://explorer.apothem.network/tx/",
        receipt
      };

    } catch (error) {
      console.error('Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [library, account, chainId]);

  return {
    createToken,
    isLoading,
    nativeFee
  };
};
