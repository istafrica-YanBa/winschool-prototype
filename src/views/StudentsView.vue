<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-center">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <UserPlus class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Meine Kinder' : 'My Children' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Übersicht über die Schulinformationen Ihrer Kinder' : 'Overview of your children\'s school information' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <UserPlus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Schüler hinzufügen' : 'Add Student' }}
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
                :placeholder="language === 'de' ? 'Schüler suchen...' : 'Search students...'"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <select 
            v-model="selectedClass"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Alle Klassen' : 'All Classes' }}</option>
            <option v-for="class_ in classes" :key="class_" :value="class_">{{ class_ }}</option>
          </select>
          <select 
            v-model="selectedStatus"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="active">{{ language === 'de' ? 'Aktiv' : 'Active' }}</option>
            <option value="inactive">{{ language === 'de' ? 'Inaktiv' : 'Inactive' }}</option>
          </select>
        </div>
      </div>

      <!-- Students Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="student in filteredStudents" 
          :key="student.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover"
        >
          <div class="flex items-center mb-4">
            <img 
              :src="student.avatar" 
              :alt="student.name"
              class="h-12 w-12 rounded-full object-cover mr-4"
            />
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ student.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ student.studentId }}</p>
            </div>
            <span :class="getStatusColor(student.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ student.status }}
            </span>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Klasse' : 'Class' }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ student.class }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Alter' : 'Age' }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ student.age }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Durchschnitt' : 'Average' }}</span>
              <span :class="getGradeColor(student.averageGrade)" class="font-medium">{{ student.averageGrade }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}</span>
              <span class="font-medium text-green-600">{{ student.attendance }}%</span>
            </div>
          </div>

          <div class="flex space-x-2">
            <button class="flex-1 px-3 py-2 text-sm bg-primary-100 dark:bg-slate-700 text-primary-800 dark:text-slate-200 rounded-lg hover:bg-primary-200 dark:hover:bg-slate-600 transition-colors" @click="viewStudentProfile(student)">
              {{ language === 'de' ? 'Profil anzeigen' : 'View Profile' }}
            </button>
            <button class="px-3 py-2 text-sm bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
              <MoreHorizontal class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center">
        <div class="flex space-x-2">
          <button class="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            {{ language === 'de' ? 'Vorherige' : 'Previous' }}
          </button>
          <button class="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg">1</button>
          <button class="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">2</button>
          <button class="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">3</button>
          <button class="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            {{ language === 'de' ? 'Nächste' : 'Next' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { UserPlus, Search, MoreHorizontal } from 'lucide-vue-next'

const router = useRouter()
const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const searchQuery = ref('')
const selectedClass = ref('')
const selectedStatus = ref('')

const classes = ['Class 8A', 'Class 8B', 'Class 9A', 'Class 9B', 'Class 10A', 'Class 10B', 'Class 11A', 'Class 11B', 'Class 12A', 'Class 12B']

const students = [
  {
    id: 1,
    name: 'Emma Müller',
    studentId: 'ST001',
    class: 'Class 10A',
    age: 16,
    averageGrade: 'A-',
    attendance: 95,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 2,
    name: 'Liam Weber',
    studentId: 'ST002',
    class: 'Class 10A',
    age: 16,
    averageGrade: 'B+',
    attendance: 92,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 3,
    name: 'Sophie Schmidt',
    studentId: 'ST003',
    class: 'Class 9B',
    age: 15,
    averageGrade: 'A',
    attendance: 98,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 4,
    name: 'Noah Fischer',
    studentId: 'ST004',
    class: 'Class 11A',
    age: 17,
    averageGrade: 'B',
    attendance: 89,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 5,
    name: 'Mia Wagner',
    studentId: 'ST005',
    class: 'Class 12B',
    age: 18,
    averageGrade: 'A-',
    attendance: 94,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 6,
    name: 'Leon Bauer',
    studentId: 'ST006',
    class: 'Class 8A',
    age: 14,
    averageGrade: 'C+',
    attendance: 87,
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
]

const filteredStudents = computed(() => {
  return students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesClass = !selectedClass.value || student.class === selectedClass.value
    const matchesStatus = !selectedStatus.value || student.status === selectedStatus.value
    
    return matchesSearch && matchesClass && matchesStatus
  })
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400'
  if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400'
  if (grade.startsWith('C')) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const viewStudentProfile = (student: any) => {
  router.push(`/dashboard/student-profile/${student.id}`)
}
</script>
