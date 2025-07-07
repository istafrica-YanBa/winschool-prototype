<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter">
    <div class="p-6 space-y-8">
    <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-600 dark:text-white flex items-center gap-3">
            <Settings class="w-8 h-8 text-yellow-500" />
            Library Configuration
          </h1>
          <p class="text-slate-500 dark:text-gray-400 mt-2">
            Configure system-wide library policies, lending rules, and automation settings
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="resetToDefaults"
            class="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            <RotateCcw class="w-5 h-5" />
            Reset to Defaults
        </button>
          <button
            @click="saveAllSettings"
            :disabled="isSaving"
            class="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50"
          >
            <Save class="w-5 h-5" />
            {{ isSaving ? 'Saving...' : 'Save All Changes' }}
        </button>
      </div>
    </div>

      <!-- Infographics Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Active Policies -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Active Policies</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ activePolicies }}</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle class="w-5 h-5 text-green-600" />
          </div>
          </div>
        </div>

        <!-- Max Books Total -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Max Books (Total)</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ totalMaxBooks }}</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen class="w-5 h-5 text-blue-600" />
      </div>
    </div>
        </div>

        <!-- Reservation Slots -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
        <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Reservation Slots</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ totalReservationSlots }}</p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar class="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <!-- Automation Level -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
        <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Automation Level</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">
                {{ Object.values(automationSettings).filter(Boolean).length }}/4
              </p>
            </div>
            <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Settings class="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6 overflow-x-auto">
            <button
              v-for="section in [
                { id: 'lending-rules', label: 'Lending Rules' },
                { id: 'return-behavior', label: 'Return Behavior' },
                { id: 'reservations', label: 'Reservations' },
                { id: 'lending-modes', label: 'Lending Modes' },
                { id: 'automation', label: 'Automation' }
              ]"
              :key="section.id"
              @click="activeSection = section.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap',
                activeSection === section.id
                  ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <component :is="getSectionIcon(section.id)" class="w-4 h-4" />
              {{ section.label }}
            </button>
          </nav>
    </div>

        <!-- Section Content -->
        <div class="p-6">
          <!-- Lending Rules Section -->
          <div v-if="activeSection === 'lending-rules'" class="space-y-8">
            <div>
              <h3 class="text-xl font-semibold text-slate-600 dark:text-white mb-4">Default Loan Periods</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Students (days)</label>
                  <input
                    v-model.number="lendingRules.defaultLoanPeriods.students"
                    type="number"
                    min="1"
                    max="365"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Staff (days)</label>
                  <input
                    v-model.number="lendingRules.defaultLoanPeriods.staff"
                    type="number"
                    min="1"
                    max="365"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Classes (days)</label>
                  <input
                    v-model.number="lendingRules.defaultLoanPeriods.classes"
                    type="number"
                    min="1"
                    max="365"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Courses (days)</label>
        <input
                    v-model.number="lendingRules.defaultLoanPeriods.courses"
                    type="number"
                    min="1"
                    max="365"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
        />
      </div>
    </div>
        </div>

              <div>
              <h3 class="text-xl font-semibold text-slate-600 dark:text-white mb-4">Renewal Settings</h3>
              <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <button
                  @click="lendingRules.renewalsEnabled = !lendingRules.renewalsEnabled"
                  class="flex items-center gap-3"
                >
                  <component
                    :is="lendingRules.renewalsEnabled ? ToggleRight : ToggleLeft"
                    :class="lendingRules.renewalsEnabled ? 'text-yellow-500' : 'text-gray-400'"
                    class="w-8 h-8"
                  />
                  <span class="text-slate-600 dark:text-white font-medium">Enable Renewals</span>
                </button>
                <span class="text-sm text-slate-500 dark:text-gray-400">
                  Allow users to extend their loan periods
                </span>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-slate-600 dark:text-white mb-4">Maximum Concurrent Books</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Students</label>
                  <input
                    v-model.number="lendingRules.maxConcurrentBooks.students"
                    type="number"
                    min="1"
                    max="50"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Staff</label>
                  <input
                    v-model.number="lendingRules.maxConcurrentBooks.staff"
                    type="number"
                    min="1"
                    max="100"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Classes</label>
                  <input
                    v-model.number="lendingRules.maxConcurrentBooks.classes"
                    type="number"
                    min="1"
                    max="200"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Courses</label>
                  <input
                    v-model.number="lendingRules.maxConcurrentBooks.courses"
                    type="number"
                    min="1"
                    max="500"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Return Behavior Section -->
          <div v-if="activeSection === 'return-behavior'" class="space-y-8">
            <div>
              <h3 class="text-xl font-semibold text-slate-600 dark:text-white mb-4">Late Return Policy</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <button
                    @click="returnBehavior.acceptLateReturns = !returnBehavior.acceptLateReturns"
                    class="flex items-center gap-3"
                  >
                    <component
                      :is="returnBehavior.acceptLateReturns ? ToggleRight : ToggleLeft"
                      :class="returnBehavior.acceptLateReturns ? 'text-yellow-500' : 'text-gray-400'"
                      class="w-8 h-8"
                    />
                    <span class="text-slate-600 dark:text-white font-medium">Accept Late Returns</span>
                  </button>
                </div>
                
                <div v-if="returnBehavior.acceptLateReturns" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Grace Period (days)</label>
                    <input
                      v-model.number="returnBehavior.gracePeriodDays"
                      type="number"
                      min="0"
                      max="30"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    />
                    <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">Days after due date before penalties apply</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Penalty Threshold</label>
                    <input
                      v-model.number="returnBehavior.penaltyThreshold"
                      type="number"
                      min="1"
                      max="10"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    />
                    <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">Number of overdue returns before blocking lending</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-slate-600 dark:text-white mb-4">Return Processing</h3>
              <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <button
                  @click="returnBehavior.autoReturnConfirmation = !returnBehavior.autoReturnConfirmation"
                  class="flex items-center gap-3"
                >
                  <component
                    :is="returnBehavior.autoReturnConfirmation ? ToggleRight : ToggleLeft"
                    :class="returnBehavior.autoReturnConfirmation ? 'text-yellow-500' : 'text-gray-400'"
                    class="w-8 h-8"
                  />
                  <span class="text-slate-600 dark:text-white font-medium">Auto-Return Confirmation</span>
                </button>
                <span class="text-sm text-slate-500 dark:text-gray-400">
                  Automatically confirm returns when barcode is scanned
                </span>
              </div>
            </div>
          </div>

          <!-- Reservation Settings Section -->
          <div v-if="activeSection === 'reservations'" class="space-y-8">
            <div>
              <h3 class="text-xl font-semibold text-slate-600 dark:text-white mb-4">Reservation Methods</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <button
                    @click="reservationSettings.manualReservationsEnabled = !reservationSettings.manualReservationsEnabled"
                    class="flex items-center gap-3"
                  >
                    <component
                      :is="reservationSettings.manualReservationsEnabled ? ToggleRight : ToggleLeft"
                      :class="reservationSettings.manualReservationsEnabled ? 'text-yellow-500' : 'text-gray-400'"
                      class="w-8 h-8"
                    />
                    <span class="text-slate-600 dark:text-white font-medium">Manual Reservations</span>
                  </button>
                </div>
                
                <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <button
                    @click="reservationSettings.barcodeReservationsEnabled = !reservationSettings.barcodeReservationsEnabled"
                    class="flex items-center gap-3"
                  >
                    <component
                      :is="reservationSettings.barcodeReservationsEnabled ? ToggleRight : ToggleLeft"
                      :class="reservationSettings.barcodeReservationsEnabled ? 'text-yellow-500' : 'text-gray-400'"
                      class="w-8 h-8"
                    />
                    <span class="text-slate-600 dark:text-white font-medium">Barcode Reservations</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-slate-600 dark:text-white mb-4">Reservation Limits</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Students</label>
                  <input
                    v-model.number="reservationSettings.maxReservationSlots.students"
                    type="number"
                    min="0"
                    max="20"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Staff</label>
                  <input
                    v-model.number="reservationSettings.maxReservationSlots.staff"
                    type="number"
                    min="0"
                    max="50"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Classes</label>
                  <input
                    v-model.number="reservationSettings.maxReservationSlots.classes"
                    type="number"
                    min="0"
                    max="100"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Courses</label>
                  <input
                    v-model.number="reservationSettings.maxReservationSlots.courses"
                    type="number"
                    min="0"
                    max="200"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  />
        </div>
      </div>
    </div>

            <div>
              <h3 class="text-xl font-semibold text-slate-600 dark:text-white mb-4">Auto-Expiry Settings</h3>
              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Auto-Expiry Period (days)</label>
                <input
                  v-model.number="reservationSettings.autoExpiryDays"
                  type="number"
                  min="1"
                  max="30"
                  class="w-full max-w-xs px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                />
                <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">Days before unclaimed reservations expire automatically</p>
              </div>
            </div>
          </div>
          
          <!-- Lending Modes Section -->
          <div v-if="activeSection === 'lending-modes'" class="space-y-8">
            <div>
              <h3 class="text-xl font-semibold text-slate-600 dark:text-white mb-4">Individual Lending Mode</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <button
                    @click="lendingModes.singleBookMode = !lendingModes.singleBookMode"
                    class="flex items-center gap-3"
                  >
                    <component
                      :is="lendingModes.singleBookMode ? ToggleRight : ToggleLeft"
                      :class="lendingModes.singleBookMode ? 'text-yellow-500' : 'text-gray-400'"
                      class="w-8 h-8"
                    />
                    <span class="text-slate-600 dark:text-white font-medium">Single Book Mode</span>
                  </button>
                  <span class="text-sm text-slate-500 dark:text-gray-400">
                    Allow only one book per student at a time
                  </span>
                </div>
                
                <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <button
                    @click="lendingModes.multiLendingEnabled = !lendingModes.multiLendingEnabled"
                    class="flex items-center gap-3"
                  >
                    <component
                      :is="lendingModes.multiLendingEnabled ? ToggleRight : ToggleLeft"
                      :class="lendingModes.multiLendingEnabled ? 'text-yellow-500' : 'text-gray-400'"
                      class="w-8 h-8"
                    />
                    <span class="text-slate-600 dark:text-white font-medium">Multi-Lending</span>
                  </button>
                  <span class="text-sm text-slate-500 dark:text-gray-400">
                    Allow multiple books per user (subject to concurrent limits)
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold text-slate-600 dark:text-white mb-4">Group Lending Permissions</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <button
                    @click="lendingModes.groupLendingEnabled.classes = !lendingModes.groupLendingEnabled.classes"
                    class="flex items-center gap-3"
                  >
                    <component
                      :is="lendingModes.groupLendingEnabled.classes ? ToggleRight : ToggleLeft"
                      :class="lendingModes.groupLendingEnabled.classes ? 'text-yellow-500' : 'text-gray-400'"
                      class="w-8 h-8"
                    />
                    <span class="text-slate-600 dark:text-white font-medium">Class Lending</span>
                  </button>
                  <span class="text-sm text-slate-500 dark:text-gray-400">
                    Enable lending books to entire classes
                  </span>
                </div>
                
                <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <button
                    @click="lendingModes.groupLendingEnabled.courses = !lendingModes.groupLendingEnabled.courses"
                    class="flex items-center gap-3"
                  >
                    <component
                      :is="lendingModes.groupLendingEnabled.courses ? ToggleRight : ToggleLeft"
                      :class="lendingModes.groupLendingEnabled.courses ? 'text-yellow-500' : 'text-gray-400'"
                      class="w-8 h-8"
                    />
                    <span class="text-slate-600 dark:text-white font-medium">Course Lending</span>
                  </button>
                  <span class="text-sm text-slate-500 dark:text-gray-400">
                    Enable lending books to course groups
                  </span>
                </div>
              </div>
            </div>
            </div>
            
          <!-- Automation Section -->
          <div v-if="activeSection === 'automation'" class="space-y-8">
            <div>
              <h3 class="text-xl font-semibold text-slate-600 dark:text-white mb-4">Auto-Lending</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <button
                    @click="automationSettings.autoLendingOnCourseJoin = !automationSettings.autoLendingOnCourseJoin"
                    class="flex items-center gap-3"
                  >
                    <component
                      :is="automationSettings.autoLendingOnCourseJoin ? ToggleRight : ToggleLeft"
                      :class="automationSettings.autoLendingOnCourseJoin ? 'text-yellow-500' : 'text-gray-400'"
                      class="w-8 h-8"
                    />
                    <span class="text-slate-600 dark:text-white font-medium">Auto-Lend on Course Join</span>
                  </button>
                  <span class="text-sm text-slate-500 dark:text-gray-400">
                    Automatically lend course books when student joins a course
                  </span>
                </div>
                
                <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <button
                    @click="automationSettings.autoLendingOnClassUpdate = !automationSettings.autoLendingOnClassUpdate"
                    class="flex items-center gap-3"
                  >
                    <component
                      :is="automationSettings.autoLendingOnClassUpdate ? ToggleRight : ToggleLeft"
                      :class="automationSettings.autoLendingOnClassUpdate ? 'text-yellow-500' : 'text-gray-400'"
                      class="w-8 h-8"
                    />
                    <span class="text-slate-600 dark:text-white font-medium">Auto-Lend on Class Update</span>
                  </button>
                  <span class="text-sm text-slate-500 dark:text-gray-400">
                    Automatically update lending when class lists change
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold text-slate-600 dark:text-white mb-4">Notifications & Blocking</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <button
                    @click="automationSettings.autoReminderEmails = !automationSettings.autoReminderEmails"
                    class="flex items-center gap-3"
                  >
                    <component
                      :is="automationSettings.autoReminderEmails ? ToggleRight : ToggleLeft"
                      :class="automationSettings.autoReminderEmails ? 'text-yellow-500' : 'text-gray-400'"
                      class="w-8 h-8"
                    />
                    <span class="text-slate-600 dark:text-white font-medium">Auto-Reminder Emails</span>
              </button>
                  <span class="text-sm text-slate-500 dark:text-gray-400">
                    Send automatic email reminders for due books
                  </span>
                </div>
                
                <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <button
                    @click="automationSettings.autoBlockingEnabled = !automationSettings.autoBlockingEnabled"
                    class="flex items-center gap-3"
                  >
                    <component
                      :is="automationSettings.autoBlockingEnabled ? ToggleRight : ToggleLeft"
                      :class="automationSettings.autoBlockingEnabled ? 'text-yellow-500' : 'text-gray-400'"
                      class="w-8 h-8"
                    />
                    <span class="text-slate-600 dark:text-white font-medium">Auto-Blocking</span>
              </button>
                  <span class="text-sm text-slate-500 dark:text-gray-400">
                    Automatically block users with unpaid fees or lost books
                  </span>
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
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import {
  Settings, Save, BookOpen, Users, 
  Clock, RotateCcw, CheckCircle,
  ToggleLeft, ToggleRight, Calendar, FileText
} from 'lucide-vue-next'

const { addToast } = useToast()

// UI State
const isSaving = ref(false)
const activeSection = ref('lending-rules')

// Configuration Settings
const lendingRules = ref({
  defaultLoanPeriods: {
    students: 14,
    staff: 30,
    classes: 45,
    courses: 90
  },
  renewalsEnabled: true,
  maxConcurrentBooks: {
    students: 3,
    staff: 10,
    classes: 50,
    courses: 100
  }
})

const returnBehavior = ref({
  acceptLateReturns: true,
  gracePeriodDays: 7,
  penaltyThreshold: 3,
  autoReturnConfirmation: true
})

const reservationSettings = ref({
  manualReservationsEnabled: true,
  barcodeReservationsEnabled: true,
  maxReservationSlots: {
    students: 2,
    staff: 5,
    classes: 10,
    courses: 20
  },
  autoExpiryDays: 7
})

const lendingModes = ref({
  singleBookMode: false,
  multiLendingEnabled: true,
  groupLendingEnabled: {
    classes: true,
    courses: true
  }
})

const automationSettings = ref({
  autoLendingOnCourseJoin: false,
  autoLendingOnClassUpdate: false,
  autoReminderEmails: true,
  autoBlockingEnabled: true
})

// Computed stats for infographics
const activePolicies = computed(() => {
  let count = 0
  if (lendingRules.value.renewalsEnabled) count++
  if (returnBehavior.value.acceptLateReturns) count++
  if (reservationSettings.value.manualReservationsEnabled) count++
  if (reservationSettings.value.barcodeReservationsEnabled) count++
  if (lendingModes.value.multiLendingEnabled) count++
  if (automationSettings.value.autoReminderEmails) count++
  return count
})

const totalMaxBooks = computed(() => {
  return Object.values(lendingRules.value.maxConcurrentBooks).reduce((sum, val) => sum + val, 0)
})

const totalReservationSlots = computed(() => {
  return Object.values(reservationSettings.value.maxReservationSlots).reduce((sum, val) => sum + val, 0)
})

// Methods
const saveAllSettings = async () => {
  try {
    isSaving.value = true
    
    // Simulate API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    addToast({ message: 'Library configuration saved successfully!', type: 'success' })
  } catch (error) {
    addToast({ message: 'Failed to save configuration', type: 'error' })
  } finally {
    isSaving.value = false
  }
}

const resetToDefaults = () => {
  if (confirm('Are you sure you want to reset all settings to default values?')) {
    // Reset all settings to default values
    lendingRules.value = {
      defaultLoanPeriods: { students: 14, staff: 30, classes: 45, courses: 90 },
      renewalsEnabled: true,
      maxConcurrentBooks: { students: 3, staff: 10, classes: 50, courses: 100 }
    }
    
    returnBehavior.value = {
      acceptLateReturns: true,
      gracePeriodDays: 7,
      penaltyThreshold: 3,
      autoReturnConfirmation: true
    }
    
    reservationSettings.value = {
      manualReservationsEnabled: true,
      barcodeReservationsEnabled: true,
      maxReservationSlots: { students: 2, staff: 5, classes: 10, courses: 20 },
      autoExpiryDays: 7
    }
    
    lendingModes.value = {
      singleBookMode: false,
      multiLendingEnabled: true,
      groupLendingEnabled: { classes: true, courses: true }
    }
    
    automationSettings.value = {
      autoLendingOnCourseJoin: false,
      autoLendingOnClassUpdate: false,
      autoReminderEmails: true,
      autoBlockingEnabled: true
    }
    
    addToast({ message: 'Settings reset to defaults', type: 'success' })
  }
}

const getSectionIcon = (section: string) => {
  switch (section) {
    case 'lending-rules': return Clock
    case 'return-behavior': return RotateCcw
    case 'reservations': return BookOpen
    case 'lending-modes': return Users
    case 'automation': return Settings
    default: return FileText
  }
}

onMounted(() => {
  // Load existing settings from API
  console.log('Loading library configuration...')
})
</script> 

<style scoped>
.font-inter {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
</style> 