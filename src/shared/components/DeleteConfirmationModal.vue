<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in"
    @click="handleBackdropClick"
  >
    <!-- Modal -->
    <div 
      class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl animate-slide-up"
      @click.stop
    >
      <!-- Header -->
      <div class="p-6 pb-0">
        <div class="flex items-center space-x-3 mb-4">
          <div class="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Confirmar Exclusão
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Esta ação não pode ser desfeita
            </p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 pb-6">
        <!-- Document info -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
          <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <strong>Documento:</strong>
          </p>
          <p class="text-sm text-gray-900 dark:text-gray-100 font-medium break-words">
            {{ documentTitle }}
          </p>
        </div>

        <!-- Security warning -->
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-6">
          <div class="flex items-start space-x-3">
            <svg class="flex-shrink-0 w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h4 class="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                Acesso Administrativo Requerido
              </h4>
              <p class="text-sm text-amber-700 dark:text-amber-300">
                Para excluir documentos, é necessário inserir a senha de administrador.
              </p>
            </div>
          </div>
        </div>

        <!-- Password input -->
        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <label for="admin-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha do Administrador
            </label>
            <div class="relative">
              <input
                id="admin-password"
                ref="passwordInput"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :class="[
                  'w-full px-4 py-3 pr-12 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
                  passwordError
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                ]"
                placeholder="Digite a senha de administrador"
                autocomplete="current-password"
                :disabled="isProcessing"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                :disabled="isProcessing"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <!-- Error message -->
            <transition name="fade">
              <p v-if="passwordError" class="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <svg class="flex-shrink-0 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ passwordError }}</span>
              </p>
            </transition>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3">
            <button
              type="button"
              @click="handleCancel"
              :disabled="isProcessing"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isProcessing || !password.trim()"
              class="px-6 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg 
                v-if="isProcessing" 
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              
              <span>{{ isProcessing ? 'Excluindo...' : 'Excluir Documento' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Props {
  isVisible: boolean
  documentTitle: string
  isProcessing?: boolean
}

interface Emits {
  (e: 'confirm', password: string): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  isProcessing: false
})

const emit = defineEmits<Emits>()

// Reactive state
const password = ref('')
const passwordError = ref('')
const showPassword = ref(false)
const passwordInput = ref<HTMLInputElement>()

// Admin password constant
const ADMIN_PASSWORD = 'Ragbot2025!'

// Methods
const handleSubmit = () => {
  passwordError.value = ''
  
  if (!password.value.trim()) {
    passwordError.value = 'Por favor, digite a senha'
    return
  }
  
  if (password.value !== ADMIN_PASSWORD) {
    passwordError.value = 'Senha incorreta. Acesso negado.'
    // Clear password after wrong attempt
    password.value = ''
    return
  }
  
  emit('confirm', password.value)
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const handleBackdropClick = () => {
  if (!props.isProcessing) {
    handleCancel()
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const resetForm = () => {
  password.value = ''
  passwordError.value = ''
  showPassword.value = false
}

// Watch for modal visibility changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    resetForm()
    // Focus password input when modal opens
    nextTick(() => {
      passwordInput.value?.focus()
    })
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
  } else {
    // Restore body scroll
    document.body.style.overflow = ''
  }
})

// Watch for processing state changes
watch(() => props.isProcessing, (newValue) => {
  if (!newValue && props.isVisible) {
    // Reset form after processing is done
    resetForm()
  }
})

// Clean up on unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ensure backdrop blur effect */
.bg-black {
  backdrop-filter: blur(4px);
}

/* Hide password manager icons in some browsers */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}

/* Focus ring improvements */
input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Disable text selection on modal backdrop */
.fixed.inset-0 {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Re-enable text selection inside modal */
.relative.w-full {
  -webkit-user-select: auto;
  -moz-user-select: auto;
  -ms-user-select: auto;
  user-select: auto;
}
</style>