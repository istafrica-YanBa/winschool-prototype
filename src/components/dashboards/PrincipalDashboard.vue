<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Institution Overview -->
    <div class="lg:col-span-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Building class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Institutionsübersicht' : 'Institution Overview' }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div v-for="stat in institutionStats" :key="stat.title" class="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div :class="stat.iconBg" class="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
            <component :is="stat.icon" class="h-6 w-6 text-white" />
          </div>
          <p class="text-2xl font-bold text-slate-800 dark:text-slate-50">{{ stat.value }}</p>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ stat.title }}</p>
          <p :class="stat.changeColor" class="text-xs mt-1">{{ stat.change }}</p>
        </div>
      </div>
    </div>

    <!-- Department Performance -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <BarChart3 class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Abteilungsleistung' : 'Department Performance' }}
      </h2>
      <div class="space-y-4">
        <div v-for="dept in departmentPerformance" :key="dept.name" class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ dept.name }}</h3>
            <span :class="getPerformanceColor(dept.score)" class="text-sm font-semibold">{{ dept.score }}%</span>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
            <div :class="getPerformanceColor(dept.score, true)" class="h-2 rounded-full" :style="{ width: dept.score + '%' }"></div>
          </div>
          <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
            <span>{{ dept.teachers }} teachers</span>
            <span>{{ dept.students }} students</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Strategic Initiatives -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Target class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Strategische Initiativen' : 'Strategic Initiatives' }}
      </h2>
      <div class="space-y-4">
        <div v-for="initiative in strategicInitiatives" :key="initiative.id" class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ initiative.title }}</h3>
            <span :class="getStatusColor(initiative.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ initiative.status }}
            </span>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">{{ initiative.description }}</p>
          <div class="flex justify-between items-center">
            <div class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mr-3">
              <div class="bg-gradient-to-r from-indigo-700 to-blue-600 h-2 rounded-full" :style="{ width: initiative.progress + '%' }"></div>
            </div>
            <span class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ initiative.progress }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Overview -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <DollarSign class="h-5 w-5 mr-2 text-green-500" />
        {{ language === 'de' ? 'Budgetübersicht' : 'Budget Overview' }}
      </h2>
      <div class="space-y-4">
        <div class="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <p class="text-3xl font-bold text-slate-800 dark:text-slate-50">€2.4M</p>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Jahresbudget' : 'Annual Budget' }}</p>
        </div>
        <div class="space-y-3">
          <div v-for="category in budgetCategories" :key="category.name" class="flex justify-between items-center">
            <span class="text-sm text-slate-500 dark:text-slate-400">{{ category.name }}</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ category.amount }}</span>
              <span :class="category.changeColor" class="text-xs">{{ category.change }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Decisions -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <FileText class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Kürzliche Entscheidungen' : 'Recent Decisions' }}
      </h2>
      <div class="space-y-3">
        <div v-for="decision in recentDecisions" :key="decision.id" class="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ decision.title }}</h3>
            <span class="text-xs text-slate-500 dark:text-slate-400">{{ decision.date }}</span>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ decision.description }}</p>
          <div class="flex justify-between items-center mt-2">
            <span :class="getDecisionTypeColor(decision.type)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ decision.type }}
            </span>
            <span class="text-xs text-slate-500 dark:text-slate-400">{{ decision.impact }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { 
  Building, BarChart3, Target, DollarSign, FileText,
  Users, BookOpen, Calendar, TrendingUp, Award
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const institutionStats = [
  {
    title: language.value === 'de' ? 'Schüler' : 'Students',
    value: '1,247',
    change: '+12 this month',
    changeColor: 'text-green-500',
    icon: Users,
    iconBg: 'bg-winschool-primary'
  },
  {
    title: language.value === 'de' ? 'Lehrer' : 'Teachers',
    value: '89',
    change: '+3 this month',
    changeColor: 'text-green-500',
    icon: BookOpen,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Klassen' : 'Classes',
    value: '42',
    change: 'Stable',
    changeColor: 'text-slate-500',
    icon: Calendar,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Leistung' : 'Performance',
    value: '94.2%',
    change: '+2.1% this term',
    changeColor: 'text-green-500',
    icon: TrendingUp,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Auszeichnungen' : 'Awards',
    value: '15',
    change: '+5 this year',
    changeColor: 'text-green-500',
    icon: Award,
    iconBg: 'bg-yellow-500'
  }
]

const departmentPerformance = [
  { name: 'Mathematics', score: 92, teachers: 12, students: 340 },
  { name: 'Sciences', score: 88, teachers: 15, students: 380 },
  { name: 'Languages', score: 95, teachers: 18, students: 420 },
  { name: 'Arts', score: 85, teachers: 8, students: 200 },
  { name: 'Sports', score: 90, teachers: 6, students: 150 }
]

const strategicInitiatives = [
  {
    id: 1,
    title: 'Digital Transformation',
    description: 'Implementing new learning management system',
    progress: 75,
    status: 'On Track'
  },
  {
    id: 2,
    title: 'Teacher Development',
    description: 'Professional development program for all staff',
    progress: 60,
    status: 'In Progress'
  },
  {
    id: 3,
    title: 'Infrastructure Upgrade',
    description: 'Modernizing classrooms and facilities',
    progress: 40,
    status: 'Planning'
  }
]

const budgetCategories = [
  { name: 'Staff Salaries', amount: '€1.2M', change: '+3.2%', changeColor: 'text-red-500' },
  { name: 'Infrastructure', amount: '€450K', change: '+12%', changeColor: 'text-red-500' },
  { name: 'Technology', amount: '€320K', change: '+8%', changeColor: 'text-red-500' },
  { name: 'Programs', amount: '€280K', change: '-2%', changeColor: 'text-green-500' },
  { name: 'Operations', amount: '€150K', change: '+1%', changeColor: 'text-red-500' }
]

const recentDecisions = [
  {
    id: 1,
    title: 'New Science Lab Approval',
    description: 'Approved budget for new chemistry laboratory',
    date: '2 days ago',
    type: 'Budget',
    impact: 'High Impact'
  },
  {
    id: 2,
    title: 'Teacher Hiring',
    description: 'Approved hiring of 3 new mathematics teachers',
    date: '1 week ago',
    type: 'Staffing',
    impact: 'Medium Impact'
  },
  {
    id: 3,
    title: 'Policy Update',
    description: 'Updated student attendance policy',
    date: '2 weeks ago',
    type: 'Policy',
    impact: 'Low Impact'
  }
]

const getPerformanceColor = (score: number, isBg = false) => {
  if (score >= 90) return isBg ? 'bg-green-500' : 'text-green-500'
  if (score >= 80) return isBg ? 'bg-blue-500' : 'text-blue-600'
  if (score >= 70) return isBg ? 'bg-yellow-500' : 'text-yellow-500'
  return isBg ? 'bg-red-500' : 'text-red-500'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'On Track':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'Planning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getDecisionTypeColor = (type: string) => {
  switch (type) {
    case 'Budget':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Staffing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'Policy':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}
</script>