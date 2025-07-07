<template>
  <div class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary dark:bg-gradient-to-r dark:from-indigo-700 dark:to-blue-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <MessageSquare class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800 dark:text-white" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Nachrichten' : 'Messages' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Ihre Nachrichten und Kommunikation' : 'Manage your messages and communication' }}
            </p>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark dark:bg-gradient-to-r dark:from-indigo-700 dark:to-blue-600 dark:hover:from-indigo-800 dark:hover:to-blue-700 text-slate-800 dark:text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Neue Nachricht' : 'New Message' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Message List -->
        <div class="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="language === 'de' ? 'Nachrichten durchsuchen...' : 'Search messages...'"
                class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          
          <div class="max-h-96 overflow-y-auto">
            <div
              v-for="message in filteredMessages"
              :key="message.id"
              @click="selectedMessage = message as Message"
              :class="[
                'p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                selectedMessage?.id === message.id ? 'bg-primary-50 dark:bg-indigo-900/20 border-l-4 border-l-primary-500 dark:border-l-indigo-500' : ''
              ]"
            >
              <div class="flex items-start space-x-3">
                <img
                  :src="message.avatar"
                  :alt="message.from"
                  class="h-10 w-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ message.from }}</p>   
                    <span class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">{{ message.time }}</span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300 truncate font-medium">{{ message.subject }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{{ message.preview }}</p>      
                </div>
                <div v-if="!message.read" class="w-2 h-2 bg-primary-600 dark:bg-indigo-600 rounded-full flex-shrink-0"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Content -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div v-if="selectedMessage" class="h-full flex flex-col">
            <!-- Message Header -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-t-xl">
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-3">
                  <img
                    :src="selectedMessage.avatar"
                    :alt="selectedMessage.from"
                    class="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                  />
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedMessage.subject }}</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      {{ language === 'de' ? 'Von' : 'From' }}: {{ selectedMessage.from }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ selectedMessage.timestamp }}</p>        
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Reply class="h-4 w-4" />
                  </button>
                  <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Forward class="h-4 w-4" />
                  </button>
                  <button class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Message Body -->
            <div class="flex-1 p-6 overflow-y-auto">
              <div class="prose dark:prose-invert max-w-none">
                <p class="text-gray-900 dark:text-gray-100 leading-relaxed">{{ selectedMessage.content }}</p>
              </div>

              <!-- Attachments -->
              <div v-if="selectedMessage.attachments?.length" class="mt-6">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  {{ language === 'de' ? 'Anhänge' : 'Attachments' }}
                </h3>
                <div class="space-y-2">
                  <div
                    v-for="attachment in selectedMessage.attachments"
                    :key="attachment.name"
                    class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <Paperclip class="h-4 w-4 text-gray-400 dark:text-gray-500 mr-3" />
                    <span class="text-sm text-gray-900 dark:text-white font-medium">{{ attachment.name }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">({{ attachment.size }})</span>     
                  </div>
                </div>
              </div>
            </div>

            <!-- Reply Section -->
            <div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
              <div class="flex space-x-3">
                <img
                  :src="currentUserAvatar"
                  alt="You"
                  class="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                />
                <div class="flex-1">
                  <textarea
                    v-model="replyText"
                    :placeholder="language === 'de' ? 'Antwort schreiben...' : 'Write a reply...'"
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    rows="3"
                  ></textarea>
                  <div class="flex justify-between items-center mt-3">
                    <div class="flex space-x-2">
                      <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                        <Paperclip class="h-4 w-4" />
                      </button>
                    </div>
                    <button class="bg-winschool-primary hover:bg-winschool-primary-dark dark:bg-gradient-to-r dark:from-indigo-700 dark:to-blue-600 dark:hover:from-indigo-800 dark:hover:to-blue-700 text-slate-800 dark:text-white font-medium px-4 py-2 rounded-lg transition-colors">
                      {{ language === 'de' ? 'Senden' : 'Send' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="h-full flex items-center justify-center p-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-winschool-primary dark:bg-gradient-to-r dark:from-indigo-700 dark:to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare class="h-8 w-8 text-slate-800 dark:text-white" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {{ language === 'de' ? 'Nachricht auswählen' : 'Select a message' }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ language === 'de' ? 'Wählen Sie eine Nachricht aus der Liste aus' : 'Choose a message from the list to view' }}
              </p>
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
import { useAuthStore } from '../stores/auth'
import { Plus, Search, Reply, Forward, Trash2, Paperclip, MessageSquare } from 'lucide-vue-next'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const language = computed(() => themeStore.language)

const searchQuery = ref('')
const selectedMessage = ref<Message | null>(null)
const replyText = ref('')

const currentUserAvatar = computed(() => authStore.user?.avatar)

interface Message {
  id: number
  from: string
  subject: string
  preview: string
  content: string
  time: string
  timestamp: string
  read: boolean
  avatar: string
  attachments?: { name: string; size: string }[]
}

const messages = [
  {
    id: 1,
    from: 'Dr. Thomas Weber',
    subject: 'Mathematics Assignment Feedback',
    preview: 'Great work on the calculus problems...',
    content: 'Dear Student,\n\nI wanted to provide feedback on your recent mathematics assignment. Your work on the calculus problems was excellent, showing a clear understanding of the concepts. However, I noticed some areas where you could improve...',
    time: '10:30 AM',
    timestamp: 'Today at 10:30 AM',
    read: false,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    attachments: [
      { name: 'assignment_feedback.pdf', size: '245 KB' }
    ]
  },
  {
    id: 2,
    from: 'Anna Schmidt (Parent)',
    subject: 'Parent-Teacher Conference',
    preview: 'I would like to schedule a meeting...',
    content: 'Hello,\n\nI hope this message finds you well. I would like to schedule a parent-teacher conference to discuss my child\'s progress in your class. Please let me know your available times.',
    time: 'Yesterday',
    timestamp: 'Yesterday at 2:15 PM',
    read: true,
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 3,
    from: 'School Administration',
    subject: 'Important: Schedule Changes',
    preview: 'Please note the following schedule changes...',
    content: 'Dear Students and Staff,\n\nPlease note the following schedule changes for next week due to the teacher development day:\n\n- Monday: Normal schedule\n- Tuesday: Late start at 10:00 AM\n- Wednesday: Early dismissal at 2:00 PM',
    time: '2 days ago',
    timestamp: 'March 10, 2024 at 9:00 AM',
    read: true,
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 4,
    from: 'Ms. Sarah Fischer',
    subject: 'Science Fair Participation',
    preview: 'Invitation to participate in the annual science fair...',
    content: 'Dear Students,\n\nI am excited to invite you to participate in our annual science fair. This is a great opportunity to showcase your scientific knowledge and creativity. The deadline for project submissions is April 15th.',
    time: '1 week ago',
    timestamp: 'March 5, 2024 at 11:30 AM',
    read: true,
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
]

const filteredMessages = computed(() => {
  if (!searchQuery.value) return messages
  
  return messages.filter(message => 
    message.from.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    message.preview.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>
