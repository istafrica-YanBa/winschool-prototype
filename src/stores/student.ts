import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Student {
  id: string
  name: string
  email: string
  class: string
  studentNumber: string
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED'
  enrollmentDate: string
  graduationDate?: string
  address?: string
  phone?: string
  parentEmail?: string
  parentPhone?: string
  dateOfBirth?: string
  grade?: string
  section?: string
}

export const useStudentStore = defineStore('student', () => {
  const students = ref<Student[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Mock data for development
  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@school.edu',
      class: '10A',
      studentNumber: 'ST001',
      status: 'ACTIVE',
      enrollmentDate: '2023-09-01',
      address: '123 Main St',
      phone: '+1234567890',
      parentEmail: 'parent.doe@email.com',
      parentPhone: '+1234567891',
      dateOfBirth: '2008-05-15',
      grade: '10',
      section: 'A'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@school.edu',
      class: '10B',
      studentNumber: 'ST002',
      status: 'ACTIVE',
      enrollmentDate: '2023-09-01',
      address: '456 Oak Ave',
      phone: '+1234567892',
      parentEmail: 'parent.smith@email.com',
      parentPhone: '+1234567893',
      dateOfBirth: '2008-03-22',
      grade: '10',
      section: 'B'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@school.edu',
      class: '11A',
      studentNumber: 'ST003',
      status: 'ACTIVE',
      enrollmentDate: '2022-09-01',
      address: '789 Pine Rd',
      phone: '+1234567894',
      parentEmail: 'parent.johnson@email.com',
      parentPhone: '+1234567895',
      dateOfBirth: '2007-11-08',
      grade: '11',
      section: 'A'
    }
  ]

  const fetchStudents = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      students.value = mockStudents
    } catch (err) {
      error.value = 'Failed to fetch students'
      console.error('Error fetching students:', err)
    } finally {
      loading.value = false
    }
  }

  const searchStudents = async (query: string): Promise<Student[]> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const filtered = mockStudents.filter(student => 
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.studentNumber.toLowerCase().includes(query.toLowerCase()) ||
        student.email.toLowerCase().includes(query.toLowerCase()) ||
        student.class.toLowerCase().includes(query.toLowerCase())
      )
      
      return filtered
    } catch (err) {
      error.value = 'Failed to search students'
      console.error('Error searching students:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getStudentById = async (id: string): Promise<Student | null> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const student = mockStudents.find(s => s.id === id)
      return student || null
    } catch (err) {
      error.value = 'Failed to fetch student'
      console.error('Error fetching student:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const getStudentByNumber = async (studentNumber: string): Promise<Student | null> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const student = mockStudents.find(s => s.studentNumber === studentNumber)
      return student || null
    } catch (err) {
      error.value = 'Failed to fetch student'
      console.error('Error fetching student:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createStudent = async (studentData: Omit<Student, 'id'>): Promise<Student> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newStudent: Student = {
        ...studentData,
        id: Date.now().toString()
      }
      
      students.value.push(newStudent)
      return newStudent
    } catch (err) {
      error.value = 'Failed to create student'
      console.error('Error creating student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateStudent = async (id: string, studentData: Partial<Student>): Promise<Student> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = students.value.findIndex(s => s.id === id)
      if (index === -1) {
        throw new Error('Student not found')
      }
      
      const updatedStudent = { ...students.value[index], ...studentData }
      students.value[index] = updatedStudent
      
      return updatedStudent
    } catch (err) {
      error.value = 'Failed to update student'
      console.error('Error updating student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteStudent = async (id: string): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = students.value.findIndex(s => s.id === id)
      if (index === -1) {
        throw new Error('Student not found')
      }
      
      students.value.splice(index, 1)
    } catch (err) {
      error.value = 'Failed to delete student'
      console.error('Error deleting student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    students,
    loading,
    error,
    
    // Actions
    fetchStudents,
    searchStudents,
    getStudentById,
    getStudentByNumber,
    createStudent,
    updateStudent,
    deleteStudent
  }
}) 