<template>
  <div class="user-management bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Benutzerverwaltung' : 'User Management' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie Benutzer, Rollen und Berechtigungen' : 'Manage users, roles, and permissions' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button 
          @click="showImportModal = true" 
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {{ language === 'de' ? 'Benutzer importieren' : 'Import Users' }}
        </button>
        <button 
          @click="showUserModal = true" 
          class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {{ language === 'de' ? 'Benutzer hinzufügen' : 'Add User' }}
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="language === 'de' ? 'Benutzer suchen...' : 'Search users...'"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
        <select 
          v-model="selectedRole"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{{ language === 'de' ? 'Alle Rollen' : 'All Roles' }}</option>
          <option v-for="role in roles" :key="role.value" :value="role.value">{{ role.label }}</option>
        </select>
        <select 
          v-model="selectedStatus"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
          <option value="Active">{{ language === 'de' ? 'Aktiv' : 'Active' }}</option>
          <option value="Inactive">{{ language === 'de' ? 'Inaktiv' : 'Inactive' }}</option>
          <option value="Pending">{{ language === 'de' ? 'Ausstehend' : 'Pending' }}</option>
        </select>
      </div>
    </div>

    <!-- Desktop Table View (hidden on mobile) -->
    <div class="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-700">
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Name' : 'Name' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'E-Mail' : 'Email' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Rolle' : 'Role' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Abteilung' : 'Department' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Status' : 'Status' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img :src="user.avatar" :alt="user.name" class="h-8 w-8 rounded-full object-cover mr-3 border border-gray-200 dark:border-gray-600" />
                  <span class="font-medium text-gray-900 dark:text-white">{{ user.name }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ user.email }}</td>
              <td class="py-3 px-4">
                <span :class="getRoleBadgeColor(user.role)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getRoleDisplayName(user.role) }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-white">{{ user.department || '-' }}</td>
              <td class="py-3 px-4">
                <span :class="getStatusColor(user.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ user.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="viewUser(user)" class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="editUser(user)" class="text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="toggleUserStatus(user)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    <component :is="user.status === 'Active' ? Lock : Unlock" class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Card View (visible on mobile only) -->
    <div class="lg:hidden space-y-4 mb-6">
      <div
        v-for="user in paginatedUsers"
        :key="user.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
      >
        <!-- User Header -->
        <div class="flex items-center space-x-3 mb-3">
          <img :src="user.avatar" :alt="user.name" class="h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" />
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {{ user.name }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ user.email }}
            </p>
          </div>
          <span :class="getStatusColor(user.status)" class="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap">
            {{ user.status }}
          </span>
        </div>

        <!-- User Details -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {{ language === 'de' ? 'Rolle' : 'Role' }}
            </p>
            <span :class="getRoleBadgeColor(user.role)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ getRoleDisplayName(user.role) }}
            </span>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {{ language === 'de' ? 'Abteilung' : 'Department' }}
            </p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ user.department || '-' }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button @click="viewUser(user)" class="p-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
            <Eye class="h-4 w-4" />
          </button>
          <button @click="editUser(user)" class="p-2 text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 rounded-lg transition-colors">
            <Edit class="h-4 w-4" />
          </button>
          <button @click="toggleUserStatus(user)" class="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
            <component :is="user.status === 'Active' ? Lock : Unlock" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Mobile Pagination -->
      <div v-if="filteredUsers.length > itemsPerPage" class="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          {{ language === 'de' ? 'Zeige' : 'Showing' }} 
          {{ ((currentPage - 1) * itemsPerPage) + 1 }} 
          {{ language === 'de' ? 'bis' : 'to' }} 
          {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} 
          {{ language === 'de' ? 'von' : 'of' }} 
          {{ filteredUsers.length }} 
          {{ language === 'de' ? 'Benutzern' : 'users' }}
        </div>
        <div class="flex space-x-1">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ language === 'de' ? 'Zurück' : 'Previous' }}
          </button>
          
          <template v-for="page in visiblePageNumbers" :key="page">
            <button
              v-if="page !== '...'"
              @click="currentPage = page"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">...</span>
          </template>
          
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ language === 'de' ? 'Weiter' : 'Next' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Role Management -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {{ language === 'de' ? 'Rollenverwaltung' : 'Role Management' }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="role in roleDetails" :key="role.value" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all">
          <div class="flex items-center justify-between mb-3">
            <span :class="getRoleBadgeColor(role.value)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ role.label }}
            </span>
            <button @click="editRolePermissions(role)" class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors">
              <Edit class="h-4 w-4" />
            </button>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ role.description }}</p>
          <div class="space-y-1">
            <p class="text-xs font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Berechtigungen:' : 'Permissions:' }}</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="permission in role.permissions.slice(0, 3)" :key="permission" class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-500">
                {{ permission }}
              </span>
              <span v-if="role.permissions.length > 3" class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-500">
                +{{ role.permissions.length - 3 }} {{ language === 'de' ? 'mehr' : 'more' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showUserModal" class="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4 border border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neuen Benutzer hinzufügen' : 'Add New User' }}
            </h3>
            <button @click="showUserModal = false" class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="addUser" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Vorname' : 'First Name' }}
                </label>
                <input v-model="userForm.firstName" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Nachname' : 'Last Name' }}
                </label>
                <input v-model="userForm.lastName" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'E-Mail' : 'Email' }}
              </label>
              <input v-model="userForm.email" type="email" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Rolle' : 'Role' }}
                </label>
                <select v-model="userForm.role" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">{{ language === 'de' ? 'Rolle wählen' : 'Select Role' }}</option>
                  <option v-for="role in roles" :key="role.value" :value="role.value">{{ role.label }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Abteilung' : 'Department' }}
                </label>
                <select v-model="userForm.department" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">{{ language === 'de' ? 'Abteilung wählen' : 'Select Department' }}</option>
                  <option v-for="department in departments" :key="department.id" :value="department.name">{{ department.name }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Passwort' : 'Password' }}
              </label>
              <input v-model="userForm.password" type="password" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ language === 'de' ? 'Mindestens 8 Zeichen, mit Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen.' : 'Minimum 8 characters, with uppercase, lowercase, numbers, and special characters.' }}
              </p>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="showUserModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Benutzer hinzufügen' : 'Add User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Import Users Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4 border border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Benutzer importieren' : 'Import Users' }}
            </h3>
            <button @click="showImportModal = false" class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Datei hochladen' : 'Upload File' }}
              </label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div class="flex flex-col items-center justify-center pt-7">
                    <Upload class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    <p class="pt-1 text-sm text-gray-600 dark:text-gray-400">
                      {{ language === 'de' ? 'CSV-Datei hierher ziehen oder klicken' : 'Drag CSV file here or click to upload' }}
                    </p>
                  </div>
                  <input type="file" class="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Import-Optionen' : 'Import Options' }}
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" v-model="importOptions.sendWelcomeEmail" class="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2" />
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Willkommens-E-Mail senden' : 'Send welcome email' }}
                  </span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="importOptions.updateExisting" class="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2" />
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Bestehende Benutzer aktualisieren' : 'Update existing users' }}
                  </span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="importOptions.generatePasswords" class="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2" />
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Passwörter automatisch generieren' : 'Generate passwords automatically' }}
                  </span>
                </label>
              </div>
            </div>

            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2">
                {{ language === 'de' ? 'CSV-Format' : 'CSV Format' }}
              </h4>
              <p class="text-sm text-blue-600 dark:text-blue-300">
                {{ language === 'de' ? 'Die CSV-Datei sollte folgende Spalten enthalten: Vorname, Nachname, E-Mail, Rolle, Abteilung (optional)' : 'The CSV file should contain the following columns: First Name, Last Name, Email, Role, Department (optional)' }}
              </p>
              <a href="#" class="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mt-2 inline-block transition-colors">
                {{ language === 'de' ? 'Vorlage herunterladen' : 'Download template' }}
              </a>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button @click="showImportModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button @click="importUsers" class="btn-primary">
                {{ language === 'de' ? 'Importieren' : 'Import' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Plus, Edit, Eye, Search, X, Lock, Unlock, Upload, Users } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showUserModal = ref(false)
const showImportModal = ref(false)
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(6) // 6 cards per page for mobile

// Reset pagination when filters change
watch([searchQuery, selectedRole, selectedStatus], () => {
  currentPage.value = 1
})

const userForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  department: '',
  password: ''
})

const importOptions = ref({
  sendWelcomeEmail: true,
  updateExisting: false,
  generatePasswords: true
})

const roles = computed(() => [
  { value: 'schooladmin', label: language.value === 'de' ? 'Schuladministrator' : 'School Administrator', 
    description: language.value === 'de' ? 'Verwaltet die gesamte Schule' : 'Manages the entire school',
    permissions: ['User Management', 'Department Management', 'School Settings', 'Reports', 'System Access'] },
  { value: 'principal', label: language.value === 'de' ? 'Schulleiter' : 'Principal',
    description: language.value === 'de' ? 'Leitet die Schule und überwacht alle Aktivitäten' : 'Leads the school and oversees all activities',
    permissions: ['View All Data', 'Approve Actions', 'Financial Overview', 'Staff Management', 'Reports'] },
  { value: 'teacher', label: language.value === 'de' ? 'Lehrer' : 'Teacher',
    description: language.value === 'de' ? 'Unterrichtet Fächer und bewertet Schüler' : 'Teaches subjects and grades students',
    permissions: ['Class Management', 'Grade Entry', 'Attendance Tracking', 'Student Reports', 'Messaging'] },
  { value: 'schoolstaff', label: language.value === 'de' ? 'Schulpersonal' : 'School Staff',
    description: language.value === 'de' ? 'Unterstützt bei Verwaltung und Schulbetrieb' : 'Supports administration and school operations',
    permissions: ['Student Search', 'Library Management', 'Finance Tools', 'Attendance Tracking', 'Inventory Management'] },
  { value: 'student', label: language.value === 'de' ? 'Schüler' : 'Student',
    description: language.value === 'de' ? 'Nimmt am Unterricht teil und erhält Bewertungen' : 'Participates in classes and receives grades',
    permissions: ['View Grades', 'View Schedule', 'Submit Assignments', 'View Announcements', 'Personal Profile'] },
  { value: 'parent', label: language.value === 'de' ? 'Eltern' : 'Parent',
    description: language.value === 'de' ? 'Überwacht den Fortschritt der Kinder' : 'Monitors children\'s progress',
    permissions: ['View Child Data', 'Communication', 'Payment History', 'Attendance Reports', 'Event Calendar'] },
  { value: 'admin', label: language.value === 'de' ? 'Administrator' : 'Administrator',
    description: language.value === 'de' ? 'Verwaltet technische Aspekte des Systems' : 'Manages technical aspects of the system',
    permissions: ['System Configuration', 'User Management', 'Data Management', 'Security Settings', 'Logs & Monitoring'] },
  { value: 'inspector', label: language.value === 'de' ? 'Bildungsinspektor' : 'Educational Inspector',
    description: language.value === 'de' ? 'Überwacht Bildungsstandards und Compliance' : 'Monitors educational standards and compliance',
    permissions: ['View School Data', 'Compliance Reports', 'Quality Assessment', 'Audit Logs', 'Recommendations'] }
])

const roleDetails = computed(() => roles.value)

const departments = ref([
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Sciences' },
  { id: 3, name: 'Languages' },
  { id: 4, name: 'Arts' },
  { id: 5, name: 'Sports' }
])

const users = ref([
  {
    id: 1,
    name: 'Sarah Fischer',
    email: 'sarah.fischer@admin.winschool.de',
    role: 'schooladmin',
    department: '',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 2,
    name: 'Prof. Dr. Michael Wagner',
    email: 'michael.wagner@principal.winschool.de',
    role: 'principal',
    department: '',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 3,
    name: 'Dr. Thomas Weber',
    email: 'thomas.weber@teacher.winschool.de',
    role: 'teacher',
    department: 'Mathematics',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 4,
    name: 'Ms. Sarah Schmidt',
    email: 'sarah.schmidt@teacher.winschool.de',
    role: 'teacher',
    department: 'Languages',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 5,
    name: 'Max Müller',
    email: 'max.mueller@student.winschool.de',
    role: 'student',
    department: '',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 6,
    name: 'Anna Schmidt',
    email: 'anna.schmidt@parent.winschool.de',
    role: 'parent',
    department: '',
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 7,
    name: 'Johannes Bauer',
    email: 'johannes.bauer@teacher.winschool.de',
    role: 'teacher',
    department: 'Sports',
    status: 'Inactive',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
])

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !selectedRole.value || user.role === selectedRole.value
    const matchesStatus = !selectedStatus.value || user.status === selectedStatus.value
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

const visiblePageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2 // Number of pages to show on each side of current page
  
  if (total <= 7) {
    // Show all pages if total is 7 or less
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  let range = []
  let rangeWithDots = []
  
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }
  
  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }
  
  rangeWithDots.push(...range)
  
  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else {
    rangeWithDots.push(total)
  }
  
  return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index)
})

const getRoleDisplayName = (role: string) => {
  const roleObj = roles.value.find(r => r.value === role)
  return roleObj ? roleObj.label : role
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'schooladmin':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    case 'principal':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'teacher':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'schoolstaff':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    case 'student':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'parent':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'admin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'inspector':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const addUser = () => {
  const newUser = {
    id: users.value.length + 1,
    name: `${userForm.value.firstName} ${userForm.value.lastName}`,
    email: userForm.value.email,
    role: userForm.value.role,
    department: userForm.value.department,
    status: 'Active',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
  
  users.value.push(newUser)
  showUserModal.value = false
  userForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    password: ''
  }
  
  alert(language.value === 'de' ? 'Benutzer erfolgreich hinzugefügt!' : 'User added successfully!')
}

const viewUser = (user: any) => {
  alert(`${language.value === 'de' ? 'Benutzer anzeigen' : 'View user'}: ${user.name}`)
}

const editUser = (user: any) => {
  alert(`${language.value === 'de' ? 'Benutzer bearbeiten' : 'Edit user'}: ${user.name}`)
}

const toggleUserStatus = (user: any) => {
  user.status = user.status === 'Active' ? 'Inactive' : 'Active'
  alert(`${language.value === 'de' ? 'Benutzerstatus geändert zu' : 'User status changed to'}: ${user.status}`)
}

const editRolePermissions = (role: any) => {
  alert(`${language.value === 'de' ? 'Rollenberechtigungen bearbeiten' : 'Edit role permissions'}: ${role.label}`)
}

const importUsers = () => {
  alert(language.value === 'de' ? 'Benutzerimport gestartet...' : 'User import started...')
  showImportModal.value = false
}
</script>