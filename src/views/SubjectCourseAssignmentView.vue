<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <BookOpen class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Fach- & Kurszuweisung' : 'Subject & Course Assignment' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Fach- und Kurszuweisungen für alle Klassen' : 'Manage subject and course assignments for all classes' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="showBulkAssignmentModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Massenzuweisung' : 'Bulk Assignment' }}
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Users class="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Klassen gesamt' : 'Total Classes' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalClasses }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100 dark:bg-green-900">
              <BookOpen class="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Aktive Fächer' : 'Active Subjects' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalActiveSubjects }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
              <GraduationCap class="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Zuweisungen' : 'Assignments' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalAssignments }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
              <Clock class="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Ausstehend' : 'Pending' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ pendingAssignments }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-winschool-primary text-winschool-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <component :is="tab.icon" class="h-5 w-5 inline mr-2" />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Class Assignments Tab -->
          <div v-if="activeTab === 'classes'" class="space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Klassenzuweisungen' : 'Class Assignments' }}
              </h3>
              <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="language === 'de' ? 'Klassen suchen...' : 'Search classes...'"
                  class="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <select v-model="selectedGrade" class="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">{{ language === 'de' ? 'Alle Jahrgänge' : 'All Grades' }}</option>
                  <option v-for="grade in grades" :key="grade" :value="grade">{{ grade }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div 
                v-for="classData in filteredClasses" 
                :key="classData.id"
                class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                @click="selectClass(classData)"
              >
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                      <Users class="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900 dark:text-white">{{ classData.name }}</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ classData.grade }} {{ language === 'de' ? 'Jahrgang' : 'Grade' }}</p>
                    </div>
                  </div>
                  <span :class="getAssignmentStatusColor(classData.assignmentStatus)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getAssignmentStatusText(classData.assignmentStatus) }}
                  </span>
                </div>

                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Schüler' : 'Students' }}</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ classData.studentCount }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Zugewiesene Fächer' : 'Assigned Subjects' }}</span>
                    <span class="font-medium text-green-600">{{ classData.assignedSubjects }}/{{ classData.totalSubjects }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Klassenleiter' : 'Class Teacher' }}</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ classData.classTeacher }}</span>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="mt-4">
                  <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>{{ language === 'de' ? 'Zuweisungsfortschritt' : 'Assignment Progress' }}</span>
                    <span>{{ classData.progressPercentage }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      :class="getProgressColor(classData.progressPercentage)" 
                      class="h-2 rounded-full transition-all duration-500" 
                      :style="{ width: classData.progressPercentage + '%' }"
                    ></div>
                  </div>
                </div>

                <!-- Quick Actions -->
                <div class="mt-4 flex space-x-2">
                  <button @click.stop="assignSubjects(classData)" class="flex-1 px-3 py-2 text-sm bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 rounded-lg transition-colors font-medium">
                    {{ language === 'de' ? 'Fächer zuweisen' : 'Assign Subjects' }}
                  </button>
                  <button @click.stop="viewDetails(classData)" class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    {{ language === 'de' ? 'Details' : 'Details' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Subjects Management Tab -->
          <div v-if="activeTab === 'subjects'" class="space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Fächerverwaltung' : 'Subjects Management' }}
              </h3>
              <button @click="showAddSubjectModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-2 rounded-lg transition-colors">
                <Plus class="h-4 w-4 inline mr-2" />
                {{ language === 'de' ? 'Fach hinzufügen' : 'Add Subject' }}
              </button>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Fach' : 'Subject' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Typ' : 'Type' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Wochenstunden' : 'Weekly Hours' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Klassen' : 'Classes' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Status' : 'Status' }}
                    </th>
                    <th class="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="subject in subjects" :key="subject.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="py-3 px-4">
                      <div class="flex items-center">
                        <div :class="getSubjectIconColor(subject.category)" class="p-2 rounded-lg mr-3">
                          <BookOpen class="h-4 w-4" />
                        </div>
                        <span class="font-medium text-gray-900 dark:text-white">{{ subject.name }}</span>
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <span :class="getSubjectTypeColor(subject.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ subject.type }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ subject.weeklyHours }}</td>
                    <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ subject.assignedClasses }}</td>
                    <td class="py-3 px-4">
                      <span :class="getStatusColor(subject.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ subject.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex justify-end space-x-2">
                        <button @click="editSubject(subject)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          <Edit class="h-4 w-4" />
                        </button>
                        <button @click="deleteSubject(subject)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                          <Trash2 class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Reports Tab -->
          <div v-if="activeTab === 'reports'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Zuweisungsberichte' : 'Assignment Reports' }}
            </h3>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Assignment Overview -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                  {{ language === 'de' ? 'Zuweisungsübersicht' : 'Assignment Overview' }}
                </h4>
                <div class="space-y-4">
                  <div v-for="(report, index) in assignmentReports" :key="index" class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ report.label }}</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ report.value }}</span>
                  </div>
                </div>
              </div>

              <!-- Subject Distribution -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                  {{ language === 'de' ? 'Fachverteilung' : 'Subject Distribution' }}
                </h4>
                <div class="space-y-3">
                  <div v-for="dist in subjectDistribution" :key="dist.type" class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div :class="dist.color" class="w-3 h-3 rounded-full mr-2"></div>
                      <span class="text-sm text-gray-600 dark:text-gray-400">{{ dist.type }}</span>
                    </div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ dist.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Assignment Modal -->
    <div v-if="showBulkAssignmentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Massenzuweisung' : 'Bulk Assignment' }}
            </h3>
            <button @click="showBulkAssignmentModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- Select Classes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Klassen auswählen' : 'Select Classes' }}
              </label>
              <div class="grid grid-cols-2 gap-3">
                <label v-for="classData in allClasses" :key="classData.id" class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <input 
                    v-model="selectedClassesForBulk" 
                    :value="classData.id" 
                    type="checkbox" 
                    class="mr-3 text-winschool-primary focus:ring-winschool-primary"
                  />
                  <span class="text-sm text-gray-900 dark:text-white">{{ classData.name }}</span>
                </label>
              </div>
            </div>

            <!-- Select Subjects -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Fächer auswählen' : 'Select Subjects' }}
              </label>
              <div class="space-y-2">
                <label v-for="subject in availableSubjects" :key="subject.id" class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div class="flex items-center">
                    <input 
                      v-model="selectedSubjectsForBulk" 
                      :value="subject.id" 
                      type="checkbox" 
                      class="mr-3 text-winschool-primary focus:ring-winschool-primary"
                    />
                    <span class="text-sm text-gray-900 dark:text-white">{{ subject.name }}</span>
                    <span :class="getSubjectTypeColor(subject.type)" class="ml-2 px-2 py-1 text-xs font-medium rounded-full">
                      {{ subject.type }}
                    </span>
                  </div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ subject.weeklyHours }}h</span>
                </label>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button @click="showBulkAssignmentModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button @click="applyBulkAssignment" class="px-4 py-2 text-sm font-medium text-white bg-winschool-primary hover:bg-winschool-primary-dark rounded-lg transition-colors">
              {{ language === 'de' ? 'Zuweisungen anwenden' : 'Apply Assignments' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Subject Modal -->
    <div v-if="showAddSubjectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neues Fach hinzufügen' : 'Add New Subject' }}
            </h3>
            <button @click="showAddSubjectModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveSubject" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Fachname' : 'Subject Name' }}
              </label>
              <input
                v-model="newSubject.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :placeholder="language === 'de' ? 'z.B. Mathematik' : 'e.g. Mathematics'"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Fachtyp' : 'Subject Type' }}
              </label>
              <select
                v-model="newSubject.type"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Typ auswählen' : 'Select Type' }}</option>
                <option value="Core">{{ language === 'de' ? 'Kernfach' : 'Core' }}</option>
                <option value="Elective">{{ language === 'de' ? 'Wahlfach' : 'Elective' }}</option>
                <option value="Optional">{{ language === 'de' ? 'Optional' : 'Optional' }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Wochenstunden' : 'Weekly Hours' }}
              </label>
              <input
                v-model="newSubject.weeklyHours"
                type="number"
                min="1"
                max="10"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="showAddSubjectModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-winschool-primary hover:bg-winschool-primary-dark rounded-lg transition-colors">
                {{ language === 'de' ? 'Fach hinzufügen' : 'Add Subject' }}
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
import { 
  BookOpen, Users, Plus, Clock, GraduationCap, Edit, Trash2, X
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Component state
const activeTab = ref('classes')
const searchQuery = ref('')
const selectedGrade = ref('')
const showBulkAssignmentModal = ref(false)
const showAddSubjectModal = ref(false)
const selectedClassesForBulk = ref<string[]>([])
const selectedSubjectsForBulk = ref<string[]>([])

// Tabs configuration
const tabs = computed(() => [
  { 
    id: 'classes', 
    label: language.value === 'de' ? 'Klassen' : 'Classes', 
    icon: Users 
  },
  { 
    id: 'subjects', 
    label: language.value === 'de' ? 'Fächer' : 'Subjects', 
    icon: BookOpen 
  },
  { 
    id: 'reports', 
    label: language.value === 'de' ? 'Berichte' : 'Reports', 
    icon: Clock 
  }
])

// Mock data
const grades = ['5', '6', '7', '8', '9', '10', '11', '12']

const allClasses = ref([
  {
    id: '1',
    name: '10A',
    grade: '10',
    studentCount: 28,
    assignedSubjects: 8,
    totalSubjects: 12,
    classTeacher: 'Dr. Weber',
    assignmentStatus: 'complete',
    progressPercentage: 67
  },
  {
    id: '2',
    name: '10B',
    grade: '10',
    studentCount: 26,
    assignedSubjects: 6,
    totalSubjects: 12,
    classTeacher: 'Ms. Schmidt',
    assignmentStatus: 'in-progress',
    progressPercentage: 50
  },
  {
    id: '3',
    name: '11A',
    grade: '11',
    studentCount: 24,
    assignedSubjects: 10,
    totalSubjects: 14,
    classTeacher: 'Prof. Mueller',
    assignmentStatus: 'complete',
    progressPercentage: 71
  },
  {
    id: '4',
    name: '11B',
    grade: '11',
    studentCount: 22,
    assignedSubjects: 4,
    totalSubjects: 14,
    classTeacher: 'Dr. Fischer',
    assignmentStatus: 'pending',
    progressPercentage: 29
  }
])

const subjects = ref([
  {
    id: '1',
    name: 'Mathematics',
    type: 'Core',
    category: 'science',
    weeklyHours: 5,
    assignedClasses: 4,
    status: 'Active'
  },
  {
    id: '2',
    name: 'Physics',
    type: 'Core',
    category: 'science',
    weeklyHours: 4,
    assignedClasses: 3,
    status: 'Active'
  },
  {
    id: '3',
    name: 'Art',
    type: 'Elective',
    category: 'arts',
    weeklyHours: 2,
    assignedClasses: 2,
    status: 'Active'
  },
  {
    id: '4',
    name: 'Music',
    type: 'Optional',
    category: 'arts',
    weeklyHours: 2,
    assignedClasses: 1,
    status: 'Pending'
  }
])

const availableSubjects = computed(() => subjects.value)

const newSubject = ref({
  name: '',
  type: '',
  weeklyHours: 1
})

// Computed properties
const filteredClasses = computed(() => {
  let filtered = allClasses.value

  if (searchQuery.value) {
    const searchLower = searchQuery.value.toLowerCase()
    filtered = filtered.filter(classData => 
      classData.name.toLowerCase().includes(searchLower) ||
      classData.classTeacher.toLowerCase().includes(searchLower)
    )
  }

  if (selectedGrade.value) {
    filtered = filtered.filter(classData => classData.grade === selectedGrade.value)
  }

  return filtered
})

const totalClasses = computed(() => allClasses.value.length)
const totalActiveSubjects = computed(() => subjects.value.filter(s => s.status === 'Active').length)
const totalAssignments = computed(() => 
  allClasses.value.reduce((sum, cls) => sum + cls.assignedSubjects, 0)
)
const pendingAssignments = computed(() => 
  allClasses.value.filter(cls => cls.assignmentStatus === 'pending').length
)

const assignmentReports = computed(() => [
  { 
    label: language.value === 'de' ? 'Vollständig zugewiesene Klassen' : 'Fully Assigned Classes',
    value: allClasses.value.filter(c => c.assignmentStatus === 'complete').length
  },
  { 
    label: language.value === 'de' ? 'In Bearbeitung' : 'In Progress',
    value: allClasses.value.filter(c => c.assignmentStatus === 'in-progress').length
  },
  { 
    label: language.value === 'de' ? 'Ausstehend' : 'Pending',
    value: allClasses.value.filter(c => c.assignmentStatus === 'pending').length
  },
  { 
    label: language.value === 'de' ? 'Durchschnittliche Stunden/Woche' : 'Average Hours/Week',
    value: Math.round(subjects.value.reduce((sum, s) => sum + s.weeklyHours, 0) / subjects.value.length)
  }
])

const subjectDistribution = computed(() => [
  { 
    type: language.value === 'de' ? 'Kernfächer' : 'Core Subjects',
    count: subjects.value.filter(s => s.type === 'Core').length,
    color: 'bg-blue-500'
  },
  { 
    type: language.value === 'de' ? 'Wahlfächer' : 'Elective Subjects',
    count: subjects.value.filter(s => s.type === 'Elective').length,
    color: 'bg-green-500'
  },
  { 
    type: language.value === 'de' ? 'Optionale Fächer' : 'Optional Subjects',
    count: subjects.value.filter(s => s.type === 'Optional').length,
    color: 'bg-purple-500'
  }
])

// Methods
const selectClass = (classData: any) => {
  // Navigate to class detail or show assignment modal
  console.log('Selected class:', classData)
}

const assignSubjects = (classData: any) => {
  // Show assignment modal for specific class
  console.log('Assign subjects to:', classData)
}

const viewDetails = (classData: any) => {
  // Show detailed view
  console.log('View details for:', classData)
}

const applyBulkAssignment = () => {
  // Apply bulk assignments
  showBulkAssignmentModal.value = false
  selectedClassesForBulk.value = []
  selectedSubjectsForBulk.value = []
  alert(language.value === 'de' ? 'Zuweisungen erfolgreich angewendet!' : 'Assignments applied successfully!')
}

const saveSubject = () => {
  // Add new subject
  subjects.value.push({
    id: String(subjects.value.length + 1),
    name: newSubject.value.name,
    type: newSubject.value.type,
    category: 'general',
    weeklyHours: newSubject.value.weeklyHours,
    assignedClasses: 0,
    status: 'Active'
  })
  
  showAddSubjectModal.value = false
  newSubject.value = { name: '', type: '', weeklyHours: 1 }
  alert(language.value === 'de' ? 'Fach erfolgreich hinzugefügt!' : 'Subject added successfully!')
}

const editSubject = (subject: any) => {
  console.log('Edit subject:', subject)
}

const deleteSubject = (subject: any) => {
  if (confirm(language.value === 'de' ? `Fach "${subject.name}" löschen?` : `Delete subject "${subject.name}"?`)) {
    const index = subjects.value.findIndex(s => s.id === subject.id)
    if (index > -1) {
      subjects.value.splice(index, 1)
    }
  }
}

const getAssignmentStatusColor = (status: string) => {
  switch (status) {
    case 'complete':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'pending':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getAssignmentStatusText = (status: string) => {
  const statusTexts = {
    complete: language.value === 'de' ? 'Vollständig' : 'Complete',
    'in-progress': language.value === 'de' ? 'In Arbeit' : 'In Progress',
    pending: language.value === 'de' ? 'Ausstehend' : 'Pending'
  }
  return statusTexts[status as keyof typeof statusTexts] || status
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return 'bg-green-500'
  if (percentage >= 60) return 'bg-blue-500'
  if (percentage >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getSubjectTypeColor = (type: string) => {
  switch (type) {
    case 'Core':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Elective':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Optional':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getSubjectIconColor = (category: string) => {
  switch (category) {
    case 'science':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
    case 'arts':
      return 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
    case 'languages':
      return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script> 