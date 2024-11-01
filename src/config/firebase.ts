import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import { TokenMetadata } from '../hooks/useLauncher'

const firebaseConfig = {
  apiKey: "AIzaSyAk1elbdJ3g2LraxWAY_zyD_RCQlFp0OcU",
  authDomain: "nexus-launcher-e6b4d.firebaseapp.com",
  databaseURL: "https://nexus-launcher-e6b4d-default-rtdb.firebaseio.com",
  projectId: "nexus-launcher-e6b4d",
  storageBucket: "nexus-launcher-e6b4d.appspot.com",
  messagingSenderId: "945363227757",
  appId: "1:945363227757:web:fdae08f289fdc4c9329b64"
}

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
export const db = getFirestore(app)

export const saveTokenMetadata = async (tokenData: TokenMetadata) => {
  try {
    const docRef = await addDoc(collection(db, 'tokens'), {
      ...tokenData,
      createdAt: new Date()
    })
    console.log('Token metadata saved with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Error saving token metadata:', error)
    throw error
  }
}

export const uploadLogo = async (file: File, tokenSymbol: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `token-logos/${tokenSymbol.toLowerCase()}.png`)
    const snapshot = await uploadBytes(storageRef, file)
    const url = await getDownloadURL(snapshot.ref)
    console.log('Logo uploaded successfully:', url)
    return url
  } catch (error) {
    console.error('Error uploading logo:', error)
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
