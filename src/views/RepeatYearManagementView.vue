<template>
  <div class="repeat-year-management bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            Repeat Year Management
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-200">
            Track and manage students requiring academic year repetition
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

    <!-- Statistics Panel -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow px-4 py-3 text-center space-y-1 border border-yellow-200 dark:border-yellow-800">
        <div class="text-2xl">⏳</div>
        <div class="text-2xl font-bold text-yellow-700 dark:text-yellow-400" style="font-family: Inter, sans-serif;">{{ pendingCount }}</div>
        <div class="text-sm font-medium text-yellow-600 dark:text-yellow-300" style="font-family: Inter, sans-serif;">Pending</div>
      </div>
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow px-4 py-3 text-center space-y-1 border border-blue-200 dark:border-blue-800">
        <div class="text-2xl">🔄</div>
        <div class="text-2xl font-bold text-blue-700 dark:text-blue-400" style="font-family: Inter, sans-serif;">{{ inProgressCount }}</div>
        <div class="text-sm font-medium text-blue-600 dark:text-blue-300" style="font-family: Inter, sans-serif;">In Progress</div>
      </div>
      <div class="bg-green-50 dark:bg-green-900/20 rounded-lg shadow px-4 py-3 text-center space-y-1 border border-green-200 dark:border-green-800">
        <div class="text-2xl">✅</div>
        <div class="text-2xl font-bold text-green-700 dark:text-green-400" style="font-family: Inter, sans-serif;">{{ completedCount }}</div>
        <div class="text-sm font-medium text-green-600 dark:text-green-300" style="font-family: Inter, sans-serif;">Completed</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Filters Card -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-winschool-primary rounded-xl flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200" style="font-family: Inter, sans-serif;">Filters</h2>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">Search Students</label>
              <div class="relative">
                <input
                  v-model="filters.search"
                  type="text"
                  placeholder="Search by name..."
                  class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-winschool-primary focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                  style="font-family: Inter, sans-serif;"
                />
                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">Class</label>
              <select
                v-model="filters.class"
                class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-winschool-primary focus:border-transparent text-gray-900 dark:text-gray-100 transition-all"
                style="font-family: Inter, sans-serif;"
              >
                <option value="All Classes">All Classes</option>
                <option value="10A">10A</option>
                <option value="10B">10B</option>
                <option value="11A">11A</option>
                <option value="11B">11B</option>
                <option value="12A">12A</option>
                <option value="12B">12B</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">Status</label>
              <select
                v-model="filters.status"
                class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-winschool-primary focus:border-transparent text-gray-900 dark:text-gray-100 transition-all"
                style="font-family: Inter, sans-serif;"
              >
                <option value="All Status">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Table Area -->
      <div class="lg:col-span-3">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">
                Repeat Year Records
              </h2>
              <button 
                @click="addNewRepeatYear"
                class="bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
                style="font-family: Inter, sans-serif;"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="text-sm">Add Record</span>
              </button>
            </div>
          </div>

          <!-- Desktop Table View (hidden on mobile) -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    @click="handleSort('name')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none" 
                    style="font-family: Inter, sans-serif;"
                  >
                    <div class="flex items-center space-x-1">
                      <span>Student</span>
                      <svg v-if="sortField === 'name'" class="w-4 h-4" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th 
                    @click="handleSort('currentGrade')"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none" 
                    style="font-family: Inter, sans-serif;"
                  >
                    <div class="flex items-center space-x-1">
                      <span>Current Grade</span>
                      <svg v-if="sortField === 'currentGrade'" class="w-4 h-4" :class="sortOrder === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style="font-family: Inter, sans-serif;">
                    Reason
                  </th>
                  <th 
                    @click="handleSort('status')"
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
                        <div class="text-sm text-gray-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">{{ student.studentId }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ student.currentGrade }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 dark:text-gray-100 max-w-xs" style="font-family: Inter, sans-serif;">{{ student.reason }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="getStatusBadgeClass(student.status)"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      style="font-family: Inter, sans-serif;"
                    >
                      {{ student.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button 
                        @click="viewStudent(student)"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                        title="View Details"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        @click="editStudent(student)"
                        class="text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 dark:hover:text-yellow-300 transition-colors"
                        title="Edit"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        v-if="student.status === 'pending'"
                        @click="approveStudent(student)"
                        class="text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors"
                        title="Approve"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Card View (visible on mobile only) -->
          <div class="lg:hidden space-y-4">
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
                    {{ student.studentId }}
                  </p>
                </div>
                <span 
                  :class="getStatusBadgeClass(student.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  style="font-family: Inter, sans-serif;"
                >
                  {{ student.status }}
                </span>
              </div>

              <!-- Student Details -->
              <div class="space-y-2 mb-4">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-medium text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Current Grade:</span>
                  <span class="text-xs text-gray-900 dark:text-gray-100 font-semibold" style="font-family: Inter, sans-serif;">{{ student.currentGrade }}</span>
                </div>
                <div class="border-t border-gray-100 dark:border-gray-700 pt-2">
                  <span class="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1" style="font-family: Inter, sans-serif;">Reason:</span>
                  <p class="text-xs text-gray-900 dark:text-gray-100 leading-relaxed" style="font-family: Inter, sans-serif;">{{ student.reason }}</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button 
                  @click="viewStudent(student)"
                  class="flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                  style="font-family: Inter, sans-serif;"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View</span>
                </button>
                <button 
                  @click="editStudent(student)"
                  class="flex-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                  style="font-family: Inter, sans-serif;"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
                <button 
                  v-if="student.status === 'pending'"
                  @click="approveStudent(student)"
                  class="flex-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                  style="font-family: Inter, sans-serif;"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Approve</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredRepeaters.length === 0" class="p-12 text-center">
            <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2" style="font-family: Inter, sans-serif;">
              No Repeat Year Records Found
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6" style="font-family: Inter, sans-serif;">
              No repeat year records yet. Use filters or add a new entry.
            </p>
            <button 
              @click="addNewRepeatYear"
              class="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2 mx-auto"
              style="font-family: Inter, sans-serif;"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add First Record</span>
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="filteredRepeaters.length > 0" class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <p class="text-sm text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">
                  Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredRepeaters.length) }} of {{ filteredRepeaters.length }} results
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all"
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
                  class="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all"
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

    <!-- Edit/Add Modal -->
    <div v-if="showEditDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900" style="font-family: Inter, sans-serif;">
              {{ editingRepeatYear ? 'Edit Repeat Year' : 'Add Repeat Year' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveRepeatYear" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">Academic Year</label>
                <select v-model="repeatYearForm.year" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700" style="font-family: Inter, sans-serif;">
                  <option value="" class="text-gray-500">Select Year</option>
                  <option value="2023/24" class="text-gray-900">2023/24</option>
                  <option value="2024/25" class="text-gray-900">2024/25</option>
                  <option value="2025/26" class="text-gray-900">2025/26</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">Status</label>
                <select v-model="repeatYearForm.status" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700" style="font-family: Inter, sans-serif;">
                  <option value="" class="text-gray-500">Select Status</option>
                  <option value="pending" class="text-gray-900">Pending</option>
                  <option value="in_progress" class="text-gray-900">In Progress</option>
                  <option value="completed" class="text-gray-900">Completed</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style="font-family: Inter, sans-serif;">Reason</label>
              <textarea v-model="repeatYearForm.reason" required rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700" style="font-family: Inter, sans-serif;" placeholder="Enter reason for repeat year..."></textarea>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                style="font-family: Inter, sans-serif;"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors"
                style="font-family: Inter, sans-serif;"
              >
                {{ editingRepeatYear ? 'Update Record' : 'Add Record' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Details Modal -->
    <div v-if="showDetailsDialog && selectedStudent" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center">
              <img :src="selectedStudent.avatar" :alt="selectedStudent.name" class="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg mr-4" />
              <div>
                <h3 class="text-xl font-semibold text-gray-900" style="font-family: Inter, sans-serif;">{{ selectedStudent.name }}'s Repeat Year Details</h3>
                <p class="text-gray-600" style="font-family: Inter, sans-serif;">Class: {{ selectedStudent.class }}</p>
              </div>
            </div>
            <button @click="showDetailsDialog = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-4" style="font-family: Inter, sans-serif;">Basic Information</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600" style="font-family: Inter, sans-serif;">Academic Year:</span>
                  <span class="font-semibold text-gray-900" style="font-family: Inter, sans-serif;">{{ selectedStudent.repeatYear.year }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600" style="font-family: Inter, sans-serif;">Status:</span>
                  <span 
                    :class="getStatusBadgeClass(selectedStudent.repeatYear.status)" 
                    class="text-xs font-medium px-3 py-1 rounded-full"
                    style="font-family: Inter, sans-serif;"
                  >
                    {{ formatStatus(selectedStudent.repeatYear.status) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600" style="font-family: Inter, sans-serif;">Reason:</span>
                  <span class="font-semibold text-gray-900 text-right max-w-xs" style="font-family: Inter, sans-serif;">{{ selectedStudent.repeatYear.reason }}</span>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-gray-900 mb-4" style="font-family: Inter, sans-serif;">Subjects to Repeat</h4>
              <div class="space-y-2">
                <div v-for="subjectId in selectedStudent.repeatYear.subjects" :key="subjectId" class="flex items-center p-2 bg-white rounded-md">
                  <svg class="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span class="text-gray-900" style="font-family: Inter, sans-serif;">{{ getSubjectName(subjectId) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-6">
            <button 
              @click="showDetailsDialog = false"
              class="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
import { ref, computed } from 'vue'

// Mock data for demonstration
const repeatYearStudents = ref([
  {
    id: '1',
    name: 'Alex Johnson',
    studentId: 'STU2024001',
    avatar: 'https://i.pravatar.cc/150?img=1',
    currentGrade: 'Grade 10',
    reason: 'Failed core mathematics subjects and requires additional support in foundational concepts',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    studentId: 'STU2024002',
    avatar: 'https://i.pravatar.cc/150?img=2',
    currentGrade: 'Grade 9',
    reason: 'Extended medical leave resulting in missed curriculum requirements',
    status: 'approved'
  },
  {
    id: '3',
    name: 'David Chen',
    studentId: 'STU2024003',
    avatar: 'https://i.pravatar.cc/150?img=3',
    currentGrade: 'Grade 11',
    reason: 'Language barrier difficulties affecting academic performance across multiple subjects',
    status: 'under_review'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    studentId: 'STU2024004',
    avatar: 'https://i.pravatar.cc/150?img=4',
    currentGrade: 'Grade 8',
    reason: 'Family relocation mid-year causing curriculum alignment issues',
    status: 'rejected'
  },
  {
    id: '5',
    name: 'Michael Brown',
    studentId: 'STU2024005',
    avatar: 'https://i.pravatar.cc/150?img=5',
    currentGrade: 'Grade 12',
    reason: 'Personal circumstances affecting attendance and academic performance',
    status: 'pending'
  }
])

const availableSubjects = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Physics' },
  { id: 3, name: 'Chemistry' },
  { id: 4, name: 'English' },
  { id: 5, name: 'German' },
  { id: 6, name: 'History' },
  { id: 7, name: 'Biology' }
]

// State
const filters = ref({
  search: '',
  class: 'All Classes',
  status: 'All Status'
})

const showEditDialog = ref(false)
const showDetailsDialog = ref(false)
const editingRepeatYear = ref<any>(null)
const selectedStudent = ref<any>(null)
const currentPage = ref(1)
const itemsPerPage = ref(5)
const sortField = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const repeatYearForm = ref({
  year: '',
  status: '',
  reason: '',
  subjects: []
})

// Computed properties
const filteredRepeaters = computed(() => {
  let filtered = [...repeatYearStudents.value]

  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase().trim()
    filtered = filtered.filter(student =>
      student.name.toLowerCase().includes(search) ||
      student.studentId.toLowerCase().includes(search) ||
      student.currentGrade.toLowerCase().includes(search) ||
      student.reason.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (filters.value.status !== 'All Status') {
    const statusMap = {
      'Pending': 'pending',
      'In Progress': 'in_progress',
      'Completed': 'completed'
    }
    filtered = filtered.filter(student => student.status === statusMap[filters.value.status as keyof typeof statusMap])
  }

  // Academic year filter
  if (filters.value.class !== 'All Classes') {
    filtered = filtered.filter(student => student.class === filters.value.class)
  }

  // Apply sorting
  if (sortField.value) {
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField.value) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'currentGrade':
          aValue = a.currentGrade.toLowerCase()
          bValue = b.currentGrade.toLowerCase()
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return filtered
})

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRepeaters.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredRepeaters.value.length / itemsPerPage.value))

const totalRepeaters = computed(() => filteredRepeaters.value.length)
const pendingCount = computed(() => filteredRepeaters.value.filter(s => s.status === 'pending').length)
const inProgressCount = computed(() => filteredRepeaters.value.filter(s => s.status === 'in_progress').length)
const completedCount = computed(() => filteredRepeaters.value.filter(s => s.status === 'completed').length)

// Methods
const getStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-700'
}

const formatStatus = (status: string) => {
  const statusMap = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getSubjectName = (id: number) => {
  const subject = availableSubjects.find(s => s.id === id)
  return subject ? subject.name : 'Unknown Subject'
}

const refreshData = () => {
  console.log('Refreshing data')
  // Add animation or loading state here
}

const exportReport = () => {
  console.log('Exporting report')
  alert('Export functionality would be implemented here')
}

const addNewRepeatYear = () => {
  editingRepeatYear.value = null
  repeatYearForm.value = {
    year: '',
    status: '',
    reason: '',
    subjects: []
  }
  showEditDialog.value = true
}

const viewStudent = (student: any) => {
  console.log('Viewing student:', student.name)
  selectedStudent.value = student
  showDetailsDialog.value = true
}

const editStudent = (student: any) => {
  console.log('Editing student:', student.name)
  editingRepeatYear.value = student
  repeatYearForm.value = {
    year: student.repeatYear.year,
    status: student.repeatYear.status,
    reason: student.repeatYear.reason,
    subjects: student.repeatYear.subjects
  }
  showEditDialog.value = true
}

const approveStudent = (student: any) => {
  console.log('Approving student:', student.name)
  // Implementation for approving student
}

const saveRepeatYear = () => {
  console.log('Saving repeat year:', repeatYearForm.value)
  showEditDialog.value = false
  resetForm()
}

const closeModal = () => {
  showEditDialog.value = false
  resetForm()
}

const resetForm = () => {
  repeatYearForm.value = {
    year: '',
    status: '',
    reason: '',
    subjects: []
  }
  editingRepeatYear.value = null
}

const handleSort = (field: string) => {
  if (field === sortField.value) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}
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
