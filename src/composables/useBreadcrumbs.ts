import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '../stores/theme'

export interface BreadcrumbSegment {
  label: string
  to?: string
}

export function useBreadcrumbs() {
  const route = useRoute()
  const themeStore = useThemeStore()
  const language = computed(() => themeStore.language)

  // Route name to breadcrumb mapping
  const routeLabels = {
    // English labels
    en: {
      Dashboard: 'Dashboard',
      Schools: 'Schools',
      Inspectors: 'Inspectors',
      Users: 'Users',
      SystemConfig: 'System Configuration',
      Support: 'Support',
      Updates: 'Updates',
      SystemIntegration: 'System Integration',
      DataManagement: 'Data Management',
      XSchoolFeatures: 'XSchool Features',
      SystemAdministration: 'System Administration',
      SchoolSemesters: 'School Semesters',
      Departments: 'Departments',
      UserManagement: 'User Management',
      TeacherManagement: 'Teacher Management',
      TeacherProfile: 'Teacher Profile',
      BuildingsRooms: 'Buildings & Rooms',
      ClassroomSetup: 'Classroom Setup',
      CompanyManagement: 'Company Management',
      StudentManagement: 'Student Management',
      StudentProfile: 'Student Profile',
      StudentSearch: 'Student Search',
      AttendanceBehavior: 'Attendance & Behavior',
      Students: 'Students',
      Academics: 'Academics',
      Finances: 'Finances',
      Timetable: 'Timetable',
      Messages: 'Messages',
      Reports: 'Reports',
      Profile: 'Profile',
      Settings: 'Settings',
      Help: 'Help',
      Enrollment: 'Enrollment',
      EnrollmentFormConfig: 'Enrollment Form Configuration',
      AdvancedPlanning: 'Advanced Planning',
      ResourceOptimization: 'Resource Optimization',
      ConflictResolution: 'Conflict Resolution',
      CourseEditor: 'Course Editor',
      SubjectAssignment: 'Subject Assignment',
      SubjectCourseAssignment: 'Subject Course Assignment',
      StudentCourseAssignment: 'Student Course Assignment',
      GradeEntry: 'Grade Entry',
      QualificationChecks: 'Qualification Checks',
      RepeatYearManagement: 'Repeat Year Management',
      SpecialAchievement: 'Special Achievement',
      LearningAnalytics: 'Learning Analytics',
      PlanFrameEditor: 'Plan Frame Editor',
      HourlyMonitor: 'Hourly Monitor',
      AdvancedTimetable: 'Advanced Timetable',
      TimetableManagement: 'Timetable Management',
      CourseAddition: 'Course Addition',
      MyClasses: 'My Classes',
      TeacherCareer: 'Teacher Career',
      PrintingTemplates: 'Printing Templates',
      AdvancedPrintLogic: 'Advanced Print Logic',
      PrintConditions: 'Print Conditions',
      TextBlockControl: 'Text Block Control',
      PlaceholderManager: 'Placeholder Manager',
      LogicRules: 'Logic Rules',
      MobilePlanning: 'Mobile Planning',
      AdvancedGrading: 'Advanced Grading',
      CurriculumMapping: 'Curriculum Mapping',
      GradeScaleConfig: 'Grade Scale Configuration',
      DocumentManagement: 'Document Management',
      StudentPortfolio: 'Student Portfolio',
      ApplicationForm: 'Application Form',
      ReportCardTemplates: 'Report Card Templates',
      ElectiveCourses: 'Elective Courses',
      BudgetManagement: 'Budget Management',
      AdvancedAnalytics: 'Advanced Analytics',
      AdvancedSystem: 'Advanced System',
      InspectorLogs: 'Inspector Logs',
      ResourceRoom: 'Resource Room',
      InternshipPortal: 'Internship Portal'
    },
    // German labels
    de: {
      Dashboard: 'Dashboard',
      Schools: 'Schulen',
      Inspectors: 'Inspektoren',
      Users: 'Benutzer',
      SystemConfig: 'Systemkonfiguration',
      Support: 'Support',
      Updates: 'Updates',
      SystemIntegration: 'System-Integration',
      DataManagement: 'Datenverwaltung',
      XSchoolFeatures: 'XSchool-Funktionen',
      SystemAdministration: 'Systemverwaltung',
      SchoolSemesters: 'Schulsemester',
      Departments: 'Abteilungen',
      UserManagement: 'Benutzerverwaltung',
      TeacherManagement: 'Lehrerverwaltung',
      TeacherProfile: 'Lehrerprofil',
      BuildingsRooms: 'Gebäude & Räume',
      ClassroomSetup: 'Klassenraumeinrichtung',
      CompanyManagement: 'Unternehmensverwaltung',
      StudentManagement: 'Schülerverwaltung',
      StudentProfile: 'Schülerprofil',
      StudentSearch: 'Schülersuche',
      AttendanceBehavior: 'Anwesenheit & Verhalten',
      Students: 'Schüler',
      Academics: 'Akademisch',
      Finances: 'Finanzen',
      Timetable: 'Stundenplan',
      Messages: 'Nachrichten',
      Reports: 'Berichte',
      Profile: 'Profil',
      Settings: 'Einstellungen',
      Help: 'Hilfe',
      Enrollment: 'Anmeldung',
      EnrollmentFormConfig: 'Anmeldeformular-Konfiguration',
      AdvancedPlanning: 'Erweiterte Planung',
      ResourceOptimization: 'Ressourcen-Optimierung',
      ConflictResolution: 'Konfliktlösung',
      CourseEditor: 'Kurs-Editor',
      SubjectAssignment: 'Fachzuordnung',
      SubjectCourseAssignment: 'Fach-Kurs-Zuordnung',
      StudentCourseAssignment: 'Schüler-Kurs-Zuordnung',
      GradeEntry: 'Notenerfassung',
      QualificationChecks: 'Qualifikationsprüfungen',
      RepeatYearManagement: 'Wiederholungsjahr-Verwaltung',
      SpecialAchievement: 'Besondere Leistungen',
      LearningAnalytics: 'Lernanalytik',
      PlanFrameEditor: 'Plan-Frame-Editor',
      HourlyMonitor: 'Stunden-Monitor',
      AdvancedTimetable: 'Erweiterter Stundenplan',
      TimetableManagement: 'Stundenplanverwaltung',
      CourseAddition: 'Kurs-Hinzufügung',
      MyClasses: 'Meine Klassen',
      TeacherCareer: 'Lehrerlaufbahn',
      PrintingTemplates: 'Druckvorlagen',
      AdvancedPrintLogic: 'Erweiterte Drucklogik',
      PrintConditions: 'Druckbedingungen',
      TextBlockControl: 'Textblock-Steuerung',
      PlaceholderManager: 'Platzhalter-Manager',
      LogicRules: 'Logikregeln',
      MobilePlanning: 'Mobile Planung',
      AdvancedGrading: 'Erweiterte Benotung',
      CurriculumMapping: 'Lehrplan-Mapping',
      GradeScaleConfig: 'Notenskala-Konfiguration',
      DocumentManagement: 'Dokumentenverwaltung',
      StudentPortfolio: 'Schülerportfolio',
      ApplicationForm: 'Anmeldeformular',
      ReportCardTemplates: 'Zeugnisvorlagen',
      ElectiveCourses: 'Wahlkurse',
      BudgetManagement: 'Budget-Management',
      AdvancedAnalytics: 'Erweiterte Analytik',
      AdvancedSystem: 'Erweitertes System',
      InspectorLogs: 'Inspektoren-Protokolle',
      ResourceRoom: 'Ressourcen-Raum',
      InternshipPortal: 'Praktikumsportal'
    }
  }

  const breadcrumbSegments = computed<BreadcrumbSegment[]>(() => {
    const segments: BreadcrumbSegment[] = []
    const pathSegments = route.path.split('/').filter(segment => segment !== '')
    
    // Don't show breadcrumbs for dashboard root
    if (route.path === '/dashboard') {
      return []
    }

    // Special handling for advanced planning module routes
    const advancedPlanningModules = [
      'PlanFrameEditor',
      'CourseEditor', 
      'StudentCourseAssignment',
      'HourlyMonitor',
      'ConflictResolution'
    ]
    
    const currentRoute = route.name as string
    const isAdvancedPlanningModule = advancedPlanningModules.includes(currentRoute)

    if (isAdvancedPlanningModule) {
      // Add Advanced Planning as parent segment
      const currentLabels = routeLabels[language.value as keyof typeof routeLabels]
      segments.push({
        label: currentLabels.AdvancedPlanning,
        to: '/dashboard/advanced-planning'
      })
      
      // Add current module as child segment
      const moduleLabel = currentLabels[currentRoute as keyof typeof currentLabels] || currentRoute
      segments.push({
        label: moduleLabel
      })
      
      return segments
    }

    // Build breadcrumb path for other routes
    let currentPath = ''
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i]
      currentPath += `/${segment}`
      
      // Skip the dashboard segment as it's already handled
      if (segment === 'dashboard') continue
      
      // Get route name from current route or construct it
      let routeName = ''
      if (i === pathSegments.length - 1) {
        // Last segment - use current route name
        routeName = route.name as string
      } else {
        // Intermediate segments - try to construct route name
        routeName = segment.charAt(0).toUpperCase() + segment.slice(1)
        // Convert kebab-case to PascalCase
        routeName = routeName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
      }

      // Get translated label
      const currentLabels = routeLabels[language.value as keyof typeof routeLabels]
      const label = currentLabels[routeName as keyof typeof currentLabels] || routeName

      // Add segment - only make it clickable if it's not the last one
      segments.push({
        label,
        to: i === pathSegments.length - 1 ? undefined : currentPath
      })
    }

    return segments
  })

  return {
    breadcrumbSegments
  }
} 