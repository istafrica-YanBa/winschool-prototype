<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Zeugnis-Vorlagen' : 'Report Card Templates' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ language === 'de' ? 'Verwalten Sie Zeugnis-Layouts und Bewertungsformate' : 'Manage report card layouts and grading formats' }}
        </p>
      </div>
      <button @click="showTemplateModal = true" class="btn-primary flex items-center">
        <Plus class="h-4 w-4 mr-2" />
        {{ language === 'de' ? 'Neue Vorlage' : 'New Template' }}
      </button>
    </div>

    <!-- Template Categories -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex space-x-4 mb-6">
        <button
          v-for="category in templateCategories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            selectedCategory === category
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Templates Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="template in filteredTemplates" :key="template.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ template.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ template.schoolType }}</p>
          </div>
          <span :class="getTemplateStatusColor(template.status)" class="px-2 py-1 text-xs font-medium rounded-full">
            {{ template.status }}
          </span>
        </div>

        <!-- Template Preview -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 min-h-[200px] border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div class="text-center text-gray-500 dark:text-gray-400">
            <FileText class="h-12 w-12 mx-auto mb-2" />
            <p class="text-sm">{{ language === 'de' ? 'Vorschau' : 'Preview' }}</p>
            <p class="text-xs mt-1">{{ template.format }}</p>
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Klassenstufen' : 'Grade Levels' }}</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ template.gradeLevels.join(', ') }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Bewertungstyp' : 'Grading Type' }}</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ template.gradingType }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Letzte Änderung' : 'Last Modified' }}</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ template.lastModified }}</span>
          </div>
        </div>

        <div class="flex space-x-2">
          <button @click="previewTemplate(template)" class="flex-1 px-3 py-2 text-sm bg-primary-100 text-primary-800 rounded-lg hover:bg-primary-200 transition-colors">
            {{ language === 'de' ? 'Vorschau' : 'Preview' }}
          </button>
          <button @click="editTemplate(template)" class="px-3 py-2 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
            <Edit class="h-4 w-4" />
          </button>
          <button @click="duplicateTemplate(template)" class="px-3 py-2 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
            <Copy class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Template Configuration -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {{ language === 'de' ? 'Vorlagen-Konfiguration' : 'Template Configuration' }}
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Grading Scales -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Bewertungsskalen' : 'Grading Scales' }}
          </h3>
          <div class="space-y-3">
            <div v-for="scale in gradingScales" :key="scale.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ scale.name }}</h4>
                <button @click="editGradingScale(scale)" class="text-primary-600 hover:text-primary-800">
                  <Edit class="h-4 w-4" />
                </button>
              </div>
              <div class="flex space-x-2">
                <span v-for="grade in scale.grades" :key="grade" class="px-2 py-1 text-xs bg-white dark:bg-gray-600 rounded">
                  {{ grade }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Comment Templates -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Kommentar-Vorlagen' : 'Comment Templates' }}
          </h3>
          <div class="space-y-3">
            <div v-for="comment in commentTemplates" :key="comment.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ comment.category }}</h4>
                <button @click="editCommentTemplate(comment)" class="text-primary-600 hover:text-primary-800">
                  <Edit class="h-4 w-4" />
                </button>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ comment.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Template Modal -->
    <div v-if="showTemplateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neue Zeugnis-Vorlage' : 'New Report Card Template' }}
            </h3>
            <button @click="showTemplateModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="createTemplate" class="space-y-6">
            <!-- Basic Information -->
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Grundinformationen' : 'Basic Information' }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Vorlagenname' : 'Template Name' }}
                  </label>
                  <input
                    v-model="templateForm.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Schultyp' : 'School Type' }}
                  </label>
                  <select
                    v-model="templateForm.schoolType"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">{{ language === 'de' ? 'Wählen' : 'Select' }}</option>
                    <option value="Grundschule">{{ language === 'de' ? 'Grundschule' : 'Primary School' }}</option>
                    <option value="Gymnasium">Gymnasium</option>
                    <option value="Realschule">Realschule</option>
                    <option value="Hauptschule">Hauptschule</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Grade Levels -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Klassenstufen' : 'Grade Levels' }}
              </label>
              <div class="grid grid-cols-3 gap-2">
                <label v-for="grade in availableGrades" :key="grade" class="flex items-center">
                  <input
                    v-model="templateForm.gradeLevels"
                    type="checkbox"
                    :value="grade"
                    class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
                  />
                  <span class="text-sm text-gray-900 dark:text-white">{{ grade }}</span>
                </label>
              </div>
            </div>

            <!-- Grading Configuration -->
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Bewertungskonfiguration' : 'Grading Configuration' }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Bewertungstyp' : 'Grading Type' }}
                  </label>
                  <select
                    v-model="templateForm.gradingType"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">{{ language === 'de' ? 'Wählen' : 'Select' }}</option>
                    <option value="Noten">{{ language === 'de' ? 'Noten (1-6)' : 'Grades (1-6)' }}</option>
                    <option value="Punkte">{{ language === 'de' ? 'Punkte (0-15)' : 'Points (0-15)' }}</option>
                    <option value="Buchstaben">{{ language === 'de' ? 'Buchstaben (A-F)' : 'Letters (A-F)' }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Format' : 'Format' }}
                  </label>
                  <select
                    v-model="templateForm.format"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="A4 Portrait">A4 Portrait</option>
                    <option value="A4 Landscape">A4 Landscape</option>
                    <option value="Letter">Letter</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Template Features -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Vorlagen-Features' : 'Template Features' }}
              </label>
              <div class="grid grid-cols-2 gap-2">
                <label v-for="feature in templateFeatures" :key="feature" class="flex items-center">
                  <input
                    v-model="templateForm.features"
                    type="checkbox"
                    :value="feature"
                    class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
                  />
                  <span class="text-sm text-gray-900 dark:text-white">{{ feature }}</span>
                </label>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showTemplateModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Vorlage erstellen' : 'Create Template' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreviewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Zeugnis-Vorschau' : 'Report Card Preview' }}
            </h3>
            <button @click="showPreviewModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <!-- Mock Report Card -->
          <div class="bg-white border-2 border-gray-300 p-8 mx-auto" style="width: 210mm; min-height: 297mm;">
            <div class="text-center mb-8">
              <h1 class="text-2xl font-bold text-gray-900">{{ language === 'de' ? 'ZEUGNIS' : 'REPORT CARD' }}</h1>
              <p class="text-gray-600">{{ language === 'de' ? 'Gymnasium Berlin-Mitte' : 'Berlin-Mitte Gymnasium' }}</p>
              <p class="text-gray-600">{{ language === 'de' ? 'Schuljahr 2023/2024' : 'School Year 2023/2024' }}</p>
            </div>

            <div class="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">{{ language === 'de' ? 'Schüler/in' : 'Student' }}</h3>
                <p>Max Mustermann</p>
                <p>{{ language === 'de' ? 'Klasse: 10A' : 'Class: 10A' }}</p>
                <p>{{ language === 'de' ? 'Geboren am: 15.03.2008' : 'Born: March 15, 2008' }}</p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">{{ language === 'de' ? 'Zeugnis-Informationen' : 'Report Information' }}</h3>
                <p>{{ language === 'de' ? 'Halbjahreszeugnis' : 'Mid-Year Report' }}</p>
                <p>{{ language === 'de' ? 'Ausstellungsdatum: 31.01.2024' : 'Issue Date: January 31, 2024' }}</p>
              </div>
            </div>

            <table class="w-full border-collapse border border-gray-300 mb-8">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 p-2 text-left">{{ language === 'de' ? 'Fach' : 'Subject' }}</th>
                  <th class="border border-gray-300 p-2 text-center">{{ language === 'de' ? 'Note' : 'Grade' }}</th>
                  <th class="border border-gray-300 p-2 text-left">{{ language === 'de' ? 'Bemerkungen' : 'Comments' }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="subject in mockGrades" :key="subject.name">
                  <td class="border border-gray-300 p-2">{{ subject.name }}</td>
                  <td class="border border-gray-300 p-2 text-center font-semibold">{{ subject.grade }}</td>
                  <td class="border border-gray-300 p-2">{{ subject.comment }}</td>
                </tr>
              </tbody>
            </table>

            <div class="mt-8">
              <p class="text-sm text-gray-600 mb-4">
                {{ language === 'de' ? 'Allgemeine Bemerkungen:' : 'General Comments:' }}
              </p>
              <p class="text-sm">
                {{ language === 'de' 
                  ? 'Max zeigt durchweg gute Leistungen und ist ein engagierter Schüler. Besonders in den naturwissenschaftlichen Fächern zeigt er großes Interesse und Talent.'
                  : 'Max consistently shows good performance and is an engaged student. He shows particular interest and talent in science subjects.'
                }}
              </p>
            </div>

            <div class="flex justify-between mt-12">
              <div class="text-center">
                <div class="border-t border-gray-400 w-48 mb-2"></div>
                <p class="text-sm">{{ language === 'de' ? 'Klassenlehrer/in' : 'Class Teacher' }}</p>
              </div>
              <div class="text-center">
                <div class="border-t border-gray-400 w-48 mb-2"></div>
                <p class="text-sm">{{ language === 'de' ? 'Schulleiter/in' : 'Principal' }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showPreviewModal = false" class="btn-secondary">
              {{ language === 'de' ? 'Schließen' : 'Close' }}
            </button>
            <button class="btn-primary">
              {{ language === 'de' ? 'Als PDF exportieren' : 'Export as PDF' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Plus, Edit, Copy, FileText, X } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showTemplateModal = ref(false)
const showPreviewModal = ref(false)
const selectedCategory = ref('All Templates')

const templateCategories = ['All Templates', 'Primary School', 'Secondary School', 'Gymnasium', 'Custom']

const templateForm = ref({
  name: '',
  schoolType: '',
  gradeLevels: [] as string[],
  gradingType: '',
  format: 'A4 Portrait',
  features: [] as string[]
})

const availableGrades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']

const templateFeatures = [
  language.value === 'de' ? 'Anwesenheit' : 'Attendance',
  language.value === 'de' ? 'Verhalten' : 'Behavior',
  language.value === 'de' ? 'Kommentare' : 'Comments',
  language.value === 'de' ? 'Unterschriften' : 'Signatures',
  language.value === 'de' ? 'Schullogo' : 'School Logo',
  language.value === 'de' ? 'Notenskala' : 'Grade Scale'
]

const reportTemplates = ref([
  {
    id: 1,
    name: 'Standard Gymnasium Template',
    schoolType: 'Gymnasium',
    gradeLevels: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    gradingType: 'Punkte (0-15)',
    format: 'A4 Portrait',
    status: 'Active',
    lastModified: '2024-03-10',
    category: 'Gymnasium'
  },
  {
    id: 2,
    name: 'Primary School Report',
    schoolType: 'Grundschule',
    gradeLevels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'],
    gradingType: 'Noten (1-6)',
    format: 'A4 Portrait',
    status: 'Active',
    lastModified: '2024-03-08',
    category: 'Primary School'
  },
  {
    id: 3,
    name: 'Realschule Mid-Year',
    schoolType: 'Realschule',
    gradeLevels: ['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
    gradingType: 'Noten (1-6)',
    format: 'A4 Portrait',
    status: 'Draft',
    lastModified: '2024-03-05',
    category: 'Secondary School'
  }
])

const gradingScales = ref([
  {
    id: 1,
    name: 'German Standard (1-6)',
    grades: ['1 (sehr gut)', '2 (gut)', '3 (befriedigend)', '4 (ausreichend)', '5 (mangelhaft)', '6 (ungenügend)']
  },
  {
    id: 2,
    name: 'Points System (0-15)',
    grades: ['15-13 (sehr gut)', '12-10 (gut)', '9-7 (befriedigend)', '6-4 (ausreichend)', '3-1 (mangelhaft)', '0 (ungenügend)']
  },
  {
    id: 3,
    name: 'Letter Grades (A-F)',
    grades: ['A (excellent)', 'B (good)', 'C (satisfactory)', 'D (sufficient)', 'E (poor)', 'F (fail)']
  }
])

const commentTemplates = ref([
  {
    id: 1,
    category: 'Positive Performance',
    text: 'Shows excellent understanding and consistent effort in all areas.'
  },
  {
    id: 2,
    category: 'Needs Improvement',
    text: 'Would benefit from additional practice and more consistent homework completion.'
  },
  {
    id: 3,
    category: 'Behavior',
    text: 'Demonstrates good social skills and positive classroom behavior.'
  }
])

const mockGrades = [
  { name: 'Mathematics', grade: '2', comment: 'Good analytical skills' },
  { name: 'German', grade: '1', comment: 'Excellent writing ability' },
  { name: 'English', grade: '2', comment: 'Strong oral participation' },
  { name: 'Physics', grade: '1', comment: 'Outstanding problem solving' },
  { name: 'Chemistry', grade: '2', comment: 'Good laboratory work' },
  { name: 'History', grade: '2', comment: 'Thoughtful analysis' }
]

const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'All Templates') return reportTemplates.value
  return reportTemplates.value.filter(template => template.category === selectedCategory.value)
})

const createTemplate = () => {
  reportTemplates.value.push({
    id: reportTemplates.value.length + 1,
    ...templateForm.value,
    status: 'Draft',
    lastModified: new Date().toISOString().split('T')[0],
    category: templateForm.value.schoolType === 'Grundschule' ? 'Primary School' : 'Secondary School'
  })
  
  showTemplateModal.value = false
  templateForm.value = {
    name: '',
    schoolType: '',
    gradeLevels: [],
    gradingType: '',
    format: 'A4 Portrait',
    features: []
  }
}

const previewTemplate = (template: any) => {
  showPreviewModal.value = true
}

const editTemplate = (template: any) => {
  alert(`${language.value === 'de' ? 'Vorlage bearbeiten' : 'Edit template'}: ${template.name}`)
}

const duplicateTemplate = (template: any) => {
  const newTemplate = {
    ...template,
    id: reportTemplates.value.length + 1,
    name: `${template.name} (Copy)`,
    status: 'Draft',
    lastModified: new Date().toISOString().split('T')[0]
  }
  reportTemplates.value.push(newTemplate)
}

const editGradingScale = (scale: any) => {
  alert(`${language.value === 'de' ? 'Bewertungsskala bearbeiten' : 'Edit grading scale'}: ${scale.name}`)
}

const editCommentTemplate = (comment: any) => {
  alert(`${language.value === 'de' ? 'Kommentar-Vorlage bearbeiten' : 'Edit comment template'}: ${comment.category}`)
}

const getTemplateStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Archived':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>
