<template>
  <div class="space-y-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      {{ isImport 
        ? (language === 'de' ? 'Vorlagen importieren' : 'Import Templates')
        : (language === 'de' ? 'Vorlagen exportieren' : 'Export Templates') }}
    </h3>

    <div v-if="isImport">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ language === 'de' ? 'Datei hochladen' : 'Upload File' }}
      </label>
      <div class="flex items-center justify-center w-full">
        <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
          <div class="flex flex-col items-center justify-center pt-7">
            <Upload class="w-8 h-8 text-gray-400" />
            <p class="pt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ language === 'de' ? '.wsv-Datei hierher ziehen oder klicken' : 'Drag .wsv file here or click to upload' }}
            </p>
          </div>
          <input type="file" class="hidden" @change="handleFileUpload" />
        </label>
      </div>
    </div>

    <div v-else>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ language === 'de' ? 'Zu exportierende Vorlagen' : 'Templates to Export' }}
      </label>
      <div class="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2">
        <div v-for="template in templates" :key="template.id" class="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
          <input
            v-model="selectedTemplates"
            type="checkbox"
            :value="template.id"
            class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
          />
          <span class="text-sm text-gray-900 dark:text-white">{{ template.name }}</span>
        </div>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ isImport 
          ? (language === 'de' ? 'Import-Optionen' : 'Import Options')
          : (language === 'de' ? 'Export-Optionen' : 'Export Options') }}
      </label>
      <div class="space-y-2">
        <label v-if="isImport" class="flex items-center">
          <input
            v-model="options.renameExisting"
            type="checkbox"
            class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
          />
          <span class="text-sm text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Bestehende Vorlagen umbenennen (~ Präfix)' : 'Rename existing templates (~ prefix)' }}
          </span>
        </label>
        <label class="flex items-center">
          <input
            v-model="options.preserveCategories"
            type="checkbox"
            class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
          />
          <span class="text-sm text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Kategorisierung beibehalten' : 'Preserve categorization' }}
          </span>
        </label>
      </div>
    </div>

    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <div class="flex items-start">
        <InfoIcon class="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
        <p class="text-sm text-blue-600 dark:text-blue-300">
          {{ isImport 
            ? (language === 'de' 
                ? 'Importierte Vorlagen werden in den entsprechenden Kategorien gespeichert. Wenn eine Kategorie nicht existiert, wird sie erstellt.' 
                : 'Imported templates will be stored in their respective categories. If a category does not exist, it will be created.')
            : (language === 'de'
                ? 'Exportierte Vorlagen werden in einer .wsv-Datei gespeichert, die mit anderen WinSchool-Installationen geteilt werden kann.'
                : 'Exported templates will be saved in a .wsv file that can be shared with other WinSchool installations.') }}
        </p>
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button @click="$emit('cancel')" class="btn-secondary">
        {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
      </button>
      <button @click="processTemplates" class="btn-primary">
        {{ isImport 
          ? (language === 'de' ? 'Importieren' : 'Import')
          : (language === 'de' ? 'Exportieren' : 'Export') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { Upload, InfoIcon } from 'lucide-vue-next'

// Type definitions
interface Template {
  id: string;
  name: string;
}

const props = defineProps<{
  isImport: boolean;
  templates: Template[];
}>()

const emit = defineEmits(['process', 'cancel'])

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Form state
const selectedTemplates = ref<string[]>([])
const options = ref({
  renameExisting: true,
  preserveCategories: true
})
const uploadedFile = ref<File | null>(null)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    uploadedFile.value = target.files[0]
  }
}

const processTemplates = () => {
  if (props.isImport) {
    if (!uploadedFile.value) {
      alert(language.value === 'de' ? 'Bitte wählen Sie eine Datei aus.' : 'Please select a file.')
      return
    }
    
    emit('process', {
      file: uploadedFile.value,
      options: options.value
    })
  } else {
    if (selectedTemplates.value.length === 0) {
      alert(language.value === 'de' ? 'Bitte wählen Sie mindestens eine Vorlage aus.' : 'Please select at least one template.')
      return
    }
    
    emit('process', {
      templateIds: selectedTemplates.value,
      options: options.value
    })
  }
}
</script>