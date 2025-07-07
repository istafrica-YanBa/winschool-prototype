<template>
  <div class="users-view space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Users class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Benutzerverwaltung' : 'User Management' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie Benutzerkonten und Berechtigungen' : 'Manage user accounts and permissions' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showAddUser = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <UserPlus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Benutzer hinzufügen' : 'Add User' }}
        </button>
        <button @click="exportUsers" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Download class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Exportieren' : 'Export' }}
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="language === 'de' ? 'Benutzer suchen...' : 'Search users...'"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <select 
          v-model="selectedRole"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{{ language === 'de' ? 'Alle Rollen' : 'All Roles' }}</option>
          <option v-for="role in roles" :key="role.value" :value="role.value">{{ role.label }}</option>
        </select>
        <select 
          v-model="selectedStatus"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
          <option value="Active">{{ language === 'de' ? 'Aktiv' : 'Active' }}</option>
          <option value="Inactive">{{ language === 'de' ? 'Inaktiv' : 'Inactive' }}</option>
          <option value="Pending">{{ language === 'de' ? 'Ausstehend' : 'Pending' }}</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-700">
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'E-Mail' : 'Email' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Rolle' : 'Role' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Institution' : 'Institution' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Status' : 'Status' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-gray-100 dark:border-gray-700">
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img :src="user.avatar" :alt="user.name" class="h-8 w-8 rounded-full object-cover mr-3" />
                  <span class="font-medium text-gray-900 dark:text-white">{{ user.name }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ user.email }}</td>
              <td class="py-3 px-4">
                <span :class="getRoleBadgeColor(user.role)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getRoleDisplayName(user.role) }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-white">{{ user.institution }}</td>
              <td class="py-3 px-4">
                <span :class="getStatusColor(user.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ user.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="viewUser(user)" class="text-primary-600 hover:text-primary-800">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="editUser(user)" class="text-secondary-600 hover:text-secondary-800">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="toggleUserStatus(user)" class="text-blue-600 hover:text-blue-800">
                    <component :is="user.status === 'Active' ? Lock : Unlock" class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddUser" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neuen Benutzer hinzufügen' : 'Add New User' }}
            </h3>
            <button @click="showAddUser = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="addUser" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Vorname' : 'First Name' }}
                </label>
                <input v-model="userForm.firstName" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Nachname' : 'Last Name' }}
                </label>
                <input v-model="userForm.lastName" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'E-Mail' : 'Email' }}
              </label>
              <input v-model="userForm.email" type="email" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Rolle' : 'Role' }}
              </label>
              <select v-model="userForm.role" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">{{ language === 'de' ? 'Rolle wählen' : 'Select Role' }}</option>
                <option v-for="role in roles" :key="role.value" :value="role.value">{{ role.label }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Institution' : 'Institution' }}
              </label>
              <select v-model="userForm.institution" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">{{ language === 'de' ? 'Institution wählen' : 'Select Institution' }}</option>
                <option value="WinSchool Headquarters">WinSchool Headquarters</option>
                <option v-for="school in schools" :key="school.id" :value="school.name">{{ school.name }}</option>
              </select>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showAddUser = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Benutzer hinzufügen' : 'Add User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Search, Eye, Edit, Lock, Unlock, X, UserPlus, Download, Users } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const showAddUser = ref(false)

const userForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  institution: ''
})

const roles = computed(() => [
  { value: 'superadmin', label: language.value === 'de' ? 'Super-Administrator' : 'Super Administrator' },
  { value: 'schooladmin', label: language.value === 'de' ? 'Schuladministrator' : 'School Administrator' },
  { value: 'principal', label: language.value === 'de' ? 'Schulleiter' : 'Principal' },
  { value: 'teacher', label: language.value === 'de' ? 'Lehrer' : 'Teacher' },
  { value: 'schoolstaff', label: language.value === 'de' ? 'Schulpersonal' : 'School Staff' },
  { value: 'student', label: language.value === 'de' ? 'Schüler' : 'Student' },
  { value: 'parent', label: language.value === 'de' ? 'Eltern' : 'Parent' },
  { value: 'inspector', label: language.value === 'de' ? 'Bildungsinspektor' : 'Educational Inspector' }
])

const schools = ref([
  { id: 1, name: 'Gymnasium Berlin-Mitte' },
  { id: 2, name: 'Realschule Hamburg-Nord' },
  { id: 3, name: 'Gesamtschule München-Süd' },
  { id: 4, name: 'Grundschule Frankfurt-West' },
  { id: 5, name: 'Hauptschule Köln-West' }
])

const users = ref([
  {
    id: 1,
    name: 'Admin Master',
    email: 'admin.master@winschool.de',
    role: 'superadmin',
    institution: 'WinSchool Headquarters',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 2,
    name: 'Sarah Fischer',
    email: 'sarah.fischer@admin.winschool.de',
    role: 'schooladmin',
    institution: 'Gymnasium Berlin-Mitte',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 3,
    name: 'Prof. Dr. Michael Wagner',
    email: 'michael.wagner@principal.winschool.de',
    role: 'principal',
    institution: 'Gymnasium Berlin-Mitte',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 4,
    name: 'Dr. Thomas Weber',
    email: 'thomas.weber@teacher.winschool.de',
    role: 'teacher',
    institution: 'Gymnasium Berlin-Mitte',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 5,
    name: 'Dr. Elisabeth Bauer',
    email: 'elisabeth.bauer@inspector.winschool.de',
    role: 'inspector',
    institution: 'Ministry of Education Berlin',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 6,
    name: 'Max Müller',
    email: 'max.mueller@student.winschool.de',
    role: 'student',
    institution: 'Gymnasium Berlin-Mitte',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 7,
    name: 'Anna Schmidt',
    email: 'anna.schmidt@parent.winschool.de',
    role: 'parent',
    institution: 'Gymnasium Berlin-Mitte',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
])

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.institution.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !selectedRole.value || user.role === selectedRole.value
    const matchesStatus = !selectedStatus.value || user.status === selectedStatus.value
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

const getRoleDisplayName = (role: string) => {
  const roleObj = roles.value.find(r => r.value === role)
  return roleObj ? roleObj.label : role
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'superadmin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'schooladmin':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    case 'principal':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'teacher':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'schoolstaff':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    case 'student':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'parent':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'inspector':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const viewUser = (user: any) => {
  alert(`${language.value === 'de' ? 'Benutzer anzeigen' : 'View user'}: ${user.name}`)
}

const editUser = (user: any) => {
  alert(`${language.value === 'de' ? 'Benutzer bearbeiten' : 'Edit user'}: ${user.name}`)
}

const toggleUserStatus = (user: any) => {
  user.status = user.status === 'Active' ? 'Inactive' : 'Active'
  alert(`${language.value === 'de' ? 'Benutzerstatus geändert zu' : 'User status changed to'}: ${user.status}`)
}

const addUser = () => {
  const newUser = {
    id: users.value.length + 1,
    name: `${userForm.value.firstName} ${userForm.value.lastName}`,
    email: userForm.value.email,
    role: userForm.value.role,
    institution: userForm.value.institution,
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
  
  users.value.push(newUser)
  showAddUser.value = false
  userForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    institution: ''
  }
  
  alert(language.value === 'de' ? 'Benutzer erfolgreich hinzugefügt!' : 'User added successfully!')
}

const exportUsers = () => {
  // Implementation of exportUsers function
}
</script>
