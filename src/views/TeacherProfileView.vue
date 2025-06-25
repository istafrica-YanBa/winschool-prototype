<template>
  <div class="teacher-profile bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Lehrerprofil' : 'Teacher Profile' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Detaillierte Informationen und Verwaltung' : 'Detailed information and management' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="showOvertimeModal = true" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Clock class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Überstunden hinzufügen' : 'Add Overtime' }}
          </button>
          <button @click="showAbsenceModal = true" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Calendar class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Abwesenheit hinzufügen' : 'Add Absence' }}
          </button>
          <button @click="showQualificationModal = true" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Award class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Qualifikation hinzufügen' : 'Add Qualification' }}
          </button>
          <button @click="showEditModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Edit class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
          </button>
        </div>
      </div>

      <!-- Teacher Profile Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Personal Information -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center mb-6">
            <img :src="teacher?.avatar" :alt="teacher?.name" class="h-20 w-20 rounded-full object-cover mr-4 border-2 border-gray-200 dark:border-gray-600" />
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ teacher?.name }}</h2>
              <p class="text-gray-600 dark:text-gray-400">{{ teacher?.department }}</p>
              <span :class="getStatusColor(teacher?.status)" class="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1">
                {{ teacher?.status }}
              </span>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'E-Mail' : 'Email' }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ teacher?.email || 'thomas.weber@teacher.winschool.de' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Telefon' : 'Phone' }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ teacher?.phone || '+49 123 456 7891' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Einstellungsdatum' : 'Hire Date' }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ teacher?.hireDate || '2018-09-01' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Dienstjahre' : 'Years of Service' }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ teacher?.yearsOfService || '6' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Wochenstunden' : 'Weekly Hours' }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ teacher?.weeklyHours || '24' }}</span>
            </div>
          </div>
        </div>

        <!-- Subjects & Timetable Summary -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Fächer & Stundenplan' : 'Subjects & Timetable' }}
          </h3>
          
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ language === 'de' ? 'Unterrichtsfächer' : 'Teaching Subjects' }}</h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="subject in teacher?.subjects || ['German', 'English', 'Literature']" :key="subject" class="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 rounded-lg text-sm">
                  {{ subject }}
                </span>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ language === 'de' ? 'Stundenplan-Übersicht' : 'Timetable Summary' }}</h4>
              <div class="space-y-2">
                <div class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="text-sm text-gray-900 dark:text-white">{{ language === 'de' ? 'Montag' : 'Monday' }}</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">5 {{ language === 'de' ? 'Stunden' : 'hours' }}</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="text-sm text-gray-900 dark:text-white">{{ language === 'de' ? 'Dienstag' : 'Tuesday' }}</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">6 {{ language === 'de' ? 'Stunden' : 'hours' }}</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="text-sm text-gray-900 dark:text-white">{{ language === 'de' ? 'Mittwoch' : 'Wednesday' }}</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">4 {{ language === 'de' ? 'Stunden' : 'hours' }}</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="text-sm text-gray-900 dark:text-white">{{ language === 'de' ? 'Donnerstag' : 'Thursday' }}</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">7 {{ language === 'de' ? 'Stunden' : 'hours' }}</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="text-sm text-gray-900 dark:text-white">{{ language === 'de' ? 'Freitag' : 'Friday' }}</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">6 {{ language === 'de' ? 'Stunden' : 'hours' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Qualifications & Certificates -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Qualifikationen & Zertifikate' : 'Qualifications & Certificates' }}
          </h3>
          
          <div class="space-y-3">
            <div v-for="(qualification, index) in qualifications" :key="index" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">{{ qualification.title }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ qualification.institution }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ qualification.date }}</p>
                </div>
                <span :class="qualification.valid ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ qualification.valid ? (language === 'de' ? 'Gültig' : 'Valid') : (language === 'de' ? 'Abgelaufen' : 'Expired') }}
                </span>
              </div>
            </div>
            
            <div v-if="qualifications.length === 0" class="p-4 text-center text-gray-600 dark:text-gray-400">
              {{ language === 'de' ? 'Keine Qualifikationen vorhanden' : 'No qualifications available' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Overtime & Absence History -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Overtime History -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Überstunden-Verlauf' : 'Overtime History' }}
          </h3>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Aktuelle Überstunden' : 'Current Overtime' }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Stand vom' : 'As of' }} {{ new Date().toLocaleDateString() }}</p>
              </div>
              <span class="text-xl font-bold text-green-600 dark:text-green-400">32.5h</span>
            </div>
            
            <!-- Desktop Table View (hidden on mobile) -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Datum' : 'Date' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Stunden' : 'Hours' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Grund' : 'Reason' }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(entry, index) in paginatedOvertimeHistory" :key="index" class="border-b border-gray-100 dark:border-gray-700">
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ entry.date }}</td>
                    <td class="py-3 px-4 font-medium" :class="entry.hours > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      {{ entry.hours > 0 ? '+' : '' }}{{ entry.hours }}h
                    </td>
                    <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ entry.reason }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Card View (visible on mobile only) -->
            <div class="md:hidden space-y-3">
              <div v-for="(entry, index) in paginatedOvertimeHistory" :key="index" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ entry.date }}</span>
                  <span class="text-sm font-medium" :class="entry.hours > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                    {{ entry.hours > 0 ? '+' : '' }}{{ entry.hours }}h
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ entry.reason }}</p>
              </div>

              <!-- Mobile Pagination for Overtime -->
              <div v-if="overtimeHistory.length > itemsPerPage" class="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 mt-4">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  {{ language === 'de' ? 'Zeige' : 'Showing' }} 
                  {{ ((overtimeCurrentPage - 1) * itemsPerPage) + 1 }} 
                  {{ language === 'de' ? 'bis' : 'to' }} 
                  {{ Math.min(overtimeCurrentPage * itemsPerPage, overtimeHistory.length) }} 
                  {{ language === 'de' ? 'von' : 'of' }} 
                  {{ overtimeHistory.length }} 
                  {{ language === 'de' ? 'Einträgen' : 'entries' }}
                </div>
                <div class="flex space-x-1">
                  <button
                    @click="overtimeCurrentPage = Math.max(1, overtimeCurrentPage - 1)"
                    :disabled="overtimeCurrentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Zurück' : 'Previous' }}
                  </button>
                  
                  <template v-for="page in overtimeVisiblePageNumbers" :key="page">
                    <button
                      v-if="page !== '...'"
                      @click="overtimeCurrentPage = page"
                      :class="[
                        'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        overtimeCurrentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span v-else class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">...</span>
                  </template>
                  
                  <button
                    @click="overtimeCurrentPage = Math.min(overtimeTotalPages, overtimeCurrentPage + 1)"
                    :disabled="overtimeCurrentPage === overtimeTotalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Weiter' : 'Next' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Absence History -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Abwesenheits-Verlauf' : 'Absence History' }}
          </h3>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Abwesenheiten dieses Jahr' : 'Absences This Year' }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Gesamt' : 'Total' }}</p>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-white">12 {{ language === 'de' ? 'Tage' : 'days' }}</span>
            </div>
            
            <!-- Desktop Table View (hidden on mobile) -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Von' : 'From' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Bis' : 'To' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Grund' : 'Reason' }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(entry, index) in paginatedAbsenceHistory" :key="index" class="border-b border-gray-100 dark:border-gray-700">
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ entry.fromDate }}</td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ entry.toDate }}</td>
                    <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ entry.reason }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Card View (visible on mobile only) -->
            <div class="md:hidden space-y-3">
              <div v-for="(entry, index) in paginatedAbsenceHistory" :key="index" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ entry.fromDate }}</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ entry.toDate }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ entry.reason }}</p>
              </div>

              <!-- Mobile Pagination for Absence -->
              <div v-if="absenceHistory.length > itemsPerPage" class="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 mt-4">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  {{ language === 'de' ? 'Zeige' : 'Showing' }} 
                  {{ ((absenceCurrentPage - 1) * itemsPerPage) + 1 }} 
                  {{ language === 'de' ? 'bis' : 'to' }} 
                  {{ Math.min(absenceCurrentPage * itemsPerPage, absenceHistory.length) }} 
                  {{ language === 'de' ? 'von' : 'of' }} 
                  {{ absenceHistory.length }} 
                  {{ language === 'de' ? 'Einträgen' : 'entries' }}
                </div>
                <div class="flex space-x-1">
                  <button
                    @click="absenceCurrentPage = Math.max(1, absenceCurrentPage - 1)"
                    :disabled="absenceCurrentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Zurück' : 'Previous' }}
                  </button>
                  
                  <template v-for="page in absenceVisiblePageNumbers" :key="page">
                    <button
                      v-if="page !== '...'"
                      @click="absenceCurrentPage = page"
                      :class="[
                        'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        absenceCurrentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span v-else class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">...</span>
                  </template>
                  
                  <button
                    @click="absenceCurrentPage = Math.min(absenceTotalPages, absenceCurrentPage + 1)"
                    :disabled="absenceCurrentPage === absenceTotalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Weiter' : 'Next' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Classes & Performance -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {{ language === 'de' ? 'Klassen & Leistung' : 'Classes & Performance' }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(class_, index) in teacherClasses" :key="index" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all">
            <div class="flex justify-between items-start mb-3">
              <h4 class="font-medium text-gray-900 dark:text-white">{{ class_.name }}</h4>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getPerformanceColor(class_.performance)">
                {{ class_.performance }}
              </span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Schüler' : 'Students' }}</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ class_.students }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Stunden/Woche' : 'Hours/Week' }}</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ class_.hoursPerWeek }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Durchschnittsnote' : 'Average Grade' }}</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ class_.averageGrade }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Overtime Modal -->
    <div v-if="showOvertimeModal" class="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Überstunden hinzufügen' : 'Add Overtime' }}
            </h3>
            <button @click="showOvertimeModal = false" class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveOvertime" class="space-y-6">
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
                  <input v-model="overtimeForm.hoursToBeGiven" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Exkl. und Messstunden' : 'Excl. and measuring hours' }}
                  </label>
                  <input v-model="overtimeForm.measuringHours" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Delegation/Zugang' : 'Delegation/access' }}
                  </label>
                  <input v-model="overtimeForm.delegation" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Tatenstunden' : 'Deed hours' }}
                  </label>
                  <input v-model="overtimeForm.deedHours" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Gewährte Stunden' : 'Hours granted' }}
                  </label>
                  <input v-model="overtimeForm.hoursGranted" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Tatenstunden' : 'Deed hours' }}
                  </label>
                  <input v-model="overtimeForm.deedHours2" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
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
                  <input v-model="overtimeForm.additionalWork" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'davon bezahlt' : 'of which paid' }}
                  </label>
                  <input v-model="overtimeForm.ofWhichPaid" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
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
                        <button @click="removeTimeHistoryEntry(index)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                          <Trash2 class="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button @click="addTimeHistoryEntry" class="mt-3 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm transition-colors">
                + {{ language === 'de' ? 'Eintrag hinzufügen' : 'Add Entry' }}
              </button>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="showOvertimeModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
                {{ language === 'de' ? 'Speichern' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Absence Modal -->
    <div v-if="showAbsenceModal" class="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-[#334155] dark:text-white">
              {{ language === 'de' ? 'Abwesenheit hinzufügen' : 'Add Absence' }}
            </h3>
            <button @click="showAbsenceModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveAbsence" class="space-y-4">
            <!-- Absence Details -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="text-md font-semibold text-[#334155] dark:text-white mb-4">
                {{ language === 'de' ? 'Abwesenheitsdetails' : 'Absence Details' }}
              </h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Von Datum' : 'From Date' }}
                  </label>
                  <input v-model="absenceForm.fromDate" type="date" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Bis Datum' : 'To Date' }}
                  </label>
                  <input v-model="absenceForm.toDate" type="date" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Stunden' : 'Hours' }}
                  </label>
                  <input v-model="absenceForm.hours" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Grund' : 'Reason' }}
                  </label>
                  <input v-model="absenceForm.reason" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white" />
                </div>
              </div>
            </div>

            <!-- Remarks -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 class="text-md font-semibold text-[#334155] dark:text-white mb-4">
                {{ language === 'de' ? 'Bemerkungen' : 'Remarks' }}
              </h4>
              <textarea v-model="absenceForm.remarks" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white resize-none"></textarea>
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

    <!-- Qualification Modal -->
    <div v-if="showQualificationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-[#334155] dark:text-white">
              {{ language === 'de' ? 'Qualifikation hinzufügen' : 'Add Qualification' }}
            </h3>
            <button @click="showQualificationModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveQualification" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Titel' : 'Title' }}
              </label>
              <input v-model="qualificationForm.title" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Institution' : 'Institution' }}
              </label>
              <input v-model="qualificationForm.institution" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Datum' : 'Date' }}
              </label>
              <input v-model="qualificationForm.date" type="date" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea v-model="qualificationForm.description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white resize-none"></textarea>
            </div>

            <div class="flex items-center">
              <input id="valid" v-model="qualificationForm.valid" type="checkbox" class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2" />
              <label for="valid" class="text-sm text-[#334155] dark:text-white">
                {{ language === 'de' ? 'Gültig' : 'Valid' }}
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Dokument hochladen' : 'Upload Document' }}
              </label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div class="flex flex-col items-center justify-center pt-7">
                    <Upload class="w-8 h-8 text-gray-400" />
                    <p class="pt-1 text-sm text-[#64748b] dark:text-gray-400">
                      {{ language === 'de' ? 'Datei hierher ziehen oder klicken' : 'Drag file here or click to upload' }}
                    </p>
                  </div>
                  <input type="file" class="hidden" />
                </label>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showQualificationModal = false" class="btn-secondary">
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

    <!-- Edit Teacher Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-[#334155] dark:text-white">
              {{ language === 'de' ? 'Lehrer bearbeiten' : 'Edit Teacher' }}
            </h3>
            <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveTeacher" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Vorname' : 'First Name' }}
                </label>
                <input v-model="editForm.firstName" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Nachname' : 'Last Name' }}
                </label>
                <input v-model="editForm.lastName" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'E-Mail' : 'Email' }}
              </label>
              <input v-model="editForm.email" type="email" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Telefon' : 'Phone' }}
              </label>
              <input v-model="editForm.phone" type="tel" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Abteilung' : 'Department' }}
              </label>
              <select v-model="editForm.department" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white">
                <option value="">{{ language === 'de' ? 'Abteilung wählen' : 'Select Department' }}</option>
                <option v-for="department in departments" :key="department" :value="department">{{ department }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Status' : 'Status' }}
              </label>
              <select v-model="editForm.status" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-[#334155] dark:text-white">
                <option value="Active">{{ language === 'de' ? 'Aktiv' : 'Active' }}</option>
                <option value="On Leave">{{ language === 'de' ? 'Beurlaubt' : 'On Leave' }}</option>
                <option value="Inactive">{{ language === 'de' ? 'Inaktiv' : 'Inactive' }}</option>
              </select>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showEditModal = false" class="btn-secondary">
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { 
  Edit, Clock, Calendar, Award, X, Upload, Trash2
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)
const route = useRoute()
const router = useRouter()

const teacherId = computed(() => route.params.id)
const teacher = ref<any>(null)

const showOvertimeModal = ref(false)
const showAbsenceModal = ref(false)
const showQualificationModal = ref(false)
const showEditModal = ref(false)

// Pagination states
const overtimeCurrentPage = ref(1)
const absenceCurrentPage = ref(1)
const itemsPerPage = ref(5)

const departments = ['Mathematics', 'Sciences', 'Languages', 'Arts', 'Sports']

// Form states
const overtimeForm = ref({
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
  fromDate: '',
  toDate: '',
  hours: 0,
  reason: '',
  remarks: ''
})

const qualificationForm = ref({
  title: '',
  institution: '',
  date: '',
  description: '',
  valid: true
})

const editForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  status: 'Active'
})

// Sample data
const qualifications = ref([
  {
    title: 'PhD in Mathematics',
    institution: 'University of Berlin',
    date: '2015-12-20',
    valid: true
  },
  {
    title: 'Advanced Teaching Certificate',
    institution: 'Education Institute',
    date: '2018-06-15',
    valid: true
  },
  {
    title: 'First Aid Certification',
    institution: 'Red Cross',
    date: '2022-03-10',
    valid: false
  }
])

const overtimeHistory = ref([
  { date: '2024-03-15', hours: 4.5, reason: 'Exam Preparation' },
  { date: '2024-02-20', hours: 3.0, reason: 'Parent-Teacher Conference' },
  { date: '2024-02-05', hours: -2.0, reason: 'Early Leave' },
  { date: '2024-01-18', hours: 5.0, reason: 'School Event' },
  { date: '2024-01-10', hours: 2.5, reason: 'Staff Meeting' },
  { date: '2023-12-15', hours: 3.5, reason: 'Grade Submission' },
  { date: '2023-12-08', hours: 4.0, reason: 'Parent Consultation' },
  { date: '2023-11-25', hours: 2.0, reason: 'Extra Tutoring' },
  { date: '2023-11-12', hours: -1.5, reason: 'Medical Appointment' },
  { date: '2023-10-30', hours: 6.0, reason: 'Open House Event' },
  { date: '2023-10-15', hours: 3.0, reason: 'Curriculum Planning' },
  { date: '2023-09-28', hours: 4.5, reason: 'Teacher Training' }
])

const absenceHistory = ref([
  { fromDate: '2024-02-10', toDate: '2024-02-15', reason: 'Sick Leave' },
  { fromDate: '2023-12-20', toDate: '2024-01-05', reason: 'Winter Vacation' },
  { fromDate: '2023-10-05', toDate: '2023-10-07', reason: 'Professional Development' },
  { fromDate: '2023-09-15', toDate: '2023-09-16', reason: 'Family Emergency' },
  { fromDate: '2023-08-20', toDate: '2023-08-25', reason: 'Summer Vacation' },
  { fromDate: '2023-07-10', toDate: '2023-07-12', reason: 'Medical Leave' },
  { fromDate: '2023-06-05', toDate: '2023-06-06', reason: 'Personal Leave' },
  { fromDate: '2023-05-18', toDate: '2023-05-19', reason: 'Conference Attendance' },
  { fromDate: '2023-04-22', toDate: '2023-04-23', reason: 'Sick Leave' },
  { fromDate: '2023-03-15', toDate: '2023-03-17', reason: 'Training Workshop' }
])

const teacherClasses = ref([
  { name: 'Mathematics 10A', students: 28, hoursPerWeek: 5, performance: 'Excellent', averageGrade: 'A-' },
  { name: 'Physics 11B', students: 24, hoursPerWeek: 4, performance: 'Good', averageGrade: 'B+' },
  { name: 'Statistics 12C', students: 18, hoursPerWeek: 3, performance: 'Good', averageGrade: 'B' }
])

// Pagination computed properties for overtime
const overtimeTotalPages = computed(() => Math.ceil(overtimeHistory.value.length / itemsPerPage.value))

const paginatedOvertimeHistory = computed(() => {
  const start = (overtimeCurrentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return overtimeHistory.value.slice(start, end)
})

const overtimeVisiblePageNumbers = computed(() => {
  const total = overtimeTotalPages.value
  const current = overtimeCurrentPage.value
  const delta = 2
  
  if (total <= 7) {
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

// Pagination computed properties for absence
const absenceTotalPages = computed(() => Math.ceil(absenceHistory.value.length / itemsPerPage.value))

const paginatedAbsenceHistory = computed(() => {
  const start = (absenceCurrentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return absenceHistory.value.slice(start, end)
})

const absenceVisiblePageNumbers = computed(() => {
  const total = absenceTotalPages.value
  const current = absenceCurrentPage.value
  const delta = 2
  
  if (total <= 7) {
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

// Fetch teacher data
onMounted(async () => {
  // In a real application, you would fetch the teacher data from an API
  // For now, we'll use mock data
  const mockTeachers = [
    {
      id: 1,
      name: 'Dr. Thomas Weber',
      email: 'thomas.weber@teacher.winschool.de',
      phone: '+49 123 456 7890',
      department: 'Mathematics',
      subjects: ['Mathematics', 'Physics', 'Statistics'],
      weeklyHours: 28,
      status: 'Active',
      hireDate: '2015-09-01',
      yearsOfService: 9,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: 2,
      name: 'Ms. Sarah Schmidt',
      email: 'sarah.schmidt@teacher.winschool.de',
      phone: '+49 123 456 7891',
      department: 'Languages',
      subjects: ['German', 'English', 'Literature'],
      weeklyHours: 24,
      status: 'Active',
      hireDate: '2018-09-01',
      yearsOfService: 6,
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: 3,
      name: 'Prof. Michael Mueller',
      email: 'michael.mueller@teacher.winschool.de',
      phone: '+49 123 456 7892',
      department: 'Sciences',
      subjects: ['Physics', 'Chemistry', 'Environmental Science'],
      weeklyHours: 26,
      status: 'On Leave',
      hireDate: '2010-09-01',
      yearsOfService: 14,
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    }
  ]
  
  teacher.value = mockTeachers.find(t => t.id.toString() === teacherId.value) || mockTeachers[0]
  
  // Initialize edit form with teacher data
  if (teacher.value) {
    const nameParts = teacher.value.name.split(' ')
    editForm.value = {
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' '),
      email: teacher.value.email,
      phone: teacher.value.phone,
      department: teacher.value.department,
      status: teacher.value.status
    }
  }
})

// Utility functions
const getStatusColor = (status?: string) => {
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

const getPerformanceColor = (performance: string) => {
  switch (performance) {
    case 'Excellent':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Good':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Average':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Needs Improvement':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

// Form submission handlers
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

const saveOvertime = () => {
  // In a real application, you would save the overtime data to an API
  showOvertimeModal.value = false
  
  // Add to overtime history
  overtimeHistory.value.unshift({
    date: new Date().toISOString().split('T')[0],
    hours: parseFloat(overtimeForm.value.hoursToBeGiven.toString()),
    reason: 'Manual Entry'
  })
  
  // Reset form
  overtimeForm.value = {
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
  
  alert(language.value === 'de' ? 'Überstunden gespeichert!' : 'Overtime saved!')
}

const saveAbsence = () => {
  // In a real application, you would save the absence data to an API
  showAbsenceModal.value = false
  
  // Add to absence history
  absenceHistory.value.unshift({
    fromDate: absenceForm.value.fromDate,
    toDate: absenceForm.value.toDate,
    reason: absenceForm.value.reason
  })
  
  absenceForm.value = {
    fromDate: '',
    toDate: '',
    hours: 0,
    reason: '',
    remarks: ''
  }
  
  alert(language.value === 'de' ? 'Abwesenheit gespeichert!' : 'Absence saved!')
}

const saveQualification = () => {
  // In a real application, you would save the qualification data to an API
  showQualificationModal.value = false
  
  // Add to qualifications
  qualifications.value.unshift({
    title: qualificationForm.value.title,
    institution: qualificationForm.value.institution,
    date: qualificationForm.value.date,
    valid: qualificationForm.value.valid
  })
  
  qualificationForm.value = {
    title: '',
    institution: '',
    date: '',
    description: '',
    valid: true
  }
  
  alert(language.value === 'de' ? 'Qualifikation gespeichert!' : 'Qualification saved!')
}

const saveTeacher = () => {
  // In a real application, you would save the teacher data to an API
  showEditModal.value = false
  
  // Update teacher data
  if (teacher.value) {
    teacher.value.name = `${editForm.value.firstName} ${editForm.value.lastName}`
    teacher.value.email = editForm.value.email
    teacher.value.phone = editForm.value.phone
    teacher.value.department = editForm.value.department
    teacher.value.status = editForm.value.status
  }
  
  alert(language.value === 'de' ? 'Lehrer gespeichert!' : 'Teacher saved!')
}
</script>

<style>
/* Apply Inter font family to the entire application */
:root {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Custom CSS removed to avoid conflicts with Tailwind's dark mode */
</style>
