<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ language.value === 'de' ? 'Erweiterte Analytik' : 'Advanced Analytics' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ language.value === 'de' ? 'Umfassende Nutzungs- und Effizienzanalysen' : 'Comprehensive utilization and efficiency analytics' }}
        </p>
      </div>
      <div class="flex space-x-2">
        <button @click="refreshData" class="btn-secondary flex items-center">
          <RefreshCw class="h-4 w-4 mr-2" />
          {{ language.value === 'de' ? 'Daten aktualisieren' : 'Refresh Data' }}
        </button>
        <button @click="exportReport" class="btn-primary flex items-center">
          <Download class="h-4 w-4 mr-2" />
          {{ language.value === 'de' ? 'Bericht exportieren' : 'Export Report' }}
        </button>
      </div>
    </div>

    <!-- Analytics Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="metric in analyticsMetrics" :key="metric.title" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div :class="metric.iconBg" class="p-3 rounded-lg">
            <component :is="metric.icon" class="h-6 w-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ metric.title }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metric.value }}</p>
            <p :class="metric.changeColor" class="text-sm flex items-center">
              <component :is="metric.trendIcon" class="h-4 w-4 mr-1" />
              {{ metric.change }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Utilization Analytics -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language.value === 'de' ? 'Nutzungsanalyse' : 'Utilization Analytics' }}
        </h2>
        <div class="flex space-x-2">
          <select v-model="selectedPeriod" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="day">{{ language.value === 'de' ? 'Heute' : 'Today' }}</option>
            <option value="week">{{ language.value === 'de' ? 'Diese Woche' : 'This Week' }}</option>
            <option value="month">{{ language.value === 'de' ? 'Dieser Monat' : 'This Month' }}</option>
            <option value="quarter">{{ language.value === 'de' ? 'Dieses Quartal' : 'This Quarter' }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Resource Utilization -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language.value === 'de' ? 'Ressourcennutzung' : 'Resource Utilization' }}
          </h3>
          <div class="space-y-4">
            <div v-for="resource in resourceUtilization" :key="resource.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-center mb-3">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ resource.name }}</h4>
                <span :class="getUtilizationColor(resource.utilization)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ resource.utilization }}%
                </span>
              </div>
              
              <div class="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language.value === 'de' ? 'Kapazität' : 'Capacity' }}</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ resource.capacity }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language.value === 'de' ? 'Spitzenzeit' : 'Peak Time' }}</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ resource.peakTime }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language.value === 'de' ? 'Trend' : 'Trend' }}</p>
                  <p :class="resource.trend === 'up' ? 'text-green-600' : 'text-red-600'" class="font-medium flex items-center">
                    <component :is="resource.trend === 'up' ? TrendingUp : TrendingDown" class="h-4 w-4 mr-1" />
                    {{ resource.trendValue }}%
                  </p>
                </div>
              </div>
              
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div :class="getUtilizationBarColor(resource.utilization)" class="h-2 rounded-full" :style="{ width: resource.utilization + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Efficiency Metrics -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language.value === 'de' ? 'Effizienz-Metriken' : 'Efficiency Metrics' }}
          </h3>
          <div class="space-y-4">
            <div v-for="metric in efficiencyMetrics" :key="metric.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-center mb-3">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ metric.name }}</h4>
                <span :class="getEfficiencyColor(metric.score)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ metric.score }}/10
                </span>
              </div>
              
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ metric.description }}</p>
              
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div :class="getEfficiencyBarColor(metric.score)" class="h-2 rounded-full" :style="{ width: (metric.score / 10 * 100) + '%' }"></div>
              </div>
              
              <div class="flex justify-between items-center mt-3">
                <span class="text-xs text-gray-500 dark:text-gray-500">{{ language.value === 'de' ? 'Benchmark:' : 'Benchmark:' }} {{ metric.benchmark }}/10</span>
                <button @click="viewMetricDetails(metric)" class="text-xs text-primary-600 hover:text-primary-800">
                  {{ language.value === 'de' ? 'Details' : 'Details' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Predictive Planning Insights -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {{ language.value === 'de' ? 'Prädiktive Planungseinblicke' : 'Predictive Planning Insights' }}
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Predictions -->
        <div class="lg:col-span-2">
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language.value === 'de' ? 'Vorhersagen' : 'Predictions' }}
          </h3>
          <div class="space-y-4">
            <div v-for="prediction in predictiveInsights" :key="prediction.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">{{ prediction.title }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ prediction.description }}</p>
                </div>
                <span :class="getConfidenceColor(prediction.confidence)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ prediction.confidence }}% {{ language.value === 'de' ? 'Konfidenz' : 'Confidence' }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language.value === 'de' ? 'Zeitrahmen' : 'Timeframe' }}</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ prediction.timeframe }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language.value === 'de' ? 'Auswirkung' : 'Impact' }}</p>
                  <span :class="getImpactColor(prediction.impact)" class="font-medium">{{ prediction.impact }}</span>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <button @click="applyPrediction(prediction)" class="btn-primary text-sm">
                  {{ language.value === 'de' ? 'Anwenden' : 'Apply' }}
                </button>
                <button @click="viewPredictionDetails(prediction)" class="btn-secondary text-sm">
                  {{ language.value === 'de' ? 'Details' : 'Details' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Resource Waste Identification -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language.value === 'de' ? 'Ressourcenverschwendung' : 'Resource Waste Identification' }}
          </h3>
          <div class="space-y-3">
            <div v-for="waste in resourceWaste" :key="waste.id" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div class="flex items-start">
                <AlertTriangle class="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                <div class="flex-1">
                  <h4 class="font-medium text-red-800 dark:text-red-200">{{ waste.title }}</h4>
                  <p class="text-sm text-red-600 dark:text-red-400 mt-1">{{ waste.description }}</p>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-red-500 dark:text-red-500">{{ language.value === 'de' ? 'Potenzielle Einsparung:' : 'Potential savings:' }} {{ waste.potentialSavings }}</span>
                    <button @click="addressWaste(waste)" class="text-xs text-red-600 hover:text-red-800 dark:text-red-400">
                      {{ language.value === 'de' ? 'Beheben' : 'Address' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Dashboard -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language.value === 'de' ? 'KPI-Dashboard' : 'KPI Dashboard' }}
        </h2>
        <button @click="customizeKPIs" class="btn-secondary text-sm">
          {{ language.value === 'de' ? 'KPIs anpassen' : 'Customize KPIs' }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="kpi in keyPerformanceIndicators" :key="kpi.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-medium text-gray-900 dark:text-white">{{ kpi.name }}</h3>
            <component :is="kpi.trend === 'up' ? TrendingUp : TrendingDown" :class="kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'" class="h-5 w-5" />
          </div>
          
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ kpi.value }}</p>
          
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ language.value === 'de' ? 'Ziel:' : 'Target:' }} {{ kpi.target }}</span>
            <span :class="kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
              {{ kpi.change }}
            </span>
          </div>
          
          <div class="mt-3">
            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div :class="getKPIProgressColor(kpi.value, kpi.target)" class="h-2 rounded-full" :style="{ width: getKPIProgress(kpi.value, kpi.target) + '%' }"></div>
            </div>
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
  RefreshCw, Download, TrendingUp, TrendingDown, Building, Users, 
  Clock, DollarSign, AlertTriangle
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const selectedPeriod = ref('week')

const analyticsMetrics = ref([
  {
    title: language.value === 'de' ? 'Ressourcenauslastung' : 'Resource Utilization',
    value: '87%',
    change: '+12% vs. last period',
    changeColor: 'text-green-600',
    trendIcon: TrendingUp,
    icon: Building,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Durchschnittliche Klassenauslastung' : 'Average Class Utilization',
    value: '92%',
    change: '+8% vs. last period',
    changeColor: 'text-green-600',
    trendIcon: TrendingUp,
    icon: Users,
    iconBg: 'bg-green-600'
  },
  {
    title: language.value === 'de' ? 'Durchschnittliche Wartezeit' : 'Average Wait Time',
    value: '1.2m',
    change: '-15% vs. last period',
    changeColor: 'text-green-600',
    trendIcon: TrendingDown,
    icon: Clock,
    iconBg: 'bg-yellow-600'
  },
  {
    title: language.value === 'de' ? 'Kosten pro Schüler' : 'Cost per Student',
    value: '€42',
    change: '-5% vs. last period',
    changeColor: 'text-green-600',
    trendIcon: TrendingDown,
    icon: DollarSign,
    iconBg: 'bg-purple-600'
  }
])

const resourceUtilization = ref([
  {
    id: 1,
    name: 'Classrooms',
    utilization: 87,
    capacity: '30/35 rooms',
    peakTime: '10:00 AM',
    trend: 'up',
    trendValue: 12
  },
  {
    id: 2,
    name: 'Teachers',
    utilization: 92,
    capacity: '45/48 teachers',
    peakTime: '11:00 AM',
    trend: 'up',
    trendValue: 8
  },
  {
    id: 3,
    name: 'Labs',
    utilization: 75,
    capacity: '6/8 labs',
    peakTime: '2:00 PM',
    trend: 'down',
    trendValue: 5
  }
])

const efficiencyMetrics = ref([
  {
    id: 1,
    name: 'Room Allocation Efficiency',
    description: 'How efficiently rooms are allocated based on class size and requirements',
    score: 8.5,
    benchmark: 7.2
  },
  {
    id: 2,
    name: 'Teacher Workload Balance',
    description: 'How evenly distributed teacher workloads are across the institution',
    score: 7.2,
    benchmark: 6.8
  },
  {
    id: 3,
    name: 'Schedule Optimization',
    description: 'How well the schedule minimizes conflicts and maximizes resource usage',
    score: 9.1,
    benchmark: 8.0
  }
])

const predictiveInsights = ref([
  {
    id: 1,
    title: 'Room Shortage Prediction',
    description: 'Based on enrollment trends, expect classroom shortage next semester',
    confidence: 85,
    timeframe: 'Next Semester',
    impact: 'High'
  },
  {
    id: 2,
    title: 'Teacher Workload Imbalance',
    description: 'Science department will experience workload imbalance',
    confidence: 72,
    timeframe: 'Next Month',
    impact: 'Medium'
  },
  {
    id: 3,
    title: 'Resource Underutilization',
    description: 'Computer labs will be underutilized on Fridays',
    confidence: 91,
    timeframe: 'Current Period',
    impact: 'Low'
  }
])

const resourceWaste = ref([
  {
    id: 1,
    title: 'Empty Classrooms',
    description: '3 classrooms consistently empty during periods 2-3',
    potentialSavings: '€1,200/month'
  },
  {
    id: 2,
    title: 'Duplicate Equipment',
    description: 'Redundant AV equipment in adjacent rooms',
    potentialSavings: '€800/month'
  },
  {
    id: 3,
    title: 'Heating Inefficiency',
    description: 'Heating running in unused areas',
    potentialSavings: '€650/month'
  }
])

const keyPerformanceIndicators = ref([
  {
    id: 1,
    name: language.value === 'de' ? 'Raumauslastung' : 'Room Utilization',
    value: '87%',
    target: '90%',
    trend: 'up',
    change: '+12%'
  },
  {
    id: 2,
    name: language.value === 'de' ? 'Lehrerauslastung' : 'Teacher Utilization',
    value: '92%',
    target: '85%',
    trend: 'up',
    change: '+8%'
  },
  {
    id: 3,
    name: language.value === 'de' ? 'Energieeffizienz' : 'Energy Efficiency',
    value: '78%',
    target: '85%',
    trend: 'up',
    change: '+5%'
  },
  {
    id: 4,
    name: language.value === 'de' ? 'Planungskonflikte' : 'Scheduling Conflicts',
    value: '3',
    target: '0',
    trend: 'down',
    change: '-65%'
  }
])

const refreshData = () => {
  alert(language.value === 'de' ? 'Daten werden aktualisiert...' : 'Refreshing data...')
}

const exportReport = () => {
  alert(language.value === 'de' ? 'Bericht wird exportiert...' : 'Exporting report...')
}

const viewMetricDetails = (metric: any) => {
  alert(`${language.value === 'de' ? 'Metrik-Details anzeigen' : 'View metric details'}: ${metric.name}`)
}

const applyPrediction = (prediction: any) => {
  alert(`${language.value === 'de' ? 'Vorhersage anwenden' : 'Apply prediction'}: ${prediction.title}`)
}

const viewPredictionDetails = (prediction: any) => {
  alert(`${language.value === 'de' ? 'Vorhersage-Details anzeigen' : 'View prediction details'}: ${prediction.title}`)
}

const addressWaste = (waste: any) => {
  alert(`${language.value === 'de' ? 'Verschwendung beheben' : 'Address waste'}: ${waste.title}`)
}

const customizeKPIs = () => {
  alert(language.value === 'de' ? 'KPIs anpassen' : 'Customize KPIs')
}

const getUtilizationColor = (utilization: number) => {
  if (utilization >= 90) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  if (utilization >= 75) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  if (utilization >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getUtilizationBarColor = (utilization: number) => {
  if (utilization >= 90) return 'bg-red-500'
  if (utilization >= 75) return 'bg-green-500'
  if (utilization >= 50) return 'bg-yellow-500'
  return 'bg-gray-500'
}

const getEfficiencyColor = (score: number) => {
  if (score >= 9) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  if (score >= 7) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  if (score >= 5) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const getEfficiencyBarColor = (score: number) => {
  if (score >= 9) return 'bg-green-500'
  if (score >= 7) return 'bg-blue-500'
  if (score >= 5) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'High':
      return 'text-red-600'
    case 'Medium':
      return 'text-yellow-600'
    case 'Low':
      return 'text-green-600'
    default:
      return 'text-gray-600'
  }
}

const getKPIProgress = (value: string, target: string) => {
  // Handle percentage values
  if (value.includes('%') && target.includes('%')) {
    const valueNum = parseFloat(value.replace('%', ''))
    const targetNum = parseFloat(target.replace('%', ''))
    return Math.min((valueNum / targetNum) * 100, 100)
  }
  
  // Handle numeric values
  const valueNum = parseFloat(value)
  const targetNum = parseFloat(target)
  
  // For metrics where lower is better (like conflicts)
  if (targetNum === 0) {
    return Math.max(0, 100 - (valueNum / 5) * 100) // Assuming 5 is the worst case
  }
  
  return Math.min((valueNum / targetNum) * 100, 100)
}

const getKPIProgressColor = (value: string, target: string) => {
  const progress = getKPIProgress(value, target)
  
  // For percentage metrics
  if (value.includes('%')) {
    if (progress >= 90) return 'bg-green-500'
    if (progress >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  // For numeric metrics where lower is better (like conflicts)
  if (target === '0') {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  // Default case
  if (progress >= 90) return 'bg-green-500'
  if (progress >= 70) return 'bg-yellow-500'
  return 'bg-red-500'
}
</script>