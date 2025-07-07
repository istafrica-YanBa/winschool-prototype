# Tailwind CSS v4 Migration Plan
## WinSchool Education Platform

### Current State
- **Current Version**: Tailwind CSS 3.3.5
- **Project Type**: Vue 3 + Vite + TypeScript
- **Build Tool**: Vite
- **PostCSS**: Yes (postcss.config.js)

---

## 🚨 BREAKING CHANGES IN TAILWIND V4

### 1. **New CSS Engine**
- Tailwind v4 uses a new CSS engine called "Lightning CSS"
- Replaces PostCSS-based processing
- **Impact**: PostCSS configuration will need updates

### 2. **New Configuration Format**
- `tailwind.config.js` → `tailwind.config.ts` (recommended)
- New `@config` directive in CSS
- **Impact**: Configuration file needs migration

### 3. **New Import System**
- `@import 'tailwindcss/base'` → `@import "tailwindcss"`
- **Impact**: CSS imports need updating

### 4. **Removed Features**
- `@apply` directive (replaced with CSS custom properties)
- Some utility classes may be renamed
- **Impact**: Custom CSS and component styles need updates

---

## 📋 MIGRATION STEPS

### Phase 1: Preparation & Backup
1. **Create backup branch**
   ```bash
   git checkout -b backup/tailwind-v3
   git push origin backup/tailwind-v3
   ```

2. **Document current custom styles**
   - Custom color system in `tailwind.config.js`
   - Custom CSS in `src/style.css`
   - Component-specific styles

### Phase 2: Update Dependencies
1. **Update package.json**
   ```json
   {
     "devDependencies": {
       "tailwindcss": "^4.0.0-alpha.25",
       "@tailwindcss/vite": "^4.0.0-alpha.25"
     }
   }
   ```

2. **Remove old dependencies**
   ```bash
   npm uninstall autoprefixer postcss
   ```

3. **Install new dependencies**
   ```bash
   npm install
   ```

### Phase 3: Update Configuration
1. **Rename and update config file**
   - `tailwind.config.js` → `tailwind.config.ts`
   - Update to new v4 format

2. **Update Vite configuration**
   - Replace PostCSS plugin with Tailwind v4 plugin

3. **Update CSS imports**
   - Modify `src/style.css` imports

### Phase 4: Migrate Custom Styles
1. **Convert @apply directives**
   - Replace with CSS custom properties
   - Update component styles

2. **Update color system**
   - Migrate custom colors to new format
   - Test dark mode compatibility

3. **Update utility classes**
   - Check for renamed utilities
   - Update component templates

### Phase 5: Testing & Validation
1. **Visual regression testing**
2. **Dark mode testing**
3. **Component functionality testing**
4. **Performance testing**

---

## 🔧 DETAILED IMPLEMENTATION

### Step 1: Update package.json
```json
{
  "devDependencies": {
    "tailwindcss": "^4.0.0-alpha.25",
    "@tailwindcss/vite": "^4.0.0-alpha.25"
  }
}
```

### Step 2: Create new tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Migrate existing color system
        primary: {
          50: '#fffef5',
          100: '#fffde7',
          200: '#fef9c3',
          300: '#fef3c7',
          400: '#fde68a',
          500: '#facc15',
          600: '#eab308',
          700: '#ca8a04',
          800: '#a16207',
          900: '#854d0e',
        },
        // WinSchool specific colors
        'winschool-primary': '#fef3c7',
        'winschool-primary-dark': '#facc15',
        'winschool-content': '#334155',
        'winschool-heading': '#64748B',
        'winschool-sidebar': '#475569',
        'winschool-bg': '#F8FAFC',
        'winschool-success': '#22C55E',
        'winschool-warning': '#FACC15',
        'winschool-error': '#EF4444',
        'winschool-info': '#3B82F6',
        'winschool-neutral': '#E5E7EB',
        'winschool-dark-bg': '#0F172A',
        'winschool-light-text': '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'body': ['14px', {
          lineHeight: '163%',
          letterSpacing: '0%',
          fontWeight: '400',
        }],
        'body-large': ['16px', {
          lineHeight: '163%',
          letterSpacing: '0%',
          fontWeight: '400',
        }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
} satisfies Config
```

### Step 3: Update vite.config.ts
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
```

### Step 4: Update src/style.css
```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

:root {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 163%;
  font-weight: 400;
  letter-spacing: 0%;
  color-scheme: light dark;
  
  /* WinSchool Color System Variables */
  --winschool-primary: #fef3c7;
  --winschool-primary-dark: #facc15;
  --winschool-primary-darker: #eab308;
  --winschool-content-text: #334155;
  --winschool-heading-text: #64748B;
  --winschool-sidebar-text: #475569;
  --winschool-bg: #F8FAFC;
  --winschool-success: #22C55E;
  --winschool-warning: #FACC15;
  --winschool-error: #EF4444;
  --winschool-info: #3B82F6;
  --winschool-neutral: #E5E7EB;
  --winschool-dark-bg: #0F172A;
  --winschool-light-text: #F8FAFC;
  --winschool-sidebar-dark: #1E293B;
  --winschool-card-dark: #334155;
}

/* Convert @apply directives to CSS custom properties */
.btn-primary {
  color: #1e293b;
  background: var(--winschool-primary);
  border: 1px solid var(--winschool-primary-dark);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 163%;
  font-weight: 500;
  letter-spacing: 0%;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--winschool-primary-dark);
}

/* Continue converting other @apply directives... */
```

### Step 5: Remove postcss.config.js
```bash
rm postcss.config.js
```

---

## 🧪 TESTING CHECKLIST

### Visual Testing
- [ ] Homepage layout
- [ ] Navigation components
- [ ] Forms and inputs
- [ ] Cards and panels
- [ ] Buttons and interactive elements
- [ ] Tables and data displays
- [ ] Modal dialogs
- [ ] Sidebar navigation

### Dark Mode Testing
- [ ] Color scheme switching
- [ ] Text contrast
- [ ] Background colors
- [ ] Border colors
- [ ] Interactive states

### Component Testing
- [ ] All Vue components render correctly
- [ ] Custom CSS classes work
- [ ] Responsive design
- [ ] Animations and transitions
- [ ] Focus states and accessibility

### Performance Testing
- [ ] Build time comparison
- [ ] Bundle size analysis
- [ ] Runtime performance
- [ ] CSS generation speed

---

## 🚀 ROLLBACK PLAN

If issues arise during migration:

1. **Quick rollback**
   ```bash
   git checkout backup/tailwind-v3
   npm install
   ```

2. **Restore original files**
   - `tailwind.config.js`
   - `postcss.config.js`
   - `src/style.css`
   - `vite.config.ts`

---

## 📊 MIGRATION TIMELINE

### Week 1: Preparation
- [ ] Create backup branch
- [ ] Document current state
- [ ] Set up testing environment

### Week 2: Core Migration
- [ ] Update dependencies
- [ ] Migrate configuration
- [ ] Update CSS imports

### Week 3: Style Migration
- [ ] Convert @apply directives
- [ ] Update component styles
- [ ] Test dark mode

### Week 4: Testing & Polish
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Documentation updates

---

## 🔍 POTENTIAL ISSUES & SOLUTIONS

### Issue 1: @apply directive removal
**Solution**: Convert to CSS custom properties or direct utility classes

### Issue 2: PostCSS plugin conflicts
**Solution**: Remove PostCSS configuration, use Tailwind v4 plugin

### Issue 3: Custom color system
**Solution**: Migrate to new color format in config

### Issue 4: Build performance
**Solution**: Monitor and optimize with new Lightning CSS engine

---

## 📚 RESOURCES

- [Tailwind CSS v4 Alpha Documentation](https://tailwindcss.com/docs/installation)
- [Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Lightning CSS Documentation](https://lightningcss.dev/)

---

## ✅ SUCCESS CRITERIA

Migration is successful when:
- [ ] All components render correctly
- [ ] Dark mode works as expected
- [ ] Build performance is maintained or improved
- [ ] No visual regressions
- [ ] All custom styles are preserved
- [ ] Bundle size is optimized 