<template>
  <div class="advanced-planning bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Erweiterte Planung' : 'Advanced Planning' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Intelligente Planungsalgorithmen und -optimierung' : 'Intelligent planning algorithms and optimization' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <router-link
          to="/dashboard/support"
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <LifeBuoy class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Support' : 'Support' }}
        </router-link>
        <button @click="refreshData" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ language === 'de' ? 'Aktualisieren' : 'Refresh' }}
        </button>
        <button @click="exportPlan" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ language === 'de' ? 'Plan exportieren' : 'Export Plan' }}
        </button>
      </div>
    </div>
    
    <!-- Quick Access to Advanced Planning Features -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-slate-500 dark:text-slate-400 mb-6" style="font-family: Inter, sans-serif;">
        Advanced Planning Tools
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <!-- Plan Frame Editor -->
        <router-link
          to="/dashboard/plan-frame-editor"
          class="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500"
        >
          <div class="w-12 h-12 bg-winschool-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-2" style="font-family: Inter, sans-serif;">
            Plan Frame Editor
          </h3>
          <p class="text-sm text-gray-600 dark:text-slate-400" style="font-family: Inter, sans-serif;">
            Create and manage plan frames with time periods and calendars
          </p>
        </router-link>

        <!-- Course Editor -->
        <router-link
          to="/dashboard/course-editor"
          class="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500"
        >
          <div class="w-12 h-12 bg-winschool-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-2" style="font-family: Inter, sans-serif;">
            Course Editor
          </h3>
          <p class="text-sm text-gray-600 dark:text-slate-400" style="font-family: Inter, sans-serif;">
            Create and manage courses with units, teachers, and room assignments
          </p>
        </router-link>

        <!-- Student Course Assignment -->
        <router-link
          to="/dashboard/student-course-assignment"
          class="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500"
        >
          <div class="w-12 h-12 bg-winschool-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-2" style="font-family: Inter, sans-serif;">
            Student Assignment
          </h3>
          <p class="text-sm text-gray-600 dark:text-slate-400" style="font-family: Inter, sans-serif;">
            Assign students to courses and manage course enrollment
          </p>
        </router-link>

        <!-- Hourly Monitor -->
        <router-link
          to="/dashboard/hourly-monitor"
          class="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500"
        >
          <div class="w-12 h-12 bg-winschool-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-2" style="font-family: Inter, sans-serif;">
            Hourly Monitor
          </h3>
          <p class="text-sm text-gray-600 dark:text-slate-400" style="font-family: Inter, sans-serif;">
            Monitor and visualize lesson allocations and staff workload
          </p>
        </router-link>

        <!-- Conflict Resolution -->
        <router-link
          to="/dashboard/conflict-resolution"
          class="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-500"
        >
          <div class="w-12 h-12 bg-winschool-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-2" style="font-family: Inter, sans-serif;">
            Conflict Resolution
          </h3>
          <p class="text-sm text-gray-600 dark:text-slate-400" style="font-family: Inter, sans-serif;">
            Identify and resolve scheduling conflicts and resource conflicts
          </p>
        </router-link>
      </div>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-600 dark:text-green-400" style="font-family: Inter, sans-serif;">{{ planningStats.completed }}</div>
            <div class="text-sm font-medium text-gray-600 dark:text-slate-400" style="font-family: Inter, sans-serif;">Completed Plans</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400" style="font-family: Inter, sans-serif;">{{ planningStats.inProgress }}</div>
            <div class="text-sm font-medium text-gray-600 dark:text-slate-400" style="font-family: Inter, sans-serif;">In Progress</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400" style="font-family: Inter, sans-serif;">{{ planningStats.pending }}</div>
            <div class="text-sm font-medium text-gray-600 dark:text-slate-400" style="font-family: Inter, sans-serif;">Pending</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Planning Settings -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-winschool-primary rounded-xl flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-slate-50" style="font-family: Inter, sans-serif;">Create New Plan</h2>
          </div>
          
          <form @submit.prevent="createPlan" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">
                  Plan Type <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="planningSettings.type"
                  required
                  class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                  style="font-family: Inter, sans-serif;"
                  :class="{ 'border-red-300': formErrors.type }"
                >
                  <option value="">Select Type</option>
                  <option value="Academic Calendar">📚 Academic Calendar</option>
                  <option value="Resource Allocation">💰 Resource Allocation</option>
                  <option value="Staff Schedule">👥 Staff Schedule</option>
                  <option value="Event Planning">🎯 Event Planning</option>
                  <option value="Curriculum Development">📖 Curriculum Development</option>
                  <option value="Training Program">🎓 Training Program</option>
                </select>
                <p v-if="formErrors.type" class="mt-1 text-sm text-red-600" style="font-family: Inter, sans-serif;">{{ formErrors.type }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">
                  Priority <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="planningSettings.priority"
                  required
                  class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                  style="font-family: Inter, sans-serif;"
                  :class="{ 'border-red-300': formErrors.priority }"
                >
                  <option value="">Select Priority</option>
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
                <p v-if="formErrors.priority" class="mt-1 text-sm text-red-600" style="font-family: Inter, sans-serif;">{{ formErrors.priority }}</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">
                Plan Title <span class="text-red-500">*</span>
              </label>
              <input
                v-model="planningSettings.title"
                type="text"
                required
                maxlength="100"
                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                style="font-family: Inter, sans-serif;"
                placeholder="Enter plan title..."
                :class="{ 'border-red-300': formErrors.title }"
              />
              <p v-if="formErrors.title" class="mt-1 text-sm text-red-600" style="font-family: Inter, sans-serif;">{{ formErrors.title }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">
                Due Date
              </label>
              <input
                v-model="planningSettings.dueDate"
                type="date"
                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                style="font-family: Inter, sans-serif;"
                :min="new Date().toISOString().split('T')[0]"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">
                Description
              </label>
              <textarea
                v-model="planningSettings.description"
                rows="4"
                maxlength="500"
                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all resize-none"
                style="font-family: Inter, sans-serif;"
                placeholder="Describe the plan details..."
              ></textarea>
              <div class="flex justify-between items-center mt-1">
                <span class="text-sm text-gray-500" style="font-family: Inter, sans-serif;">Optional</span>
                <span class="text-sm text-gray-400" style="font-family: Inter, sans-serif;">{{ planningSettings.description.length }}/500</span>
              </div>
            </div>

            <!-- Tags Section -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">
                Tags
              </label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="tag in planningSettings.tags"
                  :key="tag"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  style="font-family: Inter, sans-serif;"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {{ tag }}
                  <button @click="removeTag(tag)" class="ml-1 hover:text-blue-600">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div>
              <div class="flex">
                <input
                  v-model="newTag"
                  type="text"
                  @keyup.enter="addTag"
                  class="flex-1 bg-white border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                  style="font-family: Inter, sans-serif;"
                  placeholder="Add tag..."
                />
                <button
                  @click="addTag"
                  type="button"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors"
                  style="font-family: Inter, sans-serif;"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Set Reminder -->
            <div class="flex items-center">
              <input
                v-model="planningSettings.setReminder"
                type="checkbox"
                id="reminder"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="reminder" class="ml-2 text-sm font-medium text-gray-700" style="font-family: Inter, sans-serif;">
                Set reminder (3 days before due date)
              </label>
            </div>

            <button
              type="submit"
              :disabled="isCreating"
              class="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              style="font-family: Inter, sans-serif;"
            >
              <svg v-if="isCreating" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isCreating ? 'Creating Plan...' : 'Save New Plan' }}</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Planning Timeline -->
      <div class="lg:col-span-3">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-50 flex items-center" style="font-family: Inter, sans-serif;">
                <svg class="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Planning Timeline
              </h2>
              <button
                @click="toggleActivityLog"
                class="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 flex items-center space-x-1 transition-colors"
                style="font-family: Inter, sans-serif;"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ showActivityLog ? 'Hide' : 'Show' }} Activity Log</span>
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="space-y-6">
              <div
                v-for="(plan, index) in planningTimeline"
                :key="plan.id"
                class="relative pl-8 group"
              >
                <!-- Timeline line -->
                <div v-if="index < planningTimeline.length - 1" class="absolute left-4 top-8 w-0.5 h-full bg-gray-200 dark:bg-slate-600"></div>
                
                <!-- Timeline dot -->
                <div 
                  class="absolute left-2 top-2 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 shadow-md"
                  :class="getStatusDotClass(plan.status)"
                ></div>

                <!-- Plan Card -->
                <div class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors cursor-pointer" @click="viewPlanDetails(plan)">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <h3 class="font-semibold text-gray-900 dark:text-slate-50" style="font-family: Inter, sans-serif;">{{ plan.title }}</h3>
                        <span 
                          :class="getStatusBadgeClass(plan.status)"
                          class="px-2 py-1 text-xs font-medium rounded-full"
                          style="font-family: Inter, sans-serif;"
                        >
                          {{ plan.status }}
                        </span>
                        <span 
                          :class="getPriorityBadgeClass(plan.priority)"
                          class="px-2 py-1 text-xs font-medium rounded-full"
                          style="font-family: Inter, sans-serif;"
                        >
                          {{ plan.priority }} Priority
                        </span>
                      </div>
                      
                      <p class="text-sm text-gray-600 dark:text-slate-300 mb-3" style="font-family: Inter, sans-serif;">{{ plan.description }}</p>
                      
                      <!-- Tags -->
                      <div v-if="plan.tags && plan.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
                        <span
                          v-for="tag in plan.tags"
                          :key="tag"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                          style="font-family: Inter, sans-serif;"
                        >
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {{ tag }}
                        </span>
                      </div>
                      
                      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
                        <div class="flex items-center space-x-4">
                          <span style="font-family: Inter, sans-serif;">Created: {{ formatDate(plan.date) }}</span>
                          <span v-if="plan.dueDate" style="font-family: Inter, sans-serif;">Due: {{ formatDate(plan.dueDate) }}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                          <button v-if="plan.attachments" class="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                          </button>
                          <span v-if="plan.reminderSet" class="text-yellow-500 dark:text-yellow-400" title="Reminder set">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.5 19.5l15-15m0 0H15m4.5 0v4.5M6 12h.01M6 8h.01M6 16h.01M6 20h.01M6 4h.01" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-2 ml-4">
                      <button 
                        @click.stop="editPlan(plan)"
                        class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-1"
                        title="Edit Plan"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        @click.stop="deletePlan(plan)"
                        class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                        title="Delete Plan"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="planningTimeline.length === 0" class="text-center py-12">
              <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-50 mb-2" style="font-family: Inter, sans-serif;">
                No Plans Yet
              </h3>
              <p class="text-gray-600 dark:text-slate-400 mb-6" style="font-family: Inter, sans-serif;">
                Create your first planning item to get started with advanced planning management.
              </p>
            </div>
          </div>
        </div>

        <!-- Activity Log -->
        <div v-if="showActivityLog" class="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-50 flex items-center" style="font-family: Inter, sans-serif;">
              <svg class="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Activity Log
            </h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="activity in activityLog" :key="activity.id" class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-gray-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-900 dark:text-slate-50" style="font-family: Inter, sans-serif;">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500 dark:text-slate-400" style="font-family: Inter, sans-serif;">{{ formatDateTime(activity.timestamp) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Plan Details Modal -->
    <div v-if="showPlanDetails" class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-black dark:bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-50" style="font-family: Inter, sans-serif;">{{ selectedPlan?.title }}</h3>
              <div class="flex items-center space-x-2 mt-2">
                <span 
                  :class="getStatusBadgeClass(selectedPlan?.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  style="font-family: Inter, sans-serif;"
                >
                  {{ selectedPlan?.status }}
                </span>
                <span 
                  :class="getPriorityBadgeClass(selectedPlan?.priority)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  style="font-family: Inter, sans-serif;"
                >
                  {{ selectedPlan?.priority }} Priority
                </span>
              </div>
            </div>
            <button @click="showPlanDetails = false" class="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1" style="font-family: Inter, sans-serif;">Description</label>
                <p class="text-gray-900 dark:text-slate-50" style="font-family: Inter, sans-serif;">{{ selectedPlan?.description || 'No description provided' }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1" style="font-family: Inter, sans-serif;">Plan Type</label>
                <p class="text-gray-900 dark:text-slate-50" style="font-family: Inter, sans-serif;">{{ selectedPlan?.type }}</p>
              </div>
              
              <div v-if="selectedPlan?.tags && selectedPlan.tags.length > 0">
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2" style="font-family: Inter, sans-serif;">Tags</label>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in selectedPlan.tags"
                    :key="tag"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                    style="font-family: Inter, sans-serif;"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1" style="font-family: Inter, sans-serif;">Created Date</label>
                <p class="text-gray-900 dark:text-slate-50" style="font-family: Inter, sans-serif;">{{ formatDate(selectedPlan?.date) }}</p>
              </div>
              
              <div v-if="selectedPlan?.dueDate">
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1" style="font-family: Inter, sans-serif;">Due Date</label>
                <p class="text-gray-900 dark:text-slate-50" style="font-family: Inter, sans-serif;">{{ formatDate(selectedPlan?.dueDate) }}</p>
              </div>
              
              <div v-if="selectedPlan?.reminderSet">
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1" style="font-family: Inter, sans-serif;">Reminder</label>
                <p class="text-gray-900 dark:text-slate-50 flex items-center" style="font-family: Inter, sans-serif;">
                  <svg class="w-4 h-4 mr-1 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.5 19.5l15-15m0 0H15m4.5 0v4.5M6 12h.01M6 8h.01M6 16h.01M6 20h.01M6 4h.01" />
                  </svg>
                  Set for 3 days before due date
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-slate-700 mt-6">
            <button 
              @click="editPlan(selectedPlan)"
              class="px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              style="font-family: Inter, sans-serif;"
            >
              Edit Plan
            </button>
            <button 
              @click="showPlanDetails = false"
              class="px-6 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
              style="font-family: Inter, sans-serif;"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Constants
const planningTypes = [
  'Academic Calendar',
  'Resource Allocation',
  'Staff Schedule',
  'Event Planning',
  'Curriculum Development',
  'Training Program'
]

const planningPriorities = [
  'High',
  'Medium',
  'Low'
]

// State Management
const isCreating = ref(false)
const showPlanDetails = ref(false)
const showActivityLog = ref(false)
const selectedPlan = ref<any>(null)
const newTag = ref('')

// Form validation
const formErrors = ref<Record<string, string>>({})

const planningSettings = ref({
  type: '',
  priority: '',
  title: '',
  description: '',
  dueDate: '' as string | null,
  tags: [] as string[],
  setReminder: false
})

// Enhanced Mock data for statistics
const planningStats = ref({
  completed: 8,
  inProgress: 4,
  pending: 3
})

// Enhanced Mock data for timeline with comprehensive features
const planningTimeline = ref([
  {
    id: 1,
    title: 'Academic Calendar 2024-2025',
    description: 'Comprehensive planning of academic calendar including term dates, holidays, examination periods, and important academic events for the upcoming academic year.',
    date: '2024-01-15',
    dueDate: '2024-03-01',
    status: 'Completed',
    priority: 'High',
    type: 'Academic Calendar',
    tags: ['academic', 'calendar', 'planning'],
    reminderSet: false,
    attachments: ['academic_calendar_draft.pdf'],
    createdBy: 'Admin',
    updatedAt: '2024-02-28'
  },
  {
    id: 2,
    title: 'Resource Allocation Q2 2024',
    description: 'Strategic allocation of financial and human resources for the second quarter including budget distribution, staff assignments, and resource optimization across departments.',
    date: '2024-02-01',
    dueDate: '2024-04-15',
    status: 'In Progress',
    priority: 'High',
    type: 'Resource Allocation',
    tags: ['budget', 'resources', 'finance'],
    reminderSet: true,
    attachments: null,
    createdBy: 'Finance Manager',
    updatedAt: '2024-03-10'
  },
  {
    id: 3,
    title: 'Staff Professional Development Program',
    description: 'Design and implementation of comprehensive staff training program covering pedagogical skills, technology integration, and professional development opportunities.',
    date: '2024-02-15',
    dueDate: '2024-05-30',
    status: 'In Progress',
    priority: 'Medium',
    type: 'Training Program',
    tags: ['staff', 'training', 'development'],
    reminderSet: true,
    attachments: ['training_outline.docx'],
    createdBy: 'HR Manager',
    updatedAt: '2024-03-05'
  },
  {
    id: 4,
    title: 'Annual Science Fair 2024',
    description: 'Complete event planning for the annual science fair including venue booking, judge coordination, student registration, and award ceremonies.',
    date: '2024-03-01',
    dueDate: '2024-06-15',
    status: 'Pending',
    priority: 'Medium',
    type: 'Event Planning',
    tags: ['event', 'science', 'students'],
    reminderSet: true,
    attachments: null,
    createdBy: 'Science Department Head',
    updatedAt: '2024-03-01'
  },
  {
    id: 5,
    title: 'Digital Learning Platform Integration',
    description: 'Implementation of new digital learning management system including staff training, student onboarding, and curriculum integration across all subjects.',
    date: '2024-01-10',
    dueDate: '2024-07-31',
    status: 'In Progress',
    priority: 'High',
    type: 'Curriculum Development',
    tags: ['digital', 'learning', 'technology'],
    reminderSet: true,
    attachments: ['platform_specs.pdf', 'training_materials.zip'],
    createdBy: 'IT Coordinator',
    updatedAt: '2024-03-12'
  },
  {
    id: 6,
    title: 'Parent-Teacher Conference Schedule',
    description: 'Comprehensive scheduling system for parent-teacher conferences including time slot management, room assignments, and communication protocols.',
    date: '2024-02-20',
    dueDate: '2024-04-30',
    status: 'Completed',
    priority: 'Low',
    type: 'Staff Schedule',
    tags: ['parents', 'teachers', 'meetings'],
    reminderSet: false,
    attachments: ['conference_schedule.xlsx'],
    createdBy: 'Academic Coordinator',
    updatedAt: '2024-04-25'
  }
])

// Activity Log Data
const activityLog = ref([
  {
    id: 1,
    description: 'Digital Learning Platform Integration plan was updated by IT Coordinator',
    timestamp: '2024-03-12T14:30:00Z',
    user: 'IT Coordinator',
    action: 'updated'
  },
  {
    id: 2,
    description: 'Resource Allocation Q2 2024 plan was updated by Finance Manager',
    timestamp: '2024-03-10T09:15:00Z',
    user: 'Finance Manager',
    action: 'updated'
  },
  {
    id: 3,
    description: 'Staff Professional Development Program plan was updated by HR Manager',
    timestamp: '2024-03-05T16:45:00Z',
    user: 'HR Manager',
    action: 'updated'
  },
  {
    id: 4,
    description: 'Annual Science Fair 2024 plan was created by Science Department Head',
    timestamp: '2024-03-01T11:20:00Z',
    user: 'Science Department Head',
    action: 'created'
  },
  {
    id: 5,
    description: 'Academic Calendar 2024-2025 plan was completed by Admin',
    timestamp: '2024-02-28T13:10:00Z',
    user: 'Admin',
    action: 'completed'
  }
])

// Computed Properties
const totalPlans = computed(() => planningStats.value.completed + planningStats.value.inProgress + planningStats.value.pending)

const completionPercentage = computed(() => {
  if (totalPlans.value === 0) return 0
  return (planningStats.value.completed / totalPlans.value) * 100
})

// Utility Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'success'
    case 'In Progress':
      return 'primary'
    case 'Pending':
      return 'warning'
    default:
      return 'grey'
  }
}

const getStatusDotClass = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-500'
    case 'In Progress':
      return 'bg-blue-500'
    case 'Pending':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-400'
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800'
    case 'In Progress':
      return 'bg-blue-100 text-blue-800'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'error'
    case 'Medium':
      return 'warning'
    case 'Low':
      return 'success'
    default:
      return 'grey'
  }
}

const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800'
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'Low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Form Validation
const validateForm = () => {
  const errors: Record<string, string> = {}

  if (!planningSettings.value.type) {
    errors.type = 'Plan type is required'
  }

  if (!planningSettings.value.priority) {
    errors.priority = 'Priority is required'
  }

  if (!planningSettings.value.title.trim()) {
    errors.title = 'Plan title is required'
  } else if (planningSettings.value.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long'
  }

  formErrors.value = errors
  return Object.keys(errors).length === 0
}

// Tag Management
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !planningSettings.value.tags.includes(tag)) {
    planningSettings.value.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (tagToRemove: string) => {
  const index = planningSettings.value.tags.indexOf(tagToRemove)
  if (index > -1) {
    planningSettings.value.tags.splice(index, 1)
  }
}

// Main Methods
const refreshData = () => {
  console.log('Refreshing planning data...')
  // Simulate data refresh
  addActivityLogEntry('Planning data was refreshed by Admin', 'refreshed')
}

const exportPlan = () => {
  console.log('Exporting planning timeline...')
  
  // Generate comprehensive CSV content
  const headers = ['Title', 'Type', 'Priority', 'Status', 'Created Date', 'Due Date', 'Description', 'Tags', 'Reminder Set']
  const csvContent = [
    headers.join(','),
    ...planningTimeline.value.map(plan => [
      `"${plan.title}"`,
      `"${plan.type}"`,
      `"${plan.priority}"`,
      `"${plan.status}"`,
      `"${plan.date}"`,
      `"${plan.dueDate || 'N/A'}"`,
      `"${plan.description.replace(/"/g, '""')}"`,
      `"${plan.tags?.join(', ') || 'None'}"`,
      `"${plan.reminderSet ? 'Yes' : 'No'}"`
    ].join(','))
  ].join('\n')
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `planning-timeline-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
  
  addActivityLogEntry('Planning timeline was exported by Admin', 'exported')
}

const createPlan = async () => {
  if (!validateForm()) {
    return
  }

  isCreating.value = true

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Create new plan with enhanced data
    const newPlan = {
      id: Math.max(...planningTimeline.value.map(p => p.id)) + 1,
      title: planningSettings.value.title.trim(),
      description: planningSettings.value.description.trim() || 'No description provided',
      date: new Date().toISOString().split('T')[0],
      dueDate: planningSettings.value.dueDate || null,
      status: 'Pending',
      priority: planningSettings.value.priority,
      type: planningSettings.value.type,
      tags: [...planningSettings.value.tags],
      reminderSet: planningSettings.value.setReminder,
      attachments: null,
      createdBy: 'Admin',
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    // Add to timeline (newest first)
    planningTimeline.value.unshift(newPlan)
    
    // Update statistics
    planningStats.value.pending += 1
    
    // Add activity log entry
    addActivityLogEntry(`"${newPlan.title}" plan was created by Admin`, 'created')
    
    // Reset form
    resetForm()
    
    console.log('Plan created successfully:', newPlan)
  } catch (error) {
    console.error('Error creating plan:', error)
  } finally {
    isCreating.value = false
  }
}

const viewPlanDetails = (plan: any) => {
  selectedPlan.value = plan
  showPlanDetails.value = true
}

const editPlan = (plan: any) => {
  console.log('Editing plan:', plan)
  // In a real application, this would open an edit form
  addActivityLogEntry(`"${plan.title}" plan was edited by Admin`, 'edited')
}

const deletePlan = (plan: any) => {
  if (confirm(`Are you sure you want to delete "${plan.title}"?`)) {
    const index = planningTimeline.value.findIndex(p => p.id === plan.id)
    if (index > -1) {
      planningTimeline.value.splice(index, 1)
      
      // Update statistics
      if (plan.status === 'Completed') {
        planningStats.value.completed -= 1
      } else if (plan.status === 'In Progress') {
        planningStats.value.inProgress -= 1
      } else {
        planningStats.value.pending -= 1
      }
      
      addActivityLogEntry(`"${plan.title}" plan was deleted by Admin`, 'deleted')
      console.log('Plan deleted successfully')
    }
    showPlanDetails.value = false
  }
}

const toggleActivityLog = () => {
  showActivityLog.value = !showActivityLog.value
}

const addActivityLogEntry = (description: string, action: string) => {
  const newActivity = {
    id: Math.max(...activityLog.value.map(a => a.id)) + 1,
    description,
    timestamp: new Date().toISOString(),
    user: 'Admin',
    action
  }
  activityLog.value.unshift(newActivity)
  
  // Keep only last 50 activities
  if (activityLog.value.length > 50) {
    activityLog.value = activityLog.value.slice(0, 50)
  }
}

const resetForm = () => {
  planningSettings.value = {
    type: '',
    priority: '',
    title: '',
    description: '',
    dueDate: '',
    tags: [],
    setReminder: false
  }
  formErrors.value = {}
  newTag.value = ''
}

// Lifecycle
onMounted(() => {
  console.log('Advanced Planning View mounted')
  addActivityLogEntry('Advanced Planning dashboard was accessed by Admin', 'accessed')
})
</script>

<style scoped>
/* Custom scrollbar for modal content */
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

/* Smooth transitions for interactive elements */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Enhanced focus states */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
