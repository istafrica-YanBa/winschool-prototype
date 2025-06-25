<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Anwesenheit & Verhalten' : 'Attendance & Behavior' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ language === 'de' ? 'Verfolgen Sie Anwesenheit, Verspätungen und Verhaltensnotizen' : 'Track attendance, tardiness, and behavior notes' }}
        </p>
      </div>
      <div class="flex space-x-2">
        <button @click="exportData" class="btn-secondary flex items-center">
          <Download class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Exportieren' : 'Export' }}
        </button>
        <button @click="showConfigModal = true" class="btn-primary flex items-center">
          <Settings class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Konfigurieren' : 'Configure' }}
        </button>
      </div>
    </div>

    <!-- Class Selection and Date Picker -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Klasse' : 'Class' }}
          </label>
          <select 
            v-model="selectedClass" 
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Klasse wählen' : 'Select Class' }}</option>
            <option v-for="class_ in classes" :key="class_.id" :value="class_.id">{{ class_.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Datum' : 'Date' }}
          </label>
          <input 
            v-model="selectedDate" 
            type="date" 
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Unterrichtsstunde' : 'Period' }}
          </label>
          <select 
            v-model="selectedPeriod" 
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Stunde wählen' : 'Select Period' }}</option>
            <option v-for="period in periods" :key="period.id" :value="period.id">{{ period.name }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Lock Banner (if applicable) -->
    <div v-if="isLocked" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-center">
      <AlertTriangle class="h-5 w-5 text-yellow-600 mr-3" />
      <div>
        <p class="font-medium text-yellow-800 dark:text-yellow-200">
          {{ language === 'de' ? 'Bearbeitung gesperrt' : 'Editing Disabled' }}
        </p>
        <p class="text-sm text-yellow-600 dark:text-yellow-300">
          {{ language === 'de' ? 'Die Bearbeitung ist nach 14:00 Uhr nicht mehr möglich.' : 'Editing is disabled after 2:00 PM.' }}
        </p>
      </div>
    </div>

    <!-- Attendance Grid -->
    <div v-if="selectedClass && selectedDate && selectedPeriod" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Anwesenheitserfassung' : 'Attendance Tracking' }}
        </h2>
        <div class="flex space-x-2">
          <button @click="markAllPresent" class="btn-secondary text-sm">
            {{ language === 'de' ? 'Alle anwesend' : 'Mark All Present' }}
          </button>
          <button @click="saveAttendance" class="btn-primary text-sm">
            {{ language === 'de' ? 'Speichern' : 'Save' }}
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-700">
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Schüler' : 'Student' }}
              </th>
              <th v-for="code in attendanceCodes" :key="code.id" class="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ code.name }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Notiz' : 'Note' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id" class="border-b border-gray-100 dark:border-gray-700">
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img :src="student.avatar" :alt="student.name" class="h-8 w-8 rounded-full object-cover mr-3" />
                  <span class="font-medium text-gray-900 dark:text-white">{{ student.name }}</span>
                </div>
              </td>
              <td v-for="code in attendanceCodes" :key="`${student.id}-${code.id}`" class="text-center py-3 px-4">
                <div class="flex justify-center">
                  <input 
                    type="radio" 
                    :id="`${student.id}-${code.id}`" 
                    :name="`attendance-${student.id}`" 
                    :value="code.id" 
                    v-model="student.attendanceStatus"
                    :disabled="isLocked"
                    :aria-label="`Mark ${student.name} as ${code.name}`"
                  />
                </div>
              </td>
              <td class="py-3 px-4">
                <input 
                  type="text" 
                  v-model="student.note" 
                  :disabled="isLocked"
                  class="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  :placeholder="language === 'de' ? 'Notiz hinzufügen...' : 'Add note...'"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
      <Calendar class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        {{ language === 'de' ? 'Wählen Sie eine Klasse, ein Datum und eine Unterrichtsstunde' : 'Select a class, date, and period' }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        {{ language === 'de' ? 'Um die Anwesenheit zu erfassen, wählen Sie bitte die erforderlichen Felder oben aus.' : 'To track attendance, please select the required fields above.' }}
      </p>
    </div>

    <!-- Behavior Notes -->
    <div v-if="selectedClass" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Verhaltensnotizen' : 'Behavior Notes' }}
        </h2>
        <button @click="showBehaviorModal = true" class="btn-primary text-sm">
          {{ language === 'de' ? 'Notiz hinzufügen' : 'Add Note' }}
        </button>
      </div>

      <div class="space-y-4">
        <div v-for="note in behaviorNotes" :key="note.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center">
              <img :src="note.studentAvatar" :alt="note.studentName" class="h-8 w-8 rounded-full object-cover mr-3" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ note.studentName }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ note.date }} • {{ note.teacher }}</p>
              </div>
            </div>
            <span :class="getBehaviorTypeColor(note.type)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ note.type }}
            </span>
          </div>
          <p class="text-gray-600 dark:text-gray-400">{{ note.content }}</p>
          <div class="flex justify-end mt-2">
            <button @click="editBehaviorNote(note)" class="text-primary-600 hover:text-primary-800 text-sm">
              {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
            </button>
          </div>
        </div>

        <div v-if="behaviorNotes.length === 0" class="text-center py-8">
          <ClipboardCheck class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 dark:text-gray-400">
            {{ language === 'de' ? 'Keine Verhaltensnotizen vorhanden' : 'No behavior notes available' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div v-if="selectedClass" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Attendance Statistics -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {{ language === 'de' ? 'Anwesenheitsstatistik' : 'Attendance Statistics' }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">92%</p>
            <p class="text-sm text-green-800 dark:text-green-200">{{ language === 'de' ? 'Anwesend' : 'Present' }}</p>
          </div>
          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
            <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">5%</p>
            <p class="text-sm text-yellow-800 dark:text-yellow-200">{{ language === 'de' ? 'Entschuldigt' : 'Excused' }}</p>
          </div>
          <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">3%</p>
            <p class="text-sm text-red-800 dark:text-red-200">{{ language === 'de' ? 'Unentschuldigt' : 'Unexcused' }}</p>
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="student in attendanceAlerts" :key="student.id" class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div class="flex items-start">
              <AlertTriangle class="h-5 w-5 text-red-600 mt-0.5 mr-3" />
              <div class="flex-1">
                <p class="font-medium text-red-800 dark:text-red-200">{{ student.name }}</p>
                <p class="text-sm text-red-600 dark:text-red-400">{{ student.alert }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Behavior Statistics -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {{ language === 'de' ? 'Verhaltensstatistik' : 'Behavior Statistics' }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">15</p>
            <p class="text-sm text-green-800 dark:text-green-200">{{ language === 'de' ? 'Positiv' : 'Positive' }}</p>
          </div>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">8</p>
            <p class="text-sm text-blue-800 dark:text-blue-200">{{ language === 'de' ? 'Neutral' : 'Neutral' }}</p>
          </div>
          <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">3</p>
            <p class="text-sm text-red-800 dark:text-red-200">{{ language === 'de' ? 'Negativ' : 'Negative' }}</p>
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="student in behaviorAlerts" :key="student.id" class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div class="flex items-start">
              <AlertCircle class="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div class="flex-1">
                <p class="font-medium text-yellow-800 dark:text-yellow-200">{{ student.name }}</p>
                <p class="text-sm text-yellow-600 dark:text-yellow-400">{{ student.alert }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuration Modal -->
    <div v-if="showConfigModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Anwesenheits- & Verhaltenskonfiguration' : 'Attendance & Behavior Configuration' }}
            </h3>
            <button @click="showConfigModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- Attendance Codes -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Anwesenheitscodes' : 'Attendance Codes' }}
              </h4>
              <div class="space-y-3">
                <div v-for="(code, index) in configAttendanceCodes" :key="index" class="flex items-center space-x-3">
                  <input 
                    v-model="code.name" 
                    type="text" 
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <div class="relative">
                    <div 
                      :style="{ backgroundColor: code.color }" 
                      class="w-8 h-8 rounded-lg cursor-pointer"
                      @click="openColorPicker(index)"
                    ></div>
                    <input 
                      v-if="activeColorPicker === index"
                      v-model="code.color" 
                      type="color" 
                      class="absolute top-0 left-0 w-8 h-8 opacity-0 cursor-pointer"
                      @change="activeColorPicker = null"
                    />
                  </div>
                  <button @click="removeAttendanceCode(index)" class="text-red-600 hover:text-red-800">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
                <button @click="addAttendanceCode" class="text-primary-600 hover:text-primary-800 text-sm">
                  + {{ language === 'de' ? 'Code hinzufügen' : 'Add Code' }}
                </button>
              </div>
            </div>

            <!-- Input Lock Scheduler -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Eingabesperre-Planer' : 'Input Lock Scheduler' }}
              </h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Sperrzeitpunkt' : 'Lock Time' }}
                  </label>
                  <input 
                    v-model="configLockTime" 
                    type="time" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Sperrtyp' : 'Lock Type' }}
                  </label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="configLockType" 
                        value="daily" 
                        class="mr-2"
                      />
                      <span class="text-sm text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Täglich' : 'Daily' }}
                      </span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="configLockType" 
                        value="term" 
                        class="mr-2"
                      />
                      <span class="text-sm text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Semesterende' : 'End of Term' }}
                      </span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="configLockType" 
                        value="custom" 
                        class="mr-2"
                      />
                      <span class="text-sm text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Benutzerdefinierter Zeitraum' : 'Custom Date Range' }}
                      </span>
                    </label>
                  </div>
                </div>
                <div v-if="configLockType === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ language === 'de' ? 'Startdatum' : 'Start Date' }}
                    </label>
                    <input 
                      v-model="configLockStartDate" 
                      type="date" 
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ language === 'de' ? 'Enddatum' : 'End Date' }}
                    </label>
                    <input 
                      v-model="configLockEndDate" 
                      type="date" 
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- GDPR Settings -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'DSGVO-Einstellungen' : 'GDPR Settings' }}
              </h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Aufbewahrungszeitraum' : 'Retention Period' }}
                  </label>
                  <select 
                    v-model="configRetentionPeriod" 
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="1">{{ language === 'de' ? '1 Jahr' : '1 Year' }}</option>
                    <option value="2">{{ language === 'de' ? '2 Jahre' : '2 Years' }}</option>
                    <option value="5">{{ language === 'de' ? '5 Jahre' : '5 Years' }}</option>
                    <option value="10">{{ language === 'de' ? '10 Jahre' : '10 Years' }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Nach Ablauf' : 'After Expiry' }}
                  </label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="configExpiryAction" 
                        value="anonymize" 
                        class="mr-2"
                      />
                      <span class="text-sm text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Anonymisieren' : 'Anonymize' }}
                      </span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="configExpiryAction" 
                        value="delete" 
                        class="mr-2"
                      />
                      <span class="text-sm text-gray-900 dark:text-white">
                        {{ language === 'de' ? 'Löschen' : 'Delete' }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showConfigModal = false" class="btn-secondary">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button @click="saveConfiguration" class="btn-primary">
              {{ language === 'de' ? 'Speichern' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Behavior Note Modal -->
    <div v-if="showBehaviorModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Verhaltensnotiz hinzufügen' : 'Add Behavior Note' }}
            </h3>
            <button @click="showBehaviorModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="addBehaviorNote" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Schüler' : 'Student' }}
              </label>
              <select 
                v-model="behaviorForm.studentId" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Schüler wählen' : 'Select Student' }}</option>
                <option v-for="student in students" :key="student.id" :value="student.id">{{ student.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Notiztyp' : 'Note Type' }}
              </label>
              <select 
                v-model="behaviorForm.type" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Typ wählen' : 'Select Type' }}</option>
                <option value="Positive">{{ language === 'de' ? 'Positiv' : 'Positive' }}</option>
                <option value="Neutral">{{ language === 'de' ? 'Neutral' : 'Neutral' }}</option>
                <option value="Negative">{{ language === 'de' ? 'Negativ' : 'Negative' }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Notiz' : 'Note' }}
              </label>
              <textarea 
                v-model="behaviorForm.content" 
                rows="4" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                :placeholder="language === 'de' ? 'Verhaltensnotiz eingeben...' : 'Enter behavior note...'"
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showBehaviorModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Hinzufügen' : 'Add' }}
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
  Download, Settings, AlertTriangle, X, Trash2, Calendar, 
  ClipboardCheck, AlertCircle, CheckCircle
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State variables
const selectedClass = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedPeriod = ref('')
const showConfigModal = ref(false)
const showBehaviorModal = ref(false)
const activeColorPicker = ref<number | null>(null)

// Configuration state
const configAttendanceCodes = ref([
  { id: 'present', name: language.value === 'de' ? 'Anwesend' : 'Present', color: '#10b981' },
  { id: 'excused', name: language.value === 'de' ? 'Entschuldigt' : 'Excused', color: '#f59e0b' },
  { id: 'unexcused', name: language.value === 'de' ? 'Unentschuldigt' : 'Unexcused', color: '#ef4444' },
  { id: 'late', name: language.value === 'de' ? 'Verspätet' : 'Late', color: '#3b82f6' },
  { id: 'left_early', name: language.value === 'de' ? 'Früher gegangen' : 'Left Early', color: '#8b5cf6' }
])
const configLockTime = ref('14:00')
const configLockType = ref('daily')
const configLockStartDate = ref('')
const configLockEndDate = ref('')
const configRetentionPeriod = ref('5')
const configExpiryAction = ref('anonymize')

// Behavior note form
const behaviorForm = ref({
  studentId: '',
  type: '',
  content: ''
})

// Mock data
const classes = ref([
  { id: 1, name: 'Class 10A' },
  { id: 2, name: 'Class 9B' },
  { id: 3, name: 'Class 11A' }
])

const periods = ref([
  { id: 1, name: '1st Period (8:00 - 8:45)' },
  { id: 2, name: '2nd Period (8:50 - 9:35)' },
  { id: 3, name: '3rd Period (9:55 - 10:40)' },
  { id: 4, name: '4th Period (10:45 - 11:30)' },
  { id: 5, name: '5th Period (11:50 - 12:35)' },
  { id: 6, name: '6th Period (12:40 - 13:25)' }
])

const students = ref([
  { 
    id: 1, 
    name: 'Emma Müller', 
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    attendanceStatus: 'present',
    note: ''
  },
  { 
    id: 2, 
    name: 'Liam Weber', 
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    attendanceStatus: 'present',
    note: ''
  },
  { 
    id: 3, 
    name: 'Sophie Schmidt', 
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    attendanceStatus: 'present',
    note: ''
  },
  { 
    id: 4, 
    name: 'Noah Fischer', 
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    attendanceStatus: 'present',
    note: ''
  },
  { 
    id: 5, 
    name: 'Mia Wagner', 
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    attendanceStatus: 'present',
    note: ''
  }
])

const behaviorNotes = ref([
  {
    id: 1,
    studentName: 'Emma Müller',
    studentAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    date: '2024-03-15',
    teacher: 'Dr. Thomas Weber',
    type: 'Positive',
    content: 'Excellent participation in class discussion today. Emma provided thoughtful insights on the topic.'
  },
  {
    id: 2,
    studentName: 'Liam Weber',
    studentAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    date: '2024-03-14',
    teacher: 'Ms. Sarah Schmidt',
    type: 'Neutral',
    content: 'Completed all assignments but seemed distracted during group work.'
  },
  {
    id: 3,
    studentName: 'Noah Fischer',
    studentAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    date: '2024-03-13',
    teacher: 'Dr. Thomas Weber',
    type: 'Negative',
    content: 'Disrupted class multiple times and refused to participate in the assigned activity.'
  }
])

const attendanceAlerts = ref([
  {
    id: 1,
    name: 'Noah Fischer',
    alert: language.value === 'de' ? '3 unentschuldigte Fehltage in diesem Monat' : '3 unexcused absences this month'
  },
  {
    id: 2,
    name: 'Mia Wagner',
    alert: language.value === 'de' ? 'Häufige Verspätungen (5 in den letzten 2 Wochen)' : 'Frequent tardiness (5 in the last 2 weeks)'
  }
])

const behaviorAlerts = ref([
  {
    id: 1,
    name: 'Noah Fischer',
    alert: language.value === 'de' ? '3 negative Verhaltensnotizen in diesem Monat' : '3 negative behavior notes this month'
  }
])

// Computed properties
const attendanceCodes = computed(() => configAttendanceCodes.value)

const isLocked = computed(() => {
  // For demo purposes, we'll just check if the current time is after the lock time
  const now = new Date()
  const [hours, minutes] = configLockTime.value.split(':').map(Number)
  return now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= minutes)
})

// Methods
const markAllPresent = () => {
  students.value.forEach(student => {
    student.attendanceStatus = 'present'
  })
}

const saveAttendance = () => {
  // Here you would typically send the attendance data to your backend
  alert(language.value === 'de' ? 'Anwesenheit gespeichert!' : 'Attendance saved!')
}

const addAttendanceCode = () => {
  configAttendanceCodes.value.push({
    id: `code_${configAttendanceCodes.value.length + 1}`,
    name: '',
    color: '#6b7280'
  })
}

const removeAttendanceCode = (index: number) => {
  configAttendanceCodes.value.splice(index, 1)
}

const openColorPicker = (index: number) => {
  activeColorPicker.value = index
}

const saveConfiguration = () => {
  showConfigModal.value = false
  alert(language.value === 'de' ? 'Konfiguration gespeichert!' : 'Configuration saved!')
}

const addBehaviorNote = () => {
  const student = students.value.find(s => s.id.toString() === behaviorForm.value.studentId)
  if (!student) return

  behaviorNotes.value.unshift({
    id: behaviorNotes.value.length + 1,
    studentName: student.name,
    studentAvatar: student.avatar,
    date: new Date().toISOString().split('T')[0],
    teacher: 'Dr. Thomas Weber', // This would be the current user
    type: behaviorForm.value.type,
    content: behaviorForm.value.content
  })

  showBehaviorModal.value = false
  behaviorForm.value = {
    studentId: '',
    type: '',
    content: ''
  }
}

const editBehaviorNote = (note: any) => {
  alert(`${language.value === 'de' ? 'Notiz bearbeiten' : 'Edit note'}: ${note.content}`)
}

const exportData = () => {
  alert(language.value === 'de' ? 'Daten werden exportiert...' : 'Exporting data...')
}

const getBehaviorTypeColor = (type: string) => {
  switch (type) {
    case 'Positive':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Neutral':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Negative':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>
