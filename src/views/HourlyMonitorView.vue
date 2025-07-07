<template>
  <div class="hourly-monitor bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            Hourly Monitor
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            Monitor and visualize lesson allocations and staff workload
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button 
          @click="exportReport"
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Report
        </button>
        <button 
          @click="refreshData"
          class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Overview Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 shadow rounded-xl px-5 py-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400" style="font-family: Inter, sans-serif;">{{ stats.totalTeachers }}</div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Total Teachers</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 shadow rounded-xl px-5 py-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-600 dark:text-green-400" style="font-family: Inter, sans-serif;">{{ stats.totalHours }}</div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Total Hours/Week</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 shadow rounded-xl px-5 py-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400" style="font-family: Inter, sans-serif;">{{ stats.avgHoursPerTeacher }}</div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Avg Hours/Teacher</div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow rounded-xl px-5 py-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-red-600 dark:text-red-400" style="font-family: Inter, sans-serif;">{{ stats.overloadedTeachers }}</div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Overloaded</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">
            Time Period
          </label>
          <select
            v-model="filters.timePeriod"
            class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 transition-all"
            style="font-family: Inter, sans-serif;"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
            <option value="year">This Year</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">
            Department
          </label>
          <select
            v-model="filters.department"
            class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 transition-all"
            style="font-family: Inter, sans-serif;"
          >
            <option value="">All Departments</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Physical Education">Physical Education</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">
            Workload Status
          </label>
          <select
            v-model="filters.workloadStatus"
            class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 transition-all"
            style="font-family: Inter, sans-serif;"
          >
            <option value="">All Status</option>
            <option value="underloaded">Underloaded</option>
            <option value="normal">Normal</option>
            <option value="overloaded">Overloaded</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">
            View Type
          </label>
          <select
            v-model="filters.viewType"
            class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 transition-all"
            style="font-family: Inter, sans-serif;"
          >
            <option value="table">Table View</option>
            <option value="chart">Chart View</option>
            <option value="calendar">Calendar View</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Teacher Workload Table -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">Teacher Workload</h2>
            <div class="flex items-center space-x-2">
              <button
                @click="toggleSortOrder"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center space-x-1 transition-colors"
                style="font-family: Inter, sans-serif;"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span>Sort by Hours</span>
              </button>
            </div>
          </div>

          <!-- Desktop Table View (hidden on mobile) -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    @click="sortBy('name')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none" 
                    style="font-family: Inter, sans-serif;"
                  >
                    <div class="flex items-center space-x-1">
                      <span>Teacher</span>
                      <svg v-if="sortField === 'name'" class="w-4 h-4" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th 
                    @click="sortBy('hours')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none" 
                    style="font-family: Inter, sans-serif;"
                  >
                    <div class="flex items-center space-x-1">
                      <span>Hours/Week</span>
                      <svg v-if="sortField === 'hours'" class="w-4 h-4" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th 
                    @click="sortBy('workload')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none" 
                    style="font-family: Inter, sans-serif;"
                  >
                    <div class="flex items-center space-x-1">
                      <span>Workload</span>
                      <svg v-if="sortField === 'workload'" class="w-4 h-4" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th 
                    @click="sortBy('classes')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none" 
                    style="font-family: Inter, sans-serif;"
                  >
                    <div class="flex items-center space-x-1">
                      <span>Classes</span>
                      <svg v-if="sortField === 'classes'" class="w-4 h-4" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th 
                    @click="sortBy('status')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none" 
                    style="font-family: Inter, sans-serif;"
                  >
                    <div class="flex items-center space-x-1">
                      <span>Status</span>
                      <svg v-if="sortField === 'status'" class="w-4 h-4" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="teacher in paginatedTeachers"
                  :key="teacher.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  @click="selectTeacher(teacher)"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">
                            {{ teacher.name.split(' ').map(n => n[0]).join('') }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ teacher.name }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">{{ teacher.department }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span class="text-sm text-gray-900 dark:text-gray-100 mr-2" style="font-family: Inter, sans-serif;">{{ teacher.hoursPerWeek }}</span>
                      <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          class="h-2 rounded-full"
                          :class="getWorkloadBarClass(teacher.workloadStatus)"
                          :style="{ width: Math.min(100, (teacher.hoursPerWeek / 40) * 100) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">
                    {{ teacher.workloadPercentage }}%
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">
                    {{ teacher.totalClasses }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="getStatusBadgeClass(teacher.workloadStatus)"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      style="font-family: Inter, sans-serif;"
                    >
                      {{ teacher.workloadStatus }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Card View (visible on mobile only) -->
          <div class="lg:hidden space-y-4">
            <div
              v-for="teacher in paginatedTeachers"
              :key="teacher.id"
              class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
              @click="selectTeacher(teacher)"
            >
              <!-- Teacher Header -->
              <div class="flex items-center space-x-3 mb-3">
                <div class="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">
                    {{ teacher.name.split(' ').map(n => n[0]).join('') }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate" style="font-family: Inter, sans-serif;">
                    {{ teacher.name }}
                  </h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                    {{ teacher.department }}
                  </p>
                </div>
                <span 
                  :class="getStatusBadgeClass(teacher.workloadStatus)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  style="font-family: Inter, sans-serif;"
                >
                  {{ teacher.workloadStatus }}
                </span>
              </div>

              <!-- Workload Progress -->
              <div class="mb-3">
                <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span style="font-family: Inter, sans-serif;">Weekly Hours</span>
                  <span style="font-family: Inter, sans-serif;">{{ teacher.hoursPerWeek }}h</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-300"
                    :class="getWorkloadBarClass(teacher.workloadStatus)"
                    :style="{ width: Math.min(100, (teacher.hoursPerWeek / 40) * 100) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Teacher Stats -->
              <div class="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div class="text-center">
                  <div class="text-sm font-semibold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">
                    {{ teacher.workloadPercentage }}%
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                    Workload
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-sm font-semibold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">
                    {{ teacher.totalClasses }}
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                    Classes
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredTeachers.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">No teachers found</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">Try adjusting your filters.</p>
          </div>

          <!-- Pagination -->
          <div v-if="filteredTeachers.length > 0" class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <p class="text-sm text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">
                  Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredTeachers.length) }} of {{ filteredTeachers.length }} results
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all"
                  style="font-family: Inter, sans-serif;"
                >
                  Previous
                </button>
                <span class="text-sm text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>
                <button
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all"
                  style="font-family: Inter, sans-serif;"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Teacher Details and Workload Distribution -->
      <div class="space-y-6">
        <!-- Selected Teacher Details -->
        <div v-if="selectedTeacher" class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4" style="font-family: Inter, sans-serif;">
            {{ selectedTeacher.name }}
          </h3>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Department</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ selectedTeacher.department }}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Weekly Hours</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ selectedTeacher.hoursPerWeek }} hours</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Workload</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ selectedTeacher.workloadPercentage }}%</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Total Classes</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ selectedTeacher.totalClasses }}</span>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3" style="font-family: Inter, sans-serif;">Class Schedule</h4>
            <div class="space-y-2">
              <div
                v-for="schedule in selectedTeacher.schedule"
                :key="schedule.id"
                class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ schedule.subject }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">{{ schedule.time }}</div>
                </div>
                <span class="text-xs text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">{{ schedule.duration }}h</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Workload Distribution Chart -->
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4" style="font-family: Inter, sans-serif;">Workload Distribution</h3>
          
          <div class="space-y-4">
            <div
              v-for="category in workloadDistribution"
              :key="category.status"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <div 
                  class="w-4 h-4 rounded-full"
                  :class="category.color"
                ></div>
                <span class="text-sm text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">{{ category.label }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ category.count }}</span>
                <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    :class="category.bgColor"
                    class="h-2 rounded-full"
                    :style="{ width: (category.count / stats.totalTeachers * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4" style="font-family: Inter, sans-serif;">Quick Actions</h3>
          
          <div class="space-y-3">
            <button
              @click="balanceWorkload"
              class="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
              style="font-family: Inter, sans-serif;"
            >
              Balance Workload
            </button>
            
            <button
              @click="generateSchedule"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              style="font-family: Inter, sans-serif;"
            >
              Generate Schedule
            </button>
            
            <button
              @click="sendNotifications"
              class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              style="font-family: Inter, sans-serif;"
            >
              Send Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Types
interface Teacher {
  id: string
  name: string
  department: string
  hoursPerWeek: number
  workloadPercentage: number
  workloadStatus: 'underloaded' | 'normal' | 'overloaded'
  totalClasses: number
  schedule: ClassSchedule[]
}

interface ClassSchedule {
  id: string
  subject: string
  time: string
  duration: number
}

// State
const selectedTeacher = ref<Teacher | null>(null)
const sortAscending = ref(true)

// Sorting state
const sortField = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(5)

const filters = ref({
  department: '',
  workloadStatus: '',
  viewType: 'table'
})

// Mock Data
const teachers = ref<Teacher[]>([
  {
    id: '1',
    name: 'Dr. Sarah Smith',
    department: 'Mathematics',
    hoursPerWeek: 28,
    workloadPercentage: 93,
    workloadStatus: 'normal',
    totalClasses: 6,
    schedule: [
      { id: '1', subject: 'Algebra I', time: 'Mon 9:00-10:30', duration: 1.5 },
      { id: '2', subject: 'Calculus', time: 'Tue 11:00-12:30', duration: 1.5 },
      { id: '3', subject: 'Geometry', time: 'Wed 14:00-15:30', duration: 1.5 }
    ]
  },
  {
    id: '2',
    name: 'Prof. John Johnson',
    department: 'Science',
    hoursPerWeek: 35,
    workloadPercentage: 117,
    workloadStatus: 'overloaded',
    totalClasses: 8,
    schedule: [
      { id: '4', subject: 'Physics I', time: 'Mon 8:00-9:30', duration: 1.5 },
      { id: '5', subject: 'Chemistry', time: 'Tue 10:00-11:30', duration: 1.5 },
      { id: '6', subject: 'Biology Lab', time: 'Thu 13:00-16:00', duration: 3 }
    ]
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    department: 'English',
    hoursPerWeek: 18,
    workloadPercentage: 60,
    workloadStatus: 'underloaded',
    totalClasses: 4,
    schedule: [
      { id: '7', subject: 'Literature', time: 'Wed 9:00-10:30', duration: 1.5 },
      { id: '8', subject: 'Writing', time: 'Fri 11:00-12:30', duration: 1.5 }
    ]
  },
  {
    id: '4',
    name: 'Mr. Michael Brown',
    department: 'History',
    hoursPerWeek: 25,
    workloadPercentage: 83,
    workloadStatus: 'normal',
    totalClasses: 5,
    schedule: [
      { id: '9', subject: 'World History', time: 'Mon 10:00-11:30', duration: 1.5 },
      { id: '10', subject: 'US History', time: 'Wed 13:00-14:30', duration: 1.5 }
    ]
  },
  {
    id: '5',
    name: 'Ms. Lisa Wilson',
    department: 'Physical Education',
    hoursPerWeek: 32,
    workloadPercentage: 107,
    workloadStatus: 'overloaded',
    totalClasses: 7,
    schedule: [
      { id: '11', subject: 'PE Class A', time: 'Daily 8:00-9:00', duration: 1 },
      { id: '12', subject: 'Sports Team', time: 'Tue 15:00-17:00', duration: 2 }
    ]
  }
])

// Computed
const filteredTeachers = computed(() => {
  let filtered = teachers.value

  if (filters.value.department) {
    filtered = filtered.filter(teacher => teacher.department === filters.value.department)
  }

  if (filters.value.workloadStatus) {
    filtered = filtered.filter(teacher => teacher.workloadStatus === filters.value.workloadStatus)
  }

  // Apply sorting
  if (sortField.value) {
    filtered = [...filtered].sort((a, b) => {
      let aValue: any
      let bValue: any
      
      switch (sortField.value) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'hours':
          aValue = a.hoursPerWeek
          bValue = b.hoursPerWeek
          break
        case 'workload':
          aValue = a.workloadPercentage
          bValue = b.workloadPercentage
          break
        case 'classes':
          aValue = a.totalClasses
          bValue = b.totalClasses
          break
        case 'status':
          aValue = a.workloadStatus
          bValue = b.workloadStatus
          break
        default:
          return 0
      }
      
      if (sortOrder.value === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  } else {
    // Default sort by hours
    filtered = [...filtered].sort((a, b) => {
      const comparison = a.hoursPerWeek - b.hoursPerWeek
      return sortAscending.value ? comparison : -comparison
    })
  }

  return filtered
})

const paginatedTeachers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTeachers.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredTeachers.value.length / itemsPerPage.value))

const stats = computed(() => ({
  totalTeachers: teachers.value.length,
  totalHours: teachers.value.reduce((sum, teacher) => sum + teacher.hoursPerWeek, 0),
  avgHoursPerTeacher: Math.round(teachers.value.reduce((sum, teacher) => sum + teacher.hoursPerWeek, 0) / teachers.value.length),
  overloadedTeachers: teachers.value.filter(teacher => teacher.workloadStatus === 'overloaded').length
}))

const workloadDistribution = computed(() => [
  {
    status: 'underloaded',
    label: 'Underloaded (<80%)',
    count: teachers.value.filter(t => t.workloadStatus === 'underloaded').length,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-500'
  },
  {
    status: 'normal',
    label: 'Normal (80-100%)',
    count: teachers.value.filter(t => t.workloadStatus === 'normal').length,
    color: 'bg-green-500',
    bgColor: 'bg-green-500'
  },
  {
    status: 'overloaded',
    label: 'Overloaded (>100%)',
    count: teachers.value.filter(t => t.workloadStatus === 'overloaded').length,
    color: 'bg-red-500',
    bgColor: 'bg-red-500'
  }
])

// Methods
const selectTeacher = (teacher: Teacher) => {
  selectedTeacher.value = teacher
}

const toggleSortOrder = () => {
  sortAscending.value = !sortAscending.value
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'underloaded':
      return 'bg-blue-100 text-blue-800'
    case 'normal':
      return 'bg-green-100 text-green-800'
    case 'overloaded':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getWorkloadBarClass = (status: string) => {
  switch (status) {
    case 'underloaded':
      return 'bg-blue-500'
    case 'normal':
      return 'bg-green-500'
    case 'overloaded':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const refreshData = async () => {
  console.log('Refreshing hourly monitor data...')
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('Data refreshed')
}

const exportReport = () => {
  console.log('Exporting hourly monitor report...')
  
  // Create CSV content
  const csvContent = [
    'Hourly Monitor Report',
    `Generated: ${new Date().toLocaleString()}`,
    '',
    'Teacher Workload Summary:',
    'Name,Department,Hours/Week,Workload %,Status,Classes',
    ...teachers.value.map(teacher => 
      `"${teacher.name}","${teacher.department}",${teacher.hoursPerWeek},${teacher.workloadPercentage},"${teacher.workloadStatus}",${teacher.totalClasses}`
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `hourly-monitor-report-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const balanceWorkload = () => {
  console.log('Balancing teacher workload...')
  // Implementation for workload balancing
}

const generateSchedule = () => {
  console.log('Generating optimized schedule...')
  // Implementation for schedule generation
}

const sendNotifications = () => {
  console.log('Sending notifications to teachers...')
  // Implementation for notifications
}

const sortBy = (field: string) => {
  if (field === sortField.value) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

// Lifecycle
onMounted(() => {
  console.log('Hourly Monitor View mounted')
  // Select first teacher by default
  if (teachers.value.length > 0) {
    selectedTeacher.value = teachers.value[0]
  }
})
</script>

<style scoped>
.hourly-monitor {
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

/* Table hover effects */
tbody tr:hover {
  background-color: #f9fafb;
}

/* Progress bar animations */
.h-2 {
  transition: width 0.3s ease-in-out;
}
</style> 
