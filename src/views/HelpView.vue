<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 sm:mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <HelpCircle class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Hilfe & Support' : 'Help & Support' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Finden Sie Antworten und erhalten Sie Unterstützung' : 'Find answers and get support' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <MessageCircle class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Support kontaktieren' : 'Contact Support' }}
        </button>
      </div>
    </div>

    <!-- Quick Help Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="helpCard in quickHelpCards" :key="helpCard.title" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover cursor-pointer">
        <div class="flex items-center mb-4">
          <div :class="helpCard.iconBg" class="p-3 rounded-lg">
            <component :is="helpCard.icon" class="h-6 w-6 text-white" />
          </div>
          <h3 class="ml-4 text-lg font-semibold text-gray-900 dark:text-white">{{ helpCard.title }}</h3>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ helpCard.description }}</p>
        <div class="space-y-2">
          <div v-for="link in helpCard.links" :key="link" class="text-sm text-primary-600 hover:text-primary-800 cursor-pointer">
            • {{ link }}
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <HelpCircle class="h-5 w-5 mr-2 text-primary-600" />
        {{ language === 'de' ? 'Häufig gestellte Fragen' : 'Frequently Asked Questions' }}
      </h2>
      
      <div class="space-y-4">
        <div v-for="faq in faqs" :key="faq.id" class="border border-gray-200 dark:border-gray-700 rounded-lg">
          <button 
            @click="toggleFaq(faq.id)"
            class="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span class="font-medium text-gray-900 dark:text-white">{{ faq.question }}</span>
            <ChevronDown :class="['h-4 w-4 text-gray-400 transition-transform', { 'rotate-180': faq.isOpen }]" />
          </button>
          <div v-if="faq.isOpen" class="px-4 pb-4">
            <p class="text-gray-600 dark:text-gray-400">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Support -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <MessageCircle class="h-5 w-5 mr-2 text-secondary-600" />
        {{ language === 'de' ? 'Support kontaktieren' : 'Contact Support' }}
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Contact Form -->
        <div>
          <form @submit.prevent="submitSupportRequest" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Betreff' : 'Subject' }}
              </label>
              <input
                v-model="supportForm.subject"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :placeholder="language === 'de' ? 'Beschreiben Sie Ihr Problem kurz' : 'Briefly describe your issue'"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Kategorie' : 'Category' }}
              </label>
              <select 
                v-model="supportForm.category"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Kategorie wählen' : 'Select category' }}</option>
                <option value="technical">{{ language === 'de' ? 'Technisches Problem' : 'Technical Issue' }}</option>
                <option value="account">{{ language === 'de' ? 'Konto-Problem' : 'Account Issue' }}</option>
                <option value="billing">{{ language === 'de' ? 'Abrechnung' : 'Billing' }}</option>
                <option value="feature">{{ language === 'de' ? 'Feature-Anfrage' : 'Feature Request' }}</option>
                <option value="other">{{ language === 'de' ? 'Sonstiges' : 'Other' }}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Nachricht' : 'Message' }}
              </label>
              <textarea
                v-model="supportForm.message"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                :placeholder="language === 'de' ? 'Beschreiben Sie Ihr Problem detailliert...' : 'Describe your issue in detail...'"
              ></textarea>
            </div>
            
            <button type="submit" class="btn-primary w-full">
              {{ language === 'de' ? 'Anfrage senden' : 'Send Request' }}
            </button>
          </form>
        </div>
        
        <!-- Contact Information -->
        <div class="space-y-6">
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">
              {{ language === 'de' ? 'Support-Zeiten' : 'Support Hours' }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ language === 'de' ? 'Montag - Freitag: 8:00 - 18:00' : 'Monday - Friday: 8:00 AM - 6:00 PM' }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ language === 'de' ? 'Samstag: 9:00 - 14:00' : 'Saturday: 9:00 AM - 2:00 PM' }}
            </p>
          </div>
          
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">
              {{ language === 'de' ? 'Direkte Kontakte' : 'Direct Contacts' }}
            </h3>
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p> support@winschool.de</p>
              <p>📞 +49 30 1234 5678</p>
              <p>💬 Live Chat ({{ language === 'de' ? 'verfügbar' : 'available' }})</p>
            </div>
          </div>
          
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 class="font-medium text-blue-800 dark:text-blue-200 mb-2">
              {{ language === 'de' ? 'Notfall-Support' : 'Emergency Support' }}
            </h3>
            <p class="text-sm text-blue-600 dark:text-blue-300">
              {{ language === 'de' ? 'Für kritische Systemprobleme: +49 30 1234 9999' : 'For critical system issues: +49 30 1234 9999' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- User Guides -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <BookOpen class="h-5 w-5 mr-2 text-accent-600" />
        {{ language === 'de' ? 'Benutzerhandbücher' : 'User Guides' }}
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="guide in userGuides" :key="guide.title" class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
          <div class="flex items-center mb-2">
            <component :is="guide.icon" class="h-5 w-5 text-primary-600 mr-2" />
            <h3 class="font-medium text-gray-900 dark:text-white">{{ guide.title }}</h3>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ guide.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  HelpCircle, MessageCircle, BookOpen, ChevronDown, Users, GraduationCap, 
  DollarSign, Calendar, Settings, BarChart3
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const supportForm = ref({
  subject: '',
  category: '',
  message: ''
})

const quickHelpCards = [
  {
    title: language.value === 'de' ? 'Erste Schritte' : 'Getting Started',
    description: language.value === 'de' ? 'Lernen Sie die Grundlagen von WinSchool' : 'Learn the basics of WinSchool',
    icon: GraduationCap,
    iconBg: 'bg-primary-600',
    links: [
      language.value === 'de' ? 'Konto einrichten' : 'Setting up your account',
      language.value === 'de' ? 'Navigation verstehen' : 'Understanding navigation',
      language.value === 'de' ? 'Erste Anmeldung' : 'First login'
    ]
  },
  {
    title: language.value === 'de' ? 'Häufige Aufgaben' : 'Common Tasks',
    description: language.value === 'de' ? 'Anleitungen für alltägliche Aufgaben' : 'Guides for everyday tasks',
    icon: Settings,
    iconBg: 'bg-secondary-600',
    links: [
      language.value === 'de' ? 'Noten eingeben' : 'Entering grades',
      language.value === 'de' ? 'Nachrichten senden' : 'Sending messages',
      language.value === 'de' ? 'Berichte erstellen' : 'Creating reports'
    ]
  },
  {
    title: language.value === 'de' ? 'Fehlerbehebung' : 'Troubleshooting',
    description: language.value === 'de' ? 'Lösungen für häufige Probleme' : 'Solutions for common issues',
    icon: HelpCircle,
    iconBg: 'bg-accent-600',
    links: [
      language.value === 'de' ? 'Anmeldeprobleme' : 'Login issues',
      language.value === 'de' ? 'Langsame Leistung' : 'Slow performance',
      language.value === 'de' ? 'Fehler melden' : 'Reporting bugs'
    ]
  }
]

const faqs = ref([
  {
    id: 1,
    question: language.value === 'de' ? 'Wie kann ich mein Passwort zurücksetzen?' : 'How can I reset my password?',
    answer: language.value === 'de' ? 'Klicken Sie auf "Passwort vergessen" auf der Anmeldeseite und folgen Sie den Anweisungen in der E-Mail.' : 'Click "Forgot Password" on the login page and follow the instructions in the email.',
    isOpen: false
  },
  {
    id: 2,
    question: language.value === 'de' ? 'Wie füge ich einen neuen Schüler hinzu?' : 'How do I add a new student?',
    answer: language.value === 'de' ? 'Gehen Sie zu Schülerverwaltung > Schüler hinzufügen und füllen Sie das Formular aus. Das System erstellt automatisch ein Elternkonto.' : 'Go to Student Management > Add Student and fill out the form. The system will automatically create a parent account.',
    isOpen: false
  },
  {
    id: 3,
    question: language.value === 'de' ? 'Kann ich Berichte exportieren?' : 'Can I export reports?',
    answer: language.value === 'de' ? 'Ja, alle Berichte können als PDF oder Excel-Datei exportiert werden. Klicken Sie auf das Export-Symbol in der Berichtsansicht.' : 'Yes, all reports can be exported as PDF or Excel files. Click the export icon in the report view.',
    isOpen: false
  },
  {
    id: 4,
    question: language.value === 'de' ? 'Wie ändere ich die Sprache?' : 'How do I change the language?',
    answer: language.value === 'de' ? 'Gehen Sie zu Einstellungen > Darstellung und wählen Sie Ihre bevorzugte Sprache aus dem Dropdown-Menü.' : 'Go to Settings > Appearance and select your preferred language from the dropdown menu.',
    isOpen: false
  }
])

const userGuides = [
  {
    title: language.value === 'de' ? 'Schülerverwaltung' : 'Student Management',
    description: language.value === 'de' ? 'Schülerprofile verwalten' : 'Managing student profiles',
    icon: Users
  },
  {
    title: language.value === 'de' ? 'Notenverwaltung' : 'Grade Management',
    description: language.value === 'de' ? 'Noten eingeben und verwalten' : 'Entering and managing grades',
    icon: BarChart3
  },
  {
    title: language.value === 'de' ? 'Finanzverwaltung' : 'Financial Management',
    description: language.value === 'de' ? 'Gebühren und Zahlungen' : 'Fees and payments',
    icon: DollarSign
  },
  {
    title: language.value === 'de' ? 'Stundenplanung' : 'Timetable Planning',
    description: language.value === 'de' ? 'Stundenpläne erstellen' : 'Creating timetables',
    icon: Calendar
  }
]

const toggleFaq = (id: number) => {
  const faq = faqs.value.find(f => f.id === id)
  if (faq) {
    faq.isOpen = !faq.isOpen
  }
}

const submitSupportRequest = () => {
  // Mock submission
  alert(language.value === 'de' ? 'Support-Anfrage gesendet!' : 'Support request sent!')
  supportForm.value = { subject: '', category: '', message: '' }
}
</script>
