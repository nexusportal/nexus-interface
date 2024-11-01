import { useCallback, useState, useEffect } from 'react';

import { ethers, Contract } from 'ethers';

import { useActiveWeb3React } from 'app/services/web3';

import LAUNCHER_ABI from '../pages/launcher/launcher_abi.json';

import { storage, db } from '../config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc } from 'firebase/firestore'

import { useTransactionAdder } from 'app/state/transactions/hooks'; // Add this import

const LAUNCHER_ADDRESS = "0xE68cDB51c2Cd93989eb2252254E2253dB1affe46";

const TOKEN_LIST_URL = "https://raw.githubusercontent.com/nexusportal/token-list/main/tokens.json";

// Add interface for event type
interface TokenCreatedEvent {
  event: string
  args: {
    tokenAddress: string
    name: string
    symbol: string
    totalSupply: string
    launchTime: number
  }
}

interface PairCreatedEvent {
  event: string
  args: {
    pair: string
    token0: string
    token1: string
  }
}

export interface TokenMetadata {
  chainId: string
  description: string
  devAllocation: string
  initialLiquidity: string
  launchDate: Date  // Firestore timestamp
  logoUrl: string
  lpAddress: string
  lpAllocation: string
  symbol: string
  tokenAddress: string
  website: string
  name: string
}

export const useLauncher = () => {

  const { account, chainId, library } = useActiveWeb3React();
  const addTransaction = useTransactionAdder(); // Add this hook

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

  const saveTokenMetadata = async (tokenData: TokenMetadata) => {
    try {
      console.log('Saving token metadata:', tokenData)
      const docRef = await addDoc(collection(db, 'tokens'), {
        ...tokenData,
        // Convert the ISO string to a Firestore timestamp
        launchDate: new Date(tokenData.launchDate),
        createdAt: new Date() // Current timestamp
      })
      console.log('Document written with ID: ', docRef.id)
    } catch (error) {
      console.error('Error saving token metadata:', error)
    }
  }

  const uploadLogo = async (file: File, tokenSymbol: string): Promise<string> => {
    const storageRef = ref(storage, `token-logos/${tokenSymbol.toLowerCase()}.png`)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }

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
      console.log('Starting token creation...');
      const signer = library.getSigner();
      const contract = new Contract(LAUNCHER_ADDRESS, LAUNCHER_ABI, signer);

      const totalSupplyInWei = ethers.utils.parseUnits(totalSupply, 18);
      const liquidityInWei = ethers.utils.parseEther(initialLiquidity);

      const tx = await contract.createToken(
        name,
        symbol,
        totalSupplyInWei,
        Number(lpPercent),
        Number(devPercent),
        ethers.constants.AddressZero,
        liquidityInWei,
        true,
        { value: ethers.utils.parseEther('2') }
      );

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      
      addTransaction(tx, {
        summary: `Created Token ${name} (${symbol})`
      });

      console.log('Transaction receipt:', receipt);
      console.log('Full receipt events:', receipt.events);

      // After successful transaction, check for logo
      if (!logoFile) {
        throw new Error('Logo is required to complete token setup');
      }

      // Find the TokenCreated event
      const tokenCreatedEvent = receipt.events?.find(
        (e: any) => e.event === 'TokenCreated'
      );
      
      if (!tokenCreatedEvent || !tokenCreatedEvent.args) {
        throw new Error('TokenCreated event not found in transaction receipt');
      }

      // Find the PairCreated event - it might be nested in logs
      const pairCreatedEvent = receipt.events?.find(
        (e: any) => e.event === 'PairCreated'
      ) || receipt.logs?.find(
        (log: any) => log.topics[0] === '0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9' // PairCreated topic
      );

      if (!pairCreatedEvent) {
        console.error('Full receipt:', receipt);
        throw new Error('PairCreated event not found in transaction receipt');
      }

      const tokenAddress = tokenCreatedEvent.args.tokenAddress;
      const lpAddress = pairCreatedEvent.args?.pair || pairCreatedEvent.address;
      const launchTime = tokenCreatedEvent.args.launchTime || Math.floor(Date.now() / 1000);

      console.log('Token created:', {
        tokenAddress,
        lpAddress,
        launchTime
      });

      // Try to upload logo and save metadata
      try {
        console.log('Uploading logo...');
        const logoUrl = await uploadLogo(logoFile, symbol);
        console.log('Logo uploaded:', logoUrl);

        console.log('Saving to Firebase...');
        await saveTokenMetadata({
          name,
          symbol,
          tokenAddress,
          lpAddress,
          description: description || '',
          website: website || '',
          logoUrl,
          launchDate: new Date(launchTime * 1000),
          lpAllocation: lpPercent.toString(),
          devAllocation: devPercent.toString(),
          initialLiquidity: initialLiquidity.toString(),
          chainId: chainId?.toString() || '50'
        });
        console.log('Saved to Firebase successfully');
      } catch (firebaseError) {
        console.error('Firebase error:', firebaseError);
        // Don't throw here - token is created, just metadata failed
      }

      return {
        hash: tx.hash,
        receipt,
        tokenAddress,
        lpAddress,
        launchTime
      };

    } catch (error) {
      console.error('Error in createToken:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [library, account, chainId, addTransaction]); // Add addTransaction to deps

  return {
    createToken,
    isLoading,
    nativeFee
  };
};
