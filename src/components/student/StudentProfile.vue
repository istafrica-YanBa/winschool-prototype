<template>
  <div class="space-y-6">
    <!-- Student Header -->
    <div class="flex items-center space-x-6">
      <img :src="props.student.avatar" :alt="props.student.name" class="h-24 w-24 rounded-full object-cover" />
      <div class="flex-1">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ props.student.name }}</h2>
        <p class="text-gray-600 dark:text-gray-400">{{ props.student.studentId }} • {{ props.student.class }}</p>
        <div class="flex space-x-4 mt-2">
          <span :class="getStatusColor(props.student.status)" class="px-3 py-1 text-sm font-medium rounded-full">
            {{ props.student.status }}
          </span>
          <span class="px-3 py-1 text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
            {{ props.student.age }} {{ language === 'de' ? 'Jahre' : 'years old' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
            activeTab === tab
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="mt-6">
      <!-- Personal Info Tab -->
      <div v-if="activeTab === (language === 'de' ? 'Persönliche Daten' : 'Personal Info')">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Kontaktinformationen' : 'Contact Information' }}</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'E-Mail' : 'Email' }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ props.student.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Telefon' : 'Phone' }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ props.student.phone || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Adresse' : 'Address' }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ props.student.address || '-' }}</span>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Schulinformationen' : 'School Information' }}</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Eintrittsdatum' : 'Enrollment Date' }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ props.student.enrollmentDate || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Klassenstufe' : 'Grade Level' }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ props.student.gradeLevel || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Klassenlehrer' : 'Homeroom Teacher' }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ props.student.homeroomTeacher || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Languages Tab -->
      <div v-if="activeTab === (language === 'de' ? 'Sprachen' : 'Languages')">
        <LanguageList 
          :languages="props.student.languages || []" 
          @add="$emit('add-language')"
          @edit="$emit('edit-language', $event)"
          @remove="$emit('remove-language', $event)"
        />
      </div>

      <!-- School Career Tab -->
      <div v-if="activeTab === (language === 'de' ? 'Schullaufbahn' : 'School Career')">
        <SchoolCareerTimeline 
          :career-entries="props.student.careerEntries || []" 
          @add="$emit('add-career-entry')"
          @edit="$emit('edit-career-entry', $event)"
          @remove="$emit('remove-career-entry', $event)"
        />
      </div>

      <!-- Correspondence Notes Tab -->
      <div v-if="activeTab === (language === 'de' ? 'Korrespondenz' : 'Correspondence')">
        <CorrespondenceNoteList 
          :notes="props.student.correspondenceNotes || []" 
          @add="$emit('add-correspondence-note')"
          @edit="$emit('edit-correspondence-note', $event)"
          @remove="$emit('remove-correspondence-note', $event)"
        />
      </div>

      <!-- Academics Tab -->
      <div v-if="activeTab === (language === 'de' ? 'Akademisch' : 'Academics')">
        <div class="space-y-6">
          <h4 class="font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Noten & Bewertungen' : 'Grades & Assessments' }}</h4>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
            <p class="text-gray-500 dark:text-gray-400">{{ language === 'de' ? 'Akademische Daten werden hier angezeigt' : 'Academic data will be displayed here' }}</p>
          </div>
        </div>
      </div>

      <!-- Attendance Tab -->
      <div v-if="activeTab === (language === 'de' ? 'Anwesenheit' : 'Attendance')">
        <div class="space-y-6">
          <h4 class="font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Anwesenheitsübersicht' : 'Attendance Overview' }}</h4>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
            <p class="text-gray-500 dark:text-gray-400">{{ language === 'de' ? 'Anwesenheitsdaten werden hier angezeigt' : 'Attendance data will be displayed here' }}</p>
          </div>
        </div>
      </div>

      <!-- Performance Certificates Tab -->
      <div v-if="activeTab === (language === 'de' ? 'Leistungsnachweise' : 'Performance Certificates')">
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h4 class="font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Leistungsnachweise' : 'Performance Certificates' }}</h4>
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <button class="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors" @click="showAddCertificateModal = true">
                {{ language === 'de' ? 'Neuer Nachweis' : 'Add Certificate' }}
              </button>
              <button class="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium px-4 py-2 rounded-lg transition-colors" @click="printCertificates">
                {{ language === 'de' ? 'Drucken' : 'Print Overview' }}
              </button>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <!-- Filters -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input 
                  v-model="certificateFilter.subject" 
                  :placeholder="language === 'de' ? 'Fach filtern' : 'Filter by subject'" 
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                />
                <select 
                  v-model="certificateFilter.status" 
                  class="flex-1 sm:flex-initial sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
                  <option value="completed">{{ language === 'de' ? 'Abgeschlossen' : 'Completed' }}</option>
                  <option value="excused">{{ language === 'de' ? 'Entschuldigt' : 'Excused' }}</option>
                  <option value="not_taken">{{ language === 'de' ? 'Nicht angetreten' : 'Not Taken' }}</option>
                </select>
              </div>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden lg:block overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <th class="w-10 py-3 px-4">
                      <input type="checkbox" v-model="selectAllCertificates" @change="toggleSelectAllCertificates" class="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm bg-white dark:bg-gray-700" />
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Fach' : 'Subject' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Typ' : 'Type' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Datum' : 'Date' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Dauer' : 'Duration' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Bewertung' : 'Evaluation' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Lehrkraft' : 'Teacher' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Status' : 'Status' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Aktionen' : 'Actions' }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="cert in paginatedCertificates" :key="cert.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="py-3 px-4">
                      <input type="checkbox" v-model="selectedCertificates" :value="cert.id" class="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm bg-white dark:bg-gray-700" />
                    </td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white font-medium">{{ cert.subject }}</td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ cert.type }}</td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ cert.date }}</td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ cert.duration }}</td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white font-semibold">{{ cert.evaluation }}</td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ cert.teacher }}</td>
                    <td class="py-3 px-4">
                      <span :class="getCertificateStatusColor(cert.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ getCertificateStatusText(cert.status) }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex space-x-2">
                        <button class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors" @click="editCertificate(cert)">
                          <Edit class="h-4 w-4" />
                        </button>
                        <button class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors" @click="deleteCertificate(cert.id)">
                          <Trash2 class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Card View -->
            <div class="lg:hidden space-y-4 p-4">
              <div v-for="cert in paginatedCertificates" :key="cert.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                <!-- Certificate Header -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center min-w-0 flex-1">
                    <input 
                      type="checkbox" 
                      v-model="selectedCertificates" 
                      :value="cert.id"
                      class="rounded border-gray-300 dark:border-gray-600 text-primary-600 mr-3 flex-shrink-0 bg-white dark:bg-gray-700"
                    />
                    <div class="min-w-0 flex-1">
                      <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ cert.subject }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ cert.type }} • {{ cert.date }}</p>
                    </div>
                  </div>
                  <span :class="getCertificateStatusColor(cert.status)" class="px-2 py-1 text-xs font-medium rounded-full ml-2 flex-shrink-0">
                    {{ getCertificateStatusText(cert.status) }}
                  </span>
                </div>

                <!-- Certificate Details -->
                <div class="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <span class="text-gray-500 dark:text-gray-400 block">{{ language === 'de' ? 'Dauer' : 'Duration' }}</span>
                    <span class="text-gray-900 dark:text-white font-medium">{{ cert.duration }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400 block">{{ language === 'de' ? 'Bewertung' : 'Evaluation' }}</span>
                    <span class="text-gray-900 dark:text-white font-medium">{{ cert.evaluation }}</span>
                  </div>
                  <div class="col-span-2">
                    <span class="text-gray-500 dark:text-gray-400 block">{{ language === 'de' ? 'Lehrkraft' : 'Teacher' }}</span>
                    <span class="text-gray-900 dark:text-white font-medium">{{ cert.teacher }}</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <button @click="editCertificate(cert)" class="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="deleteCertificate(cert.id)" class="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Mobile Empty State -->
              <div v-if="paginatedCertificates.length === 0" class="text-center py-8">
                <FileText class="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p class="text-gray-500 dark:text-gray-400">{{ language === 'de' ? 'Keine Leistungsnachweise gefunden' : 'No certificates found' }}</p>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="certificateTotalPages > 1" class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <div class="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                  {{ language === 'de' ? 'Zeigt' : 'Showing' }} {{ (certificateCurrentPage - 1) * certificateItemsPerPage + 1 }} {{ language === 'de' ? 'bis' : 'to' }} 
                  {{ Math.min(certificateCurrentPage * certificateItemsPerPage, filteredCertificates.length) }} {{ language === 'de' ? 'von' : 'of' }} {{ filteredCertificates.length }} 
                  {{ language === 'de' ? 'Nachweisen' : 'certificates' }}
                </div>
                
                <!-- Desktop Pagination -->
                <div class="hidden sm:flex justify-center space-x-1">
                  <button 
                    @click="previousCertificatePage" 
                    :disabled="certificateCurrentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Zurück' : 'Previous' }}
                  </button>
                  
                  <template v-for="page in certificateVisiblePages" :key="page">
                    <button 
                      v-if="page !== '...'"
                      @click="goToCertificatePage(page as number)"
                      :class="[
                        'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        certificateCurrentPage === page 
                          ? 'bg-primary-600 text-white' 
                          : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span v-else class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">...</span>
                  </template>
                  
                  <button 
                    @click="nextCertificatePage" 
                    :disabled="certificateCurrentPage === certificateTotalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Weiter' : 'Next' }}
                  </button>
                </div>

                <!-- Mobile Pagination -->
                <div class="flex sm:hidden justify-center space-x-2">
                  <button 
                    @click="previousCertificatePage" 
                    :disabled="certificateCurrentPage === 1"
                    class="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Zurück' : 'Previous' }}
                  </button>
                  
                  <span class="px-4 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                    {{ certificateCurrentPage }} / {{ certificateTotalPages }}
                  </span>
                  
                  <button 
                    @click="nextCertificatePage" 
                    :disabled="certificateCurrentPage === certificateTotalPages"
                    class="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Weiter' : 'Next' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Add/Edit Certificate Modal -->
          <div v-if="showAddCertificateModal || showEditCertificateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
              <div class="p-4 sm:p-6">
                <div class="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ showEditCertificateModal ? (language === 'de' ? 'Nachweis bearbeiten' : 'Edit Certificate') : (language === 'de' ? 'Neuen Nachweis hinzufügen' : 'Add New Certificate') }}
                  </h3>
                  <button @click="closeCertificateModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <X class="h-6 w-6" />
                  </button>
                </div>
                <form @submit.prevent="saveCertificate" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Fach' : 'Subject' }}</label>
                    <input v-model="certificateForm.subject" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Typ' : 'Type' }}</label>
                    <select v-model="certificateForm.type" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="written">{{ language === 'de' ? 'Schriftlich' : 'Written' }}</option>
                      <option value="oral">{{ language === 'de' ? 'Mündlich' : 'Oral' }}</option>
                      <option value="practical">{{ language === 'de' ? 'Praktisch' : 'Practical' }}</option>
                      <option value="other">{{ language === 'de' ? 'Sonstiges' : 'Other' }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Datum' : 'Date' }}</label>
                    <input v-model="certificateForm.date" type="date" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Dauer' : 'Duration' }}</label>
                    <input v-model="certificateForm.duration" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Bewertung' : 'Evaluation' }}</label>
                    <input v-model="certificateForm.evaluation" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Lehrkraft' : 'Teacher' }}</label>
                    <input v-model="certificateForm.teacher" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Status' : 'Status' }}</label>
                    <select v-model="certificateForm.status" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="completed">{{ language === 'de' ? 'Abgeschlossen' : 'Completed' }}</option>
                      <option value="excused">{{ language === 'de' ? 'Entschuldigt' : 'Excused' }}</option>
                      <option value="not_taken">{{ language === 'de' ? 'Nicht angetreten' : 'Not Taken' }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Semester/Klasse' : 'Semester/Class' }}</label>
                    <input v-model="certificateForm.semester" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400" />
                  </div>
                  <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                    <button type="button" @click="closeCertificateModal" class="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium px-4 py-2 rounded-lg transition-colors">
                      {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
                    </button>
                    <button type="submit" class="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                      {{ showEditCertificateModal ? (language === 'de' ? 'Aktualisieren' : 'Update') : (language === 'de' ? 'Hinzufügen' : 'Add') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Re-Examinations Tab -->
      <div v-if="activeTab === (language === 'de' ? 'Nachprüfungen' : 'Re-Examinations')">
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h4 class="font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Nachprüfungen' : 'Re-Examinations' }}</h4>
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <button class="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors" @click="showAddReExamModal = true">
                {{ language === 'de' ? 'Neue Nachprüfung' : 'Add Re-Exam' }}
              </button>
              <button class="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium px-4 py-2 rounded-lg transition-colors" @click="printReExams">
                {{ language === 'de' ? 'Drucken' : 'Print Overview' }}
              </button>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <!-- Filters -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input 
                  v-model="reExamFilter.subject" 
                  :placeholder="language === 'de' ? 'Fach filtern' : 'Filter by subject'" 
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                />
                <select 
                  v-model="reExamFilter.status" 
                  class="flex-1 sm:flex-initial sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
                  <option value="registered">{{ language === 'de' ? 'Angemeldet' : 'Registered' }}</option>
                  <option value="completed">{{ language === 'de' ? 'Abgeschlossen' : 'Completed' }}</option>
                  <option value="not_passed">{{ language === 'de' ? 'Nicht bestanden' : 'Not Passed' }}</option>
                </select>
              </div>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden lg:block overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <th class="w-10 py-3 px-4">
                      <input type="checkbox" v-model="selectAllReExams" @change="toggleSelectAllReExams" class="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm bg-white dark:bg-gray-700" />
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Fach' : 'Subject' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Typ' : 'Type' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Datum' : 'Date' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Lehrkraft' : 'Teacher' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Status' : 'Status' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Aktionen' : 'Actions' }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="exam in paginatedReExams" :key="exam.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="py-3 px-4">
                      <input type="checkbox" v-model="selectedReExams" :value="exam.id" class="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm bg-white dark:bg-gray-700" />
                    </td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white font-medium">{{ exam.subject }}</td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ exam.type }}</td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ exam.date }}</td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ exam.teacher }}</td>
                    <td class="py-3 px-4">
                      <span :class="getReExamStatusColor(exam.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ getReExamStatusText(exam.status) }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex space-x-2">
                        <button class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors" @click="editReExam(exam)">
                          <Edit class="h-4 w-4" />
                        </button>
                        <button class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors" @click="deleteReExam(exam.id)">
                          <Trash2 class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Card View -->
            <div class="lg:hidden space-y-4 p-4">
              <div v-for="exam in paginatedReExams" :key="exam.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                <!-- Re-Exam Header -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center min-w-0 flex-1">
                    <input 
                      type="checkbox" 
                      v-model="selectedReExams" 
                      :value="exam.id"
                      class="rounded border-gray-300 dark:border-gray-600 text-primary-600 mr-3 flex-shrink-0 bg-white dark:bg-gray-700"
                    />
                    <div class="min-w-0 flex-1">
                      <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ exam.subject }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ exam.type }} • {{ exam.date }}</p>
                    </div>
                  </div>
                  <span :class="getReExamStatusColor(exam.status)" class="px-2 py-1 text-xs font-medium rounded-full ml-2 flex-shrink-0">
                    {{ getReExamStatusText(exam.status) }}
                  </span>
                </div>

                <!-- Re-Exam Details -->
                <div class="grid grid-cols-1 gap-3 mb-3 text-sm">
                  <div>
                    <span class="text-gray-500 dark:text-gray-400 block">{{ language === 'de' ? 'Lehrkraft' : 'Teacher' }}</span>
                    <span class="text-gray-900 dark:text-white font-medium">{{ exam.teacher }}</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <button @click="editReExam(exam)" class="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="deleteReExam(exam.id)" class="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Mobile Empty State -->
              <div v-if="paginatedReExams.length === 0" class="text-center py-8">
                <FileText class="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p class="text-gray-500 dark:text-gray-400">{{ language === 'de' ? 'Keine Nachprüfungen gefunden' : 'No re-examinations found' }}</p>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="reExamTotalPages > 1" class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <div class="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                  {{ language === 'de' ? 'Zeigt' : 'Showing' }} {{ (reExamCurrentPage - 1) * reExamItemsPerPage + 1 }} {{ language === 'de' ? 'bis' : 'to' }} 
                  {{ Math.min(reExamCurrentPage * reExamItemsPerPage, filteredReExams.length) }} {{ language === 'de' ? 'von' : 'of' }} {{ filteredReExams.length }} 
                  {{ language === 'de' ? 'Nachprüfungen' : 're-examinations' }}
                </div>
                
                <!-- Desktop Pagination -->
                <div class="hidden sm:flex justify-center space-x-1">
                  <button 
                    @click="previousReExamPage" 
                    :disabled="reExamCurrentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Zurück' : 'Previous' }}
                  </button>
                  
                  <template v-for="page in reExamVisiblePages" :key="page">
                    <button 
                      v-if="page !== '...'"
                      @click="goToReExamPage(page as number)"
                      :class="[
                        'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        reExamCurrentPage === page 
                          ? 'bg-primary-600 text-white' 
                          : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span v-else class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">...</span>
                  </template>
                  
                  <button 
                    @click="nextReExamPage" 
                    :disabled="reExamCurrentPage === reExamTotalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Weiter' : 'Next' }}
                  </button>
                </div>

                <!-- Mobile Pagination -->
                <div class="flex sm:hidden justify-center space-x-2">
                  <button 
                    @click="previousReExamPage" 
                    :disabled="reExamCurrentPage === 1"
                    class="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Zurück' : 'Previous' }}
                  </button>
                  
                  <span class="px-4 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                    {{ reExamCurrentPage }} / {{ reExamTotalPages }}
                  </span>
                  
                  <button 
                    @click="nextReExamPage" 
                    :disabled="reExamCurrentPage === reExamTotalPages"
                    class="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Weiter' : 'Next' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Add/Edit Re-Exam Modal -->
          <div v-if="showAddReExamModal || showEditReExamModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
              <div class="p-4 sm:p-6">
                <div class="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ showEditReExamModal ? (language === 'de' ? 'Nachprüfung bearbeiten' : 'Edit Re-Exam') : (language === 'de' ? 'Neue Nachprüfung hinzufügen' : 'Add New Re-Exam') }}
                  </h3>
                  <button @click="closeReExamModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <X class="h-6 w-6" />
                  </button>
                </div>
                <form @submit.prevent="saveReExam" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Fach' : 'Subject' }}</label>
                    <input v-model="reExamForm.subject" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Typ' : 'Type' }}</label>
                    <select v-model="reExamForm.type" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="written">{{ language === 'de' ? 'Schriftlich' : 'Written' }}</option>
                      <option value="oral">{{ language === 'de' ? 'Mündlich' : 'Oral' }}</option>
                      <option value="practical">{{ language === 'de' ? 'Praktisch' : 'Practical' }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Datum' : 'Date' }}</label>
                    <input v-model="reExamForm.date" type="date" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Lehrkraft' : 'Teacher' }}</label>
                    <input v-model="reExamForm.teacher" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Status' : 'Status' }}</label>
                    <select v-model="reExamForm.status" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="registered">{{ language === 'de' ? 'Angemeldet' : 'Registered' }}</option>
                      <option value="completed">{{ language === 'de' ? 'Abgeschlossen' : 'Completed' }}</option>
                      <option value="not_passed">{{ language === 'de' ? 'Nicht bestanden' : 'Not Passed' }}</option>
                    </select>
                  </div>
                  <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                    <button type="button" @click="closeReExamModal" class="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium px-4 py-2 rounded-lg transition-colors">
                      {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
                    </button>
                    <button type="submit" class="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                      {{ showEditReExamModal ? (language === 'de' ? 'Aktualisieren' : 'Update') : (language === 'de' ? 'Hinzufügen' : 'Add') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Learning Goals Tab -->
      <div v-if="activeTab === (language === 'de' ? 'Lernziele' : 'Learning Goals')">
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h4 class="font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Lernziele' : 'Learning Goals' }}</h4>
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <button class="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors" @click="showAddGoalModal = true">
                {{ language === 'de' ? 'Neues Lernziel' : 'Add Goal' }}
              </button>
              <button class="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium px-4 py-2 rounded-lg transition-colors" @click="printLearningGoals">
                {{ language === 'de' ? 'Drucken' : 'Print Overview' }}
              </button>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <!-- Filters -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input 
                  v-model="goalFilter.subject" 
                  :placeholder="language === 'de' ? 'Fach filtern' : 'Filter by subject'" 
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                />
                <select 
                  v-model="goalFilter.status" 
                  class="flex-1 sm:flex-initial sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
                  <option value="in_progress">{{ language === 'de' ? 'In Bearbeitung' : 'In Progress' }}</option>
                  <option value="achieved">{{ language === 'de' ? 'Erreicht' : 'Achieved' }}</option>
                  <option value="not_achieved">{{ language === 'de' ? 'Nicht erreicht' : 'Not Achieved' }}</option>
                </select>
              </div>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden lg:block overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50 dark:bg-gray-700">
                    <th class="w-10 py-3 px-4">
                      <input type="checkbox" v-model="selectAllGoals" @change="toggleSelectAllGoals" class="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm bg-white dark:bg-gray-700" />
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Lernziel' : 'Goal' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Fach' : 'Subject' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Standard' : 'Standard' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Status' : 'Status' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Fortschritt' : 'Progress' }}</th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Aktionen' : 'Actions' }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="goal in paginatedGoals" :key="goal.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="py-3 px-4">
                      <input type="checkbox" v-model="selectedGoals" :value="goal.id" class="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm bg-white dark:bg-gray-700" />
                    </td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white font-medium">{{ goal.title }}</td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ goal.subject }}</td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ goal.standard }}</td>
                    <td class="py-3 px-4">
                      <span :class="getGoalStatusColor(goal.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ getGoalStatusText(goal.status) }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center space-x-2">
                        <div class="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div class="bg-primary-600 h-2 rounded-full" :style="{ width: goal.progress + '%' }"></div>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400 min-w-0">{{ goal.progress }}%</span>
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex space-x-2">
                        <button class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors" @click="editGoal(goal)">
                          <Edit class="h-4 w-4" />
                        </button>
                        <button class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors" @click="deleteGoal(goal.id)">
                          <Trash2 class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Card View -->
            <div class="lg:hidden space-y-4 p-4">
              <div v-for="goal in paginatedGoals" :key="goal.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                <!-- Goal Header -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center min-w-0 flex-1">
                    <input 
                      type="checkbox" 
                      v-model="selectedGoals" 
                      :value="goal.id"
                      class="rounded border-gray-300 dark:border-gray-600 text-primary-600 mr-3 flex-shrink-0 bg-white dark:bg-gray-700"
                    />
                    <div class="min-w-0 flex-1">
                      <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ goal.title }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ goal.subject }}</p>
                    </div>
                  </div>
                  <span :class="getGoalStatusColor(goal.status)" class="px-2 py-1 text-xs font-medium rounded-full ml-2 flex-shrink-0">
                    {{ getGoalStatusText(goal.status) }}
                  </span>
                </div>

                <!-- Goal Details -->
                <div class="grid grid-cols-1 gap-3 mb-3 text-sm">
                  <div>
                    <span class="text-gray-500 dark:text-gray-400 block">{{ language === 'de' ? 'Standard' : 'Standard' }}</span>
                    <span class="text-gray-900 dark:text-white font-medium">{{ goal.standard || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400 block">{{ language === 'de' ? 'Fortschritt' : 'Progress' }}</span>
                    <div class="flex items-center space-x-2 mt-1">
                      <div class="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div class="bg-primary-600 h-2 rounded-full" :style="{ width: goal.progress + '%' }"></div>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400 min-w-0">{{ goal.progress }}%</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <button @click="editGoal(goal)" class="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="deleteGoal(goal.id)" class="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Mobile Empty State -->
              <div v-if="paginatedGoals.length === 0" class="text-center py-8">
                <FileText class="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p class="text-gray-500 dark:text-gray-400">{{ language === 'de' ? 'Keine Lernziele gefunden' : 'No learning goals found' }}</p>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="goalTotalPages > 1" class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <div class="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                  {{ language === 'de' ? 'Zeigt' : 'Showing' }} {{ (goalCurrentPage - 1) * goalItemsPerPage + 1 }} {{ language === 'de' ? 'bis' : 'to' }} 
                  {{ Math.min(goalCurrentPage * goalItemsPerPage, filteredGoals.length) }} {{ language === 'de' ? 'von' : 'of' }} {{ filteredGoals.length }} 
                  {{ language === 'de' ? 'Lernzielen' : 'learning goals' }}
                </div>
                
                <!-- Desktop Pagination -->
                <div class="hidden sm:flex justify-center space-x-1">
                  <button 
                    @click="previousGoalPage" 
                    :disabled="goalCurrentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Zurück' : 'Previous' }}
                  </button>
                  
                  <template v-for="page in goalVisiblePages" :key="page">
                    <button 
                      v-if="page !== '...'"
                      @click="goToGoalPage(page as number)"
                      :class="[
                        'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        goalCurrentPage === page 
                          ? 'bg-primary-600 text-white' 
                          : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span v-else class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">...</span>
                  </template>
                  
                  <button 
                    @click="nextGoalPage" 
                    :disabled="goalCurrentPage === goalTotalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Weiter' : 'Next' }}
                  </button>
                </div>

                <!-- Mobile Pagination -->
                <div class="flex sm:hidden justify-center space-x-2">
                  <button 
                    @click="previousGoalPage" 
                    :disabled="goalCurrentPage === 1"
                    class="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Zurück' : 'Previous' }}
                  </button>
                  
                  <span class="px-4 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                    {{ goalCurrentPage }} / {{ goalTotalPages }}
                  </span>
                  
                  <button 
                    @click="nextGoalPage" 
                    :disabled="goalCurrentPage === goalTotalPages"
                    class="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ language === 'de' ? 'Weiter' : 'Next' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Add/Edit Goal Modal -->
          <div v-if="showAddGoalModal || showEditGoalModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
              <div class="p-4 sm:p-6">
                <div class="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ showEditGoalModal ? (language === 'de' ? 'Lernziel bearbeiten' : 'Edit Goal') : (language === 'de' ? 'Neues Lernziel hinzufügen' : 'Add New Goal') }}
                  </h3>
                  <button @click="closeGoalModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <X class="h-6 w-6" />
                  </button>
                </div>
                <form @submit.prevent="saveGoal" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Lernziel' : 'Goal' }}</label>
                    <input v-model="goalForm.title" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Fach' : 'Subject' }}</label>
                    <input v-model="goalForm.subject" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Standard' : 'Standard' }}</label>
                    <input v-model="goalForm.standard" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Status' : 'Status' }}</label>
                    <select v-model="goalForm.status" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="in_progress">{{ language === 'de' ? 'In Bearbeitung' : 'In Progress' }}</option>
                      <option value="achieved">{{ language === 'de' ? 'Erreicht' : 'Achieved' }}</option>
                      <option value="not_achieved">{{ language === 'de' ? 'Nicht erreicht' : 'Not Achieved' }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Fortschritt' : 'Progress' }} (%)</label>
                    <input v-model.number="goalForm.progress" type="number" min="0" max="100" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                    <button type="button" @click="closeGoalModal" class="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium px-4 py-2 rounded-lg transition-colors">
                      {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
                    </button>
                    <button type="submit" class="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                      {{ showEditGoalModal ? (language === 'de' ? 'Aktualisieren' : 'Update') : (language === 'de' ? 'Hinzufügen' : 'Add') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Academic Report/Certificate Print Modal -->
      <div v-if="showPrintModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Zeugnis/Leistungsnachweis drucken' : 'Print Report/Certificate' }}
              </h3>
              <button @click="showPrintModal = false" class="text-gray-400 hover:text-gray-600"><X class="h-6 w-6" /></button>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ language === 'de' ? 'Vorlage wählen' : 'Select Template' }}</label>
              <select v-model="selectedPrintTemplate" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option v-for="tpl in printTemplates" :key="tpl.id" :value="tpl.id">{{ tpl.name }}</option>
              </select>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 min-h-[200px] border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div class="text-center text-gray-500 dark:text-gray-400">
                <FileText class="h-12 w-12 mx-auto mb-2" />
                <p class="text-sm">{{ selectedPrintTemplateObj.name }}</p>
                <p class="text-xs mt-1">{{ selectedPrintTemplateObj.format }}</p>
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button @click="showPrintModal = false" class="btn-secondary">{{ language === 'de' ? 'Schließen' : 'Close' }}</button>
              <button class="btn-primary" @click="printSelectedTemplate">{{ language === 'de' ? 'Drucken/Exportieren' : 'Print/Export' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch } from 'vue'
import { useThemeStore } from '../../stores/theme'
import LanguageList from './LanguageList.vue'
import SchoolCareerTimeline from './SchoolCareerTimeline.vue'
import CorrespondenceNoteList from './CorrespondenceNoteList.vue'
import { Edit, Trash2, X, FileText } from 'lucide-vue-next'

const emit = defineEmits([
  'add-language', 'edit-language', 'remove-language',
  'add-career-entry', 'edit-career-entry', 'remove-career-entry',
  'add-correspondence-note', 'edit-correspondence-note', 'remove-correspondence-note'
])

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const tabs = computed(() => [
  language.value === 'de' ? 'Persönliche Daten' : 'Personal Info',
  language.value === 'de' ? 'Sprachen' : 'Languages',
  language.value === 'de' ? 'Schullaufbahn' : 'School Career',
  language.value === 'de' ? 'Korrespondenz' : 'Correspondence',
  language.value === 'de' ? 'Akademisch' : 'Academics',
  language.value === 'de' ? 'Anwesenheit' : 'Attendance',
  language.value === 'de' ? 'Leistungsnachweise' : 'Performance Certificates',
  language.value === 'de' ? 'Nachprüfungen' : 'Re-Examinations',
  language.value === 'de' ? 'Lernziele' : 'Learning Goals',
])

const activeTab = ref(language.value === 'de' ? 'Lernziele' : 'Learning Goals')

const props = defineProps({
  student: {
    type: Object,
    required: false,
    default: () => ({
      id: 1,
      name: 'Max Mustermann',
      email: 'max.mustermann@example.com',
      class: '12A',
      status: 'Active',
      enrollmentDate: '2020-09-01',
      nationality: 'German',
      contactPerson: 'present',
      archived: false,
      languages: [],
      address: '',
      gradeLevel: '',
      homeroomTeacher: '',
      careerEntries: [],
      correspondenceNotes: []
    })
  }
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'inactive':
    case 'Inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

// Performance Certificates Pagination
const certificateCurrentPage = ref(1)
const certificateItemsPerPage = ref(5)

// Performance Certificates State
const showAddCertificateModal = ref(false)
const showEditCertificateModal = ref(false)
const selectAllCertificates = ref(false)
const selectedCertificates = ref<number[]>([])
const certificateFilter = ref({ subject: '', status: '' })
const certificateForm = ref({
  id: 0,
  subject: '',
  type: 'written',
  date: '',
  duration: '',
  evaluation: '',
  teacher: '',
  status: 'completed',
  semester: ''
})

// Enhanced certificates data for pagination demonstration
const certificates = ref([
  { id: 1, subject: 'Mathematics', type: 'written', date: '2024-03-01', duration: '90 min', evaluation: 'A', teacher: 'Mr. Smith', status: 'completed', semester: 'Spring 2024' },
  { id: 2, subject: 'English', type: 'oral', date: '2024-03-10', duration: '30 min', evaluation: 'B+', teacher: 'Ms. Johnson', status: 'excused', semester: 'Spring 2024' },
  { id: 3, subject: 'Physics', type: 'practical', date: '2024-03-15', duration: '60 min', evaluation: 'B', teacher: 'Dr. Brown', status: 'not_taken', semester: 'Spring 2024' },
  { id: 4, subject: 'Chemistry', type: 'written', date: '2024-02-28', duration: '120 min', evaluation: 'A-', teacher: 'Dr. Wilson', status: 'completed', semester: 'Spring 2024' },
  { id: 5, subject: 'Biology', type: 'practical', date: '2024-02-20', duration: '90 min', evaluation: 'B+', teacher: 'Ms. Davis', status: 'completed', semester: 'Spring 2024' },
  { id: 6, subject: 'History', type: 'oral', date: '2024-02-15', duration: '45 min', evaluation: 'A', teacher: 'Mr. Thompson', status: 'completed', semester: 'Spring 2024' },
  { id: 7, subject: 'Geography', type: 'written', date: '2024-02-10', duration: '75 min', evaluation: 'B', teacher: 'Ms. Garcia', status: 'completed', semester: 'Spring 2024' },
  { id: 8, subject: 'German Literature', type: 'oral', date: '2024-01-25', duration: '30 min', evaluation: 'A-', teacher: 'Dr. Mueller', status: 'completed', semester: 'Fall 2023' },
  { id: 9, subject: 'French', type: 'written', date: '2024-01-20', duration: '90 min', evaluation: 'B+', teacher: 'Mme. Dubois', status: 'completed', semester: 'Fall 2023' },
  { id: 10, subject: 'Art', type: 'practical', date: '2024-01-15', duration: '180 min', evaluation: 'A', teacher: 'Ms. Rodriguez', status: 'completed', semester: 'Fall 2023' }
])

const filteredCertificates = computed(() => {
  return certificates.value.filter(cert => {
    const subjectMatch = !certificateFilter.value.subject || cert.subject.toLowerCase().includes(certificateFilter.value.subject.toLowerCase())
    const statusMatch = !certificateFilter.value.status || cert.status === certificateFilter.value.status
    return subjectMatch && statusMatch
  })
})

// Certificate pagination computed properties
const certificateTotalPages = computed(() => Math.ceil(filteredCertificates.value.length / certificateItemsPerPage.value))

const paginatedCertificates = computed(() => {
  const start = (certificateCurrentPage.value - 1) * certificateItemsPerPage.value
  const end = start + certificateItemsPerPage.value
  return filteredCertificates.value.slice(start, end)
})

const certificateVisiblePages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisible = 5
  
  if (certificateTotalPages.value <= maxVisible) {
    for (let i = 1; i <= certificateTotalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (certificateCurrentPage.value <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(certificateTotalPages.value)
    } else if (certificateCurrentPage.value >= certificateTotalPages.value - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = certificateTotalPages.value - 3; i <= certificateTotalPages.value; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = certificateCurrentPage.value - 1; i <= certificateCurrentPage.value + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(certificateTotalPages.value)
    }
  }
  
  return pages
})

// Certificate pagination methods
const goToCertificatePage = (page: number) => {
  certificateCurrentPage.value = page
}

const nextCertificatePage = () => {
  if (certificateCurrentPage.value < certificateTotalPages.value) {
    certificateCurrentPage.value++
  }
}

const previousCertificatePage = () => {
  if (certificateCurrentPage.value > 1) {
    certificateCurrentPage.value--
  }
}

// Watch for filter changes to reset pagination
watch([certificateFilter], () => {
  certificateCurrentPage.value = 1
}, { deep: true })

function toggleSelectAllCertificates() {
  if (selectAllCertificates.value) {
    selectedCertificates.value = paginatedCertificates.value.map((cert: { id: number }) => cert.id)
  } else {
    selectedCertificates.value = []
  }
}

function getCertificateStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'excused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'not_taken': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

function getCertificateStatusText(status: string) {
  if (language.value === 'de') {
    return status === 'completed' ? 'Abgeschlossen' : status === 'excused' ? 'Entschuldigt' : status === 'not_taken' ? 'Nicht angetreten' : status
  } else {
    return status === 'completed' ? 'Completed' : status === 'excused' ? 'Excused' : status === 'not_taken' ? 'Not Taken' : status
  }
}

function closeCertificateModal() {
  showAddCertificateModal.value = false
  showEditCertificateModal.value = false
  certificateForm.value = { id: 0, subject: '', type: 'written', date: '', duration: '', evaluation: '', teacher: '', status: 'completed', semester: '' }
}

function saveCertificate() {
  if (showEditCertificateModal.value) {
    // Update existing
    const idx = certificates.value.findIndex((c: { id: number }) => c.id === certificateForm.value.id)
    if (idx !== -1) certificates.value[idx] = { ...certificateForm.value }
  } else {
    // Add new
    const newId = Math.max(0, ...certificates.value.map((c: { id: number }) => c.id)) + 1
    certificates.value.push({ ...certificateForm.value, id: newId })
  }
  closeCertificateModal()
}

function editCertificate(cert: { id: number; subject: string; type: string; date: string; duration: string; evaluation: string; teacher: string; status: string; semester: string }) {
  certificateForm.value = { ...cert }
  showEditCertificateModal.value = true
}

function deleteCertificate(id: number) {
  certificates.value = certificates.value.filter((c: { id: number }) => c.id !== id)
  selectedCertificates.value = selectedCertificates.value.filter((certId: number) => certId !== id)
}

function printCertificates() {
  showPrintModal.value = true
}

// Re-Examinations Pagination
const reExamCurrentPage = ref(1)
const reExamItemsPerPage = ref(5)

// Re-Examinations State
const showAddReExamModal = ref(false)
const showEditReExamModal = ref(false)
const selectAllReExams = ref(false)
const selectedReExams = ref<number[]>([])
const reExamFilter = ref({ subject: '', status: '' })
const reExamForm = ref({
  id: 0,
  subject: '',
  type: 'written',
  date: '',
  teacher: '',
  status: 'registered'
})

// Enhanced re-exam data for pagination demonstration
const reExams = ref([
  { id: 1, subject: 'Mathematics', type: 'written', date: '2024-04-15', teacher: 'Mr. Smith', status: 'registered' },
  { id: 2, subject: 'Physics', type: 'oral', date: '2024-04-20', teacher: 'Dr. Brown', status: 'completed' },
  { id: 3, subject: 'Chemistry', type: 'practical', date: '2024-04-25', teacher: 'Dr. Wilson', status: 'not_passed' },
  { id: 4, subject: 'Biology', type: 'written', date: '2024-05-01', teacher: 'Ms. Davis', status: 'registered' },
  { id: 5, subject: 'English', type: 'oral', date: '2024-05-05', teacher: 'Ms. Johnson', status: 'completed' },
  { id: 6, subject: 'History', type: 'written', date: '2024-05-10', teacher: 'Mr. Thompson', status: 'registered' },
  { id: 7, subject: 'Geography', type: 'oral', date: '2024-05-15', teacher: 'Ms. Garcia', status: 'completed' }
])

const filteredReExams = computed(() => {
  return reExams.value.filter(exam => {
    const subjectMatch = !reExamFilter.value.subject || exam.subject.toLowerCase().includes(reExamFilter.value.subject.toLowerCase())
    const statusMatch = !reExamFilter.value.status || exam.status === reExamFilter.value.status
    return subjectMatch && statusMatch
  })
})

// Re-exam pagination computed properties
const reExamTotalPages = computed(() => Math.ceil(filteredReExams.value.length / reExamItemsPerPage.value))

const paginatedReExams = computed(() => {
  const start = (reExamCurrentPage.value - 1) * reExamItemsPerPage.value
  const end = start + reExamItemsPerPage.value
  return filteredReExams.value.slice(start, end)
})

const reExamVisiblePages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisible = 5
  
  if (reExamTotalPages.value <= maxVisible) {
    for (let i = 1; i <= reExamTotalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (reExamCurrentPage.value <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(reExamTotalPages.value)
    } else if (reExamCurrentPage.value >= reExamTotalPages.value - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = reExamTotalPages.value - 3; i <= reExamTotalPages.value; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = reExamCurrentPage.value - 1; i <= reExamCurrentPage.value + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(reExamTotalPages.value)
    }
  }
  
  return pages
})

// Re-exam pagination methods
const goToReExamPage = (page: number) => {
  reExamCurrentPage.value = page
}

const nextReExamPage = () => {
  if (reExamCurrentPage.value < reExamTotalPages.value) {
    reExamCurrentPage.value++
  }
}

const previousReExamPage = () => {
  if (reExamCurrentPage.value > 1) {
    reExamCurrentPage.value--
  }
}

// Watch for filter changes to reset pagination
watch([reExamFilter], () => {
  reExamCurrentPage.value = 1
}, { deep: true })

function toggleSelectAllReExams() {
  if (selectAllReExams.value) {
    selectedReExams.value = paginatedReExams.value.map((exam: { id: number }) => exam.id)
  } else {
    selectedReExams.value = []
  }
}

function getReExamStatusColor(status: string) {
  switch (status) {
    case 'registered': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'not_passed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

function getReExamStatusText(status: string) {
  if (language.value === 'de') {
    return status === 'registered' ? 'Angemeldet' : status === 'completed' ? 'Abgeschlossen' : status === 'not_passed' ? 'Nicht bestanden' : status
  } else {
    return status === 'registered' ? 'Registered' : status === 'completed' ? 'Completed' : status === 'not_passed' ? 'Not Passed' : status
  }
}

function closeReExamModal() {
  showAddReExamModal.value = false
  showEditReExamModal.value = false
  reExamForm.value = { id: 0, subject: '', type: 'written', date: '', teacher: '', status: 'registered' }
}

function saveReExam() {
  if (showEditReExamModal.value) {
    // Update existing
    const idx = reExams.value.findIndex((e: { id: number }) => e.id === reExamForm.value.id)
    if (idx !== -1) reExams.value[idx] = { ...reExamForm.value }
  } else {
    // Add new
    const newId = Math.max(0, ...reExams.value.map((e: { id: number }) => e.id)) + 1
    reExams.value.push({ ...reExamForm.value, id: newId })
  }
  closeReExamModal()
}

function editReExam(exam: { id: number; subject: string; type: string; date: string; teacher: string; status: string }) {
  reExamForm.value = { ...exam }
  showEditReExamModal.value = true
}

function deleteReExam(id: number) {
  reExams.value = reExams.value.filter((e: { id: number }) => e.id !== id)
  selectedReExams.value = selectedReExams.value.filter((examId: number) => examId !== id)
}

function printReExams() {
  showPrintModal.value = true
}

// Learning Goals Pagination  
const goalCurrentPage = ref(1)
const goalItemsPerPage = ref(5)

// Learning Goals State
const showAddGoalModal = ref(false)
const showEditGoalModal = ref(false)
const selectAllGoals = ref(false)
const selectedGoals = ref<number[]>([])
const goalFilter = ref({ subject: '', status: '' })
const goalForm = ref({
  id: 0,
  title: '',
  subject: '',
  standard: '',
  status: '',
  progress: 0
})

// Enhanced goals data for pagination demonstration
const learningGoals = ref([
  { id: 1, title: 'Solve quadratic equations', subject: 'Mathematics', standard: 'CCSS.MATH.HSA-REI.B.4', status: 'achieved', progress: 100 },
  { id: 2, title: 'Analyze literary themes', subject: 'English', standard: 'CCSS.ELA-LITERACY.RL.9-10.2', status: 'in_progress', progress: 75 },
  { id: 3, title: 'Understand photosynthesis', subject: 'Biology', standard: 'NGSS.HS-LS1-5', status: 'achieved', progress: 100 },
  { id: 4, title: 'Calculate derivatives', subject: 'Mathematics', standard: 'CCSS.MATH.HSF-IF.B.4', status: 'in_progress', progress: 60 },
  { id: 5, title: 'Analyze historical events', subject: 'History', standard: 'NCSS.3', status: 'achieved', progress: 100 },
  { id: 6, title: 'Write persuasive essays', subject: 'English', standard: 'CCSS.ELA-LITERACY.W.9-10.1', status: 'in_progress', progress: 80 },
  { id: 7, title: 'Balance chemical equations', subject: 'Chemistry', standard: 'NGSS.HS-PS1-7', status: 'not_achieved', progress: 30 }
])

const filteredGoals = computed(() => {
  return learningGoals.value.filter(goal => {
    const subjectMatch = !goalFilter.value.subject || goal.subject.toLowerCase().includes(goalFilter.value.subject.toLowerCase())
    const statusMatch = !goalFilter.value.status || goal.status === goalFilter.value.status
    return subjectMatch && statusMatch
  })
})

// Goals pagination computed properties
const goalTotalPages = computed(() => Math.ceil(filteredGoals.value.length / goalItemsPerPage.value))

const paginatedGoals = computed(() => {
  const start = (goalCurrentPage.value - 1) * goalItemsPerPage.value
  const end = start + goalItemsPerPage.value
  return filteredGoals.value.slice(start, end)
})

const goalVisiblePages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisible = 5
  
  if (goalTotalPages.value <= maxVisible) {
    for (let i = 1; i <= goalTotalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (goalCurrentPage.value <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(goalTotalPages.value)
    } else if (goalCurrentPage.value >= goalTotalPages.value - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = goalTotalPages.value - 3; i <= goalTotalPages.value; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = goalCurrentPage.value - 1; i <= goalCurrentPage.value + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(goalTotalPages.value)
    }
  }
  
  return pages
})

// Goals pagination methods
const goToGoalPage = (page: number) => {
  goalCurrentPage.value = page
}

const nextGoalPage = () => {
  if (goalCurrentPage.value < goalTotalPages.value) {
    goalCurrentPage.value++
  }
}

const previousGoalPage = () => {
  if (goalCurrentPage.value > 1) {
    goalCurrentPage.value--
  }
}

// Watch for filter changes to reset pagination
watch([goalFilter], () => {
  goalCurrentPage.value = 1
}, { deep: true })

function toggleSelectAllGoals() {
  if (selectAllGoals.value) {
    selectedGoals.value = paginatedGoals.value.map(goal => goal.id)
  } else {
    selectedGoals.value = []
  }
}

function getGoalStatusColor(status: string) {
  switch (status) {
    case 'not_started': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

function getGoalStatusText(status: string) {
  if (language.value === 'de') {
    return status === 'not_started' ? 'Nicht begonnen' : status === 'in_progress' ? 'In Bearbeitung' : status === 'completed' ? 'Abgeschlossen' : status
  } else {
    return status === 'not_started' ? 'Not Started' : status === 'in_progress' ? 'In Progress' : status === 'completed' ? 'Completed' : status
  }
}

function closeGoalModal() {
  showAddGoalModal.value = false
  showEditGoalModal.value = false
  goalForm.value = { id: 0, title: '', subject: '', standard: '', status: '', progress: 0 }
}

function saveGoal() {
  if (showEditGoalModal.value) {
    // Update existing
    const idx = learningGoals.value.findIndex(g => g.id === goalForm.value.id)
    if (idx !== -1) learningGoals.value[idx] = { ...goalForm.value }
  } else {
    // Add new
    const newId = Math.max(0, ...learningGoals.value.map(g => g.id)) + 1
    learningGoals.value.push({ ...goalForm.value, id: newId })
  }
  closeGoalModal()
}

function editGoal(goal: { id: number; title: string; subject: string; standard: string; status: string; progress: number }) {
  goalForm.value = { ...goal }
  showEditGoalModal.value = true
}

function deleteGoal(id: number) {
  learningGoals.value = learningGoals.value.filter((g: { id: number }) => g.id !== id)
  selectedGoals.value = selectedGoals.value.filter((goalId: number) => goalId !== id)
}

function printLearningGoals() {
  showPrintModal.value = true
}

// Print modal state
const showPrintModal = ref(false)
const selectedPrintTemplate = ref('academic_report')

const printTemplates = [
  { id: 'academic_report', name: language.value === 'de' ? 'Akademischer Bericht' : 'Academic Report', format: 'PDF' },
  { id: 'certificate_overview', name: language.value === 'de' ? 'Leistungsnachweis-Übersicht' : 'Certificate Overview', format: 'PDF' },
  { id: 'progress_report', name: language.value === 'de' ? 'Fortschrittsbericht' : 'Progress Report', format: 'PDF' }
]

const selectedPrintTemplateObj = computed(() => {
  return printTemplates.find(tpl => tpl.id === selectedPrintTemplate.value) || printTemplates[0]
})

function printSelectedTemplate() {
  alert(`${language.value === 'de' ? 'Drucke' : 'Printing'} ${selectedPrintTemplateObj.value.name}...`)
  showPrintModal.value = false
}
</script>