<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary hover:bg-winschool-primary-dark rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <Shield class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Zugriffsrechte verwalten' : 'Manage Access Rights' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Benutzer- und Gruppenberechtigungen konfigurieren' : 'Configure user and group permissions' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="showBulkUpdateModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <UserCheck class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Rechte bearbeiten' : 'Edit Rights' }}
          </button>
        </div>
      </div>

      <!-- Tabs for Group vs Individual Users -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex">
            <button
              @click="activeTab = 'groups'"
              :class="activeTab === 'groups' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
              class="whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors"
            >
              {{ language === 'de' ? 'Gruppenrechte' : 'Group Rights' }}
            </button>
            <button
              @click="activeTab = 'users'"
              :class="activeTab === 'users' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
              class="whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors"
            >
              {{ language === 'de' ? 'Individuelle Benutzer' : 'Individual Users' }}
            </button>
          </nav>
        </div>

        <!-- Group Rights Tab -->
        <div v-if="activeTab === 'groups'" class="p-6">
          <div class="space-y-6">
            <div v-for="group in userGroups" :key="group.id" class="border border-gray-200 dark:border-gray-600 rounded-lg">
              <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-t-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ group.name }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ group.description }}</p>
                    <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">{{ group.memberCount }} {{ language === 'de' ? 'Mitglieder' : 'members' }}</p>
                  </div>
                  <button
                    @click="editGroupRights(group)"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  >
                    <Edit class="h-4 w-4 mr-2" />
                    {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
                  </button>
                </div>
              </div>
              
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div v-for="module in accessModules" :key="module.key" class="space-y-2">
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ module.name }}</h4>
                    <div class="space-y-1">
                      <label v-for="permission in module.permissions" :key="permission.key" class="flex items-center">
                        <input
                          type="checkbox"
                          :checked="hasGroupPermission(group.id, module.key, permission.key)"
                          @change="toggleGroupPermission(group.id, module.key, permission.key)"
                          class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ permission.name }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Individual Users Tab -->
        <div v-if="activeTab === 'users'" class="p-6">
          <div class="mb-6">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                v-model="userSearchQuery"
                type="text"
                :placeholder="language === 'de' ? 'Benutzer suchen...' : 'Search users...'"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div class="space-y-4">
            <div v-for="user in filteredUsers" :key="user.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <img :src="user.avatar" :alt="user.name" class="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">{{ user.name }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ user.email }}</p>
                    <p class="text-xs text-blue-600 dark:text-blue-400">{{ getRoleDisplayName(user.role) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="resetUserPassword(user)"
                    class="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm flex items-center transition-colors"
                  >
                    <Key class="h-4 w-4 mr-1" />
                    {{ language === 'de' ? 'Passwort zurücksetzen' : 'Reset Password' }}
                  </button>
                  <button
                    @click="editUserRights(user)"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center transition-colors"
                  >
                    <Edit class="h-4 w-4 mr-1" />
                    {{ language === 'de' ? 'Rechte bearbeiten' : 'Edit Rights' }}
                  </button>
                </div>
              </div>

              <!-- User's overridden permissions -->
              <div v-if="user.customPermissions && user.customPermissions.length > 0" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  {{ language === 'de' ? 'Überschriebene Berechtigungen' : 'Overridden Permissions' }}
                </h4>
                <div class="space-y-1">
                  <span v-for="permission in user.customPermissions" :key="permission" class="inline-block bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs mr-2">
                    {{ permission }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Group Rights Modal -->
      <div v-if="showGroupEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Gruppenrechte bearbeiten:' : 'Edit Group Rights:' }} {{ selectedGroup?.name }}
            </h3>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="module in accessModules" :key="module.key" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-3">{{ module.name }}</h4>
                <div class="space-y-2">
                  <label v-for="permission in module.permissions" :key="permission.key" class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="editingGroupPermissions[`${module.key}.${permission.key}`]"
                      class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ permission.name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button
              @click="cancelGroupEdit"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button
              @click="saveGroupRights"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {{ language === 'de' ? 'Speichern' : 'Save' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Edit User Rights Modal -->
      <div v-if="showUserEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Benutzerrechte bearbeiten:' : 'Edit User Rights:' }} {{ selectedUser?.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ language === 'de' ? 'Standardgruppe:' : 'Default group:' }} {{ getRoleDisplayName(selectedUser?.role) }}
            </p>
          </div>
          
          <div class="p-6">
            <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p class="text-sm text-blue-800 dark:text-blue-200">
                {{ language === 'de' 
                  ? 'Hier können Sie individuelle Berechtigungen festlegen, die die Standardgruppenrechte überschreiben.' 
                  : 'Here you can set individual permissions that override the default group rights.' 
                }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="module in accessModules" :key="module.key" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-3">{{ module.name }}</h4>
                <div class="space-y-2">
                  <label v-for="permission in module.permissions" :key="permission.key" class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="editingUserPermissions[`${module.key}.${permission.key}`]"
                      class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ permission.name }}</span>
                    <span v-if="hasGroupPermission(getGroupByRole(selectedUser?.role || '')?.id, module.key, permission.key)" class="ml-2 text-xs text-green-600 dark:text-green-400">({{ language === 'de' ? 'Gruppe' : 'Group' }})</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button
              @click="cancelUserEdit"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button
              @click="saveUserRights"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {{ language === 'de' ? 'Speichern' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Shield, Edit, Search, Key } from 'lucide-vue-next'

// Language setting
const language = ref('en')

// Active tab
const activeTab = ref('groups')

// Search
const userSearchQuery = ref('')

// Modals
const showGroupEditModal = ref(false)
const showUserEditModal = ref(false)
const showBulkUpdateModal = ref(false)
const selectedGroup = ref<UserGroup | null>(null)
const selectedUser = ref<User | null>(null)
const editingGroupPermissions = ref<Record<string, boolean>>({})
const editingUserPermissions = ref<Record<string, boolean>>({})

// Add proper type definitions
interface UserGroup {
  id: string
  name: string
  role: string
  permissions: Record<string, string[]>
}

interface User {
  id: string
  name: string
  role: string
  customPermissions: Record<string, string[]>
}

// Predefined user groups as mentioned in requirements
const userGroups = ref([
  {
    id: 'system-support',
    name: language.value === 'de' ? 'System Support' : 'System Support',
    description: language.value === 'de' ? 'Vollzugriff auf alle Systemfunktionen' : 'Full access to all system functions',
    memberCount: 3
  },
  {
    id: 'school-management',
    name: language.value === 'de' ? 'Schulleitung' : 'School Management',
    description: language.value === 'de' ? 'Verwaltung der gesamten Schule' : 'Management of the entire school',
    memberCount: 5
  },
  {
    id: 'department-head',
    name: language.value === 'de' ? 'Abteilungsleitung' : 'Department Head',
    description: language.value === 'de' ? 'Leitung einzelner Abteilungen' : 'Management of individual departments',
    memberCount: 12
  },
  {
    id: 'teaching-staff',
    name: language.value === 'de' ? 'Lehrpersonal' : 'Teaching Staff',
    description: language.value === 'de' ? 'Unterricht und Bewertung' : 'Teaching and assessment',
    memberCount: 45
  },
  {
    id: 'admin-staff-1',
    name: language.value === 'de' ? 'Verwaltungspersonal 1' : 'Administrative Staff 1',
    description: language.value === 'de' ? 'Erweiterte Verwaltungsfunktionen' : 'Extended administrative functions',
    memberCount: 8
  },
  {
    id: 'admin-staff-2',
    name: language.value === 'de' ? 'Verwaltungspersonal 2' : 'Administrative Staff 2',
    description: language.value === 'de' ? 'Grundlegende Verwaltungsfunktionen' : 'Basic administrative functions',
    memberCount: 15
  }
])

// Access modules and permissions
const accessModules = ref([
  {
    key: 'user-management',
    name: language.value === 'de' ? 'Benutzerverwaltung' : 'User Management',
    permissions: [
      { key: 'create', name: language.value === 'de' ? 'Erstellen' : 'Create' },
      { key: 'read', name: language.value === 'de' ? 'Anzeigen' : 'View' },
      { key: 'update', name: language.value === 'de' ? 'Bearbeiten' : 'Edit' },
      { key: 'delete', name: language.value === 'de' ? 'Löschen' : 'Delete' }
    ]
  },
  {
    key: 'student-management',
    name: language.value === 'de' ? 'Schülerverwaltung' : 'Student Management',
    permissions: [
      { key: 'create', name: language.value === 'de' ? 'Erstellen' : 'Create' },
      { key: 'read', name: language.value === 'de' ? 'Anzeigen' : 'View' },
      { key: 'update', name: language.value === 'de' ? 'Bearbeiten' : 'Edit' },
      { key: 'delete', name: language.value === 'de' ? 'Löschen' : 'Delete' }
    ]
  },
  {
    key: 'teacher-management',
    name: language.value === 'de' ? 'Lehrerverwaltung' : 'Teacher Management',
    permissions: [
      { key: 'create', name: language.value === 'de' ? 'Erstellen' : 'Create' },
      { key: 'read', name: language.value === 'de' ? 'Anzeigen' : 'View' },
      { key: 'update', name: language.value === 'de' ? 'Bearbeiten' : 'Edit' },
      { key: 'delete', name: language.value === 'de' ? 'Löschen' : 'Delete' }
    ]
  },
  {
    key: 'learning-areas',
    name: language.value === 'de' ? 'Lernfelder' : 'Learning Areas',
    permissions: [
      { key: 'create', name: language.value === 'de' ? 'Erstellen' : 'Create' },
      { key: 'read', name: language.value === 'de' ? 'Anzeigen' : 'View' },
      { key: 'update', name: language.value === 'de' ? 'Bearbeiten' : 'Edit' },
      { key: 'assessments', name: language.value === 'de' ? 'Bewertungen' : 'Assessments' }
    ]
  },
  {
    key: 'timetable',
    name: language.value === 'de' ? 'Stundenplan' : 'Timetable',
    permissions: [
      { key: 'create', name: language.value === 'de' ? 'Erstellen' : 'Create' },
      { key: 'read', name: language.value === 'de' ? 'Anzeigen' : 'View' },
      { key: 'update', name: language.value === 'de' ? 'Bearbeiten' : 'Edit' },
      { key: 'publish', name: language.value === 'de' ? 'Veröffentlichen' : 'Publish' }
    ]
  },
  {
    key: 'statistics',
    name: language.value === 'de' ? 'Statistiken' : 'Statistics',
    permissions: [
      { key: 'read', name: language.value === 'de' ? 'Anzeigen' : 'View' },
      { key: 'create-queries', name: language.value === 'de' ? 'Abfragen erstellen' : 'Create Queries' },
      { key: 'import', name: language.value === 'de' ? 'Importieren' : 'Import' },
      { key: 'export', name: language.value === 'de' ? 'Exportieren' : 'Export' }
    ]
  },
  {
    key: 'reports',
    name: language.value === 'de' ? 'Berichte' : 'Reports',
    permissions: [
      { key: 'read', name: language.value === 'de' ? 'Anzeigen' : 'View' },
      { key: 'create', name: language.value === 'de' ? 'Erstellen' : 'Create' },
      { key: 'export', name: language.value === 'de' ? 'Exportieren' : 'Export' },
      { key: 'print', name: language.value === 'de' ? 'Drucken' : 'Print' }
    ]
  },
  {
    key: 'system-settings',
    name: language.value === 'de' ? 'Systemeinstellungen' : 'System Settings',
    permissions: [
      { key: 'read', name: language.value === 'de' ? 'Anzeigen' : 'View' },
      { key: 'update', name: language.value === 'de' ? 'Bearbeiten' : 'Edit' },
      { key: 'backup', name: language.value === 'de' ? 'Backup' : 'Backup' },
      { key: 'restore', name: language.value === 'de' ? 'Wiederherstellen' : 'Restore' }
    ]
  }
])

// Mock users data
const users = ref([
  {
    id: 1,
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@winschool.edu',
    role: 'schooladmin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    customPermissions: ['learning-areas.assessments', 'statistics.export']
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    email: 'michael.chen@winschool.edu',
    role: 'principal',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    customPermissions: []
  },
  {
    id: 3,
    name: 'Ms. Emily Rodriguez',
    email: 'emily.rodriguez@winschool.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    customPermissions: ['timetable.update']
  }
])

// Mock group permissions (in real app, this would come from API)
const groupPermissions = ref<Record<string, Record<string, string[]>>>({
  'system-support': {
    'user-management': ['create', 'read', 'update', 'delete'],
    'student-management': ['create', 'read', 'update', 'delete'],
    'teacher-management': ['create', 'read', 'update', 'delete'],
    'learning-areas': ['create', 'read', 'update', 'assessments'],
    'timetable': ['create', 'read', 'update', 'publish'],
    'statistics': ['read', 'create-queries', 'import', 'export'],
    'reports': ['read', 'create', 'export', 'print'],
    'system-settings': ['read', 'update', 'backup', 'restore']
  },
  'school-management': {
    'user-management': ['read', 'update'],
    'student-management': ['create', 'read', 'update', 'delete'],
    'teacher-management': ['create', 'read', 'update'],
    'learning-areas': ['create', 'read', 'update', 'assessments'],
    'timetable': ['create', 'read', 'update', 'publish'],
    'statistics': ['read', 'create-queries', 'export'],
    'reports': ['read', 'create', 'export', 'print'],
    'system-settings': ['read']
  },
  'teaching-staff': {
    'student-management': ['read'],
    'learning-areas': ['read', 'assessments'],
    'timetable': ['read'],
    'statistics': ['read'],
    'reports': ['read', 'export']
  }
})

// Computed
const filteredUsers = computed(() => {
  if (!userSearchQuery.value) return users.value
  return users.value.filter(user => 
    user.name.toLowerCase().includes(userSearchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.value.toLowerCase())
  )
})

// Methods
const getRoleDisplayName = (role: string) => {
  const roleNames: Record<string, string> = {
    'superadmin': language.value === 'de' ? 'Super Admin' : 'Super Admin',
    'schooladmin': language.value === 'de' ? 'Schuladmin' : 'School Admin',
    'admin': language.value === 'de' ? 'Administrator' : 'Administrator',
    'principal': language.value === 'de' ? 'Schulleiter' : 'Principal',
    'teacher': language.value === 'de' ? 'Lehrer' : 'Teacher',
    'schoolstaff': language.value === 'de' ? 'Schulpersonal' : 'School Staff'
  }
  return roleNames[role] || role
}

const getGroupByRole = (role: string) => {
  return userGroups.value.find(group => group.role === role) || null
}

const hasGroupPermission = (groupId: string, moduleKey: string, permissionKey: string) => {
  return groupPermissions.value[groupId]?.[moduleKey]?.includes(permissionKey) || false
}

const toggleGroupPermission = (groupId: string, moduleKey: string, permissionKey: string) => {
  if (!groupPermissions.value[groupId]) {
    groupPermissions.value[groupId] = {}
  }
  if (!groupPermissions.value[groupId][moduleKey]) {
    groupPermissions.value[groupId][moduleKey] = []
  }
  
  const permissions = groupPermissions.value[groupId][moduleKey]
  const index = permissions.indexOf(permissionKey)
  if (index > -1) {
    permissions.splice(index, 1)
  } else {
    permissions.push(permissionKey)
  }
}

const editGroupRights = (group: any) => {
  selectedGroup.value = group
  editingGroupPermissions.value = {}
  
  // Initialize editing permissions
  accessModules.value.forEach(module => {
    module.permissions.forEach(permission => {
      const key = `${module.key}.${permission.key}`
      editingGroupPermissions.value[key] = hasGroupPermission(group.id, module.key, permission.key)
    })
  })
  
  showGroupEditModal.value = true
}

const editUserRights = (user: any) => {
  selectedUser.value = user
  editingUserPermissions.value = {}
  
  // Initialize editing permissions
  accessModules.value.forEach(module => {
    module.permissions.forEach(permission => {
      const key = `${module.key}.${permission.key}`
      const hasCustom = user.customPermissions?.includes(key) || false
      editingUserPermissions.value[key] = hasCustom
    })
  })
  
  showUserEditModal.value = true
}

const cancelGroupEdit = () => {
  showGroupEditModal.value = false
  selectedGroup.value = null
  editingGroupPermissions.value = {}
}

const cancelUserEdit = () => {
  showUserEditModal.value = false
  selectedUser.value = null
  editingUserPermissions.value = {}
}

const saveGroupRights = () => {
  if (!selectedGroup.value) return
  const groupId = selectedGroup.value.id
  if (!groupId) return
  // Update group permissions
  Object.keys(editingGroupPermissions.value).forEach(key => {
    const [moduleKey, permissionKey] = key.split('.')
    const hasPermission = editingGroupPermissions.value[key]
    if (!groupPermissions.value[groupId]) {
      groupPermissions.value[groupId] = {}
    }
    if (!groupPermissions.value[groupId][moduleKey]) {
      groupPermissions.value[groupId][moduleKey] = []
    }
    const permissions = groupPermissions.value[groupId][moduleKey]
    const index = permissions.indexOf(permissionKey)
    if (hasPermission && index === -1) {
      permissions.push(permissionKey)
    } else if (!hasPermission && index > -1) {
      permissions.splice(index, 1)
    }
  })
  showGroupEditModal.value = false
  selectedGroup.value = null
}

const saveUserRights = () => {
  if (!selectedUser.value) return
  
  // Update user custom permissions
  const customPermissions: string[] = []
  Object.keys(editingUserPermissions.value).forEach(key => {
    if (editingUserPermissions.value[key]) {
      customPermissions.push(key)
    }
  })
  
  if (selectedUser.value) {
    selectedUser.value.customPermissions = customPermissions
  }
  showUserEditModal.value = false
  selectedUser.value = null
}

const resetUserPassword = (user: any) => {
  // In real app, this would call an API
  alert(`Password reset email sent to ${user.email}`)
}

onMounted(() => {
  // Component initialization
})
</script> 