import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Book } from '@/types/library'
import { api } from '@/plugins/axios'

export const useBookStore = defineStore('book', () => {
  const books = ref<Book[]>([])
  const totalBooks = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getBooks = async ({ page = 1, limit = 10, search = '' }) => {
    try {
      loading.value = true
      const response = await api.get('/api/library/books', {
        params: { page, limit, search }
      })
      books.value = response.data.books
      totalBooks.value = response.data.total
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch books'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addBook = async (book: Omit<Book, 'id'>) => {
    try {
      loading.value = true
      const response = await api.post('/api/library/books', book)
      books.value.push(response.data)
      totalBooks.value++
      return response.data
    } catch (err) {
      error.value = 'Failed to add book'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateBook = async (book: Book) => {
    try {
      loading.value = true
      const response = await api.put(`/api/library/books/${book.id}`, book)
      const index = books.value.findIndex(b => b.id === book.id)
      if (index !== -1) {
        books.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to update book'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteBook = async (id: string) => {
    try {
      loading.value = true
      await api.delete(`/api/library/books/${id}`)
      books.value = books.value.filter(b => b.id !== id)
      totalBooks.value--
    } catch (err) {
      error.value = 'Failed to delete book'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getBookByBarcode = async (barcode: string) => {
    try {
      loading.value = true
      const response = await api.get(`/api/library/books/barcode/${barcode}`)
      return response.data
    } catch (err) {
      error.value = 'Failed to find book'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    books,
    totalBooks,
    loading,
    error,
    getBooks,
    addBook,
    updateBook,
    deleteBook,
    getBookByBarcode
  }
}) 