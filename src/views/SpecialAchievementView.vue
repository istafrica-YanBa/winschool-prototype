<template>
  <div class="space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen p-6">
    <!-- Header -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              Special Achievements
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              Track and celebrate outstanding student accomplishments
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
            @click="addNewAchievement"
            class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add Achievement
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-md">
        <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ totalAchievements }}</div>
        <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Total</div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-md">
        <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ academicCount }}</div>
        <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Academic</div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-md">
        <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ sportsCount }}</div>
        <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Sports</div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-md">
        <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        </div>
        <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ artsCount }}</div>
        <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Arts</div>
      </div>
    </div>

    <!-- Filters and Content -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Filter Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 sticky top-6">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">Filters</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search Achievements</label>
              <div class="relative">
                <input
                  v-model="filters.search"
                  type="text"
                  placeholder="Search by title or student..."
                  class="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 transition-all"
                />
                <svg class="absolute left-3 top-2.5 w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
              <select v-model="filters.category" class="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-50">
                <option value="">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Sports">Sports</option>
                <option value="Arts">Arts</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Academic Year</label>
              <select v-model="filters.year" class="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-50">
                <option value="">All Years</option>
                <option value="2024/25">2024/25</option>
                <option value="2023/24">2023/24</option>
                <option value="2022/23">2022/23</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
              <select v-model="filters.status" class="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-50">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <button 
              @click="resetFilters" 
              class="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Main Table Area -->
      <div class="lg:col-span-3">
        <div class="bg-white dark:bg-slate-800 shadow-md rounded-xl overflow-hidden">
          <div class="p-6 border-b border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-50">
                Special Achievements
              </h2>
              <span class="text-sm text-slate-600 dark:text-slate-400">
                {{ achievements.length }} achievements
              </span>
            </div>
          </div>

          <!-- Desktop Table View (hidden on mobile) -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead class="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Achievement
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                <tr 
                  v-for="achievement in paginatedAchievements" 
                  :key="achievement.id"
                  class="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" :src="achievement.student.avatar" :alt="achievement.student.name" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ achievement.student.name }}</div>
                        <div class="text-sm text-slate-500 dark:text-slate-400">{{ achievement.student.grade }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ achievement.title }}</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ achievement.description }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="getCategoryBadgeClass(achievement.category)"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                    >
                      {{ achievement.category }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-800 dark:text-slate-50">
                    {{ formatDate(achievement.dateAwarded) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="getStatusBadgeClass(achievement.status)"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                    >
                      {{ achievement.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button 
                        @click="editAchievement(achievement)" 
                        class="text-blue-600 dark:text-blue-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:scale-105 transition-all"
                        title="Edit"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        @click="deleteAchievement(achievement)" 
                        class="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 hover:scale-105 transition-all"
                        title="Delete"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
              v-for="achievement in paginatedAchievements"
              :key="achievement.id"
              class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
            >
              <!-- Achievement Header -->
              <div class="flex items-start space-x-3 mb-3">
                <img class="h-12 w-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600" :src="achievement.student.avatar" :alt="achievement.student.name" />
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-50 truncate">
                    {{ achievement.student.name }}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    {{ achievement.student.grade }}
                  </p>
                </div>
                <div class="flex flex-col items-end space-y-1">
                  <span 
                    :class="getStatusBadgeClass(achievement.status)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ achievement.status }}
                  </span>
                  <span 
                    :class="getCategoryBadgeClass(achievement.category)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ achievement.category }}
                  </span>
                </div>
              </div>

              <!-- Achievement Details -->
              <div class="space-y-2 mb-4">
                <div>
                  <h4 class="text-sm font-medium text-slate-800 dark:text-slate-50">
                    {{ achievement.title }}
                  </h4>
                  <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {{ achievement.description }}
                  </p>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span class="text-xs font-medium text-slate-600 dark:text-slate-400">Date Awarded:</span>
                  <span class="text-xs text-slate-800 dark:text-slate-50 font-semibold">{{ formatDate(achievement.date) }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button 
                  @click="editAchievement(achievement)"
                  class="flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
                <button 
                  @click="deleteAchievement(achievement)"
                  class="flex-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredAchievements.length > 0" class="bg-white dark:bg-slate-800 px-4 py-3 border-t border-slate-200 dark:border-slate-700 sm:px-6">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <p class="text-sm text-slate-700 dark:text-slate-300">
                  Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredAchievements.length) }} of {{ filteredAchievements.length }} results
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all"
                >
                  Previous
                </button>
                <span class="text-sm text-slate-700 dark:text-slate-300">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>
                <button
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all"
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
    <div v-if="showEditDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
              {{ editingAchievement ? 'Edit Achievement' : 'Add New Achievement' }}
            </h3>
            <button @click="closeModal" class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveAchievement" class="space-y-6">
            <!-- Student Selection -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Student</label>
              <select v-model="achievementForm.student" required class="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-50">
                <option value="">Select a student</option>
                <option v-for="student in mockStudents" :key="student.id" :value="student">{{ student.name }} - {{ student.grade }}</option>
              </select>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
              <select v-model="achievementForm.category" required class="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-50">
                <option value="">Select a category</option>
                <option value="Academic">Academic</option>
                <option value="Sports">Sports</option>
                <option value="Arts">Arts</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Achievement Title -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Achievement Title</label>
              <input v-model="achievementForm.title" type="text" required class="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-50" />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
              <textarea v-model="achievementForm.description" rows="3" required class="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-50 resize-none"></textarea>
            </div>

            <!-- Date and Year -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date Achieved</label>
                <input v-model="achievementForm.date" type="date" required class="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-50" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Academic Year</label>
                <select v-model="achievementForm.year" required class="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-slate-50">
                  <option value="">Select academic year</option>
                  <option value="2024/25">2024/25</option>
                  <option value="2023/24">2023/24</option>
                  <option value="2022/23">2022/23</option>
                </select>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button 
                type="button"
                @click="closeModal"
                :disabled="isSubmitting"
                class="px-6 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="isSubmitting"
                class="px-6 py-2 text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg v-if="isSubmitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ editingAchievement ? 'Update Achievement' : 'Save Achievement' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Mock Data
const mockStudents = ref([
  {
    id: 1,
    name: 'Emma Johnson',
    grade: 'Grade 10',
    class: '10A',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 2,
    name: 'Michael Chen',
    grade: 'Grade 11',
    class: '11B', 
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 3,
    name: 'Sarah Williams',
    grade: 'Grade 9',
    class: '9C',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 4,
    name: 'David Rodriguez',
    grade: 'Grade 12',
    class: '12A',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    grade: 'Grade 10',
    class: '10B',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 6,
    name: 'Alex Kumar',
    grade: 'Grade 11',
    class: '11A',
    avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 7,
    name: 'Maria Garcia',
    grade: 'Grade 9',
    class: '9A',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
])

// State Management
const showEditDialog = ref(false)
const editingAchievement = ref<any>(null)
const editingMode = ref<'add' | 'edit'>('add')
const isSubmitting = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(8)

// Filters
const filters = ref({
  search: '',
  category: '',
  year: '',
  status: ''
})

// Form data
const achievementForm = ref({
  student: '',
  category: '',
  year: '',
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0]
})

// Achievements Data
const achievements = ref([
  {
    id: 1,
    student: mockStudents.value[0],
    category: 'Academic',
    year: '2023/24',
    title: 'Mathematics Olympiad Winner',
    description: 'First place in the regional mathematics competition, demonstrating exceptional problem-solving skills and mathematical reasoning. Solved complex algebraic equations and geometric proofs under time pressure.',
    date: '2023-12-15',
    dateAwarded: '2023-12-15',
    createdAt: '2023-12-16',
    status: 'Active',
    document: 'math_olympiad_certificate.pdf'
  },
  {
    id: 2,
    student: mockStudents.value[1],
    category: 'Sports',
    year: '2023/24',
    title: 'Basketball Championship MVP',
    description: 'Led the school team to victory in the district championship, earning Most Valuable Player award for outstanding performance. Scored 28 points in the final game and demonstrated exceptional leadership.',
    date: '2024-01-20',
    dateAwarded: '2024-01-20',
    createdAt: '2024-01-21',
    status: 'Active',
    document: 'basketball_championship.pdf'
  },
  {
    id: 3,
    student: mockStudents.value[2],
    category: 'Arts',
    year: '2023/24',
    title: 'Regional Art Fair Gold Medal',
    description: 'Featured artist in the annual school art exhibition, winning gold medal for innovative digital art composition. The artwork explored themes of environmental conservation through mixed media.',
    date: '2024-02-10',
    dateAwarded: '2024-02-10',
    createdAt: '2024-02-11',
    status: 'Active',
    document: 'art_exhibition_certificate.pdf'
  },
  {
    id: 4,
    student: mockStudents.value[3],
    category: 'Academic',
    year: '2024/25',
    title: 'Coding Olympiad Champion',
    description: 'First place in the national programming competition, solving complex algorithmic challenges with creative solutions. Implemented efficient data structures and algorithms in multiple programming languages.',
    date: '2024-03-05',
    dateAwarded: '2024-03-05',
    createdAt: '2024-03-06',
    status: 'Active',
    document: 'coding_olympiad.pdf'
  },
  {
    id: 5,
    student: mockStudents.value[4],
    category: 'Sports',
    year: '2024/25',
    title: 'Swimming Regional Record',
    description: 'Set new regional record in 200m freestyle, qualifying for national swimming championships. Achieved a time of 1:58.45, breaking the previous record by 2.3 seconds.',
    date: '2024-02-28',
    dateAwarded: '2024-02-28',
    createdAt: '2024-03-01',
    status: 'Active',
    document: 'swimming_record.pdf'
  },
  {
    id: 6,
    student: mockStudents.value[5],
    category: 'Arts',
    year: '2024/25',
    title: 'Debate Tournament Champion',
    description: 'Won the inter-school debate championship, demonstrating exceptional public speaking and argumentation skills. Defended positions on complex social and political topics with eloquence and evidence-based reasoning.',
    date: '2024-01-15',
    dateAwarded: '2024-01-15',
    createdAt: '2024-01-16',
    status: 'Active',
    document: 'debate_championship.pdf'
  },
  {
    id: 7,
    student: mockStudents.value[6],
    category: 'Academic',
    year: '2022/23',
    title: 'Science Fair Innovation Award',
    description: 'Received innovation award for groundbreaking research project on renewable energy solutions. Developed a prototype solar panel system with 15% improved efficiency using novel materials.',
    date: '2023-05-20',
    dateAwarded: '2023-05-20',
    createdAt: '2023-05-21',
    status: 'Archived',
    document: 'science_fair_award.pdf'
  },
  {
    id: 8,
    student: mockStudents.value[1],
    category: 'Other',
    year: '2024/25',
    title: 'Community Service Leadership',
    description: 'Led volunteer initiative that raised funds for local charity, demonstrating exceptional leadership and community commitment. Organized team of 25 volunteers and raised over $5,000 for homeless shelter.',
    date: '2024-04-10',
    dateAwarded: '2024-04-10',
    createdAt: '2024-04-11',
    status: 'Active',
    document: 'community_service.pdf'
  }
])

// Computed Properties
const filteredAchievements = computed(() => {
  let filtered = achievements.value

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(achievement => 
      achievement.title.toLowerCase().includes(searchTerm) ||
      achievement.student.name.toLowerCase().includes(searchTerm) ||
      achievement.description.toLowerCase().includes(searchTerm)
    )
  }

  // Apply category filter
  if (filters.value.category && filters.value.category !== '') {
    filtered = filtered.filter(achievement => achievement.category === filters.value.category)
  }

  // Apply year filter
  if (filters.value.year && filters.value.year !== '') {
    filtered = filtered.filter(achievement => achievement.year === filters.value.year)
  }

  // Apply status filter
  if (filters.value.status && filters.value.status !== '') {
    filtered = filtered.filter(achievement => achievement.status === filters.value.status)
  }

  // Default sort by date (newest first)
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredAchievements.value.length / itemsPerPage.value))

const paginatedAchievements = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredAchievements.value.slice(start, end)
})

// Statistics Computed Properties
const totalAchievements = computed(() => filteredAchievements.value.length)
const academicCount = computed(() => filteredAchievements.value.filter(a => a.category === 'Academic').length)
const sportsCount = computed(() => filteredAchievements.value.filter(a => a.category === 'Sports').length)
const artsCount = computed(() => filteredAchievements.value.filter(a => a.category === 'Arts').length)

// Watch for filter changes to reset pagination
watch([filters], () => {
  currentPage.value = 1
}, { deep: true })

// Utility Methods
const getCategoryBadgeClass = (category: string) => {
  const classes = {
    Academic: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200',
    Sports: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    Arts: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    Other: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200'
  }
  return classes[category as keyof typeof classes] || 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    Archived: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200'
  }
  return classes[status as keyof typeof classes] || 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const resetFilters = () => {
  filters.value = {
    search: '',
    category: '',
    year: '',
    status: ''
  }
}

const resetForm = () => {
  achievementForm.value = {
    student: '',
    category: '',
    year: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  }
  editingAchievement.value = null
  editingMode.value = 'add'
}

// CRUD Operations
const addNewAchievement = () => {
  editingAchievement.value = null
  editingMode.value = 'add'
  achievementForm.value = {
    student: '',
    category: '',
    year: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  }
  showEditDialog.value = true
}

const editAchievement = (achievement: any) => {
  editingAchievement.value = achievement
  editingMode.value = 'edit'
  achievementForm.value = {
    student: achievement.student.name || achievement.student,
    category: achievement.category,
    year: achievement.year,
    title: achievement.title,
    description: achievement.description,
    date: achievement.date
  }
  showEditDialog.value = true
}

const saveAchievement = () => {
  if (!achievementForm.value) return
    
  if (editingMode.value === 'edit' && editingAchievement.value) {
      const index = achievements.value.findIndex(a => a.id === editingAchievement.value.id)
      if (index !== -1) {
        achievements.value[index] = {
          ...editingAchievement.value,
        student: {
          ...editingAchievement.value.student,
          name: achievementForm.value.student
        },
          category: achievementForm.value.category,
          year: achievementForm.value.year,
          title: achievementForm.value.title,
          description: achievementForm.value.description,
          date: achievementForm.value.date,
        updatedAt: new Date().toISOString()
        }
      }
    } else {
      const newAchievement = {
      id: Date.now(),
      student: {
        id: 1,
        name: achievementForm.value.student,
        grade: 'Grade 10',
        class: '10A',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
        category: achievementForm.value.category,
        year: achievementForm.value.year,
        title: achievementForm.value.title,
        description: achievementForm.value.description,
        date: achievementForm.value.date,
        dateAwarded: achievementForm.value.date,
      createdAt: new Date().toISOString(),
      status: 'Active',
      document: 'achievement_certificate.pdf'
      }
      achievements.value.unshift(newAchievement)
    }
    
    showEditDialog.value = false
  resetForm()
}

const deleteAchievement = (achievement: any) => {
  if (confirm(`Are you sure you want to delete the achievement "${achievement.title}" for ${achievement.student.name}?`)) {
    const index = achievements.value.findIndex(a => a.id === achievement.id)
    if (index !== -1) {
      achievements.value.splice(index, 1)
      console.log('Achievement deleted successfully')
      
      // Reset pagination if current page is empty
      const maxPage = Math.ceil(filteredAchievements.value.length / itemsPerPage.value)
      if (currentPage.value > maxPage && maxPage > 0) {
        currentPage.value = maxPage
      }
    }
  }
}

const exportReport = () => {
  console.log('Exporting achievements report')
  
  // Generate CSV content
  const headers = ['Student Name', 'Grade', 'Category', 'Title', 'Date', 'Academic Year', 'Description']
  const csvContent = [
    headers.join(','),
    ...filteredAchievements.value.map(achievement => [
      `"${achievement.student.name}"`,
      `"${achievement.student.grade}"`,
      `"${achievement.category}"`,
      `"${achievement.title}"`,
      `"${achievement.date}"`,
      `"${achievement.year}"`,
      `"${achievement.description.replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n')
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `achievements-report-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
  
  console.log('Report exported successfully')
}

const closeModal = () => {
  showEditDialog.value = false
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

.dark .overflow-x-auto::-webkit-scrollbar-track {
  background: #334155;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #64748b;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #475569;
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
