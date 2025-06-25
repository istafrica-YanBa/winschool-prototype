<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary hover:bg-winschool-primary-dark rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <BookOpenCheck class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Lernfelder' : 'Learning Areas' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Lernfelder und deren Zuordnung zu Hauptfächern' : 'Manage learning fields and their assignment to main subjects' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="showCreateFieldModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Lernfeld erstellen' : 'Create Learning Field' }}
          </button>
        </div>
      </div>

      <!-- Introduction and Explanation Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center mb-6">
          <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
            <Info class="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {{ language === 'de' ? 'Einführung in Lernfelder' : 'Introduction to Learning Fields' }}
          </h2>
        </div>

        <div class="prose prose-slate dark:prose-invert max-w-none">
          <div class="mb-6">
            <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3">
              {{ language === 'de' ? 'Was sind Lernfelder?' : 'What are Learning Fields?' }}
            </h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ language === 'de' 
                ? 'Lernfelder sind spezielle Unterkategorien von Hauptfächern, die es ermöglichen, den Lehrplan in kleinere, fokussierte Bereiche zu unterteilen. Sie bieten eine detailliertere Struktur für die Bewertung und Berichterstattung von Schülerleistungen.' 
                : 'Learning fields are specialized subcategories of main subjects that allow for dividing the curriculum into smaller, focused areas. They provide a more detailed structure for assessment and reporting of student performance.' 
              }}
            </p>
          </div>

          <div class="mb-6">
            <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3">
              {{ language === 'de' ? 'Beziehung zu Hauptfächern' : 'Relationship to Main Subjects' }}
            </h3>
            <div class="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="example in subjectExamples" :key="example.subject" class="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800">
                  <h4 class="font-medium text-slate-800 dark:text-slate-200 mb-2">{{ example.subject }}</h4>
                  <div class="space-y-1">
                    <div v-for="field in example.fields" :key="field" class="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                      <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {{ field }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3">
              {{ language === 'de' ? 'Vorteile von Lernfeldern' : 'Benefits of Learning Fields' }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="benefit in benefits" :key="benefit.title" class="flex items-start">
                <div class="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <Check class="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ benefit.title }}</h4>
                  <p class="text-sm text-slate-600 dark:text-slate-400">{{ benefit.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <BookOpen class="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Hauptfächer' : 'Main Subjects' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ mainSubjects.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100 dark:bg-green-900">
              <Target class="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Lernfelder' : 'Learning Fields' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ learningFields.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
              <Users class="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Betroffene Klassen' : 'Affected Classes' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ affectedClasses }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
              <TrendingUp class="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Aktive Bewertungen' : 'Active Assessments' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ activeAssessments }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Subjects and Learning Fields Overview -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {{ language === 'de' ? 'Fächer und Lernfelder' : 'Subjects and Learning Fields' }}
          </h2>
          <div class="flex space-x-2">
            <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'" class="px-3 py-1 rounded-lg transition-colors">
              <List class="h-4 w-4" />
            </button>
            <button @click="viewMode = 'tree'" :class="viewMode === 'tree' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'" class="px-3 py-1 rounded-lg transition-colors">
              <GitBranch class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Tree View -->
        <div v-if="viewMode === 'tree'" class="space-y-4">
          <div v-for="subject in mainSubjects" :key="subject.id" class="border border-slate-200 dark:border-slate-600 rounded-lg">
            <div class="p-4 bg-slate-50 dark:bg-slate-700 rounded-t-lg border-b border-slate-200 dark:border-slate-600">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <button @click="toggleSubject(subject.id)" class="mr-3 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                    <ChevronDown v-if="expandedSubjects.includes(subject.id)" class="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <ChevronRight v-else class="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <div>
                    <h3 class="font-semibold text-slate-800 dark:text-slate-200">{{ subject.name }}</h3>
                    <p class="text-sm text-slate-600 dark:text-slate-400">{{ subject.code }}</p>
                  </div>
                </div>
                <span class="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                  {{ getSubjectLearningFields(subject.id).length }} {{ language === 'de' ? 'Lernfelder' : 'Fields' }}
                </span>
              </div>
            </div>
            
            <div v-if="expandedSubjects.includes(subject.id)" class="p-4">
              <div v-if="getSubjectLearningFields(subject.id).length === 0" class="text-center py-8 text-slate-500 dark:text-slate-400">
                {{ language === 'de' ? 'Keine Lernfelder zugeordnet' : 'No learning fields assigned' }}
              </div>
              <div v-else class="space-y-3">
                <div v-for="field in getSubjectLearningFields(subject.id)" :key="field.id" class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                      <Target class="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ field.name }}</h4>
                      <p class="text-sm text-slate-600 dark:text-slate-400">{{ field.code }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span :class="field.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ field.isActive ? (language === 'de' ? 'Aktiv' : 'Active') : (language === 'de' ? 'Inaktiv' : 'Inactive') }}
                    </span>
                    <button @click="editLearningField(field)" class="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                      <Edit3 class="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-if="viewMode === 'list'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ language === 'de' ? 'Lernfeld' : 'Learning Field' }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ language === 'de' ? 'Hauptfach' : 'Main Subject' }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ language === 'de' ? 'Code' : 'Code' }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ language === 'de' ? 'Status' : 'Status' }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="field in learningFields" :key="field.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                      <Target class="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ field.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ field.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ getMainSubjectName(field.mainSubjectId) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-mono text-gray-900 dark:text-white">{{ field.code }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="field.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ field.isActive ? (language === 'de' ? 'Aktiv' : 'Active') : (language === 'de' ? 'Inaktiv' : 'Inactive') }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="editLearningField(field)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                      <Edit3 class="h-4 w-4" />
                    </button>
                    <button @click="deleteLearningField(field)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Learning Field Modal -->
      <div v-if="showCreateFieldModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neues Lernfeld erstellen' : 'Create New Learning Field' }}
            </h3>
            <button @click="showCreateFieldModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <form @submit.prevent="createLearningField" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Lernfeldname' : 'Learning Field Name' }} <span class="text-red-500">*</span>
                </label>
                <input v-model="newLearningField.name" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Hauptfach' : 'Main Subject' }} <span class="text-red-500">*</span>
                </label>
                <select v-model="newLearningField.mainSubjectId" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">{{ language === 'de' ? 'Hauptfach auswählen...' : 'Select main subject...' }}</option>
                  <option v-for="subject in mainSubjects" :key="subject.id" :value="subject.id">{{ subject.name }} ({{ subject.code }})</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Lernfeld-Code' : 'Learning Field Code' }} <span class="text-red-500">*</span>
                </label>
                <input v-model="newLearningField.code" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" :placeholder="codeExample" />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ language === 'de' ? 'Der Code sollte die Abkürzung des Hauptfachs widerspiegeln' : 'The code should reflect the main subject abbreviation' }}
                </p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Stunden pro Woche' : 'Hours per Week' }}
                </label>
                <input v-model.number="newLearningField.weeklyHours" type="number" min="1" max="10" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea v-model="newLearningField.description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
            </div>
            
            <div class="flex items-center">
              <input v-model="newLearningField.isActive" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {{ language === 'de' ? 'Lernfeld ist aktiv' : 'Learning field is active' }}
              </label>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button type="button" @click="showCreateFieldModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 rounded-lg transition-colors">
                {{ language === 'de' ? 'Lernfeld erstellen' : 'Create Learning Field' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  BookOpenCheck, Plus, Info, Check, BookOpen, Target, Users, TrendingUp,
  List, GitBranch, ChevronDown, ChevronRight, Edit3, Trash2, X
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State
const showCreateFieldModal = ref(false)
const viewMode = ref<'list' | 'tree'>('tree')
const expandedSubjects = ref<string[]>(['1', '2'])

// Form data
const newLearningField = ref({
  name: '',
  mainSubjectId: '',
  code: '',
  description: '',
  weeklyHours: 2,
  isActive: true
})

// Mock data
const mainSubjects = ref([
  { id: '1', name: 'Mathematics', code: 'MATH', abbreviation: 'MA' },
  { id: '2', name: 'Science', code: 'SCI', abbreviation: 'SC' },
  { id: '3', name: 'Languages', code: 'LANG', abbreviation: 'LA' },
  { id: '4', name: 'Social Studies', code: 'SOC', abbreviation: 'SS' },
  { id: '5', name: 'Arts', code: 'ART', abbreviation: 'AR' }
])

const learningFields = ref([
  {
    id: '1',
    name: 'Algebra Fundamentals',
    code: 'MA-ALG-01',
    mainSubjectId: '1',
    description: 'Basic algebraic concepts and operations',
    weeklyHours: 3,
    isActive: true
  },
  {
    id: '2',
    name: 'Geometry Basics',
    code: 'MA-GEO-01',
    mainSubjectId: '1',
    description: 'Introduction to geometric shapes and theorems',
    weeklyHours: 2,
    isActive: true
  },
  {
    id: '3',
    name: 'Physics Mechanics',
    code: 'SC-PHY-01',
    mainSubjectId: '2',
    description: 'Classical mechanics and motion',
    weeklyHours: 3,
    isActive: true
  },
  {
    id: '4',
    name: 'Chemistry Basics',
    code: 'SC-CHE-01',
    mainSubjectId: '2',
    description: 'Fundamental chemical principles',
    weeklyHours: 2,
    isActive: true
  }
])

// Examples for introduction
const subjectExamples = computed(() => [
  {
    subject: language.value === 'de' ? 'Mathematik' : 'Mathematics',
    fields: language.value === 'de' 
      ? ['Algebra', 'Geometrie', 'Statistik', 'Kalkül']
      : ['Algebra', 'Geometry', 'Statistics', 'Calculus']
  },
  {
    subject: language.value === 'de' ? 'Naturwissenschaften' : 'Science',
    fields: language.value === 'de'
      ? ['Physik', 'Chemie', 'Biologie', 'Erdkunde']
      : ['Physics', 'Chemistry', 'Biology', 'Earth Science']
  },
  {
    subject: language.value === 'de' ? 'Sprachen' : 'Languages',
    fields: language.value === 'de'
      ? ['Lesen', 'Schreiben', 'Sprechen', 'Hören']
      : ['Reading', 'Writing', 'Speaking', 'Listening']
  }
])

const benefits = computed(() => language.value === 'de' ? [
  {
    title: 'Detaillierte Bewertung',
    description: 'Ermöglicht spezifischere Bewertungen und Feedback'
  },
  {
    title: 'Strukturierter Lehrplan',
    description: 'Bessere Organisation des Unterrichtsstoffs'
  },
  {
    title: 'Gezielte Förderung',
    description: 'Identifikation spezifischer Stärken und Schwächen'
  },
  {
    title: 'Flexible Berichterstattung',
    description: 'Anpassbare Zeugnisse und Berichte'
  }
] : [
  {
    title: 'Detailed Assessment',
    description: 'Enables more specific evaluations and feedback'
  },
  {
    title: 'Structured Curriculum',
    description: 'Better organization of learning content'
  },
  {
    title: 'Targeted Support',
    description: 'Identification of specific strengths and weaknesses'
  },
  {
    title: 'Flexible Reporting',
    description: 'Customizable report cards and documents'
  }
])

// Computed
const affectedClasses = computed(() => 12) // Mock data
const activeAssessments = computed(() => 45) // Mock data

const codeExample = computed(() => {
  if (newLearningField.value.mainSubjectId) {
    const subject = mainSubjects.value.find(s => s.id === newLearningField.value.mainSubjectId)
    return subject ? `${subject.abbreviation}-XXX-01` : ''
  }
  return 'MA-ALG-01'
})

// Methods
const getSubjectLearningFields = (subjectId: string) => {
  return learningFields.value.filter(field => field.mainSubjectId === subjectId)
}

const getMainSubjectName = (subjectId: string) => {
  const subject = mainSubjects.value.find(s => s.id === subjectId)
  return subject ? subject.name : ''
}

const toggleSubject = (subjectId: string) => {
  const index = expandedSubjects.value.indexOf(subjectId)
  if (index > -1) {
    expandedSubjects.value.splice(index, 1)
  } else {
    expandedSubjects.value.push(subjectId)
  }
}

const createLearningField = () => {
  const newField = {
    id: String(learningFields.value.length + 1),
    ...newLearningField.value
  }
  
  learningFields.value.push(newField)
  
  // Reset form
  newLearningField.value = {
    name: '',
    mainSubjectId: '',
    code: '',
    description: '',
    weeklyHours: 2,
    isActive: true
  }
  
  showCreateFieldModal.value = false
}

const editLearningField = (field: any) => {
  console.log('Edit learning field:', field)
  // Implementation for editing
}

const deleteLearningField = (field: any) => {
  if (confirm(language.value === 'de' ? `Lernfeld "${field.name}" löschen?` : `Delete learning field "${field.name}"?`)) {
    const index = learningFields.value.findIndex(f => f.id === field.id)
    if (index > -1) {
      learningFields.value.splice(index, 1)
    }
  }
}

// Auto-generate code based on selected main subject
watch(() => newLearningField.value.mainSubjectId, (newSubjectId) => {
  if (newSubjectId) {
    const subject = mainSubjects.value.find(s => s.id === newSubjectId)
    if (subject) {
      const fieldCount = getSubjectLearningFields(newSubjectId).length + 1
      newLearningField.value.code = `${subject.abbreviation}-XXX-${fieldCount.toString().padStart(2, '0')}`
    }
  }
})
</script> 