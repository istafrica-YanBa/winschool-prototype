<template>
  <div class="finances-view bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <CreditCard class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Finanzen' : 'Finances' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Schulgebühren und finanzielle Angelegenheiten' : 'Manage school fees and financial matters' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <router-link to="/dashboard/support" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <LifeBuoy class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Support' : 'Support' }}
          </router-link>
          <button class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Download class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Bericht exportieren' : 'Export Report' }}
          </button>
          <button class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Neue Transaktion' : 'New Transaction' }}
          </button>
        </div>
      </div>

      <!-- Financial Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="stat in financialStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div :class="stat.iconBg" class="p-3 rounded-lg">
              <component :is="stat.icon" class="h-6 w-6 text-white" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-slate-400">{{ stat.title }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-slate-50">{{ stat.value }}</p>
              <p :class="stat.changeColor" class="text-sm">{{ stat.change }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Management -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Payments -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50">
              {{ language === 'de' ? 'Aktuelle Zahlungen' : 'Recent Payments' }}
            </h2>
            <button class="text-primary-600 hover:text-primary-800 text-sm">
              {{ language === 'de' ? 'Alle anzeigen' : 'View All' }}
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="payment in recentPayments" :key="payment.id" class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div class="flex items-center">
                <img :src="payment.avatar" :alt="payment.student" class="h-10 w-10 rounded-full object-cover mr-3" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-slate-50">{{ payment.student }}</p>
                  <p class="text-sm text-gray-500 dark:text-slate-400">{{ payment.description }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900 dark:text-slate-50">{{ payment.amount }}</p>
                <p class="text-sm text-gray-500 dark:text-slate-400">{{ payment.date }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Outstanding Payments -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50">
              {{ language === 'de' ? 'Ausstehende Zahlungen' : 'Outstanding Payments' }}
            </h2>
            <button class="text-red-600 hover:text-red-800 text-sm">
              {{ language === 'de' ? 'Mahnungen senden' : 'Send Reminders' }}
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="payment in outstandingPayments" :key="payment.id" class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div class="flex items-center">
                <img :src="payment.avatar" :alt="payment.student" class="h-10 w-10 rounded-full object-cover mr-3" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-slate-50">{{ payment.student }}</p>
                  <p class="text-sm text-gray-500 dark:text-slate-400">{{ payment.description }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-red-600">{{ payment.amount }}</p>
                <p class="text-sm text-red-500">{{ payment.dueDate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Aid Applications -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50">
            {{ language === 'de' ? 'Anträge auf finanzielle Hilfe' : 'Financial Aid Applications' }}
          </h2>
          <div class="flex space-x-2">
            <select class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50">
              <option>{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
              <option>{{ language === 'de' ? 'Ausstehend' : 'Pending' }}</option>
              <option>{{ language === 'de' ? 'Genehmigt' : 'Approved' }}</option>
              <option>{{ language === 'de' ? 'Abgelehnt' : 'Rejected' }}</option>
            </select>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-700">
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Antragsteller' : 'Applicant' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Betrag' : 'Amount' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Status' : 'Status' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Antragsdatum' : 'Application Date' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-slate-50">
                  {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="application in aidApplications" :key="application.id" class="border-b border-gray-100 dark:border-slate-700">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img :src="application.avatar" :alt="application.applicant" class="h-8 w-8 rounded-full object-cover mr-3" />
                    <div>
                      <p class="font-medium text-gray-900 dark:text-slate-50">{{ application.applicant }}</p>
                      <p class="text-sm text-gray-500 dark:text-slate-400">{{ application.student }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 font-semibold text-gray-900 dark:text-slate-50">{{ application.amount }}</td>
                <td class="py-3 px-4">
                  <span :class="getStatusColor(application.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ application.status }}
                  </span>
                </td>
                <td class="py-3 px-4 text-gray-600 dark:text-slate-400">{{ application.date }}</td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button class="text-primary-600 hover:text-primary-800">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button class="text-green-600 hover:text-green-800">
                      <Check class="h-4 w-4" />
                    </button>
                    <button class="text-red-600 hover:text-red-800">
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Plus, DollarSign, TrendingUp, CreditCard, AlertTriangle, Eye, Check, X, Download, LifeBuoy } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const financialStats = [
  {
    title: language.value === 'de' ? 'Monatliche Einnahmen' : 'Monthly Revenue',
    value: '€45,280',
    change: '+8.2% from last month',
    changeColor: 'text-green-600',
    icon: DollarSign,
    iconBg: 'bg-green-600'
  },
  {
    title: language.value === 'de' ? 'Ausstehende Zahlungen' : 'Outstanding Payments',
    value: '€8,450',
    change: '-12% from last month',
    changeColor: 'text-green-600',
    icon: AlertTriangle,
    iconBg: 'bg-red-600'
  },
  {
    title: language.value === 'de' ? 'Finanzielle Hilfe' : 'Financial Aid',
    value: '€12,300',
    change: '+5% this month',
    changeColor: 'text-blue-600',
    icon: CreditCard,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Zahlungsrate' : 'Payment Rate',
    value: '94.2%',
    change: '+2.1% this month',
    changeColor: 'text-green-600',
    icon: TrendingUp,
    iconBg: 'bg-primary-600'
  }
]

const recentPayments = [
  {
    id: 1,
    student: 'Emma Müller',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Tuition Fee - March 2024',
    amount: '€450.00',
    date: 'Today'
  },
  {
    id: 2,
    student: 'Liam Weber',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Lab Fee - March 2024',
    amount: '€75.00',
    date: 'Yesterday'
  },
  {
    id: 3,
    student: 'Sophie Schmidt',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Book Fee - March 2024',
    amount: '€120.00',
    date: '2 days ago'
  }
]

const outstandingPayments = [
  {
    id: 1,
    student: 'Noah Fischer',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Tuition Fee - February 2024',
    amount: '€450.00',
    dueDate: 'Overdue by 15 days'
  },
  {
    id: 2,
    student: 'Mia Wagner',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Activity Fee - March 2024',
    amount: '€85.00',
    dueDate: 'Due in 3 days'
  }
]

const aidApplications = [
  {
    id: 1,
    applicant: 'Anna Schmidt',
    student: 'For: Leon Bauer',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    amount: '€300.00',
    status: 'Pending',
    date: '2024-03-08'
  },
  {
    id: 2,
    applicant: 'Michael Weber',
    student: 'For: Lisa Weber',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    amount: '€450.00',
    status: 'Approved',
    date: '2024-03-05'
  },
  {
    id: 3,
    applicant: 'Sarah Fischer',
    student: 'For: Tom Fischer',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    amount: '€200.00',
    status: 'Under Review',
    date: '2024-03-10'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'Under Review':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'Rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}
</script>
