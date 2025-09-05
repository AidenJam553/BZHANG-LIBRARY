<script setup>
import { ref, onMounted } from 'vue'

const username = ref('')

onMounted(() => {
  username.value = localStorage.getItem('username') || ''
})
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="about">
          <h1 class="text-center">About Our Library</h1>
          <p class="text-center lead">Welcome to our digital library! We're dedicated to providing a vast collection of books and resources to our community.</p>
          
          <div v-if="username" class="alert alert-success text-center">
            <h5>🔒 Members Only Area</h5>
            <p>Welcome back, <strong>{{ username }}</strong>! You have access to our exclusive member content.</p>
          </div>
          
          <div class="row mt-4">
            <div class="col-md-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">📚 Member Benefits</h5>
                  <ul class="list-unstyled">
                    <li>✅ Access to premium e-books</li>
                    <li>✅ Priority booking for events</li>
                    <li>✅ Extended borrowing periods</li>
                    <li>✅ Exclusive member discounts</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">🎯 Member Services</h5>
                  <ul class="list-unstyled">
                    <li>📖 Personal reading recommendations</li>
                    <li>🔍 Advanced search capabilities</li>
                    <li>📱 Mobile app access</li>
                    <li>💬 Member community forum</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}
</style>
