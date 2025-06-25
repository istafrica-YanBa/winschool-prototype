<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Lehrerlaufbahn' : 'Teacher Career Profiles' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ language === 'de' ? 'Verwalten Sie Lehrerqualifikationen und Karriereverläufe' : 'Manage teacher qualifications and career progression' }}
        </p>
      </div>
      <button @click="showCareerModal = true" class="btn-primary flex items-center">
        <Plus class="h-4 w-4 mr-2" />
        {{ language === 'de' ? 'Eintrag hinzufügen' : 'Add Entry' }}
      </button>
    </div>

    <!-- Teacher Selection -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Lehrer auswählen' : 'Select Teacher' }}
          </label>
          <select 
            v-model="selectedTeacherId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Alle Lehrer' : 'All Teachers' }}</option>
            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Abteilung' : 'Department' }}
          </label>
          <select 
            v-model="selectedDepartment"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Alle Abteilungen' : 'All Departments' }}</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ language === 'de' ? 'Status' : 'Status' }}
          </label>
          <select 
            v-model="selectedStatus"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="Active">{{ language === 'de' ? 'Aktiv' : 'Active' }}</option>
            <option value="On Leave">{{ language === 'de' ? 'Beurlaubt' : 'On Leave' }}</option>
            <option value="Retired">{{ language === 'de' ? 'Pensioniert' : 'Retired' }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Teacher Career Profiles -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div v-for="teacher in filteredTeachers" :key="teacher.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center mb-6">
          <img :src="teacher.avatar" :alt="teacher.name" class="h-16 w-16 rounded-full object-cover mr-4" />
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ teacher.name }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ teacher.department }}</p>
            <span :class="getStatusColor(teacher.status)" class="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1">
              {{ teacher.status }}
            </span>
          </div>
          <button @click="viewFullProfile(teacher)" class="btn-secondary text-sm">
            {{ language === 'de' ? 'Vollständiges Profil' : 'Full Profile' }}
          </button>
        </div>

        <!-- Career Timeline -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Karriereverlauf' : 'Career Timeline' }}
          </h4>
          <div class="space-y-3">
            <div v-for="entry in teacher.careerEntries.slice(0, 3)" :key="entry.id" class="flex items-start">
              <div class="flex-shrink-0 w-3 h-3 bg-primary-600 rounded-full mt-2 mr-3"></div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ entry.title }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ entry.description }}</p>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-500">{{ entry.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ teacher.yearsOfService }}</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Dienstjahre' : 'Years of Service' }}</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ teacher.certifications.length }}</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Zertifikate' : 'Certifications' }}</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ teacher.subjects.length }}</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Fächer' : 'Subjects' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Career Entry Modal -->
    <div v-if="showCareerModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neuer Karriere-Eintrag' : 'New Career Entry' }}
            </h3>
            <button @click="showCareerModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="addCareerEntry" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
              </label>
              <select
                v-model="careerForm.teacherId"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Lehrer wählen' : 'Select Teacher' }}</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Ereignistyp' : 'Event Type' }}
              </label>
              <select
                v-model="careerForm.type"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Typ wählen' : 'Select Type' }}</option>
                <option value="Qualification">{{ language === 'de' ? 'Qualifikation' : 'Qualification' }}</option>
                <option value="Certification">{{ language === 'de' ? 'Zertifizierung' : 'Certification' }}</option>
                <option value="Promotion">{{ language === 'de' ? 'Beförderung' : 'Promotion' }}</option>
                <option value="Training">{{ language === 'de' ? 'Fortbildung' : 'Training' }}</option>
                <option value="Award">{{ language === 'de' ? 'Auszeichnung' : 'Award' }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Titel' : 'Title' }}
              </label>
              <input
                v-model="careerForm.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea
                v-model="careerForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Datum' : 'Date' }}
              </label>
              <input
                v-model="careerForm.date"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showCareerModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Eintrag hinzufügen' : 'Add Entry' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Full Profile Modal -->
    <div v-if="showProfileModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Vollständiges Lehrerprofil' : 'Complete Teacher Profile' }}
            </h3>
            <button @click="showProfileModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div v-if="selectedTeacher" class="space-y-6">
            <!-- Teacher Header -->
            <div class="flex items-center space-x-6">
              <img :src="selectedTeacher.avatar" :alt="selectedTeacher.name" class="h-24 w-24 rounded-full object-cover" />
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedTeacher.name }}</h2>
                <p class="text-gray-600 dark:text-gray-400">{{ selectedTeacher.department }}</p>
                <div class="flex space-x-4 mt-2">
                  <span :class="getStatusColor(selectedTeacher.status)" class="px-3 py-1 text-sm font-medium rounded-full">
                    {{ selectedTeacher.status }}
                  </span>
                  <span class="px-3 py-1 text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                    {{ selectedTeacher.yearsOfService }} {{ language === 'de' ? 'Jahre Dienst' : 'Years of Service' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Tabs -->
            <div class="border-b border-gray-200 dark:border-gray-700">
              <nav class="-mb-px flex space-x-8">
                <button
                  v-for="tab in profileTabs"
                  :key="tab"
                  @click="activeTab = tab"
                  :class="[
                    'py-2 px-1 border-b-2 font-medium text-sm',
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  {{ tab }}
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div class="mt-6">
              <!-- Career Timeline Tab -->
              <div v-if="activeTab === (language === 'de' ? 'Karriereverlauf' : 'Career Timeline')">
                <div class="space-y-4">
                  <div v-for="entry in selectedTeacher.careerEntries" :key="entry.id" class="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="flex-shrink-0 w-4 h-4 bg-primary-600 rounded-full mt-1 mr-4"></div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <h4 class="font-medium text-gray-900 dark:text-white">{{ entry.title }}</h4>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ entry.description }}</p>
                          <span :class="getEntryTypeColor(entry.type)" class="inline-block px-2 py-1 text-xs font-medium rounded-full mt-2">
                            {{ entry.type }}
                          </span>
                        </div>
                        <span class="text-sm text-gray-500 dark:text-gray-500">{{ entry.date }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Certifications Tab -->
              <div v-if="activeTab === (language === 'de' ? 'Zertifikate' : 'Certifications')">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="cert in selectedTeacher.certifications" :key="cert.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ cert.name }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ cert.issuer }}</p>
                    <div class="flex justify-between items-center mt-2">
                      <span class="text-xs text-gray-500 dark:text-gray-500">{{ cert.date }}</span>
                      <span :class="cert.valid ? 'text-green-600' : 'text-red-600'" class="text-xs font-medium">
                        {{ cert.valid ? (language === 'de' ? 'Gültig' : 'Valid') : (language === 'de' ? 'Abgelaufen' : 'Expired') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Subjects Tab -->
              <div v-if="activeTab === (language === 'de' ? 'Fächer' : 'Subjects')">
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div v-for="subject in selectedTeacher.subjects" :key="subject" class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-center">
                    <span class="font-medium text-primary-800 dark:text-primary-200">{{ subject }}</span>
                  </div>
                </div>
              </div>
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
import { Plus, X } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showCareerModal = ref(false)
const showProfileModal = ref(false)
const selectedTeacherId = ref('')
const selectedDepartment = ref('')
const selectedStatus = ref('')
const selectedTeacher = ref<any>(null)
const activeTab = ref(language.value === 'de' ? 'Karriereverlauf' : 'Career Timeline')

const profileTabs = computed(() => [
  language.value === 'de' ? 'Karriereverlauf' : 'Career Timeline',
  language.value === 'de' ? 'Zertifikate' : 'Certifications',
  language.value === 'de' ? 'Fächer' : 'Subjects'
])

const careerForm = ref({
  teacherId: '',
  type: '',
  title: '',
  description: '',
  date: ''
})

const departments = ['Mathematics', 'Sciences', 'Languages', 'Arts', 'Sports']

const teachers = ref([
  {
    id: 1,
    name: 'Dr. Thomas Weber',
    department: 'Mathematics',
    status: 'Active',
    yearsOfService: 15,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subjects: ['Mathematics', 'Physics', 'Statistics'],
    certifications: [
      { id: 1, name: 'Advanced Mathematics Teaching', issuer: 'University of Berlin', date: '2020-06-15', valid: true },
      { id: 2, name: 'Digital Learning Methods', issuer: 'Education Institute', date: '2022-03-10', valid: true },
      { id: 3, name: 'First Aid Certification', issuer: 'Red Cross', date: '2019-09-20', valid: false }
    ],
    careerEntries: [
      { id: 1, type: 'Promotion', title: 'Department Head Mathematics', description: 'Promoted to lead the mathematics department', date: '2023-09-01' },
      { id: 2, type: 'Certification', title: 'Digital Learning Certificate', description: 'Completed advanced training in digital teaching methods', date: '2022-03-10' },
      { id: 3, type: 'Award', title: 'Teacher of the Year', description: 'Recognized for outstanding teaching performance', date: '2021-06-15' },
      { id: 4, type: 'Qualification', title: 'PhD in Mathematics', description: 'Completed doctoral studies in Applied Mathematics', date: '2015-12-20' },
      { id: 5, type: 'Training', title: 'Classroom Management Workshop', description: 'Attended intensive training on modern classroom techniques', date: '2020-08-05' }
    ]
  },
  {
    id: 2,
    name: 'Ms. Sarah Schmidt',
    department: 'Languages',
    status: 'Active',
    yearsOfService: 8,
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subjects: ['German', 'English', 'Literature'],
    certifications: [
      { id: 1, name: 'TESOL Certification', issuer: 'Cambridge University', date: '2021-05-20', valid: true },
      { id: 2, name: 'German Literature Specialist', issuer: 'Goethe Institute', date: '2019-11-15', valid: true }
    ],
    careerEntries: [
      { id: 1, type: 'Certification', title: 'TESOL Certification', description: 'Qualified to teach English as a second language', date: '2021-05-20' },
      { id: 2, type: 'Training', title: 'Creative Writing Workshop', description: 'Enhanced skills in teaching creative writing', date: '2020-02-14' },
      { id: 3, type: 'Qualification', title: 'Master in German Literature', description: 'Completed graduate studies in German Literature', date: '2016-07-30' }
    ]
  },
  {
    id: 3,
    name: 'Prof. Michael Mueller',
    department: 'Sciences',
    status: 'On Leave',
    yearsOfService: 22,
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subjects: ['Physics', 'Chemistry', 'Environmental Science'],
    certifications: [
      { id: 1, name: 'Laboratory Safety Certification', issuer: 'Safety Institute', date: '2023-01-10', valid: true },
      { id: 2, name: 'Advanced Physics Teaching', issuer: 'Physics Society', date: '2018-04-25', valid: true }
    ],
    careerEntries: [
      { id: 1, type: 'Training', title: 'Laboratory Safety Update', description: 'Renewed certification for laboratory safety protocols', date: '2023-01-10' },
      { id: 2, type: 'Award', title: 'Science Education Excellence', description: 'Awarded for innovative science teaching methods', date: '2019-10-12' },
      { id: 3, type: 'Promotion', title: 'Senior Science Teacher', description: 'Promoted to senior position in science department', date: '2018-09-01' }
    ]
  }
])

const filteredTeachers = computed(() => {
  let filtered = teachers.value

  if (selectedTeacherId.value) {
    filtered = filtered.filter(teacher => teacher.id.toString() === selectedTeacherId.value)
  }

  if (selectedDepartment.value) {
    filtered = filtered.filter(teacher => teacher.department === selectedDepartment.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(teacher => teacher.status === selectedStatus.value)
  }

  return filtered
})

const addCareerEntry = () => {
  const teacher = teachers.value.find(t => t.id.toString() === careerForm.value.teacherId)
  if (teacher) {
    teacher.careerEntries.unshift({
      id: teacher.careerEntries.length + 1,
      type: careerForm.value.type,
      title: careerForm.value.title,
      description: careerForm.value.description,
      date: careerForm.value.date
    })
  }

  showCareerModal.value = false
  careerForm.value = {
    teacherId: '',
    type: '',
    title: '',
    description: '',
    date: ''
  }
}

const viewFullProfile = (teacher: any) => {
  selectedTeacher.value = teacher
  showProfileModal.value = true
  activeTab.value = language.value === 'de' ? 'Karriereverlauf' : 'Career Timeline'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'On Leave':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Retired':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getEntryTypeColor = (type: string) => {
  switch (type) {
    case 'Promotion':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Certification':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Award':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Training':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'Qualification':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>
