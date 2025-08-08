<!-- ConfigModal.vue -->
<template>
    <q-dialog v-model="dialogVisible" persistent>
        <q-card style="min-width: 400px; max-width: 90vw;">
            <q-card-section>
                <div class="text-h6">Configurações do Sistema</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="text-h6">Preferências</div>
                <q-toggle v-model="tempDarkMode" label="Modo escuro" color="green" />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn flat label="Cancelar" v-close-popup />
                <q-btn label="Salvar" color="green" @click="saveSettings" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar';

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()
const $q = useQuasar();
const tempDarkMode = ref($q.dark.isActive);

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
})

function saveSettings() {
    $q.dark.set(tempDarkMode.value);
    $q.notify({
        type: 'positive',
        message: 'Configurações salvas!',
        position: 'top-right',
        timeout: 1000
    });
}
</script>