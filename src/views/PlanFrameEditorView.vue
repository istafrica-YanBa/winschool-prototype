<template>
  <div class="plan-frame-editor bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            Plan Frame Editor
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            Create and manage plan frames with time periods and calendars
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button 
          @click="exportFrames"
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
        <button 
          @click="createNewFrame"
          class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Frame
        </button>
      </div>
    </div>

    <!-- Stats Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200" style="font-family: Inter, sans-serif;">{{ totalFrames }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400" style="font-family: Inter, sans-serif;">Total Frames</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200" style="font-family: Inter, sans-serif;">{{ activeFrames }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400" style="font-family: Inter, sans-serif;">Active Frames</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200" style="font-family: Inter, sans-serif;">{{ totalHours }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400" style="font-family: Inter, sans-serif;">Total Hours</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200" style="font-family: Inter, sans-serif;">{{ currentSemester }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400" style="font-family: Inter, sans-serif;">Current Semester</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Plan Frames List -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center" style="font-family: Inter, sans-serif;">
                <svg class="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Plan Frames
              </h2>
              <div class="flex items-center space-x-2">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search frames..."
                  class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  style="font-family: Inter, sans-serif;"
                />
                <button
                  @click="toggleView"
                  class="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  :title="viewMode === 'list' ? 'Switch to Grid View' : 'Switch to List View'"
                >
                  <svg v-if="viewMode === 'list'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="p-6">
            <!-- List View -->
            <div v-if="viewMode === 'list'" class="space-y-4">
              <div
                v-for="frame in filteredFrames"
                :key="frame.id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group"
                @click="editFrame(frame)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <h3 class="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" style="font-family: Inter, sans-serif;">
                        {{ frame.name }}
                      </h3>
                      <span 
                        :class="getStatusBadgeClass(frame.status)"
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        style="font-family: Inter, sans-serif;"
                      >
                        {{ frame.status }}
                      </span>
                    </div>
                    
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-3" style="font-family: Inter, sans-serif;">{{ frame.description || 'No description available' }}</p>
                    
                    <div class="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ frame.semester }}
                      </span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ frame.totalHours }}h
                      </span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(frame.startDate) }} - {{ formatDate(frame.endDate) }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2 ml-4">
                    <button
                      @click.stop="duplicateFrame(frame)"
                      class="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Duplicate"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      @click.stop="deleteFrame(frame)"
                      class="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredFrames.length === 0" class="text-center py-12">
              <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2" style="font-family: Inter, sans-serif;">
                No Plan Frames Found
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6" style="font-family: Inter, sans-serif;">
                Get started by creating your first plan frame.
              </p>
              <button 
                @click="createNewFrame"
                class="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                style="font-family: Inter, sans-serif;"
              >
                Create First Plan Frame
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Frame Editor -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center" style="font-family: Inter, sans-serif;">
              <svg class="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ editingFrame ? 'Edit Frame' : 'New Frame' }}
            </h3>
          </div>
          
          <div class="p-6">
            <form @submit.prevent="saveFrame" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">
                  Frame Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="frameForm.name"
                  type="text"
                  required
                  class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 dark:text-slate-200 transition-all"
                  style="font-family: Inter, sans-serif;"
                  placeholder="Enter frame name..."
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">Days</label>
                  <input
                    v-model.number="frameForm.days"
                    type="number"
                    min="1"
                    class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 dark:text-slate-200 transition-all"
                    style="font-family: Inter, sans-serif;"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">Hours/Day</label>
                  <input
                    v-model.number="frameForm.hoursPerDay"
                    type="number"
                    min="1"
                    step="0.5"
                    class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 dark:text-slate-200 transition-all"
                    style="font-family: Inter, sans-serif;"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">Semester</label>
                <input
                  v-model="frameForm.semester"
                  type="text"
                  class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 dark:text-slate-200 transition-all"
                  style="font-family: Inter, sans-serif;"
                  placeholder="e.g. Fall 2024"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">Start Date</label>
                  <input
                    v-model="frameForm.startDate"
                    type="date"
                    class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 dark:text-slate-200 transition-all"
                    style="font-family: Inter, sans-serif;"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">End Date</label>
                  <input
                    v-model="frameForm.endDate"
                    type="date"
                    class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 dark:text-slate-200 transition-all"
                    style="font-family: Inter, sans-serif;"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">Week Pattern</label>
                <select
                  v-model="frameForm.weekPattern"
                  class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 dark:text-slate-200 transition-all"
                  style="font-family: Inter, sans-serif;"
                >
                  <option value="standard">Standard</option>
                  <option value="alternating">Alternating</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">Status</label>
                <select
                  v-model="frameForm.status"
                  class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 dark:text-slate-200 transition-all"
                  style="font-family: Inter, sans-serif;"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div class="flex space-x-3 pt-4">
                <button
                  type="submit"
                  :disabled="isSaving"
                  class="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  style="font-family: Inter, sans-serif;"
                >
                  {{ isSaving ? 'Saving...' : (editingFrame ? 'Update Frame' : 'Create Frame') }}
                </button>
                <button
                  v-if="editingFrame"
                  type="button"
                  @click="cancelEdit"
                  class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  style="font-family: Inter, sans-serif;"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface PlanFrame {
  id: string
  name: string
  days: number
  hoursPerDay: number
  totalHours: number
  semester: string
  startDate: string
  endDate: string
  weekPattern: string
  status: string
  description?: string
  createdAt: string
  updatedAt: string
}

// State
const searchQuery = ref('')
const filterStatus = ref('')
const editingFrame = ref<PlanFrame | null>(null)
const isSaving = ref(false)
const viewMode = ref<'list' | 'grid'>('list')

// Form data
const frameForm = ref({
  name: '',
  days: 180,
  hoursPerDay: 6,
  semester: '',
  startDate: '',
  endDate: '',
  weekPattern: 'standard',
  status: 'draft'
})

// Mock data
const planFrames = ref<PlanFrame[]>([
  {
    id: '1',
    name: 'Fall Semester 2024',
    days: 180,
    hoursPerDay: 6,
    totalHours: 1080,
    semester: 'Fall 2024',
    startDate: '2024-09-01',
    endDate: '2025-01-15',
    weekPattern: 'standard',
    status: 'active',
    description: 'Main academic semester for fall period',
    createdAt: '2024-08-15T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Spring Semester 2025',
    days: 165,
    hoursPerDay: 6.5,
    totalHours: 1072,
    semester: 'Spring 2025',
    startDate: '2025-02-01',
    endDate: '2025-06-15',
    weekPattern: 'standard',
    status: 'draft',
    description: 'Spring academic semester planning frame',
    createdAt: '2024-11-10T09:00:00Z',
    updatedAt: '2024-11-10T09:00:00Z'
  },
  {
    id: '3',
    name: 'Summer Intensive 2024',
    days: 60,
    hoursPerDay: 8,
    totalHours: 480,
    semester: 'Summer 2024',
    startDate: '2024-06-01',
    endDate: '2024-07-30',
    weekPattern: 'alternating',
    status: 'archived',
    description: 'Intensive summer program with extended hours',
    createdAt: '2024-05-01T08:00:00Z',
    updatedAt: '2024-05-15T16:00:00Z'
  }
])

// Computed
const filteredFrames = computed(() => {
  let frames = planFrames.value

  if (searchQuery.value) {
    frames = frames.filter(frame =>
      frame.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      frame.semester.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterStatus.value) {
    frames = frames.filter(frame => frame.status === filterStatus.value)
  }

  return frames
})

const totalFrames = computed(() => planFrames.value.length)
const activeFrames = computed(() => planFrames.value.filter(f => f.status === 'active').length)
const totalHours = computed(() => planFrames.value.reduce((sum, f) => sum + f.totalHours, 0))
const currentSemester = computed(() => {
  const activeFrame = planFrames.value.find(f => f.status === 'active')
  return activeFrame ? activeFrame.semester : 'None'
})

// Methods
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
    case 'draft':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
    case 'archived':
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const toggleView = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

const createNewFrame = () => {
  editingFrame.value = null
  frameForm.value = {
    name: '',
    days: 180,
    hoursPerDay: 6,
    semester: '',
    startDate: '',
    endDate: '',
    weekPattern: 'standard',
    status: 'draft'
  }
}

const editFrame = (frame: PlanFrame) => {
  editingFrame.value = frame
  frameForm.value = {
    name: frame.name,
    days: frame.days,
    hoursPerDay: frame.hoursPerDay,
    semester: frame.semester,
    startDate: frame.startDate,
    endDate: frame.endDate,
    weekPattern: frame.weekPattern,
    status: frame.status
  }
}

const saveFrame = async () => {
  isSaving.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const totalHours = frameForm.value.days * frameForm.value.hoursPerDay
    
    if (editingFrame.value) {
      // Update existing frame
      const index = planFrames.value.findIndex(f => f.id === editingFrame.value!.id)
      if (index !== -1) {
        planFrames.value[index] = {
          ...editingFrame.value,
          ...frameForm.value,
          totalHours,
          updatedAt: new Date().toISOString()
        }
      }
    } else {
      // Create new frame
      const newFrame: PlanFrame = {
        id: Date.now().toString(),
        ...frameForm.value,
        totalHours,
        description: `Plan frame for ${frameForm.value.semester}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      planFrames.value.unshift(newFrame)
    }
    
    createNewFrame()
    console.log('Frame saved successfully')
  } catch (error) {
    console.error('Error saving frame:', error)
  } finally {
    isSaving.value = false
  }
}

const cancelEdit = () => {
  createNewFrame()
}

const duplicateFrame = (frame: PlanFrame) => {
  const newFrame: PlanFrame = {
    ...frame,
    id: Date.now().toString(),
    name: `${frame.name} (Copy)`,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  planFrames.value.unshift(newFrame)
  console.log('Frame duplicated')
}

const deleteFrame = (frame: PlanFrame) => {
  if (confirm(`Are you sure you want to delete "${frame.name}"?`)) {
    const index = planFrames.value.findIndex(f => f.id === frame.id)
    if (index !== -1) {
      planFrames.value.splice(index, 1)
      if (editingFrame.value?.id === frame.id) {
        createNewFrame()
      }
    }
    console.log('Frame deleted')
  }
}

const exportFrames = () => {
  console.log('Exporting frames...')
  
  // Generate CSV content
  const headers = ['Name', 'Semester', 'Days', 'Hours Per Day', 'Total Hours', 'Start Date', 'End Date', 'Status']
  const csvContent = [
    headers.join(','),
    ...planFrames.value.map(frame => [
      `"${frame.name}"`,
      `"${frame.semester}"`,
      frame.days,
      frame.hoursPerDay,
      frame.totalHours,
      `"${frame.startDate}"`,
      `"${frame.endDate}"`,
      `"${frame.status}"`
    ].join(','))
  ].join('\n')
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `plan-frames-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

// Lifecycle
onMounted(() => {
  console.log('Plan Frame Editor mounted')
})
</script>

<style scoped>
.plan-frame-editor {
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
