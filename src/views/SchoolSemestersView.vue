<template>
  <div class="space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen p-6">
    <!-- Header -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Schulsemester-Verwaltung' : 'School Semester Management' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Schulsemester und akademische Zeiträume' : 'Manage school semesters and academic periods' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button 
            @click="showSemesterModal = true" 
            class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {{ language === 'de' ? 'Neues Semester' : 'New Semester' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Current Semester -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4">
        {{ language === 'de' ? 'Aktuelles Semester' : 'Current Semester' }}
      </h2>
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-medium text-blue-800 dark:text-blue-200">{{ currentSemester.name }}</h3>
            <p class="text-sm text-blue-600 dark:text-blue-300 mt-1">
              {{ language === 'de' ? 'Zeitraum:' : 'Period:' }} {{ currentSemester.startDate }} - {{ currentSemester.endDate }}
            </p>
          </div>
          <span class="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
            {{ language === 'de' ? 'Aktiv' : 'Active' }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
          <div>
            <p class="text-blue-600 dark:text-blue-400">{{ language === 'de' ? 'Schüler:' : 'Students:' }}</p>
            <p class="font-medium text-blue-800 dark:text-blue-200">{{ currentSemester.students }}</p>
          </div>
          <div>
            <p class="text-blue-600 dark:text-blue-400">{{ language === 'de' ? 'Klassen:' : 'Classes:' }}</p>
            <p class="font-medium text-blue-800 dark:text-blue-200">{{ currentSemester.classes }}</p>
          </div>
          <div>
            <p class="text-blue-600 dark:text-blue-400">{{ language === 'de' ? 'Lehrer:' : 'Teachers:' }}</p>
            <p class="font-medium text-blue-800 dark:text-blue-200">{{ currentSemester.teachers }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Semester List -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4">
        {{ language === 'de' ? 'Alle Semester' : 'All Semesters' }}
      </h2>
      
      <!-- Desktop Table View -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Schuljahr' : 'School Year' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Halbjahr' : 'Half-year' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Startdatum' : 'Start Date' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Enddatum' : 'End Date' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Status' : 'Status' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-800 dark:text-slate-50">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="semester in semesters" :key="semester.id" class="border-b border-slate-100 dark:border-slate-700">
              <td class="py-3 px-4 font-medium text-slate-800 dark:text-slate-50">{{ semester.name }}</td>
              <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ semester.schoolYear }}</td>
              <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ semester.halfYear }}</td>
              <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ semester.startDate }}</td>
              <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ semester.endDate }}</td>
              <td class="py-3 px-4">
                <span :class="getSemesterStatusColor(semester.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ semester.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="editSemester(semester)" class="text-primary-600 hover:text-primary-800">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button v-if="semester.status !== 'Active'" @click="activateSemester(semester)" class="text-green-600 hover:text-green-800">
                    <CheckCircle class="h-4 w-4" />
                  </button>
                  <button v-if="semester.status !== 'Archived'" @click="archiveSemester(semester)" class="text-yellow-600 hover:text-yellow-800">
                    <Archive class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards View -->
      <div class="md:hidden space-y-4">
        <div v-for="semester in paginatedSemesters" :key="`mobile-${semester.id}`" class="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="font-semibold text-slate-800 dark:text-slate-50 text-lg">{{ semester.name }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ semester.schoolYear }} - {{ semester.halfYear }}</p>
            </div>
            <span :class="getSemesterStatusColor(semester.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ semester.status }}
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="text-center p-2 bg-white dark:bg-slate-600 rounded">
              <div class="text-sm font-bold text-slate-800 dark:text-slate-50">{{ semester.startDate }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Startdatum' : 'Start Date' }}</div>
            </div>
            <div class="text-center p-2 bg-white dark:bg-slate-600 rounded">
              <div class="text-sm font-bold text-slate-800 dark:text-slate-50">{{ semester.endDate }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Enddatum' : 'End Date' }}</div>
            </div>
          </div>
          
          <div class="flex justify-center space-x-4 pt-2 border-t border-slate-200 dark:border-slate-600">
            <button @click="editSemester(semester)" class="flex items-center text-primary-600 hover:text-primary-800 text-sm">
              <Edit class="h-4 w-4 mr-1" />
              {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
            </button>
            <button v-if="semester.status !== 'Active'" @click="activateSemester(semester)" class="flex items-center text-green-600 hover:text-green-800 text-sm">
              <CheckCircle class="h-4 w-4 mr-1" />
              {{ language === 'de' ? 'Aktivieren' : 'Activate' }}
            </button>
            <button v-if="semester.status !== 'Archived'" @click="archiveSemester(semester)" class="flex items-center text-yellow-600 hover:text-yellow-800 text-sm">
              <Archive class="h-4 w-4 mr-1" />
              {{ language === 'de' ? 'Archivieren' : 'Archive' }}
            </button>
          </div>
        </div>

        <!-- Mobile Pagination -->
        <div class="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
          <div class="text-sm text-slate-500 dark:text-slate-400">
            {{ language === 'de' ? 'Zeige' : 'Showing' }} {{ (currentPage - 1) * itemsPerPage + 1 }} {{ language === 'de' ? 'bis' : 'to' }} {{ Math.min(currentPage * itemsPerPage, semesters.length) }} {{ language === 'de' ? 'von' : 'of' }} {{ semesters.length }} {{ language === 'de' ? 'Semestern' : 'semesters' }}
          </div>
          
          <div class="flex items-center space-x-2">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-200"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            
            <div class="flex space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg',
                  page === currentPage
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-500 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-200'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-200"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Semester Transition -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4">
        {{ language === 'de' ? 'Semesterwechsel' : 'Semester Transition' }}
      </h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4">
        {{ language === 'de' ? 'Führen Sie einen Semesterwechsel durch, um Schüler zu versetzen und Daten zu archivieren.' : 'Perform a semester transition to promote students and archive data.' }}
      </p>
      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
        <div class="flex items-start">
          <AlertTriangle class="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h3 class="font-medium text-yellow-800 dark:text-yellow-200">
              {{ language === 'de' ? 'Achtung: Semesterwechsel' : 'Caution: Semester Transition' }}
            </h3>
            <p class="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
              {{ language === 'de' ? 'Diese Aktion archiviert das aktuelle Semester und erstellt ein neues. Dieser Prozess kann nicht rückgängig gemacht werden.' : 'This action will archive the current semester and create a new one. This process cannot be undone.' }}
            </p>
          </div>
        </div>
      </div>
      <button @click="showTransitionModal = true" class="btn-primary">
        {{ language === 'de' ? 'Semesterwechsel starten' : 'Start Semester Transition' }}
      </button>
    </div>

    <!-- New Semester Modal -->
    <div v-if="showSemesterModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Neues Semester erstellen' : 'Create New Semester' }}
            </h3>
            <button @click="showSemesterModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="createSemester" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Schuljahr' : 'School Year' }}
              </label>
              <select v-model="semesterForm.schoolYear" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                <option value="">{{ language === 'de' ? 'Schuljahr wählen' : 'Select School Year' }}</option>
                <option v-for="year in schoolYears" :key="year" :value="year">{{ year }}</option>
              </select>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {{ language === 'de' ? 'Format: JJJJ/JJ (z.B. 2024/25)' : 'Format: YYYY/YY (e.g. 2024/25)' }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Halbjahr' : 'Half-year' }}
              </label>
              <select v-model="semesterForm.halfYear" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                <option value="">{{ language === 'de' ? 'Halbjahr wählen' : 'Select Half-year' }}</option>
                <option value="I">I</option>
                <option value="II">II</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Schuljahr/Ausbildungsjahr' : 'School Year/Training Year' }}
              </label>
              <select v-model="semesterForm.yearNumber" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                <option value="">{{ language === 'de' ? 'Jahr wählen' : 'Select Year' }}</option>
                <option v-for="num in 12" :key="num" :value="num">{{ num }}</option>
              </select>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {{ language === 'de' ? 'Erste Zahl: Schuljahr oder Ausbildungsjahr' : 'First number: school year or vocational training year' }}
              </p>
            </div>

            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2">
                {{ language === 'de' ? 'Semesterformat' : 'Semester Format' }}
              </h4>
              <p class="text-sm text-blue-600 dark:text-blue-300">
                {{ language === 'de' ? 'Vorschau: ' : 'Preview: ' }}
                <span class="font-medium">{{ getSemesterPreview() }}</span>
              </p>
              <p class="text-xs text-blue-500 dark:text-blue-400 mt-2">
                <InfoIcon class="inline-block h-4 w-4 mr-1" />
                {{ language === 'de' ? 'Format: [Schuljahr]-[Halbjahr] [Schuljahr], z.B. 4-I 2024/25' : 'Format: [Year]-[Half-year] [School Year], e.g. 4-I 2024/25' }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Startdatum' : 'Start Date' }}
                </label>
                <input v-model="semesterForm.startDate" type="date" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {{ language === 'de' ? 'Enddatum' : 'End Date' }}
                </label>
                <input v-model="semesterForm.endDate" type="date" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea v-model="semesterForm.description" rows="3" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50 resize-none"></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showSemesterModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Semester erstellen' : 'Create Semester' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Semester Transition Modal -->
    <div v-if="showTransitionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Semesterwechsel' : 'Semester Transition' }}
            </h3>
            <button @click="showTransitionModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2">
                {{ language === 'de' ? 'Neues Semester' : 'New Semester' }}
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {{ language === 'de' ? 'Schuljahr' : 'School Year' }}
                  </label>
                  <select v-model="transitionForm.schoolYear" required class="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                    <option value="">{{ language === 'de' ? 'Wählen' : 'Select' }}</option>
                    <option v-for="year in schoolYears" :key="year" :value="year">{{ year }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {{ language === 'de' ? 'Halbjahr' : 'Half-year' }}
                  </label>
                  <select v-model="transitionForm.halfYear" required class="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                    <option value="">{{ language === 'de' ? 'Wählen' : 'Select' }}</option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {{ language === 'de' ? 'Schuljahr/Ausbildungsjahr' : 'School Year/Training Year' }}
                  </label>
                  <select v-model="transitionForm.yearNumber" required class="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                    <option value="">{{ language === 'de' ? 'Wählen' : 'Select' }}</option>
                    <option v-for="num in 12" :key="num" :value="num">{{ num }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {{ language === 'de' ? 'Vorschau' : 'Preview' }}
                  </label>
                  <div class="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-gray-100 dark:bg-slate-600 text-slate-800 dark:text-slate-50">
                    {{ getTransitionSemesterPreview() }}
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {{ language === 'de' ? 'Startdatum' : 'Start Date' }}
                  </label>
                  <input v-model="transitionForm.startDate" type="date" required class="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {{ language === 'de' ? 'Enddatum' : 'End Date' }}
                  </label>
                  <input v-model="transitionForm.endDate" type="date" required class="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50" />
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-slate-800 dark:text-slate-50 mb-2">
                {{ language === 'de' ? 'Übergangsoptionen' : 'Transition Options' }}
              </h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input v-model="transitionForm.promoteStudents" type="checkbox" class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2" />
                  <span class="text-sm text-slate-800 dark:text-slate-50">
                    {{ language === 'de' ? 'Schüler automatisch in nächste Klassenstufe versetzen' : 'Automatically promote students to next grade' }}
                  </span>
                </label>
                <label class="flex items-center">
                  <input v-model="transitionForm.archiveGraduates" type="checkbox" class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2" />
                  <span class="text-sm text-slate-800 dark:text-slate-50">
                    {{ language === 'de' ? 'Absolventen archivieren' : 'Archive graduating students' }}
                  </span>
                </label>
                <label class="flex items-center">
                  <input v-model="transitionForm.resetAttendance" type="checkbox" class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2" />
                  <span class="text-sm text-slate-800 dark:text-slate-50">
                    {{ language === 'de' ? 'Anwesenheitsstatistiken zurücksetzen' : 'Reset attendance statistics' }}
                  </span>
                </label>
                <label class="flex items-center">
                  <input v-model="transitionForm.carryOverCourses" type="checkbox" class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2" />
                  <span class="text-sm text-slate-800 dark:text-slate-50">
                    {{ language === 'de' ? 'Kursstrukturen übernehmen' : 'Carry over course structures' }}
                  </span>
                </label>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showTransitionModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button @click="executeSemesterTransition" class="btn-primary">
                {{ language === 'de' ? 'Semesterwechsel durchführen' : 'Execute Transition' }}
              </button>
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
import { Edit, CheckCircle, Archive, X, AlertTriangle, Info as InfoIcon, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showSemesterModal = ref(false)
const showTransitionModal = ref(false)

const currentPage = ref(1)
const itemsPerPage = ref(5)

const totalPages = computed(() => Math.ceil(semesters.value.length / itemsPerPage.value))
const visiblePages = computed(() => {
  const pages = []
  for (let i = Math.max(currentPage.value - 2, 1); i <= Math.min(currentPage.value + 2, totalPages.value); i++) {
    pages.push(i)
  }
  return pages
})

const paginatedSemesters = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return semesters.value.slice(start, end)
})

const semesterForm = ref({
  schoolYear: '',
  halfYear: '',
  yearNumber: '',
  startDate: '',
  endDate: '',
  description: ''
})

const transitionForm = ref({
  schoolYear: '',
  halfYear: '',
  yearNumber: '',
  startDate: '',
  endDate: '',
  promoteStudents: true,
  archiveGraduates: true,
  resetAttendance: true,
  carryOverCourses: true
})

const schoolYears = [
  '2023/24',
  '2024/25',
  '2025/26',
  '2026/27',
  '2027/28'
]

const currentSemester = ref({
  id: 1,
  name: '4-I 2023/24',
  schoolYear: '2023/24',
  halfYear: 'I',
  yearNumber: '4',
  startDate: '2023-08-01',
  endDate: '2024-01-31',
  status: 'Active',
  students: 1247,
  classes: 42,
  teachers: 89
})

const semesters = ref([
  {
    id: 1,
    name: '4-I 2023/24',
    schoolYear: '2023/24',
    halfYear: 'I',
    yearNumber: '4',
    startDate: '2023-08-01',
    endDate: '2024-01-31',
    status: 'Active'
  },
  {
    id: 2,
    name: '4-II 2022/23',
    schoolYear: '2022/23',
    halfYear: 'II',
    yearNumber: '4',
    startDate: '2023-02-01',
    endDate: '2023-07-31',
    status: 'Archived'
  },
  {
    id: 3,
    name: '3-I 2022/23',
    schoolYear: '2022/23',
    halfYear: 'I',
    yearNumber: '3',
    startDate: '2022-08-01',
    endDate: '2023-01-31',
    status: 'Archived'
  },
  {
    id: 4,
    name: '5-I 2024/25',
    schoolYear: '2024/25',
    halfYear: 'I',
    yearNumber: '5',
    startDate: '2024-08-01',
    endDate: '2025-01-31',
    status: 'Planned'
  }
])

const getSemesterStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Planned':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Archived':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getSemesterPreview = () => {
  if (!semesterForm.value.yearNumber || !semesterForm.value.halfYear || !semesterForm.value.schoolYear) {
    return language.value === 'de' ? 'Bitte alle Felder ausfüllen' : 'Please fill all fields'
  }
  
  return `${semesterForm.value.yearNumber}-${semesterForm.value.halfYear} ${semesterForm.value.schoolYear}`
}

const getTransitionSemesterPreview = () => {
  if (!transitionForm.value.yearNumber || !transitionForm.value.halfYear || !transitionForm.value.schoolYear) {
    return language.value === 'de' ? 'Bitte alle Felder ausfüllen' : 'Please fill all fields'
  }
  
  return `${transitionForm.value.yearNumber}-${transitionForm.value.halfYear} ${transitionForm.value.schoolYear}`
}

const createSemester = () => {
  const semesterName = getSemesterPreview()
  
  const newSemester = {
    id: semesters.value.length + 1,
    name: semesterName,
    schoolYear: semesterForm.value.schoolYear,
    halfYear: semesterForm.value.halfYear,
    yearNumber: semesterForm.value.yearNumber,
    startDate: semesterForm.value.startDate,
    endDate: semesterForm.value.endDate,
    status: 'Planned'
  }
  
  semesters.value.push(newSemester)
  showSemesterModal.value = false
  semesterForm.value = { schoolYear: '', halfYear: '', yearNumber: '', startDate: '', endDate: '', description: '' }
  
  alert(language.value === 'de' ? 'Semester erfolgreich erstellt!' : 'Semester created successfully!')
}

const editSemester = (semester: any) => {
  alert(`${language.value === 'de' ? 'Semester bearbeiten' : 'Edit semester'}: ${semester.name}`)
}

const activateSemester = (semester: any) => {
  // First, deactivate current active semester
  const currentActive = semesters.value.find(s => s.status === 'Active')
  if (currentActive) {
    currentActive.status = 'Archived'
  }
  
  // Then activate the selected semester
  semester.status = 'Active'
  currentSemester.value = { ...semester, students: 1247, classes: 42, teachers: 89 }
  
  alert(`${language.value === 'de' ? 'Semester aktiviert' : 'Semester activated'}: ${semester.name}`)
}

const archiveSemester = (semester: any) => {
  semester.status = 'Archived'
  alert(`${language.value === 'de' ? 'Semester archiviert' : 'Semester archived'}: ${semester.name}`)
}

const executeSemesterTransition = () => {
  // Archive current semester
  const currentActive = semesters.value.find(s => s.status === 'Active')
  if (currentActive) {
    currentActive.status = 'Archived'
  }
  
  // Create new semester
  const semesterName = getTransitionSemesterPreview()
  
  const newSemester = {
    id: semesters.value.length + 1,
    name: semesterName,
    schoolYear: transitionForm.value.schoolYear,
    halfYear: transitionForm.value.halfYear,
    yearNumber: transitionForm.value.yearNumber,
    startDate: transitionForm.value.startDate,
    endDate: transitionForm.value.endDate,
    status: 'Active'
  }
  
  semesters.value.push(newSemester)
  currentSemester.value = { ...newSemester, students: 1247, classes: 42, teachers: 89 }
  
  showTransitionModal.value = false
  alert(language.value === 'de' ? 'Semesterwechsel erfolgreich durchgeführt!' : 'Semester transition completed successfully!')
}
</script>
