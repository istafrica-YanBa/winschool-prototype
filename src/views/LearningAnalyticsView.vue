<template>
  <div class="learning-analytics bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            Learning Analytics
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-200">
            Comprehensive insights into student performance and learning patterns
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button 
          @click="refreshData"
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
        <button 
          @click="exportReport"
          class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Report
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Filters and Controls -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-6">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-winschool-primary rounded-xl flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200" style="font-family: Inter, sans-serif;">Filters</h2>
          </div>
          
          <form @submit.prevent="applyFilters" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">
                Class <span class="text-red-500">*</span>
              </label>
              <select
                v-model="filters.class"
                required
                class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-winschool-primary focus:border-transparent text-gray-900 dark:text-gray-100 transition-all"
                style="font-family: Inter, sans-serif;"
              >
                <option value="">Select Class</option>
                <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">
                Subject
              </label>
              <select
                v-model="filters.subject"
                class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-winschool-primary focus:border-transparent text-gray-900 dark:text-gray-100 transition-all"
                style="font-family: Inter, sans-serif;"
              >
                <option value="">All Subjects</option>
                <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">
                Time Range <span class="text-red-500">*</span>
              </label>
              <select
                v-model="filters.timeRange"
                required
                class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-winschool-primary focus:border-transparent text-gray-900 dark:text-gray-100 transition-all"
                style="font-family: Inter, sans-serif;"
              >
                <option value="">Select Range</option>
                <option v-for="range in timeRanges" :key="range.value" :value="range.value">{{ range.text }}</option>
              </select>
            </div>

            <button
              type="submit"
              class="w-full bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium py-2 px-4 rounded-lg transition-colors"
              style="font-family: Inter, sans-serif;"
            >
              Apply Filters
            </button>
          </form>
        </div>

        <!-- Key Metrics -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-winschool-primary rounded-xl flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200" style="font-family: Inter, sans-serif;">Key Metrics</h2>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">Average Grade</span>
              </div>
              <span class="text-lg font-bold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ metrics.averageGrade }}</span>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">Improvement Rate</span>
              </div>
              <span class="text-lg font-bold text-green-600 dark:text-green-400" style="font-family: Inter, sans-serif;">{{ metrics.improvementRate }}%</span>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">Participation Rate</span>
              </div>
              <span class="text-lg font-bold text-purple-600 dark:text-purple-400" style="font-family: Inter, sans-serif;">{{ metrics.participationRate }}%</span>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">Avg Study Time</span>
              </div>
              <span class="text-lg font-bold text-orange-600 dark:text-orange-400" style="font-family: Inter, sans-serif;">{{ metrics.averageStudyTime }}h</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Content -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Performance Trends -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-winschool-primary rounded-xl flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200" style="font-family: Inter, sans-serif;">Performance Trends</h2>
          </div>
          <div class="h-80">
            <Line :data="performanceChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Subject Analysis -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-winschool-primary rounded-xl flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200" style="font-family: Inter, sans-serif;">Subject Analysis</h2>
          </div>
          <div class="h-80">
            <Bar :data="subjectChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Performance Insights Table -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">
              Student Performance Analysis
            </h3>
          </div>

          <!-- Desktop Table View (hidden on mobile) -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    @click="sortBy('student')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none" 
                    style="font-family: Inter, sans-serif;"
                  >
                    <div class="flex items-center space-x-1">
                      <span>Student</span>
                      <svg v-if="sortField === 'student'" class="w-4 h-4" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style="font-family: Inter, sans-serif;">
                    Subjects
                  </th>
                  <th 
                    @click="sortBy('performance')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none" 
                    style="font-family: Inter, sans-serif;"
                  >
                    <div class="flex items-center space-x-1">
                      <span>Performance</span>
                      <svg v-if="sortField === 'performance'" class="w-4 h-4" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th 
                    @click="sortBy('trend')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none" 
                    style="font-family: Inter, sans-serif;"
                  >
                    <div class="flex items-center space-x-1">
                      <span>Trend</span>
                      <svg v-if="sortField === 'trend'" class="w-4 h-4" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style="font-family: Inter, sans-serif;">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="student in paginatedStudents"
                  :key="student.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" :src="student.avatar" :alt="student.name" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ student.name }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">{{ student.class }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="subject in student.subjects.slice(0, 3)"
                        :key="subject"
                        class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                        style="font-family: Inter, sans-serif;"
                      >
                        {{ subject }}
                      </span>
                      <span
                        v-if="student.subjects.length > 3"
                        class="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                        style="font-family: Inter, sans-serif;"
                      >
                        +{{ student.subjects.length - 3 }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100 mr-3" style="font-family: Inter, sans-serif;">
                        {{ student.averageGrade }}%
                      </div>
                      <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          class="h-2 rounded-full"
                          :class="getPerformanceColor(student.averageGrade)"
                          :style="{ width: student.averageGrade + '%' }"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <svg v-if="student.trend === 'up'" class="w-5 h-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l5-5 5 5M7 7l5-5 5 5" />
                      </svg>
                      <svg v-else-if="student.trend === 'down'" class="w-5 h-5 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17l-5 5-5-5M17 7l-5 5-5-5" />
                      </svg>
                      <svg v-else class="w-5 h-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                      <span 
                        class="text-sm"
                        :class="getTrendColor(student.trend)"
                        style="font-family: Inter, sans-serif;"
                      >
                        {{ student.trendValue }}%
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button 
                        @click="viewDetails(student)"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                        title="View Details"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        @click="generateReport(student)"
                        class="text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors"
                        title="Generate Report"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Card View (visible on mobile only) -->
          <div class="lg:hidden p-4 space-y-4">
            <div
              v-for="student in paginatedStudents"
              :key="student.id"
              class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
            >
              <!-- Student Header -->
              <div class="flex items-center space-x-3 mb-3">
                <img class="h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" :src="student.avatar" :alt="student.name" />
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate" style="font-family: Inter, sans-serif;">
                    {{ student.name }}
                  </h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                    {{ student.class }}
                  </p>
                </div>
                <div class="text-right">
                  <div class="text-sm font-semibold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">
                    {{ student.averageGrade }}%
                  </div>
                  <div class="flex items-center">
                    <svg v-if="student.trend === 'up'" class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l5-5 5 5M7 7l5-5 5 5" />
                    </svg>
                    <svg v-else-if="student.trend === 'down'" class="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17l-5 5-5-5M17 7l-5 5-5-5" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                    <span 
                      class="text-xs"
                      :class="getTrendColor(student.trend)"
                      style="font-family: Inter, sans-serif;"
                    >
                      {{ student.trendValue }}%
                    </span>
                  </div>
                </div>
              </div>

              <!-- Performance Bar -->
              <div class="mb-3">
                <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span style="font-family: Inter, sans-serif;">Performance</span>
                  <span style="font-family: Inter, sans-serif;">{{ student.averageGrade }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-300"
                    :class="getPerformanceColor(student.averageGrade)"
                    :style="{ width: student.averageGrade + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Subjects -->
              <div class="mb-4">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2" style="font-family: Inter, sans-serif;">Subjects:</span>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="subject in student.subjects.slice(0, 4)"
                    :key="subject"
                    class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                    style="font-family: Inter, sans-serif;"
                  >
                    {{ subject }}
                  </span>
                  <span
                    v-if="student.subjects.length > 4"
                    class="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                    style="font-family: Inter, sans-serif;"
                  >
                    +{{ student.subjects.length - 4 }}
                  </span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button 
                  @click="viewDetails(student)"
                  class="flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                  style="font-family: Inter, sans-serif;"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View Details</span>
                </button>
                <button 
                  @click="generateReport(student)"
                  class="flex-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                  style="font-family: Inter, sans-serif;"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="paginatedStudents.length > 0" class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <p class="text-sm text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">
                  Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, studentPerformance.length) }} of {{ studentPerformance.length }} results
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

// Constants
const classes = [
  'Class 10A',
  'Class 10B',
  'Class 11A',
  'Class 11B',
  'Class 12A',
  'Class 12B'
]

const subjects = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology'
]

const timeRanges = [
  { text: 'Last 7 days', value: '7d' },
  { text: 'Last 30 days', value: '30d' },
  { text: 'Last 3 months', value: '3m' },
  { text: 'Last 6 months', value: '6m' },
  { text: 'Last year', value: '1y' }
]

// State
const filters = ref({
  class: '',
  subject: '',
  timeRange: ''
})

const metrics = ref({
  averageGrade: 'B+',
  improvementRate: 12.5,
  participationRate: 89,
  averageStudyTime: 4.2
})

const currentPage = ref(1)
const itemsPerPage = ref(10)

// Sorting state
const sortField = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const studentPerformance = ref([
  {
    id: 1,
    name: 'Emma Wilson',
    class: 'Grade 10A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    averageGrade: 85,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'History'],
    trend: 'up',
    trendValue: 5.2,
    studyHours: 25
  },
  {
    id: 2,
    name: 'James Smith',
    class: 'Grade 11B',
    avatar: 'https://i.pravatar.cc/150?img=2',
    averageGrade: 78,
    subjects: ['Biology', 'Chemistry', 'Mathematics', 'English'],
    trend: 'stable',
    trendValue: 0.8,
    studyHours: 22
  },
  {
    id: 3,
    name: 'Sophie Johnson',
    class: 'Grade 9A',
    avatar: 'https://i.pravatar.cc/150?img=3',
    averageGrade: 92,
    subjects: ['Mathematics', 'Physics', 'Art', 'English', 'French', 'History'],
    trend: 'up',
    trendValue: 7.1,
    studyHours: 28
  },
  {
    id: 4,
    name: 'Michael Brown',
    class: 'Grade 10C',
    avatar: 'https://i.pravatar.cc/150?img=4',
    averageGrade: 65,
    subjects: ['English', 'History', 'Geography', 'Art'],
    trend: 'down',
    trendValue: -3.5,
    studyHours: 18
  },
  {
    id: 5,
    name: 'Emily Davis',
    class: 'Grade 11A',
    avatar: 'https://i.pravatar.cc/150?img=5',
    averageGrade: 88,
    subjects: ['Chemistry', 'Biology', 'Mathematics', 'Physics', 'English'],
    trend: 'up',
    trendValue: 4.3,
    studyHours: 26
  }
])

// Chart configuration
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false
    }
  },
  scales: {
    x: {
      display: true,
      title: {
        display: false
      }
    },
    y: {
      display: true,
      title: {
        display: false
      }
    }
  }
}

const performanceChartData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Class Average',
      data: [78, 82, 85, 88, 86, 90],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    },
    {
      label: 'Individual Performance',
      data: [75, 79, 83, 85, 87, 89],
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      tension: 0.4
    }
  ]
}))

const subjectChartData = computed(() => ({
  labels: ['Math', 'English', 'Science', 'History', 'Geography'],
  datasets: [
    {
      label: 'Average Scores',
      data: [85, 78, 92, 76, 83],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(168, 85, 247)',
        'rgb(34, 197, 94)',
        'rgb(251, 146, 60)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 1
    }
  ]
}))

// Computed properties
const paginatedStudents = computed(() => {
  let sortedStudents = [...studentPerformance.value]
  
  // Apply sorting if field is selected
  if (sortField.value) {
    sortedStudents.sort((a, b) => {
      let aValue: any
      let bValue: any
      
      switch (sortField.value) {
        case 'student':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'performance':
          aValue = a.averageGrade
          bValue = b.averageGrade
          break
        case 'trend':
          aValue = a.trendValue
          bValue = b.trendValue
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
  }
  
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedStudents.slice(start, end)
})

const totalPages = computed(() => Math.ceil(studentPerformance.value.length / itemsPerPage.value))

// Methods
const getPerformanceColor = (grade: number) => {
  if (grade >= 90) return 'bg-green-500'
  if (grade >= 80) return 'bg-blue-500'
  if (grade >= 70) return 'bg-yellow-500'
  if (grade >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up': return 'text-green-600 dark:text-green-400'
    case 'down': return 'text-red-600 dark:text-red-400'
    default: return 'text-gray-600 dark:text-gray-400'
  }
}

const viewDetails = (student: any) => {
  console.log('Viewing details for:', student.name)
  // Implementation for viewing student details
}

const generateReport = (student: any) => {
  console.log('Generating report for:', student.name)
  // Implementation for generating student report
}

const applyFilters = () => {
  console.log('Applying filters:', filters.value)
  // In a real application, this would fetch filtered data
}

const refreshData = () => {
  console.log('Refreshing analytics data...')
  // Simulate data refresh
}

const exportReport = () => {
  console.log('Exporting analytics report...')
  
  // Generate CSV content
  const headers = ['Student', 'Class', 'Average Grade', 'Performance', 'Trend', 'Study Hours']
  const csvContent = [
    headers.join(','),
    ...studentPerformance.value.map(student => [
      `"${student.name}"`,
      `"${student.class}"`,
      `"${student.averageGrade}"`,
      `"${student.trend}"`,
      `"${student.trendValue}"`,
      `"${student.studyHours}"`
    ].join(','))
  ].join('\n')
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `learning-analytics-report-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

onMounted(() => {
  console.log('Learning Analytics View mounted')
})
</script>
<style scoped>
/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
