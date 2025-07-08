import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/apply',
      name: 'Apply',
      component: () => import('../views/ApplicationFormView.vue')
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/DashboardView.vue')
        },
        // Super Admin Routes
        {
          path: 'schools',
          name: 'Schools',
          component: () => import('../views/SchoolsView.vue'),
          meta: { roles: ['superadmin'] }
        },
        {
          path: 'inspectors',
          name: 'Inspectors',
          component: () => import('../views/InspectorsView.vue'),
          meta: { roles: ['superadmin'] }
        },
        {
          path: 'users',
          name: 'Users',
          component: () => import('../views/UsersView.vue'),
          meta: { roles: ['superadmin', 'schooladmin'] }
        },
        {
          path: 'system-config',
          name: 'SystemConfig',
          component: () => import('../views/SystemConfigView.vue'),
          meta: { roles: ['superadmin'] }
        },
        {
          path: 'support',
          name: 'Support',
          component: () => import('../views/SupportView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal', 'teacher', 'schoolstaff', 'student', 'parent', 'inspector'] }
        },
        {
          path: 'updates',
          name: 'Updates',
          component: () => import('../views/UpdatesView.vue'),
          meta: { roles: ['superadmin'] }
        },
        {
          path: 'system-integration',
          name: 'SystemIntegration',
          component: () => import('../views/SystemIntegrationView.vue'),
          meta: { roles: ['superadmin'] }
        },
        {
          path: 'data-management',
          name: 'DataManagement',
          component: () => import('../views/DataManagementView.vue'),
          meta: { roles: ['superadmin', 'schooladmin', 'admin'] }
        },
        {
          path: 'xschool-features',
          name: 'XSchoolFeatures',
          component: () => import('../views/XSchoolFeaturesView.vue'),
          meta: { roles: ['superadmin', 'schooladmin', 'admin'] }
        },
        {
          path: 'system-administration',
          name: 'SystemAdministration',
          component: () => import('../views/SystemAdministrationView.vue'),
          meta: { roles: ['superadmin', 'schooladmin', 'admin'] }
        },
        
        // School Admin Routes
        {
          path: 'school-semesters',
          name: 'SchoolSemesters',
          component: () => import('../views/SchoolSemestersView.vue'),
          meta: { roles: ['schooladmin'] }
        },
        {
          path: 'departments',
          name: 'Departments',
          component: () => import('../views/DepartmentsView.vue'),
          meta: { roles: ['schooladmin'] }
        },
        {
          path: 'user-management',
          name: 'UserManagement',
          component: () => import('../views/UserManagementView.vue'),
          meta: { roles: ['schooladmin'] }
        },
        {
          path: 'teacher-management',
          name: 'TeacherManagement',
          component: () => import('../views/TeacherManagementView.vue'),
          meta: { roles: ['schooladmin'] }
        },
        {
          path: 'teacher-profile/:id',
          name: 'TeacherProfile',
          component: () => import('../views/TeacherProfileView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal'] }
        },
        {
          path: 'buildings-rooms',
          name: 'BuildingsRooms',
          component: () => import('../views/BuildingsRoomsView.vue'),
          meta: { roles: ['schooladmin'] }
        },
        {
          path: 'classroom-setup',
          name: 'ClassroomSetup',
          component: () => import('../views/ClassroomSetupView.vue'),
          meta: { roles: ['schooladmin'] }
        },
        {
          path: 'company-management',
          name: 'CompanyManagement',
          component: () => import('../views/CompanyManagementView.vue'),
          meta: { roles: ['schooladmin'] }
        },
        {
          path: 'student-management',
          name: 'StudentManagement',
          component: () => import('../views/StudentManagementView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal'] }
        },
        {
          path: 'student-profile/:id',
          name: 'StudentProfile',
          component: () => import('../views/StudentProfileView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal', 'teacher', 'parent'] }
        },
        {
          path: 'student-search',
          name: 'StudentSearch',
          component: () => import('../views/StudentSearchView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal', 'teacher'] }
        },
        {
          path: 'attendance-behavior',
          name: 'AttendanceBehavior',
          component: () => import('../views/AttendanceBehaviorView.vue'),
          meta: { roles: ['schooladmin', 'teacher'] }
        },
        
        // Existing Routes
        {
          path: 'students',
          name: 'Students',
          component: () => import('../views/StudentsView.vue')
        },
        {
          path: 'academics',
          name: 'Academics',
          component: () => import('../views/AcademicsView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal', 'teacher'] }
        },
        {
          path: 'parent-academics',
          name: 'ParentAcademics',
          component: () => import('../views/ParentAcademicsView.vue'),
          meta: { roles: ['parent'] }
        },
        {
          path: 'parent-meetings',
          name: 'ParentMeetings',
          component: () => import('../views/ParentTeacherMeetingsView.vue'),
          meta: { roles: ['parent'] }
        },
        {
          path: 'fee-statements',
          name: 'FeeStatements',
          component: () => import('../views/FeeStatementsView.vue'),
          meta: { roles: ['parent'] }
        },
        {
          path: 'teacher-meetings',
          name: 'TeacherMeetings',
          component: () => import('../views/TeacherMeetingsView.vue'),
          meta: { roles: ['teacher'] }
        },
        {
          path: 'finances',
          name: 'Finances',
          component: () => import('../views/FinancesView.vue')
        },
        {
          path: 'timetable',
          name: 'Timetable',
          component: () => import('../views/TimetableView.vue')
        },
        {
          path: 'messages',
          name: 'Messages',
          component: () => import('../views/MessagesView.vue')
        },
        {
          path: 'notifications',
          name: 'Notifications',
          component: () => import('../views/NotificationsView.vue')
        },
        {
          path: 'reports',
          name: 'Reports',
          component: () => import('../views/ReportsView.vue')
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('../views/ProfileView.vue')
        },
        {
          path: 'student-academic-profile',
          name: 'StudentAcademicProfile',
          component: () => import('../views/StudentAcademicProfileView.vue'),
          meta: { roles: ['student'] }
        },
        {
          path: 'attendance',
          name: 'Attendance',
          component: () => import('../views/AttendanceView.vue'),
          meta: { roles: ['student', 'parent'] }
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('../views/SettingsView.vue')
        },
        {
          path: 'help',
          name: 'Help',
          component: () => import('../views/HelpView.vue')
        },
        {
          path: 'enrollment',
          name: 'Enrollment',
          component: () => import('../views/EnrollmentView.vue')
        },
        {
          path: 'enrollment/configure-form',
          name: 'EnrollmentFormConfig',
          component: () => import('../views/EnrollmentFormConfigView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin'] }
        },
        {
          path: 'my-classes',
          name: 'MyClasses',
          component: () => import('../views/MyClassesView.vue')
        },
        {
          path: 'class-detail/:id',
          name: 'ClassDetail',
          component: () => import('../views/ClassDetailView.vue'),
          meta: { roles: ['teacher', 'admin', 'principal'] }
        },
        {
          path: 'analytics',
          name: 'Analytics',
          component: () => import('../views/ReportsView.vue')
        },
        {
          path: 'institutions',
          name: 'Institutions',
          component: () => import('../views/StudentsView.vue')
        },
        {
          path: 'compliance',
          name: 'Compliance',
          component: () => import('../views/ReportsView.vue')
        },
        // Advanced Academic Features
        {
          path: 'subject-assignment',
          name: 'SubjectAssignment',
          component: () => import('../views/SubjectCourseAssignmentView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal', 'teacher'] }
        },
        {
          path: 'grade-entry',
          name: 'GradeEntry',
          component: () => import('../views/GradeEntryView.vue'),
          meta: { roles: ['schooladmin', 'teacher', 'admin', 'principal'] }
        },
        {
          path: 'qualification-checks',
          name: 'QualificationChecks',
          component: () => import('../views/QualificationChecksView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal', 'teacher'] }
        },
        {
          path: 'repeat-year',
          name: 'RepeatYear',
          component: () => import('../views/RepeatYearManagementView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal'] }
        },
        {
          path: 'special-achievements',
          name: 'SpecialAchievements',
          component: () => import('../views/SpecialAchievementView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal', 'teacher'] }
        },
        {
          path: 'course-addition',
          name: 'CourseAddition',
          component: () => import('../views/CourseAdditionView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal'] }
        },
        {
          path: 'resource-optimization',
          name: 'ResourceOptimization',
          component: () => import('../views/ResourceOptimizationView.vue'),
          meta: { roles: ['schooladmin', 'admin'] }
        },
        {
          path: 'advanced-planning',
          name: 'AdvancedPlanning',
          component: () => import('../views/AdvancedPlanningView.vue'),
          meta: { roles: ['schooladmin', 'admin'] }
        },
        {
          path: 'advanced-timetable',
          name: 'AdvancedTimetable',
          component: () => import('../views/AdvancedTimetableView.vue'),
          meta: { roles: ['schooladmin', 'admin'] }
        },
        {
          path: 'learning-analytics',
          name: 'LearningAnalytics',
          component: () => import('../views/LearningAnalyticsView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal', 'teacher'] }
        },
        // Additional Advanced Academic Features
        {
          path: 'elective-courses',
          name: 'ElectiveCourses',
          component: () => import('../views/ElectiveCoursesView.vue')
        },
        {
          path: 'report-card-templates',
          name: 'ReportCardTemplates',
          component: () => import('../views/ReportCardTemplatesView.vue')
        },
        {
          path: 'teacher-career',
          name: 'TeacherCareer',
          component: () => import('../views/TeacherCareerView.vue')
        },
        {
          path: 'curriculum-mapping',
          name: 'CurriculumMapping',
          component: () => import('../views/CurriculumMappingView.vue')
        },
        {
          path: 'student-portfolio',
          name: 'StudentPortfolio',
          component: () => import('../views/StudentPortfolioView.vue')
        },
        // Learning Areas Module
        {
          path: 'learning-areas',
          name: 'LearningAreas',
          component: () => import('../views/LearningAreasView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal', 'teacher'] }
        },
        {
          path: 'learning-field-assessments',
          name: 'LearningFieldAssessments',
          component: () => import('../views/LearningFieldAssessmentsView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal', 'teacher'] }
        },
        {
          path: 'statistics',
          name: 'Statistics',
          component: () => import('../views/StatisticsView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal'] }
        },
        {
          path: 'teacher-authorization',
          name: 'TeacherAuthorization',
          component: () => import('../views/TeacherAuthorizationView.vue'),
          meta: { roles: ['schooladmin', 'admin'] }
        },
        {
          path: 'user-access-rights',
          name: 'UserAccessRights',
          component: () => import('../views/UserAccessRightsView.vue'),
          meta: { roles: ['schooladmin', 'admin'] }
        },
        {
          path: 'timetable-learning-areas',
          name: 'TimetableLearningAreas',
          component: () => import('../views/TimetableLearningAreasView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal', 'teacher'] }
        },
        {
          path: 'subject-allocation-learning-areas',
          name: 'SubjectAllocationLearningAreas',
          component: () => import('../views/SubjectAllocationLearningAreasView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal'] }
        },
        // Additional Advanced Planning & Scheduling
        {
          path: 'advanced-analytics',
          name: 'AdvancedAnalytics',
          component: () => import('../views/AdvancedAnalyticsView.vue')
        },
        {
          path: 'mobile-planning',
          name: 'MobilePlanning',
          component: () => import('../views/MobilePlanningView.vue')
        },
        // Document Management
        {
          path: 'document-management',
          name: 'DocumentManagement',
          component: () => import('../views/DocumentManagementView.vue')
        },
        // Advanced System Features
        {
          path: 'advanced-system',
          name: 'AdvancedSystem',
          component: () => import('../views/AdvancedSystemView.vue')
        },
        // Budget Management Extensions
        {
          path: 'budget-management',
          name: 'BudgetManagement',
          component: () => import('../views/BudgetManagementView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin', 'principal', 'schoolstaff'] }
        },
        {
          path: 'budget-management/inventory',
          name: 'InventoryManagement',
          component: () => import('../views/budget/InventoryManagementView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin', 'schoolstaff'] }
        },
        {
          path: 'budget-management/media',
          name: 'MediaManagement',
          component: () => import('../views/budget/MediaManagementView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin', 'schoolstaff'] }
        },
        {
          path: 'budget-management/books',
          name: 'BooksManagement',
          component: () => import('../views/budget/BooksManagementView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin', 'schoolstaff'] }
        },
        {
          path: 'budget-management/book-lending',
          name: 'BookLending',
          component: () => import('../views/budget/BookLendingView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin', 'schoolstaff'] }
        },
        {
          path: 'budget-management/library',
          name: 'LibraryModule',
          component: () => import('../views/budget/LibraryView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin', 'schoolstaff'] }
        },
        {
          path: 'budget-management/book-fees',
          name: 'BookFees',
          component: () => import('../views/budget/BookFeesView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin'] }
        },
        {
          path: 'budget-management/course-books',
          name: 'CourseBasedBookLending',
          component: () => import('../views/budget/CourseBasedLendingView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin'] }
        },
        {
          path: 'budget-management/settings',
          name: 'InventorySettings',
          component: () => import('../views/budget/InventorySettingsView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin'] }
        },
        {
          path: 'budget-management/resources',
          name: 'BudgetResourceManagement',
          component: () => import('../views/budget/BudgetResourceView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin', 'principal'] }
        },
        {
          path: 'budget-management/orders',
          name: 'OrdersManagement',
          component: () => import('../views/budget/OrdersManagementView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin'] }
        },
        {
          path: 'budget-management/course-admin',
          name: 'CourseAdministration',
          component: () => import('../views/budget/CourseAdministrationView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin'] }
        },
        // Academic Features - Moved from budget management
        {
          path: 'academic/bookings',
          name: 'Bookings',
          component: () => import('../views/budget/BookingsView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin', 'schoolstaff'] }
        },
        {
          path: 'academic/course-administration',
          name: 'CourseAdministration',
          component: () => import('../views/budget/CourseAdministrationView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'superadmin'] }
        },
        // GDPR Management
        {
          path: 'gdpr',
          name: 'GDPR',
          component: () => import('../views/GDPRView.vue'),
          meta: { roles: ['schoolstaff', 'schooladmin', 'admin', 'superadmin', 'principal'] }
        },
        // Printing Templates
        {
          path: 'printing-templates',
          name: 'PrintingTemplates',
          component: () => import('../views/PrintingTemplatesView.vue')
        },
        {
          path: 'advanced-print-logic',
          name: 'AdvancedPrintLogic',
          component: () => import('../views/AdvancedPrintLogicView.vue'),
          meta: { roles: ['superadmin', 'schooladmin', 'admin'] },
        },
        {
          path: 'advanced-print-logic/logic-rules',
          name: 'LogicRules',
          component: () => import('../views/LogicRulesView.vue'),
          meta: { roles: ['superadmin', 'schooladmin', 'admin'] },
        },
        {
          path: 'advanced-print-logic/placeholder-manager',
          name: 'PlaceholderManager',
          component: () => import('../views/PlaceholderManagerView.vue'),
          meta: { roles: ['superadmin', 'schooladmin', 'admin'] },
        },
        {
          path: 'advanced-print-logic/text-block-control',
          name: 'TextBlockControl',
          component: () => import('../views/TextBlockControlView.vue'),
          meta: { roles: ['superadmin', 'schooladmin', 'admin'] },
        },
        {
          path: 'advanced-print-logic/print-conditions',
          name: 'PrintConditions',
          component: () => import('../views/PrintConditionsView.vue'),
          meta: { roles: ['superadmin', 'schooladmin', 'admin'] },
        },
        {
          path: 'subject-course-assignment',
          name: 'SubjectCourseAssignment',
          component: () => import('../views/SubjectCourseAssignmentView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal'] }
        },
        // Additional Advanced Planning Features
        {
          path: 'plan-frame-editor',
          name: 'PlanFrameEditor',
          component: () => import('../views/PlanFrameEditorView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal'] }
        },
        {
          path: 'course-editor',
          name: 'CourseEditor',
          component: () => import('../views/CourseEditorView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal'] }
        },
        {
          path: 'student-course-assignment',
          name: 'StudentCourseAssignment',
          component: () => import('../views/StudentCourseAssignmentView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal'] }
        },
        {
          path: 'hourly-monitor',
          name: 'HourlyMonitor',
          component: () => import('../views/HourlyMonitorView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal'] }
        },
        {
          path: 'conflict-resolution',
          name: 'ConflictResolution',
          component: () => import('../views/ConflictResolutionView.vue'),
          meta: { roles: ['schooladmin', 'admin', 'principal'] }
        },
        // Library Routes
        {
          path: 'library',
          children: [
            // Administrative routes (librarians only)
            {
              path: 'books',
              name: 'library-books',
              component: () => import('../views/library/BooksView.vue'),
              meta: {
                roles: ['librarian']
              }
            },
            {
              path: 'book-lending',
              name: 'library-book-lending',
              component: () => import('../views/library/BookLendingView.vue'),
              meta: {
                roles: ['librarian']
              }
            },
            {
              path: 'library-module',
              name: 'library-library-module',
              component: () => import('../views/budget/LibraryView.vue'),
              meta: {
                roles: ['librarian']
              }
            },
            {
              path: 'book-fees',
              name: 'library-book-fees',
              component: () => import('../views/budget/BookFeesView.vue'),
              meta: {
                roles: ['librarian']
              }
            },
            {
              path: 'reservations',
              name: 'library-reservations',
              component: () => import('../views/library/ReservationsView.vue'),
              meta: {
                roles: ['librarian']
              }
            },
            {
              path: 'course-books',
              name: 'library-course-books',
              component: () => import('../views/library/CourseBookView.vue'),
              meta: {
                roles: ['librarian']
              }
            },
            // User routes (administrative roles only - students and teachers no longer have library access)
            {
              path: 'history',
              name: 'library-history',
              component: () => import('../views/library/ReadingHistoryView.vue'),
              meta: {
                roles: ['schooladmin', 'admin', 'schoolstaff', 'principal', 'parent', 'student', 'teacher']
              }
            },
            {
              path: 'library-books/:id',
              name: 'BookDetails',
              component: () => import('../views/library/BookDetailsView.vue'),
              meta: { roles: ['librarian', 'admin'] }
            },
            {
              path: 'library-books/new',
              name: 'AddBook',
              component: () => import('../views/library/BookDetailsView.vue'),
              meta: { roles: ['librarian', 'admin'] }
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.roles && Array.isArray(to.meta.roles) && authStore.user) {
    // Check if user has required role for the route
    if (to.meta.roles.includes(authStore.user.role)) {
      next()
    } else {
      // Redirect to dashboard if user doesn't have required role
      next('/dashboard')
    }
  } else {
    next()
  }
})

export default router