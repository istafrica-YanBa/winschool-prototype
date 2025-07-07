<template>
  <div class="conflict-resolution bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            Conflict Resolution
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            Identify and resolve scheduling conflicts and resource conflicts
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button 
          @click="scanForConflicts"
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Scan Conflicts
        </button>
        <button 
          @click="autoResolve"
          class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Auto Resolve
        </button>
      </div>
    </div>

    <!-- Stats Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ totalConflicts }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Conflicts</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ criticalConflicts }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Critical</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ resolvedConflicts }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Resolved</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ autoResolved }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Auto-Resolved</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">
            Conflict Type
          </label>
          <select
            v-model="filters.type"
            class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50"
            style="font-family: Inter, sans-serif;"
          >
            <option value="">All Types</option>
            <option value="scheduling">Scheduling Conflict</option>
            <option value="resource">Resource Conflict</option>
            <option value="teacher">Teacher Overload</option>
            <option value="room">Room Allocation</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">
            Severity
          </label>
          <select
            v-model="filters.severity"
            class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50"
            style="font-family: Inter, sans-serif;"
          >
            <option value="">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">
            Status
          </label>
          <select
            v-model="filters.status"
            class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50"
            style="font-family: Inter, sans-serif;"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">
            Department
          </label>
          <select
            v-model="filters.department"
            class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50"
            style="font-family: Inter, sans-serif;"
          >
            <option value="">All Departments</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Conflicts List -->
    <div class="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-50" style="font-family: Inter, sans-serif;">Active Conflicts</h2>
        <div class="flex items-center space-x-2">
          <button
            @click="refreshConflicts"
            class="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-300 flex items-center space-x-1"
            style="font-family: Inter, sans-serif;"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="conflict in filteredConflicts"
          :key="conflict.id"
          class="border border-gray-200 dark:border-slate-700 rounded-xl p-4 hover:border-red-300 dark:hover:border-red-500 transition-colors"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center space-x-3">
              <div 
                class="w-3 h-3 rounded-full"
                :class="getSeverityColor(conflict.severity)"
              ></div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-slate-50" style="font-family: Inter, sans-serif;">{{ conflict.title }}</h3>
                <div class="flex items-center space-x-4 mt-1">
                  <span 
                    :class="getTypeBadgeClass(conflict.type)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    style="font-family: Inter, sans-serif;"
                  >
                    {{ conflict.type }}
                  </span>
                  <span 
                    :class="getSeverityBadgeClass(conflict.severity)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    style="font-family: Inter, sans-serif;"
                  >
                    {{ conflict.severity }}
                  </span>
                  <span class="text-xs text-gray-500" style="font-family: Inter, sans-serif;">
                    {{ formatDate(conflict.detectedAt) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span 
                :class="getStatusBadgeClass(conflict.status)"
                class="px-2 py-1 text-xs font-medium rounded-full"
                style="font-family: Inter, sans-serif;"
              >
                {{ conflict.status }}
              </span>
              <button
                @click="viewConflictDetails(conflict)"
                class="text-red-600 hover:text-red-800 transition-colors"
                title="View Details"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <p class="text-sm text-gray-600 mb-4" style="font-family: Inter, sans-serif;">{{ conflict.description }}</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-gray-50 rounded-lg p-3">
              <h4 class="text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">Affected Resources</h4>
              <div class="space-y-1">
                <div
                  v-for="resource in conflict.affectedResources"
                  :key="resource"
                  class="text-sm text-gray-600"
                  style="font-family: Inter, sans-serif;"
                >
                  {{ resource }}
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-3">
              <h4 class="text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">Suggested Solutions</h4>
              <div class="space-y-1">
                <div
                  v-for="solution in conflict.suggestedSolutions"
                  :key="solution"
                  class="text-sm text-gray-600"
                  style="font-family: Inter, sans-serif;"
                >
                  • {{ solution }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center">
            <div class="text-xs text-gray-500" style="font-family: Inter, sans-serif;">
              Impact: {{ conflict.impact }} | Priority: {{ conflict.priority }}
            </div>
            <div class="flex items-center space-x-2">
              <button
                v-if="conflict.status === 'open'"
                @click="resolveConflict(conflict)"
                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                style="font-family: Inter, sans-serif;"
              >
                Resolve
              </button>
              <button
                v-if="conflict.autoResolvable"
                @click="autoResolveConflict(conflict)"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                style="font-family: Inter, sans-serif;"
              >
                Auto Resolve
              </button>
              <button
                @click="postponeConflict(conflict)"
                class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                style="font-family: Inter, sans-serif;"
              >
                Postpone
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredConflicts.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900" style="font-family: Inter, sans-serif;">No conflicts found</h3>
        <p class="mt-1 text-sm text-gray-500" style="font-family: Inter, sans-serif;">All scheduling and resource conflicts have been resolved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Types
interface Conflict {
  id: string
  title: string
  type: 'scheduling' | 'resource' | 'teacher' | 'room'
  severity: 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'resolved'
  description: string
  detectedAt: string
  affectedResources: string[]
  suggestedSolutions: string[]
  impact: string
  priority: number
  autoResolvable: boolean
  department?: string
  resolutionType?: 'AUTO' | 'MANUAL'
}

// State
const filters = ref({
  type: '',
  severity: '',
  status: '',
  department: ''
})

// Mock Data
const conflicts = ref<Conflict[]>([
  {
    id: '1',
    title: 'Teacher Double Booking',
    type: 'scheduling',
    severity: 'high',
    status: 'open',
    description: 'Dr. Smith is scheduled for two classes at the same time on Monday 10:00 AM',
    detectedAt: '2024-12-18T09:30:00Z',
    affectedResources: ['Dr. Smith', 'Math 101 Class', 'Physics 201 Class'],
    suggestedSolutions: ['Reschedule Physics 201 to Tuesday', 'Assign substitute teacher', 'Move to different time slot'],
    impact: 'High - Affects 50 students',
    priority: 1,
    autoResolvable: true,
    department: 'Mathematics'
  },
  {
    id: '2',
    title: 'Room Capacity Exceeded',
    type: 'room',
    severity: 'medium',
    status: 'open',
    description: 'Room A101 assigned to class with 35 students but capacity is only 30',
    detectedAt: '2024-12-18T08:15:00Z',
    affectedResources: ['Room A101', 'Chemistry 101', '35 Students'],
    suggestedSolutions: ['Move to larger room B205', 'Split class into two sessions', 'Use laboratory space'],
    impact: 'Medium - Safety concern',
    priority: 2,
    autoResolvable: false,
    department: 'Science'
  },
  {
    id: '3',
    title: 'Equipment Double Allocation',
    type: 'resource',
    severity: 'low',
    status: 'in-progress',
    description: 'Projector #5 allocated to two different classes simultaneously',
    detectedAt: '2024-12-18T07:45:00Z',
    affectedResources: ['Projector #5', 'English 102', 'History 201'],
    suggestedSolutions: ['Use alternative projector', 'Reschedule one class', 'Use smart board instead'],
    impact: 'Low - Alternative available',
    priority: 3,
    autoResolvable: true,
    department: 'English'
  }
])

// Computed
const filteredConflicts = computed(() => {
  let filtered = conflicts.value

  if (filters.value.type) {
    filtered = filtered.filter(conflict => conflict.type === filters.value.type)
  }

  if (filters.value.severity) {
    filtered = filtered.filter(conflict => conflict.severity === filters.value.severity)
  }

  if (filters.value.status) {
    filtered = filtered.filter(conflict => conflict.status === filters.value.status)
  }

  if (filters.value.department) {
    filtered = filtered.filter(conflict => conflict.department === filters.value.department)
  }

  return filtered.sort((a, b) => a.priority - b.priority)
})

const totalConflicts = computed(() => conflicts.value.length)
const criticalConflicts = computed(() => conflicts.value.filter(c => c.severity === 'high').length)
const resolvedConflicts = computed(() => conflicts.value.filter(c => c.status === 'resolved').length)
const autoResolved = computed(() => conflicts.value.filter(c => c.resolutionType === 'AUTO').length)

// Methods
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-red-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

const getTypeBadgeClass = (type: string) => {
  switch (type) {
    case 'scheduling': return 'bg-purple-100 text-purple-800'
    case 'resource': return 'bg-blue-100 text-blue-800'
    case 'teacher': return 'bg-orange-100 text-orange-800'
    case 'room': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getSeverityBadgeClass = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-red-100 text-red-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'open': return 'bg-red-100 text-red-800'
    case 'in-progress': return 'bg-yellow-100 text-yellow-800'
    case 'resolved': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const scanForConflicts = async () => {
  console.log('Scanning for conflicts...')
  // Simulate conflict detection
  await new Promise(resolve => setTimeout(resolve, 2000))
  console.log('Conflict scan completed')
}

const autoResolve = async () => {
  console.log('Auto-resolving conflicts...')
  const autoResolvableConflicts = conflicts.value.filter(c => c.autoResolvable && c.status === 'open')
  
  for (const conflict of autoResolvableConflicts) {
    conflict.status = 'resolved'
  }
  
  console.log(`Auto-resolved ${autoResolvableConflicts.length} conflicts`)
}

const resolveConflict = (conflict: Conflict) => {
  console.log(`Resolving conflict: ${conflict.title}`)
  conflict.status = 'resolved'
}

const autoResolveConflict = (conflict: Conflict) => {
  console.log(`Auto-resolving conflict: ${conflict.title}`)
  conflict.status = 'resolved'
}

const postponeConflict = (conflict: Conflict) => {
  console.log(`Postponing conflict: ${conflict.title}`)
  conflict.status = 'in-progress'
}

const viewConflictDetails = (conflict: Conflict) => {
  console.log('Viewing conflict details:', conflict)
  // Implementation for detailed conflict view
}

const refreshConflicts = () => {
  console.log('Refreshing conflicts...')
  // Implementation for refreshing conflict data
}

// Lifecycle
onMounted(() => {
  console.log('Conflict Resolution View mounted')
})
</script>

<style scoped>
.conflict-resolution {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 
