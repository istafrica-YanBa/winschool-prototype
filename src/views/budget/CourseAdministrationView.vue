<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Target class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Kursverwaltung' : 'Course Administration' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Budget und Ressourcen mit Kursen verknüpfen' : 'Connect budget and resources to courses' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showFilters = !showFilters" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Filter class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Filter' : 'Filters' }}
        </button>
        <button @click="showBudgetOverview = !showBudgetOverview" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <BarChart3 class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Budget-Übersicht' : 'Budget Overview' }}
        </button>
        <button @click="showCreateCourse = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Kurs erstellen' : 'Create Course' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
      <div v-for="stat in courseStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center">
          <div :class="stat.iconBg" class="p-2 sm:p-3 rounded-lg mb-2 sm:mb-0 sm:mr-4 self-start sm:self-auto">
            <component :is="stat.icon" class="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{{ stat.title }}</p>
            <p class="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-50">{{ stat.value }}</p>
            <p :class="stat.changeColor" class="text-xs sm:text-sm truncate">{{ stat.change }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Fachbereich' : 'Department' }}
          </label>
          <select v-model="filters.department" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Fachbereiche' : 'All Departments' }}</option>
            <option value="science">{{ language === 'de' ? 'Naturwissenschaften' : 'Science' }}</option>
            <option value="mathematics">{{ language === 'de' ? 'Mathematik' : 'Mathematics' }}</option>
            <option value="literature">{{ language === 'de' ? 'Literatur' : 'Literature' }}</option>
            <option value="technology">{{ language === 'de' ? 'Technologie' : 'Technology' }}</option>
            <option value="arts">{{ language === 'de' ? 'Kunst' : 'Arts' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Semester' : 'Semester' }}
          </label>
          <select v-model="filters.semester" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Semester' : 'All Semesters' }}</option>
            <option value="spring2024">{{ language === 'de' ? 'Frühjahr 2024' : 'Spring 2024' }}</option>
            <option value="fall2024">{{ language === 'de' ? 'Herbst 2024' : 'Fall 2024' }}</option>
            <option value="spring2025">{{ language === 'de' ? 'Frühjahr 2025' : 'Spring 2025' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Budget-Status' : 'Budget Status' }}
          </label>
          <select v-model="filters.budgetStatus" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="allocated">{{ language === 'de' ? 'Zugewiesen' : 'Allocated' }}</option>
            <option value="exceeded">{{ language === 'de' ? 'Überschritten' : 'Exceeded' }}</option>
            <option value="available">{{ language === 'de' ? 'Verfügbar' : 'Available' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Suchbegriff' : 'Search' }}
          </label>
          <input v-model="filters.search" type="text" :placeholder="language === 'de' ? 'Nach Kursname oder Lehrer suchen...' : 'Search by course name or instructor...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400">
        </div>
      </div>
    </div>

    <!-- Courses Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Kurs' : 'Course' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Lehrer' : 'Instructor' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Studenten' : 'Students' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Budget' : 'Budget' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Ressourcen' : 'Resources' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Status' : 'Status' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            <tr v-for="course in filteredCourses" :key="course.id" class="hover:bg-slate-50 dark:hover:bg-slate-700">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div :class="getDepartmentIcon(course.department)" class="p-2 rounded-lg mr-3">
                    <component :is="getDepartmentIconComponent(course.department)" class="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ course.name }}</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">{{ course.code }} • {{ getDepartmentTranslation(course.department) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-800 dark:text-slate-50">{{ course.instructor }}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">{{ course.semester }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-800 dark:text-slate-50">{{ course.enrolledStudents }}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Eingeschrieben' : 'Enrolled' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-800 dark:text-slate-50">€{{ course.allocatedBudget.toLocaleString() }}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">€{{ course.usedBudget.toLocaleString() }} {{ language === 'de' ? 'verwendet' : 'used' }}</div>
                <div class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1 mt-1">
                  <div class="bg-blue-500 h-1 rounded-full" :style="{ width: `${(course.usedBudget / course.allocatedBudget) * 100}%` }"></div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span v-for="resource in course.resources.slice(0, 2)" :key="resource" class="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">
                    {{ resource }}
                  </span>
                  <span v-if="course.resources.length > 2" class="inline-flex px-2 py-1 text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 rounded">
                    +{{ course.resources.length - 2 }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="getBudgetStatusColor(course)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getBudgetStatusTranslation(course.budgetStatus) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex space-x-2">
                  <button @click="viewCourseDetails(course)" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="manageBudget(course)" class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                    <DollarSign class="h-4 w-4" />
                  </button>
                  <button @click="manageResources(course)" class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                    <Package class="h-4 w-4" />
                  </button>
                  <button @click="editCourse(course)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    <Edit class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden p-4 space-y-4">
        <div v-for="course in filteredCourses" :key="course.id" class="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <div :class="getDepartmentIcon(course.department)" class="p-2 rounded-lg mr-3">
                <component :is="getDepartmentIconComponent(course.department)" class="h-4 w-4 text-white" />
              </div>
              <div>
                <div class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ course.name }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">{{ course.code }}</div>
              </div>
            </div>
            <span :class="getBudgetStatusColor(course)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
              {{ getBudgetStatusTranslation(course.budgetStatus) }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Lehrer' : 'Instructor' }}</div>
              <div class="text-sm text-slate-800 dark:text-slate-50">{{ course.instructor }}</div>
            </div>
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Studenten' : 'Students' }}</div>
              <div class="text-sm text-slate-800 dark:text-slate-50">{{ course.enrolledStudents }}</div>
            </div>
          </div>

          <div class="mb-3">
            <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Budget' : 'Budget' }}</div>
            <div class="text-sm font-medium text-slate-800 dark:text-slate-50">€{{ course.allocatedBudget.toLocaleString() }}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400">€{{ course.usedBudget.toLocaleString() }} {{ language === 'de' ? 'verwendet' : 'used' }}</div>
            <div class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1 mt-1">
              <div class="bg-blue-500 h-1 rounded-full" :style="{ width: `${(course.usedBudget / course.allocatedBudget) * 100}%` }"></div>
            </div>
          </div>

          <div class="mb-3">
            <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Ressourcen' : 'Resources' }}</div>
            <div class="flex flex-wrap gap-1 mt-1">
              <span v-for="resource in course.resources.slice(0, 3)" :key="resource" class="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">
                {{ resource }}
              </span>
              <span v-if="course.resources.length > 3" class="inline-flex px-2 py-1 text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 rounded">
                +{{ course.resources.length - 3 }}
              </span>
            </div>
          </div>

          <div class="flex justify-end space-x-2">
            <button @click="viewCourseDetails(course)" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1">
              <Eye class="h-4 w-4" />
            </button>
            <button @click="manageBudget(course)" class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1">
              <DollarSign class="h-4 w-4" />
            </button>
            <button @click="manageResources(course)" class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 p-1">
              <Package class="h-4 w-4" />
            </button>
            <button @click="editCourse(course)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-1">
              <Edit class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Course Modal -->
    <div v-if="showCreateCourse" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Neuer Kurs' : 'New Course' }}
          </h3>
          <button @click="showCreateCourse = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <form @submit.prevent="createNewCourse" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Kursname' : 'Course Name' }}
              </label>
              <input v-model="newCourse.name" type="text" required :placeholder="language === 'de' ? 'Kursname...' : 'Course name...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400">
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Kurscode' : 'Course Code' }}
              </label>
              <input v-model="newCourse.code" type="text" required :placeholder="language === 'de' ? 'Z.B. MATH101' : 'e.g. MATH101'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Fachbereich' : 'Department' }}
              </label>
              <select v-model="newCourse.department" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <option value="">{{ language === 'de' ? 'Fachbereich auswählen...' : 'Select department...' }}</option>
                <option value="science">{{ language === 'de' ? 'Naturwissenschaften' : 'Science' }}</option>
                <option value="mathematics">{{ language === 'de' ? 'Mathematik' : 'Mathematics' }}</option>
                <option value="literature">{{ language === 'de' ? 'Literatur' : 'Literature' }}</option>
                <option value="technology">{{ language === 'de' ? 'Technologie' : 'Technology' }}</option>
                <option value="arts">{{ language === 'de' ? 'Kunst' : 'Arts' }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Semester' : 'Semester' }}
              </label>
              <select v-model="newCourse.semester" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <option value="">{{ language === 'de' ? 'Semester auswählen...' : 'Select semester...' }}</option>
                <option value="spring2024">{{ language === 'de' ? 'Frühjahr 2024' : 'Spring 2024' }}</option>
                <option value="fall2024">{{ language === 'de' ? 'Herbst 2024' : 'Fall 2024' }}</option>
                <option value="spring2025">{{ language === 'de' ? 'Frühjahr 2025' : 'Spring 2025' }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Lehrer' : 'Instructor' }}
            </label>
            <input v-model="newCourse.instructor" type="text" required :placeholder="language === 'de' ? 'Lehrername...' : 'Instructor name...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Eingeschriebene Studenten' : 'Enrolled Students' }}
              </label>
              <input v-model.number="newCourse.enrolledStudents" type="number" min="1" required :placeholder="language === 'de' ? 'Anzahl...' : 'Number...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400">
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Zugewiesenes Budget' : 'Allocated Budget' }}
              </label>
              <input v-model.number="newCourse.allocatedBudget" type="number" min="0" step="0.01" required :placeholder="language === 'de' ? 'Budget...' : 'Budget...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Beschreibung' : 'Description' }}
            </label>
            <textarea v-model="newCourse.description" rows="3" :placeholder="language === 'de' ? 'Kursbeschreibung...' : 'Course description...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400"></textarea>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showCreateCourse = false" class="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button type="submit" class="px-4 py-2 bg-gradient-to-r from-indigo-700 to-blue-600 text-white rounded-lg hover:from-indigo-800 hover:to-blue-700">
              {{ language === 'de' ? 'Kurs erstellen' : 'Create Course' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguageStore } from '../../stores/language'
import {
  GraduationCap, Filter, BarChart3, Plus, Eye, Edit, X,
  DollarSign, Package, Users, BookOpen, Microscope, Calculator,
  Palette, Monitor, AlertTriangle, Target
} from 'lucide-vue-next'

const languageStore = useLanguageStore()
const language = computed(() => languageStore.language)

// Reactive data
const showFilters = ref(false)
const showBudgetOverview = ref(false)
const showCreateCourse = ref(false)

const filters = ref({
  department: '',
  semester: '',
  budgetStatus: '',
  search: ''
})

const newCourse = ref({
  name: '',
  code: '',
  department: '',
  semester: '',
  instructor: '',
  enrolledStudents: null,
  allocatedBudget: null,
  description: ''
})

// Mock data
const courses = ref([
  {
    id: 1,
    name: 'Advanced Chemistry',
    code: 'CHEM301',
    department: 'science',
    semester: 'spring2024',
    instructor: 'Dr. Sarah Wilson',
    enrolledStudents: 28,
    allocatedBudget: 5000,
    usedBudget: 3200,
    budgetStatus: 'allocated',
    resources: ['Lab Equipment', 'Chemicals', 'Safety Gear', 'Textbooks'],
    description: 'Advanced organic chemistry course with laboratory work'
  },
  {
    id: 2,
    name: 'Calculus II',
    code: 'MATH201',
    department: 'mathematics',
    semester: 'spring2024',
    instructor: 'Prof. John Smith',
    enrolledStudents: 35,
    allocatedBudget: 2000,
    usedBudget: 1200,
    budgetStatus: 'available',
    resources: ['Graphing Calculators', 'Software Licenses', 'Textbooks'],
    description: 'Integral calculus and series for engineering students'
  },
  {
    id: 3,
    name: 'Modern Literature',
    code: 'LIT305',
    department: 'literature',
    semester: 'fall2024',
    instructor: 'Ms. Emily Davis',
    enrolledStudents: 22,
    allocatedBudget: 1500,
    usedBudget: 1800,
    budgetStatus: 'exceeded',
    resources: ['Books', 'Digital Resources', 'Audio Equipment'],
    description: '20th century literature analysis and criticism'
  },
  {
    id: 4,
    name: 'Computer Programming',
    code: 'CS101',
    department: 'technology',
    semester: 'spring2024',
    instructor: 'Dr. Michael Brown',
    enrolledStudents: 40,
    allocatedBudget: 8000,
    usedBudget: 6500,
    budgetStatus: 'allocated',
    resources: ['Computers', 'Software Licenses', 'Online Platforms', 'Textbooks', 'Hardware'],
    description: 'Introduction to programming with Python and Java'
  },
  {
    id: 5,
    name: 'Digital Art Studio',
    code: 'ART250',
    department: 'arts',
    semester: 'fall2024',
    instructor: 'Prof. Lisa Garcia',
    enrolledStudents: 18,
    allocatedBudget: 4500,
    usedBudget: 2100,
    budgetStatus: 'available',
    resources: ['Graphics Tablets', 'Software Licenses', 'Computers'],
    description: 'Digital art creation using modern tools and techniques'
  }
])

// Computed properties
const courseStats = computed(() => [
  {
    title: language.value === 'de' ? 'Aktive Kurse' : 'Active Courses',
    value: courses.value.length.toString(),
    change: language.value === 'de' ? '+3 dieses Semester' : '+3 this semester',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: GraduationCap,
    iconBg: 'bg-blue-500'
  },
  {
    title: language.value === 'de' ? 'Gesamtstudenten' : 'Total Students',
    value: courses.value.reduce((sum, c) => sum + c.enrolledStudents, 0).toString(),
    change: language.value === 'de' ? '+15% vom Vorjahr' : '+15% from last year',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: Users,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Gesamtbudget' : 'Total Budget',
    value: `€${courses.value.reduce((sum, c) => sum + c.allocatedBudget, 0).toLocaleString()}`,
    change: language.value === 'de' ? '78% verwendet' : '78% utilized',
    changeColor: 'text-blue-600 dark:text-blue-400',
    icon: DollarSign,
    iconBg: 'bg-purple-500'
  },
  {
    title: language.value === 'de' ? 'Budget-Warnungen' : 'Budget Alerts',
    value: courses.value.filter(c => c.budgetStatus === 'exceeded').length.toString(),
    change: language.value === 'de' ? 'Benötigen Aufmerksamkeit' : 'Need attention',
    changeColor: 'text-red-600 dark:text-red-400',
    icon: AlertTriangle,
    iconBg: 'bg-red-500'
  }
])

const filteredCourses = computed(() => {
  let filtered = courses.value

  if (filters.value.department) {
    filtered = filtered.filter(c => c.department === filters.value.department)
  }

  if (filters.value.semester) {
    filtered = filtered.filter(c => c.semester === filters.value.semester)
  }

  if (filters.value.budgetStatus) {
    filtered = filtered.filter(c => c.budgetStatus === filters.value.budgetStatus)
  }

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(searchTerm) ||
      c.code.toLowerCase().includes(searchTerm) ||
      c.instructor.toLowerCase().includes(searchTerm)
    )
  }

  return filtered
})

// Methods
const getDepartmentIcon = (department: string) => {
  const iconMap = {
    science: 'bg-green-500',
    mathematics: 'bg-blue-500',
    literature: 'bg-purple-500',
    technology: 'bg-orange-500',
    arts: 'bg-pink-500'
  }
  return iconMap[department as keyof typeof iconMap] || 'bg-gray-500'
}

const getDepartmentIconComponent = (department: string) => {
  const iconMap = {
    science: Microscope,
    mathematics: Calculator,
    literature: BookOpen,
    technology: Monitor,
    arts: Palette
  }
  return iconMap[department as keyof typeof iconMap] || BookOpen
}

const getDepartmentTranslation = (department: string) => {
  const translations = {
    science: language.value === 'de' ? 'Naturwissenschaften' : 'Science',
    mathematics: language.value === 'de' ? 'Mathematik' : 'Mathematics',
    literature: language.value === 'de' ? 'Literatur' : 'Literature',
    technology: language.value === 'de' ? 'Technologie' : 'Technology',
    arts: language.value === 'de' ? 'Kunst' : 'Arts'
  }
  return translations[department as keyof typeof translations] || department
}

const getBudgetStatusColor = (course: any) => {
  switch (course.budgetStatus) {
    case 'allocated':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'exceeded':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'available':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getBudgetStatusTranslation = (status: string) => {
  const translations = {
    allocated: language.value === 'de' ? 'Zugewiesen' : 'Allocated',
    exceeded: language.value === 'de' ? 'Überschritten' : 'Exceeded',
    available: language.value === 'de' ? 'Verfügbar' : 'Available'
  }
  return translations[status as keyof typeof translations] || status
}

const viewCourseDetails = (course: any) => {
  console.log('View course details:', course)
}

const manageBudget = (course: any) => {
  console.log('Manage budget for course:', course)
}

const manageResources = (course: any) => {
  console.log('Manage resources for course:', course)
}

const editCourse = (course: any) => {
  console.log('Edit course:', course)
}

const createNewCourse = () => {
  const course = {
    id: courses.value.length + 1,
    name: newCourse.value.name,
    code: newCourse.value.code,
    department: newCourse.value.department,
    semester: newCourse.value.semester,
    instructor: newCourse.value.instructor,
    enrolledStudents: newCourse.value.enrolledStudents || 0,
    allocatedBudget: newCourse.value.allocatedBudget || 0,
    usedBudget: 0,
    budgetStatus: 'available',
    resources: [],
    description: newCourse.value.description
  }
  
  courses.value.push(course)
  showCreateCourse.value = false
  
  // Reset form
  newCourse.value = {
    name: '',
    code: '',
    department: '',
    semester: '',
    instructor: '',
    enrolledStudents: null,
    allocatedBudget: null,
    description: ''
  }
}
</script> 