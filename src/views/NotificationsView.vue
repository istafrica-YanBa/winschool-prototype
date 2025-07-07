<template>
  <div class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
    <div class="p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary dark:bg-gradient-to-r dark:from-indigo-700 dark:to-blue-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <Bell class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800 dark:text-white" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Benachrichtigungen' : 'Notifications' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Bleiben Sie über wichtige Updates und Aktivitäten informiert' : 'Stay informed about important updates and activities' }}
            </p>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button 
            @click="markAllAsRead"
            class="w-full sm:w-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
          >
            <CheckCircle class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Alle als gelesen markieren' : 'Mark all as read' }}
          </button>
          <button class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark dark:bg-gradient-to-r dark:from-indigo-700 dark:to-blue-600 dark:hover:from-indigo-800 dark:hover:to-blue-700 text-slate-800 dark:text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Settings class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Einstellungen' : 'Settings' }}
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in filterTabs"
              :key="tab.id"
              @click="activeFilter = tab.id"
              :class="[
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeFilter === tab.id
                  ? 'border-winschool-primary dark:border-indigo-500 text-winschool-primary dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              ]"
            >
              {{ tab.name }}
              <span v-if="tab.count > 0" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-winschool-primary dark:bg-indigo-600 text-slate-800 dark:text-white">
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="space-y-4">
        <div v-if="filteredNotifications.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Bell class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ language === 'de' ? 'Keine Benachrichtigungen' : 'No notifications' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            {{ language === 'de' ? 'Sie haben derzeit keine Benachrichtigungen' : 'You currently have no notifications' }}
          </p>
        </div>

        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          :class="[
            'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-md',
            !notification.read ? 'ring-2 ring-winschool-primary/20 dark:ring-indigo-500/20' : ''
          ]"
        >
          <div class="flex items-start space-x-4">
            <!-- Notification Icon -->
            <div :class="[
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              getNotificationStyle(notification.type)
            ]">
              <component :is="getNotificationIcon(notification.type)" class="h-5 w-5" />
            </div>

            <!-- Notification Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">
                    {{ notification.title }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {{ notification.message }}
                  </p>
                  
                  <!-- Metadata -->
                  <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div class="flex items-center">
                      <Clock class="h-3 w-3 mr-1" />
                      {{ notification.timestamp }}
                    </div>
                    <div class="flex items-center">
                      <User class="h-3 w-3 mr-1" />
                      {{ notification.sender }}
                    </div>
                    <div v-if="notification.category" class="flex items-center">
                      <Tag class="h-3 w-3 mr-1" />
                      {{ notification.category }}
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center space-x-2 ml-4">
                  <div v-if="!notification.read" class="w-2 h-2 bg-winschool-primary dark:bg-indigo-500 rounded-full"></div>
                  
                  <!-- Action Buttons -->
                  <div class="flex space-x-1">
                    <button
                      v-if="!notification.read"
                      @click="markAsRead(notification.id)"
                      class="p-1.5 text-gray-400 hover:text-winschool-primary dark:hover:text-indigo-400 transition-colors rounded"
                      :title="language === 'de' ? 'Als gelesen markieren' : 'Mark as read'"
                    >
                      <Check class="h-4 w-4" />
                    </button>
                    
                    <button
                      @click="deleteNotification(notification.id)"
                      class="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded"
                      :title="language === 'de' ? 'Löschen' : 'Delete'"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                    
                    <button
                      v-if="notification.actionUrl"
                      @click="handleNotificationAction(notification)"
                      class="p-1.5 text-gray-400 hover:text-winschool-primary dark:hover:text-indigo-400 transition-colors rounded"
                      :title="language === 'de' ? 'Aktion ausführen' : 'Take action'"
                    >
                      <ExternalLink class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Action Buttons for Important Notifications -->
              <div v-if="notification.actions?.length" class="mt-4 flex flex-wrap gap-2">
                <button
                  v-for="action in notification.actions"
                  :key="action.id"
                  @click="handleAction(action, notification)"
                  :class="[
                    'inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                    action.primary
                      ? 'bg-winschool-primary hover:bg-winschool-primary-dark dark:bg-indigo-600 dark:hover:bg-indigo-700 text-slate-800 dark:text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  ]"
                >
                  {{ action.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMoreNotifications" class="text-center mt-8">
        <button
          @click="loadMoreNotifications"
          class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium px-6 py-2 rounded-lg transition-colors"
        >
          {{ language === 'de' ? 'Weitere laden' : 'Load more' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  Bell, 
  Settings, 
  CheckCircle, 
  Clock, 
  User, 
  Tag, 
  Check, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Calendar,
  Award,
  GraduationCap,
  Trophy
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const activeFilter = ref('all')
const hasMoreNotifications = ref(true)

const filterTabs = computed(() => [
  { 
    id: 'all', 
    name: language.value === 'de' ? 'Alle' : 'All', 
    count: notifications.value.filter(n => !n.read).length 
  },
  { 
    id: 'unread', 
    name: language.value === 'de' ? 'Ungelesen' : 'Unread', 
    count: notifications.value.filter(n => !n.read).length 
  },
  { 
    id: 'academic', 
    name: language.value === 'de' ? 'Akademisch' : 'Academic', 
    count: notifications.value.filter(n => n.type === 'academic' && !n.read).length 
  },
  { 
    id: 'system', 
    name: language.value === 'de' ? 'System' : 'System', 
    count: notifications.value.filter(n => n.type === 'system' && !n.read).length 
  }
])

const notifications = ref([
  {
    id: 1,
    type: 'academic',
    title: language.value === 'de' ? 'Neue Hausaufgabe zugewiesen' : 'New homework assigned',
    message: language.value === 'de' ? 'Mathematik Aufgaben für Kapitel 5 wurden zugewiesen. Abgabetermin: 15. März 2024' : 'Mathematics exercises for Chapter 5 have been assigned. Due date: March 15, 2024',
    sender: 'Dr. Thomas Weber',
    category: language.value === 'de' ? 'Hausaufgaben' : 'Homework',
    timestamp: language.value === 'de' ? 'vor 2 Stunden' : '2 hours ago',
    read: false,
    actionUrl: '/dashboard/homework',
    actions: [
      { id: 1, label: language.value === 'de' ? 'Ansehen' : 'View', primary: true },
      { id: 2, label: language.value === 'de' ? 'Später' : 'Later', primary: false }
    ]
  },
  {
    id: 2,
    type: 'message',
    title: language.value === 'de' ? 'Nachricht von Lehrer' : 'Message from teacher',
    message: language.value === 'de' ? 'Bitte beachten Sie die Änderungen im Stundenplan für nächste Woche.' : 'Please note the schedule changes for next week.',
    sender: 'Ms. Sarah Fischer',
    category: language.value === 'de' ? 'Mitteilungen' : 'Announcements',
    timestamp: language.value === 'de' ? 'vor 4 Stunden' : '4 hours ago',
    read: false,
    actionUrl: '/dashboard/messages'
  },
  {
    id: 3,
    type: 'grade',
    title: language.value === 'de' ? 'Neue Bewertung verfügbar' : 'New grade available',
    message: language.value === 'de' ? 'Ihre Bewertung für die Mathematikprüfung ist jetzt verfügbar.' : 'Your grade for the Mathematics exam is now available.',
    sender: 'Dr. Thomas Weber',
    category: language.value === 'de' ? 'Bewertungen' : 'Grades',
    timestamp: language.value === 'de' ? 'vor 1 Tag' : '1 day ago',
    read: true,
    actionUrl: '/dashboard/grades'
  },
  {
    id: 4,
    type: 'event',
    title: language.value === 'de' ? 'Elternabend Erinnerung' : 'Parent meeting reminder',
    message: language.value === 'de' ? 'Elternabend am 20. März um 18:00 Uhr in der Aula.' : 'Parent meeting on March 20 at 6:00 PM in the auditorium.',
    sender: 'School Administration',
    category: language.value === 'de' ? 'Veranstaltungen' : 'Events',
    timestamp: language.value === 'de' ? 'vor 2 Tagen' : '2 days ago',
    read: true,
    actionUrl: '/dashboard/events',
    actions: [
      { id: 1, label: language.value === 'de' ? 'Teilnehmen' : 'Attend', primary: true },
      { id: 2, label: language.value === 'de' ? 'Absagen' : 'Decline', primary: false }
    ]
  },
  {
    id: 5,
    type: 'system',
    title: language.value === 'de' ? 'Systemwartung geplant' : 'System maintenance scheduled',
    message: language.value === 'de' ? 'Geplante Wartung am 25. März von 02:00 - 04:00 Uhr.' : 'Scheduled maintenance on March 25 from 02:00 - 04:00.',
    sender: 'System Administrator',
    category: language.value === 'de' ? 'System' : 'System',
    timestamp: language.value === 'de' ? 'vor 3 Tagen' : '3 days ago',
    read: true
  },
  {
    id: 6,
    type: 'achievement',
    title: language.value === 'de' ? 'Auszeichnung erhalten' : 'Achievement unlocked',
    message: language.value === 'de' ? 'Herzlichen Glückwunsch! Sie haben die Auszeichnung "Fleißiger Schüler" erhalten.' : 'Congratulations! You have earned the "Diligent Student" achievement.',
    sender: 'WinSchool System',
    category: language.value === 'de' ? 'Auszeichnungen' : 'Achievements',
    timestamp: language.value === 'de' ? 'vor 1 Woche' : '1 week ago',
    read: false
  }
])

const filteredNotifications = computed(() => {
  let filtered = notifications.value

  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(n => !n.read)
  } else if (activeFilter.value !== 'all') {
    filtered = filtered.filter(n => n.type === activeFilter.value)
  }

  return filtered
})

const getNotificationIcon = (type: string) => {
  const icons: Record<string, any> = {
    academic: GraduationCap,
    message: MessageSquare,
    grade: Award,
    event: Calendar,
    system: Settings,
    achievement: Trophy,
    warning: AlertTriangle
  }
  return icons[type] || Bell
}

const getNotificationStyle = (type: string) => {
  const styles: Record<string, string> = {
    academic: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    message: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    grade: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
    event: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
    system: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    achievement: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400',
    warning: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
  }
  return styles[type] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
}

const markAsRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const deleteNotification = (id: number) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

const handleNotificationAction = (notification: any) => {
  // Handle navigation to action URL
  console.log('Navigating to:', notification.actionUrl)
  markAsRead(notification.id)
}

const handleAction = (action: any, notification: any) => {
  console.log('Handling action:', action.label, 'for notification:', notification.id)
  markAsRead(notification.id)
}

const loadMoreNotifications = () => {
  // Simulate loading more notifications
  hasMoreNotifications.value = false
}
</script> 