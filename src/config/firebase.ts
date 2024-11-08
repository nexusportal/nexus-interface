import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import { TokenMetadata } from '../hooks/useLauncher'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

console.log('🔥 Initializing Firebase...')
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
export const db = getFirestore(app)
console.log('✅ Firebase initialized successfully')

export const saveTokenMetadata = async (tokenData: TokenMetadata) => {
  console.log('🔥 Starting saveTokenMetadata...')
  console.log('📝 Token data to save:', tokenData)
  
  try {
    const docRef = await addDoc(collection(db, 'tokens'), {
      ...tokenData,
      createdAt: new Date()
    })
    console.log('✅ Token metadata saved with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('❌ Error saving token metadata:', error)
    throw error
  }
}

export const uploadLogo = async (file: File, tokenSymbol: string): Promise<string> => {
  console.log('🔥 Starting logo upload for token:', tokenSymbol)
  
  try {
    const storageRef = ref(storage, `token-logos/${tokenSymbol.toLowerCase()}.png`)
    console.log('📤 Uploading file...')
    const snapshot = await uploadBytes(storageRef, file)
    console.log('🔗 Getting download URL...')
    const url = await getDownloadURL(snapshot.ref)
    console.log('✅ Logo uploaded successfully:', url)
    return url
  } catch (error) {
    console.error('❌ Error uploading logo:', error)
    throw error
  }
}

export const testImageUpload = async () => {
  try {
    // Create a small test image blob
    const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    const blob = await (await fetch(`data:image/png;base64,${base64}`)).blob()
    const file = new File([blob], 'test.png', { type: 'image/png' })

    // Try to upload
    const url = await uploadLogo(file, 'test')
    console.log('Test upload successful:', url)
    return url
  } catch (error) {
    console.error('Test upload failed:', error)
    throw error
  }
}
