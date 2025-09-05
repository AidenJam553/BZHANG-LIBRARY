<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginData = ref({
  username: '',
  password: ''
})

const errorMessage = ref('')

// Hardcoded credentials for this exercise
const validCredentials = {
  username: 'admin',
  password: 'password123'
}

const handleLogin = () => {
  // Check hardcoded admin credentials first
  if (loginData.value.username === validCredentials.username && 
      loginData.value.password === validCredentials.password) {
    // Store authentication state
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('username', loginData.value.username)
    
    // Redirect to About page
    router.push('/about')
    return
  }
  
  // Check registered user credentials
  const savedCredentials = localStorage.getItem('userCredentials')
  if (savedCredentials) {
    const userCredentials = JSON.parse(savedCredentials)
    if (loginData.value.username === userCredentials.username && 
        loginData.value.password === userCredentials.password) {
      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('username', loginData.value.username)
      
      // Redirect to About page
      router.push('/about')
      return
    }
  }
  
  // If no credentials match
  errorMessage.value = 'Invalid username or password. Please try again or register first.'
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <div class="card-header text-center">
            <h4>Library Login</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="loginData.username"
                  required
                />
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="loginData.password"
                  required
                />
              </div>
              
              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
              </div>
              
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Login</button>
              </div>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 15px;
  border-radius: 10px 10px 0 0;
}
</style>
