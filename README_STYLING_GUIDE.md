# 🎨 WinSchool Design System & Styling Guide

## 🏆 Primary Color Scheme

**WinSchool uses a warm yellow/golden color palette as the primary brand colors:**

- **Primary Color**: `#fef3c7` (warm yellow) - `bg-winschool-primary`
- **Primary Hover**: `#facc15` (golden yellow) - `bg-winschool-primary-dark`
- **Primary Text**: `#374151` (dark slate) - `text-slate-800`

### ✅ **Correct Usage - Header Buttons:**
```vue
<!-- ✅ CORRECT: Primary action buttons -->
<button class="bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors">
  <Plus class="h-4 w-4 mr-2" />
  Create Item
</button>

<!-- ✅ CORRECT: Secondary action buttons -->
<button class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium px-4 py-3 sm:py-2 rounded-lg">
  <Download class="h-4 w-4 mr-2" />
  Export
</button>
```

### ❌ **Avoid - Blue Gradients:**
```vue
<!-- ❌ WRONG: Don't use blue gradients -->
<button class="bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white">
  <!-- Don't use this -->
</button>
```

## 🎯 **Complete Color System**

### **Background Colors:**
- Page Background: `#F8FAFC` - `bg-winschool-bg`
- Card Background: `#FFFFFF` - `bg-white dark:bg-gray-800`
- Sidebar Light: `#FFFFFF` - `bg-winschool-bg`
- Sidebar Dark: `#1E293B` - `bg-winschool-sidebar-dark`

### **Text Colors:**
- Primary Content: `#334155` - `text-winschool-content` or `text-slate-800`
- Headings: `#64748B` - `text-winschool-heading` or `text-slate-500`
- Sidebar Labels: `#475569` - `text-winschool-sidebar` or `text-slate-600`
- Light Text: `#F8FAFC` - `text-winschool-light-text` or `text-slate-50`

### **Status Colors:**
- Success: `#22C55E` - `text-green-600` / `bg-green-600`
- Warning: `#FACC15` - `text-yellow-600` / `bg-yellow-600`  
- Error: `#EF4444` - `text-red-600` / `bg-red-600`
- Info: `#3B82F6` - `text-blue-600` / `bg-blue-600`

## 📐 **Layout Patterns**

### **Page Header Structure:**
```vue
<div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
  <div class="flex items-start">
    <!-- Icon with WinSchool gradient background -->
    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-700 to-blue-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
      <Icon class="h-5 w-5 sm:h-7 sm:w-7 text-white" />
    </div>
    
    <div class="min-w-0 flex-1">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
        Page Title
      </h1>
      <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
        Page description
      </p>
    </div>
  </div>
  
  <!-- Action buttons using yellow primary colors -->
  <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
    <button class="bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg">
      Primary Action
    </button>
  </div>
</div>
```

### **Button Hierarchy:**
1. **Primary Actions**: `bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800`
2. **Secondary Actions**: `bg-white dark:bg-gray-700 border border-gray-300 text-gray-700`
3. **Destructive Actions**: `bg-red-600 hover:bg-red-700 text-white`

### **Card Styling:**
```vue
<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
  <!-- Card content -->
</div>
```

## 🔤 **Typography**

- **Font Family**: `Inter` system font
- **Headers**: Use `text-slate-500 dark:text-slate-400` 
- **Body Text**: Use `text-slate-800 dark:text-slate-50`
- **Muted Text**: Use `text-gray-600 dark:text-gray-400`

## 🌙 **Dark Mode Support**

Always provide dark mode variants:
```vue
<!-- Always include dark: variants -->
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <button class="bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800">
    <!-- Primary buttons maintain yellow in both modes -->
  </button>
</div>
```

## 📱 **Responsive Design**

- Use `sm:`, `md:`, `lg:`, `xl:` breakpoints
- Stack buttons vertically on mobile: `flex-col sm:flex-row`
- Adjust spacing: `space-y-2 sm:space-y-0 sm:space-x-3`
- Responsive text sizes: `text-sm sm:text-base`

## ⚡ **Key Design Principles**

1. **Consistency**: Always use `winschool-primary` for main action buttons
2. **Accessibility**: Maintain proper contrast ratios
3. **Responsiveness**: Design mobile-first
4. **Dark Mode**: Support both light and dark themes
5. **Performance**: Use Tailwind utilities for optimal CSS

---

**Remember**: The yellow/golden color scheme (`#fef3c7` / `#facc15`) is the signature WinSchool brand color and should be used for all primary actions and branding elements! 