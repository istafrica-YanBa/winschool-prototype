<template>
  <div class="space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen p-6">
    <!-- Header -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2m0 0h4m6 0v1a1 1 0 11-2 0v-1m2 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v10.5" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Abteilungsverwaltung' : 'Department Management' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Abteilungen und Fachbereiche' : 'Manage departments and subject areas' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button 
            @click="showDepartmentModal = true" 
            class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {{ language === 'de' ? 'Neue Abteilung' : 'New Department' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Department Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="stat in departmentStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div :class="stat.iconBg" class="p-3 rounded-lg">
            <component :is="stat.icon" class="h-6 w-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ stat.title }}</p>
            <p class="text-2xl font-bold text-slate-800 dark:text-slate-50">{{ stat.value }}</p>
            <p :class="stat.changeColor" class="text-sm">{{ stat.change }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Departments List -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400">
          {{ language === 'de' ? 'Abteilungen' : 'Departments' }}
        </h2>
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="language === 'de' ? 'Abteilungen suchen...' : 'Search departments...'"
            class="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
          />
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Abteilungsleiter' : 'Head of Department' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Lehrer' : 'Teachers' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Fächer' : 'Subjects' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Status' : 'Status' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="department in filteredDepartments" :key="department.id" class="border-b border-slate-100 dark:border-slate-700">
              <td class="py-3 px-4 font-medium text-slate-800 dark:text-slate-50">{{ department.name }}</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img :src="department.headAvatar" :alt="department.head" class="h-8 w-8 rounded-full object-cover mr-3" />
                  <span class="text-slate-800 dark:text-slate-50">{{ department.head }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-800 dark:text-slate-50">{{ department.teachers }}</td>
              <td class="py-3 px-4 text-slate-800 dark:text-slate-50">{{ department.subjects }}</td>
              <td class="py-3 px-4">
                <span :class="getDepartmentStatusColor(department.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ department.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="viewDepartment(department)" class="text-primary-600 hover:text-primary-800">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="editDepartment(department)" class="text-secondary-600 hover:text-secondary-800">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="assignTeachers(department)" class="text-blue-600 hover:text-blue-800">
                    <Users class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards View -->
      <div class="md:hidden space-y-4">
        <div v-for="department in paginatedDepartments" :key="`mobile-${department.id}`" class="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="font-semibold text-slate-800 dark:text-slate-50 text-lg">{{ department.name }}</h3>
              <div class="flex items-center mt-2">
                <img :src="department.headAvatar" :alt="department.head" class="h-6 w-6 rounded-full object-cover mr-2" />
                <span class="text-sm text-slate-600 dark:text-slate-400">{{ department.head }}</span>
              </div>
            </div>
            <span :class="getDepartmentStatusColor(department.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ department.status }}
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="text-center p-2 bg-white dark:bg-slate-600 rounded">
              <div class="text-lg font-bold text-slate-800 dark:text-slate-50">{{ department.teachers }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Lehrer' : 'Teachers' }}</div>
            </div>
            <div class="text-center p-2 bg-white dark:bg-slate-600 rounded">
              <div class="text-lg font-bold text-slate-800 dark:text-slate-50">{{ department.subjects }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Fächer' : 'Subjects' }}</div>
            </div>
          </div>
          
          <div class="flex justify-center space-x-4 pt-2 border-t border-slate-200 dark:border-slate-600">
            <button @click="viewDepartment(department)" class="flex items-center text-primary-600 hover:text-primary-800 text-sm">
              <Eye class="h-4 w-4 mr-1" />
              {{ language === 'de' ? 'Ansehen' : 'View' }}
            </button>
            <button @click="editDepartment(department)" class="flex items-center text-secondary-600 hover:text-secondary-800 text-sm">
              <Edit class="h-4 w-4 mr-1" />
              {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
            </button>
            <button @click="assignTeachers(department)" class="flex items-center text-blue-600 hover:text-blue-800 text-sm">
              <Users class="h-4 w-4 mr-1" />
              {{ language === 'de' ? 'Zuweisen' : 'Assign' }}
            </button>
          </div>
        </div>

        <!-- Mobile Pagination -->
        <div class="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
          <div class="text-sm text-slate-500 dark:text-slate-400">
            {{ language === 'de' ? 'Zeige' : 'Showing' }} {{ (currentPage - 1) * itemsPerPage + 1 }} {{ language === 'de' ? 'bis' : 'to' }} {{ Math.min(currentPage * itemsPerPage, filteredDepartments.length) }} {{ language === 'de' ? 'von' : 'of' }} {{ filteredDepartments.length }} {{ language === 'de' ? 'Abteilungen' : 'departments' }}
          </div>
          
          <div class="flex items-center space-x-2">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-200"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            
            <div class="flex space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg',
                  page === currentPage
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-500 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-200'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-200"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Department Subjects -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-6">
        {{ language === 'de' ? 'Fächer nach Abteilung' : 'Subjects by Department' }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="department in departments" :key="`subjects-${department.id}`" class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h3 class="font-medium text-slate-800 dark:text-slate-50 mb-3">{{ department.name }}</h3>
          <div class="space-y-2">
            <div v-for="(subject, index) in department.subjectList" :key="index" class="flex items-center justify-between p-2 bg-white dark:bg-slate-600 rounded">
              <span class="text-sm text-slate-800 dark:text-slate-50">{{ subject }}</span>
              <button @click="removeSubject(department, subject)" class="text-red-600 hover:text-red-800">
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
            <button @click="addSubject(department)" class="w-full p-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 text-sm">
              {{ language === 'de' ? '+ Fach hinzufügen' : '+ Add Subject' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Department Modal -->
    <div v-if="showDepartmentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Neue Abteilung erstellen' : 'Create New Department' }}
            </h3>
            <button @click="showDepartmentModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="createDepartment" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Abteilungsname' : 'Department Name' }}
              </label>
              <input v-model="departmentForm.name" type="text" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Abteilungsleiter' : 'Head of Department' }}
              </label>
              <select v-model="departmentForm.head" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                <option value="">{{ language === 'de' ? 'Leiter wählen' : 'Select Head' }}</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea v-model="departmentForm.description" rows="3" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50 resize-none"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Fächer' : 'Subjects' }}
              </label>
              <div class="space-y-2">
                <div v-for="(_subject, index) in departmentForm.subjects" :key="index" class="flex items-center space-x-2">
                  <input
                    v-model="departmentForm.subjects[index]"
                    type="text"
                    :placeholder="`${language === 'de' ? 'Fach' : 'Subject'} ${index + 1}`"
                    class="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
                  />
                  <button type="button" @click="removeSubjectField(index)" class="text-red-600 hover:text-red-800">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
                <button type="button" @click="addSubjectField" class="text-primary-600 hover:text-primary-800 text-sm">
                  + {{ language === 'de' ? 'Fach hinzufügen' : 'Add Subject' }}
                </button>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showDepartmentModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Abteilung erstellen' : 'Create Department' }}
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
import { Edit, Eye, Users, Search, X, Trash2, BookOpen, Award, Layers, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showDepartmentModal = ref(false)
const searchQuery = ref('')

const departmentForm = ref({
  name: '',
  head: '',
  description: '',
  subjects: ['']
})

const departmentStats = ref([
  {
    title: language.value === 'de' ? 'Abteilungen' : 'Departments',
    value: '5',
    change: '+1 this year',
    changeColor: 'text-green-600',
    icon: Layers,
    iconBg: 'bg-primary-600'
  },
  {
    title: language.value === 'de' ? 'Fächer' : 'Subjects',
    value: '24',
    change: '+3 this semester',
    changeColor: 'text-green-600',
    icon: BookOpen,
    iconBg: 'bg-green-600'
  },
  {
    title: language.value === 'de' ? 'Lehrer' : 'Teachers',
    value: '89',
    change: '+5 this year',
    changeColor: 'text-green-600',
    icon: Users,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Abteilungsleiter' : 'Department Heads',
    value: '5',
    change: '+1 this year',
    changeColor: 'text-green-600',
    icon: Award,
    iconBg: 'bg-yellow-600'
  }
])

const teachers = ref([
  { id: 1, name: 'Dr. Thomas Weber' },
  { id: 2, name: 'Ms. Sarah Schmidt' },
  { id: 3, name: 'Prof. Michael Mueller' },
  { id: 4, name: 'Dr. Anna Fischer' },
  { id: 5, name: 'Mr. Johannes Bauer' }
])

const departments = ref([
  {
    id: 1,
    name: 'Mathematics',
    head: 'Dr. Thomas Weber',
    headAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    teachers: 12,
    subjects: 4,
    subjectList: ['Mathematics', 'Statistics', 'Calculus', 'Algebra'],
    status: 'Active'
  },
  {
    id: 2,
    name: 'Sciences',
    head: 'Prof. Michael Mueller',
    headAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    teachers: 15,
    subjects: 5,
    subjectList: ['Physics', 'Chemistry', 'Biology', 'Environmental Science', 'Astronomy'],
    status: 'Active'
  },
  {
    id: 3,
    name: 'Languages',
    head: 'Ms. Sarah Schmidt',
    headAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    teachers: 18,
    subjects: 6,
    subjectList: ['German', 'English', 'French', 'Spanish', 'Latin', 'Italian'],
    status: 'Active'
  },
  {
    id: 4,
    name: 'Arts',
    head: 'Dr. Anna Fischer',
    headAvatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    teachers: 8,
    subjects: 4,
    subjectList: ['Art', 'Music', 'Drama', 'Design'],
    status: 'Active'
  },
  {
    id: 5,
    name: 'Sports',
    head: 'Mr. Johannes Bauer',
    headAvatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    teachers: 6,
    subjects: 5,
    subjectList: ['Physical Education', 'Swimming', 'Team Sports', 'Athletics', 'Gymnastics'],
    status: 'Active'
  }
])

const filteredDepartments = computed(() => {
  if (!searchQuery.value) return departments.value
  
  return departments.value.filter(department => 
    department.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    department.head.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const getDepartmentStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const createDepartment = () => {
  const headTeacher = teachers.value.find(t => t.id.toString() === departmentForm.value.head)
  
  const newDepartment = {
    id: departments.value.length + 1,
    name: departmentForm.value.name,
    head: headTeacher?.name || 'Not Assigned',
    headAvatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    teachers: 0,
    subjects: departmentForm.value.subjects.filter(s => s.trim() !== '').length,
    subjectList: departmentForm.value.subjects.filter(s => s.trim() !== ''),
    status: 'Active'
  }
  
  departments.value.push(newDepartment)
  showDepartmentModal.value = false
  departmentForm.value = { name: '', head: '', description: '', subjects: [''] }
  
  alert(language.value === 'de' ? 'Abteilung erfolgreich erstellt!' : 'Department created successfully!')
}

const viewDepartment = (department: any) => {
  alert(`${language.value === 'de' ? 'Abteilung anzeigen' : 'View department'}: ${department.name}`)
}

const editDepartment = (department: any) => {
  alert(`${language.value === 'de' ? 'Abteilung bearbeiten' : 'Edit department'}: ${department.name}`)
}

const assignTeachers = (department: any) => {
  alert(`${language.value === 'de' ? 'Lehrer zuweisen zu' : 'Assign teachers to'} ${department.name}`)
}

const addSubjectField = () => {
  departmentForm.value.subjects.push('')
}

const removeSubjectField = (index: number) => {
  departmentForm.value.subjects.splice(index, 1)
}

const addSubject = (department: any) => {
  alert(`${language.value === 'de' ? 'Fach hinzufügen zu' : 'Add subject to'} ${department.name}`)
}

const removeSubject = (department: any, subject: string) => {
  const index = department.subjectList.indexOf(subject)
  if (index > -1) {
    department.subjectList.splice(index, 1)
    department.subjects = department.subjectList.length
  }
}

const currentPage = ref(1)
const itemsPerPage = ref(5)
const totalPages = computed(() => Math.ceil(filteredDepartments.value.length / itemsPerPage.value))
const visiblePages = computed(() => {
  const pages = []
  for (let i = Math.max(currentPage.value - 2, 1); i <= Math.min(currentPage.value + 2, totalPages.value); i++) {
    pages.push(i)
  }
  return pages
})

const paginatedDepartments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredDepartments.value.slice(start, end)
})
</script>
