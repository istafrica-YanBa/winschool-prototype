<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Lehrplan-Mapping' : 'Curriculum Mapping' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ language === 'de' ? 'Standards-Alignment und Lernziel-Verfolgung' : 'Standards alignment and learning objectives tracking' }}
        </p>
      </div>
      <button @click="showMappingModal = true" class="btn-primary flex items-center">
        <Plus class="h-4 w-4 mr-2" />
        {{ language === 'de' ? 'Neues Mapping' : 'New Mapping' }}
      </button>
    </div>

    <!-- Standards Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="standard in educationStandards" :key="standard.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <div :class="standard.iconBg" class="w-12 h-12 rounded-lg flex items-center justify-center">
            <component :is="standard.icon" class="h-6 w-6 text-white" />
          </div>
          <span :class="getComplianceColor(standard.compliance)" class="px-2 py-1 text-xs font-medium rounded-full">
            {{ standard.compliance }}%
          </span>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white">{{ standard.name }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ standard.description }}</p>
        <div class="mt-4">
          <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div class="bg-primary-600 h-2 rounded-full" :style="{ width: standard.compliance + '%' }"></div>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ standard.mappedObjectives }}/{{ standard.totalObjectives }} {{ language === 'de' ? 'Ziele zugeordnet' : 'objectives mapped' }}</p>
        </div>
      </div>
    </div>

    <!-- Curriculum Mapping Matrix -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Lehrplan-Matrix' : 'Curriculum Matrix' }}
        </h2>
        <div class="flex space-x-2">
          <select v-model="selectedGrade" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">{{ language === 'de' ? 'Alle Klassenstufen' : 'All Grade Levels' }}</option>
            <option v-for="grade in gradeLevels" :key="grade" :value="grade">{{ grade }}</option>
          </select>
          <select v-model="selectedSubject" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">{{ language === 'de' ? 'Alle Fächer' : 'All Subjects' }}</option>
            <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
          </select>
          <button @click="exportMatrix" class="btn-secondary text-sm">
            {{ language === 'de' ? 'Exportieren' : 'Export' }}
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Lernziel' : 'Learning Objective' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Standard' : 'Standard' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Fach' : 'Subject' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Klassenstufe' : 'Grade Level' }}
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
            <tr v-for="objective in filteredObjectives" :key="objective.id" class="border-b border-gray-100 dark:border-gray-700">
              <td class="py-3 px-4">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ objective.title }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ objective.description }}</p>
                </div>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                  {{ objective.standard }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-white">{{ objective.subject }}</td>
              <td class="py-3 px-4 text-gray-900 dark:text-white">{{ objective.gradeLevel }}</td>
              <td class="py-3 px-4">
                <span :class="getObjectiveStatusColor(objective.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ objective.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="editObjective(objective)" class="text-primary-600 hover:text-primary-800">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="viewConnections(objective)" class="text-secondary-600 hover:text-secondary-800">
                    <Link class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Cross-Curricular Connections -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {{ language === 'de' ? 'Fächerübergreifende Verbindungen' : 'Cross-Curricular Connections' }}
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Connection Map -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Verbindungskarte' : 'Connection Map' }}
          </h3>
          <div class="space-y-4">
            <div v-for="connection in crossCurricularConnections" :key="connection.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-start mb-3">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ connection.title }}</h4>
                <span :class="getConnectionStrengthColor(connection.strength)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ connection.strength }}
                </span>
              </div>
              <div class="flex items-center space-x-2 mb-2">
                <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                  {{ connection.subject1 }}
                </span>
                <ArrowRight class="h-4 w-4 text-gray-400" />
                <span class="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                  {{ connection.subject2 }}
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ connection.description }}</p>
              <div class="flex justify-between items-center mt-3">
                <span class="text-xs text-gray-500 dark:text-gray-500">{{ connection.gradeLevel }}</span>
                <button @click="exploreConnection(connection)" class="text-primary-600 hover:text-primary-800 text-sm">
                  {{ language === 'de' ? 'Erkunden' : 'Explore' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Standards Compliance Report -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Standards-Compliance-Bericht' : 'Standards Compliance Report' }}
          </h3>
          <div class="space-y-4">
            <div v-for="report in complianceReports" :key="report.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-center mb-3">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ report.standardName }}</h4>
                <span :class="getComplianceStatusColor(report.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ report.status }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Erfüllt' : 'Met' }}</p>
                  <p class="font-medium text-green-600">{{ report.metObjectives }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Ausstehend' : 'Pending' }}</p>
                  <p class="font-medium text-yellow-600">{{ report.pendingObjectives }}</p>
                </div>
              </div>
              <div class="mt-3">
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" :style="{ width: (report.metObjectives / (report.metObjectives + report.pendingObjectives) * 100) + '%' }"></div>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {{ Math.round(report.metObjectives / (report.metObjectives + report.pendingObjectives) * 100) }}% {{ language === 'de' ? 'abgeschlossen' : 'complete' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Learning Objectives Tracker -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Lernziel-Tracker' : 'Learning Objectives Tracker' }}
        </h2>
        <button @click="addObjective" class="btn-primary text-sm">
          {{ language === 'de' ? 'Ziel hinzufügen' : 'Add Objective' }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Objective Progress -->
        <div class="lg:col-span-2">
          <div class="space-y-4">
            <div v-for="tracker in objectiveTrackers" :key="tracker.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">{{ tracker.objective }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ tracker.subject }} - {{ tracker.gradeLevel }}</p>
                </div>
                <span :class="getProgressStatusColor(tracker.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ tracker.status }}
                </span>
              </div>
              
              <div class="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Fortschritt' : 'Progress' }}</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ tracker.progress }}%</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Schüler erreicht' : 'Students Achieved' }}</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ tracker.studentsAchieved }}/{{ tracker.totalStudents }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Zieldatum' : 'Target Date' }}</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ tracker.targetDate }}</p>
                </div>
              </div>
              
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-3">
                <div class="bg-primary-600 h-2 rounded-full" :style="{ width: tracker.progress + '%' }"></div>
              </div>
              
              <div class="flex space-x-2">
                <button @click="updateProgress(tracker)" class="btn-primary text-sm">
                  {{ language === 'de' ? 'Fortschritt aktualisieren' : 'Update Progress' }}
                </button>
                <button @click="viewDetails(tracker)" class="btn-secondary text-sm">
                  {{ language === 'de' ? 'Details' : 'Details' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Milestone Calendar -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Meilenstein-Kalender' : 'Milestone Calendar' }}
          </h3>
          <div class="space-y-3">
            <div v-for="milestone in upcomingMilestones" :key="milestone.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ milestone.title }}</h4>
                <span class="text-xs text-gray-500 dark:text-gray-500">{{ milestone.date }}</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ milestone.description }}</p>
              <div class="flex justify-between items-center mt-2">
                <span :class="getMilestoneTypeColor(milestone.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ milestone.type }}
                </span>
                <span :class="milestone.urgent ? 'text-red-600' : 'text-gray-500'" class="text-xs">
                  {{ milestone.urgent ? (language === 'de' ? 'Dringend' : 'Urgent') : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mapping Modal -->
    <div v-if="showMappingModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neues Curriculum-Mapping' : 'New Curriculum Mapping' }}
            </h3>
            <button @click="showMappingModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <!-- Mapping form would go here -->
          <div class="flex justify-end space-x-3">
            <button @click="showMappingModal = false" class="btn-secondary">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button class="btn-primary">
              {{ language === 'de' ? 'Mapping erstellen' : 'Create Mapping' }}
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
import { Plus, Edit, Link, ArrowRight, X, BookOpen, Target, Award, CheckCircle } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showMappingModal = ref(false)
const selectedGrade = ref('')
const selectedSubject = ref('')

const gradeLevels = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'German', 'English', 'History', 'Geography', 'Art', 'Music', 'PE']

const educationStandards = ref([
  {
    id: 1,
    name: 'Common Core Math',
    description: 'Mathematical practices and content standards',
    compliance: 85,
    mappedObjectives: 34,
    totalObjectives: 40,
    icon: BookOpen,
    iconBg: 'bg-blue-600'
  },
  {
    id: 2,
    name: 'Science Standards',
    description: 'Next Generation Science Standards',
    compliance: 92,
    mappedObjectives: 46,
    totalObjectives: 50,
    icon: Target,
    iconBg: 'bg-green-600'
  },
  {
    id: 3,
    name: 'Language Arts',
    description: 'Reading, writing, speaking, and listening',
    compliance: 78,
    mappedObjectives: 31,
    totalObjectives: 40,
    icon: Award,
    iconBg: 'bg-purple-600'
  },
  {
    id: 4,
    name: 'Social Studies',
    description: 'History, geography, and civic ideals',
    compliance: 88,
    mappedObjectives: 35,
    totalObjectives: 40,
    icon: CheckCircle,
    iconBg: 'bg-yellow-600'
  }
])

const learningObjectives = ref([
  {
    id: 1,
    title: 'Solve quadratic equations',
    description: 'Students will solve quadratic equations using various methods',
    standard: 'CCSS.MATH.A-REI.4',
    subject: 'Mathematics',
    gradeLevel: 'Grade 9',
    status: 'Mapped'
  },
  {
    id: 2,
    title: 'Analyze chemical reactions',
    description: 'Understand and predict chemical reaction outcomes',
    standard: 'NGSS.HS-PS1-2',
    subject: 'Chemistry',
    gradeLevel: 'Grade 11',
    status: 'In Progress'
  },
  {
    id: 3,
    title: 'Write persuasive essays',
    description: 'Compose well-structured argumentative essays',
    standard: 'CCSS.ELA-W.9-10.1',
    subject: 'English',
    gradeLevel: 'Grade 10',
    status: 'Mapped'
  }
])

const crossCurricularConnections = ref([
  {
    id: 1,
    title: 'Math in Science',
    subject1: 'Mathematics',
    subject2: 'Physics',
    description: 'Using algebraic equations to solve physics problems',
    strength: 'Strong',
    gradeLevel: 'Grade 11'
  },
  {
    id: 2,
    title: 'History and Literature',
    subject1: 'History',
    subject2: 'English',
    description: 'Reading historical texts to understand literary context',
    strength: 'Medium',
    gradeLevel: 'Grade 10'
  },
  {
    id: 3,
    title: 'Art and Geometry',
    subject1: 'Art',
    subject2: 'Mathematics',
    description: 'Exploring geometric principles through artistic creation',
    strength: 'Strong',
    gradeLevel: 'Grade 8'
  }
])

const complianceReports = ref([
  {
    id: 1,
    standardName: 'Common Core Math',
    status: 'On Track',
    metObjectives: 34,
    pendingObjectives: 6
  },
  {
    id: 2,
    standardName: 'Science Standards',
    status: 'Ahead',
    metObjectives: 46,
    pendingObjectives: 4
  },
  {
    id: 3,
    standardName: 'Language Arts',
    status: 'Behind',
    metObjectives: 31,
    pendingObjectives: 9
  }
])

const objectiveTrackers = ref([
  {
    id: 1,
    objective: 'Master algebraic expressions',
    subject: 'Mathematics',
    gradeLevel: 'Grade 9',
    progress: 75,
    studentsAchieved: 18,
    totalStudents: 24,
    targetDate: '2024-04-15',
    status: 'On Track'
  },
  {
    id: 2,
    objective: 'Understand atomic structure',
    subject: 'Chemistry',
    gradeLevel: 'Grade 11',
    progress: 60,
    studentsAchieved: 12,
    totalStudents: 20,
    targetDate: '2024-05-01',
    status: 'Behind'
  }
])

const upcomingMilestones = ref([
  {
    id: 1,
    title: 'Math Assessment',
    description: 'Quadratic equations unit test',
    date: '2024-03-25',
    type: 'Assessment',
    urgent: true
  },
  {
    id: 2,
    title: 'Science Fair',
    description: 'Student project presentations',
    date: '2024-04-10',
    type: 'Event',
    urgent: false
  },
  {
    id: 3,
    title: 'Standards Review',
    description: 'Quarterly compliance check',
    date: '2024-04-30',
    type: 'Review',
    urgent: false
  }
])

const filteredObjectives = computed(() => {
  let filtered = learningObjectives.value

  if (selectedGrade.value) {
    filtered = filtered.filter(obj => obj.gradeLevel === selectedGrade.value)
  }

  if (selectedSubject.value) {
    filtered = filtered.filter(obj => obj.subject === selectedSubject.value)
  }

  return filtered
})

const exportMatrix = () => {
  alert(language.value === 'de' ? 'Matrix wird exportiert...' : 'Exporting matrix...')
}

const editObjective = (objective: any) => {
  alert(`${language.value === 'de' ? 'Lernziel bearbeiten' : 'Edit objective'}: ${objective.title}`)
}

const viewConnections = (objective: any) => {
  alert(`${language.value === 'de' ? 'Verbindungen anzeigen für' : 'View connections for'}: ${objective.title}`)
}

const exploreConnection = (connection: any) => {
  alert(`${language.value === 'de' ? 'Verbindung erkunden' : 'Explore connection'}: ${connection.title}`)
}

const addObjective = () => {
  alert(language.value === 'de' ? 'Neues Lernziel hinzufügen' : 'Add new learning objective')
}

const updateProgress = (tracker: any) => {
  alert(`${language.value === 'de' ? 'Fortschritt aktualisieren für' : 'Update progress for'}: ${tracker.objective}`)
}

const viewDetails = (tracker: any) => {
  alert(`${language.value === 'de' ? 'Details anzeigen für' : 'View details for'}: ${tracker.objective}`)
}

const getComplianceColor = (compliance: number) => {
  if (compliance >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  if (compliance >= 75) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  if (compliance >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const getObjectiveStatusColor = (status: string) => {
  switch (status) {
    case 'Mapped':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Not Started':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getConnectionStrengthColor = (strength: string) => {
  switch (strength) {
    case 'Strong':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Weak':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getComplianceStatusColor = (status: string) => {
  switch (status) {
    case 'Ahead':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'On Track':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Behind':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getProgressStatusColor = (status: string) => {
  switch (status) {
    case 'On Track':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Behind':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Ahead':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getMilestoneTypeColor = (type: string) => {
  switch (type) {
    case 'Assessment':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Event':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Review':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>
