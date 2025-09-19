<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <div class="col-md-8">
        <h1>Books Management</h1>
      </div>
      <div class="col-md-4 text-end">
        <button @click="refreshBooks" class="btn btn-outline-primary" :disabled="loading">
          <i class="fas fa-sync-alt me-2"></i>
          Refresh
        </button>
      </div>
    </div>

    <!-- Query Controls -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">Query Controls</h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-3">
            <label class="form-label">ISBN Filter:</label>
            <select v-model="isbnFilter" class="form-select" @change="fetchBooks">
              <option value="all">All Books</option>
              <option value="gt1000">ISBN > 1000</option>
              <option value="gt500">ISBN > 500</option>
              <option value="gt100">ISBN > 100</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Sort By:</label>
            <select v-model="sortBy" class="form-select" @change="fetchBooks">
              <option value="isbn">ISBN</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Order:</label>
            <select v-model="sortOrder" class="form-select" @change="fetchBooks">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Limit:</label>
            <select v-model="limitCount" class="form-select" @change="fetchBooks">
              <option value="0">No Limit</option>
              <option value="5">5 books</option>
              <option value="10">10 books</option>
              <option value="20">20 books</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Books List -->
    <div v-if="books.length > 0" class="row">
      <div v-for="book in books" :key="book.id" class="col-md-6 col-lg-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h6 class="card-title">{{ book.name }}</h6>
            <p class="card-text">
              <strong>ISBN:</strong> {{ book.isbn }}
            </p>
            <div class="d-flex gap-2">
              <button 
                @click="startEdit(book)" 
                class="btn btn-sm btn-outline-primary"
                :disabled="editingId === book.id"
              >
                <i class="fas fa-edit me-1"></i>
                Edit
              </button>
              <button 
                @click="deleteBook(book.id)" 
                class="btn btn-sm btn-outline-danger"
                :disabled="loading"
              >
                <i class="fas fa-trash me-1"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editingBook" class="modal show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Book</h5>
            <button @click="cancelEdit" class="btn-close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Book Name:</label>
              <input 
                v-model="editingBook.name" 
                type="text" 
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">ISBN:</label>
              <input 
                v-model="editingBook.isbn" 
                type="number" 
                class="form-control"
                required
              />
            </div>
          </div>
          <div class="modal-footer">
            <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
            <button @click="updateBook" class="btn btn-primary" :disabled="loading">
              <i class="fas fa-save me-1"></i>
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading books...</p>
    </div>

    <!-- Empty State -->
    <div v-else class="alert alert-info">
      <i class="fas fa-info-circle me-2"></i>
      No books found with the current filters.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../Firebase/init.js'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'

// Reactive state
const books = ref([])
const loading = ref(false)
const editingBook = ref(null)
const editingId = ref(null)

// Query controls
const isbnFilter = ref('gt1000')
const sortBy = ref('isbn')
const sortOrder = ref('asc')
const limitCount = ref('0')

// Fetch books with advanced querying
const fetchBooks = async () => {
  try {
    loading.value = true
    
    // Start building query
    let q = collection(db, 'books')
    
    // Add where clause based on filter
    if (isbnFilter.value === 'gt1000') {
      q = query(q, where('isbn', '>', 1000))
    } else if (isbnFilter.value === 'gt500') {
      q = query(q, where('isbn', '>', 500))
    } else if (isbnFilter.value === 'gt100') {
      q = query(q, where('isbn', '>', 100))
    }
    // 'all' doesn't add a where clause
    
    // Add orderBy clause
    const orderDirection = sortOrder.value === 'asc' ? 'asc' : 'desc'
    q = query(q, orderBy(sortBy.value, orderDirection))
    
    // Add limit if specified
    if (limitCount.value !== '0') {
      q = query(q, limit(parseInt(limitCount.value)))
    }
    
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
    console.log('Books fetched with query:', {
      filter: isbnFilter.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      limit: limitCount.value,
      count: booksArray.length
    })
    
  } catch (error) {
    console.error('Error fetching books:', error)
    alert('Error fetching books: ' + error.message)
  } finally {
    loading.value = false
  }
}

// Refresh books
const refreshBooks = () => {
  fetchBooks()
}

// Start editing a book
const startEdit = (book) => {
  editingBook.value = { ...book }
  editingId.value = book.id
}

// Cancel editing
const cancelEdit = () => {
  editingBook.value = null
  editingId.value = null
}

// Update book
const updateBook = async () => {
  try {
    loading.value = true
    
    if (!editingBook.value || !editingId.value) return
    
    // Validate ISBN is a number
    const isbnNumber = Number(editingBook.value.isbn)
    if (isNaN(isbnNumber)) {
      alert('ISBN must be a valid number')
      return
    }
    
    // Update document in Firestore
    const bookRef = doc(db, 'books', editingId.value)
    await updateDoc(bookRef, {
      name: editingBook.value.name,
      isbn: isbnNumber
    })
    
    console.log('Book updated successfully')
    alert('Book updated successfully!')
    
    // Refresh the list
    await fetchBooks()
    
    // Close modal
    cancelEdit()
    
  } catch (error) {
    console.error('Error updating book:', error)
    alert('Error updating book: ' + error.message)
  } finally {
    loading.value = false
  }
}

// Delete book
const deleteBook = async (bookId) => {
  try {
    if (!confirm('Are you sure you want to delete this book?')) {
      return
    }
    
    loading.value = true
    
    // Delete document from Firestore
    const bookRef = doc(db, 'books', bookId)
    await deleteDoc(bookRef)
    
    console.log('Book deleted successfully')
    alert('Book deleted successfully!')
    
    // Refresh the list
    await fetchBooks()
    
  } catch (error) {
    console.error('Error deleting book:', error)
    alert('Error deleting book: ' + error.message)
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
  max-width: 1200px;
}

h1 {
  color: #333;
  margin-bottom: 0;
  font-weight: 600;
}

.card {
  transition: all 0.3s ease;
  border: 1px solid #dee2e6;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-text {
  color: #6c757d;
  margin-bottom: 1rem;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
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

.modal {
  z-index: 1050;
}

.modal-dialog {
  margin-top: 5rem;
}

.form-select:focus,
.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.fas {
  font-size: 1.1em;
}

.gap-2 {
  gap: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .col-md-3 {
    margin-bottom: 1rem;
  }
  
  .text-end {
    text-align: left !important;
  }
}
</style>
