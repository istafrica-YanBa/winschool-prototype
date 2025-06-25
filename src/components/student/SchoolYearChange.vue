<template>
  <div class="space-y-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      {{ language === 'de' ? 'Schuljahreswechsel' : 'School Year Change' }}
    </h3>
    <p class="text-gray-600 dark:text-gray-400">
      {{ language === 'de' 
        ? 'Führen Sie einen Schuljahreswechsel durch, um Schüler zu versetzen und Daten zu aktualisieren.' 
        : 'Perform a school year change to promote students and update data.' }}
    </p>

    <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <div class="flex items-start">
        <AlertTriangle class="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
        <p class="text-sm text-yellow-600 dark:text-yellow-300">
          {{ language === 'de' 
            ? 'Diese Aktion betrifft alle ausgewählten Schüler und kann nicht rückgängig gemacht werden. Bitte stellen Sie sicher, dass Sie ein Backup haben, bevor Sie fortfahren.' 
            : 'This action will affect all selected students and cannot be undone. Please ensure you have a backup before proceeding.' }}
        </p>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
      <!-- Current and Target Year Selection -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Aktuelles Schuljahr' : 'Current School Year' }}
          </h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Schuljahr' : 'School Year' }}*
              </label>
              <select 
                v-model="formData.currentYear" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Schuljahr wählen' : 'Select School Year' }}</option>
                <option v-for="year in schoolYears" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Semester' : 'Semester' }}*
              </label>
              <select 
                v-model="formData.currentSemester" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Semester wählen' : 'Select Semester' }}</option>
                <option value="I">I</option>
                <option value="II">II</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Ziel-Schuljahr' : 'Target School Year' }}
          </h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Schuljahr' : 'School Year' }}*
              </label>
              <select 
                v-model="formData.targetYear" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Schuljahr wählen' : 'Select School Year' }}</option>
                <option v-for="year in schoolYears" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Semester' : 'Semester' }}*
              </label>
              <select 
                v-model="formData.targetSemester" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Semester wählen' : 'Select Semester' }}</option>
                <option value="I">I</option>
                <option value="II">II</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Class Selection -->
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white mb-4">
          {{ language === 'de' ? 'Klassenauswahl' : 'Class Selection' }}
        </h4>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Klassengruppe' : 'Class Group' }}*
            </label>
            <select 
              v-model="formData.classGroup" 
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{{ language === 'de' ? 'Klassengruppe wählen' : 'Select Class Group' }}</option>
              <option v-for="group in classGroups" :key="group" :value="group">{{ group }}</option>
            </select>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Aktuelle Klassenstufe' : 'Current Grade Level' }}
              </label>
              <input 
                v-model="formData.currentGradeLevel" 
                type="text" 
                disabled
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white opacity-75 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Ziel-Klassenstufe' : 'Target Grade Level' }}
              </label>
              <input 
                v-model="formData.targetGradeLevel" 
                type="text" 
                disabled
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white opacity-75 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Options -->
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white mb-4">
          {{ language === 'de' ? 'Optionen' : 'Options' }}
        </h4>
        <div class="space-y-3">
          <label class="flex items-center">
            <input 
              v-model="formData.increaseGradeLevel" 
              type="checkbox" 
              class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
            />
            <span class="text-sm text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Klassenstufe erhöhen' : 'Increase grade level' }}
            </span>
          </label>
          <label class="flex items-center">
            <input 
              v-model="formData.applyClassTimetable" 
              type="checkbox" 
              class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
            />
            <span class="text-sm text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Stundenplan anwenden' : 'Apply class timetable' }}
            </span>
          </label>
          <label class="flex items-center">
            <input 
              v-model="formData.ignoreRepeaters" 
              type="checkbox" 
              class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
            />
            <span class="text-sm text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Wiederholer ignorieren' : 'Ignore repeaters' }}
            </span>
          </label>
          <label class="flex items-center">
            <input 
              v-model="formData.onlyChangeSemester" 
              type="checkbox" 
              class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
            />
            <span class="text-sm text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Nur Semester/Jahr ändern (keine Versetzung)' : 'Only change semester/year (no promotion)' }}
            </span>
          </label>
        </div>
      </div>

      <!-- Affected Students -->
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white mb-4">
          {{ language === 'de' ? 'Betroffene Schüler' : 'Affected Students' }}
        </h4>
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p class="text-gray-600 dark:text-gray-400">
            {{ language === 'de' 
              ? `${affectedStudents} Schüler werden von dieser Aktion betroffen sein.` 
              : `${affectedStudents} students will be affected by this action.` }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button @click="$emit('cancel')" class="btn-secondary">
        {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
      </button>
      <button @click="showConfirmation = true" class="btn-primary">
        {{ language === 'de' ? 'Schuljahreswechsel durchführen' : 'Perform School Year Change' }}
      </button>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Bestätigung erforderlich' : 'Confirmation Required' }}
            </h3>
            <button @click="showConfirmation = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
            <div class="flex items-start">
              <AlertTriangle class="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <p class="text-sm text-yellow-600 dark:text-yellow-300">
                {{ language === 'de' 
                  ? 'Sie sind dabei, einen Schuljahreswechsel durchzuführen. Diese Aktion kann nicht rückgängig gemacht werden.' 
                  : 'You are about to perform a school year change. This action cannot be undone.' }}
              </p>
            </div>
          </div>
          
          <div class="space-y-4">
            <p class="text-gray-600 dark:text-gray-400">
              {{ language === 'de' 
                ? `${affectedStudents} Schüler werden von ${formData.currentYear} ${formData.currentSemester} nach ${formData.targetYear} ${formData.targetSemester} versetzt.` 
                : `${affectedStudents} students will be promoted from ${formData.currentYear} ${formData.currentSemester} to ${formData.targetYear} ${formData.targetSemester}.` }}
            </p>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Bestätigungscode eingeben' : 'Enter confirmation code' }}
              </label>
              <input 
                v-model="confirmationCode"
                type="text"
                :placeholder="language === 'de' ? 'BESTÄTIGEN' : 'CONFIRM'"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showConfirmation = false" class="btn-secondary">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button 
              @click="confirmSchoolYearChange"
              :disabled="confirmationCode !== confirmationRequired"
              :class="confirmationCode !== confirmationRequired ? 'opacity-50 cursor-not-allowed' : ''"
              class="btn-danger bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              {{ language === 'de' ? 'Bestätigen' : 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { AlertTriangle, X } from 'lucide-vue-next'

const props = defineProps({
  affectedStudents: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['submit', 'cancel'])

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const schoolYears = [
  '2023/24',
  '2024/25',
  '2025/26',
  '2026/27'
]

const classGroups = [
  'All Classes',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12'
]

const formData = ref({
  currentYear: '2023/24',
  currentSemester: 'II',
  targetYear: '2024/25',
  targetSemester: 'I',
  classGroup: '',
  currentGradeLevel: '',
  targetGradeLevel: '',
  increaseGradeLevel: true,
  applyClassTimetable: true,
  ignoreRepeaters: true,
  onlyChangeSemester: false
})

const showConfirmation = ref(false)
const confirmationCode = ref('')
const confirmationRequired = computed(() => language.value === 'de' ? 'BESTÄTIGEN' : 'CONFIRM')

const confirmSchoolYearChange = () => {
  if (confirmationCode.value === confirmationRequired.value) {
    emit('submit', formData.value)
    showConfirmation.value = false
  }
}
</script>