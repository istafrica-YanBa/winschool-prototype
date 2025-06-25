import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Course {
  id: string
  name: string
  code: string
  description?: string
  teacher: string
  teacherId?: string
  grade: string
  subject: string
  semester: string
  year: string
  studentCount: number
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED'
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

export const useCourseStore = defineStore('course', () => {
  const courses = ref<Course[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Mock data for development
  const mockCourses: Course[] = [
    {
      id: '1',
      name: 'Advanced Mathematics',
      code: 'MATH401',
      description: 'Advanced mathematics course covering calculus and algebra',
      teacher: 'Dr. Johnson',
      teacherId: 't001',
      grade: '10',
      subject: 'Mathematics',
      semester: 'Fall',
      year: '2024',
      studentCount: 25,
      status: 'ACTIVE',
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      createdAt: '2024-08-15T00:00:00Z',
      updatedAt: '2024-08-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'Physics Fundamentals',
      code: 'PHYS201',
      description: 'Introduction to physics principles and laboratory work',
      teacher: 'Prof. Smith',
      teacherId: 't002',
      grade: '10',
      subject: 'Physics',
      semester: 'Fall',
      year: '2024',
      studentCount: 20,
      status: 'ACTIVE',
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      createdAt: '2024-08-15T00:00:00Z',
      updatedAt: '2024-08-15T00:00:00Z'
    },
    {
      id: '3',
      name: 'Literature Analysis',
      code: 'ENG301',
      description: 'Critical analysis of classical and modern literature',
      teacher: 'Mrs. Williams',
      teacherId: 't003',
      grade: '11',
      subject: 'English',
      semester: 'Fall',
      year: '2024',
      studentCount: 22,
      status: 'ACTIVE',
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      createdAt: '2024-08-15T00:00:00Z',
      updatedAt: '2024-08-15T00:00:00Z'
    }
  ]

  const fetchCourses = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      courses.value = mockCourses
    } catch (err) {
      error.value = 'Failed to fetch courses'
      console.error('Error fetching courses:', err)
    } finally {
      loading.value = false
    }
  }

  const searchCourses = async (query: string): Promise<Course[]> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const filtered = mockCourses.filter(course => 
        course.name.toLowerCase().includes(query.toLowerCase()) ||
        course.code.toLowerCase().includes(query.toLowerCase()) ||
        course.teacher.toLowerCase().includes(query.toLowerCase()) ||
        course.subject.toLowerCase().includes(query.toLowerCase()) ||
        course.grade.toLowerCase().includes(query.toLowerCase())
      )
      
      return filtered
    } catch (err) {
      error.value = 'Failed to search courses'
      console.error('Error searching courses:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getCourseById = async (id: string): Promise<Course | null> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const course = mockCourses.find(c => c.id === id)
      return course || null
    } catch (err) {
      error.value = 'Failed to fetch course'
      console.error('Error fetching course:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const getCourseByCode = async (code: string): Promise<Course | null> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const course = mockCourses.find(c => c.code === code)
      return course || null
    } catch (err) {
      error.value = 'Failed to fetch course'
      console.error('Error fetching course:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newCourse: Course = {
        ...courseData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      courses.value.push(newCourse)
      return newCourse
    } catch (err) {
      error.value = 'Failed to create course'
      console.error('Error creating course:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCourse = async (id: string, courseData: Partial<Course>): Promise<Course> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = courses.value.findIndex(c => c.id === id)
      if (index === -1) {
        throw new Error('Course not found')
      }
      
      const updatedCourse = { 
        ...courses.value[index], 
        ...courseData,
        updatedAt: new Date().toISOString()
      }
      courses.value[index] = updatedCourse
      
      return updatedCourse
    } catch (err) {
      error.value = 'Failed to update course'
      console.error('Error updating course:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCourse = async (id: string): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = courses.value.findIndex(c => c.id === id)
      if (index === -1) {
        throw new Error('Course not found')
      }
      
      courses.value.splice(index, 1)
    } catch (err) {
      error.value = 'Failed to delete course'
      console.error('Error deleting course:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    courses,
    loading,
    error,
    
    // Actions
    fetchCourses,
    searchCourses,
    getCourseById,
    getCourseByCode,
    createCourse,
    updateCourse,
    deleteCourse
  }
}) 