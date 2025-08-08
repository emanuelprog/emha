<template>
    <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div class="column items-center">
            <div ref="registeredRef" style="width: 130px; max-width: 90vw; height: auto;" />

            <div class="text-h6 text-center q-mb-lg">Lista de Cadastrados</div>

            <div class="row items-center justify-center q-gutter-sm" style="width: 100%; max-width: 1200px;">
                <q-input outlined dense debounce="300" v-model="nameFilter" label="Buscar por nome" style="flex: 1"
                    @update:model-value="onRequest({ pagination })">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>

                <q-input outlined dense debounce="300" v-model="cpfFilter" label="Buscar por CPF" style="flex: 1"
                    mask="###.###.###-##" @update:model-value="onRequest({ pagination })">
                    <template v-slot:append>
                        <q-icon name="badge" />
                    </template>
                </q-input>
            </div>

            <q-card class="q-mt-md" style="width: 100%; max-width: 1200px;">
                <q-table flat bordered row-key="id" separator="horizontal" :rows="rows" :columns="columns"
                    :table-class="$q.dark.isActive ? 'table-dark' : 'table-light'" :loading="loading"
                    v-model:pagination="pagination" :rows-per-page-options="[10, 20, 50]" @request="onRequest">
                </q-table>
            </q-card>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRegisteredPage } from './RegisteredPage';
import './RegisteredPage.scss';
import lottie from 'lottie-web';

const registeredRef = ref<HTMLElement | null>(null);

const {
    rows,
    columns,
    pagination,
    loading,
    nameFilter,
    cpfFilter,
    onRequest
} = useRegisteredPage();

onMounted(async () => {

    if (registeredRef.value) {
        lottie.loadAnimation({
            container: registeredRef.value,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/animations/registered.json',
        });
    }

    await onRequest({ pagination: pagination.value });
});
</script>