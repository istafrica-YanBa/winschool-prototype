<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div class="flex items-center">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Calendar class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Elterngespräche verwalten' : 'Manage Parent Meetings' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie Termine mit Eltern und Erziehungsberechtigten' : 'Manage appointments with parents and guardians' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showRequestModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Termin anfragen' : 'Request Meeting' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
              {{ language === 'de' ? 'Wartende Anfragen' : 'Pending Requests' }}
            </p>
            <p class="text-3xl font-bold text-orange-600">{{ pendingRequests.length }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
            <Clock class="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
              {{ language === 'de' ? 'Geplante Termine' : 'Scheduled Meetings' }}
            </p>
            <p class="text-3xl font-bold text-blue-600">{{ scheduledMeetings.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
            <Calendar class="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
              {{ language === 'de' ? 'Diese Woche' : 'This Week' }}
            </p>
            <p class="text-3xl font-bold text-green-600">{{ thisWeekMeetings.length }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
            <TrendingUp class="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
              {{ language === 'de' ? 'Abgeschlossen' : 'Completed' }}
            </p>
            <p class="text-3xl font-bold text-purple-600">{{ completedMeetings.length }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
            <CheckCircle class="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Requests Section -->
    <div v-if="pendingRequests.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
        <AlertCircle class="h-5 w-5 text-orange-600 mr-2" />
        {{ language === 'de' ? 'Wartende Anfragen' : 'Pending Requests' }}
      </h3>
      <div class="space-y-4">
        <div
          v-for="request in pendingRequests"
          :key="request.id"
          class="border border-orange-200 dark:border-orange-700 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <img :src="request.parentAvatar" :alt="request.parentName" class="w-10 h-10 rounded-full mr-3" />
                <div>
                  <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ request.parentName }}</h4>
                  <p class="text-sm text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Elternteil von' : 'Parent of' }} {{ request.studentName }}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-3">
                <div class="flex items-center text-slate-600 dark:text-slate-400">
                  <Calendar class="h-4 w-4 mr-2" />
                  {{ language === 'de' ? 'Gewünschtes Datum:' : 'Requested Date:' }} {{ formatDate(request.requestedDate) }}
                </div>
                <div class="flex items-center text-slate-600 dark:text-slate-400">
                  <Clock class="h-4 w-4 mr-2" />
                  {{ language === 'de' ? 'Gewünschte Zeit:' : 'Requested Time:' }} {{ request.requestedTime }}
                </div>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">
                <strong>{{ language === 'de' ? 'Zweck:' : 'Purpose:' }}</strong> {{ request.purpose }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ language === 'de' ? 'Angefragt am:' : 'Requested on:' }} {{ formatDate(request.requestedAt) }}
              </p>
            </div>
            <div class="ml-4 flex flex-col space-y-2">
              <button
                @click="approveRequest(request)"
                class="px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
              >
                {{ language === 'de' ? 'Genehmigen' : 'Approve' }}
              </button>
              <button
                @click="showRescheduleModal(request)"
                class="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                {{ language === 'de' ? 'Umplanen' : 'Reschedule' }}
              </button>
              <button
                @click="declineRequest(request)"
                class="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                {{ language === 'de' ? 'Ablehnen' : 'Decline' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View Toggle & Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <!-- View Toggle -->
        <div class="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          <button
            @click="currentView = 'calendar'"
            :class="[
              'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
              currentView === 'calendar'
                ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-200 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            ]"
          >
            <Calendar class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Kalender' : 'Calendar' }}
          </button>
          <button
            @click="currentView = 'list'"
            :class="[
              'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
              currentView === 'list'
                ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-200 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            ]"
          >
            <List class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Liste' : 'List' }}
          </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select v-model="selectedStudent" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">{{ language === 'de' ? 'Alle Schüler' : 'All Students' }}</option>
            <option v-for="student in students" :key="student.id" :value="student.id">{{ student.name }}</option>
          </select>
          <select v-model="selectedStatus" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="scheduled">{{ language === 'de' ? 'Geplant' : 'Scheduled' }}</option>
            <option value="completed">{{ language === 'de' ? 'Abgeschlossen' : 'Completed' }}</option>
            <option value="cancelled">{{ language === 'de' ? 'Abgesagt' : 'Cancelled' }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Calendar/List Views would go here - similar to parent view but with teacher perspective -->

    <!-- Calendar View -->
    <transition name="fade" mode="out-in">
      <div v-if="currentView === 'calendar'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {{ formatMonthYear(currentDate) }}
            </h2>
            <div class="flex items-center space-x-2">
              <button @click="previousMonth" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ChevronLeft class="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button @click="nextMonth" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ChevronRight class="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="p-6">
          <!-- Weekdays -->
          <div class="grid grid-cols-7 gap-px mb-4">
            <div v-for="day in weekdays" :key="day" class="text-center text-sm font-medium text-slate-600 dark:text-slate-400 p-3">
              {{ day }}
            </div>
          </div>

          <!-- Calendar Days -->
          <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            <div
              v-for="day in calendarDays"
              :key="day.date"
              :class="[
                'bg-white dark:bg-gray-800 p-3 min-h-[120px] relative transition-colors duration-200 cursor-pointer',
                day.isCurrentMonth ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600',
                day.isToday ? 'bg-blue-50 dark:bg-blue-900/20' : '',
                day.meetings.length > 0 ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''
              ]"
              @click="day.meetings.length > 0 && showDayMeetings(day)"
            >
              <div class="flex items-center justify-between mb-2">
                <span :class="[
                  'text-sm font-medium',
                  day.isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs' : ''
                ]">
                  {{ day.day }}
                </span>
                <div v-if="day.meetings.length > 0" class="text-xs text-slate-500 dark:text-slate-400">
                  {{ day.meetings.length }}
                </div>
              </div>
              
              <!-- Meetings for this day -->
              <div class="space-y-1">
                <div
                  v-for="meeting in day.meetings.slice(0, 2)"
                  :key="meeting.id"
                  :class="[
                    'text-xs p-1.5 rounded-md transition-all duration-200',
                    getMeetingStatusColor(meeting.status)
                  ]"
                >
                  <div class="font-medium truncate">{{ meeting.time }}</div>
                  <div class="truncate opacity-90">{{ meeting.parentName }}</div>
                </div>
                <div v-if="day.meetings.length > 2" class="text-xs text-slate-500 dark:text-slate-400 text-center">
                  +{{ day.meetings.length - 2 }} {{ language === 'de' ? 'mehr' : 'more' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- List View -->
    <transition name="fade" mode="out-in">
      <div v-if="currentView === 'list'" class="space-y-4">
        <!-- Upcoming Meetings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            {{ language === 'de' ? 'Anstehende Termine' : 'Upcoming Meetings' }}
          </h3>
          <div v-if="upcomingMeetings.length > 0" class="space-y-4">
            <div
              v-for="meeting in upcomingMeetings"
              :key="meeting.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
              @click="showMeetingDetails(meeting)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <img :src="meeting.parentAvatar" :alt="meeting.parentName" class="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ meeting.parentName }}</h4>
                      <p class="text-sm text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Elternteil von' : 'Parent of' }} {{ meeting.studentName }}</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div class="flex items-center text-slate-600 dark:text-slate-400">
                      <Calendar class="h-4 w-4 mr-2" />
                      {{ formatDate(meeting.date) }}
                    </div>
                    <div class="flex items-center text-slate-600 dark:text-slate-400">
                      <Clock class="h-4 w-4 mr-2" />
                      {{ meeting.time }}
                    </div>
                    <div class="flex items-center text-slate-600 dark:text-slate-400">
                      <User class="h-4 w-4 mr-2" />
                      {{ meeting.studentName }}
                    </div>
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">{{ meeting.purpose }}</p>
                </div>
                <div class="ml-4">
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    getMeetingStatusBadgeColor(meeting.status)
                  ]">
                    {{ getMeetingStatusText(meeting.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <Calendar class="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p class="text-slate-600 dark:text-slate-400">
              {{ language === 'de' ? 'Keine anstehenden Termine' : 'No upcoming meetings' }}
            </p>
          </div>
        </div>

        <!-- Past Meetings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            {{ language === 'de' ? 'Vergangene Termine' : 'Past Meetings' }}
          </h3>
          <div v-if="pastMeetings.length > 0" class="space-y-4">
            <div
              v-for="meeting in pastMeetings"
              :key="meeting.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 opacity-75 hover:opacity-100 transition-all duration-200"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <img :src="meeting.parentAvatar" :alt="meeting.parentName" class="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ meeting.parentName }}</h4>
                      <p class="text-sm text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Elternteil von' : 'Parent of' }} {{ meeting.studentName }}</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div class="flex items-center text-slate-600 dark:text-slate-400">
                      <Calendar class="h-4 w-4 mr-2" />
                      {{ formatDate(meeting.date) }}
                    </div>
                    <div class="flex items-center text-slate-600 dark:text-slate-400">
                      <Clock class="h-4 w-4 mr-2" />
                      {{ meeting.time }}
                    </div>
                    <div class="flex items-center text-slate-600 dark:text-slate-400">
                      <User class="h-4 w-4 mr-2" />
                      {{ meeting.studentName }}
                    </div>
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">{{ meeting.purpose }}</p>
                  <div v-if="meeting.notes" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h5 class="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
                      {{ language === 'de' ? 'Notizen:' : 'Notes:' }}
                    </h5>
                    <p class="text-sm text-slate-600 dark:text-slate-400">{{ meeting.notes }}</p>
                  </div>
                </div>
                <div class="ml-4">
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    getMeetingStatusBadgeColor(meeting.status)
                  ]">
                    {{ getMeetingStatusText(meeting.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <Clock class="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p class="text-slate-600 dark:text-slate-400">
              {{ language === 'de' ? 'Keine vergangenen Termine' : 'No past meetings' }}
            </p>
          </div>
        </div>
      </div>
    </transition>

    <!-- Day Meetings Modal -->
    <div v-if="selectedDay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="selectedDay = null">
      <div class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full p-6" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {{ language === 'de' ? 'Termine für' : 'Meetings for' }} {{ formatDate(selectedDay.date) }}
          </h3>
          <button @click="selectedDay = null" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X class="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        
        <div class="space-y-4 max-h-96 overflow-y-auto">
          <div
            v-for="meeting in selectedDay.meetings"
            :key="meeting.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            @click="showMeetingDetails(meeting)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <img :src="meeting.parentAvatar" :alt="meeting.parentName" class="w-8 h-8 rounded-full mr-3" />
                  <div>
                    <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ meeting.parentName }}</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400">{{ meeting.studentName }}</p>
                  </div>
                </div>
                <div class="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <Clock class="h-4 w-4 mr-2" />
                  {{ meeting.time }}
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-400">{{ meeting.purpose }}</p>
              </div>
              <span :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                getMeetingStatusBadgeColor(meeting.status)
              ]">
                {{ getMeetingStatusText(meeting.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Meeting Details Modal -->
    <div v-if="selectedMeeting" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="selectedMeeting = null">
      <div class="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {{ language === 'de' ? 'Termindetails' : 'Meeting Details' }}
          </h3>
          <button @click="selectedMeeting = null" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X class="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center">
            <img :src="selectedMeeting.parentAvatar" :alt="selectedMeeting.parentName" class="w-12 h-12 rounded-full mr-3" />
            <div>
              <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ selectedMeeting.parentName }}</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Elternteil von' : 'Parent of' }} {{ selectedMeeting.studentName }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3">
            <div class="flex items-center text-slate-600 dark:text-slate-400">
              <Calendar class="h-4 w-4 mr-3" />
              <span class="text-sm">{{ formatDate(selectedMeeting.date) }}</span>
            </div>
            <div class="flex items-center text-slate-600 dark:text-slate-400">
              <Clock class="h-4 w-4 mr-3" />
              <span class="text-sm">{{ selectedMeeting.time }}</span>
            </div>
            <div class="flex items-center text-slate-600 dark:text-slate-400">
              <User class="h-4 w-4 mr-3" />
              <span class="text-sm">{{ selectedMeeting.studentName }}</span>
            </div>
            <div class="flex items-center text-slate-600 dark:text-slate-400">
              <MapPin class="h-4 w-4 mr-3" />
              <span class="text-sm">{{ selectedMeeting.location || (language === 'de' ? 'Online' : 'Online') }}</span>
            </div>
          </div>

          <div>
            <h5 class="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
              {{ language === 'de' ? 'Zweck:' : 'Purpose:' }}
            </h5>
            <p class="text-sm text-slate-600 dark:text-slate-400">{{ selectedMeeting.purpose }}</p>
          </div>

          <div v-if="selectedMeeting.notes">
            <h5 class="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
              {{ language === 'de' ? 'Notizen:' : 'Notes:' }}
            </h5>
            <p class="text-sm text-slate-600 dark:text-slate-400">{{ selectedMeeting.notes }}</p>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              v-if="selectedMeeting.status === 'scheduled'"
              @click="cancelMeeting(selectedMeeting)"
              class="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              {{ language === 'de' ? 'Absagen' : 'Cancel' }}
            </button>
            <button
              v-if="selectedMeeting.status === 'scheduled'"
              @click="rescheduleSelectedMeeting(selectedMeeting)"
              class="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              {{ language === 'de' ? 'Neu planen' : 'Reschedule' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Meeting Modal -->
    <div v-if="showRequestModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="showRequestModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {{ language === 'de' ? 'Elterngespräch anfragen' : 'Request Parent Meeting' }}
          </h3>
          <button @click="showRequestModal = false" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X class="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        
        <form @submit.prevent="requestMeeting" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Schüler' : 'Student' }}
            </label>
            <select v-model="requestForm.studentId" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">{{ language === 'de' ? 'Schüler auswählen' : 'Select student' }}</option>
              <option v-for="student in students" :key="student.id" :value="student.id">{{ student.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Bevorzugtes Datum' : 'Preferred Date' }}
            </label>
            <input v-model="requestForm.preferredDate" type="date" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Bevorzugte Zeit' : 'Preferred Time' }}
            </label>
            <input v-model="requestForm.preferredTime" type="time" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Zweck des Gesprächs' : 'Purpose of Meeting' }}
            </label>
            <textarea v-model="requestForm.purpose" required rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" :placeholder="language === 'de' ? 'Beschreiben Sie den Zweck des Gesprächs...' : 'Describe the purpose of the meeting...'"></textarea>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" @click="showRequestModal = false" class="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button type="submit" class="px-4 py-2 text-sm bg-winschool-primary text-slate-800 hover:bg-winschool-primary-dark rounded-lg transition-colors">
              {{ language === 'de' ? 'Anfrage senden' : 'Send Request' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Calendar, List, Plus, Clock, TrendingUp, CheckCircle, AlertCircle, X, ChevronLeft, ChevronRight, User, MapPin } from 'lucide-vue-next'

// --- Domain Types (see autocoding/context/ and frontend patterns) ---
interface Meeting {
  id: number
  date: string
  time: string
  parentName: string
  parentAvatar: string
  studentName: string
  purpose: string
  status: 'scheduled' | 'completed' | 'cancelled'
  location?: string
  notes?: string
}

interface Day {
  day: number
  date: string
  isCurrentMonth: boolean
  isToday: boolean
  meetings: Meeting[]
}

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Reactive data
const currentView = ref('list')
const selectedStudent = ref('')
const selectedStatus = ref('')
const showRequestModal = ref(false)

// Form data
const requestForm = ref({
  studentId: '',
  preferredDate: '',
  preferredTime: '',
  purpose: ''
})

// Calendar data
const currentDate = ref(new Date())
const selectedDay = ref<Day | null>(null)
const selectedMeeting = ref<Meeting | null>(null)

// Sample data for teacher perspective
const students = ref([
  { id: 1, name: 'Emma Müller', className: 'Class 10A' },
  { id: 2, name: 'Liam Weber', className: 'Class 10A' },
  { id: 3, name: 'Sophie Schmidt', className: 'Class 10B' },
  { id: 4, name: 'Max Fischer', className: 'Class 10B' }
])

// All meetings
const meetings = ref([
  {
    id: 1,
    date: '2024-01-25',
    time: '10:00 AM',
    parentName: 'Maria Müller',
    parentAvatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    studentName: 'Emma Müller',
    purpose: 'Discuss Emma\'s progress in algebra',
    status: 'scheduled',
    location: 'Room 205'
  },
  {
    id: 2,
    date: '2024-01-28',
    time: '2:00 PM',
    parentName: 'Klaus Weber',
    parentAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    studentName: 'Liam Weber',
    purpose: 'Review chemistry lab performance and study habits',
    status: 'scheduled',
    location: 'Science Lab'
  },
  {
    id: 3,
    date: '2024-01-15',
    time: '11:00 AM',
    parentName: 'Lisa Wilson',
    parentAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    studentName: 'Emma Müller',
    purpose: 'Review study habits and performance',
    status: 'completed',
    location: 'Room 101',
    notes: 'Discussed improvement strategies. Parent agreed to monitor homework completion.'
  },
  {
    id: 4,
    date: '2024-01-30',
    time: '3:00 PM',
    parentName: 'Sarah Johnson',
    parentAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    studentName: 'Sophie Schmidt',
    purpose: 'Discuss mathematics performance and upcoming competition',
    status: 'scheduled',
    location: 'Room 205'
  },
  {
    id: 5,
    date: '2024-01-30',
    time: '4:00 PM',
    parentName: 'Michael Brown',
    parentAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    studentName: 'Max Fischer',
    purpose: 'Review science project progress',
    status: 'scheduled',
    location: 'Science Lab'
  }
])

// Pending requests from parents
const pendingRequests = ref([
  {
    id: 1,
    parentName: 'Maria Müller',
    parentAvatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    studentName: 'Emma Müller',
    requestedDate: '2024-01-30',
    requestedTime: '10:00 AM',
    purpose: 'Discuss Emma\'s progress in mathematics and upcoming exams',
    requestedAt: '2024-01-20',
    status: 'pending'
  },
  {
    id: 2,
    parentName: 'Klaus Weber',
    parentAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    studentName: 'Liam Weber',
    requestedDate: '2024-02-01',
    requestedTime: '2:00 PM',
    purpose: 'Review Liam\'s chemistry lab performance and study habits',
    requestedAt: '2024-01-21',
    status: 'pending'
  }
])

// Computed properties
const scheduledMeetings = computed(() => {
  const now = new Date()
  return meetings.value.filter(meeting => {
    const meetingDate = new Date(meeting.date)
    return meetingDate >= now && meeting.status === 'scheduled'
  })
})

const completedMeetings = computed(() => meetings.value.filter(m => m.status === 'completed'))

const thisWeekMeetings = computed(() => {
  const now = new Date()
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  return meetings.value.filter(meeting => {
    const meetingDate = new Date(meeting.date)
    return meetingDate >= now && meetingDate <= oneWeekFromNow && meeting.status === 'scheduled'
  })
})

const weekdays = computed(() => {
  return language.value === 'de' 
    ? ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
})

const upcomingMeetings = computed(() => {
  const now = new Date()
  return meetings.value.filter(meeting => {
    const meetingDate = new Date(meeting.date)
    return meetingDate >= now && (selectedStudent.value === '' || meeting.studentName.includes(students.value.find(s => String(s.id) === selectedStudent.value)?.name || ''))
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const pastMeetings = computed(() => {
  const now = new Date()
  return meetings.value.filter(meeting => {
    const meetingDate = new Date(meeting.date)
    return meetingDate < now && (selectedStudent.value === '' || meeting.studentName.includes(students.value.find(s => String(s.id) === selectedStudent.value)?.name || ''))
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  
  const days = []
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      date: `${year}-${String(month).padStart(2, '0')}-${String(prevMonthLastDay - i).padStart(2, '0')}`,
      isCurrentMonth: false,
      isToday: false,
      meetings: []
    })
  }
  
  // Current month days
  const today = new Date()
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate()
    
    const dayMeetings = meetings.value.filter(meeting => meeting.date === date)
    
    days.push({
      day,
      date,
      isCurrentMonth: true,
      isToday,
      meetings: dayMeetings
    })
  }
  
  // Next month days
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      date: `${year}-${String(month + 2).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      isCurrentMonth: false,
      isToday: false,
      meetings: []
    })
  }
  
  return days
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return language.value === 'de' 
    ? date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const formatMonthYear = (date: Date) => {
  const months = language.value === 'de' 
    ? ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const showDayMeetings = (day: any) => {
  selectedDay.value = day
}

const showMeetingDetails = (meeting: any) => {
  selectedMeeting.value = meeting
  selectedDay.value = null
}

const getMeetingStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getMeetingStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getMeetingStatusText = (status: string) => {
  const statusTexts: Record<string, Record<string, string>> = {
    de: {
      scheduled: 'Geplant',
      completed: 'Abgeschlossen',
      cancelled: 'Abgesagt'
    },
    en: {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
  }
  return statusTexts[language.value][status] || status
}

const cancelMeeting = (meeting: any) => {
  // Implementation for canceling meeting
  console.log('Canceling meeting:', meeting)
  meeting.status = 'cancelled'
  selectedMeeting.value = null
}

const rescheduleSelectedMeeting = (meeting: any) => {
  // Implementation for rescheduling meeting
  console.log('Rescheduling meeting:', meeting)
  selectedMeeting.value = null
}

const approveRequest = (request: any) => {
  // Implementation for approving meeting request
  console.log('Approving request:', request)
  // Remove from pending and add to scheduled meetings
  const index = pendingRequests.value.findIndex(r => r.id === request.id)
  if (index > -1) {
    pendingRequests.value.splice(index, 1)
    meetings.value.push({
      id: Date.now(),
      date: request.requestedDate,
      time: request.requestedTime,
      parentName: request.parentName,
      studentName: request.studentName,
      purpose: request.purpose,
      status: 'scheduled',
      location: 'TBD'
    })
  }
}

const showRescheduleModal = (request: any) => {
  // Implementation for showing reschedule modal
  console.log('Reschedule request:', request)
}

const declineRequest = (request: any) => {
  // Implementation for declining meeting request
  console.log('Declining request:', request)
  const index = pendingRequests.value.findIndex(r => r.id === request.id)
  if (index > -1) {
    pendingRequests.value.splice(index, 1)
  }
}

const requestMeeting = () => {
  const selectedTeacher = teachers.value.find(t => String(t.id) === bookingForm.value.teacherId)
  const selectedChildName = children.value.find(c => String(c.id) === bookingForm.value.childId)?.name
  
  if (selectedTeacher && selectedChildName) {
    meetings.value.push({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: 'TBD',
      parentName: 'You',
      parentAvatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      studentName: selectedChildName,
      purpose: bookingForm.value.purpose,
      status: 'scheduled',
      location: 'TBD',
      notes: ''
    })
    
    showBookingModal.value = false
    bookingForm.value = { studentId: '', preferredDate: '', preferredTime: '', purpose: '' }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 