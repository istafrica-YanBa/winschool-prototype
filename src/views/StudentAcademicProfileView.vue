<template>
  <div class="student-academic-profile bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <User class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Schülerprofil' : 'Student Profile' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? `Profil von ${currentStudent?.name}` : `Profile of ${currentStudent?.name}` }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="printOverview" class="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-slate-800 dark:text-slate-50 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Printer class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Übersicht drucken' : 'Print Overview' }}
          </button>
        </div>
      </div>

      <!-- Student Info Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center space-x-6">
          <img 
            :src="currentStudent?.avatar" 
            :alt="currentStudent?.name" 
            class="h-24 w-24 rounded-full object-cover" 
          />
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ currentStudent?.name }}</h2>
            <p class="text-gray-600 dark:text-gray-400">{{ currentStudent?.studentId }} • {{ currentStudent?.class }}</p>
            <div class="flex space-x-4 mt-2">
              <span class="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                {{ currentStudent?.status === 'active' ? (language === 'de' ? 'Aktiv' : 'Active') : currentStudent?.status }}
              </span>
              <span class="px-3 py-1 text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                {{ currentStudent?.age }} {{ language === 'de' ? 'Jahre alt' : 'years old' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.key 
                  ? 'border-winschool-primary text-winschool-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Learning Goals Tab -->
          <div v-if="activeTab === 'goals'">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Lernziele' : 'Learning Goals' }}
              </h3>
              <div class="flex items-center space-x-4">
                <select v-model="statusFilter" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="all">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
                  <option value="achieved">{{ language === 'de' ? 'Erreicht' : 'Achieved' }}</option>
                  <option value="in-progress">{{ language === 'de' ? 'In Bearbeitung' : 'In Progress' }}</option>
                </select>
              </div>
            </div>

            <!-- Learning Goals Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {{ language === 'de' ? 'Ziel' : 'Goal' }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {{ language === 'de' ? 'Fach' : 'Subject' }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {{ language === 'de' ? 'Standard' : 'Standard' }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {{ language === 'de' ? 'Status' : 'Status' }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {{ language === 'de' ? 'Fortschritt' : 'Progress' }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="goal in filteredLearningGoals" :key="goal.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ goal.goal }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900 dark:text-white">{{ goal.subject }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900 dark:text-white">{{ goal.standard }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusBadgeClass(goal.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ getStatusText(goal.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            :class="getProgressBarClass(goal.progress)" 
                            class="h-2 rounded-full transition-all duration-300" 
                            :style="{ width: goal.progress + '%' }"
                          ></div>
                        </div>
                        <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ goal.progress }}%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Personal Info Tab -->
          <div v-if="activeTab === 'personal'">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {{ language === 'de' ? 'Persönliche Informationen' : 'Personal Information' }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'E-Mail' : 'Email' }}
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ currentStudent?.email }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Telefon' : 'Phone' }}
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ currentStudent?.phone }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Adresse' : 'Address' }}
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ currentStudent?.address }}</p>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Einschreibungsdatum' : 'Enrollment Date' }}
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(currentStudent?.enrollmentDate) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Klassenstufe' : 'Grade Level' }}
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ currentStudent?.gradeLevel }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Klassenlehrer' : 'Homeroom Teacher' }}
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ currentStudent?.homeroomTeacher }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Academic Performance Tab -->
          <div v-if="activeTab === 'academics'">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {{ language === 'de' ? 'Akademische Leistung' : 'Academic Performance' }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                <div class="text-blue-600 dark:text-blue-300 text-sm font-medium">
                  {{ language === 'de' ? 'Durchschnittsnote' : 'Average Grade' }}
                </div>
                <div class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ currentStudent?.averageGrade }}</div>
              </div>
              <div class="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                <div class="text-green-600 dark:text-green-300 text-sm font-medium">
                  {{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}
                </div>
                <div class="text-2xl font-bold text-green-900 dark:text-green-100">{{ currentStudent?.attendance }}%</div>
              </div>
              <div class="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
                <div class="text-purple-600 dark:text-purple-300 text-sm font-medium">
                  {{ language === 'de' ? 'Erreichte Ziele' : 'Goals Achieved' }}
                </div>
                <div class="text-2xl font-bold text-purple-900 dark:text-purple-100">{{ achievedGoalsCount }}/{{ learningGoals.length }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useAuthStore } from '../stores/auth'
import { User, Printer } from 'lucide-vue-next'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const language = computed(() => themeStore.language)

// Current student data (from auth store)
const currentStudent = ref<any>(null)

// Active tab
const activeTab = ref('goals')

// Status filter
const statusFilter = ref('all')

// Tab configuration
const tabs = computed(() => [
  { key: 'goals', name: language.value === 'de' ? 'Lernziele' : 'Learning Goals' },
  { key: 'personal', name: language.value === 'de' ? 'Persönliche Informationen' : 'Personal Info' },
  { key: 'academics', name: language.value === 'de' ? 'Akademische Leistung' : 'Academic Performance' }
])

// Mock learning goals data - in real app this would come from API
const learningGoals = ref([
  {
    id: 1,
    goal: 'Solve quadratic equations',
    subject: 'Mathematics',
    standard: 'CCSS.MATH.HSA-REI.B.4',
    status: 'achieved',
    progress: 100
  },
  {
    id: 2,
    goal: 'Analyze literary themes',
    subject: 'English',
    standard: 'CCSS.ELA-LITERACY.RL.9-10.2',
    status: 'in-progress',
    progress: 75
  },
  {
    id: 3,
    goal: 'Understand photosynthesis',
    subject: 'Biology',
    standard: 'NGSS.HS-LS1-5',
    status: 'achieved',
    progress: 100
  },
  {
    id: 4,
    goal: 'Calculate derivatives',
    subject: 'Mathematics',
    standard: 'CCSS.MATH.HSF-IF.B.4',
    status: 'in-progress',
    progress: 60
  },
  {
    id: 5,
    goal: 'Analyze historical events',
    subject: 'History',
    standard: 'NCSS.3',
    status: 'achieved',
    progress: 100
  }
])

// Computed properties
const filteredLearningGoals = computed(() => {
  if (statusFilter.value === 'all') {
    return learningGoals.value
  }
  return learningGoals.value.filter(goal => goal.status === statusFilter.value)
})

const achievedGoalsCount = computed(() => {
  return learningGoals.value.filter(goal => goal.status === 'achieved').length
})

// Methods
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'achieved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getStatusText = (status: string) => {
  const statusTexts = {
    achieved: language.value === 'de' ? 'Erreicht' : 'Achieved',
    'in-progress': language.value === 'de' ? 'In Bearbeitung' : 'In Progress'
  }
  return statusTexts[status as keyof typeof statusTexts] || status
}

const getProgressBarClass = (progress: number) => {
  if (progress === 100) return 'bg-green-500'
  if (progress >= 75) return 'bg-blue-500'
  if (progress >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(language.value === 'de' ? 'de-DE' : 'en-US')
}

const printOverview = () => {
  window.print()
}

// Load current student data
onMounted(() => {
  // In a real application, this would come from the auth store or API
  // For now, using mock data based on the current user
  const user = authStore.user
  currentStudent.value = {
    id: user?.id,
    name: user?.name || 'Emma Müller',
    studentId: 'ST001',
    class: 'Class 10A',
    status: 'active',
    age: 16,
    avatar: user?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: user?.email || 'emma.mueller@student.winschool.de',
    phone: '+49 123 456 7890',
    address: 'Musterstraße 123, 10115 Berlin',
    enrollmentDate: '2020-09-01',
    gradeLevel: '10',
    homeroomTeacher: 'Dr. Thomas Weber',
    averageGrade: 'A-',
    attendance: 95
  }
})
</script>

<style scoped>
/* Custom styles for better appearance */
.table-container {
  border-radius: 8px;
  overflow: hidden;
}
</style> 