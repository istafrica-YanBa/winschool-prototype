<template>
  <div class="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <BookOpen class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Textblock-Steuerung' : 'Text Block Control' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Dynamische Ersetzung und Anordnung von Textblöcken für Berichte.' : 'Dynamic substitution and arrangement of text blocks for reports.' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="toggleView" :class="[
          'w-full sm:w-auto font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base',
          viewMode === 'template' 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-gray-600 hover:bg-gray-700 text-white'
        ]">
          <Eye class="h-4 w-4 mr-2" />
          {{ viewMode === 'template' ? (language === 'de' ? 'Template-Ansicht' : 'Template View') : (language === 'de' ? 'Schüler-Ansicht' : 'Student View') }}
        </button>
        <button @click="addNewTextBlock" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Neuer Block' : 'New Block' }}
        </button>
        <button @click="saveAllBlocks" class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Save class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Speichern' : 'Save All' }}
        </button>
      </div>
    </div>

    <!-- Student Selection for Preview -->
    <div v-if="viewMode === 'student'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
      <div class="flex items-center space-x-4">
        <label class="text-sm font-medium text-slate-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Vorschau für Schüler:' : 'Preview for Student:' }}
        </label>
        <select v-model="selectedPreviewStudent" @change="updatePreview" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
          <option v-for="student in sampleStudents" :key="student.id" :value="student.id">
            {{ student.name }} - {{ student.class }} ({{ language === 'de' ? 'Note:' : 'Grade:' }} {{ student.averageGrade }})
          </option>
        </select>
        <span class="text-sm text-slate-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Anwesenheit:' : 'Attendance:' }} {{ getCurrentStudent()?.attendance || 0 }}%
        </span>
      </div>
    </div>

    <!-- Text Blocks Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Available Text Blocks -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-slate-500 dark:text-white" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Verfügbare Textblöcke' : 'Available Text Blocks' }}
          </h2>
          <div class="flex space-x-2">
            <select v-model="selectedBlockCategory" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;">
              <option value="">{{ language === 'de' ? 'Alle Kategorien' : 'All Categories' }}</option>
              <option value="academic">{{ language === 'de' ? 'Akademisch' : 'Academic' }}</option>
              <option value="behavior">{{ language === 'de' ? 'Verhalten' : 'Behavior' }}</option>
              <option value="attendance">{{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}</option>
              <option value="general">{{ language === 'de' ? 'Allgemein' : 'General' }}</option>
            </select>
          </div>
        </div>

        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div
            v-for="block in filteredTextBlocks"
            :key="block.id"
            class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            :class="getBlockVisibilityClass(block)"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex-1">
                <h3 class="font-medium text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;">
                  {{ block.title }}
                </h3>
                <span :class="getCategoryColor(block.category)" class="px-2 py-1 text-xs font-medium rounded-full mt-1 inline-block" style="font-family: Inter, sans-serif;">
                  {{ getCategoryLabel(block.category) }}
                </span>
              </div>
              <div class="flex space-x-1">
                <button @click="editTextBlock(block)" class="text-blue-600 hover:text-blue-800 p-1">
                  <Edit class="h-4 w-4" />
                </button>
                <button @click="duplicateBlock(block)" class="text-green-600 hover:text-green-800 p-1">
                  <Copy class="h-4 w-4" />
                </button>
                <button @click="deleteBlock(block.id)" class="text-red-600 hover:text-red-800 p-1">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Condition Summary -->
            <div v-if="block.conditions.length > 0" class="mb-2 text-xs text-slate-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1" style="font-family: Inter, sans-serif;">
              <strong>{{ language === 'de' ? 'Bedingung:' : 'Condition:' }}</strong>
              {{ formatConditionSummary(block.conditions[0]) }}
              <span v-if="block.conditions.length > 1">{{ language === 'de' ? ` +${block.conditions.length - 1} mehr` : ` +${block.conditions.length - 1} more` }}</span>
            </div>

            <!-- Text Preview -->
            <div class="text-sm text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
              <div v-if="viewMode === 'template'" class="font-mono text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded border">
                {{ block.content.substring(0, 100) }}{{ block.content.length > 100 ? '...' : '' }}
              </div>
              <div v-else class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded border" v-html="renderBlockForStudent(block)"></div>
            </div>

            <!-- Block Status -->
            <div class="flex justify-between items-center mt-2">
              <span v-if="viewMode === 'student'" :class="[
                'text-xs px-2 py-1 rounded-full font-medium',
                isBlockVisible(block) ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
              ]" style="font-family: Inter, sans-serif;">
                {{ isBlockVisible(block) ? (language === 'de' ? 'Sichtbar' : 'Visible') : (language === 'de' ? 'Ausgeblendet' : 'Hidden') }}
              </span>
              <span class="text-xs text-slate-500 dark:text-gray-400" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Priorität:' : 'Priority:' }} {{ block.priority }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Text Block Editor/Preview -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-slate-500 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
          {{ viewMode === 'template' ? (language === 'de' ? 'Block-Editor' : 'Block Editor') : (language === 'de' ? 'Vorschau-Rendering' : 'Preview Rendering') }}
        </h2>

        <div v-if="viewMode === 'template'" class="space-y-4">
          <!-- Quick Block Creation -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-slate-800 dark:text-white mb-3" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Schnellblock erstellen' : 'Quick Block Creation' }}
            </h3>
            <div class="space-y-3">
              <input
                v-model="quickBlock.title"
                type="text"
                :placeholder="language === 'de' ? 'Block-Titel' : 'Block Title'"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm"
                style="font-family: Inter, sans-serif;"
              />
              <select v-model="quickBlock.category" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;">
                <option value="academic">{{ language === 'de' ? 'Akademisch' : 'Academic' }}</option>
                <option value="behavior">{{ language === 'de' ? 'Verhalten' : 'Behavior' }}</option>
                <option value="attendance">{{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}</option>
                <option value="general">{{ language === 'de' ? 'Allgemein' : 'General' }}</option>
              </select>
              <textarea
                v-model="quickBlock.content"
                rows="3"
                :placeholder="language === 'de' ? 'Block-Inhalt mit Platzhaltern wie {{StudentFirstName}}' : 'Block content with placeholders like {{StudentFirstName}}'"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm font-mono"
                style="font-family: 'Courier New', monospace;"
              ></textarea>
              <button @click="createQuickBlock" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Block erstellen' : 'Create Block' }}
              </button>
            </div>
          </div>

          <!-- Block Templates -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-slate-800 dark:text-white mb-3" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Vorlagen' : 'Templates' }}
            </h3>
            <div class="grid grid-cols-1 gap-2">
              <button
                v-for="template in blockTemplates"
                :key="template.id"
                @click="useTemplate(template)"
                class="text-left p-3 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-lg border border-gray-200 dark:border-gray-500 transition-colors"
              >
                <div class="text-sm font-medium text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  {{ template.title }}
                </div>
                <div class="text-xs text-slate-600 dark:text-gray-400 mt-1" style="font-family: Inter, sans-serif;">
                  {{ template.description }}
                </div>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="space-y-4">
          <!-- Rendered Report Preview -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[400px]">
            <h3 class="font-medium text-slate-800 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Generierter Bericht für' : 'Generated Report for' }} {{ getCurrentStudent()?.name }}
            </h3>
            <div class="space-y-4">
              <div
                v-for="block in visibleBlocksForStudent"
                :key="block.id"
                class="bg-white dark:bg-gray-600 rounded-lg p-4 border-l-4"
                :class="getBlockBorderColor(block.category)"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-sm font-semibold text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                    {{ block.title }}
                  </h4>
                  <span :class="getCategoryColor(block.category)" class="px-2 py-1 text-xs font-medium rounded-full" style="font-family: Inter, sans-serif;">
                    {{ getCategoryLabel(block.category) }}
                  </span>
                </div>
                <div class="text-sm text-slate-700 dark:text-gray-200 leading-relaxed" style="font-family: Inter, sans-serif;" v-html="renderBlockForStudent(block)"></div>
              </div>
            </div>
          </div>

          <!-- Condition Analysis -->
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 class="font-medium text-slate-800 dark:text-white mb-3" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Bedingungsanalyse' : 'Condition Analysis' }}
            </h3>
            <div class="space-y-2 text-sm">
              <div v-for="block in textBlocks" :key="`analysis-${block.id}`" class="flex justify-between items-center">
                <span class="text-slate-700 dark:text-gray-300" style="font-family: Inter, sans-serif;">{{ block.title }}</span>
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  isBlockVisible(block) ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                ]" style="font-family: Inter, sans-serif;">
                  {{ isBlockVisible(block) ? (language === 'de' ? 'Eingeschlossen' : 'Included') : (language === 'de' ? 'Ausgeschlossen' : 'Excluded') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Text Block Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
          {{ editingBlock?.id ? (language === 'de' ? 'Textblock bearbeiten' : 'Edit Text Block') : (language === 'de' ? 'Neuer Textblock' : 'New Text Block') }}
        </h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Block Configuration -->
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
                  {{ language === 'de' ? 'Titel' : 'Title' }}
                </label>
                <input v-model="blockForm.title" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
                  {{ language === 'de' ? 'Kategorie' : 'Category' }}
                </label>
                <select v-model="blockForm.category" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  <option value="academic">{{ language === 'de' ? 'Akademisch' : 'Academic' }}</option>
                  <option value="behavior">{{ language === 'de' ? 'Verhalten' : 'Behavior' }}</option>
                  <option value="attendance">{{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}</option>
                  <option value="general">{{ language === 'de' ? 'Allgemein' : 'General' }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Inhalt' : 'Content' }}
              </label>
              <textarea v-model="blockForm.content" rows="6" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white font-mono" style="font-family: 'Courier New', monospace;" :placeholder="language === 'de' ? 'Text mit Platzhaltern...' : 'Text with placeholders...'"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
                  {{ language === 'de' ? 'Priorität' : 'Priority' }}
                </label>
                <input v-model.number="blockForm.priority" type="number" min="1" max="10" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
                  {{ language === 'de' ? 'Status' : 'Status' }}
                </label>
                <select v-model="blockForm.active" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  <option :value="true">{{ language === 'de' ? 'Aktiv' : 'Active' }}</option>
                  <option :value="false">{{ language === 'de' ? 'Inaktiv' : 'Inactive' }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Conditions Configuration -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h4 class="font-medium text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Anzeigebedingungen' : 'Display Conditions' }}
              </h4>
              <button @click="addCondition" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm" style="font-family: Inter, sans-serif;">
                {{ language === 'de' ? 'Bedingung hinzufügen' : 'Add Condition' }}
              </button>
            </div>

            <div class="space-y-3 max-h-64 overflow-y-auto">
              <div v-for="(condition, index) in blockForm.conditions" :key="index" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-sm font-medium text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                    {{ language === 'de' ? 'Bedingung' : 'Condition' }} {{ index + 1 }}
                  </span>
                  <button @click="removeCondition(index)" class="text-red-600 hover:text-red-800">
                    <X class="h-4 w-4" />
                  </button>
                </div>
                
                <div class="grid grid-cols-3 gap-2">
                  <select v-model="condition.field" class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;">
                    <option value="averageGrade">{{ language === 'de' ? 'Durchschnittsnote' : 'Average Grade' }}</option>
                    <option value="attendance">{{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}</option>
                    <option value="behavior">{{ language === 'de' ? 'Verhalten' : 'Behavior' }}</option>
                    <option value="class">{{ language === 'de' ? 'Klasse' : 'Class' }}</option>
                    <option value="subject">{{ language === 'de' ? 'Fach' : 'Subject' }}</option>
                  </select>
                  
                  <select v-model="condition.operator" class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;">
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                    <option value=">=">&gt;=</option>
                    <option value="<=">&lt;=</option>
                    <option value="=">=</option>
                    <option value="!=">&ne;</option>
                  </select>
                  
                  <input v-model="condition.value" type="text" class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="showEditModal = false" class="px-4 py-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
          </button>
          <button @click="saveTextBlock" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Speichern' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Plus, Save, Edit, Copy, Trash2, Eye, X, BookOpen } from 'lucide-vue-next'

// --- Domain Types (see autocoding/context/ and frontend patterns) ---
interface BlockCondition {
  field: 'averageGrade' | 'attendance' | 'behavior' | 'class' | 'subject' | 'name';
  operator: '>' | '<' | '>=' | '<=' | '=' | '!=' | 'contains';
  value: string;
}
interface TextBlock {
  id: number;
  title: string;
  category: 'academic' | 'behavior' | 'attendance' | 'general';
  content: string;
  priority: number;
  active: boolean;
  conditions: BlockCondition[];
}
interface BlockTemplate {
  id: number;
  title: string;
  description: string;
  category: 'academic' | 'behavior' | 'attendance' | 'general';
  content: string;
  conditions: BlockCondition[];
}
interface Student {
  id: string;
  name: string;
  averageGrade: number;
  attendance: number;
  behavior: string;
  class: string;
  subjects: string[];
}

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State
const viewMode = ref<'template' | 'student'>('template')
const selectedBlockCategory = ref<string>('')
const selectedPreviewStudent = ref<string>('1')
const showEditModal = ref(false)
const editingBlock = ref<TextBlock | null>(null)

// Sample students for preview
const sampleStudents = ref<Student[]>([
  { id: '1', name: 'Max Mustermann', class: '10A', averageGrade: 2.1, attendance: 95, behavior: 'excellent', subjects: ['Mathematics', 'Physics', 'German'] },
  { id: '2', name: 'Emma Schmidt', class: '10B', averageGrade: 1.8, attendance: 88, behavior: 'good', subjects: ['Biology', 'Chemistry', 'English'] },
  { id: '3', name: 'Noah Fischer', class: '11A', averageGrade: 3.2, attendance: 72, behavior: 'needs_improvement', subjects: ['History', 'Geography', 'Art'] }
])

// Quick block form
const quickBlock = ref<{ title: string; category: TextBlock['category']; content: string }>({
  title: '',
  category: 'general',
  content: ''
})

// Text block form
const blockForm = ref<Omit<TextBlock, 'id'> & { conditions: BlockCondition[] }>({
  title: '',
  category: 'general',
  content: '',
  priority: 5,
  active: true,
  conditions: []
})

// Text blocks data
const textBlocks = ref<TextBlock[]>([
  {
    id: 1,
    title: language.value === 'de' ? 'Exzellente Leistung' : 'Excellent Performance',
    category: 'academic',
    content: language.value === 'de' 
      ? '{{StudentFirstName}} zeigt hervorragende Leistungen in allen Bereichen mit einem Durchschnitt von {{AverageGrade}}. Besonders bemerkenswert ist die Leistung in {{BestSubject}}.'
      : '{{StudentFirstName}} shows excellent performance in all areas with an average of {{AverageGrade}}. Particularly noteworthy is the performance in {{BestSubject}}.',
    priority: 9,
    active: true,
    conditions: [
      { field: 'averageGrade', operator: '<=', value: '2.0' }
    ]
  },
  {
    id: 2,
    title: language.value === 'de' ? 'Verbesserung erforderlich' : 'Improvement Needed',
    category: 'academic',
    content: language.value === 'de'
      ? '{{StudentFirstName}} sollte sich in den kommenden Wochen mehr anstrengen. Mit einem Durchschnitt von {{AverageGrade}} besteht Verbesserungsbedarf.'
      : '{{StudentFirstName}} should put more effort in the coming weeks. With an average of {{AverageGrade}}, there is room for improvement.',
    priority: 7,
    active: true,
    conditions: [
      { field: 'averageGrade', operator: '>', value: '3.0' }
    ]
  },
  {
    id: 3,
    title: language.value === 'de' ? 'Anwesenheitsproblem' : 'Attendance Issue',
    category: 'attendance',
    content: language.value === 'de'
      ? 'Die Anwesenheit von {{StudentFirstName}} liegt bei nur {{Attendance}}%. Eine regelmäßigere Teilnahme am Unterricht ist für den Lernerfolg essentiell.'
      : "{{StudentFirstName}}'s attendance is only {{Attendance}}%. More regular participation in class is essential for learning success.",
    priority: 8,
    active: true,
    conditions: [
      { field: 'attendance', operator: '<', value: '80' }
    ]
  },
  {
    id: 4,
    title: language.value === 'de' ? 'Vorbildliches Verhalten' : 'Exemplary Behavior',
    category: 'behavior',
    content: language.value === 'de'
      ? '{{StudentFirstName}} zeigt durchweg vorbildliches Verhalten und ist eine Bereicherung für die Klassengemeinschaft.'
      : '{{StudentFirstName}} consistently shows exemplary behavior and is an asset to the class community.',
    priority: 6,
    active: true,
    conditions: [
      { field: 'behavior', operator: '=', value: 'excellent' }
    ]
  },
  {
    id: 5,
    title: language.value === 'de' ? 'Allgemeine Wertschätzung' : 'General Appreciation',
    category: 'general',
    content: language.value === 'de'
      ? 'Es war ein Vergnügen, {{StudentFirstName}} in diesem Semester zu unterrichten. Wir wünschen weiterhin viel Erfolg.'
      : 'It was a pleasure to teach {{StudentFirstName}} this semester. We wish continued success.',
    priority: 3,
    active: true,
    conditions: []
  }
])

// Block templates
const blockTemplates = ref<BlockTemplate[]>([
  {
    id: 1,
    title: language.value === 'de' ? 'Notenbezogener Kommentar' : 'Grade-based Comment',
    description: language.value === 'de' ? 'Automatischer Kommentar basierend auf Noten' : 'Automatic comment based on grades',
    category: 'academic',
    content: language.value === 'de'
      ? '{{StudentFirstName}} hat in diesem Semester einen Notendurchschnitt von {{AverageGrade}} erreicht.'
      : '{{StudentFirstName}} achieved a grade average of {{AverageGrade}} this semester.',
    conditions: []
  },
  {
    id: 2,
    title: language.value === 'de' ? 'Anwesenheitskommentar' : 'Attendance Comment',
    description: language.value === 'de' ? 'Kommentar zur Anwesenheitsquote' : 'Comment on attendance rate',
    category: 'attendance',
    content: language.value === 'de'
      ? 'Mit einer Anwesenheitsquote von {{Attendance}}% zeigt {{StudentFirstName}} {{AttendanceDescription}}.'
      : 'With an attendance rate of {{Attendance}}%, {{StudentFirstName}} shows {{AttendanceDescription}}.',
    conditions: []
  }
])

// Computed properties
const filteredTextBlocks = computed<TextBlock[]>(() => {
  if (!selectedBlockCategory.value) return textBlocks.value
  return textBlocks.value.filter(block => block.category === selectedBlockCategory.value)
})

const visibleBlocksForStudent = computed<TextBlock[]>(() => {
  if (viewMode.value !== 'student') return []
  return textBlocks.value
    .filter(block => block.active && isBlockVisible(block))
    .sort((a, b) => b.priority - a.priority)
})

// Methods (all params typed)
const toggleView = (): void => {
  viewMode.value = viewMode.value === 'template' ? 'student' : 'template'
  if (viewMode.value === 'student') {
    updatePreview()
  }
}

const getCurrentStudent = (): Student | undefined => {
  return sampleStudents.value.find((s: Student) => s.id === selectedPreviewStudent.value)
}

const updatePreview = (): void => {
  // Trigger reactivity update
}

const isBlockVisible = (block: TextBlock): boolean => {
  if (!block.conditions || block.conditions.length === 0) return true
  const student = getCurrentStudent()
  if (!student) return false
  return block.conditions.every((condition: BlockCondition) => {
    const studentValue = String(getStudentFieldValue(student, condition.field))
    const conditionValue = String(condition.value)
    switch (condition.operator) {
      case '>': return parseFloat(studentValue) > parseFloat(conditionValue)
      case '<': return parseFloat(studentValue) < parseFloat(conditionValue)
      case '>=': return parseFloat(studentValue) >= parseFloat(conditionValue)
      case '<=': return parseFloat(studentValue) <= parseFloat(conditionValue)
      case '=': return studentValue === conditionValue
      case '!=': return studentValue !== conditionValue
      case 'contains': return studentValue.toLowerCase().includes(conditionValue.toLowerCase())
      default: return true
    }
  })
}

const getStudentFieldValue = (student: Student, field: BlockCondition['field']): string | number => {
  const fieldMap: Record<BlockCondition['field'], string | number> = {
    averageGrade: student.averageGrade,
    attendance: student.attendance,
    behavior: student.behavior,
    class: student.class,
    subject: student.subjects.join(', ') || '',
    name: student.name
  }
  return fieldMap[field]
}

const renderBlockForStudent = (block: TextBlock): string => {
  const student = getCurrentStudent()
  if (!student) return block.content
  let content = block.content
  // Replace placeholders
  content = content.replace(/\{\{StudentFirstName\}\}/g, student.name.split(' ')[0])
  content = content.replace(/\{\{StudentLastName\}\}/g, student.name.split(' ').slice(1).join(' '))
  content = content.replace(/\{\{AverageGrade\}\}/g, student.averageGrade.toString())
  content = content.replace(/\{\{Attendance\}\}/g, student.attendance.toString())
  content = content.replace(/\{\{BestSubject\}\}/g, student.subjects[0] || 'N/A')
  // Add attendance description
  let attendanceDesc = 'good attendance'
  if (language.value === 'de') {
    attendanceDesc = student.attendance >= 90 ? 'sehr gute Anwesenheit' : 
                    student.attendance >= 80 ? 'gute Anwesenheit' : 'verbesserungsfähige Anwesenheit'
  } else {
    attendanceDesc = student.attendance >= 90 ? 'excellent attendance' : 
                    student.attendance >= 80 ? 'good attendance' : 'poor attendance'
  }
  content = content.replace(/\{\{AttendanceDescription\}\}/g, attendanceDesc)
  return content
}

const getBlockVisibilityClass = (block: TextBlock): string => {
  if (viewMode.value !== 'student') return ''
  return isBlockVisible(block) ? 'border-green-200 dark:border-green-700' : 'border-red-200 dark:border-red-700 opacity-60'
}

const formatConditionSummary = (condition: BlockCondition): string => {
  const fieldNames: Record<BlockCondition['field'], string> = {
    averageGrade: language.value === 'de' ? 'Note' : 'Grade',
    attendance: language.value === 'de' ? 'Anwesenheit' : 'Attendance',
    behavior: language.value === 'de' ? 'Verhalten' : 'Behavior',
    class: language.value === 'de' ? 'Klasse' : 'Class',
    name: language.value === 'de' ? 'Name' : 'Name',
    subject: language.value === 'de' ? 'Fach' : 'Subject'
  }
  return `${fieldNames[condition.field] || condition.field} ${condition.operator} ${condition.value}`
}

const addNewTextBlock = (): void => {
  editingBlock.value = null
  blockForm.value = {
    title: '',
    category: 'general',
    content: '',
    priority: 5,
    active: true,
    conditions: []
  }
  showEditModal.value = true
}

const editTextBlock = (block: TextBlock): void => {
  editingBlock.value = block
  blockForm.value = { ...block }
  showEditModal.value = true
}

const saveTextBlock = (): void => {
  if (!blockForm.value.title || !blockForm.value.content) return
  if (editingBlock.value) {
    // Update existing
    const blockId = editingBlock.value.id
    if (blockId) {
      const index = textBlocks.value.findIndex((b: TextBlock) => b.id === blockId)
      if (index !== -1) {
        textBlocks.value[index] = { ...blockForm.value, id: blockId }
      }
    }
  } else {
    // Add new
    const newBlock: TextBlock = {
      ...blockForm.value,
      id: Date.now()
    }
    textBlocks.value.push(newBlock)
  }
  showEditModal.value = false
}

const duplicateBlock = (block: TextBlock): void => {
  const newBlock: TextBlock = {
    ...block,
    id: Date.now(),
    title: `${block.title} (Copy)`
  }
  textBlocks.value.push(newBlock)
}

const deleteBlock = (id: number): void => {
  if (confirm(language.value === 'de' ? 'Block wirklich löschen?' : 'Really delete block?')) {
    const index = textBlocks.value.findIndex((b: TextBlock) => b.id === id)
    if (index !== -1) {
      textBlocks.value.splice(index, 1)
    }
  }
}

const createQuickBlock = (): void => {
  if (!quickBlock.value.title || !quickBlock.value.content) return
  const newBlock: TextBlock = {
    id: Date.now(),
    title: quickBlock.value.title,
    category: quickBlock.value.category,
    content: quickBlock.value.content,
    priority: 5,
    active: true,
    conditions: []
  }
  textBlocks.value.push(newBlock)
  // Reset form
  quickBlock.value = {
    title: '',
    category: 'general',
    content: ''
  }
}

const useTemplate = (template: BlockTemplate): void => {
  const newBlock: TextBlock = {
    id: Date.now(),
    title: template.title,
    category: template.category,
    content: template.content,
    priority: 5,
    active: true,
    conditions: [...template.conditions]
  }
  textBlocks.value.push(newBlock)
}

const addCondition = (): void => {
  blockForm.value.conditions.push({
    field: 'averageGrade',
    operator: '>',
    value: ''
  })
}

const removeCondition = (index: number): void => {
  blockForm.value.conditions.splice(index, 1)
}

const saveAllBlocks = (): void => {
  alert(language.value === 'de' ? 'Alle Textblöcke gespeichert!' : 'All text blocks saved!')
}

// Utility functions
const getCategoryColor = (category: TextBlock['category']): string => {
  const colors: Record<TextBlock['category'], string> = {
    academic: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    behavior: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    attendance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    general: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
  }
  return colors[category] || colors.general
}

const getCategoryLabel = (category: TextBlock['category']): string => {
  const labels: Record<TextBlock['category'], string> = {
    academic: language.value === 'de' ? 'Akademisch' : 'Academic',
    behavior: language.value === 'de' ? 'Verhalten' : 'Behavior',
    attendance: language.value === 'de' ? 'Anwesenheit' : 'Attendance',
    general: language.value === 'de' ? 'Allgemein' : 'General'
  }
  return labels[category] || category
}

const getBlockBorderColor = (category: TextBlock['category']): string => {
  const colors: Record<TextBlock['category'], string> = {
    academic: 'border-blue-500',
    behavior: 'border-green-500',
    attendance: 'border-yellow-500',
    general: 'border-gray-500'
  }
  return colors[category] || colors.general
}
</script> 
