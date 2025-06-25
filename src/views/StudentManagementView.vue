<template>
  <div class="student-management bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <Users class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Schülerverwaltung' : 'Student Management' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Schülerdaten und -informationen' : 'Manage student data and information' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="showBulkUpload = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Upload class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Massenhochladung' : 'Bulk Upload' }}
          </button>
          <button @click="showAddStudent = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
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
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="language === 'de' ? 'Schüler suchen...' : 'Search students...'"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
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

      <!-- Students Table/Cards Container -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700">
                <th class="w-10 py-3 px-4">
                  <input 
                    type="checkbox" 
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:bg-gray-700"
                  />
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Name' : 'Name' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Klasse' : 'Class' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Alter' : 'Age' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Durchschnitt' : 'Average' }}
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
              <tr v-for="student in paginatedStudents" :key="student.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td class="py-3 px-4">
                  <input 
                    type="checkbox" 
                    v-model="selectedStudents" 
                    :value="student.id"
                    class="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:bg-gray-700"
                  />
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img 
                      :src="student.avatar" 
                      :alt="student.name"
                      class="h-8 w-8 rounded-full object-cover mr-3 border border-gray-200 dark:border-gray-600"
                    />
                    <span class="font-medium text-gray-900 dark:text-white">{{ student.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-900 dark:text-white">{{ student.class }}</td>
                <td class="py-3 px-4 text-gray-900 dark:text-white">{{ student.age }}</td>
                <td class="py-3 px-4">
                  <span :class="getGradeColor(student.averageGrade)" class="font-medium">{{ student.averageGrade }}</span>
                </td>
                <td class="py-3 px-4">
                  <span :class="getStatusColor(student.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ student.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="viewStudentProfile(student)" class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="editStudent(student)" class="text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button @click="toggleStudentStatus(student)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                      <component :is="student.status === 'active' ? Lock : Unlock" class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="lg:hidden space-y-4 p-4">
          <div v-for="student in paginatedStudents" :key="student.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
            <!-- Student Header -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center min-w-0 flex-1">
                <input 
                  type="checkbox" 
                  v-model="selectedStudents" 
                  :value="student.id"
                  class="rounded border-gray-300 dark:border-gray-600 text-primary-600 mr-3 flex-shrink-0 bg-white dark:bg-gray-700"
                />
                <img 
                  :src="student.avatar" 
                  :alt="student.name"
                  class="h-10 w-10 rounded-full object-cover mr-3 border border-gray-200 dark:border-gray-600 flex-shrink-0"
                />
                <div class="min-w-0 flex-1">
                  <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ student.name }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ student.studentId || `ST${String(student.id).padStart(3, '0')}` }}</p>
                </div>
              </div>
              <span :class="getStatusColor(student.status)" class="px-2 py-1 text-xs font-medium rounded-full ml-2 flex-shrink-0">
                {{ student.status }}
              </span>
            </div>

            <!-- Student Details -->
            <div class="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400 block">{{ language === 'de' ? 'Klasse' : 'Class' }}</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ student.class }}</span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400 block">{{ language === 'de' ? 'Alter' : 'Age' }}</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ student.age }}</span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400 block">{{ language === 'de' ? 'Durchschnitt' : 'Average' }}</span>
                <span :class="getGradeColor(student.averageGrade)" class="font-medium">{{ student.averageGrade }}</span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400 block">{{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}</span>
                <span class="text-gray-900 dark:text-white font-medium">{{ student.attendance }}%</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
              <button @click="viewStudentProfile(student)" class="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
                <Eye class="h-4 w-4" />
              </button>
              <button @click="editStudent(student)" class="flex items-center justify-center w-8 h-8 bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-900/40 transition-colors">
                <Edit class="h-4 w-4" />
              </button>
              <button @click="toggleStudentStatus(student)" class="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
                <component :is="student.status === 'active' ? Lock : Unlock" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Mobile Empty State -->
          <div v-if="paginatedStudents.length === 0" class="text-center py-8">
            <Users class="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400">{{ language === 'de' ? 'Keine Schüler gefunden' : 'No students found' }}</p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div class="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
          {{ language === 'de' ? 'Zeigt' : 'Showing' }} {{ (currentPage - 1) * itemsPerPage + 1 }} {{ language === 'de' ? 'bis' : 'to' }} 
          {{ Math.min(currentPage * itemsPerPage, totalStudents) }} {{ language === 'de' ? 'von' : 'of' }} {{ totalStudents }} 
          {{ language === 'de' ? 'Schülern' : 'students' }}
        </div>
        
        <!-- Desktop Pagination -->
        <div class="hidden sm:flex justify-center space-x-1">
          <button 
            @click="previousPage" 
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ language === 'de' ? 'Zurück' : 'Previous' }}
          </button>
          
          <template v-for="page in visiblePages" :key="page">
            <button 
              v-if="page !== '...'"
              @click="goToPage(page as number)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                currentPage === page 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">...</span>
          </template>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ language === 'de' ? 'Weiter' : 'Next' }}
          </button>
        </div>

        <!-- Mobile Pagination -->
        <div class="flex sm:hidden justify-center space-x-2">
          <button 
            @click="previousPage" 
            :disabled="currentPage === 1"
            class="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ language === 'de' ? 'Zurück' : 'Previous' }}
          </button>
          
          <span class="px-4 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
            {{ currentPage }} / {{ totalPages }}
          </span>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ language === 'de' ? 'Weiter' : 'Next' }}
          </button>
        </div>
      </div>

      <!-- Language Assignment Modal -->
      <div v-if="showLanguageModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ languageModalMode === 'add' ? (language === 'de' ? 'Sprache hinzufügen' : 'Add Language') : (language === 'de' ? 'Sprache bearbeiten' : 'Edit Language') }}
              </h3>
              <button @click="showLanguageModal = false" class="text-gray-400 hover:text-gray-600">
                <X class="h-6 w-6" />
              </button>
            </div>

            <LanguageAssignmentForm 
              :language="selectedLanguage"
              :mode="languageModalMode"
              @submit="handleLanguageSubmit"
              @cancel="showLanguageModal = false"
            />
          </div>
        </div>
      </div>

      <!-- School Career Entry Modal -->
      <div v-if="showCareerEntryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ careerEntryModalMode === 'add' ? (language === 'de' ? 'Schullaufbahn hinzufügen' : 'Add School Career Entry') : (language === 'de' ? 'Schullaufbahn bearbeiten' : 'Edit School Career Entry') }}
              </h3>
              <button @click="showCareerEntryModal = false" class="text-gray-400 hover:text-gray-600">
                <X class="h-6 w-6" />
              </button>
            </div>

            <SchoolCareerEntry 
              :entry="selectedCareerEntry"
              :mode="careerEntryModalMode"
              @submit="handleCareerEntrySubmit"
              @cancel="showCareerEntryModal = false"
            />
          </div>
        </div>
      </div>

      <!-- Correspondence Note Modal -->
      <div v-if="showCorrespondenceNoteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ correspondenceNoteModalMode === 'add' ? (language === 'de' ? 'Notiz hinzufügen' : 'Add Note') : (language === 'de' ? 'Notiz bearbeiten' : 'Edit Note') }}
              </h3>
              <button @click="showCorrespondenceNoteModal = false" class="text-gray-400 hover:text-gray-600">
                <X class="h-6 w-6" />
              </button>
            </div>

            <CorrespondenceNote 
              :note="selectedCorrespondenceNote"
              :mode="correspondenceNoteModalMode"
              @submit="handleCorrespondenceNoteSubmit"
              @cancel="showCorrespondenceNoteModal = false"
            />
          </div>
        </div>
      </div>

      <!-- Bulk Language Assignment Modal -->
      <div v-if="showBulkLanguageModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Massen-Sprachzuweisung' : 'Bulk Language Assignment' }}
              </h3>
              <button @click="showBulkLanguageModal = false" class="text-gray-400 hover:text-gray-600">
                <X class="h-6 w-6" />
              </button>
            </div>

            <BulkLanguageAssignment 
              :selected-students="selectedStudents.length"
              @submit="handleBulkLanguageSubmit"
              @cancel="showBulkLanguageModal = false"
            />
          </div>
        </div>
      </div>

      <!-- School Year Change Modal -->
      <div v-if="showSchoolYearChangeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Schuljahreswechsel' : 'School Year Change' }}
              </h3>
              <button @click="showSchoolYearChangeModal = false" class="text-gray-400 hover:text-gray-600">
                <X class="h-6 w-6" />
              </button>
            </div>

            <SchoolYearChange 
              :affected-students="selectedStudents.length || filteredStudents.length"
              @submit="performSchoolYearChange"
              @cancel="showSchoolYearChangeModal = false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useRouter } from 'vue-router'
import { 
  UserPlus, Search, Eye, Edit, Lock, Unlock, X, Settings, ChevronDown,
  Languages, Calendar, Download, Upload, Users
} from 'lucide-vue-next'
import Breadcrumb from '../components/Breadcrumb.vue'
import LanguageAssignmentForm from '../components/student/LanguageAssignmentForm.vue'
import SchoolCareerEntry from '../components/student/SchoolCareerEntry.vue'
import CorrespondenceNote from '../components/student/CorrespondenceNote.vue'
import BulkLanguageAssignment from '../components/student/BulkLanguageAssignment.vue'
import SchoolYearChange from '../components/student/SchoolYearChange.vue'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)
const router = useRouter()

// Breadcrumb segments
const breadcrumbSegments = [
  { label: 'Administration', to: '/dashboard' },
  { label: 'Student Management' }
]

// Search and filters
const searchQuery = ref('')
const selectedClass = ref('')
const selectedStatus = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(6)

// Dropdowns
const showActionsDropdown = ref(false)
const actionsDropdownRef = ref<HTMLElement | null>(null)

// Modals
const showLanguageModal = ref(false)
const showCareerEntryModal = ref(false)
const showCorrespondenceNoteModal = ref(false)
const showBulkLanguageModal = ref(false)
const showSchoolYearChangeModal = ref(false)
const showAddStudentModal = ref(false)
const showBulkUpload = ref(false)
const showAddStudent = ref(false)

// Modal modes
const languageModalMode = ref<'add' | 'edit'>('add')
const careerEntryModalMode = ref<'add' | 'edit'>('add')
const correspondenceNoteModalMode = ref<'add' | 'edit'>('add')

// Selected items
const selectedLanguage = ref<any>(null)
const selectedCareerEntry = ref<any>(null)
const selectedCorrespondenceNote = ref<any>(null)
const selectedStudents = ref<number[]>([])
const selectAll = ref(false)

// Sample data
const classes = ['Class 8A', 'Class 8B', 'Class 9A', 'Class 9B', 'Class 10A', 'Class 10B', 'Class 11A', 'Class 11B', 'Class 12A', 'Class 12B']

const students = ref([
  {
    id: 1,
    name: 'Emma Müller',
    studentId: 'ST001',
    class: 'Class 10A',
    age: 16,
    averageGrade: 'A-',
    attendance: 95,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'emma.mueller@student.winschool.de',
    phone: '+49 123 456 7890',
    address: 'Musterstraße 123, 10115 Berlin',
    enrollmentDate: '2020-09-01',
    gradeLevel: 'Grade 10',
    homeroomTeacher: 'Dr. Thomas Weber',
    languages: [
      { id: 1, name: 'German', level: 'Native', type: 'Native', since: '2008-01-01', knowledgeLevel: 5 },
      { id: 2, name: 'English', level: 'B2', type: 'Required', since: '2015-09-01', knowledgeLevel: 4 },
      { id: 3, name: 'French', level: 'A2', type: 'Elective', since: '2018-09-01', knowledgeLevel: 2 }
    ],
    careerEntries: [
      { 
        id: 1, 
        title: 'Promotion to Grade 10', 
        type: 'Promotion', 
        date: '2023-07-15', 
        fromGrade: 'Grade 9', 
        toGrade: 'Grade 10', 
        description: 'Regular promotion at the end of the school year',
        reason: 'Successful completion of Grade 9',
        isVoluntary: false
      },
      { 
        id: 2, 
        title: 'Promotion to Grade 9', 
        type: 'Promotion', 
        date: '2022-07-15', 
        fromGrade: 'Grade 8', 
        toGrade: 'Grade 9', 
        description: 'Regular promotion at the end of the school year',
        reason: 'Successful completion of Grade 8',
        isVoluntary: false
      }
    ],
    correspondenceNotes: [
      {
        id: 1,
        date: '2023-10-15',
        template: 'Parent Conference',
        comment: 'Discussed academic progress and extracurricular activities',
        createdBy: 'Dr. Thomas Weber'
      },
      {
        id: 2,
        date: '2023-09-05',
        template: 'Performance Notification',
        comment: 'Excellent performance in mathematics noted',
        createdBy: 'System'
      }
    ]
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
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'liam.weber@student.winschool.de',
    languages: [
      { id: 1, name: 'German', level: 'Native', type: 'Native', since: '2008-01-01', knowledgeLevel: 5 },
      { id: 2, name: 'English', level: 'B1', type: 'Required', since: '2015-09-01', knowledgeLevel: 3 }
    ],
    careerEntries: [],
    correspondenceNotes: []
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
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'sophie.schmidt@student.winschool.de',
    languages: [
      { id: 1, name: 'German', level: 'Native', type: 'Native', since: '2009-01-01', knowledgeLevel: 5 },
      { id: 2, name: 'English', level: 'B2', type: 'Required', since: '2016-09-01', knowledgeLevel: 4 },
      { id: 3, name: 'Spanish', level: 'A1', type: 'Elective', since: '2022-09-01', knowledgeLevel: 1 }
    ],
    careerEntries: [],
    correspondenceNotes: []
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
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'noah.fischer@student.winschool.de',
    languages: [],
    careerEntries: [],
    correspondenceNotes: []
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
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'mia.wagner@student.winschool.de',
    languages: [],
    careerEntries: [],
    correspondenceNotes: []
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
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'leon.bauer@student.winschool.de',
    languages: [],
    careerEntries: [],
    correspondenceNotes: []
  },
  {
    id: 7,
    name: 'Anna Hoffmann',
    studentId: 'ST007',
    class: 'Class 9A',
    age: 15,
    averageGrade: 'B+',
    attendance: 91,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'anna.hoffmann@student.winschool.de',
    languages: [],
    careerEntries: [],
    correspondenceNotes: []
  },
  {
    id: 8,
    name: 'Felix Richter',
    studentId: 'ST008',
    class: 'Class 11B',
    age: 17,
    averageGrade: 'A',
    attendance: 96,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'felix.richter@student.winschool.de',
    languages: [],
    careerEntries: [],
    correspondenceNotes: []
  },
  {
    id: 9,
    name: 'Lea Zimmermann',
    studentId: 'ST009',
    class: 'Class 8B',
    age: 14,
    averageGrade: 'B-',
    attendance: 88,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'lea.zimmermann@student.winschool.de',
    languages: [],
    careerEntries: [],
    correspondenceNotes: []
  },
  {
    id: 10,
    name: 'Maximilian Koch',
    studentId: 'ST010',
    class: 'Class 12A',
    age: 18,
    averageGrade: 'A-',
    attendance: 93,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'max.koch@student.winschool.de',
    languages: [],
    careerEntries: [],
    correspondenceNotes: []
  },
  {
    id: 11,
    name: 'Sarah Neumann',
    studentId: 'ST011',
    class: 'Class 10B',
    age: 16,
    averageGrade: 'B',
    attendance: 90,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'sarah.neumann@student.winschool.de',
    languages: [],
    careerEntries: [],
    correspondenceNotes: []
  },
  {
    id: 12,
    name: 'Tim Braun',
    studentId: 'ST012',
    class: 'Class 9A',
    age: 15,
    averageGrade: 'C+',
    attendance: 85,
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'tim.braun@student.winschool.de',
    languages: [],
    careerEntries: [],
    correspondenceNotes: []
  },
  {
    id: 13,
    name: 'Julia Werner',
    studentId: 'ST013',
    class: 'Class 11A',
    age: 17,
    averageGrade: 'A',
    attendance: 97,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'julia.werner@student.winschool.de',
    languages: [],
    careerEntries: [],
    correspondenceNotes: []
  },
  {
    id: 14,
    name: 'Paul Meyer',
    studentId: 'ST014',
    class: 'Class 8A',
    age: 14,
    averageGrade: 'B+',
    attendance: 92,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'paul.meyer@student.winschool.de',
    languages: [],
    careerEntries: [],
    correspondenceNotes: []
  }
])

const filteredStudents = computed(() => {
  return students.value.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesClass = !selectedClass.value || student.class === selectedClass.value
    const matchesStatus = !selectedStatus.value || student.status === selectedStatus.value
    
    return matchesSearch && matchesClass && matchesStatus
  })
})

// Pagination computed properties
const totalStudents = computed(() => filteredStudents.value.length)
const totalPages = computed(() => Math.ceil(totalStudents.value / itemsPerPage.value))

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredStudents.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisible = 5
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage.value <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages.value)
    } else if (currentPage.value >= totalPages.value - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages.value - 3; i <= totalPages.value; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = currentPage.value - 1; i <= currentPage.value + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages.value)
    }
  }
  
  return pages
})

// Pagination methods
const goToPage = (page: number) => {
  currentPage.value = page
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedClass, selectedStatus], () => {
  currentPage.value = 1
})

// Click outside handler for dropdowns
const handleClickOutside = (event: MouseEvent) => {
  if (actionsDropdownRef.value && !actionsDropdownRef.value.contains(event.target as Node)) {
    showActionsDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Toggle functions
const toggleActionsDropdown = () => {
  showActionsDropdown.value = !showActionsDropdown.value
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedStudents.value = paginatedStudents.value.map(student => student.id)
  } else {
    selectedStudents.value = []
  }
}

// Student actions
const viewStudentProfile = (student: any) => {
  router.push(`/dashboard/student-profile/${student.id}`)
}

const editStudent = (student: any) => {
  // Navigate to the student management view with the student ID
  router.push(`/dashboard/student-management?id=${student.id}`)
}

const toggleStudentStatus = (student: any) => {
  student.status = student.status === 'active' ? 'inactive' : 'active'
  alert(`${language.value === 'de' ? 'Schülerstatus geändert zu' : 'Student status changed to'} ${student.status}`)
}

// Language management
const handleLanguageSubmit = (languageData: any) => {
  if (!selectedLanguage.value) return
  
  if (languageModalMode.value === 'edit') {
    const index = selectedLanguage.value.languages.findIndex((l: any) => l.id === languageData.id)
    if (index !== -1) {
      selectedLanguage.value.languages[index] = languageData
    }
  } else {
    // Add new language
    const newId = selectedLanguage.value.languages.length > 0 
      ? Math.max(...selectedLanguage.value.languages.map((l: any) => l.id)) + 1 
      : 1
    
    selectedLanguage.value.languages.push({
      ...languageData,
      id: newId
    })
  }
  
  showLanguageModal.value = false
}

// Career entry management
const handleCareerEntrySubmit = (entryData: any) => {
  if (!selectedCareerEntry.value) return
  
  if (careerEntryModalMode.value === 'edit') {
    const index = selectedCareerEntry.value.careerEntries.findIndex((e: any) => e.id === entryData.id)
    if (index !== -1) {
      selectedCareerEntry.value.careerEntries[index] = entryData
    }
  } else {
    // Add new entry
    const newId = selectedCareerEntry.value.careerEntries.length > 0 
      ? Math.max(...selectedCareerEntry.value.careerEntries.map((e: any) => e.id)) + 1 
      : 1
    
    selectedCareerEntry.value.careerEntries.push({
      ...entryData,
      id: newId
    })
  }
  
  showCareerEntryModal.value = false
}

// Correspondence note management
const handleCorrespondenceNoteSubmit = (noteData: any) => {
  if (!selectedCorrespondenceNote.value) return
  
  if (correspondenceNoteModalMode.value === 'edit') {
    const index = selectedCorrespondenceNote.value.correspondenceNotes.findIndex((n: any) => n.id === noteData.id)
    if (index !== -1) {
      selectedCorrespondenceNote.value.correspondenceNotes[index] = noteData
    }
  } else {
    // Add new note
    const newId = selectedCorrespondenceNote.value.correspondenceNotes.length > 0 
      ? Math.max(...selectedCorrespondenceNote.value.correspondenceNotes.map((n: any) => n.id)) + 1 
      : 1
    
    selectedCorrespondenceNote.value.correspondenceNotes.push({
      ...noteData,
      id: newId
    })
  }
  
  showCorrespondenceNoteModal.value = false
}

// Bulk operations
const handleBulkLanguageSubmit = (languageEntries: any[]) => {
  const selectedStudentObjs = students.value.filter(student => selectedStudents.value.includes(student.id))
  
  selectedStudentObjs.forEach(student => {
    if (!student.languages) {
      student.languages = []
    }
    
    languageEntries.forEach(language => {
      const lastId = student.languages.length > 0 
        ? Math.max(...student.languages.map((l: any) => l.id)) 
        : 0
      
      student.languages.push({
        ...language,
        id: lastId + 1
      })
    })
  })
  
  showBulkLanguageModal.value = false
  alert(language.value === 'de' 
    ? `Sprachen wurden ${selectedStudentObjs.length} Schülern zugewiesen` 
    : `Languages assigned to ${selectedStudentObjs.length} students`)
}

const performSchoolYearChange = (yearChangeData: any) => {
  // In a real application, this would perform the actual school year change
  // For now, we'll just show an alert
  alert(language.value === 'de' 
    ? `Schuljahreswechsel von ${yearChangeData.currentYear} ${yearChangeData.currentSemester} nach ${yearChangeData.targetYear} ${yearChangeData.targetSemester} durchgeführt` 
    : `School year change from ${yearChangeData.currentYear} ${yearChangeData.currentSemester} to ${yearChangeData.targetYear} ${yearChangeData.targetSemester} performed`)
  
  showSchoolYearChangeModal.value = false
}

// Utility functions
const getStatusColor = (status: string) => {
  return status === 'active' 
    ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300' 
    : 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-300'
}

const getGradeColor = (grade: string) => {
  if (grade.includes('A')) return 'text-green-600 dark:text-green-400'
  if (grade.includes('B')) return 'text-blue-600 dark:text-blue-400'
  if (grade.includes('C')) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}
</script>
