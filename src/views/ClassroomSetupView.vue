<template>
  <div class="space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen p-6">
    <!-- Header -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Klasseneinrichtung' : 'Classroom Setup' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Klassen, Unterrichtsformate und Zuweisungen' : 'Manage classes, teaching formats, and assignments' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button 
            @click="showClassModal = true" 
            class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {{ language === 'de' ? 'Neue Klasse' : 'New Class' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Class Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="stat in classStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
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

    <!-- Class List -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400">
          {{ language === 'de' ? 'Klassenübersicht' : 'Class Overview' }}
        </h2>
        <div class="flex space-x-2">
          <select 
            v-model="selectedGradeLevel"
            class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
          >
            <option value="">{{ language === 'de' ? 'Alle Klassenstufen' : 'All Grade Levels' }}</option>
            <option v-for="grade in gradeLevels" :key="grade" :value="grade">{{ grade }}</option>
          </select>
          <select 
            v-model="selectedSemester"
            class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
          >
            <option value="">{{ language === 'de' ? 'Alle Semester' : 'All Semesters' }}</option>
            <option v-for="semester in semesters" :key="semester.id" :value="semester.id">{{ semester.name }}</option>
          </select>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Klasse' : 'Class' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Klassenstufe' : 'Grade Level' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Klassenlehrer' : 'Homeroom Teacher' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Schüler' : 'Students' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Raum' : 'Room' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Semester' : 'Semester' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="class_ in filteredClasses" :key="class_.id" class="border-b border-slate-100 dark:border-slate-700">
              <td class="py-3 px-4 font-medium text-slate-800 dark:text-slate-50">{{ class_.name }}</td>
              <td class="py-3 px-4 text-slate-800 dark:text-slate-50">{{ class_.gradeLevel }}</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img :src="class_.teacherAvatar" :alt="class_.teacher" class="h-8 w-8 rounded-full object-cover mr-3" />
                  <span class="text-slate-800 dark:text-slate-50">{{ class_.teacher }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-800 dark:text-slate-50">{{ class_.students }}</td>
              <td class="py-3 px-4 text-slate-800 dark:text-slate-50">{{ class_.room }}</td>
              <td class="py-3 px-4 text-slate-500 dark:text-slate-400">{{ getSemesterName(class_.semesterId) }}</td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="viewClass(class_)" class="text-primary-600 hover:text-primary-800">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="editClass(class_)" class="text-secondary-600 hover:text-secondary-800">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="manageStudents(class_)" class="text-blue-600 hover:text-blue-800">
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
        <div v-for="class_ in paginatedClasses" :key="`mobile-${class_.id}`" class="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="font-semibold text-slate-800 dark:text-slate-50 text-lg">{{ class_.name }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ class_.gradeLevel }}</p>
              <div class="flex items-center mt-2">
                <img :src="class_.teacherAvatar" :alt="class_.teacher" class="h-6 w-6 rounded-full object-cover mr-2" />
                <span class="text-sm text-slate-600 dark:text-slate-400">{{ class_.teacher }}</span>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-3 mb-4">
            <div class="text-center p-2 bg-white dark:bg-slate-600 rounded">
              <div class="text-lg font-bold text-slate-800 dark:text-slate-50">{{ class_.students }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Schüler' : 'Students' }}</div>
            </div>
            <div class="text-center p-2 bg-white dark:bg-slate-600 rounded">
              <div class="text-sm font-bold text-slate-800 dark:text-slate-50">{{ class_.room }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Raum' : 'Room' }}</div>
            </div>
            <div class="text-center p-2 bg-white dark:bg-slate-600 rounded">
              <div class="text-xs font-bold text-slate-800 dark:text-slate-50">{{ getSemesterName(class_.semesterId) }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Semester' : 'Semester' }}</div>
            </div>
          </div>
          
          <div class="flex justify-center space-x-4 pt-2 border-t border-slate-200 dark:border-slate-600">
            <button @click="viewClass(class_)" class="flex items-center text-primary-600 hover:text-primary-800 text-sm">
              <Eye class="h-4 w-4 mr-1" />
              {{ language === 'de' ? 'Ansehen' : 'View' }}
            </button>
            <button @click="editClass(class_)" class="flex items-center text-secondary-600 hover:text-secondary-800 text-sm">
              <Edit class="h-4 w-4 mr-1" />
              {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
            </button>
            <button @click="manageStudents(class_)" class="flex items-center text-blue-600 hover:text-blue-800 text-sm">
              <Users class="h-4 w-4 mr-1" />
              {{ language === 'de' ? 'Verwalten' : 'Manage' }}
            </button>
          </div>
        </div>

        <!-- Mobile Pagination -->
        <div class="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
          <div class="text-sm text-slate-500 dark:text-slate-400">
            {{ language === 'de' ? 'Zeige' : 'Showing' }} {{ (currentPage - 1) * itemsPerPage + 1 }} {{ language === 'de' ? 'bis' : 'to' }} {{ Math.min(currentPage * itemsPerPage, filteredClasses.length) }} {{ language === 'de' ? 'von' : 'of' }} {{ filteredClasses.length }} {{ language === 'de' ? 'Klassen' : 'classes' }}
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

    <!-- Teaching Formats -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400">
          {{ language === 'de' ? 'Unterrichtsformate' : 'Teaching Formats' }}
        </h2>
        <button @click="showFormatModal = true" class="btn-secondary text-sm">
          {{ language === 'de' ? 'Format hinzufügen' : 'Add Format' }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="format in teachingFormats" :key="format.id" class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ format.name }}</h3>
            <button @click="editFormat(format)" class="text-primary-600 hover:text-primary-800">
              <Edit class="h-4 w-4" />
            </button>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">{{ format.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-500 dark:text-slate-400">{{ format.classes }} {{ language === 'de' ? 'Klassen' : 'classes' }}</span>
            <span :class="getFormatTypeColor(format.type)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ format.type }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Class Modal -->
    <div v-if="showClassModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Neue Klasse erstellen' : 'Create New Class' }}
            </h3>
            <button @click="showClassModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="addClass" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Klassenname' : 'Class Name' }}
                </label>
                <input v-model="classForm.name" type="text" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Klassenstufe' : 'Grade Level' }}
                </label>
                <select v-model="classForm.gradeLevel" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                  <option value="">{{ language === 'de' ? 'Stufe wählen' : 'Select Grade' }}</option>
                  <option v-for="grade in gradeLevels" :key="grade" :value="grade">{{ grade }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Klassenlehrer' : 'Homeroom Teacher' }}
                </label>
                <select v-model="classForm.teacherId" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                  <option value="">{{ language === 'de' ? 'Lehrer wählen' : 'Select Teacher' }}</option>
                  <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Raum' : 'Room' }}
                </label>
                <select v-model="classForm.roomId" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                  <option value="">{{ language === 'de' ? 'Raum wählen' : 'Select Room' }}</option>
                  <option v-for="room in allRooms" :key="room.id" :value="room.id">{{ room.name }} ({{ getBuildingName(room.buildingId) }})</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Semester' : 'Semester' }}
                </label>
                <select v-model="classForm.semesterId" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                  <option value="">{{ language === 'de' ? 'Semester wählen' : 'Select Semester' }}</option>
                  <option v-for="semester in semesters" :key="semester.id" :value="semester.id">{{ semester.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Unterrichtsformat' : 'Teaching Format' }}
                </label>
                <select v-model="classForm.formatId" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                  <option value="">{{ language === 'de' ? 'Format wählen' : 'Select Format' }}</option>
                  <option v-for="format in teachingFormats" :key="format.id" :value="format.id">{{ format.name }}</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showClassModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Klasse erstellen' : 'Create Class' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add Teaching Format Modal -->
    <div v-if="showFormatModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Neues Unterrichtsformat' : 'New Teaching Format' }}
            </h3>
            <button @click="showFormatModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="addFormat" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Formatname' : 'Format Name' }}
              </label>
              <input v-model="formatForm.name" type="text" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea v-model="formatForm.description" rows="3" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50 resize-none"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Formattyp' : 'Format Type' }}
              </label>
              <select v-model="formatForm.type" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                <option value="">{{ language === 'de' ? 'Typ wählen' : 'Select Type' }}</option>
                <option value="Standard">{{ language === 'de' ? 'Standard' : 'Standard' }}</option>
                <option value="Intensive">{{ language === 'de' ? 'Intensiv' : 'Intensive' }}</option>
                <option value="Specialized">{{ language === 'de' ? 'Spezialisiert' : 'Specialized' }}</option>
                <option value="Hybrid">{{ language === 'de' ? 'Hybrid' : 'Hybrid' }}</option>
              </select>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showFormatModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Format hinzufügen' : 'Add Format' }}
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
import { Edit, Eye, X, Users, BookOpen, Calendar, DoorOpen, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showClassModal = ref(false)
const showFormatModal = ref(false)
const selectedGradeLevel = ref('')
const selectedSemester = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(5)

const classForm = ref({
  name: '',
  gradeLevel: '',
  teacherId: '',
  roomId: '',
  semesterId: '',
  formatId: ''
})

const formatForm = ref({
  name: '',
  description: '',
  type: ''
})

const classStats = ref([
  {
    title: language.value === 'de' ? 'Aktive Klassen' : 'Active Classes',
    value: '42',
    change: '+3 this semester',
    changeColor: 'text-green-600',
    icon: BookOpen,
    iconBg: 'bg-primary-600'
  },
  {
    title: language.value === 'de' ? 'Schüler' : 'Students',
    value: '1,247',
    change: '+28 this month',
    changeColor: 'text-green-600',
    icon: Users,
    iconBg: 'bg-green-600'
  },
  {
    title: language.value === 'de' ? 'Unterrichtsformate' : 'Teaching Formats',
    value: '5',
    change: '+1 this year',
    changeColor: 'text-green-600',
    icon: Calendar,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Genutzte Räume' : 'Rooms Used',
    value: '38',
    change: '+2 this semester',
    changeColor: 'text-green-600',
    icon: DoorOpen,
    iconBg: 'bg-yellow-600'
  }
])

const gradeLevels = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']

const semesters = ref([
  {
    id: 1,
    name: 'Fall Semester 2023/2024',
    startDate: '2023-08-01',
    endDate: '2024-01-31',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Spring Semester 2022/2023',
    startDate: '2023-02-01',
    endDate: '2023-07-31',
    status: 'Archived'
  }
])

const teachers = ref([
  {
    id: 1,
    name: 'Dr. Thomas Weber',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 2,
    name: 'Ms. Sarah Schmidt',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 3,
    name: 'Prof. Michael Mueller',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 4,
    name: 'Dr. Anna Fischer',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 5,
    name: 'Mr. Johannes Bauer',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
])

const buildings = ref([
  {
    id: 1,
    name: 'Main Building',
    rooms: [
      { id: 1, name: 'Room 101', buildingId: 1, type: 'Classroom', capacity: 30 },
      { id: 2, name: 'Room 102', buildingId: 1, type: 'Classroom', capacity: 30 },
      { id: 3, name: 'Room 103', buildingId: 1, type: 'Computer Lab', capacity: 25 }
    ]
  },
  {
    id: 2,
    name: 'Science Building',
    rooms: [
      { id: 4, name: 'Lab A', buildingId: 2, type: 'Laboratory', capacity: 24 },
      { id: 5, name: 'Lab B', buildingId: 2, type: 'Laboratory', capacity: 24 }
    ]
  },
  {
    id: 3,
    name: 'Arts Center',
    rooms: [
      { id: 6, name: 'Art Studio', buildingId: 3, type: 'Art Studio', capacity: 20 },
      { id: 7, name: 'Music Room', buildingId: 3, type: 'Music Room', capacity: 30 },
      { id: 8, name: 'Auditorium', buildingId: 3, type: 'Auditorium', capacity: 200 }
    ]
  }
])

const allRooms = computed(() => {
  return buildings.value.flatMap(building => building.rooms)
})

const teachingFormats = ref([
  {
    id: 1,
    name: 'Standard Classroom',
    description: 'Traditional classroom teaching with teacher-led instruction',
    type: 'Standard',
    classes: 25
  },
  {
    id: 2,
    name: 'Project-Based Learning',
    description: 'Learning through projects and collaborative work',
    type: 'Specialized',
    classes: 8
  },
  {
    id: 3,
    name: 'Blended Learning',
    description: 'Combination of online and in-person instruction',
    type: 'Hybrid',
    classes: 5
  },
  {
    id: 4,
    name: 'Advanced Placement',
    description: 'Accelerated curriculum for high-achieving students',
    type: 'Intensive',
    classes: 3
  },
  {
    id: 5,
    name: 'Special Education',
    description: 'Adapted teaching for students with special needs',
    type: 'Specialized',
    classes: 2
  }
])

const classes = ref([
  {
    id: 1,
    name: 'Class 10A',
    gradeLevel: 'Grade 10',
    teacher: 'Dr. Thomas Weber',
    teacherAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    students: 28,
    room: 'Room 101',
    semesterId: 1,
    formatId: 1
  },
  {
    id: 2,
    name: 'Class 10B',
    gradeLevel: 'Grade 10',
    teacher: 'Ms. Sarah Schmidt',
    teacherAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    students: 25,
    room: 'Room 102',
    semesterId: 1,
    formatId: 1
  },
  {
    id: 3,
    name: 'Class 11A',
    gradeLevel: 'Grade 11',
    teacher: 'Prof. Michael Mueller',
    teacherAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    students: 22,
    room: 'Room 103',
    semesterId: 1,
    formatId: 4
  },
  {
    id: 4,
    name: 'Class 9B',
    gradeLevel: 'Grade 9',
    teacher: 'Dr. Anna Fischer',
    teacherAvatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    students: 26,
    room: 'Art Studio',
    semesterId: 1,
    formatId: 2
  },
  {
    id: 5,
    name: 'Class 8A',
    gradeLevel: 'Grade 8',
    teacher: 'Mr. Johannes Bauer',
    teacherAvatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    students: 30,
    room: 'Music Room',
    semesterId: 1,
    formatId: 3
  }
])

const filteredClasses = computed(() => {
  return classes.value.filter(class_ => {
    const matchesGrade = !selectedGradeLevel.value || class_.gradeLevel === selectedGradeLevel.value
    const matchesSemester = !selectedSemester.value || class_.semesterId.toString() === selectedSemester.value
    
    return matchesGrade && matchesSemester
  })
})

const totalPages = computed(() => Math.ceil(filteredClasses.value.length / itemsPerPage.value))
const visiblePages = computed(() => {
  const pages = []
  for (let i = Math.max(currentPage.value - 2, 1); i <= Math.min(currentPage.value + 2, totalPages.value); i++) {
    pages.push(i)
  }
  return pages
})

const paginatedClasses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredClasses.value.slice(start, end)
})

const getBuildingName = (buildingId: number) => {
  const building = buildings.value.find(b => b.id === buildingId)
  return building ? building.name : ''
}

const getSemesterName = (semesterId: number) => {
  const semester = semesters.value.find(s => s.id === semesterId)
  return semester ? semester.name : ''
}

const getFormatTypeColor = (type: string) => {
  switch (type) {
    case 'Standard':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Intensive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Specialized':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'Hybrid':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const addClass = () => {
  const teacher = teachers.value.find(t => t.id.toString() === classForm.value.teacherId)
  const room = allRooms.value.find(r => r.id.toString() === classForm.value.roomId)
  
  const newClass = {
    id: classes.value.length + 1,
    name: classForm.value.name,
    gradeLevel: classForm.value.gradeLevel,
    teacher: teacher?.name || 'Not Assigned',
    teacherAvatar: teacher?.avatar || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    students: 0,
    room: room?.name || 'Not Assigned',
    semesterId: parseInt(classForm.value.semesterId),
    formatId: parseInt(classForm.value.formatId)
  }
  
  classes.value.push(newClass)
  showClassModal.value = false
  classForm.value = {
    name: '',
    gradeLevel: '',
    teacherId: '',
    roomId: '',
    semesterId: '',
    formatId: ''
  }
  
  alert(language.value === 'de' ? 'Klasse erfolgreich erstellt!' : 'Class created successfully!')
}

const addFormat = () => {
  const newFormat = {
    id: teachingFormats.value.length + 1,
    name: formatForm.value.name,
    description: formatForm.value.description,
    type: formatForm.value.type,
    classes: 0
  }
  
  teachingFormats.value.push(newFormat)
  showFormatModal.value = false
  formatForm.value = {
    name: '',
    description: '',
    type: ''
  }
  
  alert(language.value === 'de' ? 'Unterrichtsformat erfolgreich hinzugefügt!' : 'Teaching format added successfully!')
}

const viewClass = (class_: any) => {
  alert(`${language.value === 'de' ? 'Klasse anzeigen' : 'View class'}: ${class_.name}`)
}

const editClass = (class_: any) => {
  alert(`${language.value === 'de' ? 'Klasse bearbeiten' : 'Edit class'}: ${class_.name}`)
}

const manageStudents = (class_: any) => {
  alert(`${language.value === 'de' ? 'Schüler verwalten für' : 'Manage students for'} ${class_.name}`)
}

const editFormat = (format: any) => {
  alert(`${language.value === 'de' ? 'Format bearbeiten' : 'Edit format'}: ${format.name}`)
}
</script>
