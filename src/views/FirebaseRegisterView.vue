<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center mb-0">Create an Account</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="register">
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
                  minlength="6"
                />
                <div class="form-text">Password must be at least 6 characters long</div>
              </div>
              
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              
              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg"
                  :disabled="loading || !isFormValid"
                >
                  <i class="fas fa-user-plus me-2"></i>
                  {{ loading ? 'Creating Account...' : 'Save to Firebase' }}
                </button>
              </div>
            </form>
            
            <div v-if="error" class="alert alert-danger mt-3">
              <strong>Registration Error:</strong> {{ error }}
            </div>
            
            <div v-if="success" class="alert alert-success mt-3">
              <strong>Success!</strong> Account created successfully. Redirecting to login...
            </div>
            
            <div class="text-center mt-3">
              <p class="mb-0">Already have an account?</p>
              <router-link to="/firebase-login" class="btn btn-link">
                <i class="fas fa-sign-in-alt me-1"></i>
                Sign in here
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

// Reactive state variables
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

// Service instances
const router = useRouter()
const auth = getAuth()

// Computed property to validate form
const isFormValid = computed(() => {
  return email.value && 
         password.value && 
         confirmPassword.value && 
         password.value === confirmPassword.value &&
         password.value.length >= 6
})

// Registration function
const register = () => {
  // Clear previous errors
  error.value = ''
  success.value = false
  
  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  // Validate password length
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }
  
  loading.value = true
  
  // Create user with email and password
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Registration successful
      console.log('Firebase Register Successful!', userCredential.user)
      success.value = true
      
      // Clear form
      email.value = ''
      password.value = ''
      confirmPassword.value = ''
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/firebase-login')
      }, 2000)
    })
    .catch((error) => {
      // Handle registration errors
      console.log('Registration Error:', error.code)
      console.log('Error Message:', error.message)
      
      // Display user-friendly error messages
      switch (error.code) {
        case 'auth/email-already-in-use':
          error.value = 'This email address is already registered. Please use a different email or try signing in.'
          break
        case 'auth/invalid-email':
          error.value = 'Please enter a valid email address.'
          break
        case 'auth/weak-password':
          error.value = 'Password is too weak. Please choose a stronger password.'
          break
        case 'auth/operation-not-allowed':
          error.value = 'Email/password accounts are not enabled. Please contact support.'
          break
        default:
          error.value = `Registration failed: ${error.message}`
      }
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  border: none;
  border-radius: 10px;
}

.form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.fas {
  font-size: 1.1em;
}
</style>
