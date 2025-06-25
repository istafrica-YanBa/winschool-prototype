<template>
  <div class="student-profile bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <User class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Schülerprofil' : 'Student Profile' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ student?.name ? `${language === 'de' ? 'Profil von' : 'Profile of'} ${student.name}` : (language === 'de' ? 'Schülerdetails anzeigen und bearbeiten' : 'View and edit student details') }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="goBack" class="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-slate-800 dark:text-slate-50 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <ArrowLeft class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Zurück' : 'Back' }}
          </button>
        </div>
      </div>

      <!-- Student Profile Component -->
      <StudentProfile 
        v-if="student"
        :student="student"
        @add-language="showLanguageModal = true; languageModalMode = 'add'"
        @edit-language="editLanguage"
        @remove-language="removeLanguage"
        @add-career-entry="showCareerEntryModal = true; careerEntryModalMode = 'add'"
        @edit-career-entry="editCareerEntry"
        @remove-career-entry="removeCareerEntry"
        @add-correspondence-note="showCorrespondenceNoteModal = true; correspondenceNoteModalMode = 'add'"
        @edit-correspondence-note="editCorrespondenceNote"
        @remove-correspondence-note="removeCorrespondenceNote"
      />

      <!-- Loading State -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400">{{ language === 'de' ? 'Lade Schülerdaten...' : 'Loading student data...' }}</p>
      </div>
    </div>

    <!-- Language Assignment Modal -->
    <div v-if="showLanguageModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-4 sm:p-6">
          <div class="flex justify-between items-center mb-4 sm:mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ languageModalMode === 'add' ? (language === 'de' ? 'Sprache hinzufügen' : 'Add Language') : (language === 'de' ? 'Sprache bearbeiten' : 'Edit Language') }}
            </h3>
            <button @click="showLanguageModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>

          <LanguageAssignmentForm 
            :language="selectedLanguage"
            :mode="languageModalMode"
            @submit="handleLanguageSubmit"
            @cancel="showLanguageModal = false"
          />
        </div>
      </div>
    </div>

    <!-- School Career Entry Modal -->
    <div v-if="showCareerEntryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-4 sm:p-6">
          <div class="flex justify-between items-center mb-4 sm:mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ careerEntryModalMode === 'add' ? (language === 'de' ? 'Schullaufbahn hinzufügen' : 'Add School Career Entry') : (language === 'de' ? 'Schullaufbahn bearbeiten' : 'Edit School Career Entry') }}
            </h3>
            <button @click="showCareerEntryModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>

          <SchoolCareerEntry 
            :entry="selectedCareerEntry"
            :mode="careerEntryModalMode"
            @submit="handleCareerEntrySubmit"
            @cancel="showCareerEntryModal = false"
          />
        </div>
      </div>
    </div>

    <!-- Correspondence Note Modal -->
    <div v-if="showCorrespondenceNoteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-4 sm:p-6">
          <div class="flex justify-between items-center mb-4 sm:mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ correspondenceNoteModalMode === 'add' ? (language === 'de' ? 'Notiz hinzufügen' : 'Add Note') : (language === 'de' ? 'Notiz bearbeiten' : 'Edit Note') }}
            </h3>
            <button @click="showCorrespondenceNoteModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>

          <CorrespondenceNote 
            :note="selectedCorrespondenceNote"
            :mode="correspondenceNoteModalMode"
            @submit="handleCorrespondenceNoteSubmit"
            @cancel="showCorrespondenceNoteModal = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { ArrowLeft, X, User } from 'lucide-vue-next'
import StudentProfile from '../components/student/StudentProfile.vue'
import LanguageAssignmentForm from '../components/student/LanguageAssignmentForm.vue'
import SchoolCareerEntry from '../components/student/SchoolCareerEntry.vue'
import CorrespondenceNote from '../components/student/CorrespondenceNote.vue'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Student data
const student = ref<any>(null)

// Modal states
const showLanguageModal = ref(false)
const showCareerEntryModal = ref(false)
const showCorrespondenceNoteModal = ref(false)

// Modal modes
const languageModalMode = ref<'add' | 'edit'>('add')
const careerEntryModalMode = ref<'add' | 'edit'>('add')
const correspondenceNoteModalMode = ref<'add' | 'edit'>('add')

// Selected items
const selectedLanguage = ref<any>(null)
const selectedCareerEntry = ref<any>(null)
const selectedCorrespondenceNote = ref<any>(null)

// Enhanced mock data for better pagination demonstration
const generateMockData = (studentId: string) => {
  return {
    id: studentId,
    name: 'Emma Müller',
    studentId: 'ST001',
    class: 'Class 10A',
    status: 'active',
    age: 16,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    email: 'emma.mueller@student.winschool.de',
    phone: '+49 123 456 7890',
    address: 'Musterstraße 123, 10115 Berlin',
    enrollmentDate: '2020-09-01',
    gradeLevel: '10',
    homeroomTeacher: 'Dr. Thomas Weber',
    averageGrade: 'A-',
    attendance: 95,
    languages: [
      { id: 1, name: 'German', level: 'Native', type: 'Native', since: '2008-01-01', knowledgeLevel: 5 },
      { id: 2, name: 'English', level: 'B2', type: 'Required', since: '2015-09-01', knowledgeLevel: 4 },
      { id: 3, name: 'French', level: 'A2', type: 'Elective', since: '2018-09-01', knowledgeLevel: 2 },
      { id: 4, name: 'Spanish', level: 'A1', type: 'Elective', since: '2022-09-01', knowledgeLevel: 1 },
      { id: 5, name: 'Latin', level: 'B1', type: 'Required', since: '2019-09-01', knowledgeLevel: 3 },
      { id: 6, name: 'Italian', level: 'A2', type: 'Elective', since: '2023-09-01', knowledgeLevel: 2 }
    ],
    careerEntries: [
      { 
        id: 1, 
        title: 'Promotion to Grade 10', 
        type: 'Promotion', 
        date: '2023-07-15', 
        fromGrade: 'Grade 9', 
        toGrade: 'Grade 10', 
        description: 'Regular promotion at the end of the school year',
        reason: 'Successful completion of Grade 9',
        isVoluntary: false
      },
      { 
        id: 2, 
        title: 'Promotion to Grade 9', 
        type: 'Promotion', 
        date: '2022-07-15', 
        fromGrade: 'Grade 8', 
        toGrade: 'Grade 9', 
        description: 'Regular promotion at the end of the school year',
        reason: 'Successful completion of Grade 8',
        isVoluntary: false
      },
      { 
        id: 3, 
        title: 'Transfer from Another School', 
        type: 'Transfer', 
        date: '2020-09-01', 
        fromGrade: 'Grade 7', 
        toGrade: 'Grade 8', 
        description: 'Transfer from Grundschule Musterstadt',
        reason: 'Family relocation',
        isVoluntary: true
      },
      { 
        id: 4, 
        title: 'Class Change', 
        type: 'Class Change', 
        date: '2021-02-01', 
        fromGrade: 'Grade 8A', 
        toGrade: 'Grade 8B', 
        description: 'Changed to advanced mathematics class',
        reason: 'Academic performance improvement',
        isVoluntary: true
      },
      { 
        id: 5, 
        title: 'Promotion to Grade 8', 
        type: 'Promotion', 
        date: '2021-07-15', 
        fromGrade: 'Grade 7', 
        toGrade: 'Grade 8', 
        description: 'Regular promotion with honors',
        reason: 'Excellent academic performance',
        isVoluntary: false
      },
      { 
        id: 6, 
        title: 'Participation in Exchange Program', 
        type: 'Exchange', 
        date: '2023-01-15', 
        fromGrade: 'Grade 10A', 
        toGrade: 'Grade 10A', 
        description: 'Semester exchange to France',
        reason: 'Language immersion program',
        isVoluntary: true
      }
    ],
    correspondenceNotes: [
      {
        id: 1,
        date: '2024-03-15',
        template: 'Parent Conference',
        comment: 'Discussed academic progress and extracurricular activities',
        createdBy: 'Dr. Thomas Weber'
      },
      {
        id: 2,
        date: '2024-03-05',
        template: 'Performance Notification',
        comment: 'Excellent performance in mathematics noted',
        createdBy: 'System'
      },
      {
        id: 3,
        date: '2024-02-20',
        template: 'Absence Notice',
        comment: 'Medical absence for 3 days, doctor note provided',
        createdBy: 'Ms. Sarah Schmidt'
      },
      {
        id: 4,
        date: '2024-02-10',
        template: 'Achievement Recognition',
        comment: 'Won first place in school mathematics competition',
        createdBy: 'Dr. Thomas Weber'
      },
      {
        id: 5,
        date: '2024-01-25',
        template: 'Behavioral Note',
        comment: 'Positive behavior and leadership in group projects',
        createdBy: 'Ms. Johnson'
      },
      {
        id: 6,
        date: '2024-01-15',
        template: 'Parent Meeting',
        comment: 'Discussed university preparation and career goals',
        createdBy: 'Dr. Thomas Weber'
      }
    ]
  }
}

onMounted(async () => {
  // Simulate loading delay
  setTimeout(() => {
    const studentId = route.params.id as string
    student.value = generateMockData(studentId)
  }, 500)
})

function goBack() {
  router.back()
}

// Language management
function editLanguage(languageData: any) {
  selectedLanguage.value = languageData
  languageModalMode.value = 'edit'
  showLanguageModal.value = true
}

function removeLanguage(languageId: number) {
  if (student.value?.languages) {
    student.value.languages = student.value.languages.filter((lang: any) => lang.id !== languageId)
  }
}

function handleLanguageSubmit(languageData: any) {
  if (!student.value?.languages) return
  
  if (languageModalMode.value === 'edit') {
    const index = student.value.languages.findIndex((l: any) => l.id === languageData.id)
    if (index !== -1) {
      student.value.languages[index] = languageData
    }
  } else {
    // Add new language
    const newId = student.value.languages.length > 0 
      ? Math.max(...student.value.languages.map((l: any) => l.id)) + 1 
      : 1
    
    student.value.languages.push({
      ...languageData,
      id: newId
    })
  }
  
  showLanguageModal.value = false
  selectedLanguage.value = null
}

// Career entry management
function editCareerEntry(entryData: any) {
  selectedCareerEntry.value = entryData
  careerEntryModalMode.value = 'edit'
  showCareerEntryModal.value = true
}

function removeCareerEntry(entryId: number) {
  if (student.value?.careerEntries) {
    student.value.careerEntries = student.value.careerEntries.filter((entry: any) => entry.id !== entryId)
  }
}

function handleCareerEntrySubmit(entryData: any) {
  if (!student.value?.careerEntries) return
  
  if (careerEntryModalMode.value === 'edit') {
    const index = student.value.careerEntries.findIndex((e: any) => e.id === entryData.id)
    if (index !== -1) {
      student.value.careerEntries[index] = entryData
    }
  } else {
    // Add new entry
    const newId = student.value.careerEntries.length > 0 
      ? Math.max(...student.value.careerEntries.map((e: any) => e.id)) + 1 
      : 1
    
    student.value.careerEntries.push({
      ...entryData,
      id: newId
    })
  }
  
  showCareerEntryModal.value = false
  selectedCareerEntry.value = null
}

// Correspondence note management
function editCorrespondenceNote(noteData: any) {
  selectedCorrespondenceNote.value = noteData
  correspondenceNoteModalMode.value = 'edit'
  showCorrespondenceNoteModal.value = true
}

function removeCorrespondenceNote(noteId: number) {
  if (student.value?.correspondenceNotes) {
    student.value.correspondenceNotes = student.value.correspondenceNotes.filter((note: any) => note.id !== noteId)
  }
}

function handleCorrespondenceNoteSubmit(noteData: any) {
  if (!student.value?.correspondenceNotes) return
  
  if (correspondenceNoteModalMode.value === 'edit') {
    const index = student.value.correspondenceNotes.findIndex((n: any) => n.id === noteData.id)
    if (index !== -1) {
      student.value.correspondenceNotes[index] = noteData
    }
  } else {
    // Add new note
    const newId = student.value.correspondenceNotes.length > 0 
      ? Math.max(...student.value.correspondenceNotes.map((n: any) => n.id)) + 1 
      : 1
    
    student.value.correspondenceNotes.push({
      ...noteData,
      id: newId
    })
  }
  
  showCorrespondenceNoteModal.value = false
  selectedCorrespondenceNote.value = null
}
</script> 
