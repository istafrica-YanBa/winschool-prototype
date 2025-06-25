import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BookReservation } from '@/types/library'
import { api } from '@/plugins/axios'

export const useReservationStore = defineStore('reservation', () => {
  const reservations = ref<BookReservation[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getReservations = async ({ page = 1, limit = 10, search = '' }) => {
    try {
      loading.value = true
      const response = await api.get('/api/library/reservations', {
        params: { page, limit, search }
      })
      reservations.value = response.data.reservations
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch reservations'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createReservation = async (reservationData: {
    bookId: string
    studentId: string
    expiryDate: string
  }) => {
    try {
      loading.value = true
      const response = await api.post('/api/library/reservations', reservationData)
      reservations.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = 'Failed to create reservation'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelReservation = async (reservationId: string) => {
    try {
      loading.value = true
      const response = await api.put(`/api/library/reservations/${reservationId}/cancel`)
      const index = reservations.value.findIndex(r => r.id === reservationId)
      if (index !== -1) {
        reservations.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to cancel reservation'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fulfillReservation = async (reservationId: string) => {
    try {
      loading.value = true
      const response = await api.put(`/api/library/reservations/${reservationId}/fulfill`)
      const index = reservations.value.findIndex(r => r.id === reservationId)
      if (index !== -1) {
        reservations.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to fulfill reservation'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getStudentReservations = async (studentId: string) => {
    try {
      loading.value = true
      const response = await api.get(`/api/library/reservations/student/${studentId}`)
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch student reservations'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getBookReservations = async (bookId: string) => {
    try {
      loading.value = true
      const response = await api.get(`/api/library/reservations/book/${bookId}`)
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch book reservations'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    reservations,
    loading,
    error,
    getReservations,
    createReservation,
    cancelReservation,
    fulfillReservation,
    getStudentReservations,
    getBookReservations
  }
}) 