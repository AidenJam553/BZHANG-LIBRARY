<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center mb-0">Firebase Authentication</h3>
          </div>
          <div class="card-body">
            <div v-if="!user" class="text-center">
              <h5 class="mb-4">Sign in with Firebase</h5>
              <button 
                @click="signInWithGoogle" 
                class="btn btn-primary btn-lg w-100 mb-3"
                :disabled="loading"
              >
                <i class="fab fa-google me-2"></i>
                {{ loading ? 'Signing in...' : 'Sign in with Google' }}
              </button>
              <button 
                @click="signInWithEmail" 
                class="btn btn-outline-primary btn-lg w-100"
                :disabled="loading"
              >
                <i class="fas fa-envelope me-2"></i>
                Sign in with Email
              </button>
            </div>
            
            <div v-else class="text-center">
              <div class="alert alert-success">
                <h5>Welcome, {{ user.displayName || user.email }}!</h5>
                <p class="mb-0">You are successfully signed in with Firebase.</p>
              </div>
              <button @click="signOut" class="btn btn-danger">
                <i class="fas fa-sign-out-alt me-2"></i>
                Sign Out
              </button>
            </div>
            
            <div v-if="error" class="alert alert-danger mt-3">
              <strong>Error:</strong> {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth'

const user = ref(null)
const loading = ref(false)
const error = ref('')

// Initialize Firebase Auth
const auth = getAuth()
const provider = new GoogleAuthProvider()

// Monitor auth state changes
onMounted(() => {
  onAuthStateChanged(auth, (userData) => {
    user.value = userData
  })
})

const signInWithGoogle = async () => {
  try {
    loading.value = true
    error.value = ''
    const result = await signInWithPopup(auth, provider)
    console.log('Google sign-in successful:', result.user)
  } catch (err) {
    console.error('Google sign-in error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const signInWithEmail = () => {
  // Placeholder for email/password authentication
  error.value = 'Email/password authentication not implemented yet'
}

const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    console.log('Sign out successful')
  } catch (err) {
    console.error('Sign out error:', err)
    error.value = err.message
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.alert {
  border: none;
  border-radius: 10px;
}

.fab, .fas {
  font-size: 1.1em;
}
</style>
