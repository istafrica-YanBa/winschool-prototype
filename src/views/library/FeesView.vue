<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFeeStore } from '@/stores/library/fee'
import type { BookFee } from '@/types/library'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Table from '@/components/ui/table.vue'
import Modal from '@/components/ui/modal.vue'
import { useToast } from '@/composables/useToast'

const feeStore = useFeeStore()
const toast = useToast()

const fees = ref<BookFee[]>([])
const selectedFee = ref<BookFee | null>(null)
const showPayModal = ref(false)
const showAddModal = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const newFee = ref({
  loanId: '',
  amount: 0,
  reason: 'LATE_RETURN',
  dueDate: ''
})

const handleAddFee = async () => {
  try {
    await feeStore.createFee(newFee.value)
    toast.success('Fee added successfully')
    showAddModal.value = false
    loadFees()
  } catch (error) {
    toast.error('Failed to add fee')
  }
}

const handlePayFee = async () => {
  if (!selectedFee.value) return
  
  try {
    await feeStore.payFee(selectedFee.value.id)
    toast.success('Fee paid successfully')
    showPayModal.value = false
    loadFees()
  } catch (error) {
    toast.error('Failed to process payment')
  }
}

const handleWaiveFee = async (fee: BookFee) => {
  try {
    await feeStore.waiveFee(fee.id)
    toast.success('Fee waived successfully')
    loadFees()
  } catch (error) {
    toast.error('Failed to waive fee')
  }
}

const loadFees = async () => {
  try {
    const response = await feeStore.getFees({
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchQuery.value
    })
    fees.value = response.fees
  } catch (error) {
    toast.error('Failed to load fees')
  }
}

onMounted(() => {
  loadFees()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div class="flex gap-4 flex-1">
        <Input
          v-model="searchQuery"
          placeholder="Search fees..."
          class="max-w-md"
          @input="loadFees"
        />
      </div>
      <Button @click="showAddModal = true">Add Fee</Button>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
      <Table>
        <template #header>
          <tr>
            <th>Student</th>
            <th>Book</th>
            <th>Amount</th>
            <th>Reason</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="fee in fees" :key="fee.id">
            <td>{{ fee.loan?.student?.name }}</td>
            <td>{{ fee.loan?.book?.title }}</td>
            <td>${{ fee.amount.toFixed(2) }}</td>
            <td>{{ fee.reason }}</td>
            <td>{{ new Date(fee.dueDate).toLocaleDateString() }}</td>
            <td>
              <span
                :class="{
                  'bg-red-100 text-red-800': fee.status === 'PENDING',
                  'bg-green-100 text-green-800': fee.status === 'PAID',
                  'bg-gray-100 text-gray-800': fee.status === 'WAIVED'
                }"
                class="px-2 py-1 rounded-full text-sm"
              >
                {{ fee.status }}
              </span>
            </td>
            <td class="flex gap-2">
              <Button
                v-if="fee.status === 'PENDING'"
                variant="primary"
                size="sm"
                @click="selectedFee = fee; showPayModal = true"
              >
                Pay
              </Button>
              <Button
                v-if="fee.status === 'PENDING'"
                variant="outline"
                size="sm"
                @click="handleWaiveFee(fee)"
              >
                Waive
              </Button>
            </td>
          </tr>
        </template>
      </Table>
    </div>

    <!-- Add Fee Modal -->
    <Modal v-model:show="showAddModal" title="Add New Fee">
      <div class="space-y-4">
        <Input
          v-model="newFee.loanId"
          label="Loan ID"
          required
        />
        <Input
          v-model.number="newFee.amount"
          type="number"
          label="Amount"
          required
        />
        <select
          v-model="newFee.reason"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-2"
        >
          <option value="LATE_RETURN">Late Return</option>
          <option value="DAMAGE">Damage</option>
          <option value="LOSS">Loss</option>
        </select>
        <Input
          v-model="newFee.dueDate"
          type="date"
          label="Due Date"
          required
        />
      </div>
      <template #footer>
        <Button variant="outline" @click="showAddModal = false">Cancel</Button>
        <Button @click="handleAddFee">Add Fee</Button>
      </template>
    </Modal>

    <!-- Pay Fee Modal -->
    <Modal v-model:show="showPayModal" title="Pay Fee">
      <div class="space-y-4" v-if="selectedFee">
        <p>Amount to pay: ${{ selectedFee.amount.toFixed(2) }}</p>
        <p>Student: {{ selectedFee.loan?.student?.name }}</p>
        <p>Book: {{ selectedFee.loan?.book?.title }}</p>
      </div>
      <template #footer>
        <Button variant="outline" @click="showPayModal = false">Cancel</Button>
        <Button @click="handlePayFee">Confirm Payment</Button>
      </template>
    </Modal>
  </div>
</template> 