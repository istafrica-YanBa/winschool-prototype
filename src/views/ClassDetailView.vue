<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <button @click="$router.back()" class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <ArrowLeft class="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <Users class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ classData?.name || 'Class Detail' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Ihre Klasse im Detail' : 'Manage your class in detail' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="takeAttendance" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Calendar class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Anwesenheit markieren' : 'Take Attendance' }}
          </button>
          <button @click="exportClassData" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Download class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Daten exportieren' : 'Export Data' }}
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Users class="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Schüler' : 'Students' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ classData?.studentCount || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100 dark:bg-green-900">
              <CheckCircle class="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ classData?.attendanceRate || 0 }}%</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
              <Star class="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Durchschnittsnote' : 'Average Grade' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ classData?.averageGrade || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
              <BookOpen class="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Tests' : 'Tests' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ upcomingTests.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-winschool-primary text-winschool-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <component :is="tab.icon" class="h-5 w-5 inline mr-2" />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Students Tab -->
          <div v-if="activeTab === 'students'" class="space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Schülerliste' : 'Student List' }}
              </h3>
              <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="language === 'de' ? 'Schüler suchen...' : 'Search students...'"
                  class="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button @click="addStudent" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                  <Plus class="h-4 w-4 inline mr-2" />
                  {{ language === 'de' ? 'Schüler hinzufügen' : 'Add Student' }}
                </button>
              </div>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Schüler' : 'Student' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Aktuelle Note' : 'Current Grade' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Letzte Bewertung' : 'Last Assessment' }}
                    </th>
                    <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="student in paginatedStudents" :key="student.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td class="py-3 px-4">
                      <div class="flex items-center">
                        <img :src="student.avatar" :alt="student.name" class="h-8 w-8 rounded-full object-cover mr-3" />
                        <span class="font-medium text-gray-900 dark:text-white">{{ student.name }}</span>
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <span :class="getGradeColor(student.currentGrade)" class="font-semibold">{{ student.currentGrade }}</span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="text-green-600 font-medium">{{ student.attendanceRate }}%</span>
                    </td>
                    <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ student.lastAssessment }}</td>
                    <td class="py-3 px-4">
                      <div class="flex space-x-2">
                        <button @click="viewStudentProfile(student)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          <Eye class="h-4 w-4" />
                        </button>
                        <button @click="gradeStudent(student)" class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                          <Edit class="h-4 w-4" />
                        </button>
                        <button @click="sendMessage(student)" class="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                          <MessageSquare class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Card View -->
            <div class="md:hidden space-y-4">
              <div v-for="student in paginatedStudents" :key="student.id" class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 space-y-3">
                <div class="flex items-center space-x-3">
                  <img :src="student.avatar" :alt="student.name" class="h-12 w-12 rounded-full object-cover" />
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ student.name }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ student.lastAssessment }}</p>
                  </div>
                  <span :class="getGradeColor(student.currentGrade)" class="font-semibold text-lg">{{ student.currentGrade }}</span>
                </div>
                
                <div class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div class="flex items-center space-x-4">
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}</p>
                      <p class="text-sm font-medium text-green-600">{{ student.attendanceRate }}%</p>
                    </div>
                  </div>
                  
                  <div class="flex space-x-2">
                    <button @click="viewStudentProfile(student)" class="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="gradeStudent(student)" class="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button @click="sendMessage(student)" class="p-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
                      <MessageSquare class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Zeige' : 'Showing' }} {{ ((currentPage - 1) * studentsPerPage) + 1 }} {{ language === 'de' ? 'bis' : 'to' }} {{ Math.min(currentPage * studentsPerPage, filteredStudents.length) }} {{ language === 'de' ? 'von' : 'of' }} {{ filteredStudents.length }} {{ language === 'de' ? 'Schülern' : 'students' }}
              </div>
              
              <div class="flex items-center space-x-2">
                <button 
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  :class="[
                    'px-3 py-2 text-sm rounded-lg border transition-colors',
                    currentPage === 1 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  {{ language === 'de' ? 'Zurück' : 'Previous' }}
                </button>
                
                <div class="flex items-center space-x-1">
                  <template v-for="(page, index) in visiblePages" :key="`page-${index}`">
                    <button 
                      v-if="typeof page === 'number'"
                      @click="currentPage = page"
                      :class="[
                        'px-3 py-2 text-sm rounded-lg transition-colors',
                        currentPage === page 
                          ? 'bg-winschool-primary text-slate-800 font-medium' 
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span v-else class="px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                      {{ page }}
                    </span>
                  </template>
                </div>
                
                <button 
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  :class="[
                    'px-3 py-2 text-sm rounded-lg border transition-colors',
                    currentPage === totalPages 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  {{ language === 'de' ? 'Weiter' : 'Next' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Attendance Tab -->
          <div v-if="activeTab === 'attendance'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Anwesenheitsübersicht' : 'Attendance Overview' }}
              </h3>
              <div class="flex space-x-3">
                <select v-model="selectedPeriod" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="week">{{ language === 'de' ? 'Diese Woche' : 'This Week' }}</option>
                  <option value="month">{{ language === 'de' ? 'Dieser Monat' : 'This Month' }}</option>
                  <option value="semester">{{ language === 'de' ? 'Dieses Semester' : 'This Semester' }}</option>
                </select>
                <button @click="takeAttendance" class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                  <Calendar class="h-4 w-4 inline mr-2" />
                  {{ language === 'de' ? 'Anwesenheit markieren' : 'Take Attendance' }}
                </button>
              </div>
            </div>

            <!-- Attendance Chart -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  {{ language === 'de' ? 'Wöchentliche Anwesenheit' : 'Weekly Attendance' }}
                </h4>
                <div class="space-y-3">
                  <div v-for="(day, index) in weeklyAttendance" :key="index" class="flex items-center space-x-4">
                    <div class="w-12 text-sm text-gray-600 dark:text-gray-400">{{ day.day }}</div>
                    <div class="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        :class="getAttendanceColor(day.rate)" 
                        class="h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2" 
                        :style="{ width: day.rate + '%' }"
                      >
                        <span class="text-xs font-medium text-white">{{ day.rate }}%</span>
                      </div>
                    </div>
                    <div class="w-16 text-sm text-gray-900 dark:text-white text-right">{{ day.present }}/{{ day.total }}</div>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  {{ language === 'de' ? 'Anwesenheitsstatistiken' : 'Attendance Statistics' }}
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Durchschnittliche Anwesenheit' : 'Average Attendance' }}</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ classData?.attendanceRate }}%</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Pünktliche Ankunft' : 'On-time Arrivals' }}</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">85%</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Verspätungen' : 'Late Arrivals' }}</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">8</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Entschuldigte Fehlzeiten' : 'Excused Absences' }}</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tests Tab -->
          <div v-if="activeTab === 'tests'" class="space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Tests & Bewertungen' : 'Tests & Assessments' }}
              </h3>
              <button @click="createNewTest" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-2 rounded-lg transition-colors">
                <Plus class="h-4 w-4 inline mr-2" />
                {{ language === 'de' ? 'Test erstellen' : 'Create Test' }}
              </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Upcoming Tests -->
              <div class="space-y-4">
                <h4 class="text-md font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Anstehende Tests' : 'Upcoming Tests' }}
                </h4>
                <div class="space-y-3">
                  <div v-for="test in upcomingTests" :key="test.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div class="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div class="flex-1">
                        <h5 class="font-medium text-gray-900 dark:text-white">{{ test.title }}</h5>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ test.type }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-500">{{ formatDate(test.date) }}</p>
                      </div>
                      <div class="flex space-x-2 self-start">
                        <button @click="editTest(test)" class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Edit class="h-4 w-4" />
                        </button>
                        <button @click="deleteTest(test)" class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Tests -->
              <div class="space-y-4">
                <h4 class="text-md font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Kürzliche Tests' : 'Recent Tests' }}
                </h4>
                <div class="space-y-3">
                  <div v-for="test in recentTests" :key="test.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div class="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div class="flex-1">
                        <h5 class="font-medium text-gray-900 dark:text-white">{{ test.title }}</h5>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ test.type }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-500">{{ formatDate(test.date) }}</p>
                        <p class="text-sm font-medium text-green-600">{{ language === 'de' ? 'Durchschnitt:' : 'Average:' }} {{ test.averageGrade }}</p>
                      </div>
                      <button @click="viewTestResults(test)" class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors self-start">
                        <BarChart class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Tab -->
          <div v-if="activeTab === 'performance'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Klassenleistung' : 'Class Performance' }}
            </h3>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div class="lg:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                  {{ language === 'de' ? 'Leistungstrend' : 'Performance Trend' }}
                </h4>
                <!-- Performance chart would go here -->
                <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  {{ language === 'de' ? 'Leistungsdiagramm wird geladen...' : 'Performance chart loading...' }}
                </div>
              </div>

              <div class="space-y-4">
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h5 class="font-medium text-gray-900 dark:text-white mb-3">
                    {{ language === 'de' ? 'Notenverteilung' : 'Grade Distribution' }}
                  </h5>
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">A</span>
                      <span class="font-medium text-gray-900 dark:text-white">25%</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">B</span>
                      <span class="font-medium text-gray-900 dark:text-white">35%</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">C</span>
                      <span class="font-medium text-gray-900 dark:text-white">30%</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">D</span>
                      <span class="font-medium text-gray-900 dark:text-white">10%</span>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h5 class="font-medium text-gray-900 dark:text-white mb-3">
                    {{ language === 'de' ? 'Top Performer' : 'Top Performers' }}
                  </h5>
                  <div class="space-y-2">
                    <div v-for="student in topPerformers" :key="student.id" class="flex items-center space-x-2">
                      <img :src="student.avatar" :alt="student.name" class="h-6 w-6 rounded-full object-cover" />
                      <span class="text-sm text-gray-900 dark:text-white">{{ student.name }}</span>
                      <span class="text-sm font-medium text-green-600">{{ student.grade }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Attendance Modal -->
    <div v-if="showAttendanceModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Anwesenheit markieren' : 'Take Attendance' }} - {{ classData?.name }}
            </h3>
            <button @click="showAttendanceModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-4">
            <div v-for="student in classData?.students || []" :key="student.id" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex items-center">
                <img :src="student.avatar" :alt="student.name" class="h-8 w-8 rounded-full object-cover mr-3" />
                <span class="font-medium text-gray-900 dark:text-white">{{ student.name }}</span>
              </div>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="student.attendance"
                    type="radio"
                    :value="'present'"
                    :name="`attendance-${student.id}`"
                    class="mr-2 text-green-600"
                  />
                  <span class="text-sm text-green-600">{{ language === 'de' ? 'Anwesend' : 'Present' }}</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="student.attendance"
                    type="radio"
                    :value="'absent'"
                    :name="`attendance-${student.id}`"
                    class="mr-2 text-red-600"
                  />
                  <span class="text-sm text-red-600">{{ language === 'de' ? 'Abwesend' : 'Absent' }}</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="student.attendance"
                    type="radio"
                    :value="'late'"
                    :name="`attendance-${student.id}`"
                    class="mr-2 text-yellow-600"
                  />
                  <span class="text-sm text-yellow-600">{{ language === 'de' ? 'Verspätet' : 'Late' }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Notizen' : 'Notes' }}
            </label>
            <textarea
              v-model="attendanceNotes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              :placeholder="language === 'de' ? 'Zusätzliche Notizen zur Anwesenheit...' : 'Additional attendance notes...'"
            ></textarea>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button @click="showAttendanceModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button @click="saveAttendance" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              {{ language === 'de' ? 'Anwesenheit speichern' : 'Save Attendance' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { 
  ArrowLeft, Users, Calendar, Download, CheckCircle, Star, BookOpen, Plus, Eye, Edit, 
  MessageSquare, Trash2, BarChart, X
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Component state
const activeTab = ref('students')
const searchQuery = ref('')
const selectedPeriod = ref('week')
const showAttendanceModal = ref(false)
const attendanceNotes = ref('')
const currentPage = ref(1)
const studentsPerPage = ref(10)

// Tabs configuration
const tabs = computed(() => [
  { 
    id: 'students', 
    label: language.value === 'de' ? 'Schüler' : 'Students', 
    icon: Users 
  },
  { 
    id: 'attendance', 
    label: language.value === 'de' ? 'Anwesenheit' : 'Attendance', 
    icon: Calendar 
  },
  { 
    id: 'tests', 
    label: language.value === 'de' ? 'Tests' : 'Tests', 
    icon: BookOpen 
  },
  { 
    id: 'performance', 
    label: language.value === 'de' ? 'Leistung' : 'Performance', 
    icon: Star 
  }
])

// Mock data (this would come from an API in a real app)
const classData = ref({
  id: parseInt(route.params.id as string),
  name: 'Mathematics 10A',
  subject: 'Mathematics',
  studentCount: 28,
  averageGrade: 'B+',
  attendanceRate: 94,
  performancePercentage: 85,
  nextClass: 'Today 10:00',
  students: [
    {
      id: 1,
      name: 'Emma Müller',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      currentGrade: 'A-',
      attendanceRate: 96,
      lastAssessment: 'Algebra Test',
      attendance: 'present'
    },
    {
      id: 2,
      name: 'Liam Weber',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      currentGrade: 'B+',
      attendanceRate: 92,
      lastAssessment: 'Geometry Quiz',
      attendance: 'present'
    },
    {
      id: 3,
      name: 'Sophie Schmidt',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      currentGrade: 'A',
      attendanceRate: 98,
      lastAssessment: 'Calculus Assignment',
      attendance: 'present'
    }
  ]
})

const upcomingTests = ref([
  {
    id: 1,
    title: 'Algebra Chapter 5 Test',
    type: language.value === 'de' ? 'Test' : 'Test',
    date: '2024-02-01',
    description: 'Comprehensive test on algebraic expressions'
  },
  {
    id: 2,
    title: 'Geometry Quiz',
    type: language.value === 'de' ? 'Quiz' : 'Quiz',
    date: '2024-02-05',
    description: 'Quick assessment on geometric shapes'
  }
])

const recentTests = ref([
  {
    id: 3,
    title: 'Trigonometry Test',
    type: language.value === 'de' ? 'Test' : 'Test',
    date: '2024-01-15',
    averageGrade: 'B+',
    completed: true
  },
  {
    id: 4,
    title: 'Statistics Assignment',
    type: language.value === 'de' ? 'Aufgabe' : 'Assignment',
    date: '2024-01-10',
    averageGrade: 'A-',
    completed: true
  }
])

const weeklyAttendance = ref([
  { day: language.value === 'de' ? 'Mo' : 'Mon', rate: 100, present: 28, total: 28 },
  { day: language.value === 'de' ? 'Di' : 'Tue', rate: 89, present: 25, total: 28 },
  { day: language.value === 'de' ? 'Mi' : 'Wed', rate: 96, present: 27, total: 28 },
  { day: language.value === 'de' ? 'Do' : 'Thu', rate: 93, present: 26, total: 28 },
  { day: language.value === 'de' ? 'Fr' : 'Fri', rate: 86, present: 24, total: 28 }
])

const topPerformers = ref([
  { id: 1, name: 'Emma Müller', grade: 'A+', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
  { id: 3, name: 'Sophie Schmidt', grade: 'A', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
  { id: 2, name: 'Liam Weber', grade: 'A-', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }
])

// Computed properties
const filteredStudents = computed(() => {
  if (!searchQuery.value) return classData.value?.students || []
  return (classData.value?.students || []).filter(student =>
    student.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * studentsPerPage.value
  const end = start + studentsPerPage.value
  return filteredStudents.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredStudents.value.length / studentsPerPage.value)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      if (total > 5) {
        pages.push('...')
        pages.push(total)
      }
    } else if (current >= total - 3) {
      pages.push(1)
      if (total > 5) {
        pages.push('...')
      }
      for (let i = total - 4; i <= total; i++) {
        if (i > 0) pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages.filter((page, index) => {
    if (typeof page === 'number') return true
    return pages.indexOf(page) === index
  })
})

// Methods
const takeAttendance = () => {
  showAttendanceModal.value = true
}

const saveAttendance = () => {
  showAttendanceModal.value = false
  attendanceNotes.value = ''
  alert(language.value === 'de' ? 'Anwesenheit gespeichert!' : 'Attendance saved!')
}

const exportClassData = () => {
  alert(language.value === 'de' ? 'Klassendaten werden exportiert...' : 'Exporting class data...')
}

const addStudent = () => {
  alert(language.value === 'de' ? 'Schüler hinzufügen Funktion' : 'Add student functionality')
}

const viewStudentProfile = (student: any) => {
  router.push(`/dashboard/student-profile/${student.id}`)
}

const gradeStudent = (student: any) => {
  alert(language.value === 'de' ? `Bewertung für ${student.name}` : `Grading ${student.name}`)
}

const sendMessage = (student: any) => {
  alert(language.value === 'de' ? `Nachricht an ${student.name} senden` : `Send message to ${student.name}`)
}

const createNewTest = () => {
  alert(language.value === 'de' ? 'Neuen Test erstellen' : 'Create new test')
}

const editTest = (test: any) => {
  alert(language.value === 'de' ? `Test bearbeiten: ${test.title}` : `Edit test: ${test.title}`)
}

const deleteTest = (test: any) => {
  if (confirm(language.value === 'de' ? `Test "${test.title}" löschen?` : `Delete test "${test.title}"?`)) {
    const index = upcomingTests.value.findIndex(t => t.id === test.id)
    if (index > -1) {
      upcomingTests.value.splice(index, 1)
    }
  }
}

const viewTestResults = (test: any) => {
  alert(language.value === 'de' ? `Testergebnisse anzeigen: ${test.title}` : `View test results: ${test.title}`)
}

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400'
  if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400'
  if (grade.startsWith('C')) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const getAttendanceColor = (rate: number) => {
  if (rate >= 95) return 'bg-green-500'
  if (rate >= 85) return 'bg-blue-500'
  if (rate >= 75) return 'bg-yellow-500'
  return 'bg-red-500'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(language.value === 'de' ? 'de-DE' : 'en-US')
}

// Initialize component
onMounted(() => {
  // Here you would typically fetch class data based on route.params.id
  console.log('Loading class data for ID:', route.params.id)
})

// Watch for changes in searchQuery
watch(searchQuery, () => {
  currentPage.value = 1
})
</script> 