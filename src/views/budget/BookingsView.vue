<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Calendar class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Buchungen' : 'Bookings' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Raum- und Ressourcenbuchungen mit Kalenderansichten' : 'Room and resource booking with calendar views' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="viewMode = viewMode === 'calendar' ? 'list' : 'calendar'" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <component :is="viewMode === 'calendar' ? List : Calendar" class="h-4 w-4 mr-2" />
          {{ viewMode === 'calendar' ? (language === 'de' ? 'Listenansicht' : 'List View') : (language === 'de' ? 'Kalenderansicht' : 'Calendar View') }}
        </button>
        <button @click="showFilters = !showFilters" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Filter class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Filter' : 'Filters' }}
        </button>
        <button @click="showNewBooking = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Neue Buchung' : 'New Booking' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
      <div v-for="stat in bookingStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center">
          <div :class="stat.iconBg" class="p-2 sm:p-3 rounded-lg mb-2 sm:mb-0 sm:mr-4 self-start sm:self-auto">
            <component :is="stat.icon" class="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{{ stat.title }}</p>
            <p class="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-50">{{ stat.value }}</p>
            <p :class="stat.changeColor" class="text-xs sm:text-sm truncate">{{ stat.change }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Zeitraum' : 'Date Range' }}
          </label>
          <select v-model="filters.dateRange" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="today">{{ language === 'de' ? 'Heute' : 'Today' }}</option>
            <option value="week">{{ language === 'de' ? 'Diese Woche' : 'This Week' }}</option>
            <option value="month">{{ language === 'de' ? 'Dieser Monat' : 'This Month' }}</option>
            <option value="quarter">{{ language === 'de' ? 'Dieses Quartal' : 'This Quarter' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Ressourcentyp' : 'Resource Type' }}
          </label>
          <select v-model="filters.resourceType" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Typen' : 'All Types' }}</option>
            <option value="classroom">{{ language === 'de' ? 'Klassenzimmer' : 'Classroom' }}</option>
            <option value="lab">{{ language === 'de' ? 'Labor' : 'Laboratory' }}</option>
            <option value="auditorium">{{ language === 'de' ? 'Auditorium' : 'Auditorium' }}</option>
            <option value="equipment">{{ language === 'de' ? 'Ausrüstung' : 'Equipment' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Status' : 'Status' }}
          </label>
          <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="confirmed">{{ language === 'de' ? 'Bestätigt' : 'Confirmed' }}</option>
            <option value="pending">{{ language === 'de' ? 'Ausstehend' : 'Pending' }}</option>
            <option value="cancelled">{{ language === 'de' ? 'Storniert' : 'Cancelled' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Benutzer' : 'User' }}
          </label>
          <input v-model="filters.user" type="text" :placeholder="language === 'de' ? 'Nach Benutzer suchen...' : 'Search by user...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400">
        </div>
      </div>
    </div>

    <!-- Calendar View -->
    <div v-if="viewMode === 'calendar'" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
          {{ language === 'de' ? 'Kalenderansicht' : 'Calendar View' }}
        </h2>
        <div class="flex items-center space-x-2">
          <button @click="previousMonth" class="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
            <ChevronLeft class="h-4 w-4" />
          </button>
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[120px] text-center">
            {{ currentMonthYear }}
          </span>
          <button @click="nextMonth" class="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-1 mb-4">
        <div v-for="day in weekDays" :key="day" class="p-2 text-xs font-medium text-slate-500 dark:text-slate-400 text-center">
          {{ day }}
        </div>
        <div v-for="day in calendarDays" :key="day.date" class="min-h-[80px] p-1 border border-slate-200 dark:border-slate-700 rounded" :class="{ 'bg-slate-50 dark:bg-slate-700': !day.currentMonth }">
          <div class="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{{ day.day }}</div>
          <div v-for="booking in day.bookings" :key="booking.id" class="text-xs p-1 mb-1 rounded truncate" :class="getBookingStatusColor(booking)">
            {{ booking.title }}
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Ressource' : 'Resource' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Benutzer' : 'User' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Datum & Zeit' : 'Date & Time' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Dauer' : 'Duration' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Status' : 'Status' }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-slate-50 dark:hover:bg-slate-700">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div :class="getResourceIcon(booking.resourceType)" class="p-2 rounded-lg mr-3">
                    <component :is="getResourceIconComponent(booking.resourceType)" class="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ booking.resourceName }}</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">{{ getResourceTypeTranslation(booking.resourceType) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-800 dark:text-slate-50">{{ booking.userName }}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">{{ booking.userRole }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-800 dark:text-slate-50">{{ formatDate(booking.startDate) }}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">{{ formatTime(booking.startTime) }} - {{ formatTime(booking.endTime) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-800 dark:text-slate-50">{{ booking.duration }}</div>
              </td>
              <td class="px-6 py-4">
                <span :class="getBookingStatusColor(booking)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getBookingStatusTranslation(booking.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex space-x-2">
                  <button @click="viewBookingDetails(booking)" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="editBooking(booking)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="cancelBooking(booking)" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                    <X class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden p-4 space-y-4">
        <div v-for="booking in filteredBookings" :key="booking.id" class="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <div :class="getResourceIcon(booking.resourceType)" class="p-2 rounded-lg mr-3">
                <component :is="getResourceIconComponent(booking.resourceType)" class="h-4 w-4 text-white" />
              </div>
              <div>
                <div class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ booking.resourceName }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">{{ getResourceTypeTranslation(booking.resourceType) }}</div>
              </div>
            </div>
            <span :class="getBookingStatusColor(booking)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
              {{ getBookingStatusTranslation(booking.status) }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Benutzer' : 'User' }}</div>
              <div class="text-sm text-slate-800 dark:text-slate-50">{{ booking.userName }}</div>
            </div>
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Dauer' : 'Duration' }}</div>
              <div class="text-sm text-slate-800 dark:text-slate-50">{{ booking.duration }}</div>
            </div>
          </div>
          <div class="mb-3">
            <div class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Datum & Zeit' : 'Date & Time' }}</div>
            <div class="text-sm text-slate-800 dark:text-slate-50">{{ formatDate(booking.startDate) }} {{ formatTime(booking.startTime) }} - {{ formatTime(booking.endTime) }}</div>
          </div>
          <div class="flex justify-end space-x-2">
            <button @click="viewBookingDetails(booking)" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1">
              <Eye class="h-4 w-4" />
            </button>
            <button @click="editBooking(booking)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-1">
              <Edit class="h-4 w-4" />
            </button>
            <button @click="cancelBooking(booking)" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1">
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Booking Modal -->
    <div v-if="showNewBookingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Neue Buchung' : 'New Booking' }}
          </h3>
          <button @click="showNewBookingModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <form @submit.prevent="createNewBooking" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Ressource' : 'Resource' }}
            </label>
            <select v-model="newBooking.resourceId" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
              <option value="">{{ language === 'de' ? 'Ressource auswählen...' : 'Select resource...' }}</option>
              <option v-for="resource in availableResources" :key="resource.id" :value="resource.id">
                {{ resource.name }} ({{ getResourceTypeTranslation(resource.type) }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Titel' : 'Title' }}
            </label>
            <input v-model="newBooking.title" type="text" required :placeholder="language === 'de' ? 'Buchungstitel...' : 'Booking title...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Startdatum' : 'Start Date' }}
              </label>
              <input v-model="newBooking.startDate" type="date" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Enddatum' : 'End Date' }}
              </label>
              <input v-model="newBooking.endDate" type="date" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Startzeit' : 'Start Time' }}
              </label>
              <input v-model="newBooking.startTime" type="time" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Endzeit' : 'End Time' }}
              </label>
              <input v-model="newBooking.endTime" type="time" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Notizen' : 'Notes' }}
            </label>
            <textarea v-model="newBooking.notes" rows="3" :placeholder="language === 'de' ? 'Zusätzliche Notizen...' : 'Additional notes...'" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400"></textarea>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showNewBookingModal = false" class="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button type="submit" class="px-4 py-2 bg-gradient-to-r from-indigo-700 to-blue-600 text-white rounded-lg hover:from-indigo-800 hover:to-blue-700">
              {{ language === 'de' ? 'Buchung erstellen' : 'Create Booking' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguageStore } from '../../stores/language'
import {
  Calendar, CalendarDays, ChevronRight, Filter, List, Plus, Eye, Edit, X,
  ChevronLeft, ChevronRight as ChevronRightIcon, DoorOpen, MonitorSpeaker,
  Microscope, Cpu, Clock, Users, CheckCircle, AlertCircle
} from 'lucide-vue-next'

const languageStore = useLanguageStore()
const language = computed(() => languageStore.language)

// Reactive data
const showFilters = ref(false)
const showNewBookingModal = ref(false)
const viewMode = ref<'calendar' | 'list'>('list')
const currentDate = ref(new Date())

const filters = ref({
  dateRange: 'week',
  resourceType: '',
  status: '',
  user: ''
})

const newBooking = ref({
  resourceId: '',
  title: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  notes: ''
})

// Mock data
const bookings = ref([
  {
    id: 1,
    resourceId: 1,
    resourceName: 'Science Lab A',
    resourceType: 'lab',
    title: 'Chemistry Experiment',
    userName: 'Dr. Sarah Wilson',
    userRole: 'Teacher',
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    startTime: '09:00',
    endTime: '11:00',
    duration: '2 hours',
    status: 'confirmed',
    notes: 'Advanced chemistry experiments'
  },
  {
    id: 2,
    resourceId: 2,
    resourceName: 'Classroom 101',
    resourceType: 'classroom',
    title: 'Mathematics Lecture',
    userName: 'Prof. John Smith',
    userRole: 'Teacher',
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    startTime: '14:00',
    endTime: '15:30',
    duration: '1.5 hours',
    status: 'confirmed',
    notes: 'Calculus class for Grade 12'
  },
  {
    id: 3,
    resourceId: 3,
    resourceName: 'Main Auditorium',
    resourceType: 'auditorium',
    title: 'School Assembly',
    userName: 'Principal Johnson',
    userRole: 'Principal',
    startDate: '2024-01-16',
    endDate: '2024-01-16',
    startTime: '10:00',
    endTime: '11:00',
    duration: '1 hour',
    status: 'pending',
    notes: 'Monthly school assembly'
  },
  {
    id: 4,
    resourceId: 4,
    resourceName: 'Projector Cart 5',
    resourceType: 'equipment',
    title: 'History Presentation',
    userName: 'Ms. Emily Davis',
    userRole: 'Teacher',
    startDate: '2024-01-16',
    endDate: '2024-01-16',
    startTime: '13:00',
    endTime: '14:00',
    duration: '1 hour',
    status: 'confirmed',
    notes: 'World War II presentation'
  }
])

const availableResources = ref([
  { id: 1, name: 'Science Lab A', type: 'lab', capacity: 30 },
  { id: 2, name: 'Classroom 101', type: 'classroom', capacity: 35 },
  { id: 3, name: 'Main Auditorium', type: 'auditorium', capacity: 200 },
  { id: 4, name: 'Projector Cart 5', type: 'equipment', capacity: 1 },
  { id: 5, name: 'Computer Lab B', type: 'lab', capacity: 25 },
  { id: 6, name: 'Classroom 205', type: 'classroom', capacity: 40 }
])

// Computed properties
const bookingStats = computed(() => [
  {
    title: language.value === 'de' ? 'Heutige Buchungen' : 'Today\'s Bookings',
    value: bookings.value.filter(b => b.startDate === new Date().toISOString().split('T')[0]).length.toString(),
    change: language.value === 'de' ? '+12% von gestern' : '+12% from yesterday',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: Calendar,
    iconBg: 'bg-blue-500'
  },
  {
    title: language.value === 'de' ? 'Aktive Buchungen' : 'Active Bookings',
    value: bookings.value.filter(b => b.status === 'confirmed').length.toString(),
    change: language.value === 'de' ? '85% Bestätigungsrate' : '85% confirmation rate',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: CheckCircle,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Verfügbare Ressourcen' : 'Available Resources',
    value: availableResources.value.length.toString(),
    change: language.value === 'de' ? '95% Verfügbarkeit' : '95% availability',
    changeColor: 'text-blue-600 dark:text-blue-400',
    icon: DoorOpen,
    iconBg: 'bg-purple-500'
  },
  {
    title: language.value === 'de' ? 'Ausstehend' : 'Pending Approval',
    value: bookings.value.filter(b => b.status === 'pending').length.toString(),
    change: language.value === 'de' ? 'Benötigen Genehmigung' : 'Need approval',
    changeColor: 'text-yellow-600 dark:text-yellow-400',
    icon: AlertCircle,
    iconBg: 'bg-yellow-500'
  }
])

const filteredBookings = computed(() => {
  let filtered = bookings.value

  if (filters.value.resourceType) {
    filtered = filtered.filter(b => b.resourceType === filters.value.resourceType)
  }

  if (filters.value.status) {
    filtered = filtered.filter(b => b.status === filters.value.status)
  }

  if (filters.value.user) {
    filtered = filtered.filter(b => 
      b.userName.toLowerCase().includes(filters.value.user.toLowerCase())
    )
  }

  return filtered
})

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString(language.value === 'de' ? 'de-DE' : 'en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const weekDays = computed(() => {
  if (language.value === 'de') {
    return ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  }
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const currentDateObj = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    const dayBookings = bookings.value.filter(booking => 
      booking.startDate === currentDateObj.toISOString().split('T')[0]
    )
    
    days.push({
      date: new Date(currentDateObj).toISOString().split('T')[0],
      day: currentDateObj.getDate(),
      currentMonth: currentDateObj.getMonth() === month,
      bookings: dayBookings
    })
    
    currentDateObj.setDate(currentDateObj.getDate() + 1)
  }
  
  return days
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(language.value === 'de' ? 'de-DE' : 'en-US')
}

const formatTime = (timeString: string) => {
  return timeString
}

const getResourceIcon = (type: string) => {
  const iconMap = {
    classroom: 'bg-blue-500',
    lab: 'bg-green-500',
    auditorium: 'bg-purple-500',
    equipment: 'bg-orange-500'
  }
  return iconMap[type as keyof typeof iconMap] || 'bg-gray-500'
}

const getResourceIconComponent = (type: string) => {
  const iconMap = {
    classroom: DoorOpen,
    lab: Microscope,
    auditorium: MonitorSpeaker,
    equipment: Cpu
  }
  return iconMap[type as keyof typeof iconMap] || DoorOpen
}

const getResourceTypeTranslation = (type: string) => {
  const translations = {
    classroom: language.value === 'de' ? 'Klassenzimmer' : 'Classroom',
    lab: language.value === 'de' ? 'Labor' : 'Laboratory',
    auditorium: language.value === 'de' ? 'Auditorium' : 'Auditorium',
    equipment: language.value === 'de' ? 'Ausrüstung' : 'Equipment'
  }
  return translations[type as keyof typeof translations] || type
}

const getBookingStatusColor = (booking: any) => {
  switch (booking.status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getBookingStatusTranslation = (status: string) => {
  const translations = {
    confirmed: language.value === 'de' ? 'Bestätigt' : 'Confirmed',
    pending: language.value === 'de' ? 'Ausstehend' : 'Pending',
    cancelled: language.value === 'de' ? 'Storniert' : 'Cancelled'
  }
  return translations[status as keyof typeof translations] || status
}

const viewBookingDetails = (booking: any) => {
  console.log('View booking details:', booking)
}

const editBooking = (booking: any) => {
  console.log('Edit booking:', booking)
}

const cancelBooking = (booking: any) => {
  if (confirm(language.value === 'de' ? 'Buchung stornieren?' : 'Cancel booking?')) {
    booking.status = 'cancelled'
  }
}

const createNewBooking = () => {
  const booking = {
    id: bookings.value.length + 1,
    resourceId: parseInt(newBooking.value.resourceId),
    resourceName: availableResources.value.find(r => r.id === parseInt(newBooking.value.resourceId))?.name || '',
    resourceType: availableResources.value.find(r => r.id === parseInt(newBooking.value.resourceId))?.type || '',
    title: newBooking.value.title,
    userName: 'Current User',
    userRole: 'Teacher',
    startDate: newBooking.value.startDate,
    endDate: newBooking.value.endDate,
    startTime: newBooking.value.startTime,
    endTime: newBooking.value.endTime,
    duration: calculateDuration(newBooking.value.startTime, newBooking.value.endTime),
    status: 'pending',
    notes: newBooking.value.notes
  }
  
  bookings.value.push(booking)
  showNewBookingModal.value = false
  
  // Reset form
  newBooking.value = {
    resourceId: '',
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    notes: ''
  }
}

const calculateDuration = (start: string, end: string) => {
  const startTime = new Date(`2000-01-01T${start}`)
  const endTime = new Date(`2000-01-01T${end}`)
  const diffMs = endTime.getTime() - startTime.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  return diffHours === 1 ? '1 hour' : `${diffHours} hours`
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}
</script> 