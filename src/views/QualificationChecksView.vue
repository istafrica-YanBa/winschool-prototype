<template>
  <div class="qualification-checks bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            Qualification Checks
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-200">
            Monitor student progress and qualification requirements
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button 
          @click="refreshChecks"
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
        <button 
          @click="exportReport"
          class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Student List -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <!-- Search and Filters -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4" style="font-family: Inter, sans-serif;">Students</h2>
            
            <div class="space-y-4">
              <!-- Search -->
              <div class="relative">
                <input
                  v-model="search"
                  type="text"
                  placeholder="Search students..."
                  class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-winschool-primary focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  style="font-family: Inter, sans-serif;"
                />
                <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <!-- Class Filter -->
              <select
                v-model="selectedClass"
                class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-winschool-primary focus:border-transparent text-gray-900 dark:text-gray-100"
                style="font-family: Inter, sans-serif;"
              >
                <option value="All Classes">All Classes</option>
                <option value="12A">12A</option>
                <option value="12B">12B</option>
                <option value="11A">11A</option>
                <option value="11B">11B</option>
              </select>

              <!-- Status Filter -->
              <select
                v-model="qualificationStatus"
                class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-winschool-primary focus:border-transparent text-gray-900 dark:text-gray-100"
                style="font-family: Inter, sans-serif;"
              >
                <option value="All Status">All Status</option>
                <option value="Qualified">Qualified</option>
                <option value="At Risk">At Risk</option>
                <option value="Not Qualified">Not Qualified</option>
              </select>
            </div>
          </div>

          <!-- Student List -->
          <div class="max-h-96 overflow-y-auto">
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div
                v-for="student in filteredStudents"
                :key="student.id"
                @click="selectStudent(student)"
                :class="[
                  'p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700',
                  selectedStudent?.id === student.id ? 'bg-winschool-primary text-slate-800' : 'text-gray-900 dark:text-gray-100'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <img
                    :src="student.avatar"
                    :alt="student.name"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate" style="font-family: Inter, sans-serif;">
                      {{ student.name }}
                    </p>
                    <p :class="[
                      'text-xs truncate',
                      selectedStudent?.id === student.id ? 'text-slate-700' : 'text-gray-500 dark:text-gray-400'
                    ]" style="font-family: Inter, sans-serif;">
                      Class {{ student.class }}
                    </p>
                  </div>
                  <div class="flex-shrink-0">
                    <span 
                      :class="getQualificationStatusClass(getQualificationStatus(student))"
                      class="px-2 py-1 text-xs rounded-full font-medium"
                      style="font-family: Inter, sans-serif;"
                    >
                      {{ getQualificationStatus(student) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Student Details -->
      <div class="lg:col-span-3">
        <div v-if="selectedStudent" class="space-y-6">
          <!-- Student Header -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div class="flex items-center space-x-4">
              <img
                :src="selectedStudent.avatar"
                :alt="selectedStudent.name"
                class="w-16 h-16 rounded-full object-cover"
              />
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">
                  {{ selectedStudent.name }}
                </h2>
                <p class="text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                  Class {{ selectedStudent.class }} • {{ selectedStudent.subjects.length }} subjects
                </p>
              </div>
              <div class="text-right">
                <span 
                  :class="getQualificationStatusClass(getQualificationStatus(selectedStudent))"
                  class="px-4 py-2 text-sm rounded-lg font-medium"
                  style="font-family: Inter, sans-serif;"
                >
                  {{ getQualificationStatus(selectedStudent) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Requirements Overview -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-winschool-primary mb-2">
                {{ selectedStudent.subjects.length }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Total Subjects</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-green-600 mb-2">
                {{ selectedStudent.subjects.filter(s => isSubjectQualified(s)).length }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Passed Subjects</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-winschool-primary mb-2">
                {{ calculateOverallGrade() }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Average Grade</div>
            </div>
          </div>

          <!-- Detailed Requirements Tabs -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <!-- Tab Navigation -->
            <div class="border-b border-gray-200 dark:border-gray-700">
              <nav class="flex space-x-8 px-6">
                <button
                  @click="activeTab = 'subjects'"
                  :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'subjects'
                      ? 'border-winschool-primary text-winschool-primary'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  ]"
                  style="font-family: Inter, sans-serif;"
                >
                  Subject Requirements
                </button>
                <button
                  @click="activeTab = 'points'"
                  :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'points'
                      ? 'border-winschool-primary text-winschool-primary'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  ]"
                  style="font-family: Inter, sans-serif;"
                >
                  Point Requirements
                </button>
                <button
                  @click="activeTab = 'additional'"
                  :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'additional'
                      ? 'border-winschool-primary text-winschool-primary'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  ]"
                  style="font-family: Inter, sans-serif;"
                >
                  Additional Requirements
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
              <!-- Subject Requirements Tab -->
              <div v-if="activeTab === 'subjects'">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    v-for="subject in selectedStudent.subjects" 
                    :key="subject.id"
                    class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
                  >
                    <!-- Subject Header -->
                    <div class="flex items-start justify-between mb-4">
                      <div class="flex-1">
                        <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1" style="font-family: Inter, sans-serif;">
                          {{ getSubjectName(subject.subjectId) }}
                        </h4>
                        <span 
                          :class="getTypeColorClass(subject.type)"
                          class="text-xs px-2 py-1 rounded-full font-medium"
                          style="font-family: Inter, sans-serif;"
                        >
                          {{ subject.type }}
                        </span>
                      </div>
                      <div :class="isSubjectQualified(subject) ? 'text-green-500' : 'text-red-500'">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="isSubjectQualified(subject)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    </div>

                    <!-- Grade Details -->
                    <div class="space-y-3">
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Required Grade</span>
                        <span class="text-sm font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">4.0</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Current Grade</span>
                        <span class="text-sm font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">
                          {{ calculateFinalGrade(subject) }}
                        </span>
                      </div>
                      
                      <!-- Individual Grades -->
                      <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div class="grid grid-cols-3 gap-2 text-xs">
                          <div class="text-center">
                            <div class="text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Oral</div>
                            <div class="font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ subject.grades.oral }}</div>
                          </div>
                          <div class="text-center">
                            <div class="text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Written</div>
                            <div class="font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ subject.grades.written }}</div>
                          </div>
                          <div class="text-center">
                            <div class="text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Final</div>
                            <div class="font-medium text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ subject.grades.final }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty State for Subjects -->
                <div v-if="selectedStudent.subjects.length === 0" class="text-center py-12">
                  <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2" style="font-family: Inter, sans-serif;">
                    No Subjects Found
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                    This student has no subjects assigned yet.
                  </p>
                </div>
              </div>

              <!-- Point Requirements Tab -->
              <div v-if="activeTab === 'points'" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4" style="font-family: Inter, sans-serif;">Core Subjects</h3>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                        {{ calculateCorePoints() }}/60 Points
                      </span>
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                        {{ Math.round((calculateCorePoints() / 60) * 100) }}%
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        class="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        :style="{ width: `${Math.min((calculateCorePoints() / 60) * 100, 100)}%` }"
                      ></div>
                    </div>
                  </div>

                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4" style="font-family: Inter, sans-serif;">Advanced Subjects</h3>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                        {{ calculateAdvancedPoints() }}/60 Points
                      </span>
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                        {{ Math.round((calculateAdvancedPoints() / 60) * 100) }}%
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        class="bg-green-600 h-3 rounded-full transition-all duration-300"
                        :style="{ width: `${Math.min((calculateAdvancedPoints() / 60) * 100, 100)}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Points Distribution -->
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4" style="font-family: Inter, sans-serif;">Points Distribution</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">Core Subjects</span>
                      </div>
                      <span class="text-sm font-bold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ calculateCorePoints() }} pts</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="w-4 h-4 bg-green-600 rounded-full mr-3"></div>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">Advanced Subjects</span>
                      </div>
                      <span class="text-sm font-bold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ calculateAdvancedPoints() }} pts</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="w-4 h-4 bg-purple-600 rounded-full mr-3"></div>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">Other Subjects</span>
                      </div>
                      <span class="text-sm font-bold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">{{ calculateOtherPoints() }} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Additional Requirements Tab -->
              <div v-if="activeTab === 'additional'" class="space-y-4">
                <div class="space-y-4">
                  <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div :class="hasLanguageRequirement() ? 'text-green-500' : 'text-red-500'" class="mr-4">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="hasLanguageRequirement()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">Foreign Language Requirement</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Must complete at least one foreign language course</p>
                    </div>
                  </div>

                  <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div :class="hasScienceRequirement() ? 'text-green-500' : 'text-red-500'" class="mr-4">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="hasScienceRequirement()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">Science Requirement</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Must complete at least one science course</p>
                    </div>
                  </div>

                  <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div :class="hasAttendanceRequirement() ? 'text-green-500' : 'text-red-500'" class="mr-4">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="hasAttendanceRequirement()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">Attendance Requirement</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">Must maintain minimum attendance in all courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2" style="font-family: Inter, sans-serif;">
            No Student Selected
          </h3>
          <p class="text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
            Select a student from the left panel to view their qualification details and progress.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Mock data for testing
const mockSubjects = [
  { id: 1, name: 'Mathematics', department: 'Mathematics' },
  { id: 2, name: 'Physics', department: 'Science' },
  { id: 3, name: 'Chemistry', department: 'Science' },
  { id: 4, name: 'English', department: 'Languages' },
  { id: 5, name: 'German', department: 'Languages' },
  { id: 6, name: 'History', department: 'Social Studies' },
  { id: 7, name: 'Biology', department: 'Science' }
]

const mockStudents = [
  {
    id: 1,
    name: 'Emma Schmidt',
    class: '12A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    subjects: [
      { id: 1, subjectId: 1, type: 'mandatory', grades: { oral: 2.5, written: 2.0, final: 2.2 } },
      { id: 2, subjectId: 2, type: 'mandatory', grades: { oral: 1.8, written: 2.2, final: 2.0 } },
      { id: 3, subjectId: 4, type: 'optional', grades: { oral: 1.5, written: 1.8, final: 1.6 } },
      { id: 4, subjectId: 6, type: 'supplementary', grades: { oral: 2.8, written: 3.0, final: 2.9 } }
    ]
  },
  {
    id: 2,
    name: 'Lucas Weber',
    class: '12A',
    avatar: 'https://i.pravatar.cc/150?img=2',
    subjects: [
      { id: 5, subjectId: 1, type: 'mandatory', grades: { oral: 3.2, written: 3.5, final: 3.3 } },
      { id: 6, subjectId: 3, type: 'mandatory', grades: { oral: 2.8, written: 2.5, final: 2.6 } },
      { id: 7, subjectId: 5, type: 'optional', grades: { oral: 2.0, written: 2.2, final: 2.1 } }
    ]
  },
  {
    id: 3,
    name: 'Sophie Mueller',
    class: '12B',
    avatar: 'https://i.pravatar.cc/150?img=3',
    subjects: [
      { id: 8, subjectId: 1, type: 'mandatory', grades: { oral: 1.2, written: 1.5, final: 1.3 } },
      { id: 9, subjectId: 2, type: 'mandatory', grades: { oral: 1.8, written: 1.6, final: 1.7 } },
      { id: 10, subjectId: 4, type: 'optional', grades: { oral: 1.0, written: 1.2, final: 1.1 } },
      { id: 11, subjectId: 7, type: 'supplementary', grades: { oral: 2.2, written: 2.0, final: 2.1 } }
    ]
  }
]

// State
const search = ref('')
const selectedClass = ref('All Classes')
const qualificationStatus = ref('All Status')
const selectedStudent = ref<any>(null)
const activeTab = ref('subjects')

// Computed
const filteredStudents = computed(() => {
  let filtered = [...mockStudents]

  if (search.value) {
    filtered = filtered.filter(student =>
      student.name.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  if (selectedClass.value !== 'All Classes') {
    filtered = filtered.filter(student => student.class === selectedClass.value)
  }

  if (qualificationStatus.value !== 'All Status') {
    filtered = filtered.filter(student =>
      getQualificationStatus(student) === qualificationStatus.value
    )
  }

  return filtered
})

// Methods
const selectStudent = (student: any) => {
  selectedStudent.value = student
}

const getSubjectName = (id: number) => {
  const subject = mockSubjects.find(s => s.id === id)
  return subject ? subject.name : 'Unknown Subject'
}

const getTypeColorClass = (type: string) => {
  const colors = {
    mandatory: 'bg-blue-100 text-blue-800',
    optional: 'bg-green-100 text-green-800',
    supplementary: 'bg-purple-100 text-purple-800'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const calculateFinalGrade = (subject: any) => {
  if (!subject.grades.final) {
    return ((subject.grades.oral + subject.grades.written) / 2).toFixed(1)
  }
  return subject.grades.final.toFixed(1)
}

const isSubjectQualified = (subject: any) => {
  const finalGrade = parseFloat(calculateFinalGrade(subject))
  return finalGrade <= 4.0
}

const getQualificationStatus = (student: any) => {
  const progress = calculateOverallProgressForStudent(student)
  if (progress >= 90) return 'Qualified'
  if (progress >= 70) return 'At Risk'
  return 'Not Qualified'
}

const getQualificationStatusClass = (status: string) => {
  const colors = {
    'Qualified': 'bg-green-100 text-green-800',
    'At Risk': 'bg-yellow-100 text-yellow-800',
    'Not Qualified': 'bg-red-100 text-red-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const calculateOverallProgress = () => {
  if (!selectedStudent.value) return 0
  return calculateOverallProgressForStudent(selectedStudent.value)
}

const calculateOverallProgressForStudent = (student: any) => {
  const total = 5 // Total number of requirements
  let completed = 0

  if (isGradePointsQualifiedForStudent(student)) completed++
  if (isAdvancedCoursesQualifiedForStudent(student)) completed++
  if (isFailedCoursesQualifiedForStudent(student)) completed++
  if (hasLanguageRequirementForStudent(student)) completed++
  if (hasScienceRequirementForStudent(student)) completed++

  return Math.round((completed / total) * 100)
}

const getProgressColorClass = (progress: number) => {
  if (progress >= 90) return 'text-green-500'
  if (progress >= 70) return 'text-yellow-500'
  return 'text-red-500'
}

const calculateGradePoints = () => {
  if (!selectedStudent.value) return 0
  return selectedStudent.value.subjects.reduce((total: number, subject: any) => {
    const grade = parseFloat(calculateFinalGrade(subject))
    return total + Math.max(0, 17 - Math.round(grade * 3))
  }, 0)
}

const isGradePointsQualified = () => {
  return calculateGradePoints() >= 180
}

const isGradePointsQualifiedForStudent = (student: any) => {
  const points = student.subjects.reduce((total: number, subject: any) => {
    const grade = parseFloat(calculateFinalGrade(subject))
    return total + Math.max(0, 17 - Math.round(grade * 3))
  }, 0)
  return points >= 180
}

const countAdvancedCourses = () => {
  if (!selectedStudent.value) return 0
  return selectedStudent.value.subjects.filter((s: any) => s.type === 'mandatory').length
}

const isAdvancedCoursesQualified = () => {
  return countAdvancedCourses() >= 2
}

const isAdvancedCoursesQualifiedForStudent = (student: any) => {
  return student.subjects.filter((s: any) => s.type === 'mandatory').length >= 2
}

const countFailedCourses = () => {
  if (!selectedStudent.value) return 0
  return selectedStudent.value.subjects.filter((s: any) => {
    const grade = parseFloat(calculateFinalGrade(s))
    return grade > 4.0
  }).length
}

const isFailedCoursesQualified = () => {
  return countFailedCourses() <= 2
}

const isFailedCoursesQualifiedForStudent = (student: any) => {
  const failedCount = student.subjects.filter((s: any) => {
    const grade = parseFloat(calculateFinalGrade(s))
    return grade > 4.0
  }).length
  return failedCount <= 2
}

const calculateCorePoints = () => {
  if (!selectedStudent.value) return 0
  return selectedStudent.value.subjects
    .filter((s: any) => s.type === 'mandatory')
    .reduce((total: number, subject: any) => {
      const grade = parseFloat(calculateFinalGrade(subject))
      return total + Math.max(0, 17 - Math.round(grade * 3))
    }, 0)
}

const calculateAdvancedPoints = () => {
  if (!selectedStudent.value) return 0
  return selectedStudent.value.subjects
    .filter((s: any) => s.type === 'optional')
    .reduce((total: number, subject: any) => {
      const grade = parseFloat(calculateFinalGrade(subject))
      return total + Math.max(0, 17 - Math.round(grade * 3))
    }, 0)
}

const calculateOtherPoints = () => {
  if (!selectedStudent.value) return 0
  return selectedStudent.value.subjects
    .filter((s: any) => s.type === 'supplementary')
    .reduce((total: number, subject: any) => {
      const grade = parseFloat(calculateFinalGrade(subject))
      return total + Math.max(0, 17 - Math.round(grade * 3))
    }, 0)
}

const hasLanguageRequirement = () => {
  if (!selectedStudent.value) return false
  return hasLanguageRequirementForStudent(selectedStudent.value)
}

const hasLanguageRequirementForStudent = (student: any) => {
  return student.subjects.some((s: any) => {
    const subject = mockSubjects.find(sub => sub.id === s.subjectId)
    return subject?.department === 'Languages' && parseFloat(calculateFinalGrade(s)) <= 4.0
  })
}

const hasScienceRequirement = () => {
  if (!selectedStudent.value) return false
  return hasScienceRequirementForStudent(selectedStudent.value)
}

const hasScienceRequirementForStudent = (student: any) => {
  return student.subjects.some((s: any) => {
    const subject = mockSubjects.find(sub => sub.id === s.subjectId)
    return subject?.department === 'Science' && parseFloat(calculateFinalGrade(s)) <= 4.0
  })
}

const hasAttendanceRequirement = () => {
  return true // Mock implementation
}

const calculateOverallGrade = () => {
  if (!selectedStudent.value || selectedStudent.value.subjects.length === 0) return '0.0'
  
  const totalGrade = selectedStudent.value.subjects.reduce((sum: number, subject: any) => {
    return sum + parseFloat(calculateFinalGrade(subject))
  }, 0)
  
  return (totalGrade / selectedStudent.value.subjects.length).toFixed(1)
}

const refreshChecks = () => {
  console.log('Refreshing qualification checks')
}

const exportReport = () => {
  console.log('Exporting qualification report')
}
</script>

<style scoped>
/* Custom scrollbar for student list */
.max-h-96::-webkit-scrollbar {
  width: 6px;
}

.max-h-96::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style> 
