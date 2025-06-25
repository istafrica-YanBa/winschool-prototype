<template>
  <div class="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Settings class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Logikregeln' : 'Logic Rules' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Hier können Sie IF/THEN/ELSE-Regeln für Berichte visuell erstellen.' : 'Here you can visually create IF/THEN/ELSE rules for reports.' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="addNewRule" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Neue Regel' : 'New Rule' }}
        </button>
        <button @click="saveAllRules" class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Save class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Speichern' : 'Save All' }}
        </button>
      </div>
    </div>

    <!-- Rule Sets Management -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-slate-500 dark:text-white" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Regelsätze' : 'Rule Sets' }}
        </h2>
        <select v-model="selectedRuleSet" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
          <option value="">{{ language === 'de' ? 'Regelsatz wählen' : 'Select Rule Set' }}</option>
          <option v-for="ruleSet in ruleSets" :key="ruleSet.id" :value="ruleSet.id">{{ ruleSet.name }}</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div v-for="ruleSet in ruleSets" :key="ruleSet.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" @click="loadRuleSet(ruleSet)">
          <h3 class="font-medium text-slate-800 dark:text-white mb-2" style="font-family: Inter, sans-serif;">{{ ruleSet.name }}</h3>
          <p class="text-sm text-slate-600 dark:text-gray-400 mb-3" style="font-family: Inter, sans-serif;">{{ ruleSet.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-500 dark:text-gray-500" style="font-family: Inter, sans-serif;">{{ ruleSet.rules.length }} rules</span>
            <button @click.stop="deleteRuleSet(ruleSet.id)" class="text-red-500 hover:text-red-700">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Rule Builder -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
        {{ language === 'de' ? 'Regel-Editor' : 'Rule Editor' }}
      </h2>

      <!-- Rules List -->
      <div class="space-y-4">
        <div v-for="(rule, index) in currentRules" :key="rule.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
          <div class="flex justify-between items-start mb-4">
            <h3 class="font-medium text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Regel' : 'Rule' }} {{ index + 1 }}
            </h3>
            <button @click="removeRule(index)" class="text-red-500 hover:text-red-700">
              <X class="h-4 w-4" />
            </button>
          </div>

          <!-- IF Condition -->
          <div class="space-y-3">
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div class="flex items-center mb-3">
                <span class="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium mr-3" style="font-family: Inter, sans-serif;">IF</span>
                <span class="text-slate-800 dark:text-white font-medium" style="font-family: Inter, sans-serif;">Condition</span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                <select v-model="rule.condition.field" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  <option value="">{{ language === 'de' ? 'Feld wählen' : 'Select Field' }}</option>
                  <option value="grade">{{ language === 'de' ? 'Note' : 'Grade' }}</option>
                  <option value="subject">{{ language === 'de' ? 'Fach' : 'Subject' }}</option>
                  <option value="courseType">{{ language === 'de' ? 'Kurstyp' : 'Course Type' }}</option>
                  <option value="class">{{ language === 'de' ? 'Klasse' : 'Class' }}</option>
                  <option value="semester">{{ language === 'de' ? 'Semester' : 'Semester' }}</option>
                  <option value="attendance">{{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}</option>
                  <option value="conduct">{{ language === 'de' ? 'Verhalten' : 'Conduct' }}</option>
                </select>

                <select v-model="rule.condition.operator" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  <option value="">{{ language === 'de' ? 'Operator' : 'Operator' }}</option>
                  <option value="equals">{{ language === 'de' ? 'Gleich' : 'Equals' }}</option>
                  <option value="notEquals">{{ language === 'de' ? 'Ungleich' : 'Not Equals' }}</option>
                  <option value="greater">{{ language === 'de' ? 'Größer als' : 'Greater than' }}</option>
                  <option value="less">{{ language === 'de' ? 'Kleiner als' : 'Less than' }}</option>
                  <option value="greaterEqual">{{ language === 'de' ? 'Größer gleich' : 'Greater or equal' }}</option>
                  <option value="lessEqual">{{ language === 'de' ? 'Kleiner gleich' : 'Less or equal' }}</option>
                  <option value="contains">{{ language === 'de' ? 'Enthält' : 'Contains' }}</option>
                </select>

                <input v-model="rule.condition.value" type="text" :placeholder="language === 'de' ? 'Wert' : 'Value'" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;" />

                <button @click="addAndCondition(rule)" class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm" style="font-family: Inter, sans-serif;">
                  + AND
                </button>
              </div>

              <!-- Additional AND conditions -->
              <div v-for="(andCondition, andIndex) in rule.condition.andConditions" :key="andIndex" class="mt-3 pl-4 border-l-2 border-blue-300">
                <div class="flex items-center mb-2">
                  <span class="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium mr-3" style="font-family: Inter, sans-serif;">AND</span>
                  <button @click="removeAndCondition(rule, andIndex)" class="text-red-500 hover:text-red-700 ml-auto">
                    <X class="h-3 w-3" />
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select v-model="andCondition.field" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;">
                    <option value="">{{ language === 'de' ? 'Feld wählen' : 'Select Field' }}</option>
                    <option value="grade">{{ language === 'de' ? 'Note' : 'Grade' }}</option>
                    <option value="subject">{{ language === 'de' ? 'Fach' : 'Subject' }}</option>
                    <option value="courseType">{{ language === 'de' ? 'Kurstyp' : 'Course Type' }}</option>
                    <option value="class">{{ language === 'de' ? 'Klasse' : 'Class' }}</option>
                    <option value="semester">{{ language === 'de' ? 'Semester' : 'Semester' }}</option>
                  </select>
                  <select v-model="andCondition.operator" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;">
                    <option value="equals">{{ language === 'de' ? 'Gleich' : 'Equals' }}</option>
                    <option value="greater">{{ language === 'de' ? 'Größer als' : 'Greater than' }}</option>
                    <option value="less">{{ language === 'de' ? 'Kleiner als' : 'Less than' }}</option>
                  </select>
                  <input v-model="andCondition.value" type="text" :placeholder="language === 'de' ? 'Wert' : 'Value'" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white text-sm" style="font-family: Inter, sans-serif;" />
                </div>
              </div>
            </div>

            <!-- THEN Action -->
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <div class="flex items-center mb-3">
                <span class="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium mr-3" style="font-family: Inter, sans-serif;">THEN</span>
                <span class="text-slate-800 dark:text-white font-medium" style="font-family: Inter, sans-serif;">Action</span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select v-model="rule.action.type" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  <option value="">{{ language === 'de' ? 'Aktion wählen' : 'Select Action' }}</option>
                  <option value="includeBlock">{{ language === 'de' ? 'Block einschließen' : 'Include Block' }}</option>
                  <option value="excludeBlock">{{ language === 'de' ? 'Block ausschließen' : 'Exclude Block' }}</option>
                  <option value="showWarning">{{ language === 'de' ? 'Warnung anzeigen' : 'Show Warning' }}</option>
                  <option value="addComment">{{ language === 'de' ? 'Kommentar hinzufügen' : 'Add Comment' }}</option>
                  <option value="changeGrade">{{ language === 'de' ? 'Note ändern' : 'Change Grade' }}</option>
                </select>
                
                <input v-model="rule.action.value" type="text" :placeholder="language === 'de' ? 'Aktion-Wert' : 'Action Value'" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;" />
              </div>
            </div>

            <!-- ELSE Action (Optional) -->
            <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <span class="bg-orange-600 text-white px-2 py-1 rounded text-sm font-medium mr-3" style="font-family: Inter, sans-serif;">ELSE</span>
                  <span class="text-slate-800 dark:text-white font-medium" style="font-family: Inter, sans-serif;">Alternative Action</span>
                </div>
                <label class="flex items-center">
                  <input v-model="rule.hasElse" type="checkbox" class="mr-2">
                  <span class="text-sm text-slate-600 dark:text-gray-400" style="font-family: Inter, sans-serif;">{{ language === 'de' ? 'ELSE verwenden' : 'Use ELSE' }}</span>
                </label>
              </div>
              
              <div v-if="rule.hasElse" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select v-model="rule.elseAction.type" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;">
                  <option value="">{{ language === 'de' ? 'ELSE-Aktion wählen' : 'Select ELSE Action' }}</option>
                  <option value="includeBlock">{{ language === 'de' ? 'Block einschließen' : 'Include Block' }}</option>
                  <option value="excludeBlock">{{ language === 'de' ? 'Block ausschließen' : 'Exclude Block' }}</option>
                  <option value="showWarning">{{ language === 'de' ? 'Warnung anzeigen' : 'Show Warning' }}</option>
                  <option value="addComment">{{ language === 'de' ? 'Kommentar hinzufügen' : 'Add Comment' }}</option>
                </select>
                
                <input v-model="rule.elseAction.value" type="text" :placeholder="language === 'de' ? 'ELSE-Wert' : 'ELSE Value'" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Rule Button -->
      <button @click="addNewRule" class="w-full mt-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-slate-800 dark:text-white px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 transition-colors" style="font-family: Inter, sans-serif;">
        <Plus class="h-4 w-4 mx-auto mb-1" />
        {{ language === 'de' ? 'Neue Regel hinzufügen' : 'Add New Rule' }}
      </button>
    </div>

    <!-- Rule Preview -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
        {{ language === 'de' ? 'Regel-Vorschau' : 'Rule Preview' }}
      </h2>
      
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm">
        <div v-for="(rule, index) in currentRules" :key="rule.id" class="mb-4 last:mb-0">
          <div class="text-slate-800 dark:text-white">
            <span class="text-blue-600 font-bold">IF</span>
            {{ formatCondition(rule.condition) }}
            <span v-for="andCondition in rule.condition.andConditions" :key="andCondition">
              <span class="text-blue-500 font-bold"> AND</span>
              {{ formatCondition(andCondition) }}
            </span>
          </div>
          <div class="text-slate-800 dark:text-white mt-1">
            <span class="text-green-600 font-bold">THEN</span>
            {{ formatAction(rule.action) }}
          </div>
          <div v-if="rule.hasElse" class="text-slate-800 dark:text-white mt-1">
            <span class="text-orange-600 font-bold">ELSE</span>
            {{ formatAction(rule.elseAction) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Save Rule Set Modal -->
    <div v-if="showSaveModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4" style="font-family: Inter, sans-serif;">
          {{ language === 'de' ? 'Regelsatz speichern' : 'Save Rule Set' }}
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Name' : 'Name' }}
            </label>
            <input v-model="newRuleSetName" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2" style="font-family: Inter, sans-serif;">
              {{ language === 'de' ? 'Beschreibung' : 'Description' }}
            </label>
            <textarea v-model="newRuleSetDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white" style="font-family: Inter, sans-serif;"></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="showSaveModal = false" class="px-4 py-2 text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white" style="font-family: Inter, sans-serif;">
            {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
          </button>
          <button @click="saveRuleSet" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" style="font-family: Inter, sans-serif;">
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
import { Plus, Save, Trash2, X, Settings } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State
const selectedRuleSet = ref('')
const showSaveModal = ref(false)
const newRuleSetName = ref('')
const newRuleSetDescription = ref('')

// Rule structure
const currentRules = ref([])

const ruleSets = ref([
  {
    id: 'default',
    name: language.value === 'de' ? 'Standard Regeln' : 'Default Rules',
    description: language.value === 'de' ? 'Grundlegende Regeln für Zeugnisse' : 'Basic rules for report cards',
    rules: []
  },
  {
    id: 'advanced',
    name: language.value === 'de' ? 'Erweiterte Regeln' : 'Advanced Rules',
    description: language.value === 'de' ? 'Komplexe Regeln für spezielle Fälle' : 'Complex rules for special cases',
    rules: []
  }
])

// Methods
const addNewRule = () => {
  const newRule = {
    id: Date.now(),
    condition: {
      field: '',
      operator: '',
      value: '',
      andConditions: []
    },
    action: {
      type: '',
      value: ''
    },
    hasElse: false,
    elseAction: {
      type: '',
      value: ''
    }
  }
  currentRules.value.push(newRule)
}

const removeRule = (index) => {
  currentRules.value.splice(index, 1)
}

const addAndCondition = (rule) => {
  rule.condition.andConditions.push({
    field: '',
    operator: '',
    value: ''
  })
}

const removeAndCondition = (rule, index) => {
  rule.condition.andConditions.splice(index, 1)
}

const loadRuleSet = (ruleSet) => {
  currentRules.value = [...ruleSet.rules]
  selectedRuleSet.value = ruleSet.id
}

const deleteRuleSet = (id) => {
  if (confirm(language.value === 'de' ? 'Regelsatz wirklich löschen?' : 'Really delete rule set?')) {
    const index = ruleSets.value.findIndex(rs => rs.id === id)
    if (index !== -1) {
      ruleSets.value.splice(index, 1)
    }
  }
}

const saveAllRules = () => {
  showSaveModal.value = true
}

const saveRuleSet = () => {
  if (!newRuleSetName.value.trim()) return
  
  const newRuleSet = {
    id: Date.now().toString(),
    name: newRuleSetName.value,
    description: newRuleSetDescription.value,
    rules: [...currentRules.value]
  }
  
  ruleSets.value.push(newRuleSet)
  showSaveModal.value = false
  newRuleSetName.value = ''
  newRuleSetDescription.value = ''
  
  // Show success message
  alert(language.value === 'de' ? 'Regelsatz gespeichert!' : 'Rule set saved!')
}

const formatCondition = (condition) => {
  if (!condition.field || !condition.operator || !condition.value) return ''
  
  const operatorMap = {
    equals: '=',
    notEquals: '≠',
    greater: '>',
    less: '<',
    greaterEqual: '≥',
    lessEqual: '≤',
    contains: 'contains'
  }
  
  return `${condition.field} ${operatorMap[condition.operator] || condition.operator} "${condition.value}"`
}

const formatAction = (action) => {
  if (!action.type || !action.value) return ''
  
  const actionMap = {
    includeBlock: language.value === 'de' ? 'Block einschließen' : 'Include Block',
    excludeBlock: language.value === 'de' ? 'Block ausschließen' : 'Exclude Block',
    showWarning: language.value === 'de' ? 'Warnung anzeigen' : 'Show Warning',
    addComment: language.value === 'de' ? 'Kommentar hinzufügen' : 'Add Comment',
    changeGrade: language.value === 'de' ? 'Note ändern' : 'Change Grade'
  }
  
  return `${actionMap[action.type] || action.type}: "${action.value}"`
}

// Initialize with a sample rule
addNewRule()
</script> 
