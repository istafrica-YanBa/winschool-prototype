<template>
  <div class="company-management bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6 transition-colors duration-200">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2m0 0h4m6 0h2M7 3h10" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-300 leading-tight">
              {{ language === 'de' ? 'Unternehmensverwaltung' : 'Company Management' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-400">
              {{ language === 'de' ? 'Verwalten Sie Unternehmen für Praktika und Berufsausbildung' : 'Manage companies for internships and vocational training' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="showCompanyModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark dark:bg-winschool-primary dark:hover:bg-yellow-400 text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-all duration-200 text-sm sm:text-base">
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Unternehmen hinzufügen' : 'Add Company' }}
          </button>
        </div>
      </div>

      <!-- Company Overview -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div v-for="stat in companyStats" :key="stat.title" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6 transition-all duration-200 hover:shadow-md">
          <div class="flex items-center">
            <div :class="stat.iconBg" class="p-3 rounded-lg flex-shrink-0">
              <component :is="stat.icon" class="h-6 w-6 text-white" />
            </div>
            <div class="ml-4 min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{{ stat.title }}</p>
              <p class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
              <p :class="stat.changeColor" class="text-xs lg:text-sm truncate">{{ stat.change }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Company Search and Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6 transition-colors duration-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="language === 'de' ? 'Unternehmen suchen...' : 'Search companies...'"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              />
            </div>
          </div>
          <select 
            v-model="selectedIndustry"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
          >
            <option value="">{{ language === 'de' ? 'Alle Branchen' : 'All Industries' }}</option>
            <option v-for="industry in industries" :key="industry" :value="industry">{{ industry }}</option>
          </select>
          <select 
            v-model="selectedStatus"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
          >
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="Active">{{ language === 'de' ? 'Aktiv' : 'Active' }}</option>
            <option value="Inactive">{{ language === 'de' ? 'Inaktiv' : 'Inactive' }}</option>
          </select>
        </div>
      </div>

      <!-- Companies List -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Unternehmen' : 'Company' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Branche' : 'Industry' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Kontakt' : 'Contact' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Standort' : 'Location' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Praktikanten' : 'Interns' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Status' : 'Status' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="company in paginatedCompanies" :key="company.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <div class="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Building class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-gray-900 dark:text-white truncate">{{ company.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ company.website }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-900 dark:text-gray-100">{{ company.industry }}</td>
                <td class="py-3 px-4">
                  <div class="min-w-0">
                    <p class="text-gray-900 dark:text-white truncate">{{ company.contactPerson }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ company.email }}</p>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-600 dark:text-gray-300">{{ company.location }}</td>
                <td class="py-3 px-4 text-gray-900 dark:text-white">{{ company.interns }}</td>
                <td class="py-3 px-4">
                  <span :class="getCompanyStatusColor(company.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ company.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="viewCompany(company)" class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200" :title="language === 'de' ? 'Anzeigen' : 'View'">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="editCompany(company)" class="text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors duration-200" :title="language === 'de' ? 'Bearbeiten' : 'Edit'">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button @click="manageInternships(company)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200" :title="language === 'de' ? 'Praktika verwalten' : 'Manage Internships'">
                      <Users class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="lg:hidden space-y-4 p-4">
          <div v-for="company in paginatedCompanies" :key="company.id" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors duration-200">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center flex-1 min-w-0">
                <div class="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Building class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ company.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ company.industry }}</p>
                </div>
              </div>
              <span :class="getCompanyStatusColor(company.status)" class="px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2">
                {{ company.status }}
              </span>
            </div>
            
            <div class="space-y-2 text-sm">
              <div class="flex items-center text-gray-600 dark:text-gray-400">
                <span class="font-medium w-20 flex-shrink-0">{{ language === 'de' ? 'Kontakt:' : 'Contact:' }}</span>
                <span class="truncate">{{ company.contactPerson }}</span>
              </div>
              <div class="flex items-center text-gray-600 dark:text-gray-400">
                <span class="font-medium w-20 flex-shrink-0">{{ language === 'de' ? 'E-Mail:' : 'Email:' }}</span>
                <span class="truncate">{{ company.email }}</span>
              </div>
              <div class="flex items-center text-gray-600 dark:text-gray-400">
                <span class="font-medium w-20 flex-shrink-0">{{ language === 'de' ? 'Ort:' : 'Location:' }}</span>
                <span class="truncate">{{ company.location }}</span>
              </div>
              <div class="flex items-center text-gray-600 dark:text-gray-400">
                <span class="font-medium w-20 flex-shrink-0">{{ language === 'de' ? 'Praktikanten:' : 'Interns:' }}</span>
                <span>{{ company.interns }}</span>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
              <button @click="viewCompany(company)" class="flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 text-sm">
                <Eye class="h-4 w-4 mr-1" />
                {{ language === 'de' ? 'Anzeigen' : 'View' }}
              </button>
              <button @click="editCompany(company)" class="flex items-center text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors duration-200 text-sm">
                <Edit class="h-4 w-4 mr-1" />
                {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
              </button>
              <button @click="manageInternships(company)" class="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 text-sm">
                <Users class="h-4 w-4 mr-1" />
                {{ language === 'de' ? 'Praktika' : 'Internships' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Companies Pagination -->
        <div v-if="totalCompanyPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div class="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <span>{{ language === 'de' ? 'Zeigt' : 'Showing' }} {{ (currentPage - 1) * itemsPerPage + 1 }} {{ language === 'de' ? 'bis' : 'to' }} {{ Math.min(currentPage * itemsPerPage, filteredCompanies.length) }} {{ language === 'de' ? 'von' : 'of' }} {{ filteredCompanies.length }} {{ language === 'de' ? 'Unternehmen' : 'companies' }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              <ChevronLeft class="h-4 w-4" />
            </button>
            <span class="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{{ currentPage }} / {{ totalCompanyPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalCompanyPages" class="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Internship Placements -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <div class="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Aktuelle Praktikumsplätze' : 'Current Internship Placements' }}
          </h2>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Schüler' : 'Student' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Unternehmen' : 'Company' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Position' : 'Position' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Startdatum' : 'Start Date' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Enddatum' : 'End Date' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Status' : 'Status' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="internship in paginatedInternships" :key="internship.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img :src="internship.studentAvatar" :alt="internship.student" class="h-8 w-8 rounded-full object-cover mr-3 flex-shrink-0" />
                    <span class="font-medium text-gray-900 dark:text-white">{{ internship.student }}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-900 dark:text-gray-100">{{ internship.company }}</td>
                <td class="py-3 px-4 text-gray-900 dark:text-gray-100">{{ internship.position }}</td>
                <td class="py-3 px-4 text-gray-600 dark:text-gray-300">{{ internship.startDate }}</td>
                <td class="py-3 px-4 text-gray-600 dark:text-gray-300">{{ internship.endDate }}</td>
                <td class="py-3 px-4">
                  <span :class="getInternshipStatusColor(internship.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ internship.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="viewInternship(internship)" class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200" :title="language === 'de' ? 'Anzeigen' : 'View'">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="editInternship(internship)" class="text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors duration-200" :title="language === 'de' ? 'Bearbeiten' : 'Edit'">
                      <Edit class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="lg:hidden space-y-4 p-4">
          <div v-for="internship in paginatedInternships" :key="internship.id" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors duration-200">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center flex-1 min-w-0">
                <img :src="internship.studentAvatar" :alt="internship.student" class="h-10 w-10 rounded-full object-cover mr-3 flex-shrink-0" />
                <div class="min-w-0 flex-1">
                  <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ internship.student }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ internship.company }}</p>
                </div>
              </div>
              <span :class="getInternshipStatusColor(internship.status)" class="px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2">
                {{ internship.status }}
              </span>
            </div>
            
            <div class="space-y-2 text-sm">
              <div class="text-gray-600 dark:text-gray-400">
                <span class="font-medium">{{ language === 'de' ? 'Position:' : 'Position:' }}</span>
                <span class="ml-2">{{ internship.position }}</span>
              </div>
              <div class="flex items-center text-gray-600 dark:text-gray-400">
                <span class="font-medium w-16 flex-shrink-0">{{ language === 'de' ? 'Start:' : 'Start:' }}</span>
                <span>{{ internship.startDate }}</span>
              </div>
              <div class="flex items-center text-gray-600 dark:text-gray-400">
                <span class="font-medium w-16 flex-shrink-0">{{ language === 'de' ? 'Ende:' : 'End:' }}</span>
                <span>{{ internship.endDate }}</span>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
              <button @click="viewInternship(internship)" class="flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 text-sm">
                <Eye class="h-4 w-4 mr-1" />
                {{ language === 'de' ? 'Anzeigen' : 'View' }}
              </button>
              <button @click="editInternship(internship)" class="flex items-center text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors duration-200 text-sm">
                <Edit class="h-4 w-4 mr-1" />
                {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Internships Pagination -->
        <div v-if="totalInternshipPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div class="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <span>{{ language === 'de' ? 'Zeigt' : 'Showing' }} {{ (currentInternshipPage - 1) * internshipsPerPage + 1 }} {{ language === 'de' ? 'bis' : 'to' }} {{ Math.min(currentInternshipPage * internshipsPerPage, internships.length) }} {{ language === 'de' ? 'von' : 'of' }} {{ internships.length }} {{ language === 'de' ? 'Praktika' : 'internships' }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="prevInternshipPage" :disabled="currentInternshipPage === 1" class="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              <ChevronLeft class="h-4 w-4" />
            </button>
            <span class="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{{ currentInternshipPage }} / {{ totalInternshipPages }}</span>
            <button @click="nextInternshipPage" :disabled="currentInternshipPage === totalInternshipPages" class="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Add Company Modal -->
      <div v-if="showCompanyModal" class="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Neues Unternehmen hinzufügen' : 'Add New Company' }}
              </h3>
              <button @click="showCompanyModal = false" class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200">
                <X class="h-6 w-6" />
              </button>
            </div>

            <form @submit.prevent="addCompany" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Firmenname' : 'Company Name' }}
                </label>
                <input
                  v-model="companyForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                  :placeholder="language === 'de' ? 'Firmenname eingeben' : 'Enter company name'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Branche' : 'Industry' }}
                </label>
                <select
                  v-model="companyForm.industry"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                >
                  <option value="">{{ language === 'de' ? 'Branche auswählen' : 'Select industry' }}</option>
                  <option v-for="industry in industries" :key="industry" :value="industry">{{ industry }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Kontaktperson' : 'Contact Person' }}
                </label>
                <input
                  v-model="companyForm.contactPerson"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                  :placeholder="language === 'de' ? 'Kontaktperson eingeben' : 'Enter contact person'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'E-Mail' : 'Email' }}
                </label>
                <input
                  v-model="companyForm.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                  :placeholder="language === 'de' ? 'E-Mail eingeben' : 'Enter email'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Standort' : 'Location' }}
                </label>
                <input
                  v-model="companyForm.location"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                  :placeholder="language === 'de' ? 'Standort eingeben' : 'Enter location'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Website' : 'Website' }}
                </label>
                <input
                  v-model="companyForm.website"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                  :placeholder="language === 'de' ? 'Website eingeben' : 'Enter website'"
                />
              </div>
              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="showCompanyModal = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
                >
                  {{ language === 'de' ? 'Hinzufügen' : 'Add Company' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Company Details Modal -->
      <div v-if="showCompanyDetailsModal && selectedCompany" class="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Firmendetails' : 'Company Details' }}
              </h3>
              <button @click="showCompanyDetailsModal = false" class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200">
                <X class="h-6 w-6" />
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ selectedCompany.name }}</h4>
                <p class="text-gray-600 dark:text-gray-400">{{ selectedCompany.industry }}</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ language === 'de' ? 'Kontakt' : 'Contact' }}</p>
                  <p class="text-gray-900 dark:text-white">{{ selectedCompany.contactPerson }}</p>
                  <p class="text-gray-600 dark:text-gray-400">{{ selectedCompany.email }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ language === 'de' ? 'Standort' : 'Location' }}</p>
                  <p class="text-gray-900 dark:text-white">{{ selectedCompany.location }}</p>
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ language === 'de' ? 'Aktuelle Praktikanten' : 'Current Interns' }}</p>
                <p class="text-gray-900 dark:text-white">{{ selectedCompany.interns }}</p>
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
import { useThemeStore } from '../stores/theme'
import { Plus, Edit, Eye, X, Building, Users, Search, Briefcase, MapPin } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showCompanyModal = ref(false)
const searchQuery = ref('')
const selectedIndustry = ref('')
const selectedStatus = ref('')

const companyForm = ref({
  name: '',
  industry: '',
  website: '',
  address: '',
  city: '',
  country: '',
  location: '',
  contactPerson: '',
  contactPosition: '',
  email: '',
  phone: ''
})

const companyStats = ref([
  {
    title: language.value === 'de' ? 'Unternehmen' : 'Companies',
    value: '48',
    change: '+5 this year',
    changeColor: 'text-green-600',
    icon: Building,
    iconBg: 'bg-primary-600'
  },
  {
    title: language.value === 'de' ? 'Aktive Praktika' : 'Active Internships',
    value: '32',
    change: '+8 this month',
    changeColor: 'text-green-600',
    icon: Briefcase,
    iconBg: 'bg-green-600'
  },
  {
    title: language.value === 'de' ? 'Praktikanten' : 'Interns',
    value: '45',
    change: '+12 this semester',
    changeColor: 'text-green-600',
    icon: Users,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Standorte' : 'Locations',
    value: '15',
    change: '+2 this year',
    changeColor: 'text-green-600',
    icon: MapPin,
    iconBg: 'bg-yellow-600'
  }
])

const industries = [
  'Technology',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Finance',
  'Retail',
  'Hospitality',
  'Construction',
  'Transportation',
  'Media'
]

const companies = ref([
  {
    id: 1,
    name: 'TechSolutions GmbH',
    industry: 'Technology',
    website: 'www.techsolutions.de',
    contactPerson: 'Markus Schmidt',
    email: 'markus.schmidt@techsolutions.de',
    location: 'Berlin, Germany',
    interns: 5,
    status: 'Active'
  },
  {
    id: 2,
    name: 'MediCare Hospital',
    industry: 'Healthcare',
    website: 'www.medicare-hospital.de',
    contactPerson: 'Dr. Anna Weber',
    email: 'anna.weber@medicare.de',
    location: 'Hamburg, Germany',
    interns: 3,
    status: 'Active'
  },
  {
    id: 3,
    name: 'EduTech Solutions',
    industry: 'Education',
    website: 'www.edutech.de',
    contactPerson: 'Thomas Müller',
    email: 'thomas.mueller@edutech.de',
    location: 'Munich, Germany',
    interns: 7,
    status: 'Active'
  },
  {
    id: 4,
    name: 'FinanceFirst AG',
    industry: 'Finance',
    website: 'www.financefirst.de',
    contactPerson: 'Sarah Fischer',
    email: 'sarah.fischer@financefirst.de',
    location: 'Frankfurt, Germany',
    interns: 2,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'BuildWell Construction',
    industry: 'Construction',
    website: 'www.buildwell.de',
    contactPerson: 'Michael Wagner',
    email: 'michael.wagner@buildwell.de',
    location: 'Cologne, Germany',
    interns: 4,
    status: 'Active'
  }
])

const internships = ref([
  {
    id: 1,
    student: 'Max Müller',
    studentAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    company: 'TechSolutions GmbH',
    position: 'Software Development Intern',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    status: 'Active'
  },
  {
    id: 2,
    student: 'Emma Weber',
    studentAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    company: 'MediCare Hospital',
    position: 'Healthcare Administration Intern',
    startDate: '2024-03-15',
    endDate: '2024-06-15',
    status: 'Active'
  },
  {
    id: 3,
    student: 'Liam Fischer',
    studentAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    company: 'EduTech Solutions',
    position: 'Educational Content Developer',
    startDate: '2024-01-10',
    endDate: '2024-03-10',
    status: 'Completed'
  },
  {
    id: 4,
    student: 'Sophie Schmidt',
    studentAvatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    company: 'BuildWell Construction',
    position: 'Project Management Intern',
    startDate: '2024-04-01',
    endDate: '2024-07-31',
    status: 'Upcoming'
  }
])

const filteredCompanies = computed(() => {
  return companies.value.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         company.contactPerson.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesIndustry = !selectedIndustry.value || company.industry === selectedIndustry.value
    const matchesStatus = !selectedStatus.value || company.status === selectedStatus.value
    
    return matchesSearch && matchesIndustry && matchesStatus
  })
})

const getCompanyStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getInternshipStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Upcoming':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const addCompany = () => {
  const newCompany = {
    id: companies.value.length + 1,
    name: companyForm.value.name,
    industry: companyForm.value.industry,
    website: companyForm.value.website,
    contactPerson: companyForm.value.contactPerson,
    email: companyForm.value.email,
    location: `${companyForm.value.city}, ${companyForm.value.country}`,
    interns: 0,
    status: 'Active'
  }
  
  companies.value.push(newCompany)
  showCompanyModal.value = false
  companyForm.value = {
    name: '',
    industry: '',
    website: '',
    address: '',
    city: '',
    country: '',
    location: '',
    contactPerson: '',
    contactPosition: '',
    email: '',
    phone: ''
  }
  
  alert(language.value === 'de' ? 'Unternehmen erfolgreich hinzugefügt!' : 'Company added successfully!')
}

const viewCompany = (company: any) => {
  alert(`${language.value === 'de' ? 'Unternehmen anzeigen' : 'View company'}: ${company.name}`)
}

const editCompany = (company: any) => {
  alert(`${language.value === 'de' ? 'Unternehmen bearbeiten' : 'Edit company'}: ${company.name}`)
}

const manageInternships = (company: any) => {
  alert(`${language.value === 'de' ? 'Praktika verwalten für' : 'Manage internships for'} ${company.name}`)
}

const viewInternship = (internship: any) => {
  alert(`${language.value === 'de' ? 'Praktikum anzeigen' : 'View internship'}: ${internship.student} at ${internship.company}`)
}

const editInternship = (internship: any) => {
  alert(`${language.value === 'de' ? 'Praktikum bearbeiten' : 'Edit internship'}: ${internship.student} at ${internship.company}`)
}

const showCompanyDetailsModal = ref(false)
const selectedCompany = ref<any>(null)

// Pagination properties
const currentPage = ref(1)
const currentInternshipPage = ref(1)
const itemsPerPage = ref(5)
const internshipsPerPage = ref(5)

// Computed properties for pagination
const totalCompanyPages = computed(() => Math.ceil(filteredCompanies.value.length / itemsPerPage.value))

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCompanies.value.slice(start, end)
})

const totalInternshipPages = computed(() => Math.ceil(internships.value.length / internshipsPerPage.value))

const paginatedInternships = computed(() => {
  const start = (currentInternshipPage.value - 1) * internshipsPerPage.value
  const end = start + internshipsPerPage.value
  return internships.value.slice(start, end)
})

// Pagination methods
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalCompanyPages.value) {
    currentPage.value++
  }
}

const prevInternshipPage = () => {
  if (currentInternshipPage.value > 1) {
    currentInternshipPage.value--
  }
}

const nextInternshipPage = () => {
  if (currentInternshipPage.value < totalInternshipPages.value) {
    currentInternshipPage.value++
  }
}

// Removed unused viewCompanyDetails function
</script>
