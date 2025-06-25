<template>
  <div class="document-management bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Dokumentenverwaltung' : 'Document Management' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie Dokumente mit Versionskontrolle und Klassifizierung' : 'Manage documents with version control and classification' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <router-link
          to="/dashboard/support"
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <LifeBuoy class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Support' : 'Support' }}
        </router-link>
        <button @click="showUploadModal = true" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <UploadCloud class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Hochladen' : 'Upload' }}
        </button>
        <button @click="showClassificationModal = true" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Tags class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Klassifizierungen' : 'Classifications' }}
        </button>
        <button @click="showComplianceModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Shield class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Compliance' : 'Compliance' }}
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Document Search & Filters -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-400" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="language === 'de' ? 'Dokumente durchsuchen...' : 'Search documents...'"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50"
              />
            </div>
          </div>
          <select 
            v-model="selectedCategory"
            class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50"
          >
            <option value="">{{ language === 'de' ? 'Alle Kategorien' : 'All Categories' }}</option>
            <option v-for="category in documentCategories" :key="category" :value="category">{{ category }}</option>
          </select>
          <select 
            v-model="selectedClassification"
            class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50"
          >
            <option value="">{{ language === 'de' ? 'Alle Klassifizierungen' : 'All Classifications' }}</option>
            <option v-for="classification in documentClassifications" :key="classification.id" :value="classification.id">{{ classification.name }}</option>
          </select>
        </div>
      </div>

      <!-- Document Library -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Dokumentenbibliothek' : 'Document Library' }}
        </h2>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-700">
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Dokument' : 'Document' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Kategorie' : 'Category' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Klassifizierung' : 'Classification' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Hochgeladen von' : 'Uploaded By' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Letzte Änderung' : 'Last Modified' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="document in filteredDocuments" :key="document.id" class="border-b border-gray-100 dark:border-slate-700">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <component :is="getDocumentIcon(document.type)" class="h-5 w-5 text-gray-400 dark:text-slate-400 mr-3" />
                    <div>
                      <p class="font-medium text-gray-900 dark:text-slate-50">{{ document.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-slate-400">{{ document.size }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-900 dark:text-slate-50">{{ document.category }}</td>
                <td class="py-3 px-4">
                  <span :class="getClassificationColor(document.classification)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getClassificationName(document.classification) }}
                  </span>
                </td>
                <td class="py-3 px-4 text-gray-900 dark:text-slate-50">{{ document.uploadedBy }}</td>
                <td class="py-3 px-4 text-gray-600 dark:text-slate-400">
                  <div>
                    <p>{{ document.lastModified }}</p>
                    <p class="text-xs">{{ language === 'de' ? 'Version' : 'Version' }} {{ document.version }}</p>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="viewDocument(document)" class="text-primary-600 hover:text-primary-800">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="downloadDocument(document)" class="text-secondary-600 hover:text-secondary-800">
                      <Download class="h-4 w-4" />
                    </button>
                    <button @click="showVersionHistory(document)" class="text-blue-600 hover:text-blue-800">
                      <History class="h-4 w-4" />
                    </button>
                    <button @click="showMoreOptions(document)" class="text-gray-600 hover:text-gray-800">
                      <MoreVertical class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Document Version Control -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Activity -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4">
            {{ language === 'de' ? 'Letzte Aktivitäten' : 'Recent Activity' }}
          </h3>
          <div class="space-y-4">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                <component :is="getActivityIcon(activity.action)" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-slate-50">{{ activity.user }}</p>
                    <p class="text-sm text-gray-600 dark:text-slate-400">{{ activity.action }} <span class="font-medium">{{ activity.document }}</span></p>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-slate-400">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Document Statistics -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4">
            {{ language === 'de' ? 'Dokumentenstatistik' : 'Document Statistics' }}
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <h4 class="font-medium text-gray-900 dark:text-slate-50 mb-2">
                {{ language === 'de' ? 'Nach Kategorie' : 'By Category' }}
              </h4>
              <div class="space-y-2">
                <div v-for="stat in categoryStats" :key="stat.category" class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 dark:text-slate-400">{{ stat.category }}</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-slate-50">{{ stat.count }}</span>
                </div>
              </div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <h4 class="font-medium text-gray-900 dark:text-slate-50 mb-2">
                {{ language === 'de' ? 'Nach Klassifizierung' : 'By Classification' }}
              </h4>
              <div class="space-y-2">
                <div v-for="stat in classificationStats" :key="stat.classification" class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 dark:text-slate-400">{{ stat.classification }}</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-slate-50">{{ stat.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Dokument hochladen' : 'Upload Document' }}
            </h3>
            <button @click="showUploadModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="uploadDocument" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Datei auswählen' : 'Select File' }}
              </label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div class="flex flex-col items-center justify-center pt-7">
                    <UploadCloud class="w-8 h-8 text-gray-400" />
                    <p class="pt-1 text-sm text-gray-600 dark:text-gray-400">
                      {{ language === 'de' ? 'Datei hierher ziehen oder klicken' : 'Drag file here or click to upload' }}
                    </p>
                  </div>
                  <input type="file" class="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Dokumentname' : 'Document Name' }}
              </label>
              <input
                v-model="uploadForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Kategorie' : 'Category' }}
              </label>
              <select
                v-model="uploadForm.category"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Kategorie wählen' : 'Select Category' }}</option>
                <option v-for="category in documentCategories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Klassifizierung' : 'Classification' }}
              </label>
              <select
                v-model="uploadForm.classification"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Klassifizierung wählen' : 'Select Classification' }}</option>
                <option v-for="classification in documentClassifications" :key="classification.id" :value="classification.id">{{ classification.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea
                v-model="uploadForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showUploadModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Hochladen' : 'Upload' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Classification Modal -->
    <div v-if="showClassificationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Dokumentenklassifizierungen verwalten' : 'Manage Document Classifications' }}
            </h3>
            <button @click="showClassificationModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-4">
            <div v-for="classification in documentClassifications" :key="classification.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white flex items-center">
                    <span :class="getClassificationColor(classification.id)" class="w-3 h-3 rounded-full mr-2"></span>
                    {{ classification.name }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ classification.description }}</p>
                </div>
                <div class="flex space-x-2">
                  <button @click="editClassification(classification)" class="text-primary-600 hover:text-primary-800">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="deleteClassification(classification)" class="text-red-600 hover:text-red-800">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <p>{{ language === 'de' ? 'Zugriffsebene:' : 'Access Level:' }} {{ classification.accessLevel }}</p>
                <p>{{ language === 'de' ? 'Aufbewahrungsfrist:' : 'Retention Period:' }} {{ classification.retentionPeriod }}</p>
              </div>
            </div>
            <button @click="addClassification" class="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:text-gray-700">
              {{ language === 'de' ? 'Neue Klassifizierung hinzufügen' : 'Add New Classification' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Compliance Modal -->
    <div v-if="showComplianceModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Compliance-Dokumentation' : 'Compliance Documentation' }}
            </h3>
            <button @click="showComplianceModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- Compliance Status -->
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div class="flex items-center mb-2">
                <CheckCircle class="h-5 w-5 text-green-600 mr-2" />
                <h4 class="font-medium text-green-800 dark:text-green-200">
                  {{ language === 'de' ? 'Compliance-Status: Konform' : 'Compliance Status: Compliant' }}
                </h4>
              </div>
              <p class="text-sm text-green-600 dark:text-green-300">
                {{ language === 'de' ? 'Alle erforderlichen Dokumente sind vorhanden und aktuell.' : 'All required documents are present and up to date.' }}
              </p>
            </div>

            <!-- Required Documents -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Erforderliche Dokumente' : 'Required Documents' }}
              </h4>
              <div class="space-y-3">
                <div v-for="doc in requiredDocuments" :key="doc.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{{ doc.name }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ doc.description }}</p>
                    </div>
                    <span :class="getComplianceStatusColor(doc.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ doc.status }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-gray-500 dark:text-gray-500">
                      {{ language === 'de' ? 'Letzte Aktualisierung:' : 'Last Updated:' }} {{ doc.lastUpdated }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-500">
                      {{ language === 'de' ? 'Nächste Überprüfung:' : 'Next Review:' }} {{ doc.nextReview }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Compliance Reports -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Compliance-Berichte' : 'Compliance Reports' }}
              </h4>
              <div class="space-y-3">
                <div v-for="report in complianceReports" :key="report.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{{ report.name }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ report.description }}</p>
                    </div>
                    <button @click="downloadReport(report)" class="text-primary-600 hover:text-primary-800">
                      <Download class="h-4 w-4" />
                    </button>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {{ language === 'de' ? 'Generiert am:' : 'Generated on:' }} {{ report.date }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Version History Modal -->
    <div v-if="showVersionHistoryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Versionsverlauf' : 'Version History' }}: {{ selectedDocument?.name }}
            </h3>
            <button @click="showVersionHistoryModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-4">
            <div v-for="version in documentVersions" :key="version.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Version' : 'Version' }} {{ version.version }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ version.changes }}</p>
                </div>
                <span :class="version.current ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ version.current ? (language === 'de' ? 'Aktuell' : 'Current') : '' }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <div class="text-xs text-gray-500 dark:text-gray-500">
                  <p>{{ language === 'de' ? 'Geändert von' : 'Modified by' }}: {{ version.modifiedBy }}</p>
                  <p>{{ language === 'de' ? 'Datum' : 'Date' }}: {{ version.date }}</p>
                </div>
                <div class="flex space-x-2">
                  <button @click="viewVersion(version)" class="text-primary-600 hover:text-primary-800">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="restoreVersion(version)" :disabled="version.current" :class="version.current ? 'opacity-50 cursor-not-allowed' : ''" class="text-secondary-600 hover:text-secondary-800">
                    <RotateCcw class="h-4 w-4" />
                  </button>
                  <button @click="downloadVersion(version)" class="text-blue-600 hover:text-blue-800">
                    <Download class="h-4 w-4" />
                  </button>
                </div>
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
import { UploadCloud, Tags, Shield, Search, Eye, Download, History, MoreVertical, X, Edit, Trash2, FileText, File as FilePdf, FileImage, FileSpreadsheet, CheckCircle, RotateCcw, Copy, Upload, LifeBuoy } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showUploadModal = ref(false)
const showClassificationModal = ref(false)
const showComplianceModal = ref(false)
const showVersionHistoryModal = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedClassification = ref('')
const selectedDocument = ref<any>(null)

const documentCategories = [
  'Administrative',
  'Academic',
  'Financial',
  'Legal',
  'Student Records',
  'HR Documents',
  'Policies & Procedures'
]

const documentClassifications = ref([
  {
    id: 1,
    name: 'Public',
    description: 'Documents that can be shared with anyone',
    accessLevel: 'All Users',
    retentionPeriod: 'Indefinite',
    color: 'bg-green-500'
  },
  {
    id: 2,
    name: 'Internal',
    description: 'Documents for internal use only',
    accessLevel: 'Staff Only',
    retentionPeriod: '5 Years',
    color: 'bg-blue-500'
  },
  {
    id: 3,
    name: 'Confidential',
    description: 'Sensitive information with restricted access',
    accessLevel: 'Management Only',
    retentionPeriod: '7 Years',
    color: 'bg-yellow-500'
  },
  {
    id: 4,
    name: 'Restricted',
    description: 'Highly sensitive information with very limited access',
    accessLevel: 'Administrators Only',
    retentionPeriod: '10 Years',
    color: 'bg-red-500'
  }
])

const documents = ref([
  {
    id: 1,
    name: 'School Policy Handbook.pdf',
    type: 'pdf',
    category: 'Policies & Procedures',
    classification: 1,
    size: '2.4 MB',
    uploadedBy: 'Admin',
    lastModified: '2024-03-10',
    version: '1.2'
  },
  {
    id: 2,
    name: 'Student Records Template.xlsx',
    type: 'spreadsheet',
    category: 'Student Records',
    classification: 2,
    size: '1.8 MB',
    uploadedBy: 'Admin',
    lastModified: '2024-03-08',
    version: '2.0'
  },
  {
    id: 3,
    name: 'Financial Report Q1 2024.pdf',
    type: 'pdf',
    category: 'Financial',
    classification: 3,
    size: '3.2 MB',
    uploadedBy: 'Finance Manager',
    lastModified: '2024-03-05',
    version: '1.0'
  },
  {
    id: 4,
    name: 'Staff Handbook.docx',
    type: 'document',
    category: 'HR Documents',
    classification: 2,
    size: '1.5 MB',
    uploadedBy: 'HR Manager',
    lastModified: '2024-03-01',
    version: '2.3'
  },
  {
    id: 5,
    name: 'GDPR Compliance Documentation.pdf',
    type: 'pdf',
    category: 'Legal',
    classification: 4,
    size: '4.7 MB',
    uploadedBy: 'Data Protection Officer',
    lastModified: '2024-02-28',
    version: '1.1'
  }
])

const filteredDocuments = computed(() => {
  let filtered = documents.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(doc => 
      doc.name.toLowerCase().includes(query) || 
      doc.category.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(doc => doc.category === selectedCategory.value)
  }

  if (selectedClassification.value) {
    filtered = filtered.filter(doc => doc.classification === parseInt(selectedClassification.value))
  }

  return filtered
})

const recentActivity = ref([
  {
    id: 1,
    user: 'Admin',
    action: 'uploaded',
    document: 'School Policy Handbook.pdf',
    time: '2 hours ago'
  },
  {
    id: 2,
    user: 'Finance Manager',
    action: 'updated',
    document: 'Financial Report Q1 2024.pdf',
    time: '5 hours ago'
  },
  {
    id: 3,
    user: 'HR Manager',
    action: 'downloaded',
    document: 'Staff Handbook.docx',
    time: '1 day ago'
  },
  {
    id: 4,
    user: 'Data Protection Officer',
    action: 'updated',
    document: 'GDPR Compliance Documentation.pdf',
    time: '2 days ago'
  }
])

const categoryStats = [
  { category: 'Administrative', count: 12 },
  { category: 'Academic', count: 24 },
  { category: 'Financial', count: 18 },
  { category: 'Legal', count: 8 },
  { category: 'Student Records', count: 45 }
]

const classificationStats = [
  { classification: 'Public', count: 32 },
  { classification: 'Internal', count: 48 },
  { classification: 'Confidential', count: 22 },
  { classification: 'Restricted', count: 5 }
]

const uploadForm = ref({
  name: '',
  category: '',
  classification: '',
  description: ''
})

const documentVersions = ref([
  {
    id: 1,
    version: '1.2',
    changes: 'Updated policy section 3.4 regarding student attendance',
    modifiedBy: 'Admin',
    date: '2024-03-10',
    current: true
  },
  {
    id: 2,
    version: '1.1',
    changes: 'Fixed formatting issues and typos',
    modifiedBy: 'Admin',
    date: '2024-02-15',
    current: false
  },
  {
    id: 3,
    version: '1.0',
    changes: 'Initial document creation',
    modifiedBy: 'Admin',
    date: '2024-01-20',
    current: false
  }
])

const requiredDocuments = ref([
  {
    id: 1,
    name: 'Data Protection Policy',
    description: 'GDPR compliance documentation',
    status: 'Up to date',
    lastUpdated: '2024-02-28',
    nextReview: '2025-02-28'
  },
  {
    id: 2,
    name: 'Privacy Notices',
    description: 'Student and staff privacy notices',
    status: 'Up to date',
    lastUpdated: '2024-01-15',
    nextReview: '2025-01-15'
  },
  {
    id: 3,
    name: 'Data Processing Agreements',
    description: 'Agreements with third-party processors',
    status: 'Review needed',
    lastUpdated: '2023-06-10',
    nextReview: '2024-06-10'
  },
  {
    id: 4,
    name: 'Data Breach Response Plan',
    description: 'Procedures for handling data breaches',
    status: 'Up to date',
    lastUpdated: '2024-03-05',
    nextReview: '2025-03-05'
  }
])

const complianceReports = ref([
  {
    id: 1,
    name: 'Annual GDPR Compliance Report',
    description: 'Overview of GDPR compliance status',
    date: '2024-01-15'
  },
  {
    id: 2,
    name: 'Data Protection Impact Assessment',
    description: 'Assessment of new student management system',
    date: '2023-11-20'
  },
  {
    id: 3,
    name: 'Data Subject Rights Audit',
    description: 'Audit of data subject request handling',
    date: '2023-09-05'
  }
])

const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return FilePdf
    case 'image':
      return FileImage
    case 'spreadsheet':
      return FileSpreadsheet
    default:
      return FileText
  }
}

const getClassificationColor = (id: number) => {
  const classification = documentClassifications.value.find(c => c.id === id)
  switch (id) {
    case 1: // Public
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 2: // Internal
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 3: // Confidential
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 4: // Restricted
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getClassificationName = (id: number) => {
  const classification = documentClassifications.value.find(c => c.id === id)
  return classification ? classification.name : ''
}

const getActivityIcon = (action: string) => {
  switch (action) {
    case 'uploaded':
      return Upload
    case 'updated':
      return Edit
    case 'downloaded':
      return Download
    default:
      return FileText
  }
}

const getComplianceStatusColor = (status: string) => {
  switch (status) {
    case 'Up to date':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Review needed':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Expired':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const viewDocument = (document: any) => {
  alert(`${language.value === 'de' ? 'Dokument anzeigen' : 'View document'}: ${document.name}`)
}

const downloadDocument = (document: any) => {
  alert(`${language.value === 'de' ? 'Dokument herunterladen' : 'Download document'}: ${document.name}`)
}

const showVersionHistory = (document: any) => {
  selectedDocument.value = document
  showVersionHistoryModal.value = true
}

const showMoreOptions = (document: any) => {
  alert(`${language.value === 'de' ? 'Weitere Optionen für' : 'More options for'}: ${document.name}`)
}

const uploadDocument = () => {
  alert(language.value === 'de' ? 'Dokument wird hochgeladen...' : 'Uploading document...')
  showUploadModal.value = false
}

const editClassification = (classification: any) => {
  alert(`${language.value === 'de' ? 'Klassifizierung bearbeiten' : 'Edit classification'}: ${classification.name}`)
}

const deleteClassification = (classification: any) => {
  alert(`${language.value === 'de' ? 'Klassifizierung löschen' : 'Delete classification'}: ${classification.name}`)
}

const addClassification = () => {
  alert(language.value === 'de' ? 'Neue Klassifizierung hinzufügen' : 'Add new classification')
}

const downloadReport = (report: any) => {
  alert(`${language.value === 'de' ? 'Bericht herunterladen' : 'Download report'}: ${report.name}`)
}

const viewVersion = (version: any) => {
  alert(`${language.value === 'de' ? 'Version anzeigen' : 'View version'}: ${version.version}`)
}

const restoreVersion = (version: any) => {
  alert(`${language.value === 'de' ? 'Version wiederherstellen' : 'Restore version'}: ${version.version}`)
}

const downloadVersion = (version: any) => {
  alert(`${language.value === 'de' ? 'Version herunterladen' : 'Download version'}: ${version.version}`)
}
</script>
