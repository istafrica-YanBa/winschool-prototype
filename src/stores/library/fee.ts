import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BookFee } from '@/types/library'
import { api } from '@/plugins/axios'

export const useFeeStore = defineStore('fee', () => {
  const fees = ref<BookFee[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getFees = async ({ page = 1, limit = 10, search = '' }) => {
    try {
      loading.value = true
      const response = await api.get('/api/library/fees', {
        params: { page, limit, search }
      })
      fees.value = response.data.fees
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch fees'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createFee = async (feeData: {
    loanId: string
    amount: number
    reason: string
    dueDate: string
  }) => {
    try {
      loading.value = true
      const response = await api.post('/api/library/fees', feeData)
      fees.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = 'Failed to create fee'
      throw err
    } finally {
      loading.value = false
    }
  }

  const payFee = async (feeId: string) => {
    try {
      loading.value = true
      const response = await api.put(`/api/library/fees/${feeId}/pay`)
      const index = fees.value.findIndex(f => f.id === feeId)
      if (index !== -1) {
        fees.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to pay fee'
      throw err
    } finally {
      loading.value = false
    }
  }

  const waiveFee = async (feeId: string) => {
    try {
      loading.value = true
      const response = await api.put(`/api/library/fees/${feeId}/waive`)
      const index = fees.value.findIndex(f => f.id === feeId)
      if (index !== -1) {
        fees.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to waive fee'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getStudentFees = async (studentId: string) => {
    try {
      loading.value = true
      const response = await api.get(`/api/library/fees/student/${studentId}`)
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch student fees'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    fees,
    loading,
    error,
    getFees,
    createFee,
    payFee,
    waiveFee,
    getStudentFees
  }
}) 