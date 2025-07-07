<template>
  <div class="timetable bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <Calendar class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Stundenplan' : 'Timetable' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Stundenpläne und Zeitpläne' : 'Manage schedules and timetables' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <router-link to="/dashboard/support" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <LifeBuoy class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Support' : 'Support' }}
          </router-link>
          <button @click="generateTimetable" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <RefreshCw class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Stundenplan generieren' : 'Generate Timetable' }}
          </button>
          <button @click="exportTimetable" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Download class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Exportieren' : 'Export' }}
          </button>
        </div>
      </div>

      <!-- Timetable Builder Controls -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <select v-model="selectedWeek" class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50">
            <option>{{ language === 'de' ? 'Diese Woche' : 'This Week' }}</option>
            <option>{{ language === 'de' ? 'Nächste Woche' : 'Next Week' }}</option>
            <option>{{ language === 'de' ? 'Letzte Woche' : 'Last Week' }}</option>
          </select>
          <select v-model="selectedClass" class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50">
            <option value="">{{ language === 'de' ? 'Alle Klassen' : 'All Classes' }}</option>
            <option v-for="class_ in classes" :key="class_" :value="class_">{{ class_ }}</option>
          </select>
          <select v-model="selectedTeacher" class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50">
            <option value="">{{ language === 'de' ? 'Alle Lehrer' : 'All Teachers' }}</option>
            <option v-for="teacher in teachers" :key="teacher" :value="teacher">{{ teacher }}</option>
          </select>
          <select v-model="selectedRoom" class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50">
            <option value="">{{ language === 'de' ? 'Alle Räume' : 'All Rooms' }}</option>
            <option v-for="room in rooms" :key="room" :value="room">{{ room }}</option>
          </select>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600 dark:text-slate-400">{{ language === 'de' ? 'Konflikte:' : 'Conflicts:' }}</span>
            <span :class="conflicts.length > 0 ? 'text-red-600' : 'text-green-600'" class="font-semibold">
              {{ conflicts.length }}
            </span>
          </div>
        </div>

        <!-- Conflict Alerts -->
        <div v-if="conflicts.length > 0" class="mb-6">
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div class="flex items-center mb-2">
              <AlertTriangle class="h-5 w-5 text-red-600 mr-2" />
              <h3 class="font-medium text-red-800 dark:text-red-200">
                {{ language === 'de' ? 'Stundenplan-Konflikte erkannt' : 'Timetable Conflicts Detected' }}
              </h3>
            </div>
            <div class="space-y-2">
              <div v-for="conflict in conflicts" :key="conflict.id" class="text-sm text-red-700 dark:text-red-300">
                • {{ conflict.description }} ({{ conflict.time }})
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Drag & Drop Timetable Grid -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-slate-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50">
              {{ language === 'de' ? 'Interaktiver Stundenplan' : 'Interactive Timetable' }}
            </h2>
            <div class="flex space-x-2">
              <button @click="saveChanges" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                {{ language === 'de' ? 'Änderungen speichern' : 'Save Changes' }}
              </button>
              <button @click="resetTimetable" class="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors text-sm">
                {{ language === 'de' ? 'Zurücksetzen' : 'Reset' }}
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider w-24">
                  {{ language === 'de' ? 'Zeit' : 'Time' }}
                </th>
                <th v-for="day in weekDays" :key="day" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  {{ day }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="timeSlot in timeSlots" :key="timeSlot" class="hover:bg-gray-50 dark:hover:bg-slate-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-50">
                  {{ timeSlot }}
                </td>
                <td v-for="day in weekDays" :key="`${timeSlot}-${day}`" class="px-6 py-4 whitespace-nowrap">
                  <div 
                    class="min-h-[80px] border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-lg p-2 transition-colors hover:border-primary-300"
                    @drop="handleDrop($event, timeSlot, day)"
                    @dragover.prevent
                    @dragenter.prevent
                  >
                    <div v-if="getClassForSlot(timeSlot, day)" 
                         class="p-3 rounded-lg border-l-4 cursor-move relative"
                         :class="getClassColor(getClassForSlot(timeSlot, day))"
                         draggable="true"
                         @dragstart="handleDragStart($event, getClassForSlot(timeSlot, day))"
                    >
                      <div class="text-sm font-medium text-gray-900 dark:text-slate-50">
                        {{ getClassForSlot(timeSlot, day)?.subject }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-slate-400">
                        {{ getClassForSlot(timeSlot, day)?.class }} • {{ getClassForSlot(timeSlot, day)?.room }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-slate-400">
                        {{ getClassForSlot(timeSlot, day)?.teacher }}
                      </div>
                      <!-- Conflict indicator -->
                      <div v-if="hasConflict(timeSlot, day)" class="absolute top-1 right-1">
                        <div class="group relative">
                          <AlertTriangle class="h-4 w-4 text-red-500" />
                          <!-- Tooltip -->
                          <div class="absolute z-10 w-48 p-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded shadow-lg 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                                      bottom-full right-0 mb-2 pointer-events-none">
                            {{ getConflictDescription(timeSlot, day) }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="h-full flex items-center justify-center">
                      <button @click="addClassToSlot(timeSlot, day)" class="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
                        <Plus class="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Resource Management & Analytics -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Room Utilization -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4 flex items-center">
            <Building class="h-5 w-5 mr-2 text-primary-600" />
            {{ language === 'de' ? 'Raumauslastung' : 'Room Utilization' }}
          </h3>
          <div class="space-y-3">
            <div v-for="room in roomUtilization" :key="room.name" class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-slate-400">{{ room.name }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-20 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                  <div :class="getUtilizationColor(room.utilization)" class="h-2 rounded-full" :style="{ width: room.utilization + '%' }"></div>
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-slate-50">{{ room.utilization }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Teacher Workload -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4 flex items-center">
            <Users class="h-5 w-5 mr-2 text-secondary-600" />
            {{ language === 'de' ? 'Lehrerarbeitszeit' : 'Teacher Workload' }}
          </h3>
          <div class="space-y-3">
            <div v-for="teacher in teacherWorkload" :key="teacher.name" class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-slate-400">{{ teacher.name }}</span>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-900 dark:text-slate-50">{{ teacher.hours }}h</span>
                <span :class="getWorkloadColor(teacher.hours)" class="text-xs px-2 py-1 rounded-full">
                  {{ getWorkloadStatus(teacher.hours) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Substitution Planning -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4 flex items-center">
            <RefreshCw class="h-5 w-5 mr-2 text-accent-600" />
            {{ language === 'de' ? 'Vertretungsplanung' : 'Substitution Planning' }}
          </h3>
          <div class="space-y-3">
            <div v-for="substitution in substitutions" :key="substitution.id" class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-slate-50">{{ substitution.originalTeacher }}</p>
                  <p class="text-xs text-gray-600 dark:text-slate-400">{{ substitution.subject }} - {{ substitution.class }}</p>
                </div>
                <span class="text-xs text-yellow-600 dark:text-yellow-400">{{ substitution.date }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500 dark:text-slate-500">
                  {{ language === 'de' ? 'Vertretung:' : 'Substitute:' }} {{ substitution.substituteTeacher || 'TBD' }}
                </span>
                <button @click="assignSubstitute(substitution)" class="text-xs text-primary-600 hover:text-primary-800">
                  {{ language === 'de' ? 'Zuweisen' : 'Assign' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Structuring & Optimization -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Kursstrukturierung & Optimierung' : 'Course Structuring & Optimization' }}
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Plan Frame Editor -->
          <div>
            <h3 class="font-medium text-gray-900 dark:text-slate-50 mb-4">
              {{ language === 'de' ? 'Planungsrahmen-Editor' : 'Plan Frame Editor' }}
            </h3>
            <div class="space-y-4">
              <div class="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <h4 class="font-medium text-gray-900 dark:text-slate-50 mb-2">
                  {{ language === 'de' ? 'Wochentypen' : 'Week Types' }}
                </h4>
                <div class="flex space-x-2">
                  <button :class="weekType === 'A' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'" 
                          @click="weekType = 'A'" 
                          class="px-3 py-1 rounded text-sm">
                    {{ language === 'de' ? 'Woche A' : 'Week A' }}
                  </button>
                  <button :class="weekType === 'B' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'" 
                          @click="weekType = 'B'" 
                          class="px-3 py-1 rounded text-sm">
                    {{ language === 'de' ? 'Woche B' : 'Week B' }}
                  </button>
                </div>
              </div>

              <div class="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <h4 class="font-medium text-gray-900 dark:text-slate-50 mb-2">
                  {{ language === 'de' ? 'Planungsblöcke' : 'Planning Blocks' }}
                </h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="radio" v-model="blockType" value="45min" class="mr-2">
                    <span class="text-sm text-gray-900 dark:text-slate-50">45-{{ language === 'de' ? 'Minuten-Stunden' : 'minute periods' }}</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" v-model="blockType" value="90min" class="mr-2">
                    <span class="text-sm text-gray-900 dark:text-slate-50">90-{{ language === 'de' ? 'Minuten-Blöcke' : 'minute blocks' }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Course Configuration -->
          <div>
            <h3 class="font-medium text-gray-900 dark:text-slate-50 mb-4">
              {{ language === 'de' ? 'Kurskonfiguration' : 'Course Configuration' }}
            </h3>
            <div class="space-y-4">
              <div v-for="course in courseConfigs" :key="course.id" class="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-900 dark:text-slate-50">{{ course.name }}</h4>
                  <button @click="editCourse(course)" class="text-primary-600 hover:text-primary-800">
                    <Edit class="h-4 w-4" />
                  </button>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600 dark:text-slate-400">{{ language === 'de' ? 'Wochenstunden:' : 'Weekly hours:' }}</span>
                    <span class="font-medium text-gray-900 dark:text-slate-50 ml-1">{{ course.weeklyHours }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600 dark:text-slate-400">{{ language === 'de' ? 'Raumtyp:' : 'Room type:' }}</span>
                    <span class="font-medium text-gray-900 dark:text-slate-50 ml-1">{{ course.roomType }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Exception Management -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50">
            {{ language === 'de' ? 'Ausnahmen-Management' : 'Exception Management' }}
          </h2>
          <button @click="addException" class="btn-primary text-sm flex items-center">
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Ausnahme hinzufügen' : 'Add Exception' }}
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Holidays -->
          <div>
            <h3 class="font-medium text-gray-900 dark:text-slate-50 mb-4">
              {{ language === 'de' ? 'Feiertage & Ferien' : 'Holidays & Vacations' }}
            </h3>
            <div class="space-y-3">
              <div v-for="holiday in holidays" :key="holiday.id" class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-blue-800 dark:text-blue-200">{{ holiday.name }}</h4>
                  <span class="text-xs text-blue-600 dark:text-blue-400">{{ holiday.duration }}</span>
                </div>
                <p class="text-sm text-blue-600 dark:text-blue-300">{{ holiday.date }}</p>
                <div class="flex justify-end mt-2">
                  <button @click="editException(holiday)" class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400">
                    {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Exam Blocks -->
          <div>
            <h3 class="font-medium text-gray-900 dark:text-slate-50 mb-4">
              {{ language === 'de' ? 'Prüfungsblöcke' : 'Exam Blocks' }}
            </h3>
            <div class="space-y-3">
              <div v-for="exam in examBlocks" :key="exam.id" class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-purple-800 dark:text-purple-200">{{ exam.name }}</h4>
                  <span class="text-xs text-purple-600 dark:text-purple-400">{{ exam.classes }}</span>
                </div>
                <p class="text-sm text-purple-600 dark:text-purple-300">{{ exam.date }}</p>
                <div class="flex justify-end mt-2">
                  <button @click="editException(exam)" class="text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400">
                    {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Special Events -->
          <div>
            <h3 class="font-medium text-gray-900 dark:text-slate-50 mb-4">
              {{ language === 'de' ? 'Besondere Veranstaltungen' : 'Special Events' }}
            </h3>
            <div class="space-y-3">
              <div v-for="event in specialEvents" :key="event.id" class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-green-800 dark:text-green-200">{{ event.name }}</h4>
                  <span class="text-xs text-green-600 dark:text-green-400">{{ event.type }}</span>
                </div>
                <p class="text-sm text-green-600 dark:text-green-300">{{ event.date }}</p>
                <div class="flex justify-end mt-2">
                  <button @click="editException(event)" class="text-xs text-green-600 hover:text-green-800 dark:text-green-400">
                    {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Constraints Modal -->
    <div v-if="showConstraintsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Planungseinschränkungen' : 'Planning Constraints' }}
            </h3>
            <button @click="showConstraintsModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- Hard Constraints -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Harte Einschränkungen' : 'Hard Constraints' }}
              </h4>
              <div class="space-y-3">
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Max. Stunden pro Tag (Lehrer)' : 'Max lessons per day (Teacher)' }}
                  </span>
                  <input type="number" v-model="constraints.maxLessonsPerDayTeacher" min="1" max="10" 
                         class="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm">
                </label>
                <label class="flex items-center justify-between">
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Max. Stunden pro Tag (Schüler)' : 'Max lessons per day (Student)' }}
                  </span>
                  <input type="number" v-model="constraints.maxLessonsPerDayStudent" min="1" max="10" 
                         class="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm">
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="constraints.noGapsInSchedule" class="mr-2">
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Keine Freistunden zwischen Unterricht' : 'No gaps between lessons' }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Soft Constraints -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                {{ language === 'de' ? 'Weiche Einschränkungen' : 'Soft Constraints' }}
              </h4>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input type="checkbox" v-model="constraints.preferMorningMath" class="mr-2">
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Mathematik bevorzugt am Morgen' : 'Prefer mathematics in morning' }}
                  </span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="constraints.balanceWorkload" class="mr-2">
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Arbeitsbelastung ausgleichen' : 'Balance teacher workload' }}
                  </span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="constraints.avoidLastPeriod" class="mr-2">
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Letzte Stunde vermeiden' : 'Avoid last period when possible' }}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showConstraintsModal = false" class="btn-secondary">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button @click="saveConstraints" class="btn-primary">
              {{ language === 'de' ? 'Speichern' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Class Modal -->
    <div v-if="showAddClassModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Klasse hinzufügen' : 'Add Class' }}
            </h3>
            <button @click="showAddClassModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="submitAddClass" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Fach' : 'Subject' }}
              </label>
              <select
                v-model="classForm.subject"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Fach wählen' : 'Select Subject' }}</option>
                <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Klasse' : 'Class' }}
              </label>
              <select
                v-model="classForm.class"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Klasse wählen' : 'Select Class' }}</option>
                <option v-for="class_ in classes" :key="class_" :value="class_">{{ class_ }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
              </label>
              <select
                v-model="classForm.teacher"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Lehrer wählen' : 'Select Teacher' }}</option>
                <option v-for="teacher in teachers" :key="teacher" :value="teacher">{{ teacher }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Raum' : 'Room' }}
              </label>
              <select
                v-model="classForm.room"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Raum wählen' : 'Select Room' }}</option>
                <option v-for="room in rooms" :key="room" :value="room">{{ room }}</option>
              </select>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showAddClassModal = false" class="btn-secondary">
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

    <!-- Exception Modal -->
    <div v-if="showExceptionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Ausnahme hinzufügen' : 'Add Exception' }}
            </h3>
            <button @click="showExceptionModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="submitException" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Ausnahmetyp' : 'Exception Type' }}
              </label>
              <select
                v-model="exceptionForm.type"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Typ wählen' : 'Select Type' }}</option>
                <option value="holiday">{{ language === 'de' ? 'Feiertag/Ferien' : 'Holiday/Vacation' }}</option>
                <option value="exam">{{ language === 'de' ? 'Prüfungsblock' : 'Exam Block' }}</option>
                <option value="event">{{ language === 'de' ? 'Besondere Veranstaltung' : 'Special Event' }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </label>
              <input
                v-model="exceptionForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Startdatum' : 'Start Date' }}
                </label>
                <input
                  v-model="exceptionForm.startDate"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Enddatum' : 'End Date' }}
                </label>
                <input
                  v-model="exceptionForm.endDate"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div v-if="exceptionForm.type === 'exam' || exceptionForm.type === 'event'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Betroffene Klassen' : 'Affected Classes' }}
              </label>
              <div class="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                <label v-for="class_ in classes" :key="class_" class="flex items-center">
                  <input
                    v-model="exceptionForm.affectedClasses"
                    type="checkbox"
                    :value="class_"
                    class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
                  />
                  <span class="text-sm text-gray-900 dark:text-white">{{ class_ }}</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea
                v-model="exceptionForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showExceptionModal = false" class="btn-secondary">
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

    <!-- Substitution Modal -->
    <div v-if="showSubstitutionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Vertretung zuweisen' : 'Assign Substitute' }}
            </h3>
            <button @click="showSubstitutionModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div v-if="selectedSubstitution" class="space-y-4">
            <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Originaler Lehrer:' : 'Original Teacher:' }} {{ selectedSubstitution.originalTeacher }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ selectedSubstitution.subject }} - {{ selectedSubstitution.class }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ selectedSubstitution.date }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Vertretungslehrer' : 'Substitute Teacher' }}
              </label>
              <select
                v-model="substitutionForm.teacher"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Lehrer wählen' : 'Select Teacher' }}</option>
                <option v-for="teacher in availableSubstitutes" :key="teacher" :value="teacher">{{ teacher }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Notizen' : 'Notes' }}
              </label>
              <textarea
                v-model="substitutionForm.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                :placeholder="language === 'de' ? 'Anweisungen für den Vertretungslehrer...' : 'Instructions for the substitute teacher...'"
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button @click="showSubstitutionModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button @click="confirmSubstitution" class="btn-primary">
                {{ language === 'de' ? 'Bestätigen' : 'Confirm' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Auto Schedule Modal -->
    <div v-if="showAutoScheduleModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Automatische Planung' : 'Automatic Scheduling' }}
            </h3>
            <button @click="showAutoScheduleModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Planungsbereich' : 'Scheduling Scope' }}
              </label>
              <select
                v-model="autoScheduleForm.scope"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">{{ language === 'de' ? 'Gesamter Stundenplan' : 'Entire Timetable' }}</option>
                <option value="class">{{ language === 'de' ? 'Bestimmte Klasse' : 'Specific Class' }}</option>
                <option value="teacher">{{ language === 'de' ? 'Bestimmter Lehrer' : 'Specific Teacher' }}</option>
              </select>
            </div>

            <div v-if="autoScheduleForm.scope === 'class'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Klasse' : 'Class' }}
              </label>
              <select
                v-model="autoScheduleForm.class"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Klasse wählen' : 'Select Class' }}</option>
                <option v-for="class_ in classes" :key="class_" :value="class_">{{ class_ }}</option>
              </select>
            </div>

            <div v-if="autoScheduleForm.scope === 'teacher'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
              </label>
              <select
                v-model="autoScheduleForm.teacher"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Lehrer wählen' : 'Select Teacher' }}</option>
                <option v-for="teacher in teachers" :key="teacher" :value="teacher">{{ teacher }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Optimierungspriorität' : 'Optimization Priority' }}
              </label>
              <select
                v-model="autoScheduleForm.priority"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="balanced">{{ language === 'de' ? 'Ausgewogen' : 'Balanced' }}</option>
                <option value="teacher">{{ language === 'de' ? 'Lehrerfreundlich' : 'Teacher-friendly' }}</option>
                <option value="student">{{ language === 'de' ? 'Schülerfreundlich' : 'Student-friendly' }}</option>
                <option value="room">{{ language === 'de' ? 'Raumoptimiert' : 'Room-optimized' }}</option>
              </select>
            </div>

            <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div class="flex items-center mb-2">
                <AlertTriangle class="h-5 w-5 text-yellow-600 mr-2" />
                <h4 class="font-medium text-yellow-800 dark:text-yellow-200">
                  {{ language === 'de' ? 'Wichtiger Hinweis' : 'Important Note' }}
                </h4>
              </div>
              <p class="text-sm text-yellow-600 dark:text-yellow-300">
                {{ language === 'de' 
                  ? 'Die automatische Planung kann bestehende Einträge überschreiben. Stellen Sie sicher, dass Sie Ihre Änderungen gespeichert haben.' 
                  : 'Automatic scheduling may overwrite existing entries. Make sure you have saved your changes.' }}
              </p>
            </div>

            <div class="flex justify-end space-x-3">
              <button @click="showAutoScheduleModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button @click="runAutoScheduler" class="btn-primary">
                {{ language === 'de' ? 'Starten' : 'Run' }}
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
  Download, Plus, AlertTriangle, Building, Users, RefreshCw, Edit, X, Calendar, LifeBuoy
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showConstraintsModal = ref(false)
const showAddClassModal = ref(false)
const showExceptionModal = ref(false)
const showSubstitutionModal = ref(false)
const showAutoScheduleModal = ref(false)
const selectedWeek = ref(language.value === 'de' ? 'Diese Woche' : 'This Week')
const selectedClass = ref('')
const selectedTeacher = ref('')
const selectedRoom = ref('')
const weekType = ref('A')
const blockType = ref('45min')
const selectedSubstitution = ref<any>(null)

const weekDays = computed(() => 
  language.value === 'de' 
    ? ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
)

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
const classes = ['Class 8A', 'Class 8B', 'Class 9A', 'Class 9B', 'Class 10A', 'Class 10B']
const teachers = ['Dr. Weber', 'Ms. Schmidt', 'Prof. Mueller', 'Mr. Fischer', 'Ms. Johnson']
const rooms = ['Room 101', 'Room 102', 'Room 201', 'Lab 1', 'Lab 2', 'Gym', 'Library']
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'German', 'English', 'History', 'Geography', 'Art', 'Music', 'PE']

const constraints = ref({
  maxLessonsPerDayTeacher: 6,
  maxLessonsPerDayStudent: 8,
  noGapsInSchedule: true,
  preferMorningMath: true,
  balanceWorkload: true,
  avoidLastPeriod: false
})

const classForm = ref({
  subject: '',
  class: '',
  teacher: '',
  room: '',
  time: '',
  day: ''
})

const exceptionForm = ref({
  type: '',
  name: '',
  startDate: '',
  endDate: '',
  affectedClasses: [] as string[],
  description: ''
})

const substitutionForm = ref({
  teacher: '',
  notes: ''
})

const autoScheduleForm = ref({
  scope: 'all',
  class: '',
  teacher: '',
  priority: 'balanced'
})

const conflicts = ref([
  {
    id: 1,
    description: 'Dr. Weber double-booked',
    time: 'Monday 10:00',
    type: 'teacher'
  },
  {
    id: 2,
    description: 'Room 101 conflict',
    time: 'Wednesday 14:00',
    type: 'room'
  }
])

const schedule = ref([
  { time: '08:00', day: 'Monday', subject: 'Mathematics', class: 'Class 10A', room: 'Room 101', teacher: 'Dr. Weber' },
  { time: '09:00', day: 'Monday', subject: 'Physics', class: 'Class 10A', room: 'Lab 1', teacher: 'Prof. Mueller' },
  { time: '10:00', day: 'Monday', subject: 'German', class: 'Class 10A', room: 'Room 205', teacher: 'Ms. Schmidt' },
  { time: '08:00', day: 'Tuesday', subject: 'English', class: 'Class 10A', room: 'Room 108', teacher: 'Ms. Johnson' },
  { time: '09:00', day: 'Tuesday', subject: 'History', class: 'Class 10A', room: 'Room 302', teacher: 'Mr. Fischer' },
])

const roomUtilization = ref([
  { name: 'Room 101', utilization: 85 },
  { name: 'Room 102', utilization: 72 },
  { name: 'Lab 1', utilization: 68 },
  { name: 'Lab 2', utilization: 91 },
  { name: 'Gym', utilization: 45 }
])

const teacherWorkload = ref([
  { name: 'Dr. Weber', hours: 24 },
  { name: 'Ms. Schmidt', hours: 22 },
  { name: 'Prof. Mueller', hours: 26 },
  { name: 'Mr. Fischer', hours: 20 },
  { name: 'Ms. Johnson', hours: 18 }
])

const substitutions = ref([
  {
    id: 1,
    originalTeacher: 'Dr. Weber',
    subject: 'Mathematics',
    class: 'Class 10A',
    date: 'Tomorrow',
    substituteTeacher: null
  },
  {
    id: 2,
    originalTeacher: 'Ms. Schmidt',
    subject: 'German',
    class: 'Class 9B',
    date: 'Friday',
    substituteTeacher: 'Mr. Fischer'
  }
])

const courseConfigs = ref([
  {
    id: 1,
    name: 'Mathematics Advanced',
    weeklyHours: 5,
    roomType: 'Classroom',
    teachingStyle: 'Lecture'
  },
  {
    id: 2,
    name: 'Physics Lab',
    weeklyHours: 3,
    roomType: 'Laboratory',
    teachingStyle: 'Practical'
  },
  {
    id: 3,
    name: 'Physical Education',
    weeklyHours: 2,
    roomType: 'Gymnasium',
    teachingStyle: 'Activity'
  }
])

const holidays = ref([
  {
    id: 1,
    name: 'Spring Break',
    date: 'April 3 - April 10, 2024',
    duration: '1 week',
    type: 'holiday'
  },
  {
    id: 2,
    name: 'Labor Day',
    date: 'May 1, 2024',
    duration: '1 day',
    type: 'holiday'
  }
])

const examBlocks = ref([
  {
    id: 1,
    name: 'Final Exams - Grade 10',
    date: 'June 15 - June 20, 2024',
    classes: 'Class 10A, Class 10B',
    type: 'exam'
  },
  {
    id: 2,
    name: 'Mid-term Assessments',
    date: 'March 25 - March 28, 2024',
    classes: 'All classes',
    type: 'exam'
  }
])

const specialEvents = ref([
  {
    id: 1,
    name: 'Science Fair',
    date: 'April 15, 2024',
    type: 'School Event',
    eventType: 'event'
  },
  {
    id: 2,
    name: 'Sports Day',
    date: 'May 20, 2024',
    type: 'Outdoor Event',
    eventType: 'event'
  }
])

const availableSubstitutes = computed(() => {
  // Filter out the original teacher from the list of available substitutes
  if (selectedSubstitution.value) {
    return teachers.filter(teacher => teacher !== selectedSubstitution.value.originalTeacher)
  }
  return teachers
})

const getClassForSlot = (time: string, day: string) => {
  const dayMap: Record<string, string> = {
    'Monday': 'Monday', 'Tuesday': 'Tuesday', 'Wednesday': 'Wednesday', 'Thursday': 'Thursday', 'Friday': 'Friday',
    'Montag': 'Monday', 'Dienstag': 'Tuesday', 'Mittwoch': 'Wednesday', 'Donnerstag': 'Thursday', 'Freitag': 'Friday'
  }
  
  return schedule.value.find(item => item.time === time && item.day === dayMap[day])
}

const getClassColor = (classItem: any) => {
  const colors = [
    'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400',
    'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-400',
    'bg-purple-50 border-purple-500 dark:bg-purple-900/20 dark:border-purple-400',
    'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20 dark:border-yellow-400',
    'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-400'
  ]
  
  const hash = classItem.subject.length % colors.length
  return colors[hash]
}

const getUtilizationColor = (utilization: number) => {
  if (utilization > 90) return 'bg-red-500'
  if (utilization > 75) return 'bg-yellow-500'
  return 'bg-green-500'
}

const getWorkloadColor = (hours: number) => {
  if (hours > 25) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  if (hours > 20) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

const getWorkloadStatus = (hours: number) => {
  if (hours > 25) return language.value === 'de' ? 'Hoch' : 'High'
  if (hours > 20) return language.value === 'de' ? 'Normal' : 'Normal'
  return language.value === 'de' ? 'Niedrig' : 'Low'
}

const hasConflict = (time: string, day: string) => {
  return conflicts.value.some(conflict => 
    conflict.time.includes(time) && conflict.time.includes(day)
  )
}

const getConflictDescription = (time: string, day: string) => {
  const conflict = conflicts.value.find(c => 
    c.time.includes(time) && c.time.includes(day)
  )
  return conflict ? conflict.description : ''
}

const handleDragStart = (event: DragEvent, classItem: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify(classItem))
  }
}

const handleDrop = (event: DragEvent, time: string, day: string) => {
  event.preventDefault()
  if (event.dataTransfer) {
    const classData = JSON.parse(event.dataTransfer.getData('text/plain'))
    
    // Remove the class from its original position
    schedule.value = schedule.value.filter(item => 
      !(item.time === classData.time && item.day === classData.day)
    )
    
    // Add the class to the new position
    schedule.value.push({
      ...classData,
      time,
      day
    })
    
    // Check for conflicts
    checkForConflicts()
  }
}

const checkForConflicts = () => {
  // Reset conflicts
  conflicts.value = []
  
  // Check for teacher conflicts (same teacher, same time, different rooms)
  const teacherConflicts = findDuplicates(schedule.value, 'teacher', 'time')
  teacherConflicts.forEach(conflict => {
    conflicts.value.push({
      id: conflicts.value.length + 1,
      description: `${conflict.value} double-booked`,
      time: `${conflict.items[0].day} ${conflict.items[0].time}`,
      type: 'teacher'
    })
  })
  
  // Check for room conflicts (same room, same time, different classes)
  const roomConflicts = findDuplicates(schedule.value, 'room', 'time')
  roomConflicts.forEach(conflict => {
    conflicts.value.push({
      id: conflicts.value.length + 1,
      description: `${conflict.value} conflict`,
      time: `${conflict.items[0].day} ${conflict.items[0].time}`,
      type: 'room'
    })
  })
  
  // Check for class conflicts (same class, same time, different subjects)
  const classConflicts = findDuplicates(schedule.value, 'class', 'time')
  classConflicts.forEach(conflict => {
    conflicts.value.push({
      id: conflicts.value.length + 1,
      description: `${conflict.value} has multiple subjects`,
      time: `${conflict.items[0].day} ${conflict.items[0].time}`,
      type: 'class'
    })
  })
}

const findDuplicates = (array: any[], key: string, timeKey: string) => {
  const duplicates: any[] = []
  const seen = new Map()
  
  array.forEach(item => {
    const value = item[key]
    const time = item[timeKey]
    const day = item.day
    const identifier = `${value}-${time}-${day}`
    
    if (seen.has(identifier)) {
      const existingItems = seen.get(identifier)
      existingItems.push(item)
      seen.set(identifier, existingItems)
    } else {
      seen.set(identifier, [item])
    }
  })
  
  seen.forEach((items, identifier) => {
    if (items.length > 1) {
      const [value] = identifier.split('-')
      duplicates.push({ value, items })
    }
  })
  
  return duplicates
}

const addClassToSlot = (time: string, day: string) => {
  classForm.value.time = time
  classForm.value.day = day
  showAddClassModal.value = true
}

const submitAddClass = () => {
  schedule.value.push({
    time: classForm.value.time,
    day: classForm.value.day,
    subject: classForm.value.subject,
    class: classForm.value.class,
    room: classForm.value.room,
    teacher: classForm.value.teacher
  })
  
  showAddClassModal.value = false
  classForm.value = { subject: '', class: '', teacher: '', room: '', time: '', day: '' }
  
  // Check for conflicts after adding a class
  checkForConflicts()
}

const autoSchedule = () => {
  showAutoScheduleModal.value = true
}

const runAutoScheduler = () => {
  // Simulate auto-scheduling process
  showAutoScheduleModal.value = false
  
  // Show loading state
  const loadingMessage = language.value === 'de' 
    ? 'Automatische Planung wird ausgeführt...' 
    : 'Running automatic scheduling...'
  
  alert(loadingMessage)
  
  // In a real implementation, this would call an algorithm to generate the schedule
  setTimeout(() => {
    // Add some sample scheduled classes
    const newClasses = [
      { time: '10:00', day: 'Tuesday', subject: 'Mathematics', class: 'Class 10A', room: 'Room 101', teacher: 'Dr. Weber' },
      { time: '11:00', day: 'Tuesday', subject: 'Physics', class: 'Class 10A', room: 'Lab 1', teacher: 'Prof. Mueller' },
      { time: '13:00', day: 'Tuesday', subject: 'German', class: 'Class 10A', room: 'Room 205', teacher: 'Ms. Schmidt' },
      { time: '08:00', day: 'Wednesday', subject: 'History', class: 'Class 10A', room: 'Room 302', teacher: 'Mr. Fischer' },
      { time: '09:00', day: 'Wednesday', subject: 'English', class: 'Class 10A', room: 'Room 108', teacher: 'Ms. Johnson' }
    ]
    
    // Add the new classes to the schedule
    schedule.value = [...schedule.value, ...newClasses]
    
    // Check for conflicts
    checkForConflicts()
    
    // Show completion message
    const completionMessage = language.value === 'de'
      ? 'Automatische Planung abgeschlossen! ' + conflicts.value.length + ' Konflikte gefunden.'
      : 'Automatic scheduling completed! ' + conflicts.value.length + ' conflicts found.'
    
    alert(completionMessage)
  }, 2000)
}

const saveChanges = () => {
  alert(language.value === 'de' ? 'Änderungen gespeichert!' : 'Changes saved!')
}

const resetTimetable = () => {
  if (confirm(language.value === 'de' ? 'Sind Sie sicher? Alle Änderungen gehen verloren.' : 'Are you sure? All changes will be lost.')) {
    // Reset to original schedule
    schedule.value = [
      { time: '08:00', day: 'Monday', subject: 'Mathematics', class: 'Class 10A', room: 'Room 101', teacher: 'Dr. Weber' },
      { time: '09:00', day: 'Monday', subject: 'Physics', class: 'Class 10A', room: 'Lab 1', teacher: 'Prof. Mueller' },
      { time: '10:00', day: 'Monday', subject: 'German', class: 'Class 10A', room: 'Room 205', teacher: 'Ms. Schmidt' },
      { time: '08:00', day: 'Tuesday', subject: 'English', class: 'Class 10A', room: 'Room 108', teacher: 'Ms. Johnson' },
      { time: '09:00', day: 'Tuesday', subject: 'History', class: 'Class 10A', room: 'Room 302', teacher: 'Mr. Fischer' },
    ]
    
    // Reset conflicts
    conflicts.value = []
    
    alert(language.value === 'de' ? 'Stundenplan zurückgesetzt!' : 'Timetable reset!')
  }
}

const assignSubstitute = (substitution: any) => {
  selectedSubstitution.value = substitution
  substitutionForm.value = {
    teacher: '',
    notes: ''
  }
  showSubstitutionModal.value = true
}

const confirmSubstitution = () => {
  if (selectedSubstitution.value && substitutionForm.value.teacher) {
    // Find the substitution in the list and update it
    const index = substitutions.value.findIndex(s => s.id === selectedSubstitution.value.id)
    if (index !== -1) {
      substitutions.value[index].substituteTeacher = substitutionForm.value.teacher
    }
    
    showSubstitutionModal.value = false
    selectedSubstitution.value = null
    
    alert(language.value === 'de' ? 'Vertretung zugewiesen!' : 'Substitute assigned!')
  }
}

const editCourse = (course: any) => {
  alert(`${language.value === 'de' ? 'Kurs bearbeiten' : 'Edit course'}: ${course.name}`)
}

const saveConstraints = () => {
  showConstraintsModal.value = false
  alert(language.value === 'de' ? 'Einschränkungen gespeichert!' : 'Constraints saved!')
}

const addException = () => {
  exceptionForm.value = {
    type: '',
    name: '',
    startDate: '',
    endDate: '',
    affectedClasses: [],
    description: ''
  }
  showExceptionModal.value = true
}

const editException = (exception: any) => {
  // In a real implementation, we would populate the form with the exception data
  alert(`${language.value === 'de' ? 'Ausnahme bearbeiten' : 'Edit exception'}: ${exception.name}`)
}

const submitException = () => {
  const { type, name, startDate, endDate } = exceptionForm.value
  
  // Format the date range
  const dateRange = startDate === endDate 
    ? new Date(startDate).toLocaleDateString()
    : `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
  
  // Create a new exception based on the type
  if (type === 'holiday') {
    holidays.value.push({
      id: holidays.value.length + 1,
      name,
      date: dateRange,
      duration: calculateDuration(startDate, endDate),
      type: 'holiday'
    })
  } else if (type === 'exam') {
    examBlocks.value.push({
      id: examBlocks.value.length + 1,
      name,
      date: dateRange,
      classes: exceptionForm.value.affectedClasses.join(', '),
      type: 'exam'
    })
  } else if (type === 'event') {
    specialEvents.value.push({
      id: specialEvents.value.length + 1,
      name,
      date: dateRange,
      type: exceptionForm.value.description || 'School Event',
      eventType: 'event'
    })
  }
  
  showExceptionModal.value = false
  exceptionForm.value = { type: '', name: '', startDate: '', endDate: '', affectedClasses: [], description: '' }
  
  alert(language.value === 'de' ? 'Ausnahme hinzugefügt!' : 'Exception added!')
}

const calculateDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  
  if (diffDays === 1) {
    return '1 day'
  } else if (diffDays <= 7) {
    return `${diffDays} days`
  } else {
    const weeks = Math.floor(diffDays / 7)
    const remainingDays = diffDays % 7
    
    if (remainingDays === 0) {
      return weeks === 1 ? '1 week' : `${weeks} weeks`
    } else {
      return weeks === 1 
        ? `1 week, ${remainingDays} days` 
        : `${weeks} weeks, ${remainingDays} days`
    }
  }
}

const exportTimetable = () => {
  // Implementation for exporting timetable
  alert(language.value === 'de' ? 'Stundenplan wird exportiert...' : 'Exporting timetable...')
}

const generateTimetable = () => {
  // Implementation for generating timetable
  alert(language.value === 'de' ? 'Stundenplan wird generiert...' : 'Generating timetable...')
}
</script>
