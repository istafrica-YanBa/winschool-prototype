<template>
  <div class="space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <FileText class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Erweiterte Drucklogik-Modul' : 'Advanced Print Logic Module' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Dieses Modul bietet erweiterte Steuerungs- und Konfigurationsmöglichkeiten für Berichte und Zeugnisse.' : 'This module provides advanced control and configuration for reports and certificates.' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <router-link
          to="/dashboard/support"
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <LifeBuoy class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Support' : 'Support' }}
        </router-link>
      </div>
    </div>

    <!-- Info Panel -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-6 rounded-xl shadow-sm">
      <h2 class="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
        <FileText class="h-6 w-6 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Erweiterte Drucklogik-Modul' : 'Advanced Print Logic Module' }}
      </h2>
      <p class="text-gray-700 dark:text-slate-200 mb-1">
        {{ language === 'de' ? 'Dieses Modul bietet erweiterte Steuerungs- und Konfigurationsmöglichkeiten für Berichte und Zeugnisse.' : 'This module provides advanced control and configuration for reports and certificates.' }}
      </p>
      <ul class="list-disc pl-6 text-gray-600 dark:text-slate-300 text-sm">
        <li>{{ language === 'de' ? 'Visuelle Regel-Editoren für IF/THEN/ELSE-Logik' : 'Visual rule editors for IF/THEN/ELSE logic' }}</li>
        <li>{{ language === 'de' ? 'Erweiterte Platzhalterverwaltung und Textblock-Steuerung' : 'Advanced placeholder management and text block control' }}</li>
        <li>{{ language === 'de' ? 'Automatisierte Kommentare und flexible Druckeinstellungen' : 'Automated comments and flexible print settings' }}</li>
        <li>{{ language === 'de' ? 'Alle bestehenden Module bleiben unverändert und funktionsfähig.' : 'All existing modules remain unchanged and fully functional.' }}</li>
      </ul>
    </div>

    <!-- Feature Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center mb-2">
            <Settings class="h-6 w-6 text-primary-600 mr-2" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50">{{ language === 'de' ? 'Logikregeln' : 'Logic Rules' }}</h2>
          </div>
          <p class="text-gray-600 dark:text-slate-400 mb-4">{{ language === 'de' ? 'Visueller Editor für IF/THEN/ELSE-Regeln und dynamische Berichtsanpassung.' : 'Visual editor for IF/THEN/ELSE rules and dynamic report logic.' }}</p>
        </div>
        <router-link to="/dashboard/advanced-print-logic/logic-rules" class="btn-primary w-full text-center mt-2">{{ language === 'de' ? 'Regeln bearbeiten' : 'Edit Rules' }}</router-link>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center mb-2">
            <Database class="h-6 w-6 text-accent-600 mr-2" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50">{{ language === 'de' ? 'Platzhalter-Manager' : 'Placeholder Manager' }}</h2>
          </div>
          <p class="text-gray-600 dark:text-slate-400 mb-4">{{ language === 'de' ? 'Verwalten und testen Sie Platzhalter für Berichte mit Vorschau.' : 'Manage and test placeholders for reports with preview.' }}</p>
        </div>
        <router-link to="/dashboard/advanced-print-logic/placeholder-manager" class="btn-primary w-full text-center mt-2">{{ language === 'de' ? 'Platzhalter verwalten' : 'Manage Placeholders' }}</router-link>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center mb-2">
            <BookOpen class="h-6 w-6 text-secondary-600 mr-2" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50">{{ language === 'de' ? 'Textblock-Steuerung' : 'Text Block Control' }}</h2>
          </div>
          <p class="text-gray-600 dark:text-slate-400 mb-4">{{ language === 'de' ? 'Dynamische Ersetzung, Drag-and-Drop und Vorschau von Textblöcken.' : 'Dynamic substitution, drag-and-drop, and preview of text blocks.' }}</p>
        </div>
        <router-link to="/dashboard/advanced-print-logic/text-block-control" class="btn-primary w-full text-center mt-2">{{ language === 'de' ? 'Textblöcke steuern' : 'Control Text Blocks' }}</router-link>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center mb-2">
            <Printer class="h-6 w-6 text-green-600 mr-2" />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-50">{{ language === 'de' ? 'Druckbedingungen' : 'Print Conditions' }}</h2>
          </div>
          <p class="text-gray-600 dark:text-slate-400 mb-4">{{ language === 'de' ? 'Erweiterte Druckeinstellungen, Filter und Batch-Optionen.' : 'Advanced print settings, filters, and batch options.' }}</p>
        </div>
        <router-link to="/dashboard/advanced-print-logic/print-conditions" class="btn-primary w-full text-center mt-2">{{ language === 'de' ? 'Druckoptionen konfigurieren' : 'Configure Print Options' }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { FileText, Settings, Database, BookOpen, Printer, LifeBuoy } from 'lucide-vue-next'
const themeStore = useThemeStore()
const language = themeStore.language
</script> 
