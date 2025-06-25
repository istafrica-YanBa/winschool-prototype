<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Type declaration for Quagga since it doesn't have official TypeScript types
declare const Quagga: any

const emit = defineEmits<{
  (e: 'code-scanned', code: string): void
}>()

const isScanning = ref(false)
const scannerElement = ref<HTMLDivElement>()

const startScanner = async () => {
  if (!scannerElement.value) return
  
  try {
    // Dynamically import Quagga to avoid SSR issues
    const QuaggaModule = await import('quagga')
    const QuaggaLib = QuaggaModule.default || QuaggaModule
    
    QuaggaLib.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: scannerElement.value,
        constraints: {
          facingMode: "environment"
        },
      },
      decoder: {
        readers: ["ean_reader", "ean_8_reader", "code_128_reader", "code_39_reader", "upc_reader"]
      }
    }, (err: any) => {
      if (err) {
        console.error('Failed to initialize scanner:', err)
        return
      }
      
      QuaggaLib.start()
      isScanning.value = true
      
      QuaggaLib.onDetected((result: any) => {
        if (result.codeResult.code) {
          emit('code-scanned', result.codeResult.code)
          stopScanner()
        }
      })
    })
  } catch (error) {
    console.error('Failed to load Quagga:', error)
  }
}

const stopScanner = async () => {
  try {
    const QuaggaModule = await import('quagga')
    const QuaggaLib = QuaggaModule.default || QuaggaModule
    QuaggaLib.stop()
    isScanning.value = false
  } catch (error) {
    console.error('Failed to stop scanner:', error)
  }
}

onUnmounted(() => {
  stopScanner()
})
</script>

<template>
  <div class="relative">
    <button
      class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      @click="isScanning ? stopScanner() : startScanner()"
    >
      {{ isScanning ? 'Stop Scanner' : 'Scan Barcode' }}
    </button>
    
    <div
      v-show="isScanning"
      ref="scannerElement"
      class="absolute top-full mt-2 w-64 h-48 bg-black rounded-lg overflow-hidden"
    ></div>
  </div>
</template>

<style scoped>
.drawingBuffer {
  display: none;
}
</style> 