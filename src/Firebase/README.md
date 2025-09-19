# Firebase Configuration

This folder contains the Firebase initialization and configuration files.

## Files

- `init.js` - Main Firebase initialization file containing all Firebase services

## Services Available

### Authentication
```javascript
import { auth } from './Firebase/init.js'
```

### Firestore Database
```javascript
import { db } from './Firebase/init.js'
```

### Storage
```javascript
import { storage } from './Firebase/init.js'
```

### Analytics
```javascript
import { analytics } from './Firebase/init.js'
```

## Utility Functions

The `firestoreUtils` object provides common Firestore operations:

```javascript
import { firestoreUtils } from './Firebase/init.js'

// Add a document
await firestoreUtils.addDocument('users', { name: 'John', email: 'john@example.com' })

// Get all documents
const users = await firestoreUtils.getDocuments('users')

// Get a specific document
const user = await firestoreUtils.getDocument('users', 'userId123')

// Update a document
await firestoreUtils.updateDocument('users', 'userId123', { name: 'Jane' })

// Delete a document
await firestoreUtils.deleteDocument('users', 'userId123')
```

## Usage in Components

```javascript
// In any Vue component
import { auth, db, firestoreUtils } from '../Firebase/init.js'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'

// Use authentication
const signIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password)
}

// Use Firestore
const addUser = async (userData) => {
  await firestoreUtils.addDocument('users', userData)
}
```
