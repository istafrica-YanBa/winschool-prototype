<template>
  <div class="course-addition">
    <v-container fluid>
      <!-- Header Section -->
      <v-row>
        <v-col cols="12">
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon large color="primary" class="mr-2">mdi-book-plus</v-icon>
              Course Addition
              <v-spacer></v-spacer>
              <v-btn-group>
                <v-btn color="primary" prepend-icon="mdi-refresh" @click="refreshData">
                  Refresh
                </v-btn>
                <v-btn color="secondary" prepend-icon="mdi-file-export" @click="exportReport">
                  Export Report
                </v-btn>
              </v-btn-group>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>

      <!-- Main Content -->
      <v-row>
        <!-- Manual Addition Section -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-subtitle-1">
              <v-icon color="primary" class="mr-2">mdi-hand-pointing-right</v-icon>
              Manual Course Addition
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="addCourseManually">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="manualForm.subject"
                      :items="subjects"
                      item-title="name"
                      item-value="id"
                      label="Subject"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="manualForm.teacher"
                      :items="teachers"
                      item-title="name"
                      item-value="id"
                      label="Teacher"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="manualForm.class"
                      :items="classes"
                      label="Class"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="manualForm.schedule"
                      :items="timeSlots"
                      label="Schedule"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="manualForm.description"
                      label="Description"
                      rows="3"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      color="primary"
                      type="submit"
                      block
                      :loading="isSubmitting"
                    >
                      Add Course
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Automatic Addition Section -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-subtitle-1">
              <v-icon color="primary" class="mr-2">mdi-robot</v-icon>
              Automatic Course Addition
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="addCoursesAutomatically">
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="autoForm.class"
                      :items="classes"
                      label="Target Class"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="autoForm.subjects"
                      :items="subjects"
                      item-title="name"
                      item-value="id"
                      label="Subjects to Add"
                      multiple
                      chips
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="autoForm.optimization"
                      :items="optimizationOptions"
                      label="Optimization Strategy"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      color="primary"
                      type="submit"
                      block
                      :loading="isOptimizing"
                    >
                      Optimize and Add Courses
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Optimization Preview -->
          <v-card class="mt-4" v-if="optimizationPreview.length > 0">
            <v-card-title class="text-subtitle-1">
              <v-icon color="primary" class="mr-2">mdi-eye</v-icon>
              Optimization Preview
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(course, index) in optimizationPreview"
                  :key="index"
                >
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-book</v-icon>
                  </template>
                  <v-list-item-title>
                    {{ getSubjectName(course.subject) }} - {{ course.schedule }}
                  </v-list-item-title>
                  <template v-slot:append>
                    <v-chip
                      :color="course.status === 'optimal' ? 'success' : 'warning'"
                      size="small"
                    >
                      {{ course.status }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Course List -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-title class="text-subtitle-1">
              <v-icon color="primary" class="mr-2">mdi-format-list-bulleted</v-icon>
              Added Courses
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="courses"
                :search="search"
                hover
              >
                <template v-slot:item.subject="{ item }">
                  {{ getSubjectName(item.subject) }}
                </template>

                <template v-slot:item.teacher="{ item }">
                  {{ getTeacherName(item.teacher) }}
                </template>

                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="getStatusColor(item.status)"
                    size="small"
                  >
                    {{ item.status }}
                  </v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    size="small"
                    color="primary"
                    class="mr-2"
                    @click="editCourse(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    size="small"
                    color="error"
                    @click="deleteCourse(item)"
                  ></v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Edit Course Dialog -->
    <v-dialog v-model="showEditDialog" max-width="600px">
      <v-card>
        <v-card-title>Edit Course</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveCourse">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editForm.subject"
                  :items="subjects"
                  item-title="name"
                  item-value="id"
                  label="Subject"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editForm.teacher"
                  :items="teachers"
                  item-title="name"
                  item-value="id"
                  label="Teacher"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editForm.class"
                  :items="classes"
                  label="Class"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editForm.schedule"
                  :items="timeSlots"
                  label="Schedule"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editForm.description"
                  label="Description"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="showEditDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="saveCourse">
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { subjects } from '../mock/subjects'
import { teachers } from '../mock/teachers'

// Constants
const classes = ['10A', '10B', '11A', '11B', '12A', '12B']
const timeSlots = [
  'Monday 8:00-9:30',
  'Monday 9:45-11:15',
  'Monday 11:30-13:00',
  'Tuesday 8:00-9:30',
  'Tuesday 9:45-11:15',
  'Tuesday 11:30-13:00',
  'Wednesday 8:00-9:30',
  'Wednesday 9:45-11:15',
  'Wednesday 11:30-13:00',
  'Thursday 8:00-9:30',
  'Thursday 9:45-11:15',
  'Thursday 11:30-13:00',
  'Friday 8:00-9:30',
  'Friday 9:45-11:15',
  'Friday 11:30-13:00'
]

const optimizationOptions = [
  'Minimize Teacher Conflicts',
  'Balance Class Load',
  'Optimize Student Schedule',
  'Maximize Resource Usage'
]

// State
const search = ref('')
const isSubmitting = ref(false)
const isOptimizing = ref(false)
const showEditDialog = ref(false)
const editingCourse = ref<any>(null)
const optimizationPreview = ref<any[]>([])

const manualForm = ref({
  subject: null,
  teacher: null,
  class: '',
  schedule: '',
  description: ''
})

const autoForm = ref({
  class: '',
  subjects: [],
  optimization: ''
})

const editForm = ref({
  subject: null,
  teacher: null,
  class: '',
  schedule: '',
  description: ''
})

// Mock data for courses
const courses = ref([
  {
    id: 1,
    subject: 1,
    teacher: 1,
    class: '10A',
    schedule: 'Monday 8:00-9:30',
    description: 'Advanced Mathematics',
    status: 'active'
  },
  {
    id: 2,
    subject: 2,
    teacher: 2,
    class: '10B',
    schedule: 'Tuesday 9:45-11:15',
    description: 'Physics Fundamentals',
    status: 'pending'
  },
  {
    id: 3,
    subject: 3,
    teacher: 3,
    class: '11A',
    schedule: 'Wednesday 11:30-13:00',
    description: 'Chemistry Basics',
    status: 'completed'
  }
])

// Table Headers
const headers = [
  { title: 'Subject', key: 'subject' },
  { title: 'Teacher', key: 'teacher' },
  { title: 'Class', key: 'class' },
  { title: 'Schedule', key: 'schedule' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Methods
const getSubjectName = (id: number) => {
  const subject = subjects.find(s => s.id === id)
  return subject ? subject.name : 'Unknown Subject'
}

const getTeacherName = (id: number) => {
  const teacher = teachers.find(t => t.id === id)
  return teacher ? teacher.name : 'Unknown Teacher'
}

const getStatusColor = (status: string) => {
  const colors = {
    active: 'success',
    pending: 'warning',
    completed: 'info'
  }
  return colors[status as keyof typeof colors] || 'grey'
}

const refreshData = () => {
  // Implementation for refreshing data
  console.log('Refreshing data')
}

const exportReport = () => {
  // Implementation for exporting report
  console.log('Exporting report')
}

const addCourseManually = async () => {
  isSubmitting.value = true
  try {
    // Implementation for adding course manually
    console.log('Adding course manually:', manualForm.value)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    // Ensure subject and teacher are numbers
    const courseData = {
      id: courses.value.length + 1,
      subject: manualForm.value.subject || 1, // Default to first subject
      teacher: manualForm.value.teacher || 1, // Default to first teacher
      class: manualForm.value.class,
      schedule: manualForm.value.schedule,
      description: manualForm.value.description,
      status: 'pending'
    }
    
    courses.value.push(courseData)
    resetManualForm()
  } finally {
    isSubmitting.value = false
  }
}

const addCoursesAutomatically = async () => {
  isOptimizing.value = true
  try {
    // Implementation for automatic course addition
    console.log('Adding courses automatically:', autoForm.value)
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate optimization
    
    // Generate preview
    optimizationPreview.value = autoForm.value.subjects.map(subjectId => ({
      subject: subjectId,
      schedule: timeSlots[Math.floor(Math.random() * timeSlots.length)],
      status: Math.random() > 0.5 ? 'optimal' : 'suboptimal'
    }))
  } finally {
    isOptimizing.value = false
  }
}

const editCourse = (course: any) => {
  editingCourse.value = course
  editForm.value = {
    subject: course.subject,
    teacher: course.teacher,
    class: course.class,
    schedule: course.schedule,
    description: course.description
  }
  showEditDialog.value = true
}

const deleteCourse = (course: any) => {
  if (confirm('Are you sure you want to delete this course?')) {
    // Implementation for deleting course
    console.log('Deleting course:', course)
    const index = courses.value.findIndex(c => c.id === course.id)
    if (index !== -1) {
      courses.value.splice(index, 1)
    }
  }
}

const saveCourse = () => {
  // Implementation for saving course
  console.log('Saving course:', editForm.value)
  const index = courses.value.findIndex(c => c.id === editingCourse.value.id)
  if (index !== -1) {
    courses.value[index] = {
      ...courses.value[index],
      subject: editForm.value.subject || 1,
      teacher: editForm.value.teacher || 1,
      class: editForm.value.class,
      schedule: editForm.value.schedule,
      description: editForm.value.description
    }
  }
  showEditDialog.value = false
  resetEditForm()
}

const resetManualForm = () => {
  manualForm.value = {
    subject: null,
    teacher: null,
    class: '',
    schedule: '',
    description: ''
  }
}

const resetEditForm = () => {
  editForm.value = {
    subject: null,
    teacher: null,
    class: '',
    schedule: '',
    description: ''
  }
  editingCourse.value = null
}
</script>

<style scoped>
.course-addition {
  padding: 16px;
}
</style> 
