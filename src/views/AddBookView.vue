<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center mb-0">Add Book</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="addBook">
              <div class="mb-3">
                <label for="isbn" class="form-label">ISBN:</label>
                <input
                  type="text"
                  class="form-control"
                  id="isbn"
                  v-model="isbn"
                  placeholder="Enter ISBN number"
                  required
                />
              </div>
              
              <div class="mb-3">
                <label for="name" class="form-label">Name:</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="name"
                  placeholder="Enter book name"
                  required
                />
              </div>
              
              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg"
                  :disabled="loading"
                >
                  <i class="fas fa-plus me-2"></i>
                  {{ loading ? 'Adding Book...' : 'Add Book' }}
                </button>
              </div>
            </form>
            
            <div v-if="error" class="alert alert-danger mt-3">
              <strong>Error:</strong> {{ error }}
            </div>
            
            <div v-if="success" class="alert alert-success mt-3">
              <strong>Success!</strong> {{ success }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- BookList Component -->
    <BookList />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../Firebase/init.js'
import { collection, addDoc } from 'firebase/firestore'
import BookList from '../components/BookList.vue'
import axios from 'axios'

// Reactive references
const isbn = ref('')
const name = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

// Add book function
const addBook = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''
    
    // Convert ISBN to number
    const isbnNumber = Number(isbn.value)
    
    // Validate ISBN is a number
    if (isNaN(isbnNumber)) {
      error.value = 'ISBN must be a valid number'
      return
    }
    
    // Add document to Firestore
    await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: name.value
    })
    
    // Clear form
    isbn.value = ''
    name.value = ''
    
    // Show success message
    success.value = 'Book added successfully!'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = ''
    }, 3000)
    
  } catch (err) {
    console.error('Error adding book:', err)
    error.value = `Failed to add book: ${err.message}`
  } finally {
    loading.value = false
  }
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
