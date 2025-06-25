<template>
  <div class="support bg-gray-50 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <MessageCircle class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Support' : 'Support' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Hilfe und Unterstützung für das WinSchool System' : 'Help and support for the WinSchool system' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="showTicketModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Ticket erstellen' : 'Create Ticket' }}
          </button>
        </div>
      </div>

      <!-- Support Tabs -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div class="border-b border-slate-200 dark:border-slate-700">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in supportTabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              ]"
            >
              <component :is="tab.icon" class="h-4 w-4 inline-block mr-2" />
              {{ tab.name }}
              <span v-if="tab.count" class="ml-2 px-2 py-0.5 text-xs rounded-full" :class="getTabCountColor(tab.id)">
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>

        <!-- My Tickets Tab -->
        <div v-if="activeTab === 'my-tickets'" class="mt-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div class="flex flex-col sm:flex-row gap-2">
              <select v-model="ticketFilters.status" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
                <option value="Open">{{ language === 'de' ? 'Offen' : 'Open' }}</option>
                <option value="In Progress">{{ language === 'de' ? 'In Bearbeitung' : 'In Progress' }}</option>
                <option value="Resolved">{{ language === 'de' ? 'Gelöst' : 'Resolved' }}</option>
                <option value="Closed">{{ language === 'de' ? 'Geschlossen' : 'Closed' }}</option>
              </select>
              <select v-model="ticketFilters.priority" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                <option value="">{{ language === 'de' ? 'Alle Prioritäten' : 'All Priorities' }}</option>
                <option value="Low">{{ language === 'de' ? 'Niedrig' : 'Low' }}</option>
                <option value="Medium">{{ language === 'de' ? 'Mittel' : 'Medium' }}</option>
                <option value="High">{{ language === 'de' ? 'Hoch' : 'High' }}</option>
                <option value="Critical">{{ language === 'de' ? 'Kritisch' : 'Critical' }}</option>
              </select>
            </div>
            <div class="relative w-full sm:w-auto">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                v-model="ticketFilters.search"
                type="text"
                :placeholder="language === 'de' ? 'Tickets suchen...' : 'Search tickets...'"
                class="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50"
              />
            </div>
          </div>

          <!-- Desktop Table View -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
                  <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                    {{ language === 'de' ? 'Ticket-ID' : 'Ticket ID' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                    {{ language === 'de' ? 'Betreff' : 'Subject' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                    {{ language === 'de' ? 'Erstellt am' : 'Created On' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                    {{ language === 'de' ? 'Status' : 'Status' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                    {{ language === 'de' ? 'Priorität' : 'Priority' }}
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                    {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ticket in filteredTickets" :key="ticket.id" class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td class="py-3 px-4 font-medium text-slate-800 dark:text-slate-50">{{ ticket.id }}</td>
                  <td class="py-3 px-4 text-slate-800 dark:text-slate-50">{{ ticket.subject }}</td>
                  <td class="py-3 px-4 text-slate-500 dark:text-slate-400">{{ ticket.createdOn }}</td>
                  <td class="py-3 px-4">
                    <span :class="getTicketStatusColor(ticket.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getStatusText(ticket.status) }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <span :class="getTicketPriorityColor(ticket.priority)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getPriorityText(ticket.priority) }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex space-x-2">
                      <button @click="viewTicket(ticket)" class="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors">
                        <Eye class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Card View -->
          <div class="lg:hidden space-y-4">
            <div v-for="ticket in filteredTickets" :key="ticket.id" class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ ticket.subject }}</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Ticket' : 'Ticket' }} #{{ ticket.id }}</p>
                </div>
                <button @click="viewTicket(ticket)" class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
                  <Eye class="h-4 w-4" />
                </button>
              </div>
              
              <div class="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ language === 'de' ? 'Erstellt am' : 'Created On' }}</p>
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ ticket.createdOn }}</p>
                </div>
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ language === 'de' ? 'Priorität' : 'Priority' }}</p>
                  <span :class="getTicketPriorityColor(ticket.priority)" class="inline-block px-2 py-1 text-xs font-medium rounded-full">
                    {{ getPriorityText(ticket.priority) }}
                  </span>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <span :class="getTicketStatusColor(ticket.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusText(ticket.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredTickets.length === 0" class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-8 text-center">
            <LifeBuoy class="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <h3 class="text-lg font-medium text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Keine Support-Tickets gefunden' : 'No support tickets found' }}
            </h3>
            <p class="text-slate-500 dark:text-slate-400 mt-2">
              {{ language === 'de' 
                ? 'Sie haben noch keine Support-Anfragen gestellt.' 
                : 'You haven\'t submitted any support requests yet.' }}
            </p>
            <button @click="showTicketModal = true" class="mt-4 bg-winschool-primary hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200">
              {{ language === 'de' ? 'Erste Anfrage erstellen' : 'Create First Request' }}
            </button>
          </div>
        </div>

        <!-- FAQ Tab -->
        <div v-if="activeTab === 'faq'" class="mt-6">
          <div class="space-y-4">
            <div v-for="faq in faqs" :key="faq.id" class="bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
              <button 
                @click="toggleFaq(faq.id)"
                class="w-full p-4 text-left flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors rounded-lg"
              >
                <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ faq.question }}</h3>
                <ChevronDown 
                  :class="[
                    'h-5 w-5 text-slate-400 transition-transform',
                    openFaqs.includes(faq.id) ? 'rotate-180' : ''
                  ]" 
                />
              </button>
              <div v-if="openFaqs.includes(faq.id)" class="px-4 pb-4">
                <p class="text-slate-600 dark:text-slate-300">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Knowledge Base Tab -->
        <div v-if="activeTab === 'knowledge'" class="mt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="article in knowledgeBase" :key="article.id" class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow">
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <component :is="article.icon" class="h-5 w-5 text-blue-600" />
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-slate-800 dark:text-slate-50 mb-2">{{ article.title }}</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">{{ article.description }}</p>
                  <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {{ language === 'de' ? 'Mehr lesen' : 'Read More' }} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Maintenance Tab (SuperAdmin only) -->
        <div v-if="activeTab === 'maintenance' && userRole === 'superadmin'" class="mt-6">
          <div class="flex justify-between items-center mb-4">
            <div class="flex space-x-2">
              <select v-model="maintenanceFilters.status" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
                <option value="Scheduled">{{ language === 'de' ? 'Geplant' : 'Scheduled' }}</option>
                <option value="In Progress">{{ language === 'de' ? 'In Bearbeitung' : 'In Progress' }}</option>
                <option value="Completed">{{ language === 'de' ? 'Abgeschlossen' : 'Completed' }}</option>
                <option value="Cancelled">{{ language === 'de' ? 'Abgebrochen' : 'Cancelled' }}</option>
              </select>
              <select v-model="maintenanceFilters.type" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                <option value="">{{ language === 'de' ? 'Alle Typen' : 'All Types' }}</option>
                <option value="Scheduled">{{ language === 'de' ? 'Geplant' : 'Scheduled' }}</option>
                <option value="Emergency">{{ language === 'de' ? 'Notfall' : 'Emergency' }}</option>
              </select>
            </div>
          </div>

          <div class="space-y-4">
            <div v-for="maintenance in filteredMaintenance" :key="maintenance.id" class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ maintenance.title }}</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400">{{ maintenance.description }}</p>
                </div>
                <div class="flex space-x-2">
                  <span :class="getMaintenanceTypeColor(maintenance.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ maintenance.type }}
                  </span>
                  <span :class="getMaintenanceStatusColor(maintenance.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ maintenance.status }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <p class="text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Startzeit:' : 'Start Time:' }}</p>
                  <p class="font-medium text-slate-800 dark:text-slate-50">{{ maintenance.startTime }}</p>
                </div>
                <div>
                  <p class="text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Endzeit:' : 'End Time:' }}</p>
                  <p class="font-medium text-slate-800 dark:text-slate-50">{{ maintenance.endTime }}</p>
                </div>
                <div>
                  <p class="text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Betroffene Systeme:' : 'Affected Systems:' }}</p>
                  <p class="font-medium text-slate-800 dark:text-slate-50">{{ maintenance.affectedSystems.join(', ') }}</p>
                </div>
              </div>

              <div class="flex justify-end space-x-2">
                <button @click="editMaintenance(maintenance)" class="btn-secondary text-sm">
                  {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
                </button>
                <button v-if="maintenance.status === 'Scheduled'" @click="startMaintenance(maintenance)" class="bg-winschool-primary hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200">
                  {{ language === 'de' ? 'Starten' : 'Start' }}
                </button>
                <button v-if="maintenance.status === 'In Progress'" @click="completeMaintenance(maintenance)" class="bg-winschool-primary hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200">
                  {{ language === 'de' ? 'Abschließen' : 'Complete' }}
                </button>
                <button v-if="maintenance.status === 'Scheduled'" @click="cancelMaintenance(maintenance)" class="text-sm px-3 py-2 bg-red-100/20 text-red-800 dark:bg-red-900/20 dark:text-red-200 rounded-lg hover:bg-red-200/20 dark:hover:bg-red-800/20 transition-colors">
                  {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- System Logs Tab (SuperAdmin only) -->
        <div v-if="activeTab === 'logs' && userRole === 'superadmin'" class="mt-6">
          <div class="flex justify-between items-center mb-4">
            <div class="flex space-x-2">
              <select v-model="logFilters.level" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                <option value="">{{ language === 'de' ? 'Alle Level' : 'All Levels' }}</option>
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="ERROR">ERROR</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
              <select v-model="logFilters.component" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                <option value="">{{ language === 'de' ? 'Alle Komponenten' : 'All Components' }}</option>
                <option value="Auth">Auth</option>
                <option value="Database">Database</option>
                <option value="API">API</option>
                <option value="Frontend">Frontend</option>
              </select>
            </div>
            <button @click="downloadLogs" class="btn-secondary text-sm">
              {{ language === 'de' ? 'Logs herunterladen' : 'Download Logs' }}
            </button>
          </div>

          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto border border-slate-200 dark:border-slate-600">
            <div v-for="(log, index) in filteredLogs" :key="index" class="mb-2" :class="getLogLevelClass(log.level)">
              <span class="font-bold">[{{ log.timestamp }}] [{{ log.level }}] [{{ log.component }}]:</span> {{ log.message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Ticket Modal -->
  <div v-if="showTicketModal" class="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Support-Anfrage erstellen' : 'Create Support Request' }}
          </h3>
          <button @click="showTicketModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X class="h-6 w-6" />
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <form @submit.prevent="createTicket" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              {{ language === 'de' ? 'Betreff' : 'Subject' }}
            </label>
            <input v-model="ticketForm.subject" type="text" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              {{ language === 'de' ? 'Beschreibung' : 'Description' }}
            </label>
            <textarea v-model="ticketForm.description" rows="4" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50 resize-none"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Priorität' : 'Priority' }}
              </label>
              <select v-model="ticketForm.priority" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                <option value="">{{ language === 'de' ? 'Priorität wählen' : 'Select Priority' }}</option>
                <option value="Low">{{ language === 'de' ? 'Niedrig' : 'Low' }}</option>
                <option value="Medium">{{ language === 'de' ? 'Mittel' : 'Medium' }}</option>
                <option value="High">{{ language === 'de' ? 'Hoch' : 'High' }}</option>
                <option value="Critical">{{ language === 'de' ? 'Kritisch' : 'Critical' }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Kategorie' : 'Category' }}
              </label>
              <select v-model="ticketForm.category" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
                <option value="">{{ language === 'de' ? 'Kategorie wählen' : 'Select Category' }}</option>
                <option value="Technical">{{ language === 'de' ? 'Technisch' : 'Technical' }}</option>
                <option value="Account">{{ language === 'de' ? 'Konto' : 'Account' }}</option>
                <option value="Billing">{{ language === 'de' ? 'Abrechnung' : 'Billing' }}</option>
                <option value="Feature">{{ language === 'de' ? 'Funktion' : 'Feature' }}</option>
                <option value="Other">{{ language === 'de' ? 'Sonstiges' : 'Other' }}</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showTicketModal = false" class="btn-secondary">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button type="submit" class="bg-winschool-primary hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200">
              {{ language === 'de' ? 'Anfrage erstellen' : 'Create Request' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Schedule Maintenance Modal (SuperAdmin only) -->
  <div v-if="showMaintenanceModal && userRole === 'superadmin'" class="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Wartung planen' : 'Schedule Maintenance' }}
          </h3>
          <button @click="showMaintenanceModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X class="h-6 w-6" />
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <form @submit.prevent="scheduleMaintenance" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              {{ language === 'de' ? 'Titel' : 'Title' }}
            </label>
            <input v-model="maintenanceForm.title" type="text" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              {{ language === 'de' ? 'Beschreibung' : 'Description' }}
            </label>
            <textarea v-model="maintenanceForm.description" rows="3" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50 resize-none"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Startdatum' : 'Start Date' }}
              </label>
              <input v-model="maintenanceForm.startDate" type="date" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Startzeit' : 'Start Time' }}
              </label>
              <input v-model="maintenanceForm.startTime" type="time" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Enddatum' : 'End Date' }}
              </label>
              <input v-model="maintenanceForm.endDate" type="date" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {{ language === 'de' ? 'Endzeit' : 'End Time' }}
              </label>
              <input v-model="maintenanceForm.endTime" type="time" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              {{ language === 'de' ? 'Typ' : 'Type' }}
            </label>
            <select v-model="maintenanceForm.type" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50">
              <option value="">{{ language === 'de' ? 'Typ wählen' : 'Select Type' }}</option>
              <option value="Scheduled">{{ language === 'de' ? 'Geplant' : 'Scheduled' }}</option>
              <option value="Emergency">{{ language === 'de' ? 'Notfall' : 'Emergency' }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              {{ language === 'de' ? 'Betroffene Systeme' : 'Affected Systems' }}
            </label>
            <div class="space-y-2">
              <label v-for="system in systemComponents" :key="system" class="flex items-center">
                <input
                  v-model="maintenanceForm.affectedSystems"
                  type="checkbox"
                  :value="system"
                  class="rounded border-slate-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
                />
                <span class="text-slate-800 dark:text-slate-50">{{ system }}</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showMaintenanceModal = false" class="btn-secondary">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button type="submit" class="bg-winschool-primary hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200">
              {{ language === 'de' ? 'Wartung planen' : 'Schedule Maintenance' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { useAuthStore } from '../stores/auth'
import { Plus, MessageCircle, Clock, User, CheckCircle, AlertCircle, XCircle, Search, Filter, Phone, Mail, Globe, Wrench, AlertTriangle, Info, Calendar, Eye, Download } from 'lucide-vue-next'

const router = useRouter()
const themeStore = useThemeStore()
const authStore = useAuthStore()
const language = computed(() => themeStore.language)
const userRole = computed(() => authStore.user?.role)

// Active tab
const activeTab = ref('my-tickets')

// Modals
const showTicketModal = ref(false)
const showMaintenanceModal = ref(false)

// Open FAQs
const openFaqs = ref<number[]>([])

// Support tabs based on user role
const supportTabs = computed(() => {
  const baseTabs = [
    {
      id: 'my-tickets',
      name: language.value === 'de' ? 'Meine Tickets' : 'My Tickets',
      icon: MessageCircle,
      count: tickets.value.length
    },
    {
      id: 'faq',
      name: language.value === 'de' ? 'FAQ' : 'FAQ',
      icon: Info,
      count: null
    },
    {
      id: 'knowledge',
      name: language.value === 'de' ? 'Wissensdatenbank' : 'Knowledge Base',
      icon: BookOpen,
      count: null
    }
  ]

  if (userRole.value === 'superadmin') {
    baseTabs.push(
      {
        id: 'maintenance',
        name: language.value === 'de' ? 'Wartung' : 'Maintenance',
        icon: Wrench,
        count: maintenanceItems.value.length
      },
      {
        id: 'logs',
        name: language.value === 'de' ? 'System Logs' : 'System Logs',
        icon: Download,
        count: null
      }
    )
  }

  return baseTabs
})

// Ticket Management
const ticketFilters = ref({
  status: '',
  priority: '',
  search: ''
})

const ticketForm = ref({
  subject: '',
  description: '',
  priority: '',
  category: ''
})

// Sample tickets for current user
const tickets = ref([
  {
    id: 'TICKET-1001',
    subject: 'Login Issues',
    createdOn: '2024-03-12',
    status: 'Open',
    priority: 'High',
    category: 'Technical',
    description: 'Unable to log in to the system since this morning.'
  },
  {
    id: 'TICKET-1002',
    subject: 'Grade Import Question',
    createdOn: '2024-03-10',
    status: 'Resolved',
    priority: 'Medium',
    category: 'Feature',
    description: 'How to import grades from external system.'
  },
  {
    id: 'TICKET-1003',
    subject: 'Password Reset Request',
    createdOn: '2024-03-08',
    status: 'Closed',
    priority: 'Low',
    category: 'Account',
    description: 'Need help resetting password for student account.'
  }
])

const filteredTickets = computed(() => {
  return tickets.value.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(ticketFilters.value.search.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(ticketFilters.value.search.toLowerCase())
    const matchesStatus = !ticketFilters.value.status || ticket.status === ticketFilters.value.status
    const matchesPriority = !ticketFilters.value.priority || ticket.priority === ticketFilters.value.priority
    
    return matchesSearch && matchesStatus && matchesPriority
  })
})

// FAQ Data
const faqs = ref([
  {
    id: 1,
    question: language.value === 'de' ? 'Wie kann ich mein Passwort zurücksetzen?' : 'How can I reset my password?',
    answer: language.value === 'de' 
      ? 'Klicken Sie auf der Anmeldeseite auf "Passwort vergessen?" und folgen Sie den Anweisungen per E-Mail.' 
      : 'Click "Forgot Password?" on the login page and follow the email instructions.'
  },
  {
    id: 2,
    question: language.value === 'de' ? 'Wie erstelle ich einen neuen Benutzer?' : 'How do I create a new user?',
    answer: language.value === 'de' 
      ? 'Gehen Sie zu Benutzerverwaltung > Neuer Benutzer und füllen Sie das Formular aus.' 
      : 'Go to User Management > New User and fill out the form.'
  },
  {
    id: 3,
    question: language.value === 'de' ? 'Wie kann ich Noten importieren?' : 'How can I import grades?',
    answer: language.value === 'de' 
      ? 'Verwenden Sie die Importfunktion unter Akademisch > Noten > Import. Unterstützte Formate sind CSV und Excel.' 
      : 'Use the import function under Academic > Grades > Import. Supported formats are CSV and Excel.'
  },
  {
    id: 4,
    question: language.value === 'de' ? 'Wie generiere ich Berichte?' : 'How do I generate reports?',
    answer: language.value === 'de' 
      ? 'Gehen Sie zu Berichte, wählen Sie den gewünschten Berichtstyp und die Parameter aus.' 
      : 'Go to Reports, select the desired report type and parameters.'
  },
  {
    id: 5,
    question: language.value === 'de' ? 'Wie kann ich Schüler anmelden?' : 'How can I enroll students?',
    answer: language.value === 'de' 
      ? 'Verwenden Sie das Anmeldeformular unter Anmeldungen oder das Schülerverwaltungsmodul.' 
      : 'Use the enrollment form under Enrollment or the Student Management module.'
  }
])

// Knowledge Base Data
const knowledgeBase = ref([
  {
    id: 1,
    title: language.value === 'de' ? 'Erste Schritte' : 'Getting Started',
    description: language.value === 'de' 
      ? 'Grundlegende Einrichtung und Navigation im System' 
      : 'Basic setup and navigation in the system',
    icon: BookOpen
  },
  {
    id: 2,
    title: language.value === 'de' ? 'Benutzerverwaltung' : 'User Management',
    description: language.value === 'de' 
      ? 'Benutzer erstellen, bearbeiten und verwalten' 
      : 'Creating, editing and managing users',
    icon: Settings
  },
  {
    id: 3,
    title: language.value === 'de' ? 'Schülerverwaltung' : 'Student Management',
    description: language.value === 'de' 
      ? 'Schüler anmelden, verwalten und überwachen' 
      : 'Enrolling, managing and monitoring students',
    icon: MessageCircle
  },
  {
    id: 4,
    title: language.value === 'de' ? 'Berichtswesen' : 'Reporting',
    description: language.value === 'de' 
      ? 'Berichte erstellen und anpassen' 
      : 'Creating and customizing reports',
    icon: FileText
  },
  {
    id: 5,
    title: language.value === 'de' ? 'Datenimport' : 'Data Import',
    description: language.value === 'de' 
      ? 'Daten aus externen Systemen importieren' 
      : 'Importing data from external systems',
    icon: HelpCircle
  },
  {
    id: 6,
    title: language.value === 'de' ? 'Fehlerbehebung' : 'Troubleshooting',
    description: language.value === 'de' 
      ? 'Häufige Probleme und Lösungen' 
      : 'Common issues and solutions',
    icon: Settings
  }
])

// Maintenance Management (SuperAdmin only)
const maintenanceFilters = ref({
  status: '',
  type: ''
})

const maintenanceForm = ref({
  title: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  type: '',
  affectedSystems: [] as string[]
})

const systemComponents = [
  'Application Server',
  'Database Server',
  'Storage System',
  'API Services',
  'Authentication System',
  'Reporting Engine',
  'Email Service'
]

const maintenanceItems = ref([
  {
    id: 1,
    title: 'Database Optimization',
    description: 'Scheduled maintenance to optimize database performance.',
    startTime: '2024-03-20 01:00',
    endTime: '2024-03-20 03:00',
    type: 'Scheduled',
    status: 'Scheduled',
    affectedSystems: ['Database Server', 'API Services']
  },
  {
    id: 2,
    title: 'Security Updates',
    description: 'Installing critical security patches.',
    startTime: '2024-03-15 22:00',
    endTime: '2024-03-16 02:00',
    type: 'Scheduled',
    status: 'Completed',
    affectedSystems: ['Application Server', 'Authentication System']
  }
])

const filteredMaintenance = computed(() => {
  return maintenanceItems.value.filter(maintenance => {
    const matchesStatus = !maintenanceFilters.value.status || maintenance.status === maintenanceFilters.value.status
    const matchesType = !maintenanceFilters.value.type || maintenance.type === maintenanceFilters.value.type
    
    return matchesStatus && matchesType
  })
})

// System Logs (SuperAdmin only)
const logFilters = ref({
  level: '',
  component: ''
})

const systemLogs = ref([
  {
    timestamp: '2024-03-12 14:32:45',
    level: 'INFO',
    component: 'Auth',
    message: 'User login successful: admin.master@winschool.de'
  },
  {
    timestamp: '2024-03-12 14:30:22',
    level: 'WARNING',
    component: 'Database',
    message: 'Slow query detected: SELECT * FROM users (execution time: 2.5s)'
  },
  {
    timestamp: '2024-03-12 14:15:10',
    level: 'ERROR',
    component: 'API',
    message: 'API rate limit exceeded for endpoint: /api/v1/reports'
  },
  {
    timestamp: '2024-03-12 14:10:05',
    level: 'INFO',
    component: 'Frontend',
    message: 'New version deployed: v2.4.1'
  },
  {
    timestamp: '2024-03-12 13:55:30',
    level: 'CRITICAL',
    component: 'Database',
    message: 'Database connection failure: Connection refused'
  }
])

const filteredLogs = computed(() => {
  return systemLogs.value.filter(log => {
    const matchesLevel = !logFilters.value.level || log.level === logFilters.value.level
    const matchesComponent = !logFilters.value.component || log.component === logFilters.value.component
    
    return matchesLevel && matchesComponent
  })
})

// Utility Functions
const toggleFaq = (faqId: number) => {
  const index = openFaqs.value.indexOf(faqId)
  if (index > -1) {
    openFaqs.value.splice(index, 1)
  } else {
    openFaqs.value.push(faqId)
  }
}

const getTabCountColor = (tabId: string) => {
  switch (tabId) {
    case 'my-tickets':
      return 'bg-blue-100/20 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
    case 'maintenance':
      return 'bg-amber-100/20 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200'
    default:
      return 'bg-slate-100/20 text-slate-800 dark:bg-slate-900/20 dark:text-slate-200'
  }
}

const getTicketStatusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'bg-red-100/20 text-red-800 dark:bg-red-900/20 dark:text-red-200'
    case 'In Progress':
      return 'bg-amber-100/20 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200'
    case 'Resolved':
      return 'bg-green-100/20 text-green-800 dark:bg-green-900/20 dark:text-green-200'
    case 'Closed':
      return 'bg-slate-100/20 text-slate-800 dark:bg-slate-900/20 dark:text-slate-200'
    default:
      return 'bg-slate-100/20 text-slate-800 dark:bg-slate-900/20 dark:text-slate-200'
  }
}

const getTicketPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-100/20 text-red-800 dark:bg-red-900/20 dark:text-red-200'
    case 'High':
      return 'bg-orange-100/20 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200'
    case 'Medium':
      return 'bg-amber-100/20 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200'
    case 'Low':
      return 'bg-blue-100/20 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
    default:
      return 'bg-slate-100/20 text-slate-800 dark:bg-slate-900/20 dark:text-slate-200'
  }
}

const getMaintenanceStatusColor = (status: string) => {
  switch (status) {
    case 'Scheduled':
      return 'bg-blue-100/20 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
    case 'In Progress':
      return 'bg-amber-100/20 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200'
    case 'Completed':
      return 'bg-green-100/20 text-green-800 dark:bg-green-900/20 dark:text-green-200'
    case 'Cancelled':
      return 'bg-red-100/20 text-red-800 dark:bg-red-900/20 dark:text-red-200'
    default:
      return 'bg-slate-100/20 text-slate-800 dark:bg-slate-900/20 dark:text-slate-200'
  }
}

const getMaintenanceTypeColor = (type: string) => {
  switch (type) {
    case 'Scheduled':
      return 'bg-blue-100/20 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
    case 'Emergency':
      return 'bg-red-100/20 text-red-800 dark:bg-red-900/20 dark:text-red-200'
    default:
      return 'bg-slate-100/20 text-slate-800 dark:bg-slate-900/20 dark:text-slate-200'
  }
}

const getLogLevelClass = (level: string) => {
  switch (level) {
    case 'INFO':
      return 'text-blue-600 dark:text-blue-400'
    case 'WARNING':
      return 'text-amber-600 dark:text-amber-400'
    case 'ERROR':
      return 'text-red-600 dark:text-red-400'
    case 'CRITICAL':
      return 'text-red-800 dark:text-red-300 font-bold'
    default:
      return 'text-slate-600 dark:text-slate-400'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'Open':
      return language.value === 'de' ? 'Offen' : 'Open'
    case 'In Progress':
      return language.value === 'de' ? 'In Bearbeitung' : 'In Progress'
    case 'Resolved':
      return language.value === 'de' ? 'Gelöst' : 'Resolved'
    case 'Closed':
      return language.value === 'de' ? 'Geschlossen' : 'Closed'
    default:
      return status
  }
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'Low':
      return language.value === 'de' ? 'Niedrig' : 'Low'
    case 'Medium':
      return language.value === 'de' ? 'Mittel' : 'Medium'
    case 'High':
      return language.value === 'de' ? 'Hoch' : 'High'
    case 'Critical':
      return language.value === 'de' ? 'Kritisch' : 'Critical'
    default:
      return priority
  }
}

// Action Functions
const viewTicket = (ticket: any) => {
  // In a real app, this would open a detailed ticket view
  alert(`${language.value === 'de' ? 'Ticket anzeigen' : 'View ticket'}: ${ticket.id}`)
}

const createTicket = () => {
  const newTicket = {
    id: `TICKET-${1000 + tickets.value.length + 1}`,
    subject: ticketForm.value.subject,
    createdOn: new Date().toISOString().split('T')[0],
    status: 'Open',
    priority: ticketForm.value.priority,
    category: ticketForm.value.category,
    description: ticketForm.value.description
  }
  
  tickets.value.unshift(newTicket)
  showTicketModal.value = false
  ticketForm.value = {
    subject: '',
    description: '',
    priority: '',
    category: ''
  }
  
  alert(language.value === 'de' ? 'Support-Anfrage erfolgreich erstellt!' : 'Support request created successfully!')
}

// Maintenance Functions (SuperAdmin only)
const editMaintenance = (maintenance: any) => {
  alert(`${language.value === 'de' ? 'Wartung bearbeiten' : 'Edit maintenance'}: ${maintenance.title}`)
}

const startMaintenance = (maintenance: any) => {
  maintenance.status = 'In Progress'
  alert(`${language.value === 'de' ? 'Wartung gestartet' : 'Maintenance started'}: ${maintenance.title}`)
}

const completeMaintenance = (maintenance: any) => {
  maintenance.status = 'Completed'
  alert(`${language.value === 'de' ? 'Wartung abgeschlossen' : 'Maintenance completed'}: ${maintenance.title}`)
}

const cancelMaintenance = (maintenance: any) => {
  maintenance.status = 'Cancelled'
  alert(`${language.value === 'de' ? 'Wartung abgebrochen' : 'Maintenance cancelled'}: ${maintenance.title}`)
}

const scheduleMaintenance = () => {
  const startDateTime = `${maintenanceForm.value.startDate} ${maintenanceForm.value.startTime}`
  const endDateTime = `${maintenanceForm.value.endDate} ${maintenanceForm.value.endTime}`
  
  const newMaintenance = {
    id: maintenanceItems.value.length + 1,
    title: maintenanceForm.value.title,
    description: maintenanceForm.value.description,
    startTime: startDateTime,
    endTime: endDateTime,
    type: maintenanceForm.value.type,
    status: 'Scheduled',
    affectedSystems: [...maintenanceForm.value.affectedSystems]
  }
  
  maintenanceItems.value.unshift(newMaintenance)
  showMaintenanceModal.value = false
  maintenanceForm.value = {
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    type: '',
    affectedSystems: []
  }
  
  alert(language.value === 'de' ? 'Wartung erfolgreich geplant!' : 'Maintenance scheduled successfully!')
}

const downloadLogs = () => {
  alert(language.value === 'de' ? 'Logs werden heruntergeladen...' : 'Downloading logs...')
}
</script>
