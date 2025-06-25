<template>
  <div class="course-editor bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            Course Editor
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            Create and manage courses with units, teachers, and room assignments
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button 
          @click="exportCourses"
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
        <button 
          @click="createNewCourse"
          class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Course
        </button>
      </div>
    </div>

    <!-- Stats Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ totalCourses }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Courses</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ activeCourses }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Active Courses</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ totalTeachers }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Assigned Teachers</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ totalRooms }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Assigned Rooms</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex justify-between items-start">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-4">
            <svg class="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100" style="font-family: Inter, sans-serif;">
              Course Editor
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
              Create and manage courses with units, teachers, and room assignments
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="saveDraft"
            class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-200 flex items-center space-x-2"
            style="font-family: Inter, sans-serif;"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span class="text-sm">Save Draft</span>
          </button>
          <button 
            @click="publishCourse"
            :disabled="!isValidCourse"
            class="bg-winschool-primary text-slate-800 px-6 py-2 rounded-lg shadow hover:scale-105 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            style="font-family: Inter, sans-serif;"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">Publish Course</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Progress Indicator -->
    <div class="mb-8">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700" style="font-family: Inter, sans-serif;">Course Completion</span>
          <span class="text-sm text-gray-500" style="font-family: Inter, sans-serif;">{{ completionPercentage }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" :style="{width: completionPercentage + '%'}"></div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Course Form -->
      <div class="lg:col-span-3">
        <div class="bg-white shadow-md rounded-xl p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6" style="font-family: Inter, sans-serif;">Course Information</h2>
          
          <form @submit.prevent="saveCourse" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
                  Course Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="courseForm.name"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  style="font-family: Inter, sans-serif;"
                  placeholder="Enter course name..."
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
                  Course Code <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="courseForm.code"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  style="font-family: Inter, sans-serif;"
                  placeholder="e.g., MATH101"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
                  Subject <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="courseForm.subjectId"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  style="font-family: Inter, sans-serif;"
                >
                  <option value="">Select Subject</option>
                  <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                    {{ subject.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
                  Credits <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="courseForm.credits"
                  type="number"
                  required
                  min="1"
                  max="12"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  style="font-family: Inter, sans-serif;"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
                  Block Size (Hours) <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="courseForm.blockSize"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  style="font-family: Inter, sans-serif;"
                >
                  <option value="1">1 Hour</option>
                  <option value="1.5">1.5 Hours</option>
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours</option>
                  <option value="4">4 Hours</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
                Course Description
              </label>
              <textarea
                v-model="courseForm.description"
                rows="3"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                style="font-family: Inter, sans-serif;"
                placeholder="Enter course description..."
              ></textarea>
            </div>
          </form>
        </div>

        <!-- Course Units -->
        <div class="bg-white shadow-md rounded-xl p-6 mb-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900" style="font-family: Inter, sans-serif;">Course Units</h2>
            <button
              @click="addUnit"
              class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              style="font-family: Inter, sans-serif;"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-sm">Add Unit</span>
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="(unit, index) in courseForm.units"
              :key="unit.id"
              class="border border-gray-200 rounded-xl p-4"
            >
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-medium text-gray-900" style="font-family: Inter, sans-serif;">
                  Unit {{ index + 1 }}: {{ unit.name || 'Untitled Unit' }}
                </h3>
                <button
                  @click="removeUnit(index)"
                  class="text-red-500 hover:text-red-700 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
                    Unit Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="unit.name"
                    type="text"
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    style="font-family: Inter, sans-serif;"
                    placeholder="Enter unit name..."
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
                    Duration (Hours) <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="unit.duration"
                    type="number"
                    required
                    min="1"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    style="font-family: Inter, sans-serif;"
                  />
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
                  Unit Description
                </label>
                <textarea
                  v-model="unit.description"
                  rows="2"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  style="font-family: Inter, sans-serif;"
                  placeholder="Enter unit description..."
                ></textarea>
              </div>
            </div>

            <div v-if="courseForm.units.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900" style="font-family: Inter, sans-serif;">No units added</h3>
              <p class="mt-1 text-sm text-gray-500" style="font-family: Inter, sans-serif;">Get started by adding the first unit to your course.</p>
            </div>
          </div>
        </div>

        <!-- Teacher Assignment -->
        <div class="bg-white shadow-md rounded-xl p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6" style="font-family: Inter, sans-serif;">Teacher Assignment</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
                Primary Teacher <span class="text-red-500">*</span>
              </label>
              <select
                v-model="courseForm.primaryTeacherId"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                style="font-family: Inter, sans-serif;"
              >
                <option value="">Select Primary Teacher</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.name }} - {{ teacher.subject }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
                Assistant Teacher
              </label>
              <select
                v-model="courseForm.assistantTeacherId"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                style="font-family: Inter, sans-serif;"
              >
                <option value="">Select Assistant Teacher (Optional)</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.name }} - {{ teacher.subject }}
                </option>
              </select>
            </div>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
              Preferred Room
            </label>
            <select
              v-model="courseForm.preferredRoomId"
              class="w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              style="font-family: Inter, sans-serif;"
            >
              <option value="">Select Preferred Room (Optional)</option>
              <option v-for="room in rooms" :key="room.id" :value="room.id">
                {{ room.name }} - Capacity: {{ room.capacity }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Quick Actions Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white shadow-md rounded-xl p-6 sticky top-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6" style="font-family: Inter, sans-serif;">Course Actions</h3>
          
          <div class="space-y-4">
            <button
              @click="previewCourse"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              style="font-family: Inter, sans-serif;"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span class="text-sm">Preview Course</span>
            </button>
            
            <button
              @click="duplicateCourse"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              style="font-family: Inter, sans-serif;"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span class="text-sm">Duplicate Course</span>
            </button>
            
            <button
              @click="exportCourse"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              style="font-family: Inter, sans-serif;"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-sm">Export Course</span>
            </button>
          </div>

          <!-- Course Stats -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-700 mb-4" style="font-family: Inter, sans-serif;">Course Statistics</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600" style="font-family: Inter, sans-serif;">Total Units</span>
                <span class="text-sm font-medium text-gray-900" style="font-family: Inter, sans-serif;">{{ courseForm.units.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600" style="font-family: Inter, sans-serif;">Total Hours</span>
                <span class="text-sm font-medium text-gray-900" style="font-family: Inter, sans-serif;">{{ totalHours }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600" style="font-family: Inter, sans-serif;">Credits</span>
                <span class="text-sm font-medium text-gray-900" style="font-family: Inter, sans-serif;">{{ courseForm.credits }}</span>
              </div>
            </div>
          </div>

          <!-- Validation Status -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-700 mb-4" style="font-family: Inter, sans-serif;">Validation Status</h4>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" :class="courseForm.name ? 'text-green-500' : 'text-red-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="courseForm.name ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M6 18L18 6M6 6l12 12'" />
                </svg>
                <span class="text-sm text-gray-600" style="font-family: Inter, sans-serif;">Course Name</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" :class="courseForm.units.length > 0 ? 'text-green-500' : 'text-red-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="courseForm.units.length > 0 ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M6 18L18 6M6 6l12 12'" />
                </svg>
                <span class="text-sm text-gray-600" style="font-family: Inter, sans-serif;">Course Units</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" :class="courseForm.primaryTeacherId ? 'text-green-500' : 'text-red-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="courseForm.primaryTeacherId ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M6 18L18 6M6 6l12 12'" />
                </svg>
                <span class="text-sm text-gray-600" style="font-family: Inter, sans-serif;">Primary Teacher</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Types
interface CourseUnit {
  id: string
  name: string
  description: string
  duration: number
}

interface Course {
  name: string
  code: string
  subjectId: string
  credits: number
  blockSize: string
  description: string
  units: CourseUnit[]
  primaryTeacherId: string
  assistantTeacherId: string
  preferredRoomId: string
}

// State
const courseForm = ref<Course>({
  name: '',
  code: '',
  subjectId: '',
  credits: 3,
  blockSize: '2',
  description: '',
  units: [],
  primaryTeacherId: '',
  assistantTeacherId: '',
  preferredRoomId: ''
})

// Mock Data
const subjects = ref([
  { id: '1', name: 'Mathematics' },
  { id: '2', name: 'Physics' },
  { id: '3', name: 'Chemistry' },
  { id: '4', name: 'Biology' },
  { id: '5', name: 'Computer Science' }
])

const teachers = ref([
  { id: '1', name: 'Dr. Smith', subject: 'Mathematics' },
  { id: '2', name: 'Prof. Johnson', subject: 'Physics' },
  { id: '3', name: 'Dr. Williams', subject: 'Chemistry' },
  { id: '4', name: 'Prof. Brown', subject: 'Biology' },
  { id: '5', name: 'Dr. Davis', subject: 'Computer Science' }
])

const rooms = ref([
  { id: '1', name: 'Room A101', capacity: 30 },
  { id: '2', name: 'Lab B205', capacity: 25 },
  { id: '3', name: 'Lecture Hall C301', capacity: 100 },
  { id: '4', name: 'Room D102', capacity: 35 },
  { id: '5', name: 'Computer Lab E201', capacity: 20 }
])

// Computed
const totalHours = computed(() => {
  return courseForm.value.units.reduce((sum, unit) => sum + (unit.duration || 0), 0)
})

const isValidCourse = computed(() => {
  return courseForm.value.name && 
         courseForm.value.code && 
         courseForm.value.subjectId && 
         courseForm.value.units.length > 0 && 
         courseForm.value.primaryTeacherId
})

const completionPercentage = computed(() => {
  let completed = 0
  let total = 6 // Total number of required fields
  
  if (courseForm.value.name) completed++
  if (courseForm.value.code) completed++
  if (courseForm.value.subjectId) completed++
  if (courseForm.value.credits) completed++
  if (courseForm.value.units.length > 0) completed++
  if (courseForm.value.primaryTeacherId) completed++
  
  return Math.round((completed / total) * 100)
})

// Methods
const addUnit = () => {
  courseForm.value.units.push({
    id: Date.now().toString(),
    name: '',
    description: '',
    duration: 1
  })
}

const removeUnit = (index: number) => {
  courseForm.value.units.splice(index, 1)
}

const saveDraft = () => {
  console.log('Saving draft...')
  // Save logic here
}

const publishCourse = () => {
  if (!isValidCourse.value) {
    alert('Please complete all required fields before publishing.')
    return
  }
  console.log('Publishing course...')
  // Publish logic here
}

const saveCourse = () => {
  console.log('Saving course...')
  // Save logic here
}

const previewCourse = () => {
  console.log('Previewing course...')
  // Preview logic here
}

const duplicateCourse = () => {
  console.log('Duplicating course...')
  // Duplicate logic here
}

const exportCourse = () => {
  console.log('Exporting course...')
  // Export logic here
}

// Lifecycle
onMounted(() => {
  console.log('Course Editor mounted')
})
</script>

<style scoped>
.course-editor {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 
