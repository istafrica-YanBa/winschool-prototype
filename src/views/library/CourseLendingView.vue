<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Book, CourseLoan } from '@/types/library'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Table from '@/components/ui/table.vue'
import Modal from '@/components/ui/modal.vue'
import DatePicker from '@/components/ui/datepicker.vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const courseLoans = ref<CourseLoan[]>([])
const selectedCourse = ref<any>(null)
const showLendModal = ref(false)
const selectedBooks = ref<Book[]>([])
const searchQuery = ref('')
const startDate = ref('')
const endDate = ref('')

const loanStore = ref({
  createCourseLoan: async (data: any) => {
    console.log('Creating course loan:', data)
  },
  returnCourseLoan: async (id: string) => {
    console.log('Returning course loan:', id)
  },
  getCourseLoans: async (courseId: string) => {
    console.log('Getting course loans for:', courseId)
    return { loans: [] }
  }
})

const handleCourseSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  const query = target.value
  console.log('Course search:', query)
}

const handleBookSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  const query = target.value
  console.log('Book search:', query)
}

const handleCreateCourseLoan = async () => {
  if (!selectedCourse.value || !selectedBooks.value.length || !startDate.value || !endDate.value) return
  
  try {
    await loanStore.value.createCourseLoan({
      courseId: selectedCourse.value.id,
      bookIds: selectedBooks.value.map(book => book.id),
      startDate: startDate.value,
      endDate: endDate.value
    })
    toast.success('Books lent to course successfully')
    showLendModal.value = false
    loadCourseLoans()
  } catch (error) {
    toast.error('Failed to lend books to course')
  }
}

const handleReturnCourseLoan = async (loan: CourseLoan) => {
  try {
    await loanStore.value.returnCourseLoan(loan.id)
    toast.success('Books returned successfully')
    loadCourseLoans()
  } catch (error) {
    toast.error('Failed to return books')
  }
}

const loadCourseLoans = async () => {
  if (!selectedCourse.value) return
  
  try {
    const response = await loanStore.value.getCourseLoans(selectedCourse.value.id)
    courseLoans.value = response.loans
  } catch (error) {
    toast.error('Failed to load course loans')
  }
}

onMounted(() => {
  loadCourseLoans()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div class="flex gap-4 flex-1">
        <Input
          v-model="searchQuery"
          placeholder="Search course..."
          class="max-w-md"
          @input="handleCourseSearch"
        />
      </div>
      <Button
        @click="showLendModal = true"
        :disabled="!selectedCourse"
      >
        Lend Books to Course
      </Button>
    </div>

    <div v-if="selectedCourse" class="bg-white dark:bg-gray-800 rounded-lg p-4">
      <h2 class="text-lg font-semibold mb-2">
        {{ selectedCourse.name }} ({{ selectedCourse.code }})
      </h2>
      
      <Table>
        <template #header>
          <tr>
            <th>Books</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="loan in courseLoans" :key="loan.id">
            <td>
              <ul class="list-disc list-inside">
                <li v-for="book in loan.books" :key="book.id">
                  {{ book.title }}
                </li>
              </ul>
            </td>
            <td>{{ new Date(loan.startDate).toLocaleDateString() }}</td>
            <td>{{ new Date(loan.endDate).toLocaleDateString() }}</td>
            <td>
              <span
                :class="{
                  'bg-green-100 text-green-800': loan.status === 'ACTIVE',
                  'bg-gray-100 text-gray-800': loan.status === 'COMPLETED',
                  'bg-red-100 text-red-800': loan.status === 'CANCELLED'
                }"
                class="px-2 py-1 rounded-full text-sm"
              >
                {{ loan.status }}
              </span>
            </td>
            <td>
              <Button
                v-if="loan.status === 'ACTIVE'"
                variant="primary"
                size="sm"
                @click="handleReturnCourseLoan(loan)"
              >
                Return All
              </Button>
            </td>
          </tr>
        </template>
      </Table>
    </div>

    <!-- Lend to Course Modal -->
    <Modal v-model:show="showLendModal" title="Lend Books to Course">
      <div class="space-y-4">
        <Input
          placeholder="Search books..."
          @input="handleBookSearch"
        />
        
        <div v-if="selectedBooks.length" class="mt-4">
          <h3 class="font-medium mb-2">Selected Books:</h3>
          <ul class="list-disc list-inside">
            <li v-for="book in selectedBooks" :key="book.id">
              {{ book.title }}
              <button
                class="text-red-600 ml-2"
                @click="selectedBooks = selectedBooks.filter(b => b.id !== book.id)"
              >
                Remove
              </button>
            </li>
          </ul>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <DatePicker
            v-model="startDate"
            label="Start Date"
            required
          />
          <DatePicker
            v-model="endDate"
            label="End Date"
            required
          />
        </div>
      </div>
      <template #footer>
        <Button variant="outline" @click="showLendModal = false">Cancel</Button>
        <Button
          @click="handleCreateCourseLoan"
          :disabled="!selectedBooks.length || !startDate || !endDate"
        >
          Lend to Course
        </Button>
      </template>
    </Modal>
  </div>
</template> 