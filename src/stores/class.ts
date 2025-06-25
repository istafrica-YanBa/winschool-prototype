import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SchoolClass {
  id: string
  name: string
  grade: string
  section: string
  year: string
  teacher: string
  teacherId?: string
  studentCount: number
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export const useClassStore = defineStore('class', () => {
  const classes = ref<SchoolClass[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Mock data for development
  const mockClasses: SchoolClass[] = [
    {
      id: '1',
      name: '10A',
      grade: '10',
      section: 'A',
      year: '2024',
      teacher: 'Mrs. Johnson',
      teacherId: 't001',
      studentCount: 25,
      status: 'ACTIVE',
      createdAt: '2023-09-01T00:00:00Z',
      updatedAt: '2023-09-01T00:00:00Z'
    },
    {
      id: '2',
      name: '10B',
      grade: '10',
      section: 'B',
      year: '2024',
      teacher: 'Mr. Smith',
      teacherId: 't002',
      studentCount: 23,
      status: 'ACTIVE',
      createdAt: '2023-09-01T00:00:00Z',
      updatedAt: '2023-09-01T00:00:00Z'
    },
    {
      id: '3',
      name: '11A',
      grade: '11',
      section: 'A',
      year: '2024',
      teacher: 'Dr. Williams',
      teacherId: 't003',
      studentCount: 22,
      status: 'ACTIVE',
      createdAt: '2022-09-01T00:00:00Z',
      updatedAt: '2023-09-01T00:00:00Z'
    }
  ]

  const fetchClasses = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      classes.value = mockClasses
    } catch (err) {
      error.value = 'Failed to fetch classes'
      console.error('Error fetching classes:', err)
    } finally {
      loading.value = false
    }
  }

  const searchClasses = async (query: string): Promise<SchoolClass[]> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const filtered = mockClasses.filter(schoolClass => 
        schoolClass.name.toLowerCase().includes(query.toLowerCase()) ||
        schoolClass.grade.toLowerCase().includes(query.toLowerCase()) ||
        schoolClass.teacher.toLowerCase().includes(query.toLowerCase()) ||
        schoolClass.section.toLowerCase().includes(query.toLowerCase())
      )
      
      return filtered
    } catch (err) {
      error.value = 'Failed to search classes'
      console.error('Error searching classes:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getClassById = async (id: string): Promise<SchoolClass | null> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const schoolClass = mockClasses.find(c => c.id === id)
      return schoolClass || null
    } catch (err) {
      error.value = 'Failed to fetch class'
      console.error('Error fetching class:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createClass = async (classData: Omit<SchoolClass, 'id' | 'createdAt' | 'updatedAt'>): Promise<SchoolClass> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newClass: SchoolClass = {
        ...classData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      classes.value.push(newClass)
      return newClass
    } catch (err) {
      error.value = 'Failed to create class'
      console.error('Error creating class:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateClass = async (id: string, classData: Partial<SchoolClass>): Promise<SchoolClass> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = classes.value.findIndex(c => c.id === id)
      if (index === -1) {
        throw new Error('Class not found')
      }
      
      const updatedClass = { 
        ...classes.value[index], 
        ...classData,
        updatedAt: new Date().toISOString()
      }
      classes.value[index] = updatedClass
      
      return updatedClass
    } catch (err) {
      error.value = 'Failed to update class'
      console.error('Error updating class:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteClass = async (id: string): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = classes.value.findIndex(c => c.id === id)
      if (index === -1) {
        throw new Error('Class not found')
      }
      
      classes.value.splice(index, 1)
    } catch (err) {
      error.value = 'Failed to delete class'
      console.error('Error deleting class:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    classes,
    loading,
    error,
    
    // Actions
    fetchClasses,
    searchClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass
  }
}) 