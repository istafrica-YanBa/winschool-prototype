<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-center">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <Calendar class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Elterngespräche' : 'Parent-Teacher Meetings' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Ihre Termine mit den Lehrern Ihrer Kinder' : 'Manage your appointments with your children\'s teachers' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="showBookingModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Termin buchen' : 'Book Meeting' }}
          </button>
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
            <select v-model="selectedChild" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              <option value="">{{ language === 'de' ? 'Alle Kinder' : 'All Children' }}</option>
              <option v-for="child in children" :key="child.id" :value="child.id">{{ child.name }}</option>
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

      <!-- Teacher Requests Section -->
      <div v-if="teacherRequests.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
          <AlertCircle class="h-5 w-5 text-blue-600 mr-2" />
          {{ language === 'de' ? 'Anfragen von Lehrern' : 'Teacher Requests' }}
        </h3>
        <div class="space-y-4">
          <div
            v-for="request in teacherRequests"
            :key="request.id"
            class="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <img :src="request.teacherAvatar" :alt="request.teacherName" class="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ request.teacherName }}</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400">{{ request.subject }} {{ language === 'de' ? 'Lehrer' : 'Teacher' }} - {{ request.childName }}</p>
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-3">
                  <div class="flex items-center text-slate-600 dark:text-slate-400">
                    <Calendar class="h-4 w-4 mr-2" />
                    {{ language === 'de' ? 'Vorgeschlagenes Datum:' : 'Proposed Date:' }} {{ formatDate(request.proposedDate) }}
                  </div>
                  <div class="flex items-center text-slate-600 dark:text-slate-400">
                    <Clock class="h-4 w-4 mr-2" />
                    {{ language === 'de' ? 'Vorgeschlagene Zeit:' : 'Proposed Time:' }} {{ request.proposedTime }}
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
                  @click="approveTeacherRequest(request)"
                  class="px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                >
                  {{ language === 'de' ? 'Bestätigen' : 'Confirm' }}
                </button>
                <button
                  @click="showRescheduleModal(request)"
                  class="px-4 py-2 text-sm bg-orange-600 text-white hover:bg-orange-700 rounded-lg transition-colors"
                >
                  {{ language === 'de' ? 'Umplanen' : 'Reschedule' }}
                </button>
                <button
                  @click="declineTeacherRequest(request)"
                  class="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                >
                  {{ language === 'de' ? 'Ablehnen' : 'Decline' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  'bg-white dark:bg-gray-800 p-3 min-h-[120px] relative transition-colors duration-200',
                  day.isCurrentMonth ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600',
                  day.isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                ]"
              >
                <div class="flex items-center justify-between mb-2">
                  <span :class="[
                    'text-sm font-medium',
                    day.isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs' : ''
                  ]">
                    {{ day.day }}
                  </span>
                </div>
                
                <!-- Meetings for this day -->
                <div class="space-y-1">
                  <div
                    v-for="meeting in day.meetings"
                    :key="meeting.id"
                    @click="showMeetingDetails(meeting)"
                    :class="[
                      'text-xs p-2 rounded-md cursor-pointer transition-all duration-200 hover:shadow-md transform hover:scale-105',
                      getMeetingStatusColor(meeting.status)
                    ]"
                  >
                    <div class="font-medium truncate">{{ meeting.time }}</div>
                    <div class="truncate opacity-90">{{ meeting.teacher }}</div>
                  </div>
                </div>
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
                    <div class="truncate opacity-90">{{ meeting.teacher }}</div>
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
                      <img :src="meeting.teacherAvatar" :alt="meeting.teacher" class="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ meeting.teacher }}</h4>
                        <p class="text-sm text-slate-600 dark:text-slate-400">{{ meeting.subject }}</p>
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
                        {{ meeting.childName }}
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
              <button @click="showBookingModal = true" class="mt-4 text-winschool-primary hover:text-winschool-primary-dark transition-colors">
                {{ language === 'de' ? 'Ersten Termin buchen' : 'Book your first meeting' }}
              </button>
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
                      <img :src="meeting.teacherAvatar" :alt="meeting.teacher" class="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ meeting.teacher }}</h4>
                        <p class="text-sm text-slate-600 dark:text-slate-400">{{ meeting.subject }}</p>
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
                        {{ meeting.childName }}
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
              <img :src="selectedMeeting.teacherAvatar" :alt="selectedMeeting.teacher" class="w-12 h-12 rounded-full mr-3" />
              <div>
                <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ selectedMeeting.teacher }}</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400">{{ selectedMeeting.subject }}</p>
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
                <span class="text-sm">{{ selectedMeeting.childName }}</span>
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
                @click="rescheduleMeeting(selectedMeeting)"
                class="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                {{ language === 'de' ? 'Neu planen' : 'Reschedule' }}
              </button>
            </div>
          </div>
        </div>
      </div>

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
                    <img :src="meeting.teacherAvatar" :alt="meeting.teacher" class="w-8 h-8 rounded-full mr-3" />
                    <div>
                      <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ meeting.teacher }}</h4>
                      <p class="text-sm text-slate-600 dark:text-slate-400">{{ meeting.subject }}</p>
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

      <!-- Booking Modal -->
      <div v-if="showBookingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="showBookingModal = false">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6" @click.stop>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {{ language === 'de' ? 'Termin buchen' : 'Book Meeting' }}
            </h3>
            <button @click="showBookingModal = false" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <X class="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
          
          <form @submit.prevent="bookMeeting" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Kind' : 'Child' }}
              </label>
              <select v-model="bookingForm.childId" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">{{ language === 'de' ? 'Kind auswählen' : 'Select child' }}</option>
                <option v-for="child in children" :key="child.id" :value="child.id">{{ child.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
              </label>
              <select v-model="bookingForm.teacherId" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">{{ language === 'de' ? 'Lehrer auswählen' : 'Select teacher' }}</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.name }} - {{ teacher.subject }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Zweck' : 'Purpose' }}
              </label>
              <textarea v-model="bookingForm.purpose" required rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" :placeholder="language === 'de' ? 'Beschreiben Sie den Zweck des Termins...' : 'Describe the purpose of the meeting...'"></textarea>
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="button" @click="showBookingModal = false" class="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Calendar, List, Plus, ChevronLeft, ChevronRight, Clock, User, MapPin, X, AlertCircle } from 'lucide-vue-next'

// --- Domain Types (see autocoding/context/ and frontend patterns) ---
interface Meeting {
  id: number
  date: string
  time: string
  teacher: string
  teacherAvatar: string
  subject: string
  childName: string
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
const currentView = ref('calendar')
const currentDate = ref(new Date())
const selectedChild = ref('')
const selectedStatus = ref('')
const selectedMeeting = ref<Meeting | null>(null)
const selectedDay = ref<Day | null>(null)
const showBookingModal = ref(false)

// Form data
const bookingForm = ref({
  childId: '',
  teacherId: '',
  purpose: ''
})

// Sample data
const children = ref([
  { id: 1, name: 'Emma Müller' },
  { id: 2, name: 'Liam Weber' }
])

const teachers = ref([
  { id: 1, name: 'Dr. Sarah Johnson', subject: 'Mathematics' },
  { id: 2, name: 'Prof. Michael Brown', subject: 'Science' },
  { id: 3, name: 'Ms. Lisa Wilson', subject: 'English' },
  { id: 4, name: 'Mr. David Miller', subject: 'History' }
])

const meetings = ref([
  {
    id: 1,
    date: '2024-01-25',
    time: '10:00 AM',
    teacher: 'Dr. Sarah Johnson',
    teacherAvatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subject: 'Mathematics',
    childName: 'Emma Müller',
    purpose: 'Discuss Emma\'s progress in algebra and upcoming exams',
    status: 'scheduled',
    location: 'Room 205'
  },
  {
    id: 2,
    date: '2024-01-28',
    time: '2:00 PM',
    teacher: 'Prof. Michael Brown',
    teacherAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subject: 'Science',
    childName: 'Liam Weber',
    purpose: 'Review chemistry lab performance and study habits',
    status: 'scheduled',
    location: 'Science Lab'
  },
  {
    id: 3,
    date: '2024-01-15',
    time: '11:00 AM',
    teacher: 'Ms. Lisa Wilson',
    teacherAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subject: 'English',
    childName: 'Emma Müller',
    purpose: 'Discuss writing improvement strategies',
    status: 'completed',
    location: 'Room 101',
    notes: 'Emma is doing well but needs to work on essay structure. Recommended additional reading materials.'
  },
  {
    id: 4,
    date: '2024-01-30',
    time: '3:00 PM',
    teacher: 'Mr. David Miller',
    teacherAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subject: 'History',
    childName: 'Emma Müller',
    purpose: 'Discuss history project and upcoming presentation',
    status: 'scheduled',
    location: 'Room 301'
  },
  {
    id: 5,
    date: '2024-01-30',
    time: '4:00 PM',
    teacher: 'Ms. Jennifer Clark',
    teacherAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subject: 'Art',
    childName: 'Liam Weber',
    purpose: 'Review art portfolio and creative development',
    status: 'scheduled',
    location: 'Art Studio'
  }
])

// Teacher requests - requests from teachers to parents
const teacherRequests = ref([
  {
    id: 1,
    teacherName: 'Dr. Sarah Johnson',
    teacherAvatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subject: 'Mathematics',
    childName: 'Emma Müller',
    proposedDate: '2024-02-05',
    proposedTime: '3:00 PM',
    purpose: 'Discuss Emma\'s performance in the recent math competition and advanced placement opportunities',
    requestedAt: '2024-01-22',
    status: 'pending'
  },
  {
    id: 2,
    teacherName: 'Ms. Lisa Wilson',
    teacherAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subject: 'English',
    childName: 'Emma Müller',
    proposedDate: '2024-02-08',
    proposedTime: '4:00 PM',
    purpose: 'Discuss Emma\'s exceptional creative writing skills and potential for advanced English courses',
    requestedAt: '2024-01-23',
    status: 'pending'
  }
])

// Computed properties
const weekdays = computed(() => {
  return language.value === 'de' 
    ? ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
})

const upcomingMeetings = computed(() => {
  const now = new Date()
  return meetings.value.filter(meeting => {
    const meetingDate = new Date(meeting.date)
    return meetingDate >= now && (selectedChild.value === '' || meeting.childName.includes(children.value.find(c => String(c.id) === String(selectedChild.value))?.name || ''))
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const pastMeetings = computed(() => {
  const now = new Date()
  return meetings.value.filter(meeting => {
    const meetingDate = new Date(meeting.date)
    return meetingDate < now && (selectedChild.value === '' || meeting.childName.includes(children.value.find(c => String(c.id) === String(selectedChild.value))?.name || ''))
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
const formatMonthYear = (date: Date) => {
  const months = language.value === 'de' 
    ? ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return language.value === 'de' 
    ? date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
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
    en: {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },
    de: {
      scheduled: 'Geplant',
      completed: 'Abgeschlossen',
      cancelled: 'Abgesagt'
    }
  }
  return statusTexts[language.value][status] || status
}

const cancelMeeting = (meeting: any) => {
  // Implementation for canceling meeting
  console.log('Canceling meeting:', meeting)
  selectedMeeting.value = null
}

const rescheduleMeeting = (meeting: any) => {
  // Implementation for rescheduling meeting
  console.log('Rescheduling meeting:', meeting)
  selectedMeeting.value = null
}

const bookMeeting = () => {
  // Implementation for booking new meeting
  console.log('Booking meeting:', bookingForm.value)
  showBookingModal.value = false
  bookingForm.value = { childId: '', teacherId: '', purpose: '' }
}

const approveTeacherRequest = (request: any) => {
  // Implementation for approving teacher meeting request
  console.log('Approving teacher request:', request)
  // Remove from teacher requests and add to scheduled meetings
  const index = teacherRequests.value.findIndex(r => r.id === request.id)
  if (index > -1) {
    teacherRequests.value.splice(index, 1)
    meetings.value.push({
      id: Date.now(),
      date: request.proposedDate,
      time: request.proposedTime,
      teacher: request.teacherName,
      teacherAvatar: request.teacherAvatar,
      subject: request.subject,
      childName: request.childName,
      purpose: request.purpose,
      status: 'scheduled',
      location: 'TBD'
    })
  }
}

const declineTeacherRequest = (request: any) => {
  // Implementation for declining teacher meeting request
  console.log('Declining teacher request:', request)
  const index = teacherRequests.value.findIndex(r => r.id === request.id)
  if (index > -1) {
    teacherRequests.value.splice(index, 1)
  }
}

const showRescheduleModal = (request: any) => {
  // Implementation for showing reschedule modal for teacher request
  console.log('Reschedule teacher request:', request)
  // You could open a modal here to let parent propose alternative times
}

const showDayMeetings = (day: any) => {
  selectedDay.value = day
}

onMounted(() => {
  // Initialize component
})
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