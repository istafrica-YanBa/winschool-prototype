<template>
  <div class="min-h-screen bg-winschool-bg dark:bg-winschool-dark-bg transition-colors duration-300">
    <!-- Top Navigation -->
    <nav class="fixed w-full z-30 bg-winschool-bg dark:bg-winschool-dark-bg border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left side -->
          <div class="flex items-center">
            <!-- Mobile menu button -->
            <button 
              @click="toggleSidebar"
              class="lg:hidden p-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Menu class="h-6 w-6" />
            </button>
            <!-- Logo and Name Section -->
            <div class="flex flex-col ml-4 lg:ml-0">
              <!-- Logo and WinSchool Name -->
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 bg-winschool-primary rounded-lg flex items-center justify-center">
                  <GraduationCap class="h-5 w-5 text-slate-800" />
                </div>
                <span class="text-xl font-bold text-slate-800 dark:text-slate-50">WinSchool</span>
              </div>
            </div>
            <!-- Vertical Separator and Breadcrumb -->
            <div v-if="breadcrumbSegments.length > 0" class="hidden lg:flex items-center" :style="{ marginLeft: sidebarCollapsed ? '54px' : '64px' }">
              <div class="h-6 w-px bg-slate-300 dark:bg-slate-600 mr-6"></div>
              <RuneBreadcrumbs
                truncate
                max-width=""
                :items="breadcrumbItems"
              />
            </div>
          </div>
          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 relative transition-colors">
              <Bell class="h-6 w-6" />
              <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <!-- Language Toggle -->
            <div class="relative">
              <button 
                @click="showLanguageDropdown = !showLanguageDropdown"
                class="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center transition-colors"
              >
                <Globe class="h-6 w-6" />
                <ChevronDown class="h-4 w-4 ml-1" />
              </button>
              <!-- Language Dropdown -->
              <div 
                v-if="showLanguageDropdown"
                class="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 z-50"
              >
                <button 
                  @click="setLanguage('en')"
                  class="w-full text-left px-4 py-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-t-lg transition-colors"
                  :class="{ 'bg-winschool-primary dark:bg-winschool-primary-dark text-slate-800 dark:text-slate-900': language === 'en' }"
                >
                  🇺🇸 English
                </button>
                <button 
                  @click="setLanguage('de')"
                  class="w-full text-left px-4 py-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-b-lg transition-colors"
                  :class="{ 'bg-winschool-primary dark:bg-winschool-primary-dark text-slate-800 dark:text-slate-900': language === 'de' }"
                >
                  🇩🇪 Deutsch
                </button>
              </div>
            </div>
            <!-- Theme Toggle -->
            <button 
              @click="toggleTheme"
              class="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <component :is="isDarkMode ? Sun : Moon" class="h-6 w-6" />
            </button>
            <!-- User Menu -->
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <img 
                  :src="user?.avatar" 
                  :alt="user?.name"
                  class="h-8 w-8 rounded-full object-cover"
                />
                <div class="hidden md:block text-left">
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ user?.name }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 capitalize">{{ getRoleDisplayName(user?.role) }}</p>
                </div>
                <ChevronDown class="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </button>
              <!-- User Dropdown -->
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 z-50"
              >
                <router-link 
                  to="/dashboard/profile"
                  class="flex items-center px-4 py-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  @click="showUserMenu = false"
                >
                  <User class="h-4 w-4 mr-3" />
                  {{ language === 'de' ? 'Profil' : 'Profile' }}
                </router-link>
                <router-link 
                  to="/dashboard/settings"
                  class="flex items-center px-4 py-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  @click="showUserMenu = false"
                >
                  <Settings class="h-4 w-4 mr-3" />
                  {{ language === 'de' ? 'Einstellungen' : 'Settings' }}
                </router-link>
                <router-link 
                  to="/dashboard/help"
                  class="flex items-center px-4 py-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  @click="showUserMenu = false"
                >
                  <HelpCircle class="h-4 w-4 mr-3" />
                  {{ language === 'de' ? 'Hilfe' : 'Help' }}
                </router-link>
                <hr class="border-gray-200 dark:border-slate-600" />
                <button 
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <LogOut class="h-4 w-4 mr-3" />
                  {{ language === 'de' ? 'Abmelden' : 'Sign Out' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex pt-16">
      <!-- Sidebar -->
      <aside 
        :class="[
          'fixed top-16 bottom-0 left-0 border-r-0 transform transition-all duration-300 ease-in-out z-20 overflow-y-auto',
          sidebarCollapsed ? 'w-16' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          'bg-winschool-bg dark:bg-winschool-sidebar-dark'
        ]"
        style="border-right: 1px solid rgb(203 213 225);"
      >
        <div class="flex flex-col h-full">
          <!-- Collapse Button Section -->
          <div v-if="!sidebarCollapsed" class="p-4 border-b border-gray-200 dark:border-slate-700">
            <button 
              @click="toggleSidebarCollapse"
              class="button-hover flex items-center justify-center w-full p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Collapse Sidebar"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <!-- Collapse Button for Collapsed State -->
          <div v-if="sidebarCollapsed" class="p-4 border-b border-gray-200 dark:border-slate-700">
            <button 
              @click="toggleSidebarCollapse"
              class="button-hover flex items-center justify-center w-full p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative group"
              title="Expand Sidebar"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m13 5 7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <!-- Tooltip for collapsed expand button -->
              <div class="absolute left-full ml-2 px-3 py-2 bg-slate-800 dark:bg-slate-700 text-slate-50 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap"
                   style="border-radius: 0px; border: 1px solid #facc15;">
                {{ language === 'de' ? 'Sidebar erweitern' : 'Expand Sidebar' }}
              </div>
            </button>
          </div>
          <!-- Main Navigation -->
          <nav class="flex-1 py-6 overflow-y-auto">
            <div class="space-y-1">
              <!-- Dashboard Link -->
              <router-link
                to="/dashboard"
                class="flex items-center mx-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-200 transition-colors duration-200 relative group"
                :class="[
                  $route.path === '/dashboard' 
                    ? 'menu-item-active bg-winschool-primary hover:bg-winschool-primary-dark' 
                    : 'menu-item-hover'
                ]"
                style="font-weight: 700 !important;"
                @click="closeSidebarOnMobile"
              >
                <Home class="h-5 w-5" :class="sidebarCollapsed ? '' : 'mr-3'" />
                <span v-if="!sidebarCollapsed" style="font-weight: 700 !important;">{{ language === 'de' ? 'Dashboard' : 'Dashboard' }}</span>
                <!-- Tooltip for collapsed state -->
                <div 
                  v-if="sidebarCollapsed" 
                  class="absolute left-full ml-2 px-3 py-2 bg-slate-800 dark:bg-slate-700 text-slate-50 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap"
                  style="border-radius: 0px; border: 1px solid #facc15;"
                >
                  {{ language === 'de' ? 'Dashboard' : 'Dashboard' }}
                </div>
              </router-link>
              <!-- Regular Menu Groups (excluding support) -->
              <template v-for="groupKey in regularMenuGroups" :key="groupKey">
                <div v-if="hasItemsForGroup(groupKey)" class="pt-2">
                  <div 
                    v-if="!sidebarCollapsed"
                    @click="toggleMenuGroup(groupKey)" 
                    class="group-header-hover mx-2 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-between cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    style="font-family: 'Inter', system-ui, sans-serif; font-size: 14px; line-height: 163%; font-weight: 700 !important; letter-spacing: 0%;"
                  >
                    <div class="flex items-center">
                      <component :is="groupDefinitions[groupKey].icon" class="h-4 w-4 mr-2" />
                      <span style="font-weight: 700 !important;">{{ groupDefinitions[groupKey].title }}</span>
                    </div>
                    <ChevronDown 
                      class="h-4 w-4 transition-transform" 
                      :class="{'transform rotate-180': menuGroups[groupKey]}"
                    />
                  </div>
                  <div v-if="!sidebarCollapsed" class="mt-1 space-y-1" v-show="menuGroups[groupKey]">
                    <router-link
                      v-for="item in getItemsForGroup(groupKey)"
                      :key="item.path"
                      :to="item.path"
                      class="flex items-center mx-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-200 transition-colors duration-200 ml-4"
                      :class="[
                        $route.path === item.path 
                          ? 'menu-item-active bg-winschool-primary hover:bg-winschool-primary-dark' 
                          : 'menu-item-hover'
                      ]"
                      @click="handleMenuItemClick(item)"
                    >
                      <component :is="item.icon" class="h-4 w-4 mr-3" />
                      {{ item.name }}
                    </router-link>
                  </div>
                  <!-- Collapsed state icons -->
                  <div v-if="sidebarCollapsed" class="space-y-1">
                    <router-link
                      v-for="item in getItemsForGroup(groupKey)"
                      :key="item.path"
                      :to="item.path"
                      class="flex items-center justify-center mx-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-200 transition-colors duration-200 relative group"
                      :class="[
                        $route.path === item.path 
                          ? 'menu-item-active bg-winschool-primary hover:bg-winschool-primary-dark' 
                          : 'menu-item-hover'
                      ]"
                      @click="closeSidebarOnMobile"
                    >
                      <component :is="item.icon" class="h-5 w-5" />
                      <!-- Tooltip for collapsed state -->
                      <div class="absolute left-full ml-2 px-3 py-2 bg-slate-800 dark:bg-slate-700 text-slate-50 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap"
                           style="border-radius: 0px; border: 1px solid #facc15;">
                        {{ item.name }}
                      </div>
                    </router-link>
                  </div>
                </div>
              </template>
            </div>
          </nav>

          <!-- Support Section at Bottom -->
          <div v-if="hasSupportItems" class="border-t border-gray-200 dark:border-slate-700 mt-auto">
            <div class="p-2">
              <!-- Support Group Header -->
              <div 
                v-if="!sidebarCollapsed"
                @click="toggleMenuGroup('support')" 
                class="group-header-hover mx-2 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-between cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                style="font-family: 'Inter', system-ui, sans-serif; font-size: 14px; line-height: 163%; font-weight: 700 !important; letter-spacing: 0%;"
              >
                <div class="flex items-center">
                  <LifeBuoy class="h-4 w-4 mr-2" />
                  <span style="font-weight: 700 !important;">{{ language === 'de' ? 'Support' : 'Support' }}</span>
                </div>
                <ChevronDown 
                  class="h-4 w-4 transition-transform" 
                  :class="{'transform rotate-180': menuGroups.support}"
                />
              </div>
              
              <!-- Support Items -->
              <div v-if="!sidebarCollapsed" class="mt-1 space-y-1" v-show="menuGroups.support">
                <router-link
                  v-for="item in supportItems"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center mx-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-200 transition-colors duration-200 ml-4"
                  :class="[
                    $route.path === item.path 
                      ? 'menu-item-active bg-winschool-primary hover:bg-winschool-primary-dark' 
                      : 'menu-item-hover'
                  ]"
                  @click="closeSidebarOnMobile"
                >
                  <component :is="item.icon" class="h-4 w-4 mr-3" />
                  {{ item.name }}
                </router-link>
              </div>
              
              <!-- Collapsed state for support -->
              <div v-if="sidebarCollapsed" class="space-y-1">
                <router-link
                  v-for="item in supportItems"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center justify-center mx-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-200 transition-colors duration-200 relative group"
                  :class="[
                    $route.path === item.path 
                      ? 'menu-item-active bg-winschool-primary hover:bg-winschool-primary-dark' 
                      : 'menu-item-hover'
                  ]"
                  @click="closeSidebarOnMobile"
                >
                  <component :is="item.icon" class="h-5 w-5" />
                  <!-- Tooltip for collapsed state -->
                  <div class="absolute left-full ml-2 px-3 py-2 bg-slate-800 dark:bg-slate-700 text-slate-50 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap"
                       style="border-radius: 0px; border: 1px solid #facc15;">
                    {{ item.name }}
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Overlay for mobile -->
      <div 
        v-if="sidebarOpen"
        @click="closeSidebar"
        class="fixed inset-0 z-10 bg-slate-600 bg-opacity-50 dark:bg-slate-900 dark:bg-opacity-60 lg:hidden"
      ></div>

      <!-- Main Content -->
      <main 
        :class="[
          'flex-1 overflow-y-auto transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        ]"
        class="bg-winschool-bg dark:bg-winschool-dark-bg min-h-screen"
      >
        <div :class="shouldApplyPadding ? 'p-4 sm:p-6 lg:p-8' : ''">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useBreadcrumbs } from '../composables/useBreadcrumbs'
import { GraduationCap, Menu, Bell, Globe, Sun, Moon, ChevronDown, User, LogOut, Settings, HelpCircle, Home, Users, BookOpen, DollarSign, Calendar, MessageSquare, FileText, BarChart3, Shield, Building, UserPlus, Target, Award, Layers, Brain, Zap, Link, Database, Upload, Clock, Search, Printer, Plus, UserCheck, Briefcase, Key, TrendingUp, Package, LifeBuoy, Download, DoorOpen } from 'lucide-vue-next'
import { RuneBreadcrumbs } from '@ist/commonui-components'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// Breadcrumbs
const { breadcrumbSegments } = useBreadcrumbs()

// Convert breadcrumb segments to RuneBreadcrumbs format
const breadcrumbItems = computed(() => {
  const items = [
    { label: 'Home', href: '/dashboard' }
  ]
  
  breadcrumbSegments.value.forEach(segment => {
    items.push({
      label: segment.label,
      href: segment.to || ''
    })
  })
  
  return items
})

const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)
const showUserMenu = ref(false)
const showLanguageDropdown = ref(false)

const user = computed(() => authStore.user)
const isDarkMode = computed(() => themeStore.isDarkMode)
const language = computed(() => themeStore.language)

// Menu group state - initialize all collapsed
const menuGroups = ref<Record<string, boolean>>({
  academic: false,
  administration: false,
  planning: false,
  communication: false,
  system: false,
  reports: false,
  applications: false,
  finance: false,
  budget: false,
  'library-simple': false,
  'library-management': false,
  'inventory-media': false,
  'budget-orders': false,
  advanced: false,
  support: false
})

// Toggle menu group
const toggleMenuGroup = (group: string) => {
  menuGroups.value[group] = !menuGroups.value[group]
}

// Toggle sidebar collapse
const toggleSidebarCollapse = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Define menu items by role - completely refactored for new role-based structure
const menuItems = computed(() => {
  const role = user.value?.role || 'student'
  
  // Helper function to create menu items
  const createMenuItem = (name: string, nameDe: string, path: string, icon: any, group: string) => ({
    name: language.value === 'de' ? nameDe : name,
    path,
    icon,
    group
  })

  const roleMenus = {
    student: [
      // Academic
      createMenuItem('Academic Profile', 'Akademisches Profil', '/dashboard/student-academic-profile', User, 'academic'),
      createMenuItem('Attendance', 'Anwesenheit', '/dashboard/attendance', Calendar, 'academic'),
      createMenuItem('My Timetable', 'Mein Stundenplan', '/dashboard/timetable', Calendar, 'academic'),
      createMenuItem('Grades & Reports', 'Noten & Berichte', '/dashboard/academics', FileText, 'academic'),
      
      // Communication
      createMenuItem('Messages', 'Nachrichten', '/dashboard/messages', MessageSquare, 'communication'),
      
      // Support
      createMenuItem('Settings', 'Einstellungen', '/dashboard/settings', Settings, 'support'),
      createMenuItem('Support', 'Support', '/dashboard/support', LifeBuoy, 'support'),
      createMenuItem('Help', 'Hilfe', '/dashboard/help', HelpCircle, 'support'),
      
      // Advanced Modules (Future/Mock)
      createMenuItem('Internship Portal', 'Praktikumsportal', '/dashboard/internship-portal', Briefcase, 'advanced')
    ],

    teacher: [
      // Academic
      createMenuItem('My Classes', 'Meine Klassen', '/dashboard/my-classes', Users, 'academic'),
      createMenuItem('Subject Assignment', 'Fachzuordnung', '/dashboard/subject-assignment', Layers, 'academic'),
      createMenuItem('Grade Entry', 'Notenerfassung', '/dashboard/grade-entry', FileText, 'academic'),
      createMenuItem('Attendance & Behavior', 'Anwesenheit & Verhalten', '/dashboard/attendance-behavior', Calendar, 'academic'),
      createMenuItem('Student Search', 'Schülersuche', '/dashboard/student-search', Search, 'academic'),
      
      // Planning
      createMenuItem('My Timetable', 'Mein Stundenplan', '/dashboard/timetable', Calendar, 'planning'),
      
      // Administration
      createMenuItem('Career Profile', 'Lehrerlaufbahn', '/dashboard/teacher-career', Award, 'administration'),
      
      // Reports
      createMenuItem('Print Templates', 'Druckvorlagen', '/dashboard/printing-templates', Printer, 'reports'),
      
      // Communication
      createMenuItem('Parent Meetings', 'Elterngespräche', '/dashboard/teacher-meetings', Calendar, 'communication'),
      createMenuItem('Messages', 'Nachrichten', '/dashboard/messages', MessageSquare, 'communication'),
      
      // Support
      createMenuItem('Support', 'Support', '/dashboard/support', LifeBuoy, 'support'),
      createMenuItem('Help', 'Hilfe', '/dashboard/help', HelpCircle, 'support'),
      
      // Mock Links
      createMenuItem('Resource Room Access', 'Ressourcen-Zugang', '/dashboard/resource-room', Key, 'advanced'),

      // Learning Areas Module
      createMenuItem('Learning Areas', 'Lernfelder', '/dashboard/learning-areas', Target, 'academic'),
      createMenuItem('Learning Field Assessments', 'Lernfeld-Bewertungen', '/dashboard/learning-field-assessments', FileText, 'academic'),
      createMenuItem('Timetable Learning Areas', 'Stundenplan Lernfelder', '/dashboard/timetable-learning-areas', Calendar, 'academic')
    ],

    parent: [
      // Academic
      createMenuItem('My Children', 'Meine Kinder', '/dashboard/students', Users, 'academic'),
      createMenuItem('Attendance & Behavior', 'Anwesenheit & Verhalten', '/dashboard/attendance', Calendar, 'academic'),
      createMenuItem('Grades & Attendance', 'Noten & Anwesenheit', '/dashboard/parent-academics', BookOpen, 'academic'),
      
      // Communication
      createMenuItem('Parent-Teacher Meetings', 'Elterngespräche', '/dashboard/parent-meetings', Calendar, 'communication'),
      createMenuItem('Messages', 'Nachrichten', '/dashboard/messages', MessageSquare, 'communication'),
      createMenuItem('Notifications', 'Benachrichtigungen', '/dashboard/notifications', Bell, 'communication'),
      
      // Applications
      createMenuItem('Applications (Admissions)', 'Anträge (Aufnahme)', '/dashboard/enrollment', UserPlus, 'applications'),
      
      // Support
      createMenuItem('Support', 'Support', '/dashboard/support', LifeBuoy, 'support'),
      createMenuItem('Help', 'Hilfe', '/dashboard/help', HelpCircle, 'support'),
      
      // Mock Links
      createMenuItem('Fee Statements', 'Gebührenabrechnungen', '/dashboard/fee-statements', DollarSign, 'finance')
    ],

    // New dedicated librarian role configuration
    librarian: [
      // Library Management - Full access for librarians only
      createMenuItem('Books Inventory', 'Bücher-Inventar', '/dashboard/library/books', BookOpen, 'library-management'),
      createMenuItem('Book Lending', 'Buchausleihe', '/dashboard/library/book-lending', Calendar, 'library-management'),
      createMenuItem('Library Module', 'Bibliotheksmodul', '/dashboard/library/library-module', BookOpen, 'library-management'),
      createMenuItem('Book Fees', 'Buchgebühren', '/dashboard/library/book-fees', DollarSign, 'library-management'),
      createMenuItem('Reservations', 'Reservierungen', '/dashboard/library/reservations', Clock, 'library-management'),
      createMenuItem('Course-Based Books', 'Kursbezogene Bücher', '/dashboard/library/course-books', BookOpen, 'library-management'),
      
      // Academic
      createMenuItem('Student Search', 'Schülersuche', '/dashboard/student-search', Search, 'academic'),
      
      // Communication
      createMenuItem('Messages', 'Nachrichten', '/dashboard/messages', MessageSquare, 'communication'),
      
      // Support
      createMenuItem('Support', 'Support', '/dashboard/support', LifeBuoy, 'support'),
      createMenuItem('Help', 'Hilfe', '/dashboard/help', HelpCircle, 'support')
    ],

    schooladmin: [
      // Academic Features
      createMenuItem('Student Search', 'Schülersuche', '/dashboard/student-search', Search, 'academic'),
      createMenuItem('Qualification Checks', 'Qualifikationsprüfungen', '/dashboard/qualification-checks', Target, 'academic'),
      createMenuItem('Repeat Year', 'Wiederholungsjahr', '/dashboard/repeat-year', Clock, 'academic'),
      createMenuItem('Special Achievements', 'Besondere Leistungen', '/dashboard/special-achievements', Award, 'academic'),
      createMenuItem('Learning Analytics', 'Lernanalytik', '/dashboard/learning-analytics', Brain, 'academic'),
      createMenuItem('Advanced Timetable', 'Erweiterter Stundenplan', '/dashboard/advanced-timetable', Calendar, 'academic'),
      createMenuItem('Bookings', 'Buchungen', '/dashboard/academic/bookings', Calendar, 'academic'),
      createMenuItem('Course Administration', 'Kursverwaltung', '/dashboard/academic/course-administration', Target, 'academic'),
      
      // Learning Areas Module
      createMenuItem('Learning Areas', 'Lernfelder', '/dashboard/learning-areas', Target, 'academic'),
      createMenuItem('Learning Field Assessments', 'Lernfeld-Bewertungen', '/dashboard/learning-field-assessments', FileText, 'academic'),
      createMenuItem('Timetable Learning Areas', 'Stundenplan Lernfelder', '/dashboard/timetable-learning-areas', Calendar, 'academic'),
      createMenuItem('Subject Allocation', 'Fachzuteilung', '/dashboard/subject-allocation-learning-areas', BookOpen, 'academic'),
      
      // Library - Simplified for school staff
      createMenuItem('My Library', 'Meine Bibliothek', '/dashboard/library/history', BookOpen, 'library-simple'),
      
      // Administration
      createMenuItem('Department Setup', 'Abteilungseinrichtung', '/dashboard/departments', Layers, 'administration'),
      createMenuItem('Classroom Setup', 'Klassenraumeinrichtung', '/dashboard/classroom-setup', DoorOpen, 'administration'),
      createMenuItem('School Semesters', 'Schulsemester', '/dashboard/school-semesters', Calendar, 'administration'),
      createMenuItem('Teacher Management', 'Lehrerverwaltung', '/dashboard/teacher-management', BookOpen, 'administration'),
      createMenuItem('Student Management', 'Schülerverwaltung', '/dashboard/student-management', Users, 'administration'),
      createMenuItem('User Management', 'Benutzerverwaltung', '/dashboard/user-management', Users, 'administration'),
      createMenuItem('Buildings & Rooms', 'Gebäude & Räume', '/dashboard/buildings-rooms', Building, 'administration'),
      createMenuItem('Company Management', 'Firmenverwaltung', '/dashboard/company-management', Briefcase, 'administration'),
      createMenuItem('Attendance & Behavior', 'Anwesenheit & Verhalten', '/dashboard/attendance-behavior', Calendar, 'administration'),
      
      // Planning
      createMenuItem('Advanced Planning', 'Erweiterte Planung', '/dashboard/advanced-planning', Calendar, 'planning'),
      createMenuItem('Resource Optimization', 'Ressourcenoptimierung', '/dashboard/resource-optimization', TrendingUp, 'planning'),
      createMenuItem('Course Addition', 'Kurserweiterung', '/dashboard/course-addition', Plus, 'planning'),
      
      // System
      createMenuItem('Data Management', 'Datenverwaltung', '/dashboard/data-management', Database, 'system'),
      createMenuItem('XSchool Features', 'XSchool-Funktionen', '/dashboard/xschool-features', Zap, 'system'),
      createMenuItem('System Administration', 'Systemverwaltung', '/dashboard/system-administration', Settings, 'system'),
      createMenuItem('Budget Management', 'Budget-Management', '/dashboard/budget-management', DollarSign, 'system'),
      
      // Statistics and Analytics (Learning Areas Module)
      createMenuItem('Statistics', 'Statistiken', '/dashboard/statistics', BarChart3, 'system'),
      
      // Inventory & Media - Budget Subcategory
      createMenuItem('Inventory Management', 'Bestandsverwaltung', '/dashboard/budget-management/inventory', Package, 'inventory-media'),
      createMenuItem('Media Management', 'Medienverwaltung', '/dashboard/budget-management/media', Upload, 'inventory-media'),
      createMenuItem('Inventory Settings', 'Bestandseinstellungen', '/dashboard/budget-management/settings', Settings, 'inventory-media'),
      
      // Budget & Orders - Budget Subcategory
      createMenuItem('Budget Resources', 'Budget-Ressourcen', '/dashboard/budget-management/resources', TrendingUp, 'budget-orders'),
      createMenuItem('Orders Management', 'Bestellverwaltung', '/dashboard/budget-management/orders', Package, 'budget-orders'),
      
      // Reports
      createMenuItem('Report Templates', 'Berichtsvorlagen', '/dashboard/printing-templates', Printer, 'reports'),
      
      // Support
      createMenuItem('Support', 'Support', '/dashboard/support', LifeBuoy, 'support'),
      createMenuItem('Help', 'Hilfe', '/dashboard/help', HelpCircle, 'support'),
      
      // Mock Links
      createMenuItem('Advanced Modules', 'Erweiterte Module', '/dashboard/advanced-modules', Settings, 'administration')
    ],

    principal: [
      // Academic
      createMenuItem('Teachers & Classes Overview', 'Lehrer & Klassen Übersicht', '/dashboard/teachers', BookOpen, 'academic'),
      createMenuItem('Student Search', 'Schülersuche', '/dashboard/student-search', Search, 'academic'),
      createMenuItem('Bookings', 'Buchungen', '/dashboard/academic/bookings', Calendar, 'academic'),
      createMenuItem('Course Administration', 'Kursverwaltung', '/dashboard/academic/course-administration', Target, 'academic'),
      
      // Learning Areas Module
      createMenuItem('Learning Areas', 'Lernfelder', '/dashboard/learning-areas', Target, 'academic'),
      createMenuItem('Learning Field Assessments', 'Lernfeld-Bewertungen', '/dashboard/learning-field-assessments', FileText, 'academic'),
      createMenuItem('Timetable Learning Areas', 'Stundenplan Lernfelder', '/dashboard/timetable-learning-areas', Calendar, 'academic'),
      createMenuItem('Subject Allocation', 'Fachzuteilung', '/dashboard/subject-allocation-learning-areas', BookOpen, 'academic'),
      
      // Library - Simplified for principals
      createMenuItem('My Library', 'Meine Bibliothek', '/dashboard/library/history', BookOpen, 'library-simple'),
      
      // Administration
      createMenuItem('Reports (Academic & Financial)', 'Berichte (Akademisch & Finanziell)', '/dashboard/reports', BarChart3, 'administration'),
      createMenuItem('Budget Management', 'Budget-Management', '/dashboard/budget-management', DollarSign, 'administration'),
      
      // Budget & Orders - Budget Subcategory (Principal Access)
      createMenuItem('Budget Resources', 'Budget-Ressourcen', '/dashboard/budget-management/resources', TrendingUp, 'budget-orders'),
      createMenuItem('Inventory Management', 'Bestandsverwaltung', '/dashboard/budget-management/inventory', Package, 'inventory-media'),
      createMenuItem('Orders Management', 'Bestellverwaltung', '/dashboard/budget-management/orders', Package, 'budget-orders'),
      
      // Communication
      createMenuItem('Communication Center', 'Kommunikationszentrum', '/dashboard/messages', MessageSquare, 'communication'),
      
      // Support
      createMenuItem('Support', 'Support', '/dashboard/support', LifeBuoy, 'support'),
      createMenuItem('Help', 'Hilfe', '/dashboard/help', HelpCircle, 'support'),
      
      // Mock Links
      createMenuItem('Inspectors\' Logs', 'Inspektoren-Protokolle', '/dashboard/inspector-logs', Shield, 'administration'),
      createMenuItem('Principal Notes', 'Schulleiternotizen', '/dashboard/principal-notes', FileText, 'administration'),
      createMenuItem('Performance Trends', 'Leistungstrends', '/dashboard/performance-trends', TrendingUp, 'administration')
    ],

    inspector: [
      // Academic
      createMenuItem('Schools Overview', 'Schulübersicht', '/dashboard/schools', Building, 'academic'),
      createMenuItem('Visit Reports', 'Besuchsberichte', '/dashboard/visit-reports', FileText, 'academic'),
      
      // Administration
      createMenuItem('Inspector Logs', 'Inspektoren-Protokolle', '/dashboard/inspector-logs', Shield, 'administration'),
      
      // Communication
      createMenuItem('Messages', 'Nachrichten', '/dashboard/messages', MessageSquare, 'communication'),
      
      // Support
      createMenuItem('Support', 'Support', '/dashboard/support', LifeBuoy, 'support'),
      createMenuItem('Help', 'Hilfe', '/dashboard/help', HelpCircle, 'support'),
      
      // Mock Links
      createMenuItem('Inspection Schedule', 'Inspektionsplan', '/dashboard/inspection-schedule', Calendar, 'planning')
    ],

    superadmin: [
      // Administration
      createMenuItem('All Schools Management', 'Alle Schulen Verwaltung', '/dashboard/schools', Building, 'administration'),
      createMenuItem('User Management', 'Benutzerverwaltung', '/dashboard/user-management', Users, 'administration'),
      createMenuItem('Role Permissions', 'Rollenberechtigung', '/dashboard/role-permissions', Shield, 'administration'),
      
      // System
      createMenuItem('System Configurations', 'Systemkonfigurationen', '/dashboard/system-config', Settings, 'system'),
      createMenuItem('System Updates', 'System-Updates', '/dashboard/updates', Download, 'system'),
      createMenuItem('System Integration', 'System-Integration', '/dashboard/system-integration', Link, 'system'),
      createMenuItem('XSchool Features', 'XSchool-Funktionen', '/dashboard/xschool-features', Zap, 'system'),
      createMenuItem('Document Management', 'Dokumentenverwaltung', '/dashboard/document-management', FileText, 'system'),
      
      // Reports
      createMenuItem('Report Templates', 'Berichtsvorlagen', '/dashboard/printing-templates', Printer, 'reports'),
      
      // Support
      createMenuItem('Support Tickets', 'Support-Tickets', '/dashboard/support', LifeBuoy, 'support'),
      createMenuItem('Help Center', 'Hilfe-Center', '/dashboard/help', HelpCircle, 'support')
    ],

    // Treat admin same as superadmin
    admin: [
      // Academic Features (Learning Areas Module)
      createMenuItem('Learning Areas', 'Lernfelder', '/dashboard/learning-areas', Target, 'academic'),
      createMenuItem('Learning Field Assessments', 'Lernfeld-Bewertungen', '/dashboard/learning-field-assessments', FileText, 'academic'),
      createMenuItem('Timetable Learning Areas', 'Stundenplan Lernfelder', '/dashboard/timetable-learning-areas', Calendar, 'academic'),
      createMenuItem('Subject Allocation', 'Fachzuteilung', '/dashboard/subject-allocation-learning-areas', BookOpen, 'academic'),
      
      // Administration
      createMenuItem('All Schools Management', 'Alle Schulen Verwaltung', '/dashboard/schools', Building, 'administration'),
      createMenuItem('User Management', 'Benutzerverwaltung', '/dashboard/user-management', Users, 'administration'),
      createMenuItem('Role Permissions', 'Rollenberechtigung', '/dashboard/role-permissions', Shield, 'administration'),
      
      // User Management Features (Learning Areas Module)
      createMenuItem('Teacher Authorization', 'Lehrer-Autorisierung', '/dashboard/teacher-authorization', UserCheck, 'administration'),
      createMenuItem('User Access Rights', 'Benutzer-Zugriffsrechte', '/dashboard/user-access-rights', Shield, 'administration'),
      
      // System
      createMenuItem('System Configurations', 'Systemkonfigurationen', '/dashboard/system-config', Settings, 'system'),
      createMenuItem('System Updates', 'System-Updates', '/dashboard/updates', Download, 'system'),
      createMenuItem('System Integration', 'System-Integration', '/dashboard/system-integration', Link, 'system'),
      createMenuItem('XSchool Features', 'XSchool-Funktionen', '/dashboard/xschool-features', Zap, 'system'),
      createMenuItem('Document Management', 'Dokumentenverwaltung', '/dashboard/document-management', FileText, 'system'),
      
      // Budget Management - Full Access
      createMenuItem('Budget Management', 'Budget-Management', '/dashboard/budget-management', DollarSign, 'system'),
      
      // Inventory & Media - Budget Subcategory
      createMenuItem('Inventory Management', 'Bestandsverwaltung', '/dashboard/budget-management/inventory', Package, 'inventory-media'),
      createMenuItem('Media Management', 'Medienverwaltung', '/dashboard/budget-management/media', Upload, 'inventory-media'),
      createMenuItem('Inventory Settings', 'Bestandseinstellungen', '/dashboard/budget-management/settings', Settings, 'inventory-media'),
      
      // Budget & Orders - Budget Subcategory
      createMenuItem('Budget Resources', 'Budget-Ressourcen', '/dashboard/budget-management/resources', TrendingUp, 'budget-orders'),
      createMenuItem('Orders Management', 'Bestellverwaltung', '/dashboard/budget-management/orders', Package, 'budget-orders'),
      
      // Reports
      createMenuItem('Report Templates', 'Berichtsvorlagen', '/dashboard/printing-templates', Printer, 'reports'),
      
      // Support
      createMenuItem('Support', 'Support', '/dashboard/support', LifeBuoy, 'support'),
      createMenuItem('Help', 'Hilfe', '/dashboard/help', HelpCircle, 'support'),
      
      // Statistics and Analytics (Learning Areas Module)
      createMenuItem('Statistics', 'Statistiken', '/dashboard/statistics', BarChart3, 'system')
    ],

    schoolstaff: [
      // Academic
      createMenuItem('Student Search', 'Schülersuche', '/dashboard/student-search', Search, 'academic'),
      createMenuItem('Bookings', 'Buchungen', '/dashboard/academic/bookings', Calendar, 'academic'),
      
      // Library - Simplified for school staff
      createMenuItem('My Library', 'Meine Bibliothek', '/dashboard/library/history', BookOpen, 'library-simple'),
      
      // Administration
      createMenuItem('GDPR', 'DSGVO', '/dashboard/gdpr', Shield, 'administration'),
      createMenuItem('Finance Tools', 'Finanz-Tools', '/dashboard/finances', DollarSign, 'administration'),
      createMenuItem('Attendance Tracking', 'Anwesenheitsverfolgung', '/dashboard/attendance-behavior', Calendar, 'administration'),
      
      // Support
      createMenuItem('Support', 'Support', '/dashboard/support', LifeBuoy, 'support'),
      createMenuItem('Help', 'Hilfe', '/dashboard/help', HelpCircle, 'support')
    ]
  }

  return roleMenus[role as keyof typeof roleMenus] || []
})

// Group items by category with proper icons
const groupDefinitions = computed<Record<string, { title: string; icon: any }>>(() => ({
  academic: {
    title: language.value === 'de' ? 'Akademisch' : 'Academic',
    icon: BookOpen
  },
  administration: {
    title: language.value === 'de' ? 'Verwaltung' : 'Administration', 
    icon: Settings
  },
  planning: {
    title: language.value === 'de' ? 'Planung' : 'Planning',
    icon: Calendar
  },
  communication: {
    title: language.value === 'de' ? 'Kommunikation' : 'Communication',
    icon: MessageSquare
  },
  system: {
    title: language.value === 'de' ? 'System' : 'System',
    icon: Database
  },
  reports: {
    title: language.value === 'de' ? 'Berichte' : 'Reports',
    icon: BarChart3
  },
  applications: {
    title: language.value === 'de' ? 'Anträge' : 'Applications',
    icon: FileText
  },
  finance: {
    title: language.value === 'de' ? 'Finanzen' : 'Finance',
    icon: DollarSign
  },
  budget: {
    title: language.value === 'de' ? 'Budget-Management' : 'Budget Management',
    icon: DollarSign
  },
  'library-simple': {
    title: language.value === 'de' ? 'Bibliothek' : 'Library',
    icon: BookOpen
  },
  'library-management': {
    title: language.value === 'de' ? 'Bibliotheksverwaltung' : 'Library Management',
    icon: BookOpen
  },
  'inventory-media': {
    title: language.value === 'de' ? 'Bestand & Medien' : 'Inventory & Media',
    icon: Package
  },
  'budget-orders': {
    title: language.value === 'de' ? 'Budget & Bestellungen' : 'Budget & Orders',
    icon: DollarSign
  },
  advanced: {
    title: language.value === 'de' ? 'Erweitert' : 'Advanced',
    icon: Zap
  },
  support: {
    title: language.value === 'de' ? 'Support' : 'Support',
    icon: LifeBuoy
  }
}))

// Regular menu groups (excluding support which goes to bottom)
const regularMenuGroups = computed(() => [
  'academic', 'administration', 'planning', 'communication', 
  'system', 'reports', 'applications', 'finance', 'budget', 
  'library-simple', 'library-management', 'inventory-media', 'budget-orders', 'advanced'
])

// Group items by category
const academicItems = computed(() => menuItems.value.filter(item => item.group === 'academic'))
const administrationItems = computed(() => menuItems.value.filter(item => item.group === 'administration'))
const planningItems = computed(() => menuItems.value.filter(item => item.group === 'planning'))
const communicationItems = computed(() => menuItems.value.filter(item => item.group === 'communication'))
const systemItems = computed(() => menuItems.value.filter(item => item.group === 'system'))
const reportsItems = computed(() => menuItems.value.filter(item => item.group === 'reports'))
const applicationsItems = computed(() => menuItems.value.filter(item => item.group === 'applications'))
const financeItems = computed(() => menuItems.value.filter(item => item.group === 'finance'))
const budgetItems = computed(() => menuItems.value.filter(item => item.group === 'budget'))
const librarySimpleItems = computed(() => menuItems.value.filter(item => item.group === 'library-simple'))
const libraryManagementItems = computed(() => menuItems.value.filter(item => item.group === 'library-management'))
const inventoryMediaItems = computed(() => menuItems.value.filter(item => item.group === 'inventory-media'))
const budgetOrdersItems = computed(() => menuItems.value.filter(item => item.group === 'budget-orders'))
const advancedItems = computed(() => menuItems.value.filter(item => item.group === 'advanced'))
const supportItems = computed(() => menuItems.value.filter(item => item.group === 'support'))

// Helper methods for dynamic group handling
const getItemsForGroup = (groupKey: string) => {
  const groupMap = {
    academic: academicItems.value,
    administration: administrationItems.value,
    planning: planningItems.value,
    communication: communicationItems.value,
    system: systemItems.value,
    reports: reportsItems.value,
    applications: applicationsItems.value,
    finance: financeItems.value,
    budget: budgetItems.value,
    'library-simple': librarySimpleItems.value,
    'library-management': libraryManagementItems.value,
    'inventory-media': inventoryMediaItems.value,
    'budget-orders': budgetOrdersItems.value,
    advanced: advancedItems.value,
    support: supportItems.value
  }
  return groupMap[groupKey as keyof typeof groupMap] || []
}

const hasItemsForGroup = (groupKey: string) => {
  return getItemsForGroup(groupKey).length > 0
}

// Check if support group has items
const hasSupportItems = computed(() => supportItems.value.length > 0)

const getRoleDisplayName = (role?: string) => {
  const roleNames = {
    en: {
      superadmin: 'Super Administrator',
      schooladmin: 'School Administrator',
      student: 'Student',
      parent: 'Parent/Guardian',
      teacher: 'Teacher',
      admin: 'Administrator',
      principal: 'Principal',
      inspector: 'Educational Inspector',
      schoolstaff: 'School Staff'
    },
    de: {
      superadmin: 'Super-Administrator',
      schooladmin: 'Schuladministrator',
      student: 'Schüler',
      parent: 'Eltern/Erziehungsberechtigte',
      teacher: 'Lehrer',
      admin: 'Administrator',
      principal: 'Schulleiter',
      inspector: 'Bildungsinspektor',
      schoolstaff: 'Schulpersonal'
    }
  }
  
  return roleNames[language.value][role as keyof typeof roleNames.en] || role
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
  showUserMenu.value = false
  showLanguageDropdown.value = false
}

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) {
    closeSidebar()
  }
}

const handleMenuItemClick = (item: any) => {
  console.log('Menu item clicked:', item.name, item.path)
  console.log('Current user role:', user.value?.role)
  console.log('Target path:', item.path)
  
  // Close sidebar on mobile
  closeSidebarOnMobile()
  
  try {
    // Force navigation
    router.push(item.path)
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

const setLanguage = (lang: 'en' | 'de') => {
  themeStore.setLanguage(lang)
  showLanguageDropdown.value = false
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const shouldApplyPadding = computed(() => {
  const routes = [
    '/dashboard/notifications', 
    '/dashboard/fee-statements', 
    '/dashboard/messages',
    '/dashboard/students',
    '/dashboard/parent-academics',
    '/dashboard/parent-meetings'
  ]
  return !routes.includes(route.path)
})

// Watch for user role changes and expand relevant menu groups
watch(user, (newUser) => {
  if (newUser?.role === 'librarian') {
    menuGroups.value['library-management'] = true
  }
}, { immediate: true })

onMounted(() => {
  authStore.initializeAuth()
  // Auto-expand relevant menu groups for specific roles
  if (user.value?.role === 'librarian') {
    menuGroups.value['library-management'] = true
  }
})
</script>