<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="mx-auto h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
          <GraduationCap class="h-8 w-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ language === 'de' ? 'Online-Bewerbung' : 'Online Application' }}</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ language === 'de' ? 'Füllen Sie das Formular aus, um sich für die Aufnahme zu bewerben' : 'Complete the form to apply for admission' }}
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between mb-2">
          <div v-for="(step, index) in steps" :key="step.id" class="flex flex-col items-center">
            <div 
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep >= index 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              ]"
            >
              {{ index + 1 }}
            </div>
            <span class="text-xs mt-1 text-gray-600 dark:text-gray-400">{{ step.name }}</span>
          </div>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
          <div 
            class="bg-primary-600 h-2 rounded-full transition-all duration-300" 
            :style="{ width: `${(currentStep / (steps.length - 1)) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Application Form -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-8">
        <!-- Step 1: School Selection -->
        <div v-if="currentStep === 0">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {{ language === 'de' ? 'Schule auswählen' : 'Select School' }}
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Schule' : 'School' }}*
              </label>
              <select 
                v-model="formData.schoolId" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Bitte wählen Sie eine Schule' : 'Please select a school' }}</option>
                <option v-for="school in schools" :key="school.id" :value="school.id">{{ school.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Programm/Klassenstufe' : 'Program/Grade Level' }}*
              </label>
              <select 
                v-model="formData.program" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Bitte wählen Sie ein Programm' : 'Please select a program' }}</option>
                <option v-for="program in programs" :key="program" :value="program">{{ program }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Gewünschtes Startdatum' : 'Desired Start Date' }}*
              </label>
              <input 
                v-model="formData.startDate" 
                type="date" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Student Information -->
        <div v-if="currentStep === 1">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {{ language === 'de' ? 'Schülerinformationen' : 'Student Information' }}
          </h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Vorname' : 'First Name' }}*
                </label>
                <input 
                  v-model="formData.student.firstName" 
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Nachname' : 'Last Name' }}*
                </label>
                <input 
                  v-model="formData.student.lastName" 
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Geburtsdatum' : 'Date of Birth' }}*
                </label>
                <input 
                  v-model="formData.student.dateOfBirth" 
                  type="date" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Geschlecht' : 'Gender' }}*
                </label>
                <select 
                  v-model="formData.student.gender" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{{ language === 'de' ? 'Bitte wählen' : 'Please select' }}</option>
                  <option value="male">{{ language === 'de' ? 'Männlich' : 'Male' }}</option>
                  <option value="female">{{ language === 'de' ? 'Weiblich' : 'Female' }}</option>
                  <option value="other">{{ language === 'de' ? 'Andere' : 'Other' }}</option>
                  <option value="prefer_not_to_say">{{ language === 'de' ? 'Keine Angabe' : 'Prefer not to say' }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Aktuelle/Vorherige Schule' : 'Current/Previous School' }}
              </label>
              <input 
                v-model="formData.student.previousSchool" 
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Adresse' : 'Address' }}*
              </label>
              <textarea 
                v-model="formData.student.address" 
                rows="3" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              ></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'E-Mail' : 'Email' }}
                </label>
                <input 
                  v-model="formData.student.email" 
                  type="email" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Telefon' : 'Phone' }}
                </label>
                <input 
                  v-model="formData.student.phone" 
                  type="tel" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Parent/Guardian Information -->
        <div v-if="currentStep === 2">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {{ language === 'de' ? 'Eltern-/Erziehungsberechtigteninformationen' : 'Parent/Guardian Information' }}
          </h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Vorname' : 'First Name' }}*
                </label>
                <input 
                  v-model="formData.parent.firstName" 
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Nachname' : 'Last Name' }}*
                </label>
                <input 
                  v-model="formData.parent.lastName" 
                  type="text" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Beziehung zum Schüler' : 'Relationship to Student' }}*
              </label>
              <select 
                v-model="formData.parent.relationship" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{{ language === 'de' ? 'Bitte wählen' : 'Please select' }}</option>
                <option value="mother">{{ language === 'de' ? 'Mutter' : 'Mother' }}</option>
                <option value="father">{{ language === 'de' ? 'Vater' : 'Father' }}</option>
                <option value="guardian">{{ language === 'de' ? 'Erziehungsberechtigte(r)' : 'Legal Guardian' }}</option>
                <option value="other">{{ language === 'de' ? 'Andere' : 'Other' }}</option>
              </select>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'E-Mail' : 'Email' }}*
                </label>
                <input 
                  v-model="formData.parent.email" 
                  type="email" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Telefon' : 'Phone' }}*
                </label>
                <input 
                  v-model="formData.parent.phone" 
                  type="tel" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Adresse (falls abweichend vom Schüler)' : 'Address (if different from student)' }}
              </label>
              <textarea 
                v-model="formData.parent.address" 
                rows="3" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Step 4: Documents Upload -->
        <div v-if="currentStep === 3">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {{ language === 'de' ? 'Dokumente hochladen' : 'Upload Documents' }}
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Zeugnis/Leistungsnachweis' : 'Transcript/Academic Record' }}*
              </label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div class="flex flex-col items-center justify-center pt-7">
                    <Upload class="w-8 h-8 text-gray-400" />
                    <p class="pt-1 text-sm text-gray-600 dark:text-gray-400">
                      {{ language === 'de' ? 'Datei hierher ziehen oder klicken' : 'Drag file here or click to upload' }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-500">
                      PDF, JPG, PNG (max. 5MB)
                    </p>
                  </div>
                  <input type="file" class="hidden" />
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Geburtsurkunde/Ausweis' : 'Birth Certificate/ID' }}*
              </label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div class="flex flex-col items-center justify-center pt-7">
                    <Upload class="w-8 h-8 text-gray-400" />
                    <p class="pt-1 text-sm text-gray-600 dark:text-gray-400">
                      {{ language === 'de' ? 'Datei hierher ziehen oder klicken' : 'Drag file here or click to upload' }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-500">
                      PDF, JPG, PNG (max. 5MB)
                    </p>
                  </div>
                  <input type="file" class="hidden" />
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Zusätzliche Dokumente (optional)' : 'Additional Documents (optional)' }}
              </label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div class="flex flex-col items-center justify-center pt-7">
                    <Upload class="w-8 h-8 text-gray-400" />
                    <p class="pt-1 text-sm text-gray-600 dark:text-gray-400">
                      {{ language === 'de' ? 'Datei hierher ziehen oder klicken' : 'Drag file here or click to upload' }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-500">
                      PDF, JPG, PNG (max. 5MB)
                    </p>
                  </div>
                  <input type="file" class="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Review & Submit -->
        <div v-if="currentStep === 4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {{ language === 'de' ? 'Überprüfen & Absenden' : 'Review & Submit' }}
          </h2>
          
          <div class="space-y-6">
            <!-- School Information -->
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                {{ language === 'de' ? 'Schulinformationen' : 'School Information' }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Schule' : 'School' }}:</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ getSchoolName(formData.schoolId) }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Programm' : 'Program' }}:</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ formData.program }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Startdatum' : 'Start Date' }}:</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ formData.startDate }}</p>
                </div>
              </div>
            </div>
            
            <!-- Student Information -->
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                {{ language === 'de' ? 'Schülerinformationen' : 'Student Information' }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Name' : 'Name' }}:</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ formData.student.firstName }} {{ formData.student.lastName }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Geburtsdatum' : 'Date of Birth' }}:</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ formData.student.dateOfBirth }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Adresse' : 'Address' }}:</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ formData.student.address }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'E-Mail' : 'Email' }}:</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ formData.student.email || '-' }}</p>
                </div>
              </div>
            </div>
            
            <!-- Parent Information -->
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                {{ language === 'de' ? 'Eltern-/Erziehungsberechtigteninformationen' : 'Parent/Guardian Information' }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Name' : 'Name' }}:</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ formData.parent.firstName }} {{ formData.parent.lastName }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Beziehung' : 'Relationship' }}:</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ getRelationshipName(formData.parent.relationship) }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'E-Mail' : 'Email' }}:</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ formData.parent.email }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Telefon' : 'Phone' }}:</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ formData.parent.phone }}</p>
                </div>
              </div>
            </div>
            
            <!-- Documents -->
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                {{ language === 'de' ? 'Hochgeladene Dokumente' : 'Uploaded Documents' }}
              </h3>
              <ul class="space-y-1 text-sm">
                <li class="flex items-center">
                  <CheckCircle class="h-4 w-4 text-green-600 mr-2" />
                  <span class="text-gray-900 dark:text-white">{{ language === 'de' ? 'Zeugnis/Leistungsnachweis' : 'Transcript/Academic Record' }}</span>
                </li>
                <li class="flex items-center">
                  <CheckCircle class="h-4 w-4 text-green-600 mr-2" />
                  <span class="text-gray-900 dark:text-white">{{ language === 'de' ? 'Geburtsurkunde/Ausweis' : 'Birth Certificate/ID' }}</span>
                </li>
              </ul>
            </div>
            
            <!-- Privacy Policy Consent -->
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input 
                    id="privacy" 
                    v-model="formData.privacyConsent"
                    type="checkbox" 
                    required
                    class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="privacy" class="font-medium text-gray-700 dark:text-gray-300">
                    {{ language === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy' }}*
                  </label>
                  <p class="text-gray-500 dark:text-gray-400">
                    {{ language === 'de' 
                      ? 'Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Daten zu.' 
                      : 'I have read the privacy policy and consent to the processing of my data.' }}
                    <a href="#" class="text-primary-600 hover:text-primary-800">
                      {{ language === 'de' ? 'Datenschutzerklärung lesen' : 'Read privacy policy' }}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="currentStep === 5" class="text-center py-8">
          <CheckCircle class="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ language === 'de' ? 'Bewerbung erfolgreich eingereicht!' : 'Application Successfully Submitted!' }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ language === 'de' 
              ? 'Vielen Dank für Ihre Bewerbung. Wir werden uns in Kürze mit Ihnen in Verbindung setzen.' 
              : 'Thank you for your application. We will be in touch with you shortly.' }}
          </p>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ language === 'de' 
              ? 'Ihre Bewerbungsnummer: ' 
              : 'Your application reference number: ' }}
            <span class="font-medium text-gray-900 dark:text-white">APP-{{ Math.floor(Math.random() * 10000).toString().padStart(4, '0') }}</span>
          </p>
          <div class="flex justify-center">
            <router-link to="/login" class="btn-primary">
              {{ language === 'de' ? 'Zurück zur Anmeldeseite' : 'Back to Login Page' }}
            </router-link>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div v-if="currentStep < 5" class="flex justify-between mt-8">
          <button 
            v-if="currentStep > 0" 
            @click="currentStep--" 
            class="btn-secondary"
          >
            {{ language === 'de' ? 'Zurück' : 'Back' }}
          </button>
          <div v-else></div>
          
          <button 
            v-if="currentStep < 4" 
            @click="nextStep" 
            class="btn-primary"
            :disabled="!canProceed"
          >
            {{ language === 'de' ? 'Weiter' : 'Next' }}
          </button>
          <button 
            v-else 
            @click="submitApplication" 
            class="btn-primary"
            :disabled="!formData.privacyConsent"
          >
            {{ language === 'de' ? 'Bewerbung absenden' : 'Submit Application' }}
          </button>
        </div>
      </div>

      <!-- Login Link -->
      <div class="text-center mt-6">
        <p class="text-gray-600 dark:text-gray-400">
          {{ language === 'de' ? 'Bereits ein Konto?' : 'Already have an account?' }}
          <router-link to="/login" class="text-primary-600 hover:text-primary-800 font-medium">
            {{ language === 'de' ? 'Anmelden' : 'Sign In' }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { GraduationCap, CheckCircle, Upload } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const currentStep = ref(0)

const steps = [
  { id: 'school', name: language.value === 'de' ? 'Schule' : 'School' },
  { id: 'student', name: language.value === 'de' ? 'Schüler' : 'Student' },
  { id: 'parent', name: language.value === 'de' ? 'Eltern' : 'Parent' },
  { id: 'documents', name: language.value === 'de' ? 'Dokumente' : 'Documents' },
  { id: 'review', name: language.value === 'de' ? 'Überprüfen' : 'Review' }
]

const schools = [
  { id: 1, name: 'Gymnasium Berlin-Mitte' },
  { id: 2, name: 'Realschule Hamburg-Nord' },
  { id: 3, name: 'Gesamtschule München-Süd' },
  { id: 4, name: 'Grundschule Frankfurt-West' },
  { id: 5, name: 'Hauptschule Köln-West' }
]

const programs = [
  'Grade 5 Admission',
  'Grade 6 Admission',
  'Grade 7 Admission',
  'Grade 8 Admission',
  'Grade 9 Admission',
  'Grade 10 Admission',
  'Grade 11 Admission',
  'Grade 12 Admission'
]

const formData = ref({
  schoolId: '',
  program: '',
  startDate: '',
  student: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    previousSchool: '',
    address: '',
    email: '',
    phone: ''
  },
  parent: {
    firstName: '',
    lastName: '',
    relationship: '',
    email: '',
    phone: '',
    address: ''
  },
  documents: {
    transcript: null,
    idDocument: null,
    additional: null
  },
  privacyConsent: false
})

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return formData.value.schoolId && formData.value.program && formData.value.startDate
  } else if (currentStep.value === 1) {
    return formData.value.student.firstName && 
           formData.value.student.lastName && 
           formData.value.student.dateOfBirth && 
           formData.value.student.gender && 
           formData.value.student.address
  } else if (currentStep.value === 2) {
    return formData.value.parent.firstName && 
           formData.value.parent.lastName && 
           formData.value.parent.relationship && 
           formData.value.parent.email && 
           formData.value.parent.phone
  } else if (currentStep.value === 3) {
    // For document uploads, we'll assume they're required but for demo purposes we'll allow proceeding
    return true
  } else if (currentStep.value === 4) {
    return formData.value.privacyConsent
  }
  return true
})

const getSchoolName = (id: string) => {
  const school = schools.find(s => s.id.toString() === id)
  return school ? school.name : ''
}

const getRelationshipName = (relationship: string) => {
  const relationships: Record<string, string> = {
    mother: language.value === 'de' ? 'Mutter' : 'Mother',
    father: language.value === 'de' ? 'Vater' : 'Father',
    guardian: language.value === 'de' ? 'Erziehungsberechtigte(r)' : 'Legal Guardian',
    other: language.value === 'de' ? 'Andere' : 'Other'
  }
  return relationships[relationship] || relationship
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const submitApplication = () => {
  // Here you would typically send the form data to your backend
  console.log('Submitting application:', formData.value)
  
  // For demo purposes, we'll just move to the success step
  currentStep.value = 5
}
</script>
