import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  role: 'superadmin' | 'schooladmin' | 'student' | 'parent' | 'teacher' | 'admin' | 'principal' | 'inspector' | 'schoolstaff' | 'librarian'
  avatar?: string
  institution?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Extract role from email address
    const role = email.split('@')[0]
    
    // Mock user data based on role
    const mockUsers: Record<string, User> = {
      superadmin: {
        id: '0',
        name: 'Admin Master',
        email: 'superadmin@winschool.de',
        role: 'superadmin',
        avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        institution: 'WinSchool Headquarters'
      },
      schooladmin: {
        id: '00',
        name: 'School Admin',
        email: 'schooladmin@winschool.de',
        role: 'schooladmin',
        avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        institution: 'Gymnasium Berlin-Mitte'
      },
      student: {
        id: '1',
        name: 'Max Müller',
        email: 'student@winschool.de',
        role: 'student',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        institution: 'Gymnasium Berlin-Mitte'
      },
      parent: {
        id: '2',
        name: 'Anna Schmidt',
        email: 'parent@winschool.de',
        role: 'parent',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        institution: 'Gymnasium Berlin-Mitte'
      },
      teacher: {
        id: '3',
        name: 'Dr. Thomas Weber',
        email: 'teacher@winschool.de',
        role: 'teacher',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        institution: 'Gymnasium Berlin-Mitte'
      },
      admin: {
        id: '4',
        name: 'Sarah Fischer',
        email: 'admin@winschool.de',
        role: 'admin',
        avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        institution: 'Gymnasium Berlin-Mitte'
      },
      principal: {
        id: '5',
        name: 'Prof. Dr. Michael Wagner',
        email: 'principal@winschool.de',
        role: 'principal',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        institution: 'Gymnasium Berlin-Mitte'
      },
      inspector: {
        id: '6',
        name: 'Dr. Elisabeth Bauer',
        email: 'inspector@winschool.de',
        role: 'inspector',
        avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        institution: 'Ministry of Education Berlin'
      },
      schoolstaff: {
        id: '7',
        name: 'Maria Rodriguez',
        email: 'schoolstaff@winschool.de',
        role: 'schoolstaff',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        institution: 'Gymnasium Berlin-Mitte'
      },
      librarian: {
        id: '8',
        name: 'Emma Thompson',
        email: 'librarian@winschool.de',
        role: 'librarian',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        institution: 'Gymnasium Berlin-Mitte'
      }
    }

    user.value = mockUsers[role] || mockUsers.student
    localStorage.setItem('winschool_user', JSON.stringify(user.value))
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('winschool_user')
  }

  const initializeAuth = () => {
    const savedUser = localStorage.getItem('winschool_user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        // Validate the user object and role
        if (parsedUser && parsedUser.role && ['superadmin', 'schooladmin', 'admin', 'principal', 'teacher', 'student', 'parent', 'inspector', 'schoolstaff', 'librarian'].includes(parsedUser.role)) {
          user.value = parsedUser
        } else {
          // Invalid user data, clear it
          localStorage.removeItem('winschool_user')
        }
      } catch (e) {
        // Invalid JSON, clear it
        localStorage.removeItem('winschool_user')
      }
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initializeAuth
  }
})