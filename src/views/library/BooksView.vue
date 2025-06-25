<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookStore } from '@/stores/library/book'
import { Book } from '@/types/library'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Table from '@/components/ui/table.vue'
import Modal from '@/components/ui/modal.vue'
import { useToast } from '@/composables/useToast'
import BarcodeScanner from '@/components/library/BarcodeScanner.vue'

const bookStore = useBookStore()
const toast = useToast()

const books = ref<Book[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedBook = ref<Book | null>(null)

const newBook = ref({
  title: '',
  author: '',
  isbn: '',
  barcode: '',
  inventoryNumber: '',
  signature: ''
})

const generateSignature = (book: typeof newBook.value) => {
  // Generate unique signature based on author initials, year, and sequential number
  const authorInitials = book.author
    .split(' ')
    .map(name => name[0])
    .join('')
  const year = new Date().getFullYear().toString().slice(-2)
  const seq = (books.value.length + 1).toString().padStart(4, '0')
  return `${authorInitials}${year}${seq}`
}

const handleAddBook = async () => {
  try {
    newBook.value.signature = generateSignature(newBook.value)
    await bookStore.addBook(newBook.value)
    showAddModal.value = false
    toast.success('Book added successfully')
    loadBooks()
  } catch (error) {
    toast.error('Failed to add book')
  }
}

const handleEditBook = async () => {
  if (!selectedBook.value) return
  try {
    await bookStore.updateBook(selectedBook.value)
    showEditModal.value = false
    toast.success('Book updated successfully')
    loadBooks()
  } catch (error) {
    toast.error('Failed to update book')
  }
}

const handleDeleteBook = async (book: Book) => {
  if (confirm('Are you sure you want to delete this book?')) {
    try {
      await bookStore.deleteBook(book.id)
      toast.success('Book deleted successfully')
      loadBooks()
    } catch (error) {
      toast.error('Failed to delete book')
    }
  }
}

const handleBarcodeScanned = (barcode: string) => {
  if (showAddModal.value) {
    newBook.value.barcode = barcode
  } else if (showEditModal.value && selectedBook.value) {
    selectedBook.value.barcode = barcode
  }
}

const loadBooks = async () => {
  const response = await bookStore.getBooks({
    page: currentPage.value,
    limit: itemsPerPage.value,
    search: searchQuery.value
  })
  books.value = response.books
}

onMounted(() => {
  loadBooks()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div class="flex gap-4 flex-1">
        <Input
          v-model="searchQuery"
          placeholder="Search books..."
          class="max-w-md"
          @input="loadBooks"
        />
        <BarcodeScanner @code-scanned="handleBarcodeScanned" />
      </div>
      <Button @click="showAddModal = true">Add New Book</Button>
    </div>

    <Table>
      <template #header>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>ISBN</th>
          <th>Signature</th>
          <th>Inventory #</th>
          <th>Actions</th>
        </tr>
      </template>
      <template #body>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.isbn }}</td>
          <td>{{ book.signature }}</td>
          <td>{{ book.inventoryNumber }}</td>
          <td class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              @click="selectedBook = book; showEditModal = true"
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              @click="handleDeleteBook(book)"
            >
              Delete
            </Button>
          </td>
        </tr>
      </template>
    </Table>

    <!-- Add Book Modal -->
    <Modal v-model:show="showAddModal" title="Add New Book">
      <div class="space-y-4">
        <Input v-model="newBook.title" label="Title" required />
        <Input v-model="newBook.author" label="Author" required />
        <Input v-model="newBook.isbn" label="ISBN" required />
        <Input v-model="newBook.barcode" label="Barcode" />
        <Input v-model="newBook.inventoryNumber" label="Inventory Number" required />
      </div>
      <template #footer>
        <Button variant="outline" @click="showAddModal = false">Cancel</Button>
        <Button @click="handleAddBook">Add Book</Button>
      </template>
    </Modal>

    <!-- Edit Book Modal -->
    <Modal v-model:show="showEditModal" title="Edit Book">
      <div class="space-y-4" v-if="selectedBook">
        <Input v-model="selectedBook.title" label="Title" required />
        <Input v-model="selectedBook.author" label="Author" required />
        <Input v-model="selectedBook.isbn" label="ISBN" required />
        <Input v-model="selectedBook.barcode" label="Barcode" />
        <Input v-model="selectedBook.inventoryNumber" label="Inventory Number" required />
      </div>
      <template #footer>
        <Button variant="outline" @click="showEditModal = false">Cancel</Button>
        <Button @click="handleEditBook">Save Changes</Button>
      </template>
    </Modal>
  </div>
</template> 