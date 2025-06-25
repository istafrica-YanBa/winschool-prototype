<template>
  <div class="system-config bg-gray-50 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'System-Konfiguration' : 'System Configuration' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie globale Systemeinstellungen' : 'Manage global system settings' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="saveAllSettings" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Save class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Alle Einstellungen speichern' : 'Save All Settings' }}
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Configuration Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in configTabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <component :is="tab.icon" class="h-4 w-4 inline-block mr-2" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Security Settings -->
        <div v-if="activeTab === 'security'" class="mt-6 space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Passwort-Richtlinien' : 'Password Policies' }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Minimale Passwortlänge' : 'Minimum Password Length' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Mindestanzahl an Zeichen für Passwörter' : 'Minimum number of characters for passwords' }}
                  </p>
                </div>
                <select v-model="securitySettings.minPasswordLength" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option v-for="n in 10" :key="n" :value="n + 5">{{ n + 5 }}</option>
                </select>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Passwort-Komplexität' : 'Password Complexity' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Erfordert Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen' : 'Requires uppercase, lowercase, numbers, and special characters' }}
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="securitySettings.passwordComplexity"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Passwort-Ablaufzeit' : 'Password Expiry' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Passwörter laufen nach dieser Zeit ab' : 'Passwords expire after this period' }}
                  </p>
                </div>
                <select v-model="securitySettings.passwordExpiry" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="never">{{ language === 'de' ? 'Nie' : 'Never' }}</option>
                  <option value="30days">{{ language === 'de' ? '30 Tage' : '30 Days' }}</option>
                  <option value="60days">{{ language === 'de' ? '60 Tage' : '60 Days' }}</option>
                  <option value="90days">{{ language === 'de' ? '90 Tage' : '90 Days' }}</option>
                  <option value="180days">{{ language === 'de' ? '180 Tage' : '180 Days' }}</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Zwei-Faktor-Authentifizierung' : 'Two-Factor Authentication' }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? '2FA für Administratoren erzwingen' : 'Enforce 2FA for Administrators' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Erfordert 2FA für alle Administratorkonten' : 'Requires 2FA for all administrator accounts' }}
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="securitySettings.enforce2FAForAdmins"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? '2FA für alle Benutzer aktivieren' : 'Enable 2FA for All Users' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Ermöglicht 2FA für alle Benutzerkonten' : 'Allows 2FA for all user accounts' }}
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="securitySettings.enable2FAForAll"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Sitzungseinstellungen' : 'Session Settings' }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Sitzungs-Timeout' : 'Session Timeout' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Inaktive Sitzungen werden nach dieser Zeit beendet' : 'Inactive sessions will be terminated after this period' }}
                  </p>
                </div>
                <select v-model="securitySettings.sessionTimeout" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="15min">{{ language === 'de' ? '15 Minuten' : '15 Minutes' }}</option>
                  <option value="30min">{{ language === 'de' ? '30 Minuten' : '30 Minutes' }}</option>
                  <option value="1hour">{{ language === 'de' ? '1 Stunde' : '1 Hour' }}</option>
                  <option value="2hours">{{ language === 'de' ? '2 Stunden' : '2 Hours' }}</option>
                  <option value="4hours">{{ language === 'de' ? '4 Stunden' : '4 Hours' }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Email Settings -->
        <div v-if="activeTab === 'email'" class="mt-6 space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'SMTP-Konfiguration' : 'SMTP Configuration' }}
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'SMTP-Server' : 'SMTP Server' }}
                </label>
                <input v-model="emailSettings.smtpServer" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Port' : 'Port' }}
                  </label>
                  <input v-model="emailSettings.smtpPort" type="number" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Verschlüsselung' : 'Encryption' }}
                  </label>
                  <select v-model="emailSettings.encryption" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="none">{{ language === 'de' ? 'Keine' : 'None' }}</option>
                    <option value="ssl">SSL</option>
                    <option value="tls">TLS</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Benutzername' : 'Username' }}
                  </label>
                  <input v-model="emailSettings.username" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ language === 'de' ? 'Passwort' : 'Password' }}
                  </label>
                  <input v-model="emailSettings.password" type="password" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Absender-E-Mail' : 'Sender Email' }}
                </label>
                <input v-model="emailSettings.senderEmail" type="email" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Absendername' : 'Sender Name' }}
                </label>
                <input v-model="emailSettings.senderName" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div class="flex justify-end">
                <button @click="testEmailSettings" class="btn-secondary">
                  {{ language === 'de' ? 'Verbindung testen' : 'Test Connection' }}
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'E-Mail-Vorlagen' : 'Email Templates' }}
            </h3>
            <div class="space-y-4">
              <div v-for="template in emailTemplates" :key="template.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="font-medium text-gray-900 dark:text-white">{{ template.name }}</h4>
                  <button @click="editEmailTemplate(template)" class="text-primary-600 hover:text-primary-800">
                    <Edit class="h-4 w-4" />
                  </button>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ template.description }}</p>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs text-gray-500 dark:text-gray-500">{{ language === 'de' ? 'Letzte Änderung:' : 'Last modified:' }} {{ template.lastModified }}</span>
                  <button @click="previewEmailTemplate(template)" class="text-primary-600 hover:text-primary-800 text-sm">
                    {{ language === 'de' ? 'Vorschau' : 'Preview' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Localization Settings -->
        <div v-if="activeTab === 'localization'" class="mt-6 space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Spracheinstellungen' : 'Language Settings' }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Standardsprache' : 'Default Language' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Standardsprache für neue Benutzer' : 'Default language for new users' }}
                  </p>
                </div>
                <select v-model="localizationSettings.defaultLanguage" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Verfügbare Sprachen' : 'Available Languages' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Sprachen, die Benutzer auswählen können' : 'Languages that users can select' }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label v-for="lang in availableLanguages" :key="lang.code" class="flex items-center">
                    <input
                      v-model="localizationSettings.enabledLanguages"
                      type="checkbox"
                      :value="lang.code"
                      class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
                    />
                    <span class="text-sm text-gray-900 dark:text-white">{{ lang.name }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Regionale Einstellungen' : 'Regional Settings' }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Datumsformat' : 'Date Format' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Standardformat für Datumsanzeige' : 'Default format for date display' }}
                  </p>
                </div>
                <select v-model="localizationSettings.dateFormat" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Zeitformat' : 'Time Format' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Standardformat für Zeitanzeige' : 'Default format for time display' }}
                  </p>
                </div>
                <select v-model="localizationSettings.timeFormat" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="24h">24h</option>
                  <option value="12h">12h (AM/PM)</option>
                </select>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Zeitzone' : 'Timezone' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Standardzeitzone für das System' : 'Default timezone for the system' }}
                  </p>
                </div>
                <select v-model="localizationSettings.timezone" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="Europe/Berlin">Europe/Berlin</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Appearance Settings -->
        <div v-if="activeTab === 'appearance'" class="mt-6 space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Markeneinstellungen' : 'Branding Settings' }}
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Systemname' : 'System Name' }}
                </label>
                <input v-model="appearanceSettings.systemName" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Logo' : 'Logo' }}
                </label>
                <div class="flex items-center space-x-4">
                  <div class="h-16 w-16 bg-primary-600 rounded-lg flex items-center justify-center">
                    <GraduationCap class="h-8 w-8 text-white" />
                  </div>
                  <button class="btn-secondary text-sm">
                    {{ language === 'de' ? 'Logo ändern' : 'Change Logo' }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Primärfarbe' : 'Primary Color' }}
                </label>
                <div class="flex items-center space-x-4">
                  <div class="h-8 w-8 bg-primary-600 rounded-lg"></div>
                  <input v-model="appearanceSettings.primaryColor" type="text" class="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <button class="btn-secondary text-sm">
                    {{ language === 'de' ? 'Farbe wählen' : 'Choose Color' }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Sekundärfarbe' : 'Secondary Color' }}
                </label>
                <div class="flex items-center space-x-4">
                  <div class="h-8 w-8 bg-secondary-600 rounded-lg"></div>
                  <input v-model="appearanceSettings.secondaryColor" type="text" class="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <button class="btn-secondary text-sm">
                    {{ language === 'de' ? 'Farbe wählen' : 'Choose Color' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Theme-Einstellungen' : 'Theme Settings' }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Standard-Theme' : 'Default Theme' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Standardtheme für neue Benutzer' : 'Default theme for new users' }}
                  </p>
                </div>
                <select v-model="appearanceSettings.defaultTheme" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="light">{{ language === 'de' ? 'Hell' : 'Light' }}</option>
                  <option value="dark">{{ language === 'de' ? 'Dunkel' : 'Dark' }}</option>
                  <option value="system">{{ language === 'de' ? 'Systemeinstellung' : 'System Setting' }}</option>
                </select>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Benutzerdefiniertes Theme erlauben' : 'Allow Custom Theme' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Benutzer können ihr eigenes Theme wählen' : 'Users can choose their own theme' }}
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="appearanceSettings.allowCustomTheme"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- System Settings -->
        <div v-if="activeTab === 'system'" class="mt-6 space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Systemeinstellungen' : 'System Settings' }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Wartungsmodus' : 'Maintenance Mode' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'System in den Wartungsmodus versetzen' : 'Put system in maintenance mode' }}
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="systemSettings.maintenanceMode"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Debug-Modus' : 'Debug Mode' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Aktiviert erweiterte Protokollierung' : 'Enables enhanced logging' }}
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="systemSettings.debugMode"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Automatische Backups' : 'Automatic Backups' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Regelmäßige Systembackups planen' : 'Schedule regular system backups' }}
                  </p>
                </div>
                <select v-model="systemSettings.backupFrequency" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="daily">{{ language === 'de' ? 'Täglich' : 'Daily' }}</option>
                  <option value="weekly">{{ language === 'de' ? 'Wöchentlich' : 'Weekly' }}</option>
                  <option value="monthly">{{ language === 'de' ? 'Monatlich' : 'Monthly' }}</option>
                  <option value="disabled">{{ language === 'de' ? 'Deaktiviert' : 'Disabled' }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Backup-Aufbewahrung' : 'Backup Retention' }}
                </label>
                <select v-model="systemSettings.backupRetention" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="7days">{{ language === 'de' ? '7 Tage' : '7 Days' }}</option>
                  <option value="30days">{{ language === 'de' ? '30 Tage' : '30 Days' }}</option>
                  <option value="90days">{{ language === 'de' ? '90 Tage' : '90 Days' }}</option>
                  <option value="1year">{{ language === 'de' ? '1 Jahr' : '1 Year' }}</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'API-Einstellungen' : 'API Settings' }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'API-Zugriff aktivieren' : 'Enable API Access' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Ermöglicht externen Zugriff über API' : 'Allows external access via API' }}
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="systemSettings.enableAPI"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'API-Ratenbegrenzung' : 'API Rate Limiting' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ language === 'de' ? 'Maximale Anfragen pro Minute' : 'Maximum requests per minute' }}
                  </p>
                </div>
                <select v-model="systemSettings.apiRateLimit" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="60">60</option>
                  <option value="120">120</option>
                  <option value="300">300</option>
                  <option value="600">600</option>
                  <option value="1200">1200</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  Save, Shield, Mail, Globe, Palette, Settings, GraduationCap, Edit
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const activeTab = ref('security')

const configTabs = [
  { id: 'security', name: language.value === 'de' ? 'Sicherheit' : 'Security', icon: Shield },
  { id: 'email', name: language.value === 'de' ? 'E-Mail' : 'Email', icon: Mail },
  { id: 'localization', name: language.value === 'de' ? 'Lokalisierung' : 'Localization', icon: Globe },
  { id: 'appearance', name: language.value === 'de' ? 'Erscheinungsbild' : 'Appearance', icon: Palette },
  { id: 'system', name: language.value === 'de' ? 'System' : 'System', icon: Settings }
]

// Security Settings
const securitySettings = ref({
  minPasswordLength: 8,
  passwordComplexity: true,
  passwordExpiry: '90days',
  enforce2FAForAdmins: true,
  enable2FAForAll: false,
  sessionTimeout: '30min'
})

// Email Settings
const emailSettings = ref({
  smtpServer: 'smtp.winschool.de',
  smtpPort: 587,
  encryption: 'tls',
  username: 'notifications@winschool.de',
  password: '••••••••••••',
  senderEmail: 'notifications@winschool.de',
  senderName: 'WinSchool Notifications'
})

const emailTemplates = [
  {
    id: 1,
    name: 'Welcome Email',
    description: 'Sent to new users when their account is created',
    lastModified: '2024-03-10'
  },
  {
    id: 2,
    name: 'Password Reset',
    description: 'Sent when a user requests a password reset',
    lastModified: '2024-03-05'
  },
  {
    id: 3,
    name: 'Account Verification',
    description: 'Sent to verify user email addresses',
    lastModified: '2024-02-28'
  },
  {
    id: 4,
    name: 'System Notification',
    description: 'General system notifications and alerts',
    lastModified: '2024-02-20'
  }
]

// Localization Settings
const localizationSettings = ref({
  defaultLanguage: 'en',
  enabledLanguages: ['en', 'de'],
  dateFormat: 'DD.MM.YYYY',
  timeFormat: '24h',
  timezone: 'Europe/Berlin'
})

const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' }
]

// Appearance Settings
const appearanceSettings = ref({
  systemName: 'WinSchool',
  logo: 'logo.png',
  primaryColor: '#1a4d9e',
  secondaryColor: '#16a34a',
  defaultTheme: 'light',
  allowCustomTheme: true
})

// System Settings
const systemSettings = ref({
  maintenanceMode: false,
  debugMode: false,
  backupFrequency: 'daily',
  backupRetention: '30days',
  enableAPI: true,
  apiRateLimit: '300'
})

const saveAllSettings = () => {
  alert(language.value === 'de' ? 'Alle Einstellungen wurden gespeichert!' : 'All settings have been saved!')
}

const testEmailSettings = () => {
  alert(language.value === 'de' ? 'E-Mail-Verbindung erfolgreich getestet!' : 'Email connection tested successfully!')
}

const editEmailTemplate = (template: any) => {
  alert(`${language.value === 'de' ? 'E-Mail-Vorlage bearbeiten' : 'Edit email template'}: ${template.name}`)
}

const previewEmailTemplate = (template: any) => {
  alert(`${language.value === 'de' ? 'Vorschau der E-Mail-Vorlage' : 'Preview email template'}: ${template.name}`)
}
</script>
