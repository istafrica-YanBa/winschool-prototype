<template>
  <div class="space-y-6">
    <!-- Page Title Section -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Fachzuordnung' : 'Subject Assignment' }}
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Verwalten Sie Lehrer-Fach-Zuordnungen' : 'Manage teacher-subject assignments' }}
        </p>
      </div>
      <button @click="showAssignmentModal = true" class="btn-primary flex items-center" style="font-family: Inter, sans-serif;">
        <Plus class="h-4 w-4 mr-2" />
        {{ language === 'de' ? 'Neue Zuordnung' : 'New Assignment' }}
      </button>
    </div>

    <!-- Assignment Matrix -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Zuordnungsmatrix' : 'Assignment Matrix' }}
        </h2>
        <div class="flex space-x-2">
          <select v-model="selectedDepartment" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">{{ language === 'de' ? 'Alle Abteilungen' : 'All Departments' }}</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
          <button @click="exportMatrix" class="btn-secondary text-sm">
            {{ language === 'de' ? 'Exportieren' : 'Export' }}
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
              </th>
              <th v-for="subject in subjects" :key="subject" class="text-center py-3 px-2 font-medium text-gray-900 dark:text-white text-xs">
                {{ subject }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="teacher in filteredTeachers" :key="teacher.id" class="border-b border-gray-100 dark:border-gray-700">
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img :src="teacher.avatar" :alt="teacher.name" class="h-8 w-8 rounded-full object-cover mr-3" />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ teacher.name }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ teacher.department }}</p>
                  </div>
                </div>
              </td>
              <td v-for="subject in subjects" :key="`${teacher.id}-${subject}`" class="text-center py-3 px-2">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    :checked="isAssigned(teacher.id, subject)"
                    @change="toggleAssignment(teacher.id, subject)"
                    class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                </label>
              </td>
              <td class="py-3 px-4">
                <button @click="editTeacherAssignments(teacher)" class="text-primary-600 hover:text-primary-800">
                  <Edit class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Assignment Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ language === 'de' ? 'Fachverteilung' : 'Subject Distribution' }}
        </h3>
        <div class="space-y-3">
          <div v-for="stat in subjectStats" :key="stat.subject" class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ stat.subject }}</span>
            <div class="flex items-center space-x-2">
              <div class="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div class="bg-primary-600 h-2 rounded-full" :style="{ width: (stat.teachers / maxTeachersPerSubject * 100) + '%' }"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ stat.teachers }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ language === 'de' ? 'Lehrerarbeitsbelastung' : 'Teacher Workload' }}
        </h3>
        <div class="space-y-3">
          <div v-for="teacher in teacherWorkload" :key="teacher.id" class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ teacher.name }}</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ teacher.subjects }}</span>
              <span :class="getWorkloadColor(teacher.subjects)" class="text-xs px-2 py-1 rounded-full">
                {{ getWorkloadStatus(teacher.subjects) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ language === 'de' ? 'Unbesetzte Fächer' : 'Unassigned Subjects' }}
        </h3>
        <div class="space-y-2">
          <div v-for="subject in unassignedSubjects" :key="subject" class="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p class="text-sm font-medium text-red-800 dark:text-red-200">{{ subject }}</p>
            <button @click="assignSubject(subject)" class="text-xs text-red-600 hover:text-red-800 dark:text-red-400">
              {{ language === 'de' ? 'Zuordnen' : 'Assign' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Assignment Modal -->
    <div v-if="showAssignmentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neue Fachzuordnung' : 'New Subject Assignment' }}
            </h3>
            <button @click="showAssignmentModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="createAssignment" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
              </label>
              <select
                v-model="assignmentForm.teacherId"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Lehrer wählen' : 'Select Teacher' }}</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Fächer' : 'Subjects' }}
              </label>
              <div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                <label v-for="subject in subjects" :key="subject" class="flex items-center">
                  <input
                    v-model="assignmentForm.subjects"
                    type="checkbox"
                    :value="subject"
                    class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
                  />
                  <span class="text-sm text-gray-900 dark:text-white">{{ subject }}</span>
                </label>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showAssignmentModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Zuordnung erstellen' : 'Create Assignment' }}
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
import { Plus, Edit, X } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showAssignmentModal = ref(false)
const selectedDepartment = ref('')

const assignmentForm = ref({
  teacherId: '',
  subjects: [] as string[]
})

const departments = ['Mathematics', 'Sciences', 'Languages', 'Arts', 'Sports']
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'German', 'English', 'French', 'History', 'Geography', 'Art', 'Music', 'PE']

const teachers = ref([
  {
    id: 1,
    name: 'Dr. Thomas Weber',
    department: 'Mathematics',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subjects: ['Mathematics', 'Physics']
  },
  {
    id: 2,
    name: 'Ms. Sarah Schmidt',
    department: 'Languages',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subjects: ['German', 'English']
  },
  {
    id: 3,
    name: 'Prof. Michael Mueller',
    department: 'Sciences',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    subjects: ['Physics', 'Chemistry']
  }
])

const assignments = ref([
  { teacherId: 1, subject: 'Mathematics' },
  { teacherId: 1, subject: 'Physics' },
  { teacherId: 2, subject: 'German' },
  { teacherId: 2, subject: 'English' },
  { teacherId: 3, subject: 'Physics' },
  { teacherId: 3, subject: 'Chemistry' }
])

const filteredTeachers = computed(() => {
  if (!selectedDepartment.value) return teachers.value
  return teachers.value.filter(teacher => teacher.department === selectedDepartment.value)
})

const subjectStats = computed(() => {
  return subjects.map(subject => ({
    subject,
    teachers: assignments.value.filter(a => a.subject === subject).length
  }))
})

const maxTeachersPerSubject = computed(() => {
  return Math.max(...subjectStats.value.map(s => s.teachers), 1)
})

const teacherWorkload = computed(() => {
  return teachers.value.map(teacher => ({
    id: teacher.id,
    name: teacher.name,
    subjects: assignments.value.filter(a => a.teacherId === teacher.id).length
  }))
})

const unassignedSubjects = computed(() => {
  return subjects.filter(subject => 
    !assignments.value.some(a => a.subject === subject)
  )
})

const isAssigned = (teacherId: number, subject: string) => {
  return assignments.value.some(a => a.teacherId === teacherId && a.subject === subject)
}

const toggleAssignment = (teacherId: number, subject: string) => {
  const index = assignments.value.findIndex(a => a.teacherId === teacherId && a.subject === subject)
  if (index > -1) {
    assignments.value.splice(index, 1)
  } else {
    assignments.value.push({ teacherId, subject })
  }
}

const editTeacherAssignments = (teacher: any) => {
  assignmentForm.value.teacherId = teacher.id.toString()
  assignmentForm.value.subjects = assignments.value
    .filter(a => a.teacherId === teacher.id)
    .map(a => a.subject)
  showAssignmentModal.value = true
}

const createAssignment = () => {
  // Remove existing assignments for this teacher
  assignments.value = assignments.value.filter(a => a.teacherId !== parseInt(assignmentForm.value.teacherId))
  
  // Add new assignments
  assignmentForm.value.subjects.forEach(subject => {
    assignments.value.push({
      teacherId: parseInt(assignmentForm.value.teacherId),
      subject
    })
  })
  
  showAssignmentModal.value = false
  assignmentForm.value = { teacherId: '', subjects: [] }
}

const assignSubject = (subject: string) => {
  alert(`${language.value === 'de' ? 'Fach zuordnen' : 'Assign subject'}: ${subject}`)
}

const exportMatrix = () => {
  alert(language.value === 'de' ? 'Matrix exportiert!' : 'Matrix exported!')
}

const getWorkloadColor = (subjectCount: number) => {
  if (subjectCount > 4) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  if (subjectCount > 2) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

const getWorkloadStatus = (subjectCount: number) => {
  if (subjectCount > 4) return language.value === 'de' ? 'Hoch' : 'High'
  if (subjectCount > 2) return language.value === 'de' ? 'Normal' : 'Normal'
  return language.value === 'de' ? 'Niedrig' : 'Low'
}
</script>
