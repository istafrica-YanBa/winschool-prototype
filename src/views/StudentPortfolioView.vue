<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Schüler-Portfolio' : 'Student Portfolio' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ language === 'de' ? 'Digitale Portfolios und Fortschrittsverfolgung' : 'Digital portfolios and progress tracking' }}
        </p>
      </div>
      <button @click="createPortfolio" class="btn-primary flex items-center">
        <Plus class="h-4 w-4 mr-2" />
        {{ language === 'de' ? 'Portfolio erstellen' : 'Create Portfolio' }}
      </button>
    </div>

    <!-- Portfolio Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="stat in portfolioStats" :key="stat.title" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div :class="stat.iconBg" class="p-3 rounded-lg">
            <component :is="stat.icon" class="h-6 w-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.title }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
            <p :class="stat.changeColor" class="text-sm">{{ stat.change }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Student Portfolios -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Schüler-Portfolios' : 'Student Portfolios' }}
        </h2>
        <div class="flex space-x-2">
          <select v-model="selectedClass" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">{{ language === 'de' ? 'Alle Klassen' : 'All Classes' }}</option>
            <option v-for="class_ in classes" :key="class_" :value="class_">{{ class_ }}</option>
          </select>
          <select v-model="selectedSubject" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">{{ language === 'de' ? 'Alle Fächer' : 'All Subjects' }}</option>
            <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="portfolio in filteredPortfolios" :key="portfolio.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 card-hover cursor-pointer" @click="openPortfolio(portfolio)">
          <div class="flex items-center mb-4">
            <img :src="portfolio.studentAvatar" :alt="portfolio.studentName" class="h-12 w-12 rounded-full object-cover mr-3" />
            <div class="flex-1">
              <h3 class="font-medium text-gray-900 dark:text-white">{{ portfolio.studentName }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ portfolio.class }} • {{ portfolio.subject }}</p>
            </div>
            <span :class="getPortfolioStatusColor(portfolio.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ portfolio.status }}
            </span>
          </div>

          <div class="grid grid-cols-3 gap-4 text-sm mb-4">
            <div class="text-center">
              <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Einträge' : 'Entries' }}</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ portfolio.entries }}</p>
            </div>
            <div class="text-center">
              <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Bewertungen' : 'Assessments' }}</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ portfolio.assessments }}</p>
            </div>
            <div class="text-center">
              <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Fortschritt' : 'Progress' }}</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ portfolio.progress }}%</p>
            </div>
          </div>

          <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-4">
            <div class="bg-primary-600 h-2 rounded-full" :style="{ width: portfolio.progress + '%' }"></div>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500 dark:text-gray-500">{{ language === 'de' ? 'Letzte Aktualisierung:' : 'Last updated:' }} {{ portfolio.lastUpdated }}</span>
            <div class="flex space-x-1">
              <button @click.stop="reviewPortfolio(portfolio)" class="text-primary-600 hover:text-primary-800">
                <Eye class="h-4 w-4" />
              </button>
              <button @click.stop="sharePortfolio(portfolio)" class="text-secondary-600 hover:text-secondary-800">
                <Share class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skill Development Tracking -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {{ language === 'de' ? 'Kompetenzentwicklung' : 'Skill Development Tracking' }}
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Skill Progress Chart -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Kompetenz-Fortschritt' : 'Skill Progress' }}
          </h3>
          <div class="space-y-4">
            <div v-for="skill in skillProgress" :key="skill.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ skill.name }}</h4>
                <span :class="getSkillLevelColor(skill.level)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ skill.level }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Aktueller Stand' : 'Current Level' }}</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ skill.currentLevel }}/{{ skill.maxLevel }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Fortschritt' : 'Progress' }}</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ skill.progress }}%</p>
                </div>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div class="bg-primary-600 h-2 rounded-full" :style="{ width: skill.progress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievement Badges -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Leistungsabzeichen' : 'Achievement Badges' }}
          </h3>
          <div class="grid grid-cols-3 gap-4">
            <div v-for="badge in achievementBadges" :key="badge.id" class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div :class="badge.earned ? badge.colorEarned : badge.colorUnearned" class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <component :is="badge.icon" class="h-8 w-8" :class="badge.earned ? 'text-white' : 'text-gray-400'" />
              </div>
              <h4 class="font-medium text-gray-900 dark:text-white text-sm">{{ badge.name }}</h4>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ badge.description }}</p>
              <div class="mt-2">
                <span :class="badge.earned ? 'text-green-600' : 'text-gray-500'" class="text-xs font-medium">
                  {{ badge.earned ? (language === 'de' ? 'Erhalten' : 'Earned') : (language === 'de' ? 'Nicht erhalten' : 'Not Earned') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Learning Milestones -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Lern-Meilensteine' : 'Learning Milestones' }}
        </h2>
        <button @click="addMilestone" class="btn-primary text-sm">
          {{ language === 'de' ? 'Meilenstein hinzufügen' : 'Add Milestone' }}
        </button>
      </div>

      <div class="space-y-6">
        <div v-for="student in studentMilestones" :key="student.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center mb-4">
            <img :src="student.avatar" :alt="student.name" class="h-10 w-10 rounded-full object-cover mr-3" />
            <div class="flex-1">
              <h3 class="font-medium text-gray-900 dark:text-white">{{ student.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ student.class }}</p>
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-500">{{ student.milestones.length }} {{ language === 'de' ? 'Meilensteine' : 'milestones' }}</span>
          </div>

          <!-- Timeline -->
          <div class="relative">
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
            <div class="space-y-4">
              <div v-for="(milestone, index) in student.milestones" :key="index" class="relative flex items-start">
                <div :class="milestone.completed ? 'bg-green-500' : 'bg-gray-300'" class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center">
                  <component :is="milestone.completed ? CheckCircle : Clock" class="h-4 w-4" :class="milestone.completed ? 'text-white' : 'text-gray-600'" />
                </div>
                <div class="ml-4 flex-1">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">{{ milestone.title }}</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ milestone.description }}</p>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-500">{{ milestone.date }}</span>
                  </div>
                  <div class="mt-2">
                    <span :class="getMilestoneTypeColor(milestone.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ milestone.type }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Portfolio Detail Modal -->
    <div v-if="showPortfolioModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ selectedPortfolio?.studentName }} - {{ selectedPortfolio?.subject }}
            </h3>
            <button @click="showPortfolioModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div v-if="selectedPortfolio" class="space-y-6">
            <!-- Portfolio Entries -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Portfolio-Einträge' : 'Portfolio Entries' }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="entry in portfolioEntries" :key="entry.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex justify-between items-start mb-2">
                    <h5 class="font-medium text-gray-900 dark:text-white">{{ entry.title }}</h5>
                    <span class="text-xs text-gray-500 dark:text-gray-500">{{ entry.date }}</span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ entry.description }}</p>
                  <div class="flex justify-between items-center">
                    <span :class="getEntryTypeColor(entry.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ entry.type }}
                    </span>
                    <button @click="viewEntry(entry)" class="text-primary-600 hover:text-primary-800 text-sm">
                      {{ language === 'de' ? 'Anzeigen' : 'View' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reflection Notes -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Reflexionsnotizen' : 'Reflection Notes' }}
              </h4>
              <div class="space-y-3">
                <div v-for="reflection in reflectionNotes" :key="reflection.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex justify-between items-start mb-2">
                    <p class="text-sm text-gray-900 dark:text-white">{{ reflection.content }}</p>
                    <span class="text-xs text-gray-500 dark:text-gray-500">{{ reflection.date }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showPortfolioModal = false" class="btn-secondary">
              {{ language === 'de' ? 'Schließen' : 'Close' }}
            </button>
            <button class="btn-primary">
              {{ language === 'de' ? 'Portfolio bewerten' : 'Assess Portfolio' }}
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
import { 
  Plus, Eye, Share, X, CheckCircle, Clock, Users, BookOpen, 
  Award, TrendingUp, Star, Target, Zap
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showPortfolioModal = ref(false)
const selectedPortfolio = ref<any>(null)
const selectedClass = ref('')
const selectedSubject = ref('')

const classes = ['Class 8A', 'Class 8B', 'Class 9A', 'Class 9B', 'Class 10A', 'Class 10B']
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'German', 'English', 'History']

const portfolioStats = ref([
  {
    title: language.value === 'de' ? 'Aktive Portfolios' : 'Active Portfolios',
    value: '156',
    change: '+12 this month',
    changeColor: 'text-green-600',
    icon: Users,
    iconBg: 'bg-primary-600'
  },
  {
    title: language.value === 'de' ? 'Abgeschlossene Bewertungen' : 'Completed Assessments',
    value: '89',
    change: '+23 this week',
    changeColor: 'text-green-600',
    icon: CheckCircle,
    iconBg: 'bg-green-600'
  },
  {
    title: language.value === 'de' ? 'Durchschnittlicher Fortschritt' : 'Average Progress',
    value: '78%',
    change: '+5% this month',
    changeColor: 'text-green-600',
    icon: TrendingUp,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Verliehene Abzeichen' : 'Badges Awarded',
    value: '234',
    change: '+18 this week',
    changeColor: 'text-green-600',
    icon: Award,
    iconBg: 'bg-yellow-600'
  }
])

const studentPortfolios = ref([
  {
    id: 1,
    studentName: 'Emma Müller',
    studentAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    class: 'Class 10A',
    subject: 'Mathematics',
    entries: 15,
    assessments: 8,
    progress: 85,
    status: 'Active',
    lastUpdated: '2024-03-10'
  },
  {
    id: 2,
    studentName: 'Liam Weber',
    studentAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    class: 'Class 10A',
    subject: 'Physics',
    entries: 12,
    assessments: 6,
    progress: 72,
    status: 'In Progress',
    lastUpdated: '2024-03-08'
  },
  {
    id: 3,
    studentName: 'Sophie Schmidt',
    studentAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    class: 'Class 9B',
    subject: 'German',
    entries: 18,
    assessments: 10,
    progress: 92,
    status: 'Complete',
    lastUpdated: '2024-03-12'
  }
])

const skillProgress = ref([
  {
    id: 1,
    name: 'Critical Thinking',
    level: 'Advanced',
    currentLevel: 4,
    maxLevel: 5,
    progress: 80
  },
  {
    id: 2,
    name: 'Communication',
    level: 'Proficient',
    currentLevel: 3,
    maxLevel: 5,
    progress: 60
  },
  {
    id: 3,
    name: 'Collaboration',
    level: 'Developing',
    currentLevel: 2,
    maxLevel: 5,
    progress: 40
  },
  {
    id: 4,
    name: 'Creativity',
    level: 'Proficient',
    currentLevel: 3,
    maxLevel: 5,
    progress: 65
  }
])

const achievementBadges = ref([
  {
    id: 1,
    name: 'Math Master',
    description: 'Completed advanced math portfolio',
    icon: Target,
    earned: true,
    colorEarned: 'bg-yellow-500',
    colorUnearned: 'bg-gray-300'
  },
  {
    id: 2,
    name: 'Science Explorer',
    description: 'Conducted 5 science experiments',
    icon: Star,
    earned: true,
    colorEarned: 'bg-blue-500',
    colorUnearned: 'bg-gray-300'
  },
  {
    id: 3,
    name: 'Creative Writer',
    description: 'Published 3 creative pieces',
    icon: BookOpen,
    earned: false,
    colorEarned: 'bg-purple-500',
    colorUnearned: 'bg-gray-300'
  },
  {
    id: 4,
    name: 'Team Player',
    description: 'Excellent collaboration skills',
    icon: Users,
    earned: true,
    colorEarned: 'bg-green-500',
    colorUnearned: 'bg-gray-300'
  },
  {
    id: 5,
    name: 'Innovation Award',
    description: 'Created innovative solution',
    icon: Zap,
    earned: false,
    colorEarned: 'bg-red-500',
    colorUnearned: 'bg-gray-300'
  },
  {
    id: 6,
    name: 'Leadership',
    description: 'Led successful group project',
    icon: Award,
    earned: false,
    colorEarned: 'bg-indigo-500',
    colorUnearned: 'bg-gray-300'
  }
])

const studentMilestones = ref([
  {
    id: 1,
    name: 'Emma Müller',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    class: 'Class 10A',
    milestones: [
      {
        title: 'Mastered Quadratic Equations',
        description: 'Successfully solved complex quadratic problems',
        date: '2024-03-10',
        type: 'Academic',
        completed: true
      },
      {
        title: 'Science Fair Presentation',
        description: 'Presented research on renewable energy',
        date: '2024-03-15',
        type: 'Project',
        completed: true
      },
      {
        title: 'Leadership Role',
        description: 'Led group project on environmental science',
        date: '2024-03-20',
        type: 'Skill',
        completed: false
      }
    ]
  },
  {
    id: 2,
    name: 'Liam Weber',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    class: 'Class 10A',
    milestones: [
      {
        title: 'Physics Lab Excellence',
        description: 'Completed all lab experiments with high accuracy',
        date: '2024-03-08',
        type: 'Academic',
        completed: true
      },
      {
        title: 'Peer Tutoring',
        description: 'Helped classmates with physics concepts',
        date: '2024-03-12',
        type: 'Skill',
        completed: true
      }
    ]
  }
])

const portfolioEntries = ref([
  {
    id: 1,
    title: 'Quadratic Functions Analysis',
    description: 'Comprehensive study of quadratic functions and their applications',
    type: 'Assignment',
    date: '2024-03-10'
  },
  {
    id: 2,
    title: 'Math Problem Solving Video',
    description: 'Created instructional video explaining problem-solving strategies',
    type: 'Project',
    date: '2024-03-08'
  },
  {
    id: 3,
    title: 'Reflection on Learning',
    description: 'Personal reflection on mathematical thinking development',
    type: 'Reflection',
    date: '2024-03-05'
  }
])

const reflectionNotes = ref([
  {
    id: 1,
    content: 'I found the quadratic equations challenging at first, but breaking them down into steps helped me understand the process better.',
    date: '2024-03-10'
  },
  {
    id: 2,
    content: 'Working on the group project taught me the importance of clear communication when explaining mathematical concepts.',
    date: '2024-03-08'
  }
])

const filteredPortfolios = computed(() => {
  let filtered = studentPortfolios.value

  if (selectedClass.value) {
    filtered = filtered.filter(portfolio => portfolio.class === selectedClass.value)
  }

  if (selectedSubject.value) {
    filtered = filtered.filter(portfolio => portfolio.subject === selectedSubject.value)
  }

  return filtered
})

const createPortfolio = () => {
  alert(language.value === 'de' ? 'Neues Portfolio erstellen' : 'Create new portfolio')
}

const openPortfolio = (portfolio: any) => {
  selectedPortfolio.value = portfolio
  showPortfolioModal.value = true
}

const reviewPortfolio = (portfolio: any) => {
  alert(`${language.value === 'de' ? 'Portfolio bewerten für' : 'Review portfolio for'} ${portfolio.studentName}`)
}

const sharePortfolio = (portfolio: any) => {
  alert(`${language.value === 'de' ? 'Portfolio teilen für' : 'Share portfolio for'} ${portfolio.studentName}`)
}

const addMilestone = () => {
  alert(language.value === 'de' ? 'Neuen Meilenstein hinzufügen' : 'Add new milestone')
}

const viewEntry = (entry: any) => {
  alert(`${language.value === 'de' ? 'Eintrag anzeigen' : 'View entry'}: ${entry.title}`)
}

const getPortfolioStatusColor = (status: string) => {
  switch (status) {
    case 'Complete':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Active':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getSkillLevelColor = (level: string) => {
  switch (level) {
    case 'Advanced':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Proficient':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Developing':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Beginning':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getMilestoneTypeColor = (type: string) => {
  switch (type) {
    case 'Academic':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Project':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Skill':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getEntryTypeColor = (type: string) => {
  switch (type) {
    case 'Assignment':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Project':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Reflection':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>
