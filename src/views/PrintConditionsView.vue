<template>
  <div class="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Printer class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Druckbedingungen' : 'Print Conditions' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Konfigurieren Sie erweiterte Druckeinstellungen und Bedingungen für Berichte.' : 'Configure advanced print settings and conditions for reports.' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showBatchPrintModal = true" class="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Printer class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Stapeldruck' : 'Batch Print' }}
        </button>
        <button @click="previewPrint" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Eye class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Vorschau' : 'Preview' }}
        </button>
        <button @click="saveConfiguration" class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Save class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Speichern' : 'Save' }}
        </button>
      </div>
    </div>

    <!-- Print Layout Selection -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Layout Templates -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-slate-500 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Drucklayouts' : 'Print Layouts' }}
        </h2>
        
        <div class="space-y-4">
          <div v-for="layout in printLayouts" :key="layout.id" 
               class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer transition-colors"
               :class="selectedLayout === layout.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'"
               @click="selectLayout(layout.id)">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-medium text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  {{ layout.name }}
                </h3>
                <p class="text-sm text-slate-600 dark:text-gray-400 mt-1" style="font-family: Inter, sans-serif;">
                  {{ layout.description }}
                </p>
              </div>
              <div class="flex items-center">
                <input type="radio" :value="layout.id" v-model="selectedLayout" class="text-blue-600" />
              </div>
            </div>
            
            <div class="flex flex-wrap gap-2 mt-3">
              <span v-for="section in layout.sections" :key="section"
                    class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-full"
                    style="font-family: Inter, sans-serif;">
                {{ getSectionLabel(section) }}
              </span>
            </div>
            
            <div class="flex justify-between items-center mt-3">
              <span class="text-xs text-slate-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Für:' : 'For:' }} {{ getAudienceLabel(layout.audience) }}
              </span>
              <button @click.stop="editLayout(layout)" class="text-blue-600 hover:text-blue-800 p-1">
                <Settings class="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <button @click="createCustomLayout" class="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center text-slate-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors" style="font-family: Inter, sans-serif;">
            <Plus class="h-5 w-5 mx-auto mb-2" />
            {{ language === 'de' ? 'Benutzerdefiniertes Layout erstellen' : 'Create Custom Layout' }}
          </button>
        </div>
      </div>

      <!-- Section Configuration -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-slate-500 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Berichtsabschnitte' : 'Report Sections' }}
        </h2>
        
        <div class="space-y-3">
          <div v-for="section in reportSections" :key="section.id"
               class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="flex items-center">
                <input :id="`section-${section.id}`" type="checkbox" v-model="section.enabled" 
                       class="text-blue-600 rounded focus:ring-blue-500" />
                <label :for="`section-${section.id}`" class="ml-2 text-sm font-medium text-slate-800 dark:text-white cursor-pointer" style="font-family: Inter, sans-serif;">
                  {{ section.name }}
                </label>
              </div>
              <span class="text-xs text-slate-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                ({{ section.description }})
              </span>
            </div>
            
            <div class="flex items-center space-x-2">
              <!-- Print Version Selector -->
              <select v-model="section.printVersion" class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                <option value="full">{{ language === 'de' ? 'Vollständig' : 'Full' }}</option>
                <option value="summary">{{ language === 'de' ? 'Zusammenfassung' : 'Summary' }}</option>
                <option value="basic">{{ language === 'de' ? 'Basis' : 'Basic' }}</option>
              </select>
              
              <!-- Conditional Logic -->
              <button @click="configureSectionCondition(section)" 
                      class="text-purple-600 hover:text-purple-800 p-1" 
                      :title="language === 'de' ? 'Bedingungen konfigurieren' : 'Configure conditions'">
                <Filter class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Presets -->
        <div class="mt-6">
          <h3 class="font-medium text-slate-800 dark:text-white mb-3" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Schnelleinstellungen' : 'Quick Presets' }}
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <button @click="applyPreset('parent')" class="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Eltern-Version' : 'Parent Version' }}
            </button>
            <button @click="applyPreset('school')" class="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Schul-Version' : 'School Version' }}
            </button>
            <button @click="applyPreset('minimal')" class="px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Minimal' : 'Minimal' }}
            </button>
            <button @click="applyPreset('complete')" class="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Vollständig' : 'Complete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Print Filters and Conditions -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
        {{ language === 'de' ? 'Druckfilter und Bedingungen' : 'Print Filters and Conditions' }}
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Student Filters -->
        <div>
          <h3 class="font-medium text-slate-800 dark:text-white mb-3" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Schülerfilter' : 'Student Filters' }}
          </h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Klasse' : 'Class' }}
              </label>
              <select v-model="printFilters.class" multiple class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;">
                <option value="10A">10A</option>
                <option value="10B">10B</option>
                <option value="11A">11A</option>
                <option value="11B">11B</option>
                <option value="12A">12A</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Notendurchschnitt' : 'Grade Average' }}
              </label>
              <div class="flex space-x-2">
                <select v-model="printFilters.gradeOperator" class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;">
                  <option value=">=">≥</option>
                  <option value="<=">≤</option>
                  <option value="=">=</option>
                </select>
                <input v-model="printFilters.gradeValue" type="number" step="0.1" min="1" max="6" class="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;" />
              </div>
            </div>

            <div>
              <label class="flex items-center">
                <input type="checkbox" v-model="printFilters.nonPromoted" class="text-blue-600 rounded" />
                <span class="ml-2 text-sm text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  {{ language === 'de' ? 'Nur nicht versetzte Schüler' : 'Only non-promoted students' }}
                </span>
              </label>
            </div>

            <div>
              <label class="flex items-center">
                <input type="checkbox" v-model="printFilters.absenteeism" class="text-blue-600 rounded" />
                <span class="ml-2 text-sm text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  {{ language === 'de' ? 'Hohe Fehlzeiten (>20%)' : 'High absenteeism (>20%)' }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Content Filters -->
        <div>
          <h3 class="font-medium text-slate-800 dark:text-white mb-3" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Inhaltsfilter' : 'Content Filters' }}
          </h3>
          <div class="space-y-3">
            <div>
              <label class="flex items-center">
                <input type="checkbox" v-model="printFilters.includeComments" class="text-blue-600 rounded" />
                <span class="ml-2 text-sm text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  {{ language === 'de' ? 'Lehrerkommentare einschließen' : 'Include teacher comments' }}
                </span>
              </label>
            </div>

            <div>
              <label class="flex items-center">
                <input type="checkbox" v-model="printFilters.includeRecommendations" class="text-blue-600 rounded" />
                <span class="ml-2 text-sm text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  {{ language === 'de' ? 'Empfehlungen einschließen' : 'Include recommendations' }}
                </span>
              </label>
            </div>

            <div>
              <label class="flex items-center">
                <input type="checkbox" v-model="printFilters.includeSignatures" class="text-blue-600 rounded" />
                <span class="ml-2 text-sm text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  {{ language === 'de' ? 'Unterschriftenfelder' : 'Signature fields' }}
                </span>
              </label>
            </div>

            <div>
              <label class="flex items-center">
                <input type="checkbox" v-model="printFilters.includeWatermark" class="text-blue-600 rounded" />
                <span class="ml-2 text-sm text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  {{ language === 'de' ? 'Wasserzeichen' : 'Watermark' }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Format Options -->
        <div>
          <h3 class="font-medium text-slate-800 dark:text-white mb-3" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Formatoptionen' : 'Format Options' }}
          </h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Papierformat' : 'Paper Size' }}
              </label>
              <select v-model="printFilters.paperSize" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;">
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Ausrichtung' : 'Orientation' }}
              </label>
              <div class="flex space-x-2">
                <label class="flex items-center">
                  <input type="radio" value="portrait" v-model="printFilters.orientation" class="text-blue-600" />
                  <span class="ml-1 text-sm text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                    {{ language === 'de' ? 'Hochformat' : 'Portrait' }}
                  </span>
                </label>
                <label class="flex items-center">
                  <input type="radio" value="landscape" v-model="printFilters.orientation" class="text-blue-600" />
                  <span class="ml-1 text-sm text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                    {{ language === 'de' ? 'Querformat' : 'Landscape' }}
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Qualität' : 'Quality' }}
              </label>
              <select v-model="printFilters.quality" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;">
                <option value="draft">{{ language === 'de' ? 'Entwurf' : 'Draft' }}</option>
                <option value="normal">{{ language === 'de' ? 'Normal' : 'Normal' }}</option>
                <option value="high">{{ language === 'de' ? 'Hoch' : 'High' }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Batch Print Modal -->
    <div v-if="showBatchPrintModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Stapeldruck konfigurieren' : 'Configure Batch Print' }}
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Stapelgröße' : 'Batch Size' }}
            </label>
            <input v-model.number="batchPrintSettings.batchSize" type="number" min="1" max="100" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Ausgabeformat' : 'Output Format' }}
            </label>
            <div class="grid grid-cols-3 gap-2">
              <label class="flex items-center">
                <input type="radio" value="pdf" v-model="batchPrintSettings.format" class="text-blue-600" />
                <span class="ml-2 text-sm text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">PDF</span>
              </label>
              <label class="flex items-center">
                <input type="radio" value="print" v-model="batchPrintSettings.format" class="text-blue-600" />
                <span class="ml-2 text-sm text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">{{ language === 'de' ? 'Drucken' : 'Print' }}</span>
              </label>
              <label class="flex items-center">
                <input type="radio" value="email" v-model="batchPrintSettings.format" class="text-blue-600" />
                <span class="ml-2 text-sm text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">Email</span>
              </label>
            </div>
          </div>

          <div v-if="batchPrintSettings.format === 'email'">
            <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'E-Mail-Vorlage' : 'Email Template' }}
            </label>
            <select v-model="batchPrintSettings.emailTemplate" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
              <option value="standard">{{ language === 'de' ? 'Standard' : 'Standard' }}</option>
              <option value="formal">{{ language === 'de' ? 'Formell' : 'Formal' }}</option>
              <option value="friendly">{{ language === 'de' ? 'Freundlich' : 'Friendly' }}</option>
            </select>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 class="font-medium text-slate-800 dark:text-white mb-2" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Ausgewählte Filter' : 'Selected Filters' }}
            </h4>
            <div class="text-sm text-slate-600 dark:text-gray-400 space-y-1" style="font-family: Inter, sans-serif;">
              <div v-if="printFilters.class.length > 0">
                <strong>{{ language === 'de' ? 'Klassen:' : 'Classes:' }}</strong> {{ printFilters.class.join(', ') }}
              </div>
              <div v-if="printFilters.nonPromoted">
                <strong>{{ language === 'de' ? 'Filter:' : 'Filter:' }}</strong> {{ language === 'de' ? 'Nicht versetzte Schüler' : 'Non-promoted students' }}
              </div>
              <div v-if="printFilters.absenteeism">
                <strong>{{ language === 'de' ? 'Filter:' : 'Filter:' }}</strong> {{ language === 'de' ? 'Hohe Fehlzeiten' : 'High absenteeism' }}
              </div>
              <div>
                <strong>{{ language === 'de' ? 'Geschätzte Anzahl:' : 'Estimated count:' }}</strong> {{ estimatedPrintCount }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="showBatchPrintModal = false" class="px-4 py-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
          </button>
          <button @click="startBatchPrint" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Stapeldruck starten' : 'Start Batch Print' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Plus, Save, Eye, Settings, Filter, Printer } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State
const selectedLayout = ref('standard')
const showBatchPrintModal = ref(false)

// Print layouts
const printLayouts = ref([
  {
    id: 'standard',
    name: language.value === 'de' ? 'Standard Zeugnis' : 'Standard Report Card',
    description: language.value === 'de' ? 'Vollständiges Zeugnis mit allen Abschnitten' : 'Complete report card with all sections',
    audience: 'parents',
    sections: ['grades', 'attendance', 'comments', 'behavior', 'recommendations']
  },
  {
    id: 'parent',
    name: language.value === 'de' ? 'Eltern-Version' : 'Parent Version',
    description: language.value === 'de' ? 'Vereinfachte Version für Eltern' : 'Simplified version for parents',
    audience: 'parents',
    sections: ['grades', 'attendance', 'comments']
  },
  {
    id: 'school',
    name: language.value === 'de' ? 'Schul-Version' : 'School Version',
    description: language.value === 'de' ? 'Interne Version mit zusätzlichen Details' : 'Internal version with additional details',
    audience: 'school',
    sections: ['grades', 'attendance', 'comments', 'behavior', 'recommendations', 'internal_notes']
  },
  {
    id: 'summary',
    name: language.value === 'de' ? 'Zusammenfassung' : 'Summary',
    description: language.value === 'de' ? 'Kurze Übersicht der wichtigsten Punkte' : 'Brief overview of key points',
    audience: 'both',
    sections: ['grades', 'behavior']
  }
])

// Report sections
const reportSections = ref([
  {
    id: 'grades',
    name: language.value === 'de' ? 'Noten' : 'Grades',
    description: language.value === 'de' ? 'Fachbezogene Noten und Bewertungen' : 'Subject grades and assessments',
    enabled: true,
    printVersion: 'full'
  },
  {
    id: 'attendance',
    name: language.value === 'de' ? 'Anwesenheit' : 'Attendance',
    description: language.value === 'de' ? 'Anwesenheitsstatistiken' : 'Attendance statistics',
    enabled: true,
    printVersion: 'summary'
  },
  {
    id: 'comments',
    name: language.value === 'de' ? 'Kommentare' : 'Comments',
    description: language.value === 'de' ? 'Lehrerkommentare und Bemerkungen' : 'Teacher comments and remarks',
    enabled: true,
    printVersion: 'full'
  },
  {
    id: 'behavior',
    name: language.value === 'de' ? 'Verhalten' : 'Behavior',
    description: language.value === 'de' ? 'Verhaltensbeurteilung' : 'Behavior assessment',
    enabled: true,
    printVersion: 'basic'
  },
  {
    id: 'recommendations',
    name: language.value === 'de' ? 'Empfehlungen' : 'Recommendations',
    description: language.value === 'de' ? 'Empfehlungen für die Zukunft' : 'Recommendations for the future',
    enabled: false,
    printVersion: 'summary'
  },
  {
    id: 'achievements',
    name: language.value === 'de' ? 'Erfolge' : 'Achievements',
    description: language.value === 'de' ? 'Besondere Leistungen und Auszeichnungen' : 'Special achievements and awards',
    enabled: false,
    printVersion: 'basic'
  }
])

// Print filters
const printFilters = ref({
  class: [],
  gradeOperator: '>=',
  gradeValue: null,
  nonPromoted: false,
  absenteeism: false,
  includeComments: true,
  includeRecommendations: true,
  includeSignatures: true,
  includeWatermark: false,
  paperSize: 'A4',
  orientation: 'portrait',
  quality: 'normal'
})

// Batch print settings
const batchPrintSettings = ref({
  batchSize: 10,
  format: 'pdf',
  emailTemplate: 'standard'
})

// Computed
const estimatedPrintCount = computed(() => {
  let count = 120 // Base student count
  
  if (printFilters.value.class.length > 0) {
    count = printFilters.value.class.length * 25
  }
  
  if (printFilters.value.nonPromoted) {
    count = Math.floor(count * 0.15)
  }
  
  if (printFilters.value.absenteeism) {
    count = Math.floor(count * 0.08)
  }
  
  return count
})

// Methods
const selectLayout = (layoutId) => {
  selectedLayout.value = layoutId
  const layout = printLayouts.value.find(l => l.id === layoutId)
  if (layout) {
    // Update section visibility based on layout
    reportSections.value.forEach(section => {
      section.enabled = layout.sections.includes(section.id)
    })
  }
}

const editLayout = (layout) => {
  // Implementation for editing layout
  console.log('Edit layout:', layout)
}

const createCustomLayout = () => {
  // Implementation for creating custom layout
  console.log('Create custom layout')
}

const configureSectionCondition = (section) => {
  // Implementation for configuring section conditions
  console.log('Configure section condition:', section)
}

const applyPreset = (presetType) => {
  switch (presetType) {
    case 'parent':
      reportSections.value.forEach(section => {
        section.enabled = ['grades', 'attendance', 'comments'].includes(section.id)
        section.printVersion = section.id === 'comments' ? 'summary' : 'full'
      })
      printFilters.value.includeRecommendations = false
      break
    
    case 'school':
      reportSections.value.forEach(section => {
        section.enabled = true
        section.printVersion = 'full'
      })
      printFilters.value.includeRecommendations = true
      break
    
    case 'minimal':
      reportSections.value.forEach(section => {
        section.enabled = ['grades', 'behavior'].includes(section.id)
        section.printVersion = 'basic'
      })
      printFilters.value.includeComments = false
      break
    
    case 'complete':
      reportSections.value.forEach(section => {
        section.enabled = true
        section.printVersion = 'full'
      })
      printFilters.value.includeComments = true
      printFilters.value.includeRecommendations = true
      break
  }
}

const previewPrint = () => {
  // Implementation for print preview
  alert(language.value === 'de' ? 'Druckvorschau wird geöffnet...' : 'Opening print preview...')
}

const saveConfiguration = () => {
  // Implementation for saving configuration
  alert(language.value === 'de' ? 'Konfiguration gespeichert!' : 'Configuration saved!')
}

const startBatchPrint = () => {
  // Implementation for starting batch print
  const message = language.value === 'de' 
    ? `Stapeldruck gestartet für ${estimatedPrintCount} Berichte` 
    : `Batch print started for ${estimatedPrintCount} reports`
  
  alert(message)
  showBatchPrintModal.value = false
}

// Utility functions
const getSectionLabel = (sectionId) => {
  const labels = {
    grades: language.value === 'de' ? 'Noten' : 'Grades',
    attendance: language.value === 'de' ? 'Anwesenheit' : 'Attendance',
    comments: language.value === 'de' ? 'Kommentare' : 'Comments',
    behavior: language.value === 'de' ? 'Verhalten' : 'Behavior',
    recommendations: language.value === 'de' ? 'Empfehlungen' : 'Recommendations',
    internal_notes: language.value === 'de' ? 'Interne Notizen' : 'Internal Notes',
    achievements: language.value === 'de' ? 'Erfolge' : 'Achievements'
  }
  return labels[sectionId] || sectionId
}

const getAudienceLabel = (audience) => {
  const labels = {
    parents: language.value === 'de' ? 'Eltern' : 'Parents',
    school: language.value === 'de' ? 'Schule' : 'School',
    both: language.value === 'de' ? 'Beide' : 'Both'
  }
  return labels[audience] || audience
}
</script> 
