<template>
  <div class="timetable-management">
    <v-container fluid class="pa-6">
      <!-- Header Section -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">Timetable Management</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Advanced timetable planning with conflict detection</p>
        </div>
        <div class="d-flex gap-3">
          <v-btn
            prepend-icon="mdi-cog"
            variant="outlined"
            color="primary"
            class="px-6"
            @click="showConstraints"
          >
            Constraints
          </v-btn>
          <v-btn
            prepend-icon="mdi-calendar-sync"
            color="primary"
            class="px-6"
            @click="autoSchedule"
          >
            Auto Schedule
          </v-btn>
          <v-btn
            prepend-icon="mdi-file-export"
            variant="outlined"
            color="primary"
            class="px-6"
            @click="exportTimetable"
          >
            Export
          </v-btn>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="d-flex gap-3 mb-6">
        <v-select
          v-model="selectedWeek"
          :items="weekOptions"
          label="Week"
          hide-details
          density="comfortable"
          class="max-width-200"
        ></v-select>

        <v-select
          v-model="selectedClasses"
          :items="classOptions"
          label="Classes"
          hide-details
          density="comfortable"
          class="max-width-200"
        ></v-select>

        <v-select
          v-model="selectedTeachers"
          :items="teacherOptions"
          label="Teachers"
          hide-details
          density="comfortable"
          class="max-width-200"
        ></v-select>

        <v-select
          v-model="selectedRooms"
          :items="roomOptions"
          label="Rooms"
          hide-details
          density="comfortable"
          class="max-width-200"
        ></v-select>

        <v-chip
          color="error"
          variant="elevated"
          class="ml-auto"
          prepend-icon="mdi-alert-circle"
        >
          Conflicts: {{ conflicts }}
        </v-chip>
      </div>

      <!-- Conflict Alerts -->
      <v-alert
        v-if="conflicts > 0"
        type="error"
        variant="tonal"
        class="mb-6"
      >
        <template v-slot:prepend>
          <v-icon>mdi-alert-circle</v-icon>
        </template>
        <div class="text-subtitle-1 font-weight-bold mb-2">Timetable Conflicts Detected</div>
        <ul class="conflict-list ma-0">
          <li v-for="(conflict, index) in conflictList" :key="index" class="mb-1">
            {{ conflict }}
          </li>
        </ul>
      </v-alert>

      <!-- Interactive Timetable -->
      <v-card class="timetable-card">
        <v-card-title class="d-flex justify-space-between align-center py-4 px-6">
          <div class="text-h6 font-weight-bold">Interactive Timetable</div>
          <div class="d-flex gap-2">
            <v-btn
              color="primary"
              @click="saveChanges"
            >
              Save Changes
            </v-btn>
            <v-btn
              variant="outlined"
              color="primary"
              @click="resetTimetable"
            >
              Reset
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text class="pa-6">
          <table class="timetable-grid">
            <thead>
              <tr>
                <th class="time-column">TIME</th>
                <th v-for="day in days" :key="day">{{ day }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="time in timeSlots" :key="time">
                <td class="time-slot">{{ time }}</td>
                <td 
                  v-for="day in days" 
                  :key="day"
                  class="schedule-cell"
                  :class="{ 'has-class': hasClass(time, day) }"
                  @click="addLesson(time, day)"
                >
                  <div v-if="hasClass(time, day)" class="class-block" :class="getClassColor(time, day)">
                    <div class="class-name">{{ getClassName(time, day) }}</div>
                    <div class="class-details">
                      {{ getClassDetails(time, day) }}
                    </div>
                  </div>
                  <v-icon v-else color="grey" size="24">mdi-plus</v-icon>
                </td>
              </tr>
            </tbody>
          </table>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Add Lesson Dialog -->
    <v-dialog v-model="showAddDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold pa-6">
          Add Lesson
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form @submit.prevent="saveLessonDetails">
            <v-select
              v-model="newLesson.subject"
              :items="subjects"
              label="Subject"
              class="mb-4"
              required
            ></v-select>

            <v-select
              v-model="newLesson.teacher"
              :items="teachers"
              label="Teacher"
              class="mb-4"
              required
            ></v-select>

            <v-select
              v-model="newLesson.room"
              :items="rooms"
              label="Room"
              class="mb-4"
              required
            ></v-select>

            <v-select
              v-model="newLesson.class"
              :items="classes"
              label="Class"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            color="primary"
            @click="showAddDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="saveLessonDetails"
            class="ml-3"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// State
const selectedWeek = ref('This Week')
const selectedClasses = ref('All Classes')
const selectedTeachers = ref('All Teachers')
const selectedRooms = ref('All Rooms')
const conflicts = ref(2)
const showAddDialog = ref(false)

// Options
const weekOptions = ['This Week', 'Next Week', 'In Two Weeks', 'In Three Weeks']
const classOptions = ['All Classes', '10A', '10B', '11A', '11B']
const teacherOptions = ['All Teachers', 'Dr. Weber', 'Ms. Johnson', 'Prof. Mueller']
const roomOptions = ['All Rooms', 'Room 101', 'Room 108', 'Lab 1']

// Days and Time Slots
const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00'
]

// Mock Data
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English']
const teachers = ['Dr. Weber', 'Ms. Johnson', 'Prof. Mueller', 'Mr. Fischer']
const rooms = ['Room 101', 'Room 108', 'Lab 1', 'Room 302']
const classes = ['10A', '10B', '11A', '11B']

// Conflict List
const conflictList = [
  'Dr. Weber double-booked (Monday 10:00)',
  'Room 101 conflict (Wednesday 14:00)'
]

// New Lesson State
const newLesson = ref({
  subject: '',
  teacher: '',
  room: '',
  class: ''
})

// Mock Timetable Data
const timetableData = ref([
  {
    time: '08:00',
    day: 'MONDAY',
    subject: 'Mathematics',
    teacher: 'Dr. Weber',
    room: 'Room 101',
    class: '10A'
  },
  {
    time: '08:00',
    day: 'TUESDAY',
    subject: 'English',
    teacher: 'Ms. Johnson',
    room: 'Room 108',
    class: '10A'
  },
  {
    time: '09:00',
    day: 'MONDAY',
    subject: 'Physics',
    teacher: 'Prof. Mueller',
    room: 'Lab 1',
    class: '10A'
  },
  {
    time: '09:00',
    day: 'TUESDAY',
    subject: 'History',
    teacher: 'Mr. Fischer',
    room: 'Room 302',
    class: '10A'
  }
])

// Methods
const hasClass = (time: string, day: string) => {
  return timetableData.value.some(item => item.time === time && item.day === day)
}

const getClassName = (time: string, day: string) => {
  const lesson = timetableData.value.find(item => item.time === time && item.day === day)
  return lesson ? lesson.subject : ''
}

const getClassDetails = (time: string, day: string) => {
  const lesson = timetableData.value.find(item => item.time === time && item.day === day)
  return lesson ? `${lesson.class} • ${lesson.room}` : ''
}

const getClassColor = (time: string, day: string) => {
  const lesson = timetableData.value.find(item => item.time === time && item.day === day)
  if (!lesson) return ''

  const colors = {
    'Mathematics': 'math-class',
    'Physics': 'physics-class',
    'English': 'english-class',
    'History': 'history-class'
  }

  return colors[lesson.subject as keyof typeof colors] || 'default-class'
}

const addLesson = (time: string, day: string) => {
  if (!hasClass(time, day)) {
    showAddDialog.value = true
  }
}

const saveLessonDetails = () => {
  // Implementation
  showAddDialog.value = false
}

const showConstraints = () => {
  // Implementation
}

const autoSchedule = () => {
  // Implementation
}

const exportTimetable = () => {
  // Implementation
}

const saveChanges = () => {
  // Implementation
}

const resetTimetable = () => {
  // Implementation
}
</script>

<style scoped>
.timetable-management {
  background-color: #F8FAFC;
  min-height: 100vh;
}

.max-width-200 {
  max-width: 200px;
}

.timetable-card {
  border: 1px solid #E5E9F2;
  border-radius: 12px;
}

.timetable-grid {
  width: 100%;
  border-collapse: separate;
  border-spacing: 8px;
}

.timetable-grid th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #697386;
}

.time-column {
  width: 100px;
}

.time-slot {
  color: #697386;
  font-weight: 500;
}

.schedule-cell {
  height: 80px;
  border: 1px dashed #E5E9F2;
  border-radius: 8px;
  vertical-align: top;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 180px;
}

.schedule-cell:hover {
  border-color: #2196F3;
  background-color: rgba(33, 150, 243, 0.04);
}

.schedule-cell.has-class {
  border: none;
}

.class-block {
  height: 100%;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.class-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.class-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.class-details {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.7);
}

/* Subject Colors */
.math-class {
  background-color: #E3F2FD;
  border-left: 4px solid #2196F3;
}

.physics-class {
  background-color: #F3E5F5;
  border-left: 4px solid #9C27B0;
}

.english-class {
  background-color: #E8F5E9;
  border-left: 4px solid #4CAF50;
}

.history-class {
  background-color: #FFF3E0;
  border-left: 4px solid #FF9800;
}

.default-class {
  background-color: #F5F5F5;
  border-left: 4px solid #9E9E9E;
}

.conflict-list {
  list-style-type: none;
  padding-left: 0;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}
</style> 
