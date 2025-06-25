<template>
  <div class="advanced-timetable bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex justify-between items-start">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-4">
            <svg class="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-500 dark:text-slate-400" style="font-family: Inter, sans-serif;">
              Advanced Timetable
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
              Interactive drag-and-drop timetable management system
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="undoLastMove"
            :disabled="!canUndo"
            class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-200 flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            style="font-family: Inter, sans-serif;"
            title="Undo last move"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span class="text-sm">Undo</span>
          </button>
          <button 
            @click="refreshData"
            class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-200 flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700"
            style="font-family: Inter, sans-serif;"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="text-sm">Refresh</span>
          </button>
          <button 
            @click="exportTimetable"
            class="bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            style="font-family: Inter, sans-serif;"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-sm">Export</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400" style="font-family: Inter, sans-serif;">{{ timetableStats.totalHours }}</div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Total Hours</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-600 dark:text-green-400" style="font-family: Inter, sans-serif;">{{ timetableStats.classesScheduled }}</div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Classes Scheduled</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400" style="font-family: Inter, sans-serif;">{{ timetableStats.freeSlots }}</div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Free Slots</div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400" style="font-family: Inter, sans-serif;">{{ timetableStats.teachersAssigned }}</div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Teachers Assigned</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Timetable Controls -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-6">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-winschool-primary rounded-xl flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200" style="font-family: Inter, sans-serif;">Timetable Controls</h2>
          </div>
          
          <form @submit.prevent="generateTimetable" class="space-y-4">
            <div class="grid grid-cols-1 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">
                  <svg class="w-4 h-4 inline mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Time Period
                </label>
                <select
                  v-model="timetableSettings.period"
                  required
                  class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all"
                  style="font-family: Inter, sans-serif;"
                >
                  <option value="">Select Period</option>
                  <option value="Morning">🌅 Morning (8:00 - 12:00)</option>
                  <option value="Afternoon">🌞 Afternoon (13:00 - 17:00)</option>
                  <option value="Full Day">🌅🌞 Full Day (8:00 - 17:00)</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">
                  <svg class="w-4 h-4 inline mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Class
                </label>
                <select
                  v-model="timetableSettings.class"
                  required
                  class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all"
                  style="font-family: Inter, sans-serif;"
                >
                  <option value="">Select Class</option>
                  <option v-for="cls in classes" :key="cls" :value="cls">🎓 {{ cls }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">
                  <svg class="w-4 h-4 inline mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Mode
                </label>
                <select
                  v-model="viewMode"
                  class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all"
                  style="font-family: Inter, sans-serif;"
                >
                  <option value="class">👥 By Class</option>
                  <option value="teacher">👨‍🏫 By Teacher</option>
                  <option value="room">🏫 By Room</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isGenerating"
              class="w-full bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              style="font-family: Inter, sans-serif;"
            >
              <svg v-if="isGenerating" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{{ isGenerating ? 'Generating...' : 'Generate Timetable' }}</span>
            </button>
          </form>
        </div>

        <!-- Available Subjects Pool -->
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200" style="font-family: Inter, sans-serif;">Available Subjects</h3>
            <button
              @click="showSubjectLegend = !showSubjectLegend"
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              style="font-family: Inter, sans-serif;"
            >
              {{ showSubjectLegend ? 'Hide' : 'Show' }} Legend
            </button>
          </div>
          
          <!-- Subject Legend -->
          <div v-if="showSubjectLegend" class="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">Color Code:</h4>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span class="text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">Math/Science</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span class="text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">Languages</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                <span class="text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">Arts/Social</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                <span class="text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">Practical</span>
              </div>
            </div>
          </div>

          <div class="space-y-2 max-h-80 overflow-y-auto">
            <div
              v-for="subject in availableSubjects"
              :key="subject.id"
              :draggable="true"
              @dragstart="startDrag($event, subject)"
              :class="getSubjectCardClass(subject.type)"
              class="p-3 rounded-md text-sm cursor-move hover:shadow-md transition-all duration-200 transform hover:scale-105"
              style="font-family: Inter, sans-serif;"
            >
              <div class="font-semibold text-gray-900 dark:text-gray-100">{{ subject.name }}</div>
              <div class="text-xs opacity-75 mt-1 text-gray-700 dark:text-gray-300">{{ subject.teacher }}</div>
              <div class="text-xs opacity-75 text-gray-700 dark:text-gray-300">{{ subject.room }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timetable Grid -->
      <div class="lg:col-span-3">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center" style="font-family: Inter, sans-serif;">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Interactive Timetable Grid
              </h2>
              <div class="flex items-center space-x-2">
                <button
                  @click="lockAllSlots = !lockAllSlots"
                  :class="lockAllSlots ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'"
                  class="px-3 py-1 text-xs border rounded-full transition-colors"
                  style="font-family: Inter, sans-serif;"
                >
                  <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {{ lockAllSlots ? 'Unlock All' : 'Lock All' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Timetable Grid -->
          <div class="p-6 overflow-x-auto">
            <div class="min-w-full">
              <!-- Header Row -->
              <div class="grid grid-cols-6 gap-2 mb-2">
                <div class="text-center font-semibold text-gray-700 dark:text-gray-100 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600" style="font-family: Inter, sans-serif; min-width: 100px;">Time</div>
                <div
                  v-for="day in weekDays"
                  :key="day"
                  class="text-center font-semibold text-gray-700 dark:text-gray-100 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  style="font-family: Inter, sans-serif;"
                >
                  {{ day }}
                </div>
              </div>

              <!-- Time Slot Rows -->
              <div class="space-y-2">
                <div
                  v-for="(timeSlot, timeIndex) in timeSlots"
                  :key="timeIndex"
                  class="grid grid-cols-6 gap-2"
                >
                  <!-- Time Column -->
                  <div class="flex items-center justify-center py-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-600" style="font-family: Inter, sans-serif; min-width: 100px;">
                    {{ timeSlot }}
                  </div>

                  <!-- Day Columns -->
                  <div
                    v-for="(day, dayIndex) in weekDays"
                    :key="day"
                    class="relative min-h-20"
                  >
                    <div
                      @drop="handleDrop($event, day, timeSlot)"
                      @dragover.prevent
                      @dragenter.prevent
                      :class="getSlotClass(day, timeSlot)"
                      class="w-full h-full rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 p-2 transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
                    >
                      <!-- Existing Subject Block -->
                      <div
                        v-if="getTimetableCell(day, timeSlot)"
                        :draggable="!isSlotLocked(day, timeSlot)"
                        @dragstart="startDragFromSlot($event, day, timeSlot)"
                        :class="getSubjectCardClass(getTimetableCell(day, timeSlot).type)"
                        class="w-full h-full rounded-md p-2 cursor-move hover:shadow-md transition-all duration-200 relative group"
                        style="font-family: Inter, sans-serif;"
                      >
                        <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            @click="toggleSlotLock(day, timeSlot)"
                            :class="isSlotLocked(day, timeSlot) ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'"
                            class="hover:text-gray-600 dark:hover:text-gray-300 p-1"
                            title="Toggle lock"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </button>
                          <button
                            @click="clearSlot(day, timeSlot)"
                            class="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
                            title="Remove class"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div class="text-xs font-semibold truncate text-gray-900 dark:text-gray-100">{{ getTimetableCell(day, timeSlot).name }}</div>
                        <div class="text-xs opacity-75 truncate text-gray-700 dark:text-gray-200">{{ getTimetableCell(day, timeSlot).teacher }}</div>
                        <div class="text-xs opacity-75 truncate text-gray-700 dark:text-gray-200">{{ getTimetableCell(day, timeSlot).room }}</div>
                      </div>

                      <!-- Empty Slot Placeholder -->
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs"
                        style="font-family: Inter, sans-serif;"
                      >
                        Drop subject here
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Constants
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeSlots = [
  '8:00 - 9:30',
  '9:45 - 11:15', 
  '11:30 - 13:00',
  '13:30 - 15:00',
  '15:15 - 16:45'
]

const classes = [
  'Class 10A',
  'Class 10B', 
  'Class 11A',
  'Class 11B',
  'Class 12A',
  'Class 12B'
]

// Subject Types for Color Coding
const subjectTypes = {
  'Mathematics': 'math',
  'Physics': 'math',
  'Chemistry': 'math',
  'Biology': 'math',
  'English': 'language',
  'French': 'language',
  'History': 'social',
  'Geography': 'social',
  'Art': 'social',
  'Physical Education': 'practical',
  'Computer Science': 'practical',
  'Music': 'social'
}

// State Management
const isGenerating = ref(false)
const showSubjectLegend = ref(false)
const viewMode = ref('class')
const lockAllSlots = ref(false)
const canUndo = ref(false)
const lastAction = ref<any>(null)

const timetableSettings = ref({
  period: '',
  class: '',
  teacher: '',
  room: ''
})

// Enhanced Mock Data for Available Subjects
const availableSubjects = ref([
  { id: 1, name: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', type: 'math' },
  { id: 2, name: 'Physics', teacher: 'Prof. Johnson', room: 'Lab A', type: 'math' },
  { id: 3, name: 'Chemistry', teacher: 'Dr. Wilson', room: 'Lab B', type: 'math' },
  { id: 4, name: 'Biology', teacher: 'Ms. Davis', room: 'Lab C', type: 'math' },
  { id: 5, name: 'English', teacher: 'Mr. Brown', room: 'Room 102', type: 'language' },
  { id: 6, name: 'French', teacher: 'Mme. Dubois', room: 'Room 103', type: 'language' },
  { id: 7, name: 'History', teacher: 'Dr. Taylor', room: 'Room 104', type: 'social' },
  { id: 8, name: 'Geography', teacher: 'Ms. Anderson', room: 'Room 105', type: 'social' },
  { id: 9, name: 'Art', teacher: 'Mr. Miller', room: 'Art Studio', type: 'social' },
  { id: 10, name: 'Physical Education', teacher: 'Coach Roberts', room: 'Gymnasium', type: 'practical' },
  { id: 11, name: 'Computer Science', teacher: 'Dr. Tech', room: 'Computer Lab', type: 'practical' },
  { id: 12, name: 'Music', teacher: 'Ms. Harmony', room: 'Music Room', type: 'social' }
])

// Timetable Data Structure
const timetable = ref<Record<string, Record<string, any>>>({
  'Monday': {
    '8:00 - 9:30': { id: 1, name: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', type: 'math' },
    '9:45 - 11:15': { id: 2, name: 'Physics', teacher: 'Prof. Johnson', room: 'Lab A', type: 'math' },
    '11:30 - 13:00': { id: 3, name: 'Chemistry', teacher: 'Dr. Wilson', room: 'Lab B', type: 'math' },
    '13:30 - 15:00': { id: 4, name: 'Biology', teacher: 'Ms. Davis', room: 'Lab C', type: 'math' },
    '15:15 - 16:45': { id: 5, name: 'English', teacher: 'Mr. Brown', room: 'Room 102', type: 'language' }
  },
  'Tuesday': {
    '8:00 - 9:30': { id: 2, name: 'Physics', teacher: 'Prof. Johnson', room: 'Lab A', type: 'math' },
    '9:45 - 11:15': { id: 1, name: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', type: 'math' },
    '11:30 - 13:00': { id: 4, name: 'Biology', teacher: 'Ms. Davis', room: 'Lab C', type: 'math' },
    '13:30 - 15:00': { id: 7, name: 'History', teacher: 'Dr. Taylor', room: 'Room 104', type: 'social' },
    '15:15 - 16:45': { id: 6, name: 'French', teacher: 'Mme. Dubois', room: 'Room 103', type: 'language' }
  },
  'Wednesday': {
    '8:00 - 9:30': { id: 3, name: 'Chemistry', teacher: 'Dr. Wilson', room: 'Lab B', type: 'math' },
    '9:45 - 11:15': { id: 5, name: 'English', teacher: 'Mr. Brown', room: 'Room 102', type: 'language' },
    '11:30 - 13:00': { id: 1, name: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', type: 'math' },
    '13:30 - 15:00': { id: 9, name: 'Art', teacher: 'Mr. Miller', room: 'Art Studio', type: 'social' },
    '15:15 - 16:45': { id: 10, name: 'Physical Education', teacher: 'Coach Roberts', room: 'Gymnasium', type: 'practical' }
  },
  'Thursday': {
    '8:00 - 9:30': { id: 4, name: 'Biology', teacher: 'Ms. Davis', room: 'Lab C', type: 'math' },
    '9:45 - 11:15': { id: 11, name: 'Computer Science', teacher: 'Dr. Tech', room: 'Computer Lab', type: 'practical' },
    '11:30 - 13:00': { id: 2, name: 'Physics', teacher: 'Prof. Johnson', room: 'Lab A', type: 'math' },
    '13:30 - 15:00': { id: 8, name: 'Geography', teacher: 'Ms. Anderson', room: 'Room 105', type: 'social' },
    '15:15 - 16:45': { id: 12, name: 'Music', teacher: 'Ms. Harmony', room: 'Music Room', type: 'social' }
  },
  'Friday': {
    '8:00 - 9:30': { id: 5, name: 'English', teacher: 'Mr. Brown', room: 'Room 102', type: 'language' },
    '9:45 - 11:15': { id: 7, name: 'History', teacher: 'Dr. Taylor', room: 'Room 104', type: 'social' },
    '11:30 - 13:00': { id: 6, name: 'French', teacher: 'Mme. Dubois', room: 'Room 103', type: 'language' },
    '13:30 - 15:00': { id: 1, name: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', type: 'math' },
    '15:15 - 16:45': { id: 3, name: 'Chemistry', teacher: 'Dr. Wilson', room: 'Lab B', type: 'math' }
  }
})

// Locked Slots Tracking
const lockedSlots = ref<Record<string, Record<string, boolean>>>({})

// Drag and Drop State
const draggedSubject = ref<any>(null)
const draggedFromSlot = ref<{ day: string; time: string } | null>(null)

// Computed Properties
const timetableStats = computed(() => {
  let totalHours = 0
  let classesScheduled = 0
  let freeSlots = 0
  const assignedTeachers = new Set()

  weekDays.forEach(day => {
    timeSlots.forEach(timeSlot => {
      const cell = timetable.value[day]?.[timeSlot]
      if (cell) {
        totalHours += 1.5 // Each slot is 1.5 hours
        classesScheduled++
        assignedTeachers.add(cell.teacher)
      } else {
        freeSlots++
      }
    })
  })

  return {
    totalHours: Math.round(totalHours),
    classesScheduled,
    freeSlots,
    teachersAssigned: assignedTeachers.size
  }
})

// Utility Methods
const getSubjectCardClass = (type: string) => {
  const baseClass = "bg-white dark:bg-gray-700 border-l-4 shadow"
  switch (type) {
    case 'math':
      return `${baseClass} border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20`
    case 'language':
      return `${baseClass} border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20`
    case 'social':
      return `${baseClass} border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20`
    case 'practical':
      return `${baseClass} border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20`
    default:
      return `${baseClass} border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600`
  }
}

const getSlotClass = (day: string, timeSlot: string) => {
  const isLocked = isSlotLocked(day, timeSlot)
  const hasContent = getTimetableCell(day, timeSlot)
  
  if (isLocked) {
    return 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
  }
  if (hasContent) {
    return 'border-transparent'
  }
  return 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
}

const getTimetableCell = (day: string, timeSlot: string) => {
  return timetable.value[day]?.[timeSlot]
}

const isSlotLocked = (day: string, timeSlot: string) => {
  return lockedSlots.value[day]?.[timeSlot] || lockAllSlots.value
}

// Drag and Drop Methods
const startDrag = (event: DragEvent, subject: any) => {
  draggedSubject.value = subject
  draggedFromSlot.value = null
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', event.target?.outerHTML || '')
  }
}

const startDragFromSlot = (event: DragEvent, day: string, timeSlot: string) => {
  if (isSlotLocked(day, timeSlot)) {
    event.preventDefault()
    return
  }
  
  const subject = getTimetableCell(day, timeSlot)
  if (subject) {
    draggedSubject.value = subject
    draggedFromSlot.value = { day, time: timeSlot }
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/html', event.target?.outerHTML || '')
    }
  }
}

const handleDrop = (event: DragEvent, day: string, timeSlot: string) => {
  event.preventDefault()
  
  if (isSlotLocked(day, timeSlot) || !draggedSubject.value) return
  
  // Save current state for undo
  saveStateForUndo()
  
  // If dragging from another slot, clear it first
  if (draggedFromSlot.value) {
    const { day: fromDay, time: fromTime } = draggedFromSlot.value
    if (timetable.value[fromDay]) {
      delete timetable.value[fromDay][fromTime]
    }
  }
  
  // Add to new slot
  if (!timetable.value[day]) {
    timetable.value[day] = {}
  }
  timetable.value[day][timeSlot] = { ...draggedSubject.value }
  
  // Reset drag state
  draggedSubject.value = null
  draggedFromSlot.value = null
  
  console.log(`Moved ${draggedSubject.value?.name} to ${day} ${timeSlot}`)
}

// Slot Management Methods
const clearSlot = (day: string, timeSlot: string) => {
  if (isSlotLocked(day, timeSlot)) return
  
  saveStateForUndo()
  
  if (timetable.value[day]) {
    delete timetable.value[day][timeSlot]
  }
}

const toggleSlotLock = (day: string, timeSlot: string) => {
  if (!lockedSlots.value[day]) {
    lockedSlots.value[day] = {}
  }
  lockedSlots.value[day][timeSlot] = !lockedSlots.value[day][timeSlot]
}

// Undo Functionality
const saveStateForUndo = () => {
  lastAction.value = {
    timetable: JSON.parse(JSON.stringify(timetable.value)),
    timestamp: Date.now()
  }
  canUndo.value = true
}

const undoLastMove = () => {
  if (lastAction.value && canUndo.value) {
    timetable.value = lastAction.value.timetable
    canUndo.value = false
    lastAction.value = null
    console.log('Undo completed')
  }
}

// Main Methods
const refreshData = () => {
  console.log('Refreshing timetable data...')
  // Simulate data refresh
}

const exportTimetable = () => {
  console.log('Exporting timetable...')
  
  // Generate CSV content
  const headers = ['Time', ...weekDays]
  const csvContent = [
    headers.join(','),
    ...timeSlots.map(timeSlot => [
      `"${timeSlot}"`,
      ...weekDays.map(day => {
        const cell = getTimetableCell(day, timeSlot)
        return cell ? `"${cell.name} - ${cell.teacher} - ${cell.room}"` : '""'
      })
    ].join(','))
  ].join('\n')
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `timetable-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const generateTimetable = async () => {
  if (!timetableSettings.value.period || !timetableSettings.value.class) {
    alert('Please select both time period and class')
    return
  }
  
  isGenerating.value = true
  
  try {
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Save current state for undo
    saveStateForUndo()
    
    // Clear existing timetable
    timetable.value = {}
    
    // Generate random timetable
    weekDays.forEach(day => {
      timetable.value[day] = {}
      timeSlots.forEach((timeSlot, index) => {
        // Skip lunch break
        if (index === 2 && timetableSettings.value.period === 'Full Day') {
          return
        }
        
        // Randomly assign subjects
        const randomSubject = availableSubjects.value[Math.floor(Math.random() * availableSubjects.value.length)]
        timetable.value[day][timeSlot] = { ...randomSubject }
      })
    })
    
    console.log('Auto-generated timetable for:', timetableSettings.value)
  } catch (error) {
    console.error('Error generating timetable:', error)
  } finally {
    isGenerating.value = false
  }
}

// Lifecycle
onMounted(() => {
  console.log('Advanced Timetable View mounted')
})
</script>
<style scoped>
/* Custom scrollbar for subject list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Drag and drop animations */
@keyframes dragHover {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.cursor-move:hover {
  animation: dragHover 0.6s ease-in-out infinite;
}

/* Enhanced focus states */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Smooth transitions for all interactive elements */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Grid layout responsiveness */
@media (max-width: 768px) {
  .grid-cols-6 {
    grid-template-columns: 1fr;
  }
  
  .min-h-20 {
    min-height: 4rem;
  }
}

/* Custom drop zone styling */
.border-dashed {
  transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

.border-dashed:hover {
  border-style: solid;
}

/* Subject card hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
  z-index: 10;
}

/* Lock indicator */
.bg-red-50 {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(239, 68, 68, 0.1) 5px,
    rgba(239, 68, 68, 0.1) 10px
  );
}

/* Enhanced shadow for cards */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Button loading state */
.disabled\:opacity-50:disabled {
  cursor: not-allowed;
  transform: none !important;
}

/* Responsive text scaling */
@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.875rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .text-lg {
    font-size: 1rem;
  }
}

/* Enhanced grid spacing for mobile */
@media (max-width: 1024px) {
  .lg\:col-span-3 {
    grid-column: span 1;
  }
  
  .lg\:col-span-1 {
    grid-column: span 1;
  }
}

/* Custom animation for undo button */
@keyframes undoAvailable {
  0%, 100% { 
    background-color: white;
    border-color: #d1d5db;
  }
  50% { 
    background-color: #fef3c7;
    border-color: #f59e0b;
  }
}

.animate-undo {
  animation: undoAvailable 2s ease-in-out infinite;
}

/* Subject type indicators */
.border-l-4 {
  border-left-width: 4px;
}

/* Enhanced grid cell styling */
.min-h-20 {
  min-height: 5rem;
}

/* Improved drag feedback */
.cursor-move {
  cursor: grab;
}

.cursor-move:active {
  cursor: grabbing;
}

/* Loading spinner customization */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Enhanced gradient effects */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Custom tooltip effects */
[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  margin-bottom: 4px;
}

/* Print optimizations */
@media print {
  .bg-gray-50 {
    background-color: white !important;
  }
  
  .shadow-md,
  .shadow-lg,
  .hover\:shadow-lg {
    box-shadow: none !important;
  }
  
  .rounded-xl,
  .rounded-lg {
    border-radius: 0 !important;
  }
  
  .text-white {
    color: black !important;
  }
  
  .bg-gradient-to-r {
    background: white !important;
    border: 1px solid #ccc !important;
  }
}

/* Legend color dots - force proper colors */
.bg-blue-500 {
  background-color: #3b82f6 !important;
}

.bg-green-500 {
  background-color: #10b981 !important;
}

.bg-purple-500 {
  background-color: #8b5cf6 !important;
}

.bg-orange-500 {
  background-color: #f97316 !important;
}

/* Ensure legend text is visible */
.text-gray-700 {
  color: #374151 !important;
}

/* Force time column visibility */
.grid-cols-6 > div:first-child {
  min-width: 100px !important;
  background-color: var(--tw-gray-50) !important;
}

.dark .grid-cols-6 > div:first-child {
  background-color: rgb(55 65 81) !important; /* gray-700 */
  color: rgb(243 244 246) !important; /* gray-100 */
  border-color: rgb(75 85 99) !important; /* gray-600 */
}

/* Ensure grid layout is preserved */
.grid-cols-6 {
  grid-template-columns: minmax(100px, 1fr) repeat(5, 1fr);
}

/* Force day headers visibility in dark mode */
.dark .grid-cols-6 > div:not(:first-child) {
  background-color: rgb(55 65 81) !important; /* gray-700 */
  color: rgb(243 244 246) !important; /* gray-100 */
  border-color: rgb(75 85 99) !important; /* gray-600 */
}

/* Enhanced visibility for course details in dark mode */
.dark .text-gray-700 {
  color: rgb(229 231 235) !important; /* gray-200 */
}

/* Better contrast for buttons in dark mode */
.dark .text-gray-400 {
  color: rgb(156 163 175) !important; /* gray-400 */
}

.dark .hover\:text-gray-600:hover {
  color: rgb(209 213 219) !important; /* gray-300 */
}

/* Enhanced subject card text in dark mode */
.dark .opacity-75 {
  opacity: 0.9 !important;
}

/* Force visibility for lock/unlock buttons */
.dark .group:hover .text-red-500 {
  color: rgb(248 113 113) !important; /* red-400 */
}

.dark .group:hover .text-gray-400 {
  color: rgb(156 163 175) !important; /* gray-400 */
}

/* Enhanced hover states for dark mode */
.dark .hover\:text-red-700:hover {
  color: rgb(252 165 165) !important; /* red-300 */
}

/* Ensure time slot text is always visible */
.dark .text-sm.font-medium {
  color: rgb(243 244 246) !important; /* gray-100 */
  font-weight: 600 !important;
}
</style>
