<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter">
    <div class="p-6 space-y-8">
    <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-slate-600 dark:text-white flex items-center gap-3">
            <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <DollarSign class="w-5 h-5 text-white" />
        </div>
            Book Fees Management
          </h1>
          <p class="mt-2 text-slate-500 dark:text-gray-400">
            Configure fee rules, manage penalties, and track payment history
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="showConfigModal = true"
            class="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            <Cog class="w-5 h-5" />
            Configure Rules
        </button>
          <button
            @click="exportFees('csv')"
            class="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            <Download class="w-5 h-5" />
            Export
          </button>
          <button
            @click="showAddModal = true"
            class="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            <Plus class="w-5 h-5" />
            Add Fee
        </button>
      </div>
    </div>

      <!-- Infographics Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Fees Issued -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Total Fees Issued</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">${{ totalFeesIssued.toFixed(2) }}</p>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">{{ fees.length }} total fees</p>
          </div>
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg" title="Total amount of all fees issued">
              <Mail class="w-5 h-5 text-yellow-600" />
        </div>
      </div>
    </div>

        <!-- Total Fees Paid -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
        <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Total Fees Paid</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">${{ totalFeesPaid.toFixed(2) }}</p>
              <p class="text-xs text-green-600 dark:text-green-400 mt-1">
                {{ Math.round((totalFeesPaid / totalFeesIssued) * 100) || 0 }}% collected
              </p>
        </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg" title="Total amount of fees paid">
              <CheckCircle class="w-5 h-5 text-green-600" />
        </div>
          </div>
        </div>

        <!-- Pending Fees Count -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
        <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Pending Fees</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ pendingFeesCount }}</p>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">Students with unpaid fees</p>
        </div>
            <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg" title="Number of students with pending fees">
              <User class="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <!-- Average Payment Delay -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
        <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Avg Payment Delay</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ averagePaymentDelay }} days</p>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">From due date</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg" title="Average days between due date and payment">
              <Timer class="w-5 h-5 text-blue-600" />
            </div>
        </div>
      </div>
    </div>

      <!-- Search and Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
                placeholder="Search by student name, book title, or notes..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
        />
      </div>
    </div>

          <!-- Filters -->
          <div class="flex flex-wrap gap-3">
            <select
              v-model="filters.user"
              class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
            >
              <option value="">All Users</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.type }})
              </option>
            </select>
            
            <select
              v-model="filters.reason"
              class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
            >
              <option value="">All Reasons</option>
              <option value="LATE_RETURN">Late Return</option>
              <option value="LOST">Lost Book</option>
              <option value="DAMAGED">Damaged Book</option>
            </select>
            
            <select
              v-model="filters.status"
              class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="WAIVED">Waived</option>
            </select>
            
            <button
              v-if="filters.user || filters.reason || filters.status || searchQuery"
              @click="clearFilters"
              class="px-4 py-3 text-sm text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-gray-100 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Fee Records Table -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold text-slate-600 dark:text-white">Fee Records</h3>
          <p class="text-sm text-slate-500 dark:text-gray-400 mt-1">
            Showing {{ filteredFees.length }} of {{ fees.length }} fees
          </p>
        </div>
        
        <!-- Desktop Table -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="text-left py-4 px-6 font-medium text-slate-600 dark:text-gray-300">User</th>
                <th class="text-left py-4 px-6 font-medium text-slate-600 dark:text-gray-300">Book</th>
                <th class="text-left py-4 px-6 font-medium text-slate-600 dark:text-gray-300">Amount</th>
                <th class="text-left py-4 px-6 font-medium text-slate-600 dark:text-gray-300">Reason</th>
                <th class="text-left py-4 px-6 font-medium text-slate-600 dark:text-gray-300">Due Date</th>
                <th class="text-left py-4 px-6 font-medium text-slate-600 dark:text-gray-300">Status</th>
                <th class="text-left py-4 px-6 font-medium text-slate-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fee in filteredFees" :key="fee.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <Users class="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div class="font-medium text-slate-600 dark:text-white">{{ fee.userName }}</div>
                      <div class="text-sm text-slate-500 dark:text-gray-400">{{ fee.userType }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="font-medium text-slate-600 dark:text-white">{{ fee.bookTitle }}</div>
                  <div class="text-sm text-slate-500 dark:text-gray-400">{{ fee.isbn }}</div>
                </td>
                <td class="py-4 px-6">
                  <span class="font-semibold text-slate-600 dark:text-white">${{ fee.amount.toFixed(2) }}</span>
                </td>
                <td class="py-4 px-6">
                  <span 
                    :class="getReasonColor(fee.reason)"
                    class="px-3 py-1 text-xs font-medium rounded-full"
                  >
                    {{ getReasonDisplay(fee.reason) }}
                  </span>
                </td>
                <td class="py-4 px-6 text-slate-500 dark:text-gray-400">
                  {{ formatDate(fee.dueDate) }}
                </td>
                <td class="py-4 px-6">
                  <span 
                    :class="getStatusColor(fee.status)"
                    class="px-3 py-1 text-xs font-medium rounded-full"
                  >
                    {{ fee.status }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-2">
                    <button
                      v-if="fee.status === 'PENDING'"
                      @click="openPayModal(fee)"
                      class="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Mark as Paid"
                    >
                      <CheckCircle class="w-4 h-4" />
                    </button>
                    <button
                      v-if="fee.status === 'PENDING'"
                      @click="openWaiveModal(fee)"
                      class="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                      title="Waive Fee"
                    >
                      <XCircle class="w-4 h-4" />
                    </button>
                    <button
                      v-if="fee.status === 'PENDING'"
                      @click="openEditModal(fee)"
                      class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit Fee"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click="viewUserHistory(fee.userId)"
                      class="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="View User History"
                    >
                      <History class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="lg:hidden p-4 space-y-4">
          <div v-for="fee in filteredFees" :key="fee.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <Users class="w-5 h-5 text-gray-500" />
                </div>
              <div>
                  <div class="font-medium text-slate-600 dark:text-white">{{ fee.userName }}</div>
                  <div class="text-sm text-slate-500 dark:text-gray-400">{{ fee.userType }}</div>
              </div>
              </div>
              <span 
                :class="getStatusColor(fee.status)"
                class="px-3 py-1 text-xs font-medium rounded-full"
              >
                {{ fee.status }}
              </span>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-gray-400">Book:</span>
                <span class="text-sm font-medium text-slate-600 dark:text-white">{{ fee.bookTitle }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-gray-400">Reason:</span>
                <span 
                  :class="getReasonColor(fee.reason)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getReasonDisplay(fee.reason) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-gray-400">Amount:</span>
                <span class="text-sm font-semibold text-slate-600 dark:text-white">${{ fee.amount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-gray-400">Due:</span>
                <span class="text-sm text-slate-600 dark:text-white">{{ formatDate(fee.dueDate) }}</span>
              </div>
            </div>
            
            <div class="flex gap-2">
              <button
                v-if="fee.status === 'PENDING'"
                @click="openPayModal(fee)"
                class="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded-lg transition-colors text-sm font-medium"
              >
                <CheckCircle class="w-4 h-4" />
                Pay
                </button>
              <button
                v-if="fee.status === 'PENDING'"
                @click="openWaiveModal(fee)"
                class="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50 rounded-lg transition-colors text-sm font-medium"
              >
                <XCircle class="w-4 h-4" />
                Waive
                </button>
              <button
                @click="viewUserHistory(fee.userId)"
                class="flex items-center justify-center p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
              >
                <History class="w-4 h-4" />
                </button>
          </div>
        </div>
      </div>
    </div>



      <!-- Modals Section -->
      <!-- Add Fee Modal -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-slate-600 dark:text-white">Add New Fee</h3>
              <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
            <form @submit.prevent="handleAddFee" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">User</label>
                <select v-model="newFee.userId" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors">
                  <option value="">Select a user...</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }} ({{ user.type }}) - {{ user.email }}
                </option>
              </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Book</label>
                <select v-model="newFee.bookId" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors">
                  <option value="">Select a book...</option>
                  <option v-for="book in books" :key="book.id" :value="book.id">
                    {{ book.title }} ({{ book.isbn }}) - ${{ book.value }}
                </option>
              </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Fee Reason</label>
                <select v-model="newFee.reason" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors">
                  <option value="">Select reason...</option>
                  <option value="LATE_RETURN">Late Return</option>
                  <option value="LOST">Lost Book</option>
                  <option value="DAMAGED">Damaged Book</option>
              </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Amount ($)</label>
              <input
                  v-model.number="newFee.amount"
                type="number"
                step="0.01"
                min="0"
                required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
              />
            </div>
            
            <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Due Date</label>
                <input
                  v-model="newFee.dueDate"
                  type="date"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Notes (Optional)</label>
              <textarea
                  v-model="newFee.notes"
                rows="3"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  placeholder="Additional details about this fee..."
              ></textarea>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                  @click="showAddModal = false"
                  class="px-4 py-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 transition-colors"
              >
                  Cancel
              </button>
              <button
                type="submit"
                  class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
              >
                  Add Fee
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>

      <!-- Payment Modal -->
      <div v-if="showPayModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-slate-600 dark:text-white">Process Payment</h3>
              <button @click="showPayModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X class="h-6 w-6" />
              </button>
            </div>

            <div v-if="selectedFee" class="space-y-4">
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-slate-500 dark:text-gray-400">User:</span>
                    <span class="text-sm font-medium text-slate-600 dark:text-white">{{ selectedFee.userName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-slate-500 dark:text-gray-400">Book:</span>
                    <span class="text-sm font-medium text-slate-600 dark:text-white">{{ selectedFee.bookTitle }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-slate-500 dark:text-gray-400">Reason:</span>
                    <span class="text-sm font-medium text-slate-600 dark:text-white">{{ getReasonDisplay(selectedFee.reason) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-slate-500 dark:text-gray-400">Amount:</span>
                    <span class="text-lg font-bold text-slate-600 dark:text-white">${{ selectedFee.amount.toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Payment Method</label>
                <select v-model="paymentForm.method" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors">
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Payment Notes (Optional)</label>
                <textarea
                  v-model="paymentForm.notes"
                  rows="2"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  placeholder="Transaction ID, receipt number, etc..."
                ></textarea>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="showPayModal = false"
                  class="px-4 py-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="handlePayFee"
                  class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Waive Fee Modal -->
      <div v-if="showWaiveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-slate-600 dark:text-white">Waive Fee</h3>
              <button @click="showWaiveModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X class="h-6 w-6" />
              </button>
            </div>

            <div v-if="selectedFee" class="space-y-4">
              <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <div class="flex items-center gap-2 mb-2">
                  <AlertCircle class="w-5 h-5 text-yellow-600" />
                  <span class="font-medium text-yellow-800 dark:text-yellow-200">Confirm Fee Waiver</span>
                </div>
                <p class="text-sm text-yellow-700 dark:text-yellow-300">
                  Are you sure you want to waive this fee? This action cannot be undone.
                </p>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-slate-500 dark:text-gray-400">User:</span>
                    <span class="text-sm font-medium text-slate-600 dark:text-white">{{ selectedFee.userName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-slate-500 dark:text-gray-400">Book:</span>
                    <span class="text-sm font-medium text-slate-600 dark:text-white">{{ selectedFee.bookTitle }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-slate-500 dark:text-gray-400">Amount to waive:</span>
                    <span class="text-lg font-bold text-slate-600 dark:text-white">${{ selectedFee.amount.toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="showWaiveModal = false"
                  class="px-4 py-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="handleWaiveFee"
                  class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
                >
                  Waive Fee
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User History Modal -->
      <div v-if="showHistoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h3 class="text-lg font-semibold text-slate-600 dark:text-white">Fee History</h3>
                <p v-if="selectedUser" class="text-sm text-slate-500 dark:text-gray-400">
                  {{ selectedUser.name }} ({{ selectedUser.type }}) - {{ selectedUser.email }}
                </p>
              </div>
              <button @click="showHistoryModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X class="h-6 w-6" />
              </button>
            </div>

            <div v-if="selectedUser" class="space-y-4">
              <div v-for="fee in getUserFees(selectedUser.id)" :key="fee.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="font-medium text-slate-600 dark:text-white">{{ fee.bookTitle }}</div>
                    <div class="text-sm text-slate-500 dark:text-gray-400">{{ fee.isbn }}</div>
                    <div class="text-sm text-slate-500 dark:text-gray-400 mt-1">{{ fee.notes }}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-slate-600 dark:text-white">${{ fee.amount.toFixed(2) }}</div>
                    <div class="text-sm text-slate-500 dark:text-gray-400">{{ formatDate(fee.createdDate) }}</div>
                    <span 
                      :class="getStatusColor(fee.status)"
                      class="px-2 py-1 text-xs font-medium rounded-full mt-1 inline-block"
                    >
                      {{ fee.status }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div v-if="getUserFees(selectedUser.id).length === 0" class="text-center py-8">
                <div class="text-slate-500 dark:text-gray-400">No fee history found for this user.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fee Configuration Modal -->
      <div v-if="showConfigModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-slate-600 dark:text-white">Fee Rule Configuration</h3>
              <button @click="showConfigModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X class="h-6 w-6" />
              </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Late Return Rules -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div class="flex items-center gap-3 mb-4">
                  <Clock class="w-5 h-5 text-orange-600" />
                  <h4 class="text-lg font-semibold text-slate-600 dark:text-white">Late Returns</h4>
                </div>
                
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <button
                      @click="feeRules.lateReturn.enabled = !feeRules.lateReturn.enabled"
                      class="flex items-center gap-3"
                    >
                      <component
                        :is="feeRules.lateReturn.enabled ? ToggleRight : ToggleLeft"
                        :class="feeRules.lateReturn.enabled ? 'text-yellow-500' : 'text-gray-400'"
                        class="w-8 h-8"
                      />
                      <span class="text-slate-600 dark:text-white font-medium">Enable Late Fees</span>
                    </button>
                  </div>
                  
                  <div v-if="feeRules.lateReturn.enabled" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Rate per day ($)</label>
                      <input
                        v-model.number="feeRules.lateReturn.ratePerDay"
                        type="number"
                        step="0.01"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Grace period (days)</label>
                      <input
                        v-model.number="feeRules.lateReturn.gracePeriod"
                        type="number"
                        min="0"
                        max="30"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Maximum fee ($)</label>
                      <input
                        v-model.number="feeRules.lateReturn.maxFee"
                        type="number"
                        step="0.01"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lost Book Rules -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div class="flex items-center gap-3 mb-4">
                  <AlertCircle class="w-5 h-5 text-red-600" />
                  <h4 class="text-lg font-semibold text-slate-600 dark:text-white">Lost Books</h4>
                </div>
                
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <button
                      @click="feeRules.lostBook.enabled = !feeRules.lostBook.enabled"
                      class="flex items-center gap-3"
                    >
                      <component
                        :is="feeRules.lostBook.enabled ? ToggleRight : ToggleLeft"
                        :class="feeRules.lostBook.enabled ? 'text-yellow-500' : 'text-gray-400'"
                        class="w-8 h-8"
                      />
                      <span class="text-slate-600 dark:text-white font-medium">Enable Lost Book Fees</span>
                    </button>
                  </div>
                  
                  <div v-if="feeRules.lostBook.enabled" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Default fee ($)</label>
                      <input
                        v-model.number="feeRules.lostBook.defaultFee"
                        type="number"
                        step="0.01"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    
                    <div class="flex items-center gap-4">
                      <input
                        v-model="feeRules.lostBook.useBookValue"
                        type="checkbox"
                        id="useBookValue"
                        class="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <label for="useBookValue" class="text-sm text-slate-600 dark:text-white">Use book value instead</label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Damaged Book Rules -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div class="flex items-center gap-3 mb-4">
                  <XCircle class="w-5 h-5 text-purple-600" />
                  <h4 class="text-lg font-semibold text-slate-600 dark:text-white">Damaged Books</h4>
                </div>
                
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <button
                      @click="feeRules.damagedBook.enabled = !feeRules.damagedBook.enabled"
                      class="flex items-center gap-3"
                    >
                      <component
                        :is="feeRules.damagedBook.enabled ? ToggleRight : ToggleLeft"
                        :class="feeRules.damagedBook.enabled ? 'text-yellow-500' : 'text-gray-400'"
                        class="w-8 h-8"
                      />
                      <span class="text-slate-600 dark:text-white font-medium">Enable Damage Fees</span>
                    </button>
                  </div>
                  
                  <div v-if="feeRules.damagedBook.enabled" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Minor damage ($)</label>
                      <input
                        v-model.number="feeRules.damagedBook.minorDamage"
                        type="number"
                        step="0.01"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Major damage ($)</label>
                      <input
                        v-model.number="feeRules.damagedBook.majorDamage"
                        type="number"
                        step="0.01"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Severe damage ($)</label>
                      <input
                        v-model.number="feeRules.damagedBook.severeDamage"
                        type="number"
                        step="0.01"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                @click="showConfigModal = false"
                class="px-4 py-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="saveFeeRules"
                class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
              >
                Save Rules
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import {
  DollarSign, Settings, Download, Filter, Plus, Search, CheckCircle, XCircle, 
  Edit, Eye, TrendingUp, TrendingDown, AlertCircle, Users, BookOpen, 
  Clock, Save, ToggleLeft, ToggleRight, FileText, Calendar, Hash, X,
  Mail, User, Timer, Cog, History, ChevronDown
} from 'lucide-vue-next'

const { showToast } = useToast()

// UI State
const activeTab = ref('management')
const searchQuery = ref('')
const showAddModal = ref(false)
const showPayModal = ref(false)
const showWaiveModal = ref(false)
const showEditModal = ref(false)
const showConfigModal = ref(false)
const showHistoryModal = ref(false)
const selectedFee = ref(null)
const selectedUser = ref(null)

// Filters
const filters = ref({
  user: '',
  reason: '',
  status: '',
  dateFrom: '',
  dateTo: ''
})

// Fee Configuration Rules
const feeRules = ref({
  lateReturn: {
    enabled: true,
    ratePerDay: 0.50,
    gracePeriod: 3,
    maxFee: 25.00
  },
  lostBook: {
    enabled: true,
    defaultFee: 45.00,
    useBookValue: false
  },
  damagedBook: {
    enabled: true,
    minorDamage: 5.00,
    majorDamage: 15.00,
    severeDamage: 30.00
  }
})

// Form Data
const newFee = ref({
  userId: '',
  bookId: '',
  reason: '',
  amount: 0,
  notes: '',
  dueDate: new Date().toISOString().split('T')[0]
})

const paymentForm = ref({
  method: 'cash',
  notes: '',
  amount: 0
})

// Mock Data - Enhanced
const fees = ref([
  {
    id: 1,
    userId: 'U001',
    userName: 'Emma Thompson',
    userType: 'Student',
    bookId: 'B001',
    bookTitle: 'Advanced Mathematics',
    isbn: '978-0123456789',
    amount: 7.50,
    reason: 'LATE_RETURN',
    status: 'PENDING',
    dueDate: '2024-01-15',
    createdDate: '2024-01-10',
    notes: '5 days overdue',
    paymentDate: null,
    paymentMethod: null
  },
  {
    id: 2,
    userId: 'U002',
    userName: 'James Wilson',
    userType: 'Student',
    bookId: 'B002',
    bookTitle: 'Physics Fundamentals',
    isbn: '978-0987654321',
    amount: 45.00,
    reason: 'LOST',
    status: 'PAID',
    dueDate: '2024-01-12',
    createdDate: '2024-01-08',
    notes: 'Book reported lost',
    paymentDate: '2024-01-18',
    paymentMethod: 'card'
  },
  {
    id: 3,
    userId: 'U003',
    userName: 'Sofia Garcia',
    userType: 'Staff',
    bookId: 'B003',
    bookTitle: 'Chemistry Lab Manual',
    isbn: '978-0456789123',
    amount: 15.00,
    reason: 'DAMAGED',
    status: 'PENDING',
    dueDate: '2024-01-20',
    createdDate: '2024-01-18',
    notes: 'Water damage to pages',
    paymentDate: null,
    paymentMethod: null
  },
  {
    id: 4,
    userId: 'U001',
    userName: 'Emma Thompson',
    userType: 'Student',
    bookId: 'B004',
    bookTitle: 'English Literature',
    isbn: '978-0789123456',
    amount: 3.00,
    reason: 'LATE_RETURN',
    status: 'WAIVED',
    dueDate: '2024-01-05',
    createdDate: '2024-01-03',
    notes: '3 days overdue - first offense',
    paymentDate: null,
    paymentMethod: null
  }
])

const users = ref([
  { id: 'U001', name: 'Emma Thompson', type: 'Student', email: 'emma.t@school.edu' },
  { id: 'U002', name: 'James Wilson', type: 'Student', email: 'james.w@school.edu' },
  { id: 'U003', name: 'Sofia Garcia', type: 'Staff', email: 'sofia.g@school.edu' },
  { id: 'U004', name: 'Michael Chen', type: 'Student', email: 'michael.c@school.edu' },
  { id: 'U005', name: 'Anna Rodriguez', type: 'Staff', email: 'anna.r@school.edu' }
])

const books = ref([
  { id: 'B001', title: 'Advanced Mathematics', isbn: '978-0123456789', value: 85.00 },
  { id: 'B002', title: 'Physics Fundamentals', isbn: '978-0987654321', value: 92.50 },
  { id: 'B003', title: 'Chemistry Lab Manual', isbn: '978-0456789123', value: 78.00 },
  { id: 'B004', title: 'English Literature', isbn: '978-0789123456', value: 65.00 },
  { id: 'B005', title: 'World History', isbn: '978-0321654987', value: 88.00 }
])

// Computed Properties for Infographics
const totalFeesIssued = computed(() => {
  return fees.value.reduce((sum, fee) => sum + fee.amount, 0)
})

const totalFeesPaid = computed(() => {
  return fees.value.filter(f => f.status === 'PAID').reduce((sum, fee) => sum + fee.amount, 0)
})

const pendingFeesCount = computed(() => {
  return fees.value.filter(f => f.status === 'PENDING').length
})

const averagePaymentDelay = computed(() => {
  const paidFees = fees.value.filter(f => f.status === 'PAID' && f.paymentDate)
  if (paidFees.length === 0) return 0
  
  const totalDays = paidFees.reduce((sum, fee) => {
    const due = new Date(fee.dueDate)
    const paid = new Date(fee.paymentDate)
    const diffTime = paid.getTime() - due.getTime()
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    return sum + diffDays
  }, 0)
  
  return (totalDays / paidFees.length).toFixed(1)
})

const filteredFees = computed(() => {
  let filtered = fees.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      f => f.userName.toLowerCase().includes(query) ||
           f.bookTitle.toLowerCase().includes(query) ||
           f.isbn.toLowerCase().includes(query) ||
           f.notes.toLowerCase().includes(query)
    )
  }

  // User filter
  if (filters.value.user) {
    filtered = filtered.filter(f => f.userId === filters.value.user)
  }

  // Reason filter
  if (filters.value.reason) {
    filtered = filtered.filter(f => f.reason === filters.value.reason)
  }

  // Status filter
  if (filters.value.status) {
    filtered = filtered.filter(f => f.status === filters.value.status)
  }

  // Date filters
  if (filters.value.dateFrom) {
    filtered = filtered.filter(f => f.createdDate >= filters.value.dateFrom)
  }
  if (filters.value.dateTo) {
    filtered = filtered.filter(f => f.createdDate <= filters.value.dateTo)
  }

  return filtered
})

// Methods
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getReasonDisplay = (reason) => {
  const reasons = {
    'LATE_RETURN': 'Late Return',
    'LOST': 'Lost Book',
    'DAMAGED': 'Damaged Book'
  }
  return reasons[reason] || reason
}

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'PAID':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'WAIVED':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getReasonColor = (reason) => {
  switch (reason) {
    case 'LATE_RETURN':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
    case 'LOST':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'DAMAGED':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const handleAddFee = async () => {
  try {
    const user = users.value.find(u => u.id === newFee.value.userId)
    const book = books.value.find(b => b.id === newFee.value.bookId)
    
    if (!user || !book) {
      showToast('Please select both user and book', 'error')
      return
    }
    
    const newFeeRecord = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userType: user.type,
      bookId: book.id,
      bookTitle: book.title,
      isbn: book.isbn,
      amount: newFee.value.amount,
      reason: newFee.value.reason,
      status: 'PENDING',
      dueDate: newFee.value.dueDate,
      createdDate: new Date().toISOString().split('T')[0],
      notes: newFee.value.notes,
      paymentDate: null,
      paymentMethod: null
    }
    
    fees.value.unshift(newFeeRecord)
    showToast('Fee added successfully', 'success')
    showAddModal.value = false
    
    // Reset form
    newFee.value = {
      userId: '',
      bookId: '',
      reason: '',
      amount: 0,
      notes: '',
      dueDate: new Date().toISOString().split('T')[0]
    }
  } catch (error) {
    showToast('Failed to add fee', 'error')
  }
}

const handlePayFee = async () => {
  if (!selectedFee.value) return
  
  try {
    selectedFee.value.status = 'PAID'
    selectedFee.value.paymentDate = new Date().toISOString().split('T')[0]
    selectedFee.value.paymentMethod = paymentForm.value.method
    
    if (paymentForm.value.notes) {
      selectedFee.value.notes += ` | Payment: ${paymentForm.value.notes}`
    }
    
    showToast('Fee marked as paid successfully', 'success')
    showPayModal.value = false
    
    // Reset form
    paymentForm.value = { method: 'cash', notes: '', amount: 0 }
    selectedFee.value = null
  } catch (error) {
    showToast('Failed to process payment', 'error')
  }
}

const handleWaiveFee = async () => {
  if (!selectedFee.value) return
  
  try {
    selectedFee.value.status = 'WAIVED'
    showToast('Fee waived successfully', 'success')
    showWaiveModal.value = false
    selectedFee.value = null
  } catch (error) {
    showToast('Failed to waive fee', 'error')
  }
}

const openPayModal = (fee) => {
  selectedFee.value = fee
  paymentForm.value.amount = fee.amount
  showPayModal.value = true
}

const openWaiveModal = (fee) => {
  selectedFee.value = fee
  showWaiveModal.value = true
}

const openEditModal = (fee) => {
  selectedFee.value = fee
  newFee.value = {
    userId: fee.userId,
    bookId: fee.bookId,
    reason: fee.reason,
    amount: fee.amount,
    notes: fee.notes,
    dueDate: fee.dueDate
  }
  showEditModal.value = true
}

const viewUserHistory = (userId) => {
  selectedUser.value = users.value.find(u => u.id === userId)
  showHistoryModal.value = true
}

const getUserFees = (userId) => {
  return fees.value.filter(f => f.userId === userId)
}

const exportFees = async (format = 'csv') => {
  try {
    showToast(`Exporting fees as ${format.toUpperCase()}...`, 'info')
    
    // Simulate export process
    setTimeout(() => {
      showToast('Export completed successfully', 'success')
    }, 2000)
  } catch (error) {
    showToast('Failed to export fees', 'error')
  }
}

const saveFeeRules = async () => {
  try {
    showToast('Fee rules saved successfully', 'success')
    showConfigModal.value = false
  } catch (error) {
    showToast('Failed to save fee rules', 'error')
  }
}

const clearFilters = () => {
  filters.value = {
    user: '',
    reason: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  }
  searchQuery.value = ''
}

onMounted(() => {
  console.log('Book Fees Management loaded')
})
</script> 

<style scoped>
.font-inter {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
</style>

 