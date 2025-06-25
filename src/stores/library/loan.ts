import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BookLoan } from '@/types/library'
import { api } from '@/plugins/axios'

export const useLoanStore = defineStore('loan', () => {
  const loans = ref<BookLoan[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getStudentLoans = async (studentId: string) => {
    try {
      loading.value = true
      const response = await api.get(`/api/library/loans/student/${studentId}`)
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch student loans'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createLoan = async (loanData: {
    bookId: string
    studentId: string
    dueDate: string
  }) => {
    try {
      loading.value = true
      const response = await api.post('/api/library/loans', loanData)
      loans.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = 'Failed to create loan'
      throw err
    } finally {
      loading.value = false
    }
  }

  const extendLoan = async (loanId: string, newDueDate: string) => {
    try {
      loading.value = true
      const response = await api.put(`/api/library/loans/${loanId}/extend`, {
        dueDate: newDueDate
      })
      const index = loans.value.findIndex(l => l.id === loanId)
      if (index !== -1) {
        loans.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to extend loan'
      throw err
    } finally {
      loading.value = false
    }
  }

  const returnLoan = async (loanId: string) => {
    try {
      loading.value = true
      const response = await api.put(`/api/library/loans/${loanId}/return`)
      const index = loans.value.findIndex(l => l.id === loanId)
      if (index !== -1) {
        loans.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to return loan'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getClassLoans = async (classId: string) => {
    try {
      loading.value = true
      const response = await api.get(`/api/library/loans/class/${classId}`)
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch class loans'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createClassLoan = async (loanData: {
    classId: string
    bookIds: string[]
    startDate: string
    endDate: string
  }) => {
    try {
      loading.value = true
      const response = await api.post('/api/library/loans/class', loanData)
      return response.data
    } catch (err) {
      error.value = 'Failed to create class loan'
      throw err
    } finally {
      loading.value = false
    }
  }

  const returnClassLoan = async (classLoanId: string) => {
    try {
      loading.value = true
      const response = await api.put(`/api/library/loans/class/${classLoanId}/return`)
      return response.data
    } catch (err) {
      error.value = 'Failed to return class loan'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCourseLoans = async (courseId: string) => {
    try {
      loading.value = true
      const response = await api.get(`/api/library/loans/course/${courseId}`)
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch course loans'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCourseLoan = async (loanData: {
    courseId: string
    bookIds: string[]
    startDate: string
    endDate: string
  }) => {
    try {
      loading.value = true
      const response = await api.post('/api/library/loans/course', loanData)
      return response.data
    } catch (err) {
      error.value = 'Failed to create course loan'
      throw err
    } finally {
      loading.value = false
    }
  }

  const returnCourseLoan = async (courseLoanId: string) => {
    try {
      loading.value = true
      const response = await api.put(`/api/library/loans/course/${courseLoanId}/return`)
      return response.data
    } catch (err) {
      error.value = 'Failed to return course loan'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loans,
    loading,
    error,
    getStudentLoans,
    createLoan,
    extendLoan,
    returnLoan,
    getClassLoans,
    createClassLoan,
    returnClassLoan,
    getCourseLoans,
    createCourseLoan,
    returnCourseLoan
  }
}) 