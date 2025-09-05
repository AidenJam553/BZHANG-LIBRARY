<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card">
          <div class="card-header text-center">
            <h4>🔒 Access Denied</h4>
          </div>
          <div class="card-body text-center">
            <div class="mb-4">
              <i class="fas fa-lock fa-3x text-danger mb-3"></i>
              <h5>You need to be logged in to access this page</h5>
              <p class="text-muted">
                This area is restricted to authenticated members only. 
                Please log in with your credentials to continue.
              </p>
            </div>
            
            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
              <button @click="goToLogin" class="btn btn-primary me-md-2">
                Go to Login
              </button>
              <button @click="goToHome" class="btn btn-secondary">
                Back to Home
              </button>
            </div>
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
  background-color: #dc3545;
  color: white;
  padding: 15px;
  border-radius: 10px 10px 0 0;
}

.fa-lock {
  color: #dc3545 !important;
}
</style>
