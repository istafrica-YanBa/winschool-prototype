<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Gebäude- und Raumverwaltung' : 'Buildings & Rooms Management' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ language === 'de' ? 'Verwalten Sie Schulgebäude, Räume und Standorte' : 'Manage school buildings, rooms, and locations' }}
        </p>
      </div>
      <div class="flex space-x-2">
        <button @click="showRoomModal = true" class="btn-secondary flex items-center">
          <DoorOpen class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Raum hinzufügen' : 'Add Room' }}
        </button>
        <button @click="showBuildingModal = true" class="btn-primary flex items-center">
          <Building class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Gebäude hinzufügen' : 'Add Building' }}
        </button>
      </div>
    </div>

    <!-- Buildings Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="building in buildings" :key="building.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center">
            <div class="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-4">
              <Building class="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ building.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ building.address }}</p>
            </div>
          </div>
          <div class="flex space-x-1">
            <span v-if="building.isMainLocation" class="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
              {{ language === 'de' ? 'Hauptstandort' : 'Main Location' }}
            </span>
            <span v-if="building.isHidden" class="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded-full">
              {{ language === 'de' ? 'Versteckt' : 'Hidden' }}
            </span>
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Räume' : 'Rooms' }}</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ building.rooms.length }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Kapazität' : 'Capacity' }}</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ getTotalCapacity(building) }} {{ language === 'de' ? 'Plätze' : 'seats' }}</span>
          </div>
        </div>

        <div class="flex space-x-2">
          <button @click="viewBuilding(building)" class="flex-1 px-3 py-2 text-sm bg-primary-100 text-primary-800 rounded-lg hover:bg-primary-200 transition-colors">
            {{ language === 'de' ? 'Details' : 'Details' }}
          </button>
          <button @click="editBuilding(building)" class="px-3 py-2 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
            <Edit class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Rooms List -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Raumübersicht' : 'Room Overview' }}
        </h2>
        <div class="flex space-x-2">
          <select 
            v-model="selectedBuilding"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Alle Gebäude' : 'All Buildings' }}</option>
            <option v-for="building in buildings" :key="building.id" :value="building.id">{{ building.name }}</option>
          </select>
          <select 
            v-model="selectedRoomType"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ language === 'de' ? 'Alle Raumtypen' : 'All Room Types' }}</option>
            <option v-for="type in roomTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Raum' : 'Room' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Gebäude' : 'Building' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Typ' : 'Type' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Kapazität' : 'Capacity' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Ausstattung' : 'Features' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in filteredRooms" :key="room.id" class="border-b border-gray-100 dark:border-gray-700">
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ room.name }}</td>
              <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ getBuildingName(room.buildingId) }}</td>
              <td class="py-3 px-4 text-gray-900 dark:text-white">{{ room.type }}</td>
              <td class="py-3 px-4 text-gray-900 dark:text-white">{{ room.capacity }}</td>
              <td class="py-3 px-4">
                <div class="flex flex-wrap gap-1">
                  <span v-for="feature in room.features.slice(0, 2)" :key="feature" class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded">
                    {{ feature }}
                  </span>
                  <span v-if="room.features.length > 2" class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded">
                    +{{ room.features.length - 2 }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="viewRoom(room)" class="text-primary-600 hover:text-primary-800">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="editRoom(room)" class="text-secondary-600 hover:text-secondary-800">
                    <Edit class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Room Utilization -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {{ language === 'de' ? 'Raumauslastung' : 'Room Utilization' }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="utilization in roomUtilization" :key="utilization.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-medium text-gray-900 dark:text-white">{{ utilization.room }}</h3>
            <span :class="getUtilizationColor(utilization.percentage)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ utilization.percentage }}%
            </span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ getBuildingName(utilization.buildingId) }}</p>
          <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-3">
            <div :class="getUtilizationBarColor(utilization.percentage)" class="h-2 rounded-full" :style="{ width: utilization.percentage + '%' }"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-500">
            <span>{{ language === 'de' ? 'Genutzte Stunden:' : 'Hours used:' }} {{ utilization.hoursUsed }}</span>
            <span>{{ language === 'de' ? 'Verfügbare Stunden:' : 'Available hours:' }} {{ utilization.hoursAvailable }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Building Modal -->
    <div v-if="showBuildingModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neues Gebäude hinzufügen' : 'Add New Building' }}
            </h3>
            <button @click="showBuildingModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="addBuilding" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Gebäudename' : 'Building Name' }}
              </label>
              <input v-model="buildingForm.name" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Adresse' : 'Address' }}
              </label>
              <input v-model="buildingForm.address" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea v-model="buildingForm.description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"></textarea>
            </div>

            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" v-model="buildingForm.isMainLocation" class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2" />
                <span class="text-sm text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Hauptstandort' : 'Main Location' }}
                </span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="buildingForm.isHidden" class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2" />
                <span class="text-sm text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Standort verstecken' : 'Hide Location' }}
                </span>
              </label>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showBuildingModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Gebäude hinzufügen' : 'Add Building' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add Room Modal -->
    <div v-if="showRoomModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neuen Raum hinzufügen' : 'Add New Room' }}
            </h3>
            <button @click="showRoomModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="addRoom" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Raumname' : 'Room Name' }}
                </label>
                <input v-model="roomForm.name" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Gebäude' : 'Building' }}
                </label>
                <select v-model="roomForm.buildingId" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">{{ language === 'de' ? 'Gebäude wählen' : 'Select Building' }}</option>
                  <option v-for="building in buildings" :key="building.id" :value="building.id">{{ building.name }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Raumtyp' : 'Room Type' }}
                </label>
                <select v-model="roomForm.type" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">{{ language === 'de' ? 'Typ wählen' : 'Select Type' }}</option>
                  <option v-for="type in roomTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Kapazität' : 'Capacity' }}
                </label>
                <input v-model="roomForm.capacity" type="number" min="1" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Ausstattung' : 'Features' }}
              </label>
              <div class="grid grid-cols-2 gap-2">
                <label v-for="feature in roomFeatures" :key="feature" class="flex items-center">
                  <input
                    v-model="roomForm.features"
                    type="checkbox"
                    :value="feature"
                    class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
                  />
                  <span class="text-sm text-gray-900 dark:text-white">{{ feature }}</span>
                </label>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showRoomModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Raum hinzufügen' : 'Add Room' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Building, DoorOpen, Edit, Eye, X } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showBuildingModal = ref(false)
const showRoomModal = ref(false)
const selectedBuilding = ref('')
const selectedRoomType = ref('')

const buildingForm = ref({
  name: '',
  address: '',
  description: '',
  isMainLocation: false,
  isHidden: false
})

const roomForm = ref({
  name: '',
  buildingId: '',
  type: '',
  capacity: 30,
  features: [] as string[]
})

const roomTypes = [
  'Classroom',
  'Laboratory',
  'Auditorium',
  'Gymnasium',
  'Library',
  'Computer Lab',
  'Art Studio',
  'Music Room',
  'Meeting Room',
  'Office'
]

const roomFeatures = [
  'Projector',
  'Whiteboard',
  'Smart Board',
  'Computers',
  'Internet Access',
  'Air Conditioning',
  'Accessible',
  'Audio System',
  'Video Conferencing',
  'Specialized Equipment'
]

const buildings = ref([
  {
    id: 1,
    name: 'Main Building',
    address: 'Schulstraße 1, 10115 Berlin',
    description: 'Main school building with classrooms and administrative offices',
    isMainLocation: true,
    isHidden: false,
    rooms: [
      {
        id: 1,
        name: 'Room 101',
        buildingId: 1,
        type: 'Classroom',
        capacity: 30,
        features: ['Projector', 'Whiteboard', 'Internet Access']
      },
      {
        id: 2,
        name: 'Room 102',
        buildingId: 1,
        type: 'Classroom',
        capacity: 30,
        features: ['Projector', 'Whiteboard', 'Internet Access']
      },
      {
        id: 3,
        name: 'Room 103',
        buildingId: 1,
        type: 'Computer Lab',
        capacity: 25,
        features: ['Computers', 'Projector', 'Internet Access', 'Air Conditioning']
      }
    ]
  },
  {
    id: 2,
    name: 'Science Building',
    address: 'Schulstraße 2, 10115 Berlin',
    description: 'Building dedicated to science laboratories and research',
    isMainLocation: false,
    isHidden: false,
    rooms: [
      {
        id: 4,
        name: 'Lab A',
        buildingId: 2,
        type: 'Laboratory',
        capacity: 24,
        features: ['Specialized Equipment', 'Whiteboard', 'Internet Access', 'Air Conditioning']
      },
      {
        id: 5,
        name: 'Lab B',
        buildingId: 2,
        type: 'Laboratory',
        capacity: 24,
        features: ['Specialized Equipment', 'Whiteboard', 'Internet Access', 'Air Conditioning']
      }
    ]
  },
  {
    id: 3,
    name: 'Arts Center',
    address: 'Kunststraße 5, 10115 Berlin',
    description: 'Center for arts, music, and creative activities',
    isMainLocation: false,
    isHidden: false,
    rooms: [
      {
        id: 6,
        name: 'Art Studio',
        buildingId: 3,
        type: 'Art Studio',
        capacity: 20,
        features: ['Specialized Equipment', 'Whiteboard']
      },
      {
        id: 7,
        name: 'Music Room',
        buildingId: 3,
        type: 'Music Room',
        capacity: 30,
        features: ['Audio System', 'Specialized Equipment', 'Air Conditioning']
      },
      {
        id: 8,
        name: 'Auditorium',
        buildingId: 3,
        type: 'Auditorium',
        capacity: 200,
        features: ['Projector', 'Audio System', 'Air Conditioning', 'Video Conferencing']
      }
    ]
  }
])

const roomUtilization = ref([
  {
    id: 1,
    room: 'Room 101',
    buildingId: 1,
    percentage: 85,
    hoursUsed: 34,
    hoursAvailable: 40
  },
  {
    id: 2,
    room: 'Lab A',
    buildingId: 2,
    percentage: 65,
    hoursUsed: 26,
    hoursAvailable: 40
  },
  {
    id: 3,
    room: 'Auditorium',
    buildingId: 3,
    percentage: 45,
    hoursUsed: 18,
    hoursAvailable: 40
  },
  {
    id: 4,
    room: 'Room 102',
    buildingId: 1,
    percentage: 92,
    hoursUsed: 37,
    hoursAvailable: 40
  },
  {
    id: 5,
    room: 'Music Room',
    buildingId: 3,
    percentage: 78,
    hoursUsed: 31,
    hoursAvailable: 40
  },
  {
    id: 6,
    room: 'Lab B',
    buildingId: 2,
    percentage: 70,
    hoursUsed: 28,
    hoursAvailable: 40
  }
])

const allRooms = computed(() => {
  return buildings.value.flatMap(building => building.rooms)
})

const filteredRooms = computed(() => {
  return allRooms.value.filter(room => {
    const matchesBuilding = !selectedBuilding.value || room.buildingId.toString() === selectedBuilding.value
    const matchesType = !selectedRoomType.value || room.type === selectedRoomType.value
    
    return matchesBuilding && matchesType
  })
})

const getBuildingName = (buildingId: number) => {
  const building = buildings.value.find(b => b.id === buildingId)
  return building ? building.name : ''
}

const getTotalCapacity = (building: any) => {
  return building.rooms.reduce((total: number, room: any) => total + room.capacity, 0)
}

const getUtilizationColor = (percentage: number) => {
  if (percentage >= 90) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  if (percentage >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

const getUtilizationBarColor = (percentage: number) => {
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 70) return 'bg-yellow-500'
  return 'bg-green-500'
}

const addBuilding = () => {
  const newBuilding = {
    id: buildings.value.length + 1,
    name: buildingForm.value.name,
    address: buildingForm.value.address,
    description: buildingForm.value.description,
    isMainLocation: buildingForm.value.isMainLocation,
    isHidden: buildingForm.value.isHidden,
    rooms: []
  }
  
  // If this is set as main location, update other buildings
  if (buildingForm.value.isMainLocation) {
    buildings.value.forEach(building => {
      building.isMainLocation = false
    })
  }
  
  buildings.value.push(newBuilding)
  showBuildingModal.value = false
  buildingForm.value = {
    name: '',
    address: '',
    description: '',
    isMainLocation: false,
    isHidden: false
  }
  
  alert(language.value === 'de' ? 'Gebäude erfolgreich hinzugefügt!' : 'Building added successfully!')
}

const addRoom = () => {
  const newRoom = {
    id: allRooms.value.length + 1,
    name: roomForm.value.name,
    buildingId: parseInt(roomForm.value.buildingId),
    type: roomForm.value.type,
    capacity: roomForm.value.capacity,
    features: [...roomForm.value.features]
  }
  
  const buildingIndex = buildings.value.findIndex(b => b.id === newRoom.buildingId)
  if (buildingIndex !== -1) {
    buildings.value[buildingIndex].rooms.push(newRoom)
  }
  
  showRoomModal.value = false
  roomForm.value = {
    name: '',
    buildingId: '',
    type: '',
    capacity: 30,
    features: []
  }
  
  alert(language.value === 'de' ? 'Raum erfolgreich hinzugefügt!' : 'Room added successfully!')
}

const viewBuilding = (building: any) => {
  alert(`${language.value === 'de' ? 'Gebäude anzeigen' : 'View building'}: ${building.name}`)
}

const editBuilding = (building: any) => {
  alert(`${language.value === 'de' ? 'Gebäude bearbeiten' : 'Edit building'}: ${building.name}`)
}

const viewRoom = (room: any) => {
  alert(`${language.value === 'de' ? 'Raum anzeigen' : 'View room'}: ${room.name}`)
}

const editRoom = (room: any) => {
  alert(`${language.value === 'de' ? 'Raum bearbeiten' : 'Edit room'}: ${room.name}`)
}
</script>
