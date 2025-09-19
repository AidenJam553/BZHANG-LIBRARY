// Firebase imports
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPSsnjAGKPmVrozmRxkwo9oVN-5-26cww",
  authDomain: "week7-bohan.firebaseapp.com",
  projectId: "week7-bohan",
  storageBucket: "week7-bohan.firebasestorage.app",
  messagingSenderId: "368487008004",
  appId: "1:368487008004:web:764266ea6d34203b283251"
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)

// Initialize Analytics (only in production)
let analytics = null
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(firebaseApp)
}
export { analytics }

// Export the Firebase app instance
export default firebaseApp

// Utility functions for common Firestore operations
export const firestoreUtils = {
  // Add a document to a collection
  async addDocument(collection, data) {
    const { collection: getCollection, addDoc } = await import('firebase/firestore')
    const collectionRef = getCollection(db, collection)
    return await addDoc(collectionRef, data)
  },
  
  // Get all documents from a collection
  async getDocuments(collection) {
    const { collection: getCollection, getDocs } = await import('firebase/firestore')
    const collectionRef = getCollection(db, collection)
    const snapshot = await getDocs(collectionRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },
  
  // Get a specific document by ID
  async getDocument(collection, id) {
    const { collection: getCollection, doc, getDoc } = await import('firebase/firestore')
    const docRef = doc(db, collection, id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
  },
  
  // Update a document
  async updateDocument(collection, id, data) {
    const { collection: getCollection, doc, updateDoc } = await import('firebase/firestore')
    const docRef = doc(db, collection, id)
    return await updateDoc(docRef, data)
  },
  
  // Delete a document
  async deleteDocument(collection, id) {
    const { collection: getCollection, doc, deleteDoc } = await import('firebase/firestore')
    const docRef = doc(db, collection, id)
    return await deleteDoc(docRef)
  }
}
