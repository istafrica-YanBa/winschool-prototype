<template>
  <div class="xschool-features bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'XSchool-Spezifische Funktionen' : 'XSchool-Specific Features' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Spezielle Funktionen für die XSchool-Plattform' : 'Special features for the XSchool platform' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <router-link
          to="/dashboard/support"
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <LifeBuoy class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Support' : 'Support' }}
        </router-link>
        <button @click="showFeatureModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Neue Funktion' : 'New Feature' }}
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Feature Categories -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="category in featureCategories" :key="category.id" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center mb-4">
            <div :class="category.iconBg" class="p-3 rounded-lg">
              <component :is="category.icon" class="h-6 w-6 text-white" />
            </div>
            <h2 class="ml-4 text-lg font-semibold text-gray-900 dark:text-slate-50">{{ category.title }}</h2>
          </div>
          <p class="text-gray-600 dark:text-slate-400 mb-4">{{ category.description }}</p>
          <div class="space-y-2">
            <div v-for="feature in category.features" :key="feature.id" class="flex items-center text-sm">
              <component :is="feature.enabled ? CheckCircle : Circle" :class="feature.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-slate-500'" class="h-4 w-4 mr-2" />
              <span :class="feature.enabled ? 'text-gray-900 dark:text-slate-50' : 'text-gray-500 dark:text-slate-400'">{{ feature.name }}</span>
            </div>
          </div>
          <button @click="configureCategory(category)" class="w-full mt-4 btn-secondary text-sm">
            {{ language === 'de' ? 'Konfigurieren' : 'Configure' }}
          </button>
        </div>
      </div>

      <!-- Online Application System -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50">
            {{ language === 'de' ? 'Online-Bewerbungssystem' : 'Online Application System' }}
          </h2>
          <div class="flex space-x-2">
            <select v-model="selectedApplicationStatus" class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50">
              <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
              <option value="New">{{ language === 'de' ? 'Neu' : 'New' }}</option>
              <option value="In Review">{{ language === 'de' ? 'In Prüfung' : 'In Review' }}</option>
              <option value="Approved">{{ language === 'de' ? 'Genehmigt' : 'Approved' }}</option>
              <option value="Rejected">{{ language === 'de' ? 'Abgelehnt' : 'Rejected' }}</option>
            </select>
            <button @click="configureApplicationSystem" class="btn-secondary text-sm">
              {{ language === 'de' ? 'Konfigurieren' : 'Configure' }}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-700">
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Bewerber' : 'Applicant' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Programm' : 'Program' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Eingereicht am' : 'Submitted On' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Status' : 'Status' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="application in filteredApplications" :key="application.id" class="border-b border-gray-100 dark:border-slate-700">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img :src="application.avatar" :alt="application.name" class="h-8 w-8 rounded-full object-cover mr-3" />
                    <div>
                      <p class="font-medium text-gray-900 dark:text-slate-50">{{ application.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-slate-400">{{ application.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-900 dark:text-slate-50">{{ application.program }}</td>
                <td class="py-3 px-4 text-gray-600 dark:text-slate-400">{{ application.submittedDate }}</td>
                <td class="py-3 px-4">
                  <span :class="getApplicationStatusColor(application.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ application.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="viewApplication(application)" class="text-primary-600 hover:text-primary-800">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="updateApplicationStatus(application)" class="text-secondary-600 hover:text-secondary-800">
                      <Edit class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Digital Class Register -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Digitales Klassenbuch' : 'Digital Class Register' }}
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Class Selection -->
          <div class="lg:col-span-1">
            <h3 class="font-medium text-gray-900 dark:text-slate-50 mb-4">
              {{ language === 'de' ? 'Klassen' : 'Classes' }}
            </h3>
            <div class="space-y-3">
              <div v-for="class_ in classes" :key="class_.id" 
                   @click="selectClass(class_)"
                   :class="[
                     'p-3 rounded-lg cursor-pointer transition-colors',
                     selectedClass?.id === class_.id 
                       ? 'bg-primary-100 dark:bg-primary-900/30 border-l-4 border-primary-600' 
                       : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600'
                   ]">
                <div class="flex justify-between items-center">
                  <h4 class="font-medium text-gray-900 dark:text-slate-50">{{ class_.name }}</h4>
                  <span class="text-sm text-gray-500 dark:text-slate-400">{{ class_.students }} {{ language === 'de' ? 'Schüler' : 'students' }}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-slate-400">{{ class_.teacher }}</p>
              </div>
            </div>
          </div>

          <!-- Class Register -->
          <div class="lg:col-span-2">
            <div v-if="selectedClass" class="space-y-4">
              <div class="flex justify-between items-center">
                <h3 class="font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Klassenbuch für' : 'Class Register for' }} {{ selectedClass.name }}
                </h3>
                <div class="flex space-x-2">
                  <input type="date" v-model="selectedDate" class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50" />
                  <button @click="saveRegister" class="btn-primary text-sm">
                    {{ language === 'de' ? 'Speichern' : 'Save' }}
                  </button>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Unterrichtsthema' : 'Lesson Topic' }}
                    </label>
                    <input v-model="registerData.topic" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      {{ language === 'de' ? 'Unterrichtsstunde' : 'Period' }}
                    </label>
                    <select v-model="registerData.period" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {{ language === 'de' ? 'Notizen' : 'Notes' }}
                  </label>
                  <textarea v-model="registerData.notes" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50"></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}
                  </label>
                  <div class="overflow-x-auto">
                    <table class="w-full">
                      <thead>
                        <tr class="border-b border-gray-200 dark:border-slate-600">
                          <th class="text-left py-2 px-3 font-medium text-gray-900 dark:text-slate-50">
                            {{ language === 'de' ? 'Schüler' : 'Student' }}
                          </th>
                          <th class="text-center py-2 px-3 font-medium text-gray-900 dark:text-slate-50">
                            {{ language === 'de' ? 'Anwesend' : 'Present' }}
                          </th>
                          <th class="text-center py-2 px-3 font-medium text-gray-900 dark:text-slate-50">
                            {{ language === 'de' ? 'Verspätet' : 'Late' }}
                          </th>
                          <th class="text-center py-2 px-3 font-medium text-gray-900 dark:text-slate-50">
                            {{ language === 'de' ? 'Abwesend' : 'Absent' }}
                          </th>
                          <th class="text-left py-2 px-3 font-medium text-gray-900 dark:text-slate-50">
                            {{ language === 'de' ? 'Notiz' : 'Note' }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="student in selectedClass.studentList" :key="student.id" class="border-b border-gray-100 dark:border-slate-700">
                          <td class="py-2 px-3 text-gray-900 dark:text-slate-50">{{ student.name }}</td>
                          <td class="py-2 px-3 text-center">
                            <input type="radio" :name="`attendance-${student.id}`" value="present" v-model="student.attendance" />
                          </td>
                          <td class="py-2 px-3 text-center">
                            <input type="radio" :name="`attendance-${student.id}`" value="late" v-model="student.attendance" />
                          </td>
                          <td class="py-2 px-3 text-center">
                            <input type="radio" :name="`attendance-${student.id}`" value="absent" v-model="student.attendance" />
                          </td>
                          <td class="py-2 px-3">
                            <input type="text" v-model="student.note" class="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex items-center justify-center h-64 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <p class="text-gray-500 dark:text-slate-400">
                {{ language === 'de' ? 'Bitte wählen Sie eine Klasse aus' : 'Please select a class' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Two-Factor Authentication -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Zwei-Faktor-Authentifizierung (2FA)' : 'Two-Factor Authentication (2FA)' }}
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 2FA Status -->
          <div class="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-medium text-gray-900 dark:text-slate-50">
                {{ language === 'de' ? '2FA-Status' : '2FA Status' }}
              </h3>
              <span :class="twoFactorEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ twoFactorEnabled 
                  ? (language === 'de' ? 'Aktiviert' : 'Enabled') 
                  : (language === 'de' ? 'Deaktiviert' : 'Disabled') }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-slate-400 mb-4">
              {{ language === 'de' 
                ? 'Zwei-Faktor-Authentifizierung erhöht die Sicherheit Ihres Kontos, indem sie einen zweiten Verifizierungsschritt erfordert.'
                : 'Two-factor authentication increases your account security by requiring a second verification step.' }}
            </p>
            <button @click="toggleTwoFactor" class="w-full btn-primary">
              {{ twoFactorEnabled 
                ? (language === 'de' ? 'Deaktivieren' : 'Disable') 
                : (language === 'de' ? 'Aktivieren' : 'Enable') }}
            </button>
          </div>

          <!-- 2FA Methods -->
          <div class="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <h3 class="font-medium text-gray-900 dark:text-slate-50 mb-4">
              {{ language === 'de' ? 'Verfügbare Methoden' : 'Available Methods' }}
            </h3>
            <div class="space-y-3">
              <div v-for="method in twoFactorMethods" :key="method.id" class="flex items-center justify-between">
                <div class="flex items-center">
                  <component :is="method.icon" class="h-5 w-5 mr-3" :class="method.enabled ? 'text-green-600' : 'text-gray-400'" />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-slate-50">{{ method.name }}</p>
                    <p class="text-xs text-gray-600 dark:text-slate-400">{{ method.description }}</p>
                  </div>
                </div>
                <button @click="configureTwoFactorMethod(method)" class="text-primary-600 hover:text-primary-800">
                  {{ method.enabled 
                    ? (language === 'de' ? 'Bearbeiten' : 'Edit') 
                    : (language === 'de' ? 'Einrichten' : 'Setup') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature Modal -->
    <div v-if="showFeatureModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neue Funktion aktivieren' : 'Enable New Feature' }}
            </h3>
            <button @click="showFeatureModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="enableFeature" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Funktionskategorie' : 'Feature Category' }}
              </label>
              <select v-model="featureForm.categoryId" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                <option value="">{{ language === 'de' ? 'Kategorie wählen' : 'Select Category' }}</option>
                <option v-for="category in featureCategories" :key="category.id" :value="category.id">{{ category.title }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Funktion' : 'Feature' }}
              </label>
              <select v-model="featureForm.featureId" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                <option value="">{{ language === 'de' ? 'Funktion wählen' : 'Select Feature' }}</option>
                <option v-for="feature in availableFeatures" :key="feature.id" :value="feature.id">{{ feature.name }}</option>
              </select>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showFeatureModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Aktivieren' : 'Enable' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  Plus, Eye, Edit, X, CheckCircle, Circle, 
  FileText, Users, Shield, Smartphone, Key, Mail, MessageSquare, LifeBuoy
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showFeatureModal = ref(false)
const selectedApplicationStatus = ref('')
const selectedClass = ref<any>(null)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const twoFactorEnabled = ref(true)

const registerData = ref({
  topic: '',
  period: '1',
  notes: ''
})

const featureForm = ref({
  categoryId: '',
  featureId: ''
})

const featureCategories = ref([
  {
    id: 1,
    title: language.value === 'de' ? 'Online-Bewerbungssystem' : 'Online Application System',
    description: language.value === 'de' ? 'Digitale Bewerbung und Aufnahmeprozess' : 'Digital application and admission process',
    icon: FileText,
    iconBg: 'bg-primary-600',
    features: [
      { id: 101, name: language.value === 'de' ? 'Online-Formulare' : 'Online Forms', enabled: true },
      { id: 102, name: language.value === 'de' ? 'Dokumenten-Upload' : 'Document Upload', enabled: true },
      { id: 103, name: language.value === 'de' ? 'Bewerbungsverfolgung' : 'Application Tracking', enabled: true },
      { id: 104, name: language.value === 'de' ? 'Automatische Benachrichtigungen' : 'Automated Notifications', enabled: false }
    ]
  },
  {
    id: 2,
    title: language.value === 'de' ? 'Digitales Klassenbuch' : 'Digital Class Register',
    description: language.value === 'de' ? 'Elektronische Anwesenheits- und Unterrichtsaufzeichnung' : 'Electronic attendance and lesson recording',
    icon: Users,
    iconBg: 'bg-green-600',
    features: [
      { id: 201, name: language.value === 'de' ? 'Anwesenheitsverfolgung' : 'Attendance Tracking', enabled: true },
      { id: 202, name: language.value === 'de' ? 'Unterrichtsthemen' : 'Lesson Topics', enabled: true },
      { id: 203, name: language.value === 'de' ? 'Verhaltensnotizen' : 'Behavior Notes', enabled: false },
      { id: 204, name: language.value === 'de' ? 'Elternbenachrichtigungen' : 'Parent Notifications', enabled: false }
    ]
  },
  {
    id: 3,
    title: language.value === 'de' ? 'Zwei-Faktor-Authentifizierung' : 'Two-Factor Authentication',
    description: language.value === 'de' ? 'Erhöhte Sicherheit durch zusätzliche Verifizierung' : 'Enhanced security with additional verification',
    icon: Shield,
    iconBg: 'bg-blue-600',
    features: [
      { id: 301, name: language.value === 'de' ? 'App-basierte 2FA' : 'App-based 2FA', enabled: true },
      { id: 302, name: language.value === 'de' ? 'SMS-Verifizierung' : 'SMS Verification', enabled: true },
      { id: 303, name: language.value === 'de' ? 'E-Mail-Verifizierung' : 'Email Verification', enabled: true },
      { id: 304, name: language.value === 'de' ? 'Hardware-Token' : 'Hardware Tokens', enabled: false }
    ]
  }
])

const availableFeatures = computed(() => {
  if (!featureForm.value.categoryId) return []
  
  const category = featureCategories.value.find(c => c.id.toString() === featureForm.value.categoryId)
  if (!category) return []
  
  return category.features.filter(f => !f.enabled)
})

const applications = ref([
  {
    id: 1,
    name: 'Max Mustermann',
    email: 'max.mustermann@example.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    program: 'Grade 10 Admission',
    submittedDate: '2024-03-10',
    status: 'New'
  },
  {
    id: 2,
    name: 'Anna Schmidt',
    email: 'anna.schmidt@example.com',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    program: 'Grade 9 Admission',
    submittedDate: '2024-03-08',
    status: 'In Review'
  },
  {
    id: 3,
    name: 'Thomas Weber',
    email: 'thomas.weber@example.com',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    program: 'Grade 11 Admission',
    submittedDate: '2024-03-05',
    status: 'Approved'
  },
  {
    id: 4,
    name: 'Lisa Fischer',
    email: 'lisa.fischer@example.com',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    program: 'Grade 8 Admission',
    submittedDate: '2024-03-01',
    status: 'Rejected'
  }
])

const filteredApplications = computed(() => {
  if (!selectedApplicationStatus.value) return applications.value
  return applications.value.filter(app => app.status === selectedApplicationStatus.value)
})

const classes = ref([
  {
    id: 1,
    name: 'Class 10A',
    teacher: 'Dr. Thomas Weber',
    students: 28,
    studentList: [
      { id: 1, name: 'Emma Müller', attendance: 'present', note: '' },
      { id: 2, name: 'Liam Weber', attendance: 'present', note: '' },
      { id: 3, name: 'Sophie Schmidt', attendance: 'present', note: '' }
    ]
  },
  {
    id: 2,
    name: 'Class 9B',
    teacher: 'Ms. Sarah Schmidt',
    students: 25,
    studentList: [
      { id: 4, name: 'Noah Fischer', attendance: 'present', note: '' },
      { id: 5, name: 'Mia Wagner', attendance: 'present', note: '' },
      { id: 6, name: 'Leon Bauer', attendance: 'present', note: '' }
    ]
  },
  {
    id: 3,
    name: 'Class 11A',
    teacher: 'Prof. Michael Mueller',
    students: 22,
    studentList: [
      { id: 7, name: 'Felix Hoffmann', attendance: 'present', note: '' },
      { id: 8, name: 'Charlotte Schulz', attendance: 'present', note: '' },
      { id: 9, name: 'Paul Zimmermann', attendance: 'present', note: '' }
    ]
  }
])

const twoFactorMethods = ref([
  {
    id: 1,
    name: language.value === 'de' ? 'Authenticator-App' : 'Authenticator App',
    description: language.value === 'de' ? 'Google Authenticator, Microsoft Authenticator, etc.' : 'Google Authenticator, Microsoft Authenticator, etc.',
    icon: Smartphone,
    enabled: true
  },
  {
    id: 2,
    name: 'SMS',
    description: language.value === 'de' ? 'Verifizierungscode per SMS' : 'Verification code via SMS',
    icon: MessageSquare,
    enabled: false
  },
  {
    id: 3,
    name: 'Email',
    description: language.value === 'de' ? 'Verifizierungscode per E-Mail' : 'Verification code via email',
    icon: Mail,
    enabled: true
  },
  {
    id: 4,
    name: language.value === 'de' ? 'Sicherheitsschlüssel' : 'Security Key',
    description: language.value === 'de' ? 'YubiKey oder anderer FIDO2-Schlüssel' : 'YubiKey or other FIDO2 key',
    icon: Key,
    enabled: false
  }
])

const configureCategory = (category: any) => {
  alert(`${language.value === 'de' ? 'Kategorie konfigurieren' : 'Configure category'}: ${category.title}`)
}

const configureApplicationSystem = () => {
  alert(language.value === 'de' ? 'Bewerbungssystem konfigurieren' : 'Configure application system')
}

const viewApplication = (application: any) => {
  alert(`${language.value === 'de' ? 'Bewerbung anzeigen' : 'View application'}: ${application.name}`)
}

const updateApplicationStatus = (application: any) => {
  alert(`${language.value === 'de' ? 'Bewerbungsstatus aktualisieren' : 'Update application status'}: ${application.name}`)
}

const selectClass = (class_: any) => {
  selectedClass.value = class_
}

const saveRegister = () => {
  alert(language.value === 'de' ? 'Klassenbuch gespeichert!' : 'Class register saved!')
}

const toggleTwoFactor = () => {
  twoFactorEnabled.value = !twoFactorEnabled.value
  alert(twoFactorEnabled.value 
    ? (language.value === 'de' ? '2FA aktiviert!' : '2FA enabled!') 
    : (language.value === 'de' ? '2FA deaktiviert!' : '2FA disabled!'))
}

const configureTwoFactorMethod = (method: any) => {
  alert(`${language.value === 'de' ? '2FA-Methode konfigurieren' : 'Configure 2FA method'}: ${method.name}`)
}

const enableFeature = () => {
  if (!featureForm.value.categoryId || !featureForm.value.featureId) return
  
  const categoryIndex = featureCategories.value.findIndex(c => c.id.toString() === featureForm.value.categoryId)
  if (categoryIndex === -1) return
  
  const featureIndex = featureCategories.value[categoryIndex].features.findIndex(f => f.id.toString() === featureForm.value.featureId)
  if (featureIndex === -1) return
  
  featureCategories.value[categoryIndex].features[featureIndex].enabled = true
  
  showFeatureModal.value = false
  featureForm.value = { categoryId: '', featureId: '' }
  
  alert(language.value === 'de' ? 'Funktion aktiviert!' : 'Feature enabled!')
}

const getApplicationStatusColor = (status: string) => {
  switch (status) {
    case 'New':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'In Review':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>
