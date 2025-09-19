<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center mb-0">Sign In</h3>
          </div>
          <div class="card-body">
            <div v-if="!user">
              <h5 class="mb-4 text-center">Sign in with Firebase</h5>
              
              <!-- Email/Password Sign In Form -->
              <form @submit.prevent="signInWithEmailPassword" v-if="showEmailForm">
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="loading"
                  >
                    <i class="fas fa-sign-in-alt me-2"></i>
                    {{ loading ? 'Signing in...' : 'Sign in via Firebase' }}
                  </button>
                </div>
              </form>
              
              <!-- Sign In Options -->
              <div v-else class="text-center">
                <button 
                  @click="signInWithGoogle" 
                  class="btn btn-primary btn-lg w-100 mb-3"
                  :disabled="loading"
                >
                  <i class="fab fa-google me-2"></i>
                  {{ loading ? 'Signing in...' : 'Sign in with Google' }}
                </button>
                <button 
                  @click="showEmailForm = true" 
                  class="btn btn-outline-primary btn-lg w-100"
                  :disabled="loading"
                >
                  <i class="fas fa-envelope me-2"></i>
                  Sign in with Email
                </button>
              </div>
              
              <div class="text-center mt-3">
                <p class="mb-0">Don't have an account?</p>
                <router-link to="/firebase-register" class="btn btn-link">
                  <i class="fas fa-user-plus me-1"></i>
                  Create an account
                </router-link>
              </div>
            </div>
            
            <div v-else class="text-center">
              <div class="alert alert-success">
                <h5>Welcome, {{ user.displayName || user.email }}!</h5>
                <p class="mb-0">You are successfully signed in with Firebase.</p>
                <small class="text-muted">User ID: {{ user.uid }}</small>
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
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const user = ref(null)
const loading = ref(false)
const error = ref('')
const email = ref('')
const password = ref('')
const showEmailForm = ref(false)

// Initialize Firebase Auth
const auth = getAuth()
const provider = new GoogleAuthProvider()
const router = useRouter()

// Monitor auth state changes
onMounted(() => {
  onAuthStateChanged(auth, (userData) => {
    user.value = userData
    if (userData) {
      console.log('Current user signed in:', auth.currentUser)
    }
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

const signInWithEmailPassword = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const result = await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log('Firebase Sign-in Successful!', result.user)
    console.log('Current user:', auth.currentUser) // To check the current User signed in
    
    // Clear form
    email.value = ''
    password.value = ''
    showEmailForm.value = false
    
    // Navigate to home page
    router.push('/')
  } catch (err) {
    console.log('Sign-in Error:', err.code)
    console.log('Error Message:', err.message)
    
    // Display user-friendly error messages
    switch (err.code) {
      case 'auth/user-not-found':
        error.value = 'No account found with this email address.'
        break
      case 'auth/wrong-password':
        error.value = 'Incorrect password. Please try again.'
        break
      case 'auth/invalid-email':
        error.value = 'Please enter a valid email address.'
        break
      case 'auth/user-disabled':
        error.value = 'This account has been disabled. Please contact support.'
        break
      case 'auth/too-many-requests':
        error.value = 'Too many failed attempts. Please try again later.'
        break
      default:
        error.value = `Sign-in failed: ${err.message}`
    }
  } finally {
    loading.value = false
  }
}

const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    console.log('Sign out successful')
    showEmailForm.value = false
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
