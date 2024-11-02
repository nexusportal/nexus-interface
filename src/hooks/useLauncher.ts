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
  totalSupply: string  // Add this field
}

// Add a debug logging helper
const debug = (step: string, data?: any) => {
  console.group(`🚀 Token Launch - ${step}`);
  console.log('Timestamp:', new Date().toISOString());
  if (data) {
    console.log('Data:', data);
  }
  console.groupEnd();
};

export const useLauncher = () => {

  const { account, chainId, library } = useActiveWeb3React();
  const addTransaction = useTransactionAdder(); // Add this hook

  const [isLoading, setIsLoading] = useState(false);
  const [nativeFee, setNativeFee] = useState<string>('1'); // Default value

  // Add useEffect to fetch nativeFee when component mounts
  useEffect(() => {
    const fetchNativeFee = async () => {
      if (!library) return
      try {
        const contract = new Contract(LAUNCHER_ADDRESS, LAUNCHER_ABI, library)
        const fee = await contract.nativeFee()
        const formattedFee = ethers.utils.formatEther(fee)
        console.log('Fetched native fee from contract:', formattedFee)
        setNativeFee(formattedFee)
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
    debug('Starting Token Creation Process');
    
    if (!library || !account) {
      debug('Error: Wallet Not Connected');
      throw new Error('Wallet not connected');
    }
    
    setIsLoading(true);
    debug('Initial Parameters', {
      name,
      symbol,
      totalSupply,
      lpPercent,
      devPercent,
      initialLiquidity,
      description,
      website,
      hasLogoFile: !!logoFile
    });

    try {
      debug('Preparing Contract Interaction');
      const signer = library.getSigner();
      const contract = new Contract(LAUNCHER_ADDRESS, LAUNCHER_ABI, signer);

      const totalSupplyInWei = ethers.utils.parseUnits(totalSupply, 18);
      const liquidityInWei = ethers.utils.parseEther(initialLiquidity);
      const nativeFeeInWei = ethers.utils.parseEther(nativeFee);
      const totalRequiredValue = nativeFeeInWei.add(liquidityInWei);

      debug('Contract Parameters', {
        totalSupplyInWei: totalSupplyInWei.toString(),
        liquidityInWei: liquidityInWei.toString(),
        nativeFeeInWei: nativeFeeInWei.toString(),
        totalRequiredValue: totalRequiredValue.toString()
      });

      debug('Sending Transaction');
      const tx = await contract.createToken(
        name,
        symbol,
        totalSupplyInWei,
        Number(lpPercent),
        Number(devPercent),
        ethers.constants.AddressZero,
        liquidityInWei,
        true,
        { value: totalRequiredValue }
      );

      debug('Transaction Sent', { hash: tx.hash });
      
      debug('Waiting for Transaction Receipt');
      const receipt = await tx.wait();
      debug('Transaction Receipt Received', { 
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        events: receipt.events?.map(e => e.event)
      });

      if (!logoFile) {
        debug('Error: Missing Logo File');
        throw new Error('Logo is required to complete token setup');
      }

      debug('Processing TokenCreated Event');
      const tokenCreatedEvent = receipt.events?.find(
        (e: any) => e.event === 'TokenCreated'
      );
      
      if (!tokenCreatedEvent || !tokenCreatedEvent.args) {
        debug('Error: TokenCreated Event Not Found');
        throw new Error('TokenCreated event not found in transaction receipt');
      }

      debug('Processing PairCreated Event');
      let lpAddress;
      const pairCreatedEvent = receipt.events?.find(
        (e: any) => e.event === 'PairCreated'
      );

      if (pairCreatedEvent && pairCreatedEvent.args) {
        lpAddress = pairCreatedEvent.args.pair;
        debug('Found LP Address from Event', { lpAddress });
      } else {
        debug('Searching for PairCreated in Logs');
        const pairCreatedLog = receipt.logs?.find(
          (log: any) => log.topics[0] === '0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9'
        );

        if (pairCreatedLog) {
          const abiCoder = new ethers.utils.AbiCoder();
          const decodedData = abiCoder.decode(['address'], pairCreatedLog.data);
          lpAddress = decodedData[0];
          debug('Found LP Address from Logs', { lpAddress });
        }
      }

      if (!lpAddress) {
        debug('Error: LP Address Not Found', { receipt });
        throw new Error('Could not find LP address in transaction receipt');
      }

      const tokenAddress = tokenCreatedEvent.args.tokenAddress;
      const launchTime = tokenCreatedEvent.args.launchTime || Math.floor(Date.now() / 1000);

      debug('Token Details', {
        tokenAddress,
        lpAddress,
        launchTime
      });

      try {
        debug('Starting Logo Upload');
        const logoUrl = await uploadLogo(logoFile, symbol);
        debug('Logo Upload Complete', { logoUrl });

        const metadata = {
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
          chainId: chainId?.toString() || '50',
          totalSupply: totalSupply.toString()  // Add this field
        };

        debug('Saving Metadata to Firebase', metadata);
        await saveTokenMetadata(metadata);
        debug('Firebase Save Complete');

      } catch (firebaseError) {
        debug('Firebase Error', firebaseError);
      }

      debug('Token Creation Process Complete');
      return {
        hash: tx.hash,
        receipt,
        tokenAddress,
        lpAddress,
        launchTime
      };

    } catch (error) {
      debug('Error in Token Creation Process', error);
      throw error;
    } finally {
      setIsLoading(false);
      debug('Process Finished');
    }
  }, [library, account, chainId, addTransaction]); // Add addTransaction to deps

  return {
    createToken,
    isLoading,
    nativeFee
  };
};
