<template>
  <div class="container mt-4">
    <h1>Books with ISBN > 1000</h1>
    <ul v-if="books.length > 0" class="list-group">
      <li v-for="book in books" :key="book.id" class="list-group-item">
        {{ book.name }} - ISBN: {{ book.isbn }}
      </li>
    </ul>
    <div v-else-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading books...</p>
    </div>
    <div v-else class="alert alert-info">
      <i class="fas fa-info-circle me-2"></i>
      No books found with ISBN greater than 1000.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../Firebase/init.js'
import { collection, query, where, getDocs } from 'firebase/firestore'

// Reactive state
const books = ref([])
const loading = ref(true)

// Fetch books with ISBN > 1000
const fetchBooks = async () => {
  try {
    loading.value = true
    
    // Create query to get books where ISBN > 1000
    const q = query(
      collection(db, 'books'),
      where('isbn', '>', 1000)
    )
    
    // Execute query
    const querySnapshot = await getDocs(q)
    
    // Process results
    const booksArray = []
    querySnapshot.forEach((doc) => {
      booksArray.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    books.value = booksArray
    console.log('Books fetched:', booksArray)
    
  } catch (error) {
    console.error('Error fetching books:', error)
  } finally {
    loading.value = false
  }
}

// Fetch books when component is mounted
onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
.container {
  max-width: 800px;
}

h1 {
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.list-group-item {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  padding: 1rem;
  background-color: #fff;
  transition: all 0.3s ease;
}

.list-group-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.alert {
  border: none;
  border-radius: 10px;
  padding: 1.5rem;
}

.fas {
  font-size: 1.1em;
}
</style>
