<template>
  <div class="teacher-management bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Breadcrumb Navigation -->
    <div class="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-4">
      <a href="/dashboard" class="hover:underline">Home</a>
      <span class="mx-1">/</span>
      <a href="/dashboard" class="hover:underline">Administration</a>
      <span class="mx-1">/</span>
      <span class="font-medium">Teacher Management</span>
    </div>
    
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Lehrerverwaltung' : 'Teacher Management' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie Lehrerprofile und -aufgaben' : 'Manage teacher profiles and assignments' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button 
          @click="showOvertimeModal = true" 
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ language === 'de' ? 'Überstunden' : 'Overtime' }}
        </button>
        <button 
          @click="showAbsenceModal = true" 
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ language === 'de' ? 'Abwesenheit' : 'Absence' }}
        </button>
        <button 
          @click="showAddTeacher" 
          class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          {{ language === 'de' ? 'Lehrer hinzufügen' : 'Add Teacher' }}
        </button>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              v-model="search"
              type="text"
              :placeholder="language === 'de' ? 'Lehrer suchen...' : 'Search teachers...'"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
        <div class="flex gap-4">
          <select
            v-model="selectedDepartment"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Alle Abteilungen' : 'All Departments' }}</option>
            <option v-for="dept in departments.slice(1)" :key="dept" :value="dept">{{ dept }}</option>
          </select>
          <select
            v-model="selectedStatus"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option v-for="status in statusOptions.slice(1)" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Desktop Table View (hidden on mobile) -->
    <div class="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ language === 'de' ? 'Abteilung' : 'Department' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ language === 'de' ? 'Fächer' : 'Subjects' }}
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ language === 'de' ? 'Wochenstunden' : 'Weekly Hours' }}
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ language === 'de' ? 'Status' : 'Status' }}
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="teacher in paginatedTeachers" :key="teacher.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <!-- Name Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="teacher.avatar" :alt="teacher.name" class="h-10 w-10 rounded-full object-cover mr-3 border border-gray-200 dark:border-gray-600" />
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ teacher.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ teacher.email }}</div>
                  </div>
                </div>
              </td>

              <!-- Department Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ teacher.department }}</div>
              </td>

              <!-- Subjects Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="subject in teacher.subjects.slice(0, 2)"
                    :key="subject"
                    class="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 rounded-full"
                  >
                    {{ subject }}
                  </span>
                  <span
                    v-if="teacher.subjects.length > 2"
                    class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full"
                  >
                    +{{ teacher.subjects.length - 2 }}
                  </span>
                </div>
              </td>

              <!-- Weekly Hours Column -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="getHoursColor(teacher.weeklyHours)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ teacher.weeklyHours }}h
                </span>
              </td>

              <!-- Status Column -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="getStatusColor(teacher.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ teacher.status }}
                </span>
              </td>

              <!-- Actions Column -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex justify-center space-x-2">
                  <button
                    @click="viewTeacher(teacher)"
                    class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    :title="language === 'de' ? 'Profil anzeigen' : 'View Profile'"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button
                    @click="editTeacher(teacher)"
                    class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    :title="language === 'de' ? 'Bearbeiten' : 'Edit'"
                  >
                    <Edit class="h-4 w-4" />
                  </button>
                  <button
                    @click="viewSchedule(teacher)"
                    class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    :title="language === 'de' ? 'Stundenplan' : 'Schedule'"
                  >
                    <Calendar class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Desktop Pagination -->
      <div v-if="filteredTeachers.length > itemsPerPage" class="hidden lg:flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          {{ language === 'de' ? 'Zeige' : 'Showing' }} 
          {{ ((currentPage - 1) * itemsPerPage) + 1 }} 
          {{ language === 'de' ? 'bis' : 'to' }} 
          {{ Math.min(currentPage * itemsPerPage, filteredTeachers.length) }} 
          {{ language === 'de' ? 'von' : 'of' }} 
          {{ filteredTeachers.length }} 
          {{ language === 'de' ? 'Lehrern' : 'teachers' }}
        </div>
        <div class="flex space-x-1">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ language === 'de' ? 'Zurück' : 'Previous' }}
          </button>
          
          <template v-for="page in visiblePageNumbers" :key="page">
            <button
              v-if="page !== '...'"
              @click="currentPage = Number(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">...</span>
          </template>
          
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ language === 'de' ? 'Weiter' : 'Next' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Card View (visible on mobile only) -->
    <div class="lg:hidden space-y-4 mb-6">
      <div
        v-for="teacher in paginatedTeachers"
        :key="teacher.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
      >
        <!-- Teacher Header -->
        <div class="flex items-center space-x-3 mb-3">
          <img :src="teacher.avatar" :alt="teacher.name" class="h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" />
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {{ teacher.name }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ teacher.email }}
            </p>
          </div>
          <span :class="getStatusColor(teacher.status)" class="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap">
            {{ teacher.status }}
          </span>
        </div>

        <!-- Teacher Details -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {{ language === 'de' ? 'Abteilung' : 'Department' }}
            </p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ teacher.department }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {{ language === 'de' ? 'Wochenstunden' : 'Weekly Hours' }}
            </p>
            <span :class="getHoursColor(teacher.weeklyHours)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ teacher.weeklyHours }}h
            </span>
          </div>
        </div>

        <!-- Subjects -->
        <div class="mb-4">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            {{ language === 'de' ? 'Fächer' : 'Subjects' }}
          </p>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="subject in teacher.subjects.slice(0, 3)"
              :key="subject"
              class="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 rounded-full"
            >
              {{ subject }}
            </span>
            <span
              v-if="teacher.subjects.length > 3"
              class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full"
            >
              +{{ teacher.subjects.length - 3 }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button @click="viewTeacher(teacher)" class="p-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
            <Eye class="h-4 w-4" />
          </button>
          <button @click="editTeacher(teacher)" class="p-2 text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 rounded-lg transition-colors">
            <Edit class="h-4 w-4" />
          </button>
          <button @click="viewSchedule(teacher)" class="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
            <Calendar class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Mobile Pagination -->
      <div v-if="filteredTeachers.length > itemsPerPage" class="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          {{ language === 'de' ? 'Zeige' : 'Showing' }} 
          {{ ((currentPage - 1) * itemsPerPage) + 1 }} 
          {{ language === 'de' ? 'bis' : 'to' }} 
          {{ Math.min(currentPage * itemsPerPage, filteredTeachers.length) }} 
          {{ language === 'de' ? 'von' : 'of' }} 
          {{ filteredTeachers.length }} 
          {{ language === 'de' ? 'Lehrern' : 'teachers' }}
        </div>
        <div class="flex space-x-1">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ language === 'de' ? 'Zurück' : 'Previous' }}
          </button>
          
          <template v-for="page in visiblePageNumbers" :key="page">
            <button
              v-if="page !== '...'"
              @click="currentPage = Number(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">...</span>
          </template>
          
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ language === 'de' ? 'Weiter' : 'Next' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Teacher Modal -->
    <div v-if="showDialog" class="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditing ? (language === 'de' ? 'Lehrer bearbeiten' : 'Edit Teacher') : (language === 'de' ? 'Neuen Lehrer hinzufügen' : 'Add New Teacher') }}
            </h3>
            <button @click="showDialog = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveTeacher" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Vollständiger Name' : 'Full Name' }}
                </label>
                <input
                  v-model="editedTeacher.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'E-Mail' : 'Email' }}
                </label>
                <input
                  v-model="editedTeacher.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Abteilung' : 'Department' }}
                </label>
                <select
                  v-model="editedTeacher.department"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{{ language === 'de' ? 'Abteilung wählen' : 'Select Department' }}</option>
                  <option v-for="dept in departments.slice(1)" :key="dept" :value="dept">{{ dept }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Status' : 'Status' }}
                </label>
                <select
                  v-model="editedTeacher.status"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option v-for="status in statusOptions.slice(1)" :key="status" :value="status">{{ status }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Fächer' : 'Subjects' }}
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label v-for="subject in subjectOptions" :key="subject" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="subject"
                    v-model="editedTeacher.subjects"
                    class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ subject }}</span>
                </label>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showDialog = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Speichern' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Overtime Modal -->
    <div v-if="showOvertimeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Überstunden verwalten' : 'Manage Overtime' }}
            </h3>
            <button @click="showOvertimeModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveOvertime" class="space-y-6">
            <!-- Teacher Selection -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Lehrer auswählen' : 'Select Teacher' }}
              </h4>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
                </label>
                <select
                  v-model="overtimeForm.selectedTeacher"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{{ language === 'de' ? 'Lehrer wählen...' : 'Select teacher...' }}</option>
                  <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.name }} - {{ teacher.department }}
                  </option>
                </select>
              </div>
            </div>

            <!-- General Overtime Details -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Allgemeine Überstundendetails' : 'General Overtime Details' }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Zu gebende Stunden' : 'Hours to be given' }}
                  </label>
                  <input v-model="overtimeForm.hoursToBeGiven" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Exkl. und Messstunden' : 'Excl. and measuring hours' }}
                  </label>
                  <input v-model="overtimeForm.measuringHours" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Delegation/Zugang' : 'Delegation/access' }}
                  </label>
                  <input v-model="overtimeForm.delegation" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Tatenstunden' : 'Deed hours' }}
                  </label>
                  <input v-model="overtimeForm.deedHours" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Gewährte Stunden' : 'Hours granted' }}
                  </label>
                  <input v-model="overtimeForm.hoursGranted" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Zusätzliche Tatenstunden' : 'Additional deed hours' }}
                  </label>
                  <input v-model="overtimeForm.deedHours2" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
            </div>

            <!-- Calculated Totals -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Berechnete Summen' : 'Calculated Totals' }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Über-/Unterstunden (Halbjahr)' : 'Over-/undertime (Half-year)' }}
                  </label>
                  <div class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white">
                    {{ calculateOverUndertime() }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Gesamtarbeit' : 'Total work' }}
                  </label>
                  <div class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white">
                    {{ calculateTotalWork() }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Zusätzliche Arbeit' : 'Additional work' }}
                  </label>
                  <input v-model="overtimeForm.additionalWork" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'davon bezahlt' : 'of which paid' }}
                  </label>
                  <input v-model="overtimeForm.ofWhichPaid" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Überstunden/Unterstunden' : 'Overtime/undertime' }}
                  </label>
                  <div class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white">
                    {{ calculateFinalOvertime() }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Time History Table -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Zeitverlaufstabelle' : 'Time History Table' }}
              </h4>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                      <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Übergangsdatum' : 'Transition Date' }}
                      </th>
                      <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Abschlussdatum' : 'Closing Date' }}
                      </th>
                      <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Überstunden' : 'Overtime' }}
                      </th>
                      <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Unterstunden' : 'Undertime' }}
                      </th>
                      <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(entry, index) in overtimeForm.timeHistory" :key="index" class="border-b border-gray-100 dark:border-gray-700">
                      <td class="py-3 px-4">
                        <input v-model="entry.transitionDate" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </td>
                      <td class="py-3 px-4">
                        <input v-model="entry.closingDate" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </td>
                      <td class="py-3 px-4">
                        <input v-model="entry.overtime" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </td>
                      <td class="py-3 px-4">
                        <input v-model="entry.undertime" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                      </td>
                      <td class="py-3 px-4">
                        <button @click="removeTimeHistoryEntry(index)" class="text-red-600 hover:text-red-800">
                          <Trash2 class="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button @click="addTimeHistoryEntry" class="mt-3 text-primary-600 hover:text-primary-800 text-sm">
                + {{ language === 'de' ? 'Eintrag hinzufügen' : 'Add Entry' }}
              </button>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showOvertimeModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Speichern' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Absence Modal -->
    <div v-if="showAbsenceModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Abwesenheit hinzufügen' : 'Add Absence' }}
            </h3>
            <button @click="showAbsenceModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveAbsence" class="space-y-6">
            <!-- Teacher Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
              </label>
              <select
                v-model="absenceForm.selectedTeacher"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Lehrer wählen...' : 'Select teacher...' }}</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.name }} - {{ teacher.department }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Von Datum' : 'From Date' }}
                </label>
                <input
                  v-model="absenceForm.fromDate"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Bis Datum' : 'To Date' }}
                </label>
                <input
                  v-model="absenceForm.toDate"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Stunden' : 'Hours' }}
              </label>
              <input
                v-model="absenceForm.hours"
                type="number"
                step="0.5"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Grund' : 'Reason' }}
              </label>
              <select
                v-model="absenceForm.reason"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Grund wählen' : 'Select Reason' }}</option>
                <option value="Sick Leave">{{ language === 'de' ? 'Krankheit' : 'Sick Leave' }}</option>
                <option value="Personal Leave">{{ language === 'de' ? 'Persönlicher Grund' : 'Personal Leave' }}</option>
                <option value="Vacation">{{ language === 'de' ? 'Urlaub' : 'Vacation' }}</option>
                <option value="Professional Development">{{ language === 'de' ? 'Fortbildung' : 'Professional Development' }}</option>
                <option value="Family Emergency">{{ language === 'de' ? 'Familiennotfall' : 'Family Emergency' }}</option>
                <option value="Other">{{ language === 'de' ? 'Sonstiges' : 'Other' }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Bemerkungen' : 'Remarks' }}
              </label>
              <textarea
                v-model="absenceForm.remarks"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                :placeholder="language === 'de' ? 'Zusätzliche Informationen...' : 'Additional information...'"
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showAbsenceModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Speichern' : 'Save' }}
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
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { Search, Calendar, Eye, Edit, X, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State
const search = ref('')
const selectedDepartment = ref('')
const selectedStatus = ref('')
const showDialog = ref(false)
const showOvertimeModal = ref(false)
const showAbsenceModal = ref(false)
const isEditing = ref(false)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(6) // 6 cards per page for mobile

// Reset pagination when filters change
watch([search, selectedDepartment, selectedStatus], () => {
  currentPage.value = 1
})

// Options
const departments = ['All Departments', 'Mathematics', 'Sciences', 'Languages', 'Arts', 'Sports']
const statusOptions = ['All Status', 'Active', 'On Leave', 'Inactive']
const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'German', 'Art', 'Physical Education']

// Mock Data
const teachers = ref([
  {
    id: 1,
    name: 'Dr. Thomas Weber',
    email: 'thomas.weber@school.edu',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Mathematics',
    subjects: ['Mathematics', 'Physics'],
    weeklyHours: 28,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Ms. Sarah Schmidt',
    email: 'sarah.schmidt@school.edu',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Languages',
    subjects: ['German', 'English'],
    weeklyHours: 24,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Prof. Michael Mueller',
    email: 'michael.mueller@school.edu',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Sciences',
    subjects: ['Physics', 'Chemistry'],
    weeklyHours: 26,
    status: 'On Leave'
  },
  {
    id: 4,
    name: 'Dr. Anna Fischer',
    email: 'anna.fischer@school.edu',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Arts',
    subjects: ['Art', 'Art History'],
    weeklyHours: 20,
    status: 'Active'
  },
  {
    id: 5,
    name: 'Mr. Johannes Bauer',
    email: 'johannes.bauer@school.edu',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Sports',
    subjects: ['Physical Education', 'Swimming'],
    weeklyHours: 22,
    status: 'Active'
  },
  {
    id: 6,
    name: 'Dr. Emily Chen',
    email: 'emily.chen@school.edu',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Sciences',
    subjects: ['Biology', 'Chemistry'],
    weeklyHours: 25,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Mr. Robert Johnson',
    email: 'robert.johnson@school.edu',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Mathematics',
    subjects: ['Mathematics', 'Physics'],
    weeklyHours: 27,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Ms. Lisa Rodriguez',
    email: 'lisa.rodriguez@school.edu',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Languages',
    subjects: ['English', 'German'],
    weeklyHours: 23,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Prof. David Brown',
    email: 'david.brown@school.edu',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Arts',
    subjects: ['Art', 'Physical Education'],
    weeklyHours: 21,
    status: 'On Leave'
  },
  {
    id: 10,
    name: 'Ms. Jennifer Wilson',
    email: 'jennifer.wilson@school.edu',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Sciences',
    subjects: ['Chemistry', 'Physics'],
    weeklyHours: 26,
    status: 'Active'
  },
  {
    id: 11,
    name: 'Dr. Mark Thompson',
    email: 'mark.thompson@school.edu',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Mathematics',
    subjects: ['Mathematics'],
    weeklyHours: 29,
    status: 'Active'
  },
  {
    id: 12,
    name: 'Ms. Kate Anderson',
    email: 'kate.anderson@school.edu',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Languages',
    subjects: ['English'],
    weeklyHours: 18,
    status: 'Inactive'
  },
  {
    id: 13,
    name: 'Mr. Alex Garcia',
    email: 'alex.garcia@school.edu',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Sports',
    subjects: ['Physical Education'],
    weeklyHours: 24,
    status: 'Active'
  },
  {
    id: 14,
    name: 'Dr. Maria Lopez',
    email: 'maria.lopez@school.edu',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    department: 'Arts',
    subjects: ['Art History', 'Art'],
    weeklyHours: 22,
    status: 'Active'
  }
])

// Form States
const editedTeacher = ref({
  id: 0,
  name: '',
  email: '',
  department: '',
  subjects: [],
  status: 'Active',
  avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  weeklyHours: 28
})

const overtimeForm = ref({
  selectedTeacher: '',
  hoursToBeGiven: 0,
  measuringHours: 0,
  delegation: 0,
  deedHours: 0,
  hoursGranted: 0,
  deedHours2: 0,
  additionalWork: 0,
  ofWhichPaid: 0,
  timeHistory: [
    { transitionDate: '', closingDate: '', overtime: 0, undertime: 0 }
  ]
})

const absenceForm = ref({
  selectedTeacher: '',
  fromDate: '',
  toDate: '',
  hours: 0,
  reason: '',
  remarks: ''
})

// Computed
const filteredTeachers = computed(() => {
  return teachers.value.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(search.value.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(search.value.toLowerCase())
    const matchesDepartment = !selectedDepartment.value || teacher.department === selectedDepartment.value
    const matchesStatus = !selectedStatus.value || teacher.status === selectedStatus.value
    
    return matchesSearch && matchesDepartment && matchesStatus
  })
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredTeachers.value.length / itemsPerPage.value))

const paginatedTeachers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTeachers.value.slice(start, end)
})

const visiblePageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2 // Number of pages to show on each side of current page
  
  if (total <= 7) {
    // Show all pages if total is 7 or less
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  let range = []
  let rangeWithDots = []
  
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }
  
  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }
  
  rangeWithDots.push(...range)
  
  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else {
    rangeWithDots.push(total)
  }
  
  return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index)
})

// Methods
const getHoursColor = (hours: number) => {
  if (hours >= 28) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  if (hours >= 24) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'On Leave':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

// Overtime calculation methods
const calculateOverUndertime = () => {
  // This would be a more complex calculation in a real application
  return '21.30'
}

const calculateTotalWork = () => {
  // This would be a more complex calculation in a real application
  return '1,680.00'
}

const calculateFinalOvertime = () => {
  // This would be a more complex calculation in a real application
  return '32.25'
}

const addTimeHistoryEntry = () => {
  overtimeForm.value.timeHistory.push({ transitionDate: '', closingDate: '', overtime: 0, undertime: 0 })
}

const removeTimeHistoryEntry = (index: number) => {
  overtimeForm.value.timeHistory.splice(index, 1)
}

// Form handlers
const showAddTeacher = () => {
  isEditing.value = false
  editedTeacher.value = {
    id: 0,
    name: '',
    email: '',
    department: '',
    subjects: [],
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    weeklyHours: 28
  }
  showDialog.value = true
}

const editTeacher = (teacher: any) => {
  isEditing.value = true
  editedTeacher.value = { ...teacher }
  showDialog.value = true
}

const saveTeacher = () => {
  if (isEditing.value) {
    // Update existing teacher
    const index = teachers.value.findIndex(t => t.id === editedTeacher.value.id)
    if (index !== -1) {
      teachers.value[index] = { ...editedTeacher.value }
    }
  } else {
    // Add new teacher
    teachers.value.push({
      ...editedTeacher.value,
      id: Date.now()
    })
  }
  showDialog.value = false
}

const saveOvertime = () => {
  // In a real application, you would save the overtime data to an API
  showOvertimeModal.value = false
  
  // Get selected teacher info for display
  const selectedTeacherData = teachers.value.find(t => t.id === Number(overtimeForm.value.selectedTeacher))
  const teacherName = selectedTeacherData ? selectedTeacherData.name : 'Unknown'
  
  // Reset form
  overtimeForm.value = {
    selectedTeacher: '',
    hoursToBeGiven: 0,
    measuringHours: 0,
    delegation: 0,
    deedHours: 0,
    hoursGranted: 0,
    deedHours2: 0,
    additionalWork: 0,
    ofWhichPaid: 0,
    timeHistory: [
      { transitionDate: '', closingDate: '', overtime: 0, undertime: 0 }
    ]
  }
  
  alert(language.value === 'de' ? `Überstunden für ${teacherName} gespeichert!` : `Overtime for ${teacherName} saved!`)
}

const saveAbsence = () => {
  // In a real application, you would save the absence data to an API
  showAbsenceModal.value = false
  
  // Get selected teacher info for display
  const selectedTeacherData = teachers.value.find(t => t.id === Number(absenceForm.value.selectedTeacher))
  const teacherName = selectedTeacherData ? selectedTeacherData.name : 'Unknown'
  
  absenceForm.value = {
    selectedTeacher: '',
    fromDate: '',
    toDate: '',
    hours: 0,
    reason: '',
    remarks: ''
  }
  
  alert(language.value === 'de' ? `Abwesenheit für ${teacherName} gespeichert!` : `Absence for ${teacherName} saved!`)
}

const viewTeacher = (teacher: any) => {
  router.push(`/dashboard/teacher-profile/${teacher.id}`)
}

const viewSchedule = (teacher: any) => {
  // Navigate to teacher schedule view
  router.push(`/dashboard/teacher-schedule/${teacher.id}`)
}
</script>
