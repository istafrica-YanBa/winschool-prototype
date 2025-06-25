<script setup lang="ts">
import { computed } from 'vue'

interface ChartData {
  label: string
  value: number
  color?: string
}

interface Props {
  data: ChartData[]
  type?: 'bar' | 'pie' | 'line'
  title?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'bar',
  height: '200px'
})

const maxValue = computed(() => Math.max(...props.data.map(d => d.value)))

const getBarHeight = (value: number) => {
  return `${(value / maxValue.value) * 100}%`
}

const getColor = (index: number, customColor?: string) => {
  if (customColor) return customColor
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
  return colors[index % colors.length]
}

const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
    <h3 v-if="title" class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{{ title }}</h3>
    
    <!-- Bar Chart -->
    <div v-if="type === 'bar'" class="space-y-3" :style="{ height }">
      <div class="flex items-end justify-between h-full space-x-2">
        <div 
          v-for="(item, index) in data" 
          :key="index"
          class="flex flex-col items-center flex-1"
        >
          <div class="w-full flex flex-col items-center justify-end h-full">
            <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">{{ item.value }}</div>
            <div 
              class="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
              :style="{ 
                height: getBarHeight(item.value), 
                backgroundColor: getColor(index, item.color),
                minHeight: '4px'
              }"
            ></div>
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">{{ item.label }}</div>
        </div>
      </div>
    </div>

    <!-- Pie Chart (Simple representation) -->
    <div v-else-if="type === 'pie'" class="flex items-center space-x-4">
      <div class="flex-1 space-y-2">
        <div 
          v-for="(item, index) in data" 
          :key="index"
          class="flex items-center justify-between"
        >
          <div class="flex items-center space-x-2">
            <div 
              class="w-4 h-4 rounded-full"
              :style="{ backgroundColor: getColor(index, item.color) }"
            ></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ item.label }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ item.value }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-500">
              ({{ Math.round((item.value / total) * 100) }}%)
            </span>
          </div>
        </div>
      </div>
      
      <!-- Simple circular representation -->
      <div class="w-24 h-24 rounded-full border-8 border-gray-200 dark:border-gray-600 relative">
        <div 
          v-for="(item, index) in data.slice(0, 3)" 
          :key="index"
          class="absolute inset-0 rounded-full"
          :style="{ 
            borderColor: getColor(index, item.color),
            borderWidth: '8px',
            transform: `rotate(${(item.value / total) * 360 * index}deg)`
          }"
        ></div>
      </div>
    </div>

    <!-- Line Chart (Simple representation) -->
    <div v-else-if="type === 'line'" class="space-y-2" :style="{ height }">
      <div class="flex items-end justify-between h-full">
        <div 
          v-for="(item, index) in data" 
          :key="index"
          class="flex flex-col items-center justify-end flex-1"
        >
          <div 
            class="w-2 bg-blue-500 rounded-full"
            :style="{ height: getBarHeight(item.value) }"
          ></div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template> 