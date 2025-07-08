<template>
  <div class="space-y-6">
    <!-- Breadcrumb Navigation -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Systemverwaltung' : 'System Administration' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ language === 'de' ? 'Konfigurieren Sie Systemtabellen und Einstellungen' : 'Configure system tables and settings' }}
        </p>
      </div>
      <div class="flex space-x-2">
        <button @click="saveAllSettings" class="btn-primary flex items-center">
          <Save class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Alle Einstellungen speichern' : 'Save All Settings' }}
        </button>
      </div>
    </div>

    <!-- Configuration Tabs -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8 overflow-x-auto">
          <button
            v-for="tab in configTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <component :is="tab.icon" class="h-4 w-4 inline-block mr-2" />
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Table Administration -->
      <div v-if="activeTab === 'tables'" class="mt-6 space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Tabellenpflege' : 'Table Administration' }}
          </h2>
          <div class="flex space-x-2">
            <select 
              v-model="selectedTable" 
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{{ language === 'de' ? 'Tabelle wählen' : 'Select Table' }}</option>
              <option v-for="table in systemTables" :key="table.id" :value="table.id">{{ table.name }}</option>
            </select>
            <button @click="addTableEntry" class="btn-primary text-sm">
              {{ language === 'de' ? 'Eintrag hinzufügen' : 'Add Entry' }}
            </button>
          </div>
        </div>

        <div v-if="selectedTable" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ getSelectedTableName() }}
          </h3>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-100 dark:bg-gray-600">
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Name' : 'Name' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Code' : 'Code' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Reihenfolge' : 'Order' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Status' : 'Status' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry in getTableEntries()" :key="entry.id" class="border-b border-gray-200 dark:border-gray-700">
                  <td class="py-3 px-4 text-gray-900 dark:text-white">{{ entry.name }}</td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ entry.code }}</td>
                  <td class="py-3 px-4 text-gray-900 dark:text-white">{{ entry.order }}</td>
                  <td class="py-3 px-4">
                    <span :class="entry.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ entry.active ? (language === 'de' ? 'Aktiv' : 'Active') : (language === 'de' ? 'Inaktiv' : 'Inactive') }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex space-x-2">
                      <button @click="editTableEntry(entry)" class="text-primary-600 hover:text-primary-800">
                        <Edit class="h-4 w-4" />
                      </button>
                      <button @click="toggleEntryStatus(entry)" class="text-blue-600 hover:text-blue-800">
                        <component :is="entry.active ? EyeOff : Eye" class="h-4 w-4" />
                      </button>
                      <button @click="moveEntryUp(entry)" class="text-gray-600 hover:text-gray-800">
                        <ChevronUp class="h-4 w-4" />
                      </button>
                      <button @click="moveEntryDown(entry)" class="text-gray-600 hover:text-gray-800">
                        <ChevronDown class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div v-else class="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
          <Database class="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Bitte wählen Sie eine Tabelle aus' : 'Please select a table' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ language === 'de' ? 'Wählen Sie eine Tabelle aus der Dropdown-Liste oben, um deren Einträge zu verwalten.' : 'Select a table from the dropdown above to manage its entries.' }}
          </p>
        </div>
      </div>

      <!-- Grade Scales -->
      <div v-if="activeTab === 'grades'" class="mt-6 space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Notenskalen & Legenden' : 'Grade Scales & Legends' }}
          </h2>
          <div class="flex space-x-2">
            <select 
              v-model="selectedGradeSystem" 
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{{ language === 'de' ? 'Notensystem wählen' : 'Select Grade System' }}</option>
              <option v-for="system in gradeSystems" :key="system.id" :value="system.id">{{ system.name }}</option>
            </select>
            <button @click="addGradeSystem" class="btn-primary text-sm">
              {{ language === 'de' ? 'System hinzufügen' : 'Add System' }}
            </button>
          </div>
        </div>

        <div v-if="selectedGradeSystem" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-gray-900 dark:text-white">
              {{ getSelectedGradeSystemName() }}
            </h3>
            <div class="flex space-x-2">
              <button @click="editGradeSystem" class="btn-secondary text-sm">
                {{ language === 'de' ? 'System bearbeiten' : 'Edit System' }}
              </button>
              <button @click="addGradeValue" class="btn-primary text-sm">
                {{ language === 'de' ? 'Note hinzufügen' : 'Add Grade' }}
              </button>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-100 dark:bg-gray-600">
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Note' : 'Grade' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Beschreibung' : 'Description' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Mindestwert' : 'Minimum Value' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Höchstwert' : 'Maximum Value' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Bestanden' : 'Passing' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="grade in getGradeValues()" :key="grade.id" class="border-b border-gray-200 dark:border-gray-700">
                  <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ grade.value }}</td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ grade.description }}</td>
                  <td class="py-3 px-4 text-gray-900 dark:text-white">{{ grade.minValue }}</td>
                  <td class="py-3 px-4 text-gray-900 dark:text-white">{{ grade.maxValue }}</td>
                  <td class="py-3 px-4">
                    <span :class="grade.isPassing ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ grade.isPassing ? (language === 'de' ? 'Ja' : 'Yes') : (language === 'de' ? 'Nein' : 'No') }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex space-x-2">
                      <button @click="editGradeValue(grade)" class="text-primary-600 hover:text-primary-800">
                        <Edit class="h-4 w-4" />
                      </button>
                      <button @click="moveGradeUp(grade)" class="text-gray-600 hover:text-gray-800">
                        <ChevronUp class="h-4 w-4" />
                      </button>
                      <button @click="moveGradeDown(grade)" class="text-gray-600 hover:text-gray-800">
                        <ChevronDown class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div v-else class="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
          <Award class="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Bitte wählen Sie ein Notensystem aus' : 'Please select a grade system' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ language === 'de' ? 'Wählen Sie ein Notensystem aus der Dropdown-Liste oben, um dessen Werte zu verwalten.' : 'Select a grade system from the dropdown above to manage its values.' }}
          </p>
        </div>
      </div>

      <!-- Subject Types -->
      <div v-if="activeTab === 'subjects'" class="mt-6 space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Fach- und Kurstypen' : 'Subject & Course Types' }}
          </h2>
          <div class="flex space-x-2">
            <select 
              v-model="selectedSubjectTab" 
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="types">{{ language === 'de' ? 'Fachtypen' : 'Subject Types' }}</option>
              <option value="courses">{{ language === 'de' ? 'Kurstypen' : 'Course Types' }}</option>
              <option value="mapping">{{ language === 'de' ? 'Zuordnungen' : 'Mappings' }}</option>
            </select>
            <button @click="addSubjectType" class="btn-primary text-sm">
              {{ language === 'de' ? 'Hinzufügen' : 'Add' }}
            </button>
          </div>
        </div>

        <!-- Subject Types Tab -->
        <div v-if="selectedSubjectTab === 'types'" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Fachtypen' : 'Subject Types' }}
          </h3>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-100 dark:bg-gray-600">
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Name' : 'Name' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Code' : 'Code' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Gewichtung' : 'Weighting' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'In Zeugnissen' : 'In Certificates' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'In GPA' : 'In GPA' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="type in subjectTypes" :key="type.id" class="border-b border-gray-200 dark:border-gray-700">
                  <td class="py-3 px-4 text-gray-900 dark:text-white">{{ type.name }}</td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ type.code }}</td>
                  <td class="py-3 px-4 text-gray-900 dark:text-white">{{ type.weighting }}</td>
                  <td class="py-3 px-4">
                    <span :class="type.inCertificates ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ type.inCertificates ? (language === 'de' ? 'Ja' : 'Yes') : (language === 'de' ? 'Nein' : 'No') }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <span :class="type.inGPA ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ type.inGPA ? (language === 'de' ? 'Ja' : 'Yes') : (language === 'de' ? 'Nein' : 'No') }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex space-x-2">
                      <button @click="editSubjectType(type)" class="text-primary-600 hover:text-primary-800">
                        <Edit class="h-4 w-4" />
                      </button>
                      <button @click="toggleSubjectTypeStatus(type)" class="text-blue-600 hover:text-blue-800">
                        <component :is="type.active ? EyeOff : Eye" class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Course Types Tab -->
        <div v-if="selectedSubjectTab === 'courses'" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Kurstypen' : 'Course Types' }}
          </h3>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-100 dark:bg-gray-600">
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Name' : 'Name' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Code' : 'Code' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Beschreibung' : 'Description' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Std. Stunden' : 'Std. Hours' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="course in courseTypes" :key="course.id" class="border-b border-gray-200 dark:border-gray-700">
                  <td class="py-3 px-4 text-gray-900 dark:text-white">{{ course.name }}</td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ course.code }}</td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ course.description }}</td>
                  <td class="py-3 px-4 text-gray-900 dark:text-white">{{ course.defaultHours }}</td>
                  <td class="py-3 px-4">
                    <div class="flex space-x-2">
                      <button @click="editCourseType(course)" class="text-primary-600 hover:text-primary-800">
                        <Edit class="h-4 w-4" />
                      </button>
                      <button @click="toggleCourseTypeStatus(course)" class="text-blue-600 hover:text-blue-800">
                        <component :is="course.active ? EyeOff : Eye" class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Subject-Group-Teacher Mapping Tab -->
        <div v-if="selectedSubjectTab === 'mapping'" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Fach-Gruppe-Lehrer-Zuordnung' : 'Subject-Group-Teacher Mapping' }}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Semester' : 'Semester' }}
              </label>
              <select 
                v-model="selectedMappingSemester" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Semester wählen' : 'Select Semester' }}</option>
                <option v-for="semester in semesters" :key="semester.id" :value="semester.id">{{ semester.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Klasse/Gruppe' : 'Class/Group' }}
              </label>
              <select 
                v-model="selectedMappingClass" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Klasse wählen' : 'Select Class' }}</option>
                <option v-for="class_ in classes" :key="class_.id" :value="class_.id">{{ class_.name }}</option>
              </select>
            </div>
            <div class="flex items-end">
              <button @click="addMapping" class="btn-primary text-sm w-full">
                {{ language === 'de' ? 'Neue Zuordnung' : 'New Mapping' }}
              </button>
            </div>
          </div>
          
          <div v-if="selectedMappingSemester && selectedMappingClass" class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-100 dark:bg-gray-600">
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Fach' : 'Subject' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Stunden/Woche' : 'Hours/Week' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Fachtyp' : 'Subject Type' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Kurstyp' : 'Course Type' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mapping in subjectMappings" :key="mapping.id" class="border-b border-gray-200 dark:border-gray-700">
                  <td class="py-3 px-4 text-gray-900 dark:text-white">{{ mapping.subject }}</td>
                  <td class="py-3 px-4 text-gray-900 dark:text-white">{{ mapping.teacher }}</td>
                  <td class="py-3 px-4 text-gray-900 dark:text-white">{{ mapping.hoursPerWeek }}</td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ mapping.subjectType }}</td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ mapping.courseType }}</td>
                  <td class="py-3 px-4">
                    <div class="flex space-x-2">
                      <button @click="editMapping(mapping)" class="text-primary-600 hover:text-primary-800">
                        <Edit class="h-4 w-4" />
                      </button>
                      <button @click="deleteMapping(mapping)" class="text-red-600 hover:text-red-800">
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-else class="text-center p-8 text-gray-500 dark:text-gray-400">
            {{ language === 'de' ? 'Bitte wählen Sie ein Semester und eine Klasse aus, um die Zuordnungen anzuzeigen.' : 'Please select a semester and class to view mappings.' }}
          </div>
        </div>
      </div>

      <!-- Report Settings -->
      <div v-if="activeTab === 'reports'" class="mt-6 space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Berichts- und Druckeinstellungen' : 'Report & Print Settings' }}
          </h2>
          <div class="flex space-x-2">
            <select 
              v-model="selectedReportType" 
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{{ language === 'de' ? 'Berichtstyp wählen' : 'Select Report Type' }}</option>
              <option v-for="report in reportTypes" :key="report.id" :value="report.id">{{ report.name }}</option>
            </select>
          </div>
        </div>

        <div v-if="selectedReportType" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ getReportTypeName() }}
          </h3>
          
          <div class="space-y-6">
            <!-- Grade Display Settings -->
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
                {{ language === 'de' ? 'Notenanzeigeeinstellungen' : 'Grade Display Settings' }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="setting in reportGradeSettings" :key="setting.id" class="flex items-center">
                  <input
                    :id="`grade-setting-${setting.id}`"
                    v-model="setting.enabled"
                    type="checkbox"
                    class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
                  />
                  <label :for="`grade-setting-${setting.id}`" class="text-sm text-gray-900 dark:text-white">
                    {{ setting.name }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Display Logic -->
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
                {{ language === 'de' ? 'Anzeigelogik' : 'Display Logic' }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="logic in reportDisplayLogic" :key="logic.id" class="flex items-center">
                  <input
                    :id="`display-logic-${logic.id}`"
                    v-model="logic.enabled"
                    type="checkbox"
                    class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
                  />
                  <label :for="`display-logic-${logic.id}`" class="text-sm text-gray-900 dark:text-white">
                    {{ logic.name }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Control Flags -->
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
                {{ language === 'de' ? 'Steuerungsflags' : 'Control Flags' }}
              </h4>
              <div class="space-y-3">
                <div v-for="(flag, category) in reportControlFlags" :key="category" class="p-3 bg-white dark:bg-gray-600 rounded-lg">
                  <h5 class="font-medium text-gray-900 dark:text-white mb-2">{{ category }}</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div v-for="item in flag" :key="item.id" class="flex items-center">
                      <input
                        :id="`flag-${item.id}`"
                        v-model="item.enabled"
                        type="checkbox"
                        class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
                      />
                      <label :for="`flag-${item.id}`" class="text-sm text-gray-900 dark:text-white">
                        {{ item.name }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
          <FileText class="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Bitte wählen Sie einen Berichtstyp aus' : 'Please select a report type' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ language === 'de' ? 'Wählen Sie einen Berichtstyp aus der Dropdown-Liste oben, um dessen Einstellungen zu konfigurieren.' : 'Select a report type from the dropdown above to configure its settings.' }}
          </p>
        </div>
      </div>

      <!-- Field Visibility & Rights -->
      <div v-if="activeTab === 'rights'" class="mt-6 space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Feldvisibilität & Berechtigungen' : 'Field Visibility & Rights' }}
          </h2>
          <div class="flex space-x-2">
            <select 
              v-model="selectedRoleForRights" 
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{{ language === 'de' ? 'Rolle wählen' : 'Select Role' }}</option>
              <option v-for="role in roles" :key="role.value" :value="role.value">{{ role.label }}</option>
            </select>
          </div>
        </div>

        <div v-if="selectedRoleForRights" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 dark:text-white mb-4">
            {{ getRoleLabel() }}
          </h3>
          
          <div class="space-y-6">
            <!-- Field Visibility -->
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
                {{ language === 'de' ? 'Feldvisibilität' : 'Field Visibility' }}
              </h4>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="bg-gray-100 dark:bg-gray-600">
                      <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Feldname' : 'Field Name' }}
                      </th>
                      <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Kategorie' : 'Category' }}
                      </th>
                      <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Sichtbar' : 'Visible' }}
                      </th>
                      <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Bearbeitbar' : 'Editable' }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="field in fieldVisibility" :key="field.id" class="border-b border-gray-200 dark:border-gray-700">
                      <td class="py-3 px-4 text-gray-900 dark:text-white">{{ field.name }}</td>
                      <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ field.category }}</td>
                      <td class="py-3 px-4">
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input
                            v-model="field.visible"
                            type="checkbox"
                            class="sr-only peer"
                          />
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </td>
                      <td class="py-3 px-4">
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input
                            v-model="field.editable"
                            type="checkbox"
                            :disabled="!field.visible"
                            class="sr-only peer"
                          />
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600" :class="{ 'opacity-50': !field.visible }"></div>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Function Rights -->
            <div>
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
                {{ language === 'de' ? 'Funktionsberechtigungen' : 'Function Rights' }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-for="category in functionRights" :key="category.id" class="p-3 bg-white dark:bg-gray-600 rounded-lg">
                  <h5 class="font-medium text-gray-900 dark:text-white mb-2">{{ category.name }}</h5>
                  <div class="space-y-2">
                    <div v-for="right in category.rights" :key="right.id" class="flex items-center">
                      <input
                        :id="`right-${right.id}`"
                        v-model="right.granted"
                        type="checkbox"
                        class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
                      />
                      <label :for="`right-${right.id}`" class="text-sm text-gray-900 dark:text-white">
                        {{ right.name }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
          <Lock class="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Bitte wählen Sie eine Rolle aus' : 'Please select a role' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {{ language === 'de' ? 'Wählen Sie eine Rolle aus der Dropdown-Liste oben, um deren Berechtigungen zu konfigurieren.' : 'Select a role from the dropdown above to configure its permissions.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Table Entry Modal -->
    <div v-if="showTableEntryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditMode 
                ? (language === 'de' ? 'Eintrag bearbeiten' : 'Edit Entry') 
                : (language === 'de' ? 'Neuen Eintrag hinzufügen' : 'Add New Entry') }}
            </h3>
            <button @click="showTableEntryModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveTableEntry" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </label>
              <input v-model="tableEntryForm.name" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Code' : 'Code' }}
              </label>
              <input v-model="tableEntryForm.code" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Reihenfolge' : 'Order' }}
              </label>
              <input v-model="tableEntryForm.order" type="number" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div class="flex items-center">
              <input
                id="active-status"
                v-model="tableEntryForm.active"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
              />
              <label for="active-status" class="text-sm text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Aktiv' : 'Active' }}
              </label>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showTableEntryModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ isEditMode 
                  ? (language === 'de' ? 'Aktualisieren' : 'Update') 
                  : (language === 'de' ? 'Hinzufügen' : 'Add') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Grade System Modal -->
    <div v-if="showGradeSystemModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditMode 
                ? (language === 'de' ? 'Notensystem bearbeiten' : 'Edit Grade System') 
                : (language === 'de' ? 'Neues Notensystem hinzufügen' : 'Add New Grade System') }}
            </h3>
            <button @click="showGradeSystemModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveGradeSystem" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </label>
              <input v-model="gradeSystemForm.name" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Typ' : 'Type' }}
              </label>
              <select v-model="gradeSystemForm.type" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="numeric">{{ language === 'de' ? 'Numerisch (1-6)' : 'Numeric (1-6)' }}</option>
                <option value="points">{{ language === 'de' ? 'Punkte (15-0)' : 'Points (15-0)' }}</option>
                <option value="letters">{{ language === 'de' ? 'Buchstaben (A-F)' : 'Letters (A-F)' }}</option>
                <option value="descriptive">{{ language === 'de' ? 'Beschreibend' : 'Descriptive' }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea v-model="gradeSystemForm.description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"></textarea>
            </div>

            <div class="flex items-center">
              <input
                id="default-system"
                v-model="gradeSystemForm.isDefault"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
              />
              <label for="default-system" class="text-sm text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Als Standard festlegen' : 'Set as default' }}
              </label>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showGradeSystemModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ isEditMode 
                  ? (language === 'de' ? 'Aktualisieren' : 'Update') 
                  : (language === 'de' ? 'Hinzufügen' : 'Add') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Grade Value Modal -->
    <div v-if="showGradeValueModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditMode 
                ? (language === 'de' ? 'Notenwert bearbeiten' : 'Edit Grade Value') 
                : (language === 'de' ? 'Neuen Notenwert hinzufügen' : 'Add New Grade Value') }}
            </h3>
            <button @click="showGradeValueModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveGradeValue" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Notenwert' : 'Grade Value' }}
              </label>
              <input v-model="gradeValueForm.value" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <input v-model="gradeValueForm.description" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Mindestwert' : 'Minimum Value' }}
                </label>
                <input v-model="gradeValueForm.minValue" type="number" step="0.01" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Höchstwert' : 'Maximum Value' }}
                </label>
                <input v-model="gradeValueForm.maxValue" type="number" step="0.01" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
            </div>

            <div class="flex items-center">
              <input
                id="passing-grade"
                v-model="gradeValueForm.isPassing"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
              />
              <label for="passing-grade" class="text-sm text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Bestehende Note' : 'Passing Grade' }}
              </label>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showGradeValueModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ isEditMode 
                  ? (language === 'de' ? 'Aktualisieren' : 'Update') 
                  : (language === 'de' ? 'Hinzufügen' : 'Add') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Subject Type Modal -->
    <div v-if="showSubjectTypeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditMode 
                ? (language === 'de' ? 'Fachtyp bearbeiten' : 'Edit Subject Type') 
                : (language === 'de' ? 'Neuen Fachtyp hinzufügen' : 'Add New Subject Type') }}
            </h3>
            <button @click="showSubjectTypeModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveSubjectType" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </label>
              <input v-model="subjectTypeForm.name" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Code' : 'Code' }}
              </label>
              <input v-model="subjectTypeForm.code" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Gewichtung' : 'Weighting' }}
              </label>
              <input v-model="subjectTypeForm.weighting" type="number" step="0.01" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div class="flex items-center">
              <input
                id="in-certificates"
                v-model="subjectTypeForm.inCertificates"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
              />
              <label for="in-certificates" class="text-sm text-gray-900 dark:text-white">
                {{ language === 'de' ? 'In Zeugnissen anzeigen' : 'Show in certificates' }}
              </label>
            </div>

            <div class="flex items-center">
              <input
                id="in-gpa"
                v-model="subjectTypeForm.inGPA"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
              />
              <label for="in-gpa" class="text-sm text-gray-900 dark:text-white">
                {{ language === 'de' ? 'In GPA einbeziehen' : 'Include in GPA' }}
              </label>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showSubjectTypeModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ isEditMode 
                  ? (language === 'de' ? 'Aktualisieren' : 'Update') 
                  : (language === 'de' ? 'Hinzufügen' : 'Add') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Course Type Modal -->
    <div v-if="showCourseTypeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditMode 
                ? (language === 'de' ? 'Kurstyp bearbeiten' : 'Edit Course Type') 
                : (language === 'de' ? 'Neuen Kurstyp hinzufügen' : 'Add New Course Type') }}
            </h3>
            <button @click="showCourseTypeModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveCourseType" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </label>
              <input v-model="courseTypeForm.name" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Code' : 'Code' }}
              </label>
              <input v-model="courseTypeForm.code" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea v-model="courseTypeForm.description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Standard-Stunden pro Woche' : 'Default Hours per Week' }}
              </label>
              <input v-model="courseTypeForm.defaultHours" type="number" step="0.5" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showCourseTypeModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ isEditMode 
                  ? (language === 'de' ? 'Aktualisieren' : 'Update') 
                  : (language === 'de' ? 'Hinzufügen' : 'Add') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Mapping Modal -->
    <div v-if="showMappingModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditMode 
                ? (language === 'de' ? 'Zuordnung bearbeiten' : 'Edit Mapping') 
                : (language === 'de' ? 'Neue Zuordnung hinzufügen' : 'Add New Mapping') }}
            </h3>
            <button @click="showMappingModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="saveMapping" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Fach' : 'Subject' }}
              </label>
              <select v-model="mappingForm.subject" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">{{ language === 'de' ? 'Fach wählen' : 'Select Subject' }}</option>
                <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
              </label>
              <select v-model="mappingForm.teacher" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">{{ language === 'de' ? 'Lehrer wählen' : 'Select Teacher' }}</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.name">{{ teacher.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Stunden pro Woche' : 'Hours per Week' }}
              </label>
              <input v-model="mappingForm.hoursPerWeek" type="number" step="0.5" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Fachtyp' : 'Subject Type' }}
              </label>
              <select v-model="mappingForm.subjectType" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">{{ language === 'de' ? 'Fachtyp wählen' : 'Select Subject Type' }}</option>
                <option v-for="type in subjectTypes" :key="type.id" :value="type.name">{{ type.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Kurstyp' : 'Course Type' }}
              </label>
              <select v-model="mappingForm.courseType" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">{{ language === 'de' ? 'Kurstyp wählen' : 'Select Course Type' }}</option>
                <option v-for="type in courseTypes" :key="type.id" :value="type.name">{{ type.name }}</option>
              </select>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showMappingModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ isEditMode 
                  ? (language === 'de' ? 'Aktualisieren' : 'Update') 
                  : (language === 'de' ? 'Hinzufügen' : 'Add') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  Save, Database, Award, BookOpen, Lock, Edit, Eye, EyeOff, ChevronUp, ChevronDown,
  Trash2, X, FileText
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Active tab state
const activeTab = ref('tables')

// Modal states
const showTableEntryModal = ref(false)
const showGradeSystemModal = ref(false)
const showGradeValueModal = ref(false)
const showSubjectTypeModal = ref(false)
const showCourseTypeModal = ref(false)
const showMappingModal = ref(false)
const isEditMode = ref(false)

// Selection states
const selectedTable = ref('')
const selectedGradeSystem = ref('')
const selectedSubjectTab = ref('types')
const selectedReportType = ref('')
const selectedRoleForRights = ref('')
const selectedMappingSemester = ref('')
const selectedMappingClass = ref('')

// Form states
const tableEntryForm = ref({
  id: 0,
  name: '',
  code: '',
  order: 0,
  active: true
})

const gradeSystemForm = ref({
  id: 0,
  name: '',
  type: 'numeric',
  description: '',
  isDefault: false
})

const gradeValueForm = ref({
  id: 0,
  value: '',
  description: '',
  minValue: 0,
  maxValue: 0,
  isPassing: true
})

const subjectTypeForm = ref({
  id: 0,
  name: '',
  code: '',
  weighting: 1,
  inCertificates: true,
  inGPA: true,
  active: true
})

const courseTypeForm = ref({
  id: 0,
  name: '',
  code: '',
  description: '',
  defaultHours: 2,
  active: true
})

const mappingForm = ref({
  id: 0,
  subject: '',
  teacher: '',
  hoursPerWeek: 2,
  subjectType: '',
  courseType: ''
})

// Configuration tabs
const configTabs = [
  { id: 'tables', name: language.value === 'de' ? 'Tabellenpflege' : 'Table Administration', icon: Database },
  { id: 'grades', name: language.value === 'de' ? 'Notenskalen' : 'Grade Scales', icon: Award },
  { id: 'subjects', name: language.value === 'de' ? 'Fach- & Kurstypen' : 'Subject & Course Types', icon: BookOpen },
  { id: 'reports', name: language.value === 'de' ? 'Berichtseinstellungen' : 'Report Settings', icon: FileText },
  { id: 'rights', name: language.value === 'de' ? 'Berechtigungen' : 'Rights Management', icon: Lock }
]

// Sample data for tables
const systemTables = [
  { id: 'classes', name: language.value === 'de' ? 'Klassen' : 'Classes' },
  { id: 'semesters', name: language.value === 'de' ? 'Semester' : 'Semesters' },
  { id: 'religions', name: language.value === 'de' ? 'Religionen' : 'Religions' },
  { id: 'nationalities', name: language.value === 'de' ? 'Nationalitäten' : 'Nationalities' },
  { id: 'citizenship', name: language.value === 'de' ? 'Staatsangehörigkeiten' : 'Citizenship Status' },
  { id: 'subject_types', name: language.value === 'de' ? 'Fachtypen' : 'Subject Types' },
  { id: 'school_types', name: language.value === 'de' ? 'Schultypen' : 'School Types' },
  { id: 'course_codes', name: language.value === 'de' ? 'Kurscodes' : 'Course Codes' },
  { id: 'disability_reasons', name: language.value === 'de' ? 'Behinderungsgründe' : 'Disability Reasons' },
  { id: 'grade_notations', name: language.value === 'de' ? 'Notenbezeichnungen' : 'Grade Notations' }
]

// Sample data for table entries
const tableEntries = {
  classes: [
    { id: 1, name: 'Class 10A', code: '10A', order: 1, active: true },
    { id: 2, name: 'Class 10B', code: '10B', order: 2, active: true },
    { id: 3, name: 'Class 11A', code: '11A', order: 3, active: true },
    { id: 4, name: 'Class 9B', code: '9B', order: 4, active: true },
    { id: 5, name: 'Class 8A', code: '8A', order: 5, active: false }
  ],
  semesters: [
    { id: 1, name: 'Fall Semester 2023/2024', code: 'FS2324', order: 1, active: true },
    { id: 2, name: 'Spring Semester 2023/2024', code: 'SS2324', order: 2, active: true },
    { id: 3, name: 'Fall Semester 2022/2023', code: 'FS2223', order: 3, active: false }
  ],
  religions: [
    { id: 1, name: 'Christianity', code: 'CHR', order: 1, active: true },
    { id: 2, name: 'Islam', code: 'ISL', order: 2, active: true },
    { id: 3, name: 'Judaism', code: 'JUD', order: 3, active: true },
    { id: 4, name: 'Buddhism', code: 'BUD', order: 4, active: true },
    { id: 5, name: 'Hinduism', code: 'HIN', order: 5, active: true },
    { id: 6, name: 'None', code: 'NON', order: 6, active: true }
  ],
  nationalities: [
    { id: 1, name: 'German', code: 'DE', order: 1, active: true },
    { id: 2, name: 'French', code: 'FR', order: 2, active: true },
    { id: 3, name: 'Italian', code: 'IT', order: 3, active: true },
    { id: 4, name: 'Spanish', code: 'ES', order: 4, active: true },
    { id: 5, name: 'Turkish', code: 'TR', order: 5, active: true }
  ],
  citizenship: [
    { id: 1, name: 'Citizen', code: 'CIT', order: 1, active: true },
    { id: 2, name: 'Permanent Resident', code: 'PR', order: 2, active: true },
    { id: 3, name: 'Temporary Resident', code: 'TR', order: 3, active: true },
    { id: 4, name: 'Refugee', code: 'REF', order: 4, active: true },
    { id: 5, name: 'Asylum Seeker', code: 'AS', order: 5, active: true }
  ],
  subject_types: [
    { id: 1, name: 'Regular', code: 'REG', order: 1, active: true },
    { id: 2, name: 'Elective', code: 'ELE', order: 2, active: true },
    { id: 3, name: 'Supplementary', code: 'SUP', order: 3, active: true },
    { id: 4, name: 'Compulsory', code: 'COM', order: 4, active: true }
  ],
  school_types: [
    { id: 1, name: 'Gymnasium', code: 'GYM', order: 1, active: true },
    { id: 2, name: 'Realschule', code: 'RS', order: 2, active: true },
    { id: 3, name: 'Hauptschule', code: 'HS', order: 3, active: true },
    { id: 4, name: 'Gesamtschule', code: 'GS', order: 4, active: true },
    { id: 5, name: 'Grundschule', code: 'GRU', order: 5, active: true }
  ],
  course_codes: [
    { id: 1, name: 'Basic Course', code: 'G1', order: 1, active: true },
    { id: 2, name: 'Advanced Course', code: 'G2', order: 2, active: true },
    { id: 3, name: 'Performance Course', code: 'L1', order: 3, active: true }
  ],
  disability_reasons: [
    { id: 1, name: 'Physical Disability', code: 'PHY', order: 1, active: true },
    { id: 2, name: 'Learning Disability', code: 'LRN', order: 2, active: true },
    { id: 3, name: 'Visual Impairment', code: 'VIS', order: 3, active: true },
    { id: 4, name: 'Hearing Impairment', code: 'HEA', order: 4, active: true },
    { id: 5, name: 'Other', code: 'OTH', order: 5, active: true }
  ],
  grade_notations: [
    { id: 1, name: 'Numeric (1-6)', code: 'NUM', order: 1, active: true },
    { id: 2, name: 'Points (15-0)', code: 'PTS', order: 2, active: true },
    { id: 3, name: 'Letters (A-F)', code: 'LET', order: 3, active: true },
    { id: 4, name: 'Descriptive', code: 'DESC', order: 4, active: true }
  ]
}

// Sample data for grade systems
const gradeSystems = [
  { id: 1, name: 'German Standard (1-6)', type: 'numeric', description: 'Standard German grading system with 1 being the best grade', isDefault: true },
  { id: 2, name: 'Points System (15-0)', type: 'points', description: 'Upper secondary point system with 15 being the best grade', isDefault: false },
  { id: 3, name: 'Letter Grades (A-F)', type: 'letters', description: 'International letter grading system with A being the best grade', isDefault: false },
  { id: 4, name: 'Descriptive Evaluation', type: 'descriptive', description: 'Text-based evaluation for primary school', isDefault: false }
]

// Sample data for grade values
const gradeValues = ref<Record<number, Array<{
  id: number
  value: string
  description: string
  minValue: number
  maxValue: number
  isPassing: boolean
}>>>({
  1: [
    { id: 1, value: 'A+', description: 'Excellent', minValue: 95, maxValue: 100, isPassing: true },
    { id: 2, value: 'A', description: 'Very Good', minValue: 90, maxValue: 94, isPassing: true },
    { id: 3, value: 'B+', description: 'Good', minValue: 85, maxValue: 89, isPassing: true },
    { id: 4, value: 'B', description: 'Satisfactory', minValue: 80, maxValue: 84, isPassing: true },
    { id: 5, value: 'C+', description: 'Below Average', minValue: 75, maxValue: 79, isPassing: true },
    { id: 6, value: 'C', description: 'Poor', minValue: 70, maxValue: 74, isPassing: true },
    { id: 7, value: 'F', description: 'Fail', minValue: 0, maxValue: 69, isPassing: false }
  ],
  2: [
    { id: 1, value: '1', description: 'Very Good', minValue: 90, maxValue: 100, isPassing: true },
    { id: 2, value: '2', description: 'Good', minValue: 80, maxValue: 89, isPassing: true },
    { id: 3, value: '3', description: 'Satisfactory', minValue: 70, maxValue: 79, isPassing: true },
    { id: 4, value: '4', description: 'Sufficient', minValue: 60, maxValue: 69, isPassing: true },
    { id: 5, value: '5', description: 'Insufficient', minValue: 50, maxValue: 59, isPassing: false },
    { id: 6, value: '6', description: 'Fail', minValue: 0, maxValue: 49, isPassing: false }
  ],
  3: [
    { id: 1, value: '15', description: 'Excellent', minValue: 95, maxValue: 100, isPassing: true },
    { id: 2, value: '14', description: 'Very Good', minValue: 90, maxValue: 94, isPassing: true },
    { id: 3, value: '13', description: 'Good', minValue: 85, maxValue: 89, isPassing: true },
    { id: 4, value: '12', description: 'Satisfactory', minValue: 80, maxValue: 84, isPassing: true },
    { id: 5, value: '11', description: 'Below Average', minValue: 75, maxValue: 79, isPassing: true },
    { id: 6, value: '10', description: 'Poor', minValue: 70, maxValue: 74, isPassing: true },
    { id: 7, value: '0', description: 'Fail', minValue: 0, maxValue: 69, isPassing: false }
  ],
  4: [
    { id: 1, value: 'A', description: 'Excellent', minValue: 90, maxValue: 100, isPassing: true },
    { id: 2, value: 'B', description: 'Good', minValue: 80, maxValue: 89, isPassing: true },
    { id: 3, value: 'C', description: 'Satisfactory', minValue: 70, maxValue: 79, isPassing: true },
    { id: 4, value: 'D', description: 'Below Average', minValue: 60, maxValue: 69, isPassing: true },
    { id: 5, value: 'F', description: 'Fail', minValue: 0, maxValue: 59, isPassing: false }
  ]
})

// Sample data for subject types
const subjectTypes = [
  { id: 1, name: 'Regular', code: 'REG', weighting: 1.0, inCertificates: true, inGPA: true, active: true },
  { id: 2, name: 'Elective', code: 'ELE', weighting: 0.8, inCertificates: true, inGPA: true, active: true },
  { id: 3, name: 'Supplementary', code: 'SUP', weighting: 0.5, inCertificates: false, inGPA: false, active: true },
  { id: 4, name: 'Compulsory', code: 'COM', weighting: 1.2, inCertificates: true, inGPA: true, active: true }
]

// Sample data for course types
const courseTypes = [
  { id: 1, name: 'Basic Course', code: 'G1', description: 'Basic level course', defaultHours: 2, active: true },
  { id: 2, name: 'Advanced Course', code: 'G2', description: 'Advanced level course', defaultHours: 3, active: true },
  { id: 3, name: 'Performance Course', code: 'L1', description: 'High performance course', defaultHours: 4, active: true }
]

// Sample data for subject mappings
const subjectMappings = [
  { id: 1, subject: 'Mathematics', teacher: 'Dr. Thomas Weber', hoursPerWeek: 5, subjectType: 'Regular', courseType: 'Advanced Course' },
  { id: 2, subject: 'Physics', teacher: 'Prof. Michael Mueller', hoursPerWeek: 3, subjectType: 'Regular', courseType: 'Basic Course' },
  { id: 3, subject: 'German', teacher: 'Ms. Sarah Schmidt', hoursPerWeek: 4, subjectType: 'Compulsory', courseType: 'Basic Course' },
  { id: 4, subject: 'English', teacher: 'Ms. Sarah Schmidt', hoursPerWeek: 3, subjectType: 'Compulsory', courseType: 'Basic Course' }
]

// Sample data for report types
const reportTypes = [
  { id: 1, name: language.value === 'de' ? 'Halbjahreszeugnis' : 'Mid-Year Report Card' },
  { id: 2, name: language.value === 'de' ? 'Jahreszeugnis' : 'End-Year Report Card' },
  { id: 3, name: language.value === 'de' ? 'Abschlusszeugnis' : 'Final Certificate' },
  { id: 4, name: language.value === 'de' ? 'Zwischenbericht' : 'Interim Report' }
]

// Sample data for report settings
const reportGradeSettings = [
  { id: 1, name: language.value === 'de' ? 'Mündliche Noten anzeigen' : 'Show Oral Grades', enabled: true },
  { id: 2, name: language.value === 'de' ? 'Schriftliche Noten anzeigen' : 'Show Written Grades', enabled: true },
  { id: 3, name: language.value === 'de' ? 'Endnoten anzeigen' : 'Show Final Grades', enabled: true },
  { id: 4, name: language.value === 'de' ? 'Durchschnittsnoten anzeigen' : 'Show Average Grades', enabled: false },
  { id: 5, name: language.value === 'de' ? 'Notenbeschreibungen anzeigen' : 'Show Grade Descriptions', enabled: true },
  { id: 6, name: language.value === 'de' ? 'Leere Noten ausblenden' : 'Hide Empty Grades', enabled: true }
]

const reportDisplayLogic = [
  { id: 1, name: language.value === 'de' ? 'Fachkommentare anzeigen' : 'Show Subject Comments', enabled: true },
  { id: 2, name: language.value === 'de' ? 'Verhaltensbewertungen anzeigen' : 'Show Behavior Scores', enabled: true },
  { id: 3, name: language.value === 'de' ? 'Leere Kategorien ausblenden' : 'Hide Empty Categories', enabled: true },
  { id: 4, name: language.value === 'de' ? 'Nur bestandene Fächer anzeigen' : 'Show Only Passing Subjects', enabled: false },
  { id: 5, name: language.value === 'de' ? 'Nur eingeschriebene Schüler anzeigen' : 'Show Only Enrolled Students', enabled: true },
  { id: 6, name: language.value === 'de' ? 'Nur versetzte Schüler anzeigen' : 'Show Only Promoted Students', enabled: false }
]

const reportControlFlags = {
  [language.value === 'de' ? 'Fachebene' : 'Subject Level']: [
    { id: 1, name: language.value === 'de' ? 'Nur anzeigen, wenn Schüler eingeschrieben ist' : 'Only show if student is enrolled', enabled: true },
    { id: 2, name: language.value === 'de' ? 'Leere Noten ausblenden' : 'Hide empty grades', enabled: true },
    { id: 3, name: language.value === 'de' ? 'Fachkommentare anzeigen' : 'Show subject comments', enabled: true }
  ],
  [language.value === 'de' ? 'Klassenebene' : 'Class Level']: [
    { id: 4, name: language.value === 'de' ? 'Leere Kategorien ausblenden' : 'Hide empty categories', enabled: true },
    { id: 5, name: language.value === 'de' ? 'Klassenkommentare anzeigen' : 'Show class comments', enabled: true },
    { id: 6, name: language.value === 'de' ? 'Klassenlehrer anzeigen' : 'Show class teacher', enabled: true }
  ],
  [language.value === 'de' ? 'Globale Ebene' : 'Global Level']: [
    { id: 7, name: language.value === 'de' ? 'Nur versetzte Schüler anzeigen' : 'Show only promoted students', enabled: false },
    { id: 8, name: language.value === 'de' ? 'Schullogo anzeigen' : 'Show school logo', enabled: true },
    { id: 9, name: language.value === 'de' ? 'Unterschrift anzeigen' : 'Show signature', enabled: true }
  ]
}

// Sample data for field visibility
const fieldVisibility = [
  { id: 1, name: language.value === 'de' ? 'Vorname' : 'First Name', category: language.value === 'de' ? 'Persönliche Daten' : 'Personal Data', visible: true, editable: true },
  { id: 2, name: language.value === 'de' ? 'Nachname' : 'Last Name', category: language.value === 'de' ? 'Persönliche Daten' : 'Personal Data', visible: true, editable: true },
  { id: 3, name: language.value === 'de' ? 'Geburtsdatum' : 'Date of Birth', category: language.value === 'de' ? 'Persönliche Daten' : 'Personal Data', visible: true, editable: true },
  { id: 4, name: language.value === 'de' ? 'Adresse' : 'Address', category: language.value === 'de' ? 'Kontaktdaten' : 'Contact Information', visible: true, editable: true },
  { id: 5, name: language.value === 'de' ? 'Telefon' : 'Phone', category: language.value === 'de' ? 'Kontaktdaten' : 'Contact Information', visible: true, editable: true },
  { id: 6, name: language.value === 'de' ? 'E-Mail' : 'Email', category: language.value === 'de' ? 'Kontaktdaten' : 'Contact Information', visible: true, editable: true },
  { id: 7, name: language.value === 'de' ? 'Noten' : 'Grades', category: language.value === 'de' ? 'Akademisch' : 'Academic', visible: true, editable: true },
  { id: 8, name: language.value === 'de' ? 'Anwesenheit' : 'Attendance', category: language.value === 'de' ? 'Akademisch' : 'Academic', visible: true, editable: true },
  { id: 9, name: language.value === 'de' ? 'Verhalten' : 'Behavior', category: language.value === 'de' ? 'Akademisch' : 'Academic', visible: true, editable: true },
  { id: 10, name: language.value === 'de' ? 'Medizinische Daten' : 'Medical Data', category: language.value === 'de' ? 'Gesundheit' : 'Health', visible: true, editable: false },
  { id: 11, name: language.value === 'de' ? 'Allergien' : 'Allergies', category: language.value === 'de' ? 'Gesundheit' : 'Health', visible: true, editable: false },
  { id: 12, name: language.value === 'de' ? 'Finanzielle Daten' : 'Financial Data', category: language.value === 'de' ? 'Finanzen' : 'Financial', visible: false, editable: false }
]

// Sample data for function rights
const functionRights = [
  {
    id: 1,
    name: language.value === 'de' ? 'Schülerverwaltung' : 'Student Management',
    rights: [
      { id: 101, name: language.value === 'de' ? 'Schüler anzeigen' : 'View Students', granted: true },
      { id: 102, name: language.value === 'de' ? 'Schüler hinzufügen' : 'Add Students', granted: false },
      { id: 103, name: language.value === 'de' ? 'Schüler bearbeiten' : 'Edit Students', granted: false },
      { id: 104, name: language.value === 'de' ? 'Schüler löschen' : 'Delete Students', granted: false }
    ]
  },
  {
    id: 2,
    name: language.value === 'de' ? 'Notenverwaltung' : 'Grade Management',
    rights: [
      { id: 201, name: language.value === 'de' ? 'Noten anzeigen' : 'View Grades', granted: true },
      { id: 202, name: language.value === 'de' ? 'Noten eingeben' : 'Enter Grades', granted: true },
      { id: 203, name: language.value === 'de' ? 'Noten bearbeiten' : 'Edit Grades', granted: false },
      { id: 204, name: language.value === 'de' ? 'Noten löschen' : 'Delete Grades', granted: false }
    ]
  },
  {
    id: 3,
    name: language.value === 'de' ? 'Berichte & Druck' : 'Reports & Printing',
    rights: [
      { id: 301, name: language.value === 'de' ? 'Berichte anzeigen' : 'View Reports', granted: true },
      { id: 302, name: language.value === 'de' ? 'Berichte drucken' : 'Print Reports', granted: true },
      { id: 303, name: language.value === 'de' ? 'Berichte exportieren' : 'Export Reports', granted: false },
      { id: 304, name: language.value === 'de' ? 'Korrespondenz erstellen' : 'Create Correspondence', granted: false }
    ]
  }
]

// Sample data for other entities
const roles = computed(() => [
  { value: 'schooladmin', label: language.value === 'de' ? 'Schuladministrator' : 'School Administrator' },
  { value: 'principal', label: language.value === 'de' ? 'Schulleiter' : 'Principal' },
  { value: 'teacher', label: language.value === 'de' ? 'Lehrer' : 'Teacher' },
  { value: 'student', label: language.value === 'de' ? 'Schüler' : 'Student' },
  { value: 'parent', label: language.value === 'de' ? 'Eltern' : 'Parent' }
])

const semesters = [
  { id: 1, name: 'Fall Semester 2023/2024' },
  { id: 2, name: 'Spring Semester 2023/2024' }
]

const classes = [
  { id: 1, name: 'Class 10A' },
  { id: 2, name: 'Class 10B' },
  { id: 3, name: 'Class 11A' }
]

const teachers = [
  { id: 1, name: 'Dr. Thomas Weber' },
  { id: 2, name: 'Ms. Sarah Schmidt' },
  { id: 3, name: 'Prof. Michael Mueller' }
]

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'German', 'English', 'History', 'Geography', 'Art', 'Music', 'PE']

// Utility functions
const getSelectedTableName = () => {
  const table = systemTables.find(t => t.id === selectedTable.value)
  return table ? table.name : ''
}

const getTableEntries = () => {
  return tableEntries[selectedTable.value as keyof typeof tableEntries] || []
}

const getSelectedGradeSystemName = () => {
  const system = gradeSystems.find(s => s.id.toString() === selectedGradeSystem.value)
  return system ? system.name : ''
}

const getGradeValues = () => {
  return gradeValues.value[parseInt(selectedGradeSystem.value)] || []
}

const getReportTypeName = () => {
  const report = reportTypes.find(r => r.id.toString() === selectedReportType.value)
  return report ? report.name : ''
}

const getRoleLabel = () => {
  const role = roles.value.find(r => r.value === selectedRoleForRights.value)
  return role ? role.label : ''
}

// Action functions
const saveAllSettings = () => {
  alert(language.value === 'de' ? 'Alle Einstellungen wurden gespeichert!' : 'All settings have been saved!')
}

// Table entry actions
const addTableEntry = () => {
  if (!selectedTable.value) {
    alert(language.value === 'de' ? 'Bitte wählen Sie zuerst eine Tabelle aus.' : 'Please select a table first.')
    return
  }
  
  isEditMode.value = false
  tableEntryForm.value = {
    id: 0,
    name: '',
    code: '',
    order: getTableEntries().length + 1,
    active: true
  }
  showTableEntryModal.value = true
}

const editTableEntry = (entry: any) => {
  isEditMode.value = true
  tableEntryForm.value = { ...entry }
  showTableEntryModal.value = true
}

const saveTableEntry = () => {
  const entries = tableEntries[selectedTable.value as keyof typeof tableEntries]
  
  if (isEditMode.value) {
    // Update existing entry
    const index = entries.findIndex(e => e.id === tableEntryForm.value.id)
    if (index !== -1) {
      entries[index] = { ...tableEntryForm.value }
    }
  } else {
    // Add new entry
    const newId = Math.max(0, ...entries.map(e => e.id)) + 1
    entries.push({
      ...tableEntryForm.value,
      id: newId
    })
  }
  
  showTableEntryModal.value = false
}

const toggleEntryStatus = (entry: any) => {
  entry.active = !entry.active
}

const moveEntryUp = (entry: any) => {
  const entries = tableEntries[selectedTable.value as keyof typeof tableEntries]
  const index = entries.findIndex(e => e.id === entry.id)
  
  if (index > 0) {
    // Swap order values
    const temp = entries[index].order
    entries[index].order = entries[index - 1].order
    entries[index - 1].order = temp
    
    // Sort by order
    entries.sort((a, b) => a.order - b.order)
  }
}

const moveEntryDown = (entry: any) => {
  const entries = tableEntries[selectedTable.value as keyof typeof tableEntries]
  const index = entries.findIndex(e => e.id === entry.id)
  
  if (index < entries.length - 1) {
    // Swap order values
    const temp = entries[index].order
    entries[index].order = entries[index + 1].order
    entries[index + 1].order = temp
    
    // Sort by order
    entries.sort((a, b) => a.order - b.order)
  }
}

// Grade system actions
const addGradeSystem = () => {
  isEditMode.value = false
  gradeSystemForm.value = {
    id: 0,
    name: '',
    type: 'numeric',
    description: '',
    isDefault: false
  }
  showGradeSystemModal.value = true
}

const editGradeSystem = () => {
  const system = gradeSystems.find(s => s.id.toString() === selectedGradeSystem.value)
  if (system) {
    isEditMode.value = true
    gradeSystemForm.value = { ...system }
    showGradeSystemModal.value = true
  }
}

const saveGradeSystem = () => {
  if (isEditMode.value) {
    // Update existing system
    const index = gradeSystems.findIndex(s => s.id === gradeSystemForm.value.id)
    if (index !== -1) {
      gradeSystems[index] = { ...gradeSystemForm.value }
    }
  } else {
    // Add new system
    const newId = Math.max(0, ...gradeSystems.map(s => s.id)) + 1
    gradeSystems.push({
      ...gradeSystemForm.value,
      id: newId
    })
    
    // Initialize empty grade values array
    gradeValues.value[newId] = []
  }
  
  // If this is set as default, update other systems
  if (gradeSystemForm.value.isDefault) {
    gradeSystems.forEach(system => {
      if (system.id !== gradeSystemForm.value.id) {
        system.isDefault = false
      }
    })
  }
  
  showGradeSystemModal.value = false
}

// Grade value actions
const addGradeValue = () => {
  if (!selectedGradeSystem.value) {
    alert(language.value === 'de' ? 'Bitte wählen Sie zuerst ein Notensystem aus.' : 'Please select a grade system first.')
    return
  }
  
  isEditMode.value = false
  gradeValueForm.value = {
    id: 0,
    value: '',
    description: '',
    minValue: 0,
    maxValue: 0,
    isPassing: true
  }
  showGradeValueModal.value = true
}

const editGradeValue = (value: any) => {
  isEditMode.value = true
  gradeValueForm.value = { ...value }
  showGradeValueModal.value = true
}

const saveGradeValue = () => {
  const values = gradeValues.value[parseInt(selectedGradeSystem.value)]
  
  if (isEditMode.value) {
    // Update existing value
    const index = values.findIndex(v => v.id === gradeValueForm.value.id)
    if (index !== -1) {
      values[index] = { ...gradeValueForm.value }
    }
  } else {
    // Add new value
    const newId = Math.max(0, ...values.map(v => v.id)) + 1
    values.push({
      ...gradeValueForm.value,
      id: newId
    })
  }
  
  showGradeValueModal.value = false
}

const moveGradeUp = (grade: any) => {
  const values = gradeValues.value[parseInt(selectedGradeSystem.value)]
  const index = values.findIndex(v => v.id === grade.id)
  
  if (index > 0) {
    // Swap positions
    const temp = values[index]
    values[index] = values[index - 1]
    values[index - 1] = temp
  }
}

const moveGradeDown = (grade: any) => {
  const values = gradeValues.value[parseInt(selectedGradeSystem.value)]
  const index = values.findIndex(v => v.id === grade.id)
  
  if (index < values.length - 1) {
    // Swap positions
    const temp = values[index]
    values[index] = values[index + 1]
    values[index + 1] = temp
  }
}

// Subject type actions
const addSubjectType = () => {
  if (selectedSubjectTab.value === 'types') {
    isEditMode.value = false
    subjectTypeForm.value = {
      id: 0,
      name: '',
      code: '',
      weighting: 1,
      inCertificates: true,
      inGPA: true,
      active: true
    }
    showSubjectTypeModal.value = true
  } else if (selectedSubjectTab.value === 'courses') {
    isEditMode.value = false
    courseTypeForm.value = {
      id: 0,
      name: '',
      code: '',
      description: '',
      defaultHours: 2,
      active: true
    }
    showCourseTypeModal.value = true
  } else if (selectedSubjectTab.value === 'mapping') {
    if (!selectedMappingSemester.value || !selectedMappingClass.value) {
      alert(language.value === 'de' ? 'Bitte wählen Sie zuerst ein Semester und eine Klasse aus.' : 'Please select a semester and class first.')
      return
    }
    
    isEditMode.value = false
    mappingForm.value = {
      id: 0,
      subject: '',
      teacher: '',
      hoursPerWeek: 2,
      subjectType: '',
      courseType: ''
    }
    showMappingModal.value = true
  }
}

const editSubjectType = (type: any) => {
  isEditMode.value = true
  subjectTypeForm.value = { ...type }
  showSubjectTypeModal.value = true
}

const saveSubjectType = () => {
  if (isEditMode.value) {
    // Update existing type
    const index = subjectTypes.findIndex(t => t.id === subjectTypeForm.value.id)
    if (index !== -1) {
      subjectTypes[index] = { ...subjectTypeForm.value }
    }
  } else {
    // Add new type
    const newId = Math.max(0, ...subjectTypes.map(t => t.id)) + 1
    subjectTypes.push({
      ...subjectTypeForm.value,
      id: newId
    })
  }
  
  showSubjectTypeModal.value = false
}

const toggleSubjectTypeStatus = (type: any) => {
  type.active = !type.active
}

// Course type actions
const editCourseType = (type: any) => {
  isEditMode.value = true
  courseTypeForm.value = { ...type }
  showCourseTypeModal.value = true
}

const saveCourseType = () => {
  if (isEditMode.value) {
    // Update existing type
    const index = courseTypes.findIndex(t => t.id === courseTypeForm.value.id)
    if (index !== -1) {
      courseTypes[index] = { ...courseTypeForm.value }
    }
  } else {
    // Add new type
    const newId = Math.max(0, ...courseTypes.map(t => t.id)) + 1
    courseTypes.push({
      ...courseTypeForm.value,
      id: newId
    })
  }
  
  showCourseTypeModal.value = false
}

const toggleCourseTypeStatus = (type: any) => {
  type.active = !type.active
}

// Mapping actions
const addMapping = () => {
  if (!selectedMappingSemester.value || !selectedMappingClass.value) {
    alert(language.value === 'de' ? 'Bitte wählen Sie zuerst ein Semester und eine Klasse aus.' : 'Please select a semester and class first.')
    return
  }
  
  isEditMode.value = false
  mappingForm.value = {
    id: 0,
    subject: '',
    teacher: '',
    hoursPerWeek: 2,
    subjectType: '',
    courseType: ''
  }
  showMappingModal.value = true
}

const editMapping = (mapping: any) => {
  isEditMode.value = true
  mappingForm.value = { ...mapping }
  showMappingModal.value = true
}

const saveMapping = () => {
  if (isEditMode.value) {
    // Update existing mapping
    const index = subjectMappings.findIndex(m => m.id === mappingForm.value.id)
    if (index !== -1) {
      subjectMappings[index] = { ...mappingForm.value }
    }
  } else {
    // Add new mapping
    const newId = Math.max(0, ...subjectMappings.map(m => m.id)) + 1
    subjectMappings.push({
      ...mappingForm.value,
      id: newId
    })
  }
  
  showMappingModal.value = false
}

const deleteMapping = (mapping: any) => {
  const index = subjectMappings.findIndex(m => m.id === mapping.id)
  if (index !== -1) {
    subjectMappings.splice(index, 1)
  }
}
</script>
