<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Erweiterte Bewertung' : 'Advanced Grading & Assessment' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ language === 'de' ? 'Rubrik-basierte Bewertung und Kompetenzanalyse' : 'Rubric-based grading and competency assessment' }}
        </p>
      </div>
      <button @click="showRubricModal = true" class="btn-primary flex items-center">
        <Plus class="h-4 w-4 mr-2" />
        {{ language === 'de' ? 'Neue Rubrik' : 'New Rubric' }}
      </button>
    </div>

    <!-- Assessment Types -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="type in assessmentTypes" :key="type.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover cursor-pointer" @click="selectAssessmentType(type)">
        <div :class="type.iconBg" class="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          <component :is="type.icon" class="h-6 w-6 text-white" />
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white">{{ type.name }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ type.description }}</p>
        <div class="mt-4">
          <span class="text-sm text-gray-500 dark:text-gray-500">{{ type.count }} {{ language === 'de' ? 'aktiv' : 'active' }}</span>
        </div>
      </div>
    </div>

    <!-- Rubric Builder -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Rubrik-Designer' : 'Rubric Designer' }}
        </h2>
        <div class="flex space-x-2">
          <button @click="previewRubric" class="btn-secondary text-sm">
            {{ language === 'de' ? 'Vorschau' : 'Preview' }}
          </button>
          <button @click="saveRubric" class="btn-primary text-sm">
            {{ language === 'de' ? 'Speichern' : 'Save' }}
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Rubric Header -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Rubrik-Name' : 'Rubric Name' }}
            </label>
            <input
              v-model="currentRubric.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Fach' : 'Subject' }}
            </label>
            <select
              v-model="currentRubric.subject"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{{ language === 'de' ? 'Fach wählen' : 'Select Subject' }}</option>
              <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
            </select>
          </div>
        </div>

        <!-- Criteria Builder -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Bewertungskriterien' : 'Assessment Criteria' }}
            </h3>
            <button @click="addCriterion" class="btn-secondary text-sm">
              {{ language === 'de' ? 'Kriterium hinzufügen' : 'Add Criterion' }}
            </button>
          </div>

          <div class="space-y-4">
            <div v-for="(criterion, index) in currentRubric.criteria" :key="index" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-start mb-3">
                <input
                  v-model="criterion.name"
                  type="text"
                  :placeholder="language === 'de' ? 'Kriteriumsname' : 'Criterion name'"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mr-3"
                />
                <button @click="removeCriterion(index)" class="text-red-600 hover:text-red-800">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>

              <!-- Performance Levels -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div v-for="(level, levelIndex) in criterion.levels" :key="levelIndex" class="p-3 bg-white dark:bg-gray-600 rounded border">
                  <input
                    v-model="level.name"
                    type="text"
                    :placeholder="language === 'de' ? 'Level-Name' : 'Level name'"
                    class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    v-model="level.points"
                    type="number"
                    :placeholder="language === 'de' ? 'Punkte' : 'Points'"
                    class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <textarea
                    v-model="level.description"
                    :placeholder="language === 'de' ? 'Beschreibung' : 'Description'"
                    rows="3"
                    class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Competency Assessment -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {{ language === 'de' ? 'Kompetenz-Assessment' : 'Competency Assessment' }}
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Competency Framework -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Kompetenz-Framework' : 'Competency Framework' }}
          </h3>
          <div class="space-y-3">
            <div v-for="competency in competencies" :key="competency.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ competency.name }}</h4>
                <span :class="getCompetencyLevelColor(competency.level)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ competency.level }}
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ competency.description }}</p>
              <div class="mt-2">
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div class="bg-primary-600 h-2 rounded-full" :style="{ width: competency.progress + '%' }"></div>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ competency.progress }}% {{ language === 'de' ? 'erreicht' : 'achieved' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Portfolio Assessment -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Portfolio-Bewertung' : 'Portfolio Assessment' }}
          </h3>
          <div class="space-y-3">
            <div v-for="portfolio in portfolios" :key="portfolio.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <img :src="portfolio.studentAvatar" :alt="portfolio.studentName" class="h-8 w-8 rounded-full object-cover mr-3" />
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ portfolio.studentName }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ portfolio.subject }}</p>
                  </div>
                </div>
                <button @click="reviewPortfolio(portfolio)" class="btn-secondary text-sm">
                  {{ language === 'de' ? 'Bewerten' : 'Review' }}
                </button>
              </div>
              <div class="grid grid-cols-3 gap-2 text-sm">
                <div class="text-center">
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Einträge' : 'Entries' }}</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ portfolio.entries }}</p>
                </div>
                <div class="text-center">
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Bewertungen' : 'Assessments' }}</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ portfolio.assessments }}</p>
                </div>
                <div class="text-center">
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Status' : 'Status' }}</p>
                  <span :class="getPortfolioStatusColor(portfolio.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ portfolio.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Peer Assessment -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Peer-Assessment' : 'Peer Assessment' }}
        </h2>
        <button @click="createPeerAssessment" class="btn-primary text-sm">
          {{ language === 'de' ? 'Neues Peer-Assessment' : 'New Peer Assessment' }}
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Aufgabe' : 'Assignment' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Klasse' : 'Class' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Teilnehmer' : 'Participants' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Fortschritt' : 'Progress' }}
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
            <tr v-for="assessment in peerAssessments" :key="assessment.id" class="border-b border-gray-100 dark:border-gray-700">
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ assessment.title }}</td>
              <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ assessment.class }}</td>
              <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ assessment.participants }}</td>
              <td class="py-3 px-4">
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div class="bg-primary-600 h-2 rounded-full" :style="{ width: assessment.progress + '%' }"></div>
                </div>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ assessment.progress }}%</span>
              </td>
              <td class="py-3 px-4">
                <span :class="getAssessmentStatusColor(assessment.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ assessment.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <button @click="viewPeerAssessment(assessment)" class="text-primary-600 hover:text-primary-800">
                  <Eye class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Rubric Modal -->
    <div v-if="showRubricModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neue Bewertungsrubrik' : 'New Assessment Rubric' }}
            </h3>
            <button @click="showRubricModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <!-- Rubric creation form would go here -->
          <div class="flex justify-end space-x-3">
            <button @click="showRubricModal = false" class="btn-secondary">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button class="btn-primary">
              {{ language === 'de' ? 'Rubrik erstellen' : 'Create Rubric' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Plus, Eye, Trash2, X, CheckSquare, Users, FileText, Award } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = themeStore.language

const showRubricModal = ref(false)

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'German', 'English', 'History']

const assessmentTypes = ref([
  {
    id: 1,
    name: language === 'de' ? 'Rubrik-Bewertung' : 'Rubric Assessment',
    description: language === 'de' ? 'Kriterienbasierte Bewertung' : 'Criteria-based assessment',
    icon: CheckSquare,
    iconBg: 'bg-primary-600',
    count: 12
  },
  {
    id: 2,
    name: language === 'de' ? 'Kompetenz-Assessment' : 'Competency Assessment',
    description: language === 'de' ? 'Fähigkeiten und Kompetenzen bewerten' : 'Assess skills and competencies',
    icon: Award,
    iconBg: 'bg-green-600',
    count: 8
  },
  {
    id: 3,
    name: language === 'de' ? 'Portfolio-Bewertung' : 'Portfolio Assessment',
    description: language === 'de' ? 'Sammlung von Schülerarbeiten' : 'Collection of student work',
    icon: FileText,
    iconBg: 'bg-blue-600',
    count: 15
  },
  {
    id: 4,
    name: language === 'de' ? 'Peer-Assessment' : 'Peer Assessment',
    description: language === 'de' ? 'Schüler bewerten sich gegenseitig' : 'Students assess each other',
    icon: Users,
    iconBg: 'bg-purple-600',
    count: 6
  }
])

const currentRubric = ref({
  name: '',
  subject: '',
  criteria: [
    {
      name: '',
      levels: [
        { name: 'Excellent', points: 4, description: '' },
        { name: 'Good', points: 3, description: '' },
        { name: 'Satisfactory', points: 2, description: '' },
        { name: 'Needs Improvement', points: 1, description: '' }
      ]
    }
  ]
})

const competencies = ref([
  {
    id: 1,
    name: 'Critical Thinking',
    description: 'Ability to analyze and evaluate information',
    level: 'Advanced',
    progress: 85
  },
  {
    id: 2,
    name: 'Communication',
    description: 'Effective verbal and written communication',
    level: 'Proficient',
    progress: 78
  },
  {
    id: 3,
    name: 'Collaboration',
    description: 'Working effectively with others',
    level: 'Developing',
    progress: 65
  }
])

const portfolios = ref([
  {
    id: 1,
    studentName: 'Emma Müller',
    studentAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subject: 'Mathematics',
    entries: 12,
    assessments: 8,
    status: 'Complete'
  },
  {
    id: 2,
    studentName: 'Liam Weber',
    studentAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subject: 'Physics',
    entries: 9,
    assessments: 5,
    status: 'In Progress'
  }
])

const peerAssessments = ref([
  {
    id: 1,
    title: 'Group Project Evaluation',
    class: 'Class 10A',
    participants: 24,
    progress: 75,
    status: 'Active'
  },
  {
    id: 2,
    title: 'Presentation Skills Assessment',
    class: 'Class 11B',
    participants: 18,
    progress: 100,
    status: 'Complete'
  }
])

const selectAssessmentType = (type: any) => {
  console.log('Selected assessment type:', type.name)
}

const addCriterion = () => {
  currentRubric.value.criteria.push({
    name: '',
    levels: [
      { name: 'Excellent', points: 4, description: '' },
      { name: 'Good', points: 3, description: '' },
      { name: 'Satisfactory', points: 2, description: '' },
      { name: 'Needs Improvement', points: 1, description: '' }
    ]
  })
}

const removeCriterion = (index: number) => {
  currentRubric.value.criteria.splice(index, 1)
}

const previewRubric = () => {
  alert(language === 'de' ? 'Rubrik-Vorschau wird angezeigt' : 'Showing rubric preview')
}

const saveRubric = () => {
  alert(language === 'de' ? 'Rubrik gespeichert!' : 'Rubric saved!')
}

const reviewPortfolio = (portfolio: any) => {
  alert(`${language === 'de' ? 'Portfolio bewerten für' : 'Review portfolio for'} ${portfolio.studentName}`)
}

const createPeerAssessment = () => {
  alert(language === 'de' ? 'Neues Peer-Assessment erstellen' : 'Create new peer assessment')
}

const viewPeerAssessment = (assessment: any) => {
  alert(`${language === 'de' ? 'Peer-Assessment anzeigen' : 'View peer assessment'}: ${assessment.title}`)
}

const getCompetencyLevelColor = (level: string) => {
  switch (level) {
    case 'Advanced':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Proficient':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Developing':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getPortfolioStatusColor = (status: string) => {
  switch (status) {
    case 'Complete':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Not Started':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getAssessmentStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Complete':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>
