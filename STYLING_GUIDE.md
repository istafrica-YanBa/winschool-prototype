# Standardized View Header Styling Guide

## Overview
This guide documents the standardized header styling pattern implemented across all views in the WinSchool prototype, based on the EnrollmentView design.

## Standard Header Structure

### 1. Container Layout
```vue
<div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
```

### 2. Icon and Title Section
```vue
<div class="flex items-start">
  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-700 to-blue-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
    <IconComponent class="h-5 w-5 sm:h-7 sm:w-7 text-white" />
  </div>
  <div class="min-w-0 flex-1">
    <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
      {{ pageTitle }}
    </h1>
    <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
      {{ pageDescription }}
    </p>
  </div>
</div>
```

### 3. Action Buttons Section
```vue
<div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
  <button class="w-full sm:w-auto bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
    <IconComponent class="h-4 w-4 mr-2" />
    {{ buttonText }}
  </button>
</div>
```

## Color Scheme

### Primary Colors
- **Background Gradient**: `from-indigo-700 to-blue-600`
- **Hover Gradient**: `from-indigo-800 to-blue-700`
- **Text Colors**: 
  - Title: `text-slate-500 dark:text-slate-400`
  - Description: `text-slate-800 dark:text-slate-50`
  - Button Text: `text-white`

### Icon Container
- **Size**: `w-10 h-10 sm:w-12 sm:h-12`
- **Background**: `bg-gradient-to-r from-indigo-700 to-blue-600`
- **Shape**: `rounded-xl`
- **Icon Size**: `h-5 w-5 sm:h-7 sm:w-7`
- **Icon Color**: `text-white`

## Recommended Icons by View Type

| View Type | Icon | Description |
|-----------|------|-------------|
| Dashboard | `BarChart3` | Analytics and overview |
| User Management | `Users` | User-related functionality |
| Student Management | `Users` | Student-specific management |
| Enrollment | `UserPlus` | Adding/enrolling students |
| Finances | `CreditCard` | Financial operations |
| Timetable | `Calendar` | Scheduling and time |
| Profile | `User` | Personal information |
| Settings | `Settings` | Configuration |
| Reports | `BarChart3` | Data and analytics |
| Support | `MessageCircle` | Help and assistance |

## Typography

### Title
- **Font Size**: `text-2xl sm:text-3xl`
- **Font Weight**: `font-bold`
- **Color**: `text-slate-500 dark:text-slate-400`
- **Line Height**: `leading-tight`

### Description
- **Font Size**: `text-sm sm:text-base`
- **Color**: `text-slate-800 dark:text-slate-50`
- **Margin**: `mt-1 sm:mt-2`

## Responsive Design

### Mobile (sm and below)
- Vertical layout for header
- Full-width buttons
- Smaller icon sizes (h-5 w-5)
- Smaller text sizes (text-2xl)

### Desktop (lg and above)
- Horizontal layout for header
- Auto-width buttons
- Larger icon sizes (h-7 w-7)
- Larger text sizes (text-3xl)

## Implementation Checklist

For each new view, ensure:

- [ ] Header container uses the standard flex layout
- [ ] Icon container follows size and color specifications
- [ ] Appropriate icon is selected and imported
- [ ] Title uses correct typography classes
- [ ] Description uses correct color and spacing
- [ ] Buttons use the gradient background
- [ ] Button icons are properly sized (h-4 w-4)
- [ ] Responsive classes are applied correctly
- [ ] Dark mode classes are included

## Updated Views

The following views have been updated to follow this standard:

1. ✅ **EnrollmentView** - Original template (UserPlus icon)
2. ✅ **DashboardView** - Updated with BarChart3 icon
3. ✅ **StudentsView** - Updated with UserPlus icon
4. ✅ **StudentManagementView** - Updated with Users icon
5. ✅ **FinancesView** - Updated with CreditCard icon
6. ✅ **TimetableView** - Updated with Calendar icon
7. ✅ **UsersView** - Updated with Users icon
8. ✅ **ProfileView** - Updated with User icon
9. ✅ **ReportsView** - Updated with BarChart3 icon
10. ✅ **SettingsView** - Updated with Settings icon

## Pending Views

The following views still need to be updated:

- [ ] AcademicsView (recommended icon: GraduationCap)
- [ ] AdvancedPlanningView (recommended icon: Calendar)
- [ ] HelpView (recommended icon: HelpCircle)
- [ ] SupportView (recommended icon: MessageCircle)
- [ ] SchoolsView (recommended icon: Building)
- [ ] And others...

## Notes

- All gradient colors maintain the indigo-to-blue theme established in EnrollmentView
- Icon sizes are responsive and consistent across all views
- Button styling ensures consistency in appearance and behavior
- Dark mode support is built into all color schemes
- The pattern is mobile-first responsive 