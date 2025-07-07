<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-3 sm:py-6">
    <!-- Header -->
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Schülersuche' : 'Student Search' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Suchen und verwalten Sie Schülerinformationen' : 'Search and manage student information' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="showMacroModal = true" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {{ language === 'de' ? 'Makros' : 'Macros' }}
          </button>
          <button @click="exportResults" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ language === 'de' ? 'Exportieren' : 'Export' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="px-4 sm:px-6 lg:px-8">
      <!-- Quick Search (Matchcode Search) -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">
          {{ language === 'de' ? 'Schnellsuche (Matchcode)' : 'Quick Search (Matchcode)' }}
        </h2>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              v-model="quickSearch"
              type="text"
              :placeholder="language === 'de' ? 'Name, Schüler-Nr., Klasse, etc.' : 'Name, student no., class, etc.'"
              class="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
            />
          </div>
          <button @click="performQuickSearch" class="bg-winschool-primary hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-200 whitespace-nowrap">
            {{ language === 'de' ? 'Suchen' : 'Search' }}
          </button>
        </div>
        <div class="mt-2 flex items-center">
          <InfoIcon class="h-4 w-4 text-slate-500 mr-2 flex-shrink-0" />
          <p class="text-xs text-slate-500 dark:text-slate-400">
            {{ language === 'de' ? 'Wildcards: * für beliebige Zeichenfolge, ? für ein einzelnes Zeichen' : 'Wildcards: * for any sequence, ? for a single character' }}
          </p>
        </div>
      </div>

      <!-- Advanced Search Criteria -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Erweiterte Suchkriterien' : 'Advanced Search Criteria' }}
          </h2>
          <button @click="toggleAdvancedSearch" class="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            <component :is="showAdvancedSearch ? ChevronUp : ChevronDown" class="h-4 w-4 mr-1" />
            {{ showAdvancedSearch 
              ? (language === 'de' ? 'Weniger anzeigen' : 'Show Less') 
              : (language === 'de' ? 'Mehr anzeigen' : 'Show More') }}
          </button>
        </div>

        <div v-if="showAdvancedSearch" class="space-y-6">
          <!-- Basic Criteria -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </label>
              <input
                v-model="advancedCriteria.name"
                type="text"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Klasse' : 'Class' }}
              </label>
              <select
                v-model="advancedCriteria.class"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
              >
                <option value="">{{ language === 'de' ? 'Alle Klassen' : 'All Classes' }}</option>
                <option v-for="class_ in classes" :key="class_" :value="class_">{{ class_ }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Status' : 'Status' }}
              </label>
              <select
                v-model="advancedCriteria.status"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
              >
                <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
                <option value="active">{{ language === 'de' ? 'Aktiv' : 'Active' }}</option>
                <option value="inactive">{{ language === 'de' ? 'Inaktiv' : 'Inactive' }}</option>
              </select>
            </div>
          </div>

          <!-- Date Criteria -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Geburtsdatum (Bereich)' : 'Date of Birth (Range)' }}
              </label>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {{ language === 'de' ? 'Von' : 'From' }}
                  </label>
                  <input
                    v-model="advancedCriteria.dobFrom"
                    type="date"
                    class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
                  />
                </div>
                <div>
                  <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {{ language === 'de' ? 'Bis' : 'To' }}
                  </label>
                  <input
                    v-model="advancedCriteria.dobTo"
                    type="date"
                    class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
                  />
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Eintrittsdatum (Bereich)' : 'Entry Date (Range)' }}
              </label>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {{ language === 'de' ? 'Von' : 'From' }}
                  </label>
                  <input
                    v-model="advancedCriteria.entryFrom"
                    type="date"
                    class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
                  />
                </div>
                <div>
                  <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {{ language === 'de' ? 'Bis' : 'To' }}
                  </label>
                  <input
                    v-model="advancedCriteria.entryTo"
                    type="date"
                    class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Criteria -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Nationalität' : 'Nationality' }}
              </label>
              <select
                v-model="advancedCriteria.nationality"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
              >
                <option value="">{{ language === 'de' ? 'Alle Nationalitäten' : 'All Nationalities' }}</option>
                <option v-for="nationality in nationalities" :key="nationality" :value="nationality">{{ nationality }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Kontaktperson' : 'Contact Person' }}
              </label>
              <select
                v-model="advancedCriteria.contactPerson"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
              >
                <option value="">{{ language === 'de' ? 'Alle' : 'All' }}</option>
                <option value="present">{{ language === 'de' ? 'Vorhanden' : 'Present' }}</option>
                <option value="absent">{{ language === 'de' ? 'Nicht vorhanden' : 'Absent' }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Archiviert' : 'Archived' }}
              </label>
              <select
                v-model="advancedCriteria.archived"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
              >
                <option value="">{{ language === 'de' ? 'Alle' : 'All' }}</option>
                <option value="yes">{{ language === 'de' ? 'Ja' : 'Yes' }}</option>
                <option value="no">{{ language === 'de' ? 'Nein' : 'No' }}</option>
              </select>
            </div>
          </div>

          <!-- Language Criteria -->
          <div>
            <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              {{ language === 'de' ? 'Sprachkenntnisse' : 'Language Skills' }}
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <select
                  v-model="advancedCriteria.language"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
                >
                  <option value="">{{ language === 'de' ? 'Sprache wählen' : 'Select Language' }}</option>
                  <option v-for="lang in availableLanguages" :key="lang" :value="lang">{{ lang }}</option>
                </select>
              </div>
              <div>
                <select
                  v-model="advancedCriteria.languageLevel"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
                >
                  <option value="">{{ language === 'de' ? 'Alle Niveaus' : 'All Levels' }}</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                  <option value="Native">{{ language === 'de' ? 'Muttersprache' : 'Native' }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Search Buttons -->
          <div class="flex flex-col sm:flex-row justify-end gap-3">
            <button @click="resetAdvancedSearch" class="btn-secondary">
              {{ language === 'de' ? 'Zurücksetzen' : 'Reset' }}
            </button>
            <button @click="performAdvancedSearch" class="bg-winschool-primary hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg transition-all duration-200">
              {{ language === 'de' ? 'Suchen' : 'Search' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Statistics Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users class="h-5 w-5 text-blue-600" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Gesamt' : 'Total' }}</p>
              <p class="text-lg font-bold text-slate-800 dark:text-slate-50">{{ searchResults.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <UserCheck class="h-5 w-5 text-green-600" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Aktiv' : 'Active' }}</p>
              <p class="text-lg font-bold text-slate-800 dark:text-slate-50">{{ searchResults.filter(s => s.status === 'active').length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <UserX class="h-5 w-5 text-red-600" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Inaktiv' : 'Inactive' }}</p>
              <p class="text-lg font-bold text-slate-800 dark:text-slate-50">{{ searchResults.filter(s => s.status === 'inactive').length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
              <CheckCircle class="h-5 w-5 text-amber-600" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Ausgewählt' : 'Selected' }}</p>
              <p class="text-lg font-bold text-slate-800 dark:text-slate-50">{{ selectedStudents.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Suchergebnisse' : 'Search Results' }}
            <span class="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
              ({{ searchResults.length }} {{ language === 'de' ? 'Ergebnisse' : 'results' }})
            </span>
          </h2>
          <div class="flex items-center gap-2">
            <span v-if="selectedStudents.length > 0" class="text-sm text-slate-600 dark:text-slate-400">
              {{ language === 'de' ? 'Ausgewählt:' : 'Selected:' }} {{ selectedStudents.length }}
            </span>
            <button 
              v-if="selectedStudents.length > 0"
              @click="clearSelection" 
              class="text-sm text-red-600 hover:text-red-800 px-2 py-1 rounded transition-colors"
            >
              {{ language === 'de' ? 'Auswahl löschen' : 'Clear selection' }}
            </button>
          </div>
        </div>

        <div v-if="paginatedResults.length === 0" class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-8 text-center">
          <SearchX class="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 class="text-lg font-medium text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Keine Ergebnisse gefunden' : 'No results found' }}
          </h3>
          <p class="text-slate-500 dark:text-slate-400 mt-2">
            {{ language === 'de' 
              ? 'Versuchen Sie es mit anderen Suchkriterien oder weniger Filtern.' 
              : 'Try different search criteria or fewer filters.' }}
          </p>
        </div>

        <!-- Desktop Table View -->
        <div v-else class="hidden lg:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
                <th class="w-10 py-3 px-4">
                  <input 
                    type="checkbox" 
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    class="rounded border-slate-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </th>
                <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                  {{ language === 'de' ? 'Name' : 'Name' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                  {{ language === 'de' ? 'Klasse' : 'Class' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                  {{ language === 'de' ? 'Alter' : 'Age' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                  {{ language === 'de' ? 'Durchschnitt' : 'Average' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                  {{ language === 'de' ? 'Status' : 'Status' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                  {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in paginatedResults" :key="student.id" class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td class="py-3 px-4">
                  <input 
                    type="checkbox" 
                    v-model="selectedStudents" 
                    :value="student.id"
                    class="rounded border-slate-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img 
                      :src="student.avatar" 
                      :alt="student.name"
                      class="h-8 w-8 rounded-full object-cover mr-3"
                    />
                    <span class="font-medium text-slate-800 dark:text-slate-50">{{ student.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-slate-800 dark:text-slate-50">{{ student.class }}</td>
                <td class="py-3 px-4 text-slate-800 dark:text-slate-50">{{ student.age }}</td>
                <td class="py-3 px-4">
                  <span :class="getGradeColor(student.averageGrade)" class="font-medium">{{ student.averageGrade }}</span>
                </td>
                <td class="py-3 px-4">
                  <span :class="getStatusColor(student.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ student.status === 'active' ? (language === 'de' ? 'Aktiv' : 'Active') : (language === 'de' ? 'Inaktiv' : 'Inactive') }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="viewStudentProfile(student)" class="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="editStudent(student)" class="text-slate-600 hover:text-slate-800 p-1 rounded transition-colors">
                      <Edit class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="lg:hidden space-y-4">
          <div v-for="student in paginatedResults" :key="student.id" class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center space-x-3 flex-1">
                <input 
                  type="checkbox" 
                  v-model="selectedStudents" 
                  :value="student.id"
                  class="rounded border-slate-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mt-1"
                />
                <img 
                  :src="student.avatar" 
                  :alt="student.name"
                  class="h-12 w-12 rounded-full object-cover"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-slate-800 dark:text-slate-50 truncate">{{ student.name }}</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400">{{ student.class }}</p>
                </div>
              </div>
              <div class="flex space-x-2 ml-2">
                <button @click="viewStudentProfile(student)" class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
                  <Eye class="h-4 w-4" />
                </button>
                <button @click="editStudent(student)" class="text-slate-600 hover:text-slate-800 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
                  <Edit class="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ language === 'de' ? 'Alter' : 'Age' }}</p>
                <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ student.age }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ language === 'de' ? 'Durchschnitt' : 'Average' }}</p>
                <p :class="getGradeColor(student.averageGrade)" class="text-sm font-medium">{{ student.averageGrade }}</p>
              </div>
            </div>
            
            <div class="mt-3 flex items-center justify-between">
              <span :class="getStatusColor(student.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ student.status === 'active' ? (language === 'de' ? 'Aktiv' : 'Active') : (language === 'de' ? 'Inaktiv' : 'Inactive') }}
              </span>
              <div class="text-xs text-slate-500 dark:text-slate-400">
                {{ language === 'de' ? 'Anwesenheit:' : 'Attendance:' }} {{ student.attendance }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="searchResults.length > 0" class="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div class="text-sm text-slate-500 dark:text-slate-400">
            {{ language === 'de' ? 'Zeige' : 'Showing' }} {{ ((currentPage - 1) * itemsPerPage) + 1 }} {{ language === 'de' ? 'bis' : 'to' }} {{ Math.min(currentPage * itemsPerPage, searchResults.length) }} {{ language === 'de' ? 'von' : 'of' }} {{ searchResults.length }} {{ language === 'de' ? 'Ergebnissen' : 'results' }}
          </div>
          
          <div class="flex items-center space-x-2">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ language === 'de' ? 'Vorherige' : 'Previous' }}
            </button>
            
            <div class="flex space-x-1">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="currentPage = Number(page)"
                :class="[
                  'px-3 py-2 text-sm rounded-lg transition-colors',
                  currentPage === page 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-50'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ language === 'de' ? 'Nächste' : 'Next' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Selection Navigation -->
    <div v-if="selectedStudents.length > 0" class="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 shadow-lg z-10">
      <div class="px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center space-x-4">
          <span class="text-sm text-slate-600 dark:text-slate-400">
            {{ selectedStudents.length }} {{ language === 'de' ? 'Schüler ausgewählt' : 'students selected' }}
          </span>
          <button @click="clearSelection" class="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            {{ language === 'de' ? 'Auswahl aufheben' : 'Clear selection' }}
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button @click="navigateToPrevious" class="btn-secondary text-sm">
            {{ language === 'de' ? 'Vorheriger' : 'Previous' }}
          </button>
          <button @click="navigateToNext" class="btn-secondary text-sm">
            {{ language === 'de' ? 'Nächster' : 'Next' }}
          </button>
          <button @click="exportSelection" class="btn-secondary text-sm">
            {{ language === 'de' ? 'Exportieren' : 'Export' }}
          </button>
          <button @click="printSelection" class="btn-secondary text-sm">
            {{ language === 'de' ? 'Drucken' : 'Print' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Search Macro Modal -->
    <div v-if="showMacroModal" class="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Suchmakros' : 'Search Macros' }}
            </h3>
            <button @click="showMacroModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X class="h-6 w-6" />
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-4">
            <div v-for="macro in searchMacros" :key="macro.id" class="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
              <div>
                <h4 class="font-medium text-slate-800 dark:text-slate-50">{{ macro.name }}</h4>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ macro.description }}</p>
              </div>
              <div class="flex space-x-2">
                <button @click="loadMacro(macro)" class="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded transition-colors">
                  {{ language === 'de' ? 'Laden' : 'Load' }}
                </button>
                <button @click="editMacro(macro)" class="text-slate-600 hover:text-slate-800 text-sm px-2 py-1 rounded transition-colors">
                  {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
                </button>
                <button @click="deleteMacro(macro)" class="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded transition-colors">
                  {{ language === 'de' ? 'Löschen' : 'Delete' }}
                </button>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 class="font-medium text-slate-800 dark:text-slate-50 mb-3">
                {{ language === 'de' ? 'Aktuelle Suche speichern' : 'Save Current Search' }}
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {{ language === 'de' ? 'Makroname' : 'Macro Name' }}
                  </label>
                  <input
                    v-model="newMacro.name"
                    type="text"
                    class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {{ language === 'de' ? 'Beschreibung' : 'Description' }}
                  </label>
                  <input
                    v-model="newMacro.description"
                    type="text"
                    class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
                  />
                </div>
                <button 
                  @click="saveMacro" 
                  class="w-full bg-winschool-primary hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200"
                  :disabled="!newMacro.name"
                  :class="{ 'opacity-50 cursor-not-allowed': !newMacro.name }"
                >
                  {{ language === 'de' ? 'Makro speichern' : 'Save Macro' }}
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { 
  Search, InfoIcon, ChevronDown, ChevronUp,
  Edit, X, Eye, SearchX,
  Users, UserCheck, UserX, CheckCircle
} from 'lucide-vue-next'

const router = useRouter()
const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const totalPages = computed(() => Math.ceil(searchResults.value.length / itemsPerPage.value))

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return searchResults.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages.filter(page => page !== '...')
})

// Search states
const quickSearch = ref('')
const showAdvancedSearch = ref(false)
const advancedCriteria = ref({
  name: '',
  class: '',
  status: '',
  dobFrom: '',
  dobTo: '',
  entryFrom: '',
  entryTo: '',
  nationality: '',
  contactPerson: '',
  archived: '',
  language: '',
  languageLevel: ''
})

// Modals
const showMacroModal = ref(false)

// Selection
const selectedStudents = ref<number[]>([])
const selectAll = ref(false)

// Macros
const searchMacros = ref([
  {
    id: 1,
    name: language.value === 'de' ? 'Minderjährige ohne Erziehungsberechtigten' : 'Minors without Guardian',
    description: language.value === 'de' ? 'Schüler unter 18 Jahre ohne Erziehungsberechtigten' : 'Students under 18 years without a guardian',
    criteria: {
      dobFrom: '',
      dobTo: new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0],
      contactPerson: 'absent'
    }
  },
  {
    id: 2,
    name: language.value === 'de' ? 'Abschlussklasse 2024' : 'Graduating Class 2024',
    description: language.value === 'de' ? 'Schüler, die 2024 ihren Abschluss machen' : 'Students graduating in 2024',
    criteria: {
      class: 'Class 12A',
      status: 'active'
    }
  }
])

const newMacro = ref({
  name: '',
  description: ''
})

// Sample data
const classes = ['Class 8A', 'Class 8B', 'Class 9A', 'Class 9B', 'Class 10A', 'Class 10B', 'Class 11A', 'Class 11B', 'Class 12A', 'Class 12B']

const nationalities = ['German', 'French', 'Italian', 'Spanish', 'Turkish', 'Polish', 'Russian', 'American', 'British', 'Chinese']

const availableLanguages = [
  'English',
  'German',
  'French',
  'Spanish',
  'Italian',
  'Russian',
  'Chinese',
  'Japanese',
  'Arabic',
  'Portuguese',
  'Dutch',
  'Swedish',
  'Greek',
  'Turkish',
  'Polish',
  'Korean',
  'Hindi',
  'Latin'
]

const students = [
  {
    id: 1,
    name: 'Emma Müller',
    studentId: 'ST001',
    class: 'Class 10A',
    age: 16,
    averageGrade: 'A-',
    attendance: 95,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'emma.mueller@student.winschool.de',
    phone: '+49 123 456 7890',
    address: 'Musterstraße 123, 10115 Berlin',
    enrollmentDate: '2020-09-01',
    gradeLevel: 'Grade 10',
    homeroomTeacher: 'Dr. Thomas Weber',
    nationality: 'German',
    contactPerson: 'present',
    archived: false,
    languages: [
      { id: 1, name: 'German', level: 'Native', type: 'Native', since: '2008-01-01', knowledgeLevel: 5 },
      { id: 2, name: 'English', level: 'B2', type: 'Required', since: '2015-09-01', knowledgeLevel: 4 },
      { id: 3, name: 'French', level: 'A2', type: 'Elective', since: '2018-09-01', knowledgeLevel: 2 }
    ]
  },
  {
    id: 2,
    name: 'Liam Weber',
    studentId: 'ST002',
    class: 'Class 10A',
    age: 16,
    averageGrade: 'B+',
    attendance: 92,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'liam.weber@student.winschool.de',
    phone: '+49 123 456 7891',
    address: 'Hauptstraße 45, 10117 Berlin',
    enrollmentDate: '2020-09-01',
    gradeLevel: 'Grade 10',
    homeroomTeacher: 'Dr. Thomas Weber',
    nationality: 'German',
    contactPerson: 'present',
    archived: false,
    languages: [
      { id: 1, name: 'German', level: 'Native', type: 'Native', since: '2008-01-01', knowledgeLevel: 5 },
      { id: 2, name: 'English', level: 'B1', type: 'Required', since: '2015-09-01', knowledgeLevel: 3 }
    ]
  },
  {
    id: 3,
    name: 'Sophie Schmidt',
    studentId: 'ST003',
    class: 'Class 9B',
    age: 15,
    averageGrade: 'A',
    attendance: 98,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'sophie.schmidt@student.winschool.de',
    phone: '+49 123 456 7892',
    address: 'Berliner Allee 78, 10119 Berlin',
    enrollmentDate: '2021-09-01',
    gradeLevel: 'Grade 9',
    homeroomTeacher: 'Ms. Sarah Schmidt',
    nationality: 'German',
    contactPerson: 'present',
    archived: false,
    languages: [
      { id: 1, name: 'German', level: 'Native', type: 'Native', since: '2009-01-01', knowledgeLevel: 5 },
      { id: 2, name: 'English', level: 'B2', type: 'Required', since: '2016-09-01', knowledgeLevel: 4 },
      { id: 3, name: 'Spanish', level: 'A1', type: 'Elective', since: '2022-09-01', knowledgeLevel: 1 }
    ]
  },
  {
    id: 4,
    name: 'Noah Fischer',
    studentId: 'ST004',
    class: 'Class 11A',
    age: 17,
    averageGrade: 'B',
    attendance: 89,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'noah.fischer@student.winschool.de',
    phone: '+49 123 456 7893',
    address: 'Friedrichstraße 22, 10117 Berlin',
    enrollmentDate: '2019-09-01',
    gradeLevel: 'Grade 11',
    homeroomTeacher: 'Prof. Michael Mueller',
    nationality: 'German',
    contactPerson: 'absent',
    archived: false,
    languages: [
      { id: 1, name: 'German', level: 'Native', type: 'Native', since: '2007-01-01', knowledgeLevel: 5 },
      { id: 2, name: 'English', level: 'C1', type: 'Required', since: '2014-09-01', knowledgeLevel: 5 }
    ]
  },
  {
    id: 5,
    name: 'Mia Wagner',
    studentId: 'ST005',
    class: 'Class 12B',
    age: 18,
    averageGrade: 'A-',
    attendance: 94,
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'mia.wagner@student.winschool.de',
    phone: '+49 123 456 7894',
    address: 'Unter den Linden 10, 10117 Berlin',
    enrollmentDate: '2018-09-01',
    gradeLevel: 'Grade 12',
    homeroomTeacher: 'Dr. Anna Fischer',
    nationality: 'German',
    contactPerson: 'present',
    archived: false,
    languages: [
      { id: 1, name: 'German', level: 'Native', type: 'Native', since: '2006-01-01', knowledgeLevel: 5 },
      { id: 2, name: 'English', level: 'C2', type: 'Required', since: '2013-09-01', knowledgeLevel: 5 },
      { id: 3, name: 'French', level: 'B2', type: 'Elective', since: '2016-09-01', knowledgeLevel: 4 }
    ]
  },
  {
    id: 6,
    name: 'Leon Bauer',
    studentId: 'ST006',
    class: 'Class 8A',
    age: 14,
    averageGrade: 'C+',
    attendance: 87,
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'leon.bauer@student.winschool.de',
    phone: '+49 123 456 7895',
    address: 'Kantstraße 55, 10627 Berlin',
    enrollmentDate: '2022-09-01',
    gradeLevel: 'Grade 8',
    homeroomTeacher: 'Mr. Johannes Bauer',
    nationality: 'German',
    contactPerson: 'present',
    archived: true,
    languages: [
      { id: 1, name: 'German', level: 'Native', type: 'Native', since: '2010-01-01', knowledgeLevel: 5 },
      { id: 2, name: 'English', level: 'A2', type: 'Required', since: '2017-09-01', knowledgeLevel: 2 }
    ]
  }
]

// Search results
const searchResults = ref([...students])

// Toggle functions
const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedStudents.value = paginatedResults.value.map(student => student.id)
  } else {
    selectedStudents.value = []
  }
}

// Search functions
const performQuickSearch = () => {
  if (!quickSearch.value.trim()) {
    searchResults.value = [...students]
    currentPage.value = 1
    return
  }

  const searchTerm = quickSearch.value.toLowerCase()
  
  // Process wildcards
  const regexPattern = searchTerm
    .replace(/\*/g, '.*')  // * becomes .*
    .replace(/\?/g, '.')   // ? becomes .
  
  const regex = new RegExp(regexPattern, 'i')
  
  searchResults.value = students.filter(student => {
    return regex.test(student.name.toLowerCase()) || 
           regex.test(student.studentId.toLowerCase()) || 
           regex.test(student.class.toLowerCase())
  })
  
  currentPage.value = 1
}

const performAdvancedSearch = () => {
  searchResults.value = students.filter(student => {
    // Name filter
    if (advancedCriteria.value.name && !student.name.toLowerCase().includes(advancedCriteria.value.name.toLowerCase())) {
      return false
    }
    
    // Class filter
    if (advancedCriteria.value.class && student.class !== advancedCriteria.value.class) {
      return false
    }
    
    // Status filter
    if (advancedCriteria.value.status && student.status !== advancedCriteria.value.status) {
      return false
    }
    
    // Date of Birth range
    if (advancedCriteria.value.dobFrom || advancedCriteria.value.dobTo) {
      // In a real app, we would have actual DOB data to filter on
      // For now, we'll use a placeholder check
      const studentAge = student.age
      const currentYear = new Date().getFullYear()
      const approximateBirthYear = currentYear - studentAge
      
      if (advancedCriteria.value.dobFrom) {
        const fromYear = new Date(advancedCriteria.value.dobFrom).getFullYear()
        if (approximateBirthYear < fromYear) return false
      }
      
      if (advancedCriteria.value.dobTo) {
        const toYear = new Date(advancedCriteria.value.dobTo).getFullYear()
        if (approximateBirthYear > toYear) return false
      }
    }
    
    // Entry date range
    if (advancedCriteria.value.entryFrom && student.enrollmentDate < advancedCriteria.value.entryFrom) {
      return false
    }
    
    if (advancedCriteria.value.entryTo && student.enrollmentDate > advancedCriteria.value.entryTo) {
      return false
    }
    
    // Nationality filter
    if (advancedCriteria.value.nationality && student.nationality !== advancedCriteria.value.nationality) {
      return false
    }
    
    // Contact person filter
    if (advancedCriteria.value.contactPerson) {
      if (advancedCriteria.value.contactPerson === 'present' && student.contactPerson !== 'present') {
        return false
      }
      if (advancedCriteria.value.contactPerson === 'absent' && student.contactPerson !== 'absent') {
        return false
      }
    }
    
    // Archived filter
    if (advancedCriteria.value.archived) {
      if (advancedCriteria.value.archived === 'yes' && !student.archived) {
        return false
      }
      if (advancedCriteria.value.archived === 'no' && student.archived) {
        return false
      }
    }
    
    // Language filter
    if (advancedCriteria.value.language) {
      const hasLanguage = student.languages && student.languages.some((lang: any) => 
        lang.name === advancedCriteria.value.language && 
        (!advancedCriteria.value.languageLevel || lang.level === advancedCriteria.value.languageLevel)
      )
      
      if (!hasLanguage) return false
    }
    
    return true
  })
  
  currentPage.value = 1
}

const resetAdvancedSearch = () => {
  advancedCriteria.value = {
    name: '',
    class: '',
    status: '',
    dobFrom: '',
    dobTo: '',
    entryFrom: '',
    entryTo: '',
    nationality: '',
    contactPerson: '',
    archived: '',
    language: '',
    languageLevel: ''
  } as any
  
  searchResults.value = [...students]
  currentPage.value = 1
}

// Macro functions
const saveMacro = () => {
  if (!newMacro.value.name) return
  
  const macroId = searchMacros.value.length > 0 
    ? Math.max(...searchMacros.value.map(m => m.id)) + 1 
    : 1
  
  searchMacros.value.push({
    id: macroId,
    name: newMacro.value.name,
    description: newMacro.value.description,
    criteria: { ...advancedCriteria.value }
  })
  
  newMacro.value = { name: '', description: '' }
  
  alert(language.value === 'de' ? 'Makro gespeichert!' : 'Macro saved!')
}

const loadMacro = (macro: any) => {
  advancedCriteria.value = { ...macro.criteria }
  showAdvancedSearch.value = true
  showMacroModal.value = false
  performAdvancedSearch()
}

const editMacro = (macro: any) => {
  // In a real app, this would open a modal to edit the macro
  alert(`${language.value === 'de' ? 'Makro bearbeiten' : 'Edit macro'}: ${macro.name}`)
}

const deleteMacro = (macro: any) => {
  const index = searchMacros.value.findIndex(m => m.id === macro.id)
  if (index !== -1) {
    searchMacros.value.splice(index, 1)
  }
}

// Student actions
const viewStudentProfile = (student: any) => {
  router.push(`/dashboard/student-profile/${student.id}`)
}

const editStudent = (student: any) => {
  // Navigate to the student management view with the student ID
  router.push(`/dashboard/student-management?id=${student.id}`)
}

// Selection actions
const clearSelection = () => {
  selectedStudents.value = []
  selectAll.value = false
}

const navigateToPrevious = () => {
  // In a real app, this would navigate to the previous student in the selection
  alert(language.value === 'de' ? 'Zum vorherigen Schüler navigieren' : 'Navigate to previous student')
}

const navigateToNext = () => {
  // In a real app, this would navigate to the next student in the selection
  alert(language.value === 'de' ? 'Zum nächsten Schüler navigieren' : 'Navigate to next student')
}

const exportSelection = () => {
  alert(language.value === 'de' ? 'Auswahl exportieren' : 'Export selection')
}

const printSelection = () => {
  alert(language.value === 'de' ? 'Auswahl drucken' : 'Print selection')
}

const exportResults = () => {
  alert(language.value === 'de' ? 'Suchergebnisse exportieren' : 'Export search results')
}

// Utility functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100/20 text-green-800 dark:bg-green-900/20 dark:text-green-200'
    case 'inactive':
      return 'bg-red-100/20 text-red-800 dark:bg-red-900/20 dark:text-red-200'
    default:
      return 'bg-slate-100/20 text-slate-800 dark:bg-slate-900/20 dark:text-slate-200'
  }
}

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400'
  if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400'
  if (grade.startsWith('C')) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}
</script>
