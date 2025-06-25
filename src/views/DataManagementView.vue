<template>
  <div class="space-y-6">
    <!-- Page Title Section -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Datenmanagement & Wartung' : 'Data Management & Maintenance' }}
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Zentrale Datenverwaltung mit Import/Export und DSGVO-Tools' : 'Centralized data management with import/export and GDPR tools' }}
        </p>
      </div>
      <div class="flex space-x-2">
        <button @click="showImportExport = true" class="btn-secondary flex items-center" style="font-family: Inter, sans-serif;">
          <Upload class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Import/Export' : 'Import/Export' }}
        </button>
        <button @click="showAuditTrail = true" class="btn-secondary flex items-center" style="font-family: Inter, sans-serif;">
          <FileText class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Audit-Log' : 'Audit Trail' }}
        </button>
        <button @click="showGDPRTools = true" class="btn-primary flex items-center" style="font-family: Inter, sans-serif;">
          <Shield class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'DSGVO-Tools' : 'GDPR Tools' }}
        </button>
      </div>
    </div>

    <!-- Data Overview Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="stat in dataStats" :key="stat.title" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div :class="stat.iconBg" class="p-3 rounded-lg">
            <component :is="stat.icon" class="h-6 w-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.title }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
            <p :class="stat.changeColor" class="text-sm">{{ stat.change }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Centralized Data Editor -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Zentrale Datenbearbeitung' : 'Centralized Data Editor' }}
        </h2>
        <div class="flex space-x-2">
          <select v-model="selectedDataType" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
            <option value="students">{{ language === 'de' ? 'Schüler' : 'Students' }}</option>
            <option value="teachers">{{ language === 'de' ? 'Lehrer' : 'Teachers' }}</option>
            <option value="classes">{{ language === 'de' ? 'Klassen' : 'Classes' }}</option>
            <option value="subjects">{{ language === 'de' ? 'Fächer' : 'Subjects' }}</option>
            <option value="rooms">{{ language === 'de' ? 'Räume' : 'Rooms' }}</option>
          </select>
          <button @click="addNewRecord" class="btn-primary text-sm">
            {{ language === 'de' ? 'Neuer Datensatz' : 'New Record' }}
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th v-for="column in getColumns(selectedDataType)" :key="column" class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ column }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in getCurrentData()" :key="record.id" class="border-b border-gray-100 dark:border-gray-700">
              <td v-for="column in getColumns(selectedDataType)" :key="column" class="py-3 px-4 text-gray-900 dark:text-white">
                {{ getFieldValue(record, column) }}
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="editRecord(record)" class="text-primary-600 hover:text-primary-800">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="duplicateRecord(record)" class="text-secondary-600 hover:text-secondary-800">
                    <Copy class="h-4 w-4" />
                  </button>
                  <button @click="deleteRecord(record)" class="text-red-600 hover:text-red-800">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Category Editors -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Subjects Editor -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ language === 'de' ? 'Fächer verwalten' : 'Manage Subjects' }}
        </h3>
        <div class="space-y-3">
          <div v-for="subject in subjects" :key="subject.id" class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ subject.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ subject.code }}</p>
            </div>
            <div class="flex space-x-2">
              <button @click="editSubject(subject)" class="text-primary-600 hover:text-primary-800">
                <Edit class="h-4 w-4" />
              </button>
              <button @click="deleteSubject(subject)" class="text-red-600 hover:text-red-800">
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
          <button @click="addSubject" class="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:text-gray-700">
            {{ language === 'de' ? 'Fach hinzufügen' : 'Add Subject' }}
          </button>
        </div>
      </div>

      <!-- Room Types Editor -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ language === 'de' ? 'Raumtypen verwalten' : 'Manage Room Types' }}
        </h3>
        <div class="space-y-3">
          <div v-for="roomType in roomTypes" :key="roomType.id" class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ roomType.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ roomType.capacity }} {{ language === 'de' ? 'Plätze' : 'seats' }}</p>
            </div>
            <div class="flex space-x-2">
              <button @click="editRoomType(roomType)" class="text-primary-600 hover:text-primary-800">
                <Edit class="h-4 w-4" />
              </button>
              <button @click="deleteRoomType(roomType)" class="text-red-600 hover:text-red-800">
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
          <button @click="addRoomType" class="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:text-gray-700">
            {{ language === 'de' ? 'Raumtyp hinzufügen' : 'Add Room Type' }}
          </button>
        </div>
      </div>

      <!-- Term/Year Management -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ language === 'de' ? 'Semester/Jahr verwalten' : 'Term/Year Management' }}
        </h3>
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 class="font-medium text-blue-800 dark:text-blue-200">
              {{ language === 'de' ? 'Aktuelles Schuljahr' : 'Current School Year' }}
            </h4>
            <p class="text-blue-600 dark:text-blue-300">2023/2024</p>
            <p class="text-sm text-blue-500 dark:text-blue-400">
              {{ language === 'de' ? 'Endet am 31. Juli 2024' : 'Ends on July 31, 2024' }}
            </p>
          </div>
          <button @click="showTermWizard = true" class="w-full btn-primary">
            {{ language === 'de' ? 'Schuljahr-Wechsel-Assistent' : 'Year Change Wizard' }}
          </button>
          <button @click="archiveCurrentYear" class="w-full btn-secondary">
            {{ language === 'de' ? 'Jahr archivieren' : 'Archive Year' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Merge Tool -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {{ language === 'de' ? 'Duplikat-Zusammenführung' : 'Duplicate Merge Tool' }}
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Potential Duplicates -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Potenzielle Duplikate' : 'Potential Duplicates' }}
          </h3>
          <div class="space-y-3">
            <div v-for="duplicate in potentialDuplicates" :key="duplicate.id" class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ duplicate.type }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ duplicate.count }} {{ language === 'de' ? 'Datensätze' : 'records' }}</p>
                </div>
                <span class="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200 rounded-full">
                  {{ duplicate.similarity }}% {{ language === 'de' ? 'Ähnlichkeit' : 'similarity' }}
                </span>
              </div>
              <button @click="mergeDuplicates(duplicate)" class="w-full mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200 rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-700">
                {{ language === 'de' ? 'Zusammenführen' : 'Merge' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Merge Preview -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Zusammenführungs-Vorschau' : 'Merge Preview' }}
          </h3>
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div v-if="selectedDuplicate" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="p-3 bg-white dark:bg-gray-600 rounded-lg">
                  <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ language === 'de' ? 'Original' : 'Original' }}</h4>
                  <div v-for="(value, key) in selectedDuplicate.original" :key="key" class="text-sm">
                    <span class="text-gray-600 dark:text-gray-400">{{ key }}:</span>
                    <span class="text-gray-900 dark:text-white ml-1">{{ value }}</span>
                  </div>
                </div>
                <div class="p-3 bg-white dark:bg-gray-600 rounded-lg">
                  <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ language === 'de' ? 'Duplikat' : 'Duplicate' }}</h4>
                  <div v-for="(value, key) in selectedDuplicate.duplicate" :key="key" class="text-sm">
                    <span class="text-gray-600 dark:text-gray-400">{{ key }}:</span>
                    <span class="text-gray-900 dark:text-white ml-1">{{ value }}</span>
                  </div>
                </div>
              </div>
              <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 class="font-medium text-green-800 dark:text-green-200 mb-2">{{ language === 'de' ? 'Zusammengeführtes Ergebnis' : 'Merged Result' }}</h4>
                <div v-for="(value, key) in selectedDuplicate.merged" :key="key" class="text-sm">
                  <span class="text-gray-600 dark:text-gray-400">{{ key }}:</span>
                  <span class="text-gray-900 dark:text-white ml-1">{{ value }}</span>
                </div>
              </div>
              <div class="flex justify-end space-x-2">
                <button @click="cancelMerge" class="btn-secondary text-sm">
                  {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
                </button>
                <button @click="confirmMerge" class="btn-primary text-sm">
                  {{ language === 'de' ? 'Zusammenführen' : 'Merge' }}
                </button>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
              {{ language === 'de' ? 'Wählen Sie Duplikate zum Zusammenführen aus' : 'Select duplicates to merge' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Import/Export Modal -->
    <div v-if="showImportExport" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Daten importieren/exportieren' : 'Import/Export Data' }}
            </h3>
            <button @click="showImportExport = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- Export Section -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Daten exportieren' : 'Export Data' }}
              </h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Datentyp' : 'Data Type' }}
                  </label>
                  <select v-model="exportSettings.dataType" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <option value="all">{{ language === 'de' ? 'Alle Daten' : 'All Data' }}</option>
                    <option value="students">{{ language === 'de' ? 'Schüler' : 'Students' }}</option>
                    <option value="teachers">{{ language === 'de' ? 'Lehrer' : 'Teachers' }}</option>
                    <option value="classes">{{ language === 'de' ? 'Klassen' : 'Classes' }}</option>
                    <option value="timetable">{{ language === 'de' ? 'Stundenplan' : 'Timetable' }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Format' : 'Format' }}
                  </label>
                  <div class="flex space-x-2">
                    <label class="flex items-center">
                      <input type="radio" v-model="exportSettings.format" value="csv" class="mr-2">
                      <span class="text-sm text-gray-900 dark:text-white">CSV</span>
                    </label>
                    <label class="flex items-center">
                      <input type="radio" v-model="exportSettings.format" value="xml" class="mr-2">
                      <span class="text-sm text-gray-900 dark:text-white">XML</span>
                    </label>
                    <label class="flex items-center">
                      <input type="radio" v-model="exportSettings.format" value="json" class="mr-2">
                      <span class="text-sm text-gray-900 dark:text-white">JSON</span>
                    </label>
                  </div>
                </div>
                <button @click="exportData" class="w-full btn-primary">
                  {{ language === 'de' ? 'Daten exportieren' : 'Export Data' }}
                </button>
              </div>
            </div>

            <!-- Import Section -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Daten importieren' : 'Import Data' }}
              </h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Datei hochladen' : 'Upload File' }}
                  </label>
                  <div class="flex items-center justify-center w-full">
                    <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div class="flex flex-col items-center justify-center pt-7">
                        <Upload class="w-8 h-8 text-gray-400" />
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
                    {{ language === 'de' ? 'Import-Optionen' : 'Import Options' }}
                  </label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input type="checkbox" v-model="importSettings.overwrite" class="mr-2">
                      <span class="text-sm text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Bestehende Daten überschreiben' : 'Overwrite existing data' }}
                      </span>
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox" v-model="importSettings.validateBeforeImport" class="mr-2">
                      <span class="text-sm text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Vor Import validieren' : 'Validate before import' }}
                      </span>
                    </label>
                  </div>
                </div>
                <button @click="importData" class="w-full btn-primary">
                  {{ language === 'de' ? 'Daten importieren' : 'Import Data' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Audit Trail Modal -->
    <div v-if="showAuditTrail" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Audit-Trail' : 'Audit Trail' }}
            </h3>
            <button @click="showAuditTrail = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div class="flex space-x-2">
                <select v-model="auditFilters.dataType" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                  <option value="">{{ language === 'de' ? 'Alle Datentypen' : 'All Data Types' }}</option>
                  <option value="students">{{ language === 'de' ? 'Schüler' : 'Students' }}</option>
                  <option value="teachers">{{ language === 'de' ? 'Lehrer' : 'Teachers' }}</option>
                  <option value="classes">{{ language === 'de' ? 'Klassen' : 'Classes' }}</option>
                </select>
                <select v-model="auditFilters.action" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                  <option value="">{{ language === 'de' ? 'Alle Aktionen' : 'All Actions' }}</option>
                  <option value="create">{{ language === 'de' ? 'Erstellen' : 'Create' }}</option>
                  <option value="update">{{ language === 'de' ? 'Aktualisieren' : 'Update' }}</option>
                  <option value="delete">{{ language === 'de' ? 'Löschen' : 'Delete' }}</option>
                </select>
              </div>
              <button @click="exportAuditTrail" class="btn-secondary text-sm">
                {{ language === 'de' ? 'Exportieren' : 'Export' }}
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Datum/Zeit' : 'Date/Time' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Benutzer' : 'User' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Aktion' : 'Action' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Datentyp' : 'Data Type' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Details' : 'Details' }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="entry in filteredAuditEntries" :key="entry.id" class="border-b border-gray-100 dark:border-gray-700">
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ entry.timestamp }}</td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ entry.user }}</td>
                    <td class="py-3 px-4">
                      <span :class="getActionColor(entry.action)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ entry.action }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-gray-900 dark:text-white">{{ entry.dataType }}</td>
                    <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ entry.details }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- GDPR Tools Modal -->
    <div v-if="showGDPRTools" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'DSGVO-Compliance-Tools' : 'GDPR Compliance Tools' }}
            </h3>
            <button @click="showGDPRTools = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- Data Subject Search -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Betroffene Person suchen' : 'Search Data Subject' }}
              </h4>
              <div class="flex space-x-2">
                <input 
                  v-model="gdprSearch"
                  type="text"
                  :placeholder="language === 'de' ? 'Name oder ID eingeben...' : 'Enter name or ID...'"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
                <button @click="searchDataSubject" class="btn-primary">
                  {{ language === 'de' ? 'Suchen' : 'Search' }}
                </button>
              </div>
            </div>

            <!-- GDPR Actions -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h5 class="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  {{ language === 'de' ? 'Datenauskunft' : 'Data Access Request' }}
                </h5>
                <p class="text-sm text-blue-600 dark:text-blue-300 mb-3">
                  {{ language === 'de' ? 'Alle Daten zu einer Person exportieren' : 'Export all data related to a person' }}
                </p>
                <button @click="generateDataAccessReport" class="w-full px-3 py-2 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-700">
                  {{ language === 'de' ? 'Bericht generieren' : 'Generate Report' }}
                </button>
              </div>

              <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h5 class="font-medium text-red-800 dark:text-red-200 mb-2">
                  {{ language === 'de' ? 'Recht auf Vergessenwerden' : 'Right to be Forgotten' }}
                </h5>
                <p class="text-sm text-red-600 dark:text-red-300 mb-3">
                  {{ language === 'de' ? 'Personenbezogene Daten löschen' : 'Delete personal data' }}
                </p>
                <button @click="showDeleteConfirmation = true" class="w-full px-3 py-2 bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200 rounded text-sm hover:bg-red-200 dark:hover:bg-red-700">
                  {{ language === 'de' ? 'Daten löschen' : 'Delete Data' }}
                </button>
              </div>

              <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h5 class="font-medium text-green-800 dark:text-green-200 mb-2">
                  {{ language === 'de' ? 'Daten anonymisieren' : 'Anonymize Data' }}
                </h5>
                <p class="text-sm text-green-600 dark:text-green-300 mb-3">
                  {{ language === 'de' ? 'Personenbezogene Daten anonymisieren' : 'Anonymize personal data' }}
                </p>
                <button @click="anonymizeData" class="w-full px-3 py-2 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 rounded text-sm hover:bg-green-200 dark:hover:bg-green-700">
                  {{ language === 'de' ? 'Anonymisieren' : 'Anonymize' }}
                </button>
              </div>

              <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h5 class="font-medium text-purple-800 dark:text-purple-200 mb-2">
                  {{ language === 'de' ? 'Datenkorrektur' : 'Data Rectification' }}
                </h5>
                <p class="text-sm text-purple-600 dark:text-purple-300 mb-3">
                  {{ language === 'de' ? 'Falsche personenbezogene Daten korrigieren' : 'Correct inaccurate personal data' }}
                </p>
                <button @click="rectifyData" class="w-full px-3 py-2 bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200 rounded text-sm hover:bg-purple-200 dark:hover:bg-purple-700">
                  {{ language === 'de' ? 'Daten korrigieren' : 'Rectify Data' }}
                </button>
              </div>
            </div>

            <!-- Data Retention Policy -->
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                {{ language === 'de' ? 'Datenspeicherungsrichtlinie' : 'Data Retention Policy' }}
              </h4>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Schülerdaten' : 'Student Data' }}</span>
                  <span class="text-gray-900 dark:text-white">5 {{ language === 'de' ? 'Jahre' : 'years' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Lehrerdaten' : 'Teacher Data' }}</span>
                  <span class="text-gray-900 dark:text-white">10 {{ language === 'de' ? 'Jahre' : 'years' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Finanzdaten' : 'Financial Data' }}</span>
                  <span class="text-gray-900 dark:text-white">7 {{ language === 'de' ? 'Jahre' : 'years' }}</span>
                </div>
              </div>
              <button @click="editRetentionPolicy" class="w-full mt-3 px-3 py-2 bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-500">
                {{ language === 'de' ? 'Richtlinie bearbeiten' : 'Edit Policy' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Term/Year Change Wizard Modal -->
    <div v-if="showTermWizard" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Schuljahr-Wechsel-Assistent' : 'School Year Change Wizard' }}
            </h3>
            <button @click="showTermWizard = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-6">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2">
                {{ language === 'de' ? 'Neues Schuljahr' : 'New School Year' }}
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {{ language === 'de' ? 'Startdatum' : 'Start Date' }}
                  </label>
                  <input type="date" v-model="newSchoolYear.startDate" class="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg">
                </div>
                <div>
                  <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {{ language === 'de' ? 'Enddatum' : 'End Date' }}
                  </label>
                  <input type="date" v-model="newSchoolYear.endDate" class="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg">
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h4 class="font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Datenübernahme-Optionen' : 'Data Transition Options' }}
              </h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" v-model="yearChangeOptions.promoteStudents" class="mr-2">
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Schüler automatisch in nächste Klassenstufe versetzen' : 'Automatically promote students to next grade' }}
                  </span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="yearChangeOptions.archiveGraduates" class="mr-2">
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Absolventen archivieren' : 'Archive graduating students' }}
                  </span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="yearChangeOptions.resetAttendance" class="mr-2">
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Anwesenheitsstatistiken zurücksetzen' : 'Reset attendance statistics' }}
                  </span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="yearChangeOptions.carryOverCourses" class="mr-2">
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Kursstrukturen übernehmen' : 'Carry over course structures' }}
                  </span>
                </label>
              </div>
            </div>

            <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                {{ language === 'de' ? 'Wichtiger Hinweis' : 'Important Notice' }}
              </h4>
              <p class="text-sm text-yellow-600 dark:text-yellow-300">
                {{ language === 'de' 
                  ? 'Dieser Vorgang archiviert das aktuelle Schuljahr und erstellt ein neues. Dieser Prozess kann nicht rückgängig gemacht werden.'
                  : 'This process will archive the current school year and create a new one. This action cannot be undone.' }}
              </p>
            </div>

            <div class="flex justify-end space-x-3">
              <button @click="showTermWizard = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button @click="executeYearChange" class="btn-primary">
                {{ language === 'de' ? 'Schuljahr wechseln' : 'Change School Year' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Bestätigung erforderlich' : 'Confirmation Required' }}
            </h3>
            <button @click="showDeleteConfirmation = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mb-6">
            <p class="text-red-800 dark:text-red-200">
              {{ language === 'de' 
                ? 'Sie sind dabei, alle personenbezogenen Daten für diese Person zu löschen. Diese Aktion kann nicht rückgängig gemacht werden.'
                : 'You are about to delete all personal data for this individual. This action cannot be undone.' }}
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Bestätigungscode eingeben' : 'Enter confirmation code' }}
              </label>
              <input 
                v-model="deleteConfirmationCode"
                type="text"
                :placeholder="language === 'de' ? 'DELETE' : 'DELETE'"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
            <div class="flex justify-end space-x-3">
              <button @click="showDeleteConfirmation = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button 
                @click="confirmDelete"
                :disabled="deleteConfirmationCode !== 'DELETE'"
                :class="deleteConfirmationCode !== 'DELETE' ? 'opacity-50 cursor-not-allowed' : ''"
                class="btn-danger bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                {{ language === 'de' ? 'Endgültig löschen' : 'Permanently Delete' }}
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
import { 
  Upload, FileText, Shield, Edit, Copy, Trash2, X, Users, Database, 
  HardDrive, Clock, RefreshCw
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showImportExport = ref(false)
const showAuditTrail = ref(false)
const showGDPRTools = ref(false)
const showTermWizard = ref(false)
const showDeleteConfirmation = ref(false)
const selectedDataType = ref('students')
const gdprSearch = ref('')
const deleteConfirmationCode = ref('')

const dataStats = ref([
  {
    title: language.value === 'de' ? 'Gesamte Datensätze' : 'Total Records',
    value: '24,856',
    change: '+156 this month',
    changeColor: 'text-green-600',
    icon: Database,
    iconBg: 'bg-primary-600'
  },
  {
    title: language.value === 'de' ? 'Datenbank-Größe' : 'Database Size',
    value: '1.2 GB',
    change: '+85 MB this month',
    changeColor: 'text-yellow-600',
    icon: HardDrive,
    iconBg: 'bg-green-600'
  },
  {
    title: language.value === 'de' ? 'Letzte Sicherung' : 'Last Backup',
    value: '2 hours ago',
    change: 'Automatic',
    changeColor: 'text-green-600',
    icon: Clock,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Aktive Benutzer' : 'Active Users',
    value: '1,247',
    change: '+12 this week',
    changeColor: 'text-green-600',
    icon: Users,
    iconBg: 'bg-purple-600'
  }
])

const subjects = ref([
  { id: 1, name: 'Mathematics', code: 'MATH' },
  { id: 2, name: 'Physics', code: 'PHYS' },
  { id: 3, name: 'Chemistry', code: 'CHEM' },
  { id: 4, name: 'Biology', code: 'BIO' },
  { id: 5, name: 'German', code: 'GER' },
  { id: 6, name: 'English', code: 'ENG' },
  { id: 7, name: 'History', code: 'HIST' }
])

const roomTypes = ref([
  { id: 1, name: 'Standard Classroom', capacity: 30 },
  { id: 2, name: 'Science Laboratory', capacity: 25 },
  { id: 3, name: 'Computer Lab', capacity: 20 },
  { id: 4, name: 'Gymnasium', capacity: 50 },
  { id: 5, name: 'Art Studio', capacity: 25 }
])

const potentialDuplicates = ref([
  {
    id: 1,
    type: 'Student',
    count: 2,
    similarity: 95,
    original: {
      name: 'Max Müller',
      class: 'Class 10A',
      email: 'max.mueller@student.winschool.de'
    },
    duplicate: {
      name: 'Max Mueller',
      class: 'Class 10A',
      email: 'max.muller@student.winschool.de'
    },
    merged: {
      name: 'Max Müller',
      class: 'Class 10A',
      email: 'max.mueller@student.winschool.de'
    }
  },
  {
    id: 2,
    type: 'Teacher',
    count: 2,
    similarity: 90,
    original: {
      name: 'Sarah Schmidt',
      department: 'Languages',
      email: 'sarah.schmidt@teacher.winschool.de'
    },
    duplicate: {
      name: 'Sara Schmidt',
      department: 'Languages',
      email: 'sara.schmidt@teacher.winschool.de'
    },
    merged: {
      name: 'Sarah Schmidt',
      department: 'Languages',
      email: 'sarah.schmidt@teacher.winschool.de'
    }
  }
])

const selectedDuplicate = ref(null)

const auditEntries = ref([
  {
    id: 1,
    timestamp: '2024-03-12 14:32:45',
    user: 'admin@winschool.de',
    action: 'create',
    dataType: 'students',
    details: 'Created new student: Emma Müller'
  },
  {
    id: 2,
    timestamp: '2024-03-12 14:15:22',
    user: 'teacher@winschool.de',
    action: 'update',
    dataType: 'grades',
    details: 'Updated grades for Class 10A'
  },
  {
    id: 3,
    timestamp: '2024-03-12 13:45:10',
    user: 'admin@winschool.de',
    action: 'delete',
    dataType: 'teachers',
    details: 'Deleted teacher: John Doe'
  },
  {
    id: 4,
    timestamp: '2024-03-12 11:22:05',
    user: 'principal@winschool.de',
    action: 'update',
    dataType: 'classes',
    details: 'Updated class schedule for Class 9B'
  }
])

const filteredAuditEntries = computed(() => {
  let filtered = auditEntries.value

  if (auditFilters.dataType) {
    filtered = filtered.filter(entry => entry.dataType === auditFilters.dataType)
  }

  if (auditFilters.action) {
    filtered = filtered.filter(entry => entry.action === auditFilters.action)
  }

  return filtered
})

const auditFilters = ref({
  dataType: '',
  action: ''
})

const exportSettings = ref({
  dataType: 'all',
  format: 'csv'
})

const importSettings = ref({
  overwrite: false,
  validateBeforeImport: true
})

const newSchoolYear = ref({
  startDate: '2024-08-01',
  endDate: '2025-07-31'
})

const yearChangeOptions = ref({
  promoteStudents: true,
  archiveGraduates: true,
  resetAttendance: true,
  carryOverCourses: true
})

const getColumns = (dataType: string) => {
  switch (dataType) {
    case 'students':
      return ['ID', 'Name', 'Class', 'Age', 'Email', 'Status']
    case 'teachers':
      return ['ID', 'Name', 'Department', 'Email', 'Status']
    case 'classes':
      return ['ID', 'Name', 'Grade Level', 'Students', 'Homeroom Teacher']
    case 'subjects':
      return ['ID', 'Name', 'Code', 'Department']
    case 'rooms':
      return ['ID', 'Name', 'Type', 'Capacity', 'Building']
    default:
      return []
  }
}

const getCurrentData = () => {
  // Mock data for different data types
  switch (selectedDataType.value) {
    case 'students':
      return [
        { id: 1, name: 'Emma Müller', class: 'Class 10A', age: 16, email: 'emma.mueller@student.winschool.de', status: 'Active' },
        { id: 2, name: 'Liam Weber', class: 'Class 10A', age: 16, email: 'liam.weber@student.winschool.de', status: 'Active' },
        { id: 3, name: 'Sophie Schmidt', class: 'Class 9B', age: 15, email: 'sophie.schmidt@student.winschool.de', status: 'Active' }
      ]
    case 'teachers':
      return [
        { id: 1, name: 'Dr. Thomas Weber', department: 'Mathematics', email: 'thomas.weber@teacher.winschool.de', status: 'Active' },
        { id: 2, name: 'Ms. Sarah Schmidt', department: 'Languages', email: 'sarah.schmidt@teacher.winschool.de', status: 'Active' },
        { id: 3, name: 'Prof. Michael Mueller', department: 'Sciences', email: 'michael.mueller@teacher.winschool.de', status: 'On Leave' }
      ]
    case 'classes':
      return [
        { id: 1, name: 'Class 10A', gradeLevel: 'Grade 10', students: 28, homeroomTeacher: 'Dr. Weber' },
        { id: 2, name: 'Class 9B', gradeLevel: 'Grade 9', students: 25, homeroomTeacher: 'Ms. Schmidt' },
        { id: 3, name: 'Class 11A', gradeLevel: 'Grade 11', students: 22, homeroomTeacher: 'Prof. Mueller' }
      ]
    default:
      return []
  }
}

const getFieldValue = (record: any, column: string) => {
  // Convert column name to camelCase or match with record property
  const key = column.toLowerCase().replace(/\s+(.)/g, (_, char) => char.toUpperCase())
  return record[key] || ''
}

const getActionColor = (action: string) => {
  switch (action) {
    case 'create':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'update':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'delete':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const addNewRecord = () => {
  alert(`${language.value === 'de' ? 'Neuen Datensatz hinzufügen für' : 'Add new record for'} ${selectedDataType.value}`)
}

const editRecord = (record: any) => {
  alert(`${language.value === 'de' ? 'Datensatz bearbeiten' : 'Edit record'}: ${record.name || record.id}`)
}

const duplicateRecord = (record: any) => {
  alert(`${language.value === 'de' ? 'Datensatz duplizieren' : 'Duplicate record'}: ${record.name || record.id}`)
}

const deleteRecord = (record: any) => {
  alert(`${language.value === 'de' ? 'Datensatz löschen' : 'Delete record'}: ${record.name || record.id}`)
}

const editSubject = (subject: any) => {
  alert(`${language.value === 'de' ? 'Fach bearbeiten' : 'Edit subject'}: ${subject.name}`)
}

const deleteSubject = (subject: any) => {
  alert(`${language.value === 'de' ? 'Fach löschen' : 'Delete subject'}: ${subject.name}`)
}

const addSubject = () => {
  alert(language.value === 'de' ? 'Neues Fach hinzufügen' : 'Add new subject')
}

const editRoomType = (roomType: any) => {
  alert(`${language.value === 'de' ? 'Raumtyp bearbeiten' : 'Edit room type'}: ${roomType.name}`)
}

const deleteRoomType = (roomType: any) => {
  alert(`${language.value === 'de' ? 'Raumtyp löschen' : 'Delete room type'}: ${roomType.name}`)
}

const addRoomType = () => {
  alert(language.value === 'de' ? 'Neuen Raumtyp hinzufügen' : 'Add new room type')
}

const archiveCurrentYear = () => {
  alert(language.value === 'de' ? 'Aktuelles Schuljahr wird archiviert...' : 'Archiving current school year...')
}

const mergeDuplicates = (duplicate: any) => {
  selectedDuplicate.value = duplicate
}

const cancelMerge = () => {
  selectedDuplicate.value = null
}

const confirmMerge = () => {
  alert(language.value === 'de' ? 'Datensätze wurden zusammengeführt!' : 'Records have been merged!')
  selectedDuplicate.value = null
}

const exportData = () => {
  alert(`${language.value === 'de' ? 'Daten werden exportiert als' : 'Exporting data as'} ${exportSettings.value.format.toUpperCase()}`)
  showImportExport.value = false
}

const importData = () => {
  alert(language.value === 'de' ? 'Daten werden importiert...' : 'Importing data...')
  showImportExport.value = false
}

const exportAuditTrail = () => {
  alert(language.value === 'de' ? 'Audit-Trail wird exportiert...' : 'Exporting audit trail...')
}

const searchDataSubject = () => {
  alert(`${language.value === 'de' ? 'Suche nach' : 'Searching for'}: ${gdprSearch.value}`)
}

const generateDataAccessReport = () => {
  alert(language.value === 'de' ? 'Datenauskunftsbericht wird generiert...' : 'Generating data access report...')
}

const anonymizeData = () => {
  alert(language.value === 'de' ? 'Daten werden anonymisiert...' : 'Anonymizing data...')
}

const rectifyData = () => {
  alert(language.value === 'de' ? 'Daten werden korrigiert...' : 'Rectifying data...')
}

const editRetentionPolicy = () => {
  alert(language.value === 'de' ? 'Datenspeicherungsrichtlinie bearbeiten' : 'Edit data retention policy')
}

const executeYearChange = () => {
  alert(language.value === 'de' ? 'Schuljahr-Wechsel wird durchgeführt...' : 'Executing school year change...')
  showTermWizard.value = false
}

const confirmDelete = () => {
  alert(language.value === 'de' ? 'Daten wurden endgültig gelöscht!' : 'Data has been permanently deleted!')
  showDeleteConfirmation.value = false
}
</script>
