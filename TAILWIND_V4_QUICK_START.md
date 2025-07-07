# Tailwind CSS v4 Quick Start Guide
## Immediate Next Steps

### 🚀 Quick Migration Commands

1. **Create backup branch**
   ```bash
   git checkout -b backup/tailwind-v3
   git add .
   git commit -m "Backup: Tailwind CSS v3.3.5 before v4 migration"
   git push origin backup/tailwind-v3
   ```

2. **Update dependencies**
   ```bash
   npm uninstall autoprefixer postcss
   npm install tailwindcss@^4.0.0-alpha.25 @tailwindcss/vite@^4.0.0-alpha.25
   ```

3. **Rename config file**
   ```bash
   mv tailwind.config.js tailwind.config.ts
   ```

4. **Remove PostCSS config**
   ```bash
   rm postcss.config.js
   ```

### 📝 Required File Changes

#### 1. Update `tailwind.config.ts`
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

#### 2. Update `vite.config.ts`
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

#### 3. Update `src/style.css` (first few lines)
```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

/* Rest of your existing CSS remains the same */
```

### ⚠️ Critical Changes to Address

1. **@apply directives** - These need to be converted to regular CSS
2. **Custom utility classes** - May need updates for v4 compatibility
3. **Component styles** - Check for any Tailwind-specific syntax

### 🧪 Test After Changes

```bash
npm run dev
```

Check for:
- [ ] Build success
- [ ] No console errors
- [ ] Styles render correctly
- [ ] Dark mode toggle works

### 🔄 Rollback if Issues

```bash
git checkout backup/tailwind-v3
npm install
```

### 📋 Next Steps After Quick Migration

1. Convert all `@apply` directives in `src/style.css`
2. Test all components visually
3. Update any component-specific styles
4. Run comprehensive testing
5. Optimize performance

---

**Note**: This is a quick migration guide. For detailed migration steps, see `TAILWIND_V4_MIGRATION_PLAN.md` 