<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary dark:bg-gradient-to-r dark:from-indigo-700 dark:to-blue-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <UserPlus class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800 dark:text-white" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Anträge & Aufnahme' : 'Applications & Admission' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Schulanträge und verfolgen Sie den Aufnahmestatus' : 'Manage school applications and track admission status' }}
            </p>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button 
            @click="showApplicationForm = true" 
            class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark dark:bg-gradient-to-r dark:from-indigo-700 dark:to-blue-600 dark:hover:from-indigo-800 dark:hover:to-blue-700 text-slate-800 dark:text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
          >
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Neuen Antrag stellen' : 'New Application' }}
          </button>
        </div>
      </div>

      <!-- Admitted Children Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center mb-6">
          <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
            <GraduationCap class="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {{ language === 'de' ? 'Aufgenommene Kinder' : 'Admitted Children' }}
          </h2>
          <span class="ml-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm px-2 py-1 rounded-full">
            {{ admittedChildren.length }}
          </span>
        </div>

        <div v-if="admittedChildren.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="child in admittedChildren" 
            :key="child.id"
            class="border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10 rounded-xl p-6"
          >
            <div class="flex items-center mb-4">
              <img 
                :src="child.avatar" 
                :alt="child.name"
                class="h-12 w-12 rounded-full object-cover mr-4 ring-2 ring-green-200 dark:ring-green-700"
              />
              <div class="flex-1">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200">{{ child.name }}</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400">{{ child.studentId }}</p>
              </div>
              <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Check class="h-5 w-5 text-white" />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Klasse' : 'Class' }}</span>
                <span class="font-medium text-slate-800 dark:text-slate-200">{{ child.class }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Schuljahr' : 'Academic Year' }}</span>
                <span class="font-medium text-slate-800 dark:text-slate-200">{{ child.academicYear }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Aufgenommen am' : 'Admitted on' }}</span>
                <span class="font-medium text-green-600 dark:text-green-400">{{ formatDate(child.admissionDate) }}</span>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
              <button class="w-full text-sm text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 font-medium">
                {{ language === 'de' ? 'Details anzeigen' : 'View Details' }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <GraduationCap class="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p class="text-slate-600 dark:text-slate-400">
            {{ language === 'de' ? 'Keine aufgenommenen Kinder' : 'No admitted children' }}
          </p>
        </div>
      </div>

      <!-- Pending Applications Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center mb-6">
          <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
            <Clock class="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {{ language === 'de' ? 'Anträge in Bearbeitung' : 'Pending Applications' }}
          </h2>
          <span class="ml-3 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm px-2 py-1 rounded-full">
            {{ pendingApplications.length }}
          </span>
        </div>

        <div v-if="pendingApplications.length > 0" class="space-y-4">
          <div 
            v-for="application in pendingApplications" 
            :key="application.id"
            class="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-3">
                  <div class="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mr-3">
                    <User class="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-slate-800 dark:text-slate-200">{{ application.studentName }}</h3>
                    <p class="text-sm text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Antrag-ID:' : 'Application ID:' }} {{ application.applicationId }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Calendar class="h-4 w-4 mr-2" />
                    {{ language === 'de' ? 'Beantragt am:' : 'Applied on:' }} {{ formatDate(application.applicationDate) }}
                  </div>
                  <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <BookOpen class="h-4 w-4 mr-2" />
                    {{ language === 'de' ? 'Gewünschte Klasse:' : 'Requested Grade:' }} {{ application.requestedGrade }}
                  </div>
                  <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Clock class="h-4 w-4 mr-2" />
                    {{ language === 'de' ? 'Schuljahr:' : 'Academic Year:' }} {{ application.academicYear }}
                  </div>
                </div>

                <!-- Application Progress -->
                <div class="mb-4">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {{ language === 'de' ? 'Bearbeitungsfortschritt' : 'Application Progress' }}
                    </span>
                    <span class="text-sm text-slate-600 dark:text-slate-400">
                      {{ application.progress }}%
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      :class="getProgressColor(application.progress)" 
                      class="h-2 rounded-full transition-all duration-300" 
                      :style="{ width: application.progress + '%' }"
                    ></div>
                  </div>
                  <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>{{ application.currentStage }}</span>
                    <span>{{ application.nextStage || (language === 'de' ? 'Abgeschlossen' : 'Complete') }}</span>
                  </div>
                </div>

                <!-- Required Documents -->
                <div v-if="application.requiredDocuments?.length" class="mb-4">
                  <h4 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {{ language === 'de' ? 'Erforderliche Dokumente' : 'Required Documents' }}
                  </h4>
                  <div class="space-y-2">
                    <div 
                      v-for="doc in application.requiredDocuments" 
                      :key="doc.name"
                      class="flex items-center justify-between text-sm"
                    >
                      <span class="text-slate-600 dark:text-slate-400">{{ doc.name }}</span>
                      <div class="flex items-center">
                        <component 
                          :is="doc.status === 'submitted' ? Check : doc.status === 'pending' ? Clock : AlertTriangle" 
                          :class="getDocumentStatusColor(doc.status)"
                          class="h-4 w-4 mr-2"
                        />
                        <span :class="getDocumentStatusTextColor(doc.status)" class="text-xs font-medium">
                          {{ getDocumentStatusText(doc.status) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="ml-4">
                <span :class="getStatusColor(application.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ getStatusText(application.status) }}
                </span>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                {{ language === 'de' ? 'Details anzeigen' : 'View Details' }}
              </button>
              <button 
                v-if="application.status === 'documents_required'"
                class="px-4 py-2 text-sm bg-winschool-primary hover:bg-winschool-primary-dark dark:bg-indigo-600 dark:hover:bg-indigo-700 text-slate-800 dark:text-white rounded-lg transition-colors"
              >
                {{ language === 'de' ? 'Dokumente hochladen' : 'Upload Documents' }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <Clock class="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p class="text-slate-600 dark:text-slate-400">
            {{ language === 'de' ? 'Keine anhängigen Anträge' : 'No pending applications' }}
          </p>
          <button 
            @click="showApplicationForm = true"
            class="mt-4 text-winschool-primary hover:text-winschool-primary-dark dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            {{ language === 'de' ? 'Ersten Antrag stellen' : 'Submit your first application' }}
          </button>
        </div>
      </div>

      <!-- Application Form Modal -->
      <div v-if="showApplicationForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="showApplicationForm = false">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-800 dark:text-slate-200">
                {{ language === 'de' ? 'Neuer Schulantrag' : 'New School Application' }}
              </h3>
              <button @click="closeApplicationForm" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X class="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            
            <!-- Progress Indicator -->
            <div class="mt-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {{ language === 'de' ? 'Schritt' : 'Step' }} {{ currentStep }} {{ language === 'de' ? 'von' : 'of' }} {{ totalSteps }}
                </span>
                <span class="text-sm text-slate-600 dark:text-slate-400">
                  {{ Math.round((currentStep / totalSteps) * 100) }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  class="bg-winschool-primary dark:bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                  :style="{ width: (currentStep / totalSteps) * 100 + '%' }"
                ></div>
              </div>
              
              <!-- Step Indicators -->
              <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span :class="currentStep >= 1 ? 'text-winschool-primary dark:text-indigo-400 font-medium' : ''">
                  {{ language === 'de' ? 'Schüler' : 'Student' }}
                </span>
                <span :class="currentStep >= 2 ? 'text-winschool-primary dark:text-indigo-400 font-medium' : ''">
                  {{ language === 'de' ? 'Akademisch' : 'Academic' }}
                </span>
                <span :class="currentStep >= 3 ? 'text-winschool-primary dark:text-indigo-400 font-medium' : ''">
                  {{ language === 'de' ? 'Zusätzlich' : 'Additional' }}
                </span>
                <span :class="currentStep >= 4 ? 'text-winschool-primary dark:text-indigo-400 font-medium' : ''">
                  {{ language === 'de' ? 'Überprüfung' : 'Review' }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <form @submit.prevent="submitApplication" class="space-y-6">
              <!-- Step 1: Student Information -->
              <div v-show="currentStep === 1" class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                  <User class="h-5 w-5 mr-2" />
                  {{ language === 'de' ? 'Schülerinformationen' : 'Student Information' }}
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Vorname' : 'First Name' }} *
                    </label>
                    <input
                      v-model="applicationForm.student.firstName"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Nachname' : 'Last Name' }} *
                    </label>
                    <input
                      v-model="applicationForm.student.lastName"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Geburtsdatum' : 'Date of Birth' }} *
                    </label>
                    <input
                      v-model="applicationForm.student.dateOfBirth"
                      type="date"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Geschlecht' : 'Gender' }} *
                    </label>
                    <select
                      v-model="applicationForm.student.gender"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">{{ language === 'de' ? 'Auswählen' : 'Select' }}</option>
                      <option value="male">{{ language === 'de' ? 'Männlich' : 'Male' }}</option>
                      <option value="female">{{ language === 'de' ? 'Weiblich' : 'Female' }}</option>
                      <option value="other">{{ language === 'de' ? 'Andere' : 'Other' }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Nationalität' : 'Nationality' }} *
                    </label>
                    <input
                      v-model="applicationForm.student.nationality"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Geburtsort' : 'Place of Birth' }}
                    </label>
                    <input
                      v-model="applicationForm.student.placeOfBirth"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <!-- Step 2: Academic Information -->
              <div v-show="currentStep === 2" class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                  <BookOpen class="h-5 w-5 mr-2" />
                  {{ language === 'de' ? 'Akademische Informationen' : 'Academic Information' }}
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Gewünschte Klassenstufe' : 'Requested Grade Level' }} *
                    </label>
                    <select
                      v-model="applicationForm.academic.requestedGrade"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">{{ language === 'de' ? 'Auswählen' : 'Select Grade' }}</option>
                      <option v-for="grade in availableGrades" :key="grade" :value="grade">{{ grade }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Schuljahr' : 'Academic Year' }} *
                    </label>
                    <select
                      v-model="applicationForm.academic.academicYear"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">{{ language === 'de' ? 'Auswählen' : 'Select Year' }}</option>
                      <option value="2024-2025">2024-2025</option>
                      <option value="2025-2026">2025-2026</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Vorherige Schule' : 'Previous School' }}
                    </label>
                    <input
                      v-model="applicationForm.academic.previousSchool"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Gewünschter Starttermin' : 'Preferred Start Date' }} *
                    </label>
                    <input
                      v-model="applicationForm.academic.preferredStartDate"
                      type="date"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <!-- Step 3: Additional Information -->
              <div v-show="currentStep === 3" class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                  <FileText class="h-5 w-5 mr-2" />
                  {{ language === 'de' ? 'Zusätzliche Informationen' : 'Additional Information' }}
                </h4>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Besondere Bedürfnisse oder medizinische Hinweise' : 'Special Needs or Medical Notes' }}
                    </label>
                    <textarea
                      v-model="applicationForm.additional.specialNeeds"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      :placeholder="language === 'de' ? 'Beschreiben Sie alle besonderen Bedürfnisse...' : 'Describe any special needs...'"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Zusätzliche Kommentare' : 'Additional Comments' }}
                    </label>
                    <textarea
                      v-model="applicationForm.additional.comments"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      :placeholder="language === 'de' ? 'Weitere Informationen oder Fragen...' : 'Any additional information or questions...'"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Step 4: Review -->
              <div v-show="currentStep === 4" class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                  <Check class="h-5 w-5 mr-2" />
                  {{ language === 'de' ? 'Antrag überprüfen' : 'Review Application' }}
                </h4>
                
                <div class="space-y-6">
                  <!-- Student Information Review -->
                  <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h5 class="font-medium text-slate-800 dark:text-slate-200 mb-3">
                      {{ language === 'de' ? 'Schülerinformationen' : 'Student Information' }}
                    </h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span class="text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Name:' : 'Name:' }}</span>
                        <span class="ml-2 font-medium text-slate-800 dark:text-slate-200">
                          {{ applicationForm.student.firstName }} {{ applicationForm.student.lastName }}
                        </span>
                      </div>
                      <div>
                        <span class="text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Geburtsdatum:' : 'Date of Birth:' }}</span>
                        <span class="ml-2 font-medium text-slate-800 dark:text-slate-200">{{ applicationForm.student.dateOfBirth }}</span>
                      </div>
                      <div>
                        <span class="text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Geschlecht:' : 'Gender:' }}</span>
                        <span class="ml-2 font-medium text-slate-800 dark:text-slate-200">{{ applicationForm.student.gender }}</span>
                      </div>
                      <div>
                        <span class="text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Nationalität:' : 'Nationality:' }}</span>
                        <span class="ml-2 font-medium text-slate-800 dark:text-slate-200">{{ applicationForm.student.nationality }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Academic Information Review -->
                  <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h5 class="font-medium text-slate-800 dark:text-slate-200 mb-3">
                      {{ language === 'de' ? 'Akademische Informationen' : 'Academic Information' }}
                    </h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span class="text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Gewünschte Klasse:' : 'Requested Grade:' }}</span>
                        <span class="ml-2 font-medium text-slate-800 dark:text-slate-200">{{ applicationForm.academic.requestedGrade }}</span>
                      </div>
                      <div>
                        <span class="text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Schuljahr:' : 'Academic Year:' }}</span>
                        <span class="ml-2 font-medium text-slate-800 dark:text-slate-200">{{ applicationForm.academic.academicYear }}</span>
                      </div>
                      <div v-if="applicationForm.academic.previousSchool">
                        <span class="text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Vorherige Schule:' : 'Previous School:' }}</span>
                        <span class="ml-2 font-medium text-slate-800 dark:text-slate-200">{{ applicationForm.academic.previousSchool }}</span>
                      </div>
                      <div>
                        <span class="text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Startdatum:' : 'Start Date:' }}</span>
                        <span class="ml-2 font-medium text-slate-800 dark:text-slate-200">{{ applicationForm.academic.preferredStartDate }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Additional Information Review -->
                  <div v-if="applicationForm.additional.specialNeeds || applicationForm.additional.comments" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h5 class="font-medium text-slate-800 dark:text-slate-200 mb-3">
                      {{ language === 'de' ? 'Zusätzliche Informationen' : 'Additional Information' }}
                    </h5>
                    <div class="space-y-3 text-sm">
                      <div v-if="applicationForm.additional.specialNeeds">
                        <span class="text-slate-600 dark:text-slate-400 block mb-1">{{ language === 'de' ? 'Besondere Bedürfnisse:' : 'Special Needs:' }}</span>
                        <span class="text-slate-800 dark:text-slate-200">{{ applicationForm.additional.specialNeeds }}</span>
                      </div>
                      <div v-if="applicationForm.additional.comments">
                        <span class="text-slate-600 dark:text-slate-400 block mb-1">{{ language === 'de' ? 'Kommentare:' : 'Comments:' }}</span>
                        <span class="text-slate-800 dark:text-slate-200">{{ applicationForm.additional.comments }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Form Navigation -->
              <div class="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <button 
                  v-if="currentStep > 1"
                  type="button" 
                  @click="previousStep" 
                  class="px-6 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  {{ language === 'de' ? 'Zurück' : 'Previous' }}
                </button>
                <div v-else></div>

                <div class="flex space-x-3">
                  <button 
                    type="button" 
                    @click="closeApplicationForm" 
                    class="px-6 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
                  </button>
                  
                  <button 
                    v-if="currentStep < totalSteps"
                    type="button"
                    @click="nextStep" 
                    :disabled="!canProceedToNextStep"
                    class="px-6 py-2 text-sm bg-winschool-primary hover:bg-winschool-primary-dark dark:bg-indigo-600 dark:hover:bg-indigo-700 text-slate-800 dark:text-white rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ language === 'de' ? 'Weiter' : 'Next' }}
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                  
                  <button 
                    v-else
                    type="submit" 
                    class="px-6 py-2 text-sm bg-winschool-primary hover:bg-winschool-primary-dark dark:bg-indigo-600 dark:hover:bg-indigo-700 text-slate-800 dark:text-white rounded-lg transition-colors"
                  >
                    {{ language === 'de' ? 'Antrag einreichen' : 'Submit Application' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  UserPlus, 
  Plus, 
  GraduationCap, 
  Clock, 
  User, 
  Calendar, 
  BookOpen, 
  Check, 
  AlertTriangle, 
  FileText, 
  X 
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showApplicationForm = ref(false)

// Pagination state
const currentStep = ref(1)
const totalSteps = ref(4)

// Sample data for admitted children
const admittedChildren = ref([
  {
    id: 1,
    name: 'Emma Schmidt',
    studentId: 'ST2024001',
    class: '7A',
    academicYear: '2024-2025',
    admissionDate: '2024-08-15',
    avatar: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 2,
    name: 'Max Schmidt',
    studentId: 'ST2024002',
    class: '9B',
    academicYear: '2024-2025',
    admissionDate: '2024-08-15',
    avatar: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
])

// Sample data for pending applications
const pendingApplications = ref([
  {
    id: 3,
    applicationId: 'APP2024003',
    studentName: 'Lina Schmidt',
    requestedGrade: 'Grade 5',
    academicYear: '2025-2026',
    applicationDate: '2024-01-15',
    status: 'under_review',
    progress: 60,
    currentStage: language.value === 'de' ? 'Dokumentenprüfung' : 'Document Review',
    nextStage: language.value === 'de' ? 'Interview' : 'Interview',
    requiredDocuments: [
      { name: language.value === 'de' ? 'Geburtsurkunde' : 'Birth Certificate', status: 'submitted' },
      { name: language.value === 'de' ? 'Vorherige Zeugnisse' : 'Previous Report Cards', status: 'submitted' },
      { name: language.value === 'de' ? 'Impfnachweis' : 'Vaccination Records', status: 'pending' },
      { name: language.value === 'de' ? 'Passfoto' : 'Passport Photo', status: 'missing' }
    ]
  },
  {
    id: 4,
    applicationId: 'APP2024004',
    studentName: 'Tom Schmidt',
    requestedGrade: 'Grade 3',
    academicYear: '2025-2026',
    applicationDate: '2024-02-01',
    status: 'documents_required',
    progress: 25,
    currentStage: language.value === 'de' ? 'Dokumentensammlung' : 'Document Collection',
    nextStage: language.value === 'de' ? 'Erste Prüfung' : 'Initial Review',
    requiredDocuments: [
      { name: language.value === 'de' ? 'Geburtsurkunde' : 'Birth Certificate', status: 'submitted' },
      { name: language.value === 'de' ? 'Vorherige Zeugnisse' : 'Previous Report Cards', status: 'missing' },
      { name: language.value === 'de' ? 'Impfnachweis' : 'Vaccination Records', status: 'missing' }
    ]
  }
])

// Application form data
const applicationForm = ref({
  student: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    placeOfBirth: ''
  },
  academic: {
    requestedGrade: '',
    academicYear: '',
    previousSchool: '',
    preferredStartDate: ''
  },
  additional: {
    specialNeeds: '',
    comments: ''
  }
})

const availableGrades = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Grade 11', 'Grade 12'
]

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return language.value === 'de' 
    ? date.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const getStatusColor = (status: string) => {
  const colors = {
    'under_review': 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200',
    'documents_required': 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200',
    'interview_scheduled': 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200',
    'admitted': 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200',
    'rejected': 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
  }
  return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const getStatusText = (status: string) => {
  const texts = {
    en: {
      'under_review': 'Under Review',
      'documents_required': 'Documents Required',
      'interview_scheduled': 'Interview Scheduled',
      'admitted': 'Admitted',
      'rejected': 'Rejected'
    },
    de: {
      'under_review': 'In Prüfung',
      'documents_required': 'Dokumente erforderlich',
      'interview_scheduled': 'Interview geplant',
      'admitted': 'Aufgenommen',
      'rejected': 'Abgelehnt'
    }
  }
  return texts[language.value][status] || status
}

const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'bg-green-500'
  if (progress >= 60) return 'bg-blue-500'
  if (progress >= 40) return 'bg-yellow-500'
  return 'bg-orange-500'
}

const getDocumentStatusColor = (status: string) => {
  const colors = {
    'submitted': 'text-green-600 dark:text-green-400',
    'pending': 'text-yellow-600 dark:text-yellow-400',
    'missing': 'text-red-600 dark:text-red-400'
  }
  return colors[status] || 'text-gray-600 dark:text-gray-400'
}

const getDocumentStatusTextColor = (status: string) => {
  const colors = {
    'submitted': 'text-green-700 dark:text-green-300',
    'pending': 'text-yellow-700 dark:text-yellow-300',
    'missing': 'text-red-700 dark:text-red-300'
  }
  return colors[status] || 'text-gray-700 dark:text-gray-300'
}

const getDocumentStatusText = (status: string) => {
  const texts = {
    en: {
      'submitted': 'Submitted',
      'pending': 'Pending',
      'missing': 'Missing'
    },
    de: {
      'submitted': 'Eingereicht',
      'pending': 'Ausstehend',
      'missing': 'Fehlt'
    }
  }
  return texts[language.value][status] || status
}

// Form navigation methods
const nextStep = () => {
  if (currentStep.value < totalSteps.value && canProceedToNextStep.value) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const closeApplicationForm = () => {
  showApplicationForm.value = false
  currentStep.value = 1
  // Reset form data
  applicationForm.value = {
    student: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      placeOfBirth: ''
    },
    academic: {
      requestedGrade: '',
      academicYear: '',
      previousSchool: '',
      preferredStartDate: ''
    },
    additional: {
      specialNeeds: '',
      comments: ''
    }
  }
}

// Validation logic for each step
const canProceedToNextStep = computed(() => {
  switch (currentStep.value) {
    case 1: // Student Information
      return !!(
        applicationForm.value.student.firstName &&
        applicationForm.value.student.lastName &&
        applicationForm.value.student.dateOfBirth &&
        applicationForm.value.student.gender &&
        applicationForm.value.student.nationality
      )
    case 2: // Academic Information
      return !!(
        applicationForm.value.academic.requestedGrade &&
        applicationForm.value.academic.academicYear &&
        applicationForm.value.academic.preferredStartDate
      )
    case 3: // Additional Information (always valid, fields are optional)
      return true
    case 4: // Review (always valid if we got here)
      return true
    default:
      return false
  }
})

const submitApplication = () => {
  // Implementation for submitting new application
  console.log('Submitting application:', applicationForm.value)
  
  // Create new pending application
  const newApplication = {
    id: Date.now(),
    applicationId: `APP${new Date().getFullYear()}${String(Date.now()).slice(-3)}`,
    studentName: `${applicationForm.value.student.firstName} ${applicationForm.value.student.lastName}`,
    requestedGrade: applicationForm.value.academic.requestedGrade,
    academicYear: applicationForm.value.academic.academicYear,
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'documents_required',
    progress: 10,
    currentStage: language.value === 'de' ? 'Antrag eingereicht' : 'Application Submitted',
    nextStage: language.value === 'de' ? 'Dokumentensammlung' : 'Document Collection',
    requiredDocuments: [
      { name: language.value === 'de' ? 'Geburtsurkunde' : 'Birth Certificate', status: 'missing' },
      { name: language.value === 'de' ? 'Vorherige Zeugnisse' : 'Previous Report Cards', status: 'missing' },
      { name: language.value === 'de' ? 'Impfnachweis' : 'Vaccination Records', status: 'missing' },
      { name: language.value === 'de' ? 'Passfoto' : 'Passport Photo', status: 'missing' }
    ]
  }
  
  pendingApplications.value.unshift(newApplication)
  
  // Reset form and close modal using the existing method
  closeApplicationForm()
}
</script>
