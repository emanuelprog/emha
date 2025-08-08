<template>
    <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div class="column items-center">
            <div ref="registeredRef" style="width: 130px; max-width: 90vw; height: auto;" />

            <div class="text-h6 text-center q-mb-lg">Lista de Beneficiados</div>

            <div class="row items-center justify-center q-gutter-sm" style="width: 100%; max-width: 1200px;">
                <q-input outlined dense debounce="300" v-model="nameFilter" label="Buscar por nome" style="flex: 1"
                    @update:model-value="onRequest({ pagination })">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>

                <q-input outlined dense debounce="300" v-model="cpfFilter" label="Buscar por CPF" mask="###.###.###-##"
                    style="flex: 1" @update:model-value="onRequest({ pagination })">
                    <template v-slot:append>
                        <q-icon name="badge" />
                    </template>
                </q-input>
            </div>

            <q-card class="q-mt-md" style="width: 100%; max-width: 1200px;">
                <q-table flat bordered row-key="id" separator="horizontal" :rows="rows" :columns="columns"
                    :table-class="$q.dark.isActive ? 'table-dark' : 'table-light'" :loading="loading"
                    v-model:pagination="pagination" :rows-per-page-options="[10, 20, 50]" @request="onRequest">
                    <template v-slot:body-cell-actions="props">
                        <q-td :props="props" class="text-center">
                            <q-btn size="sm" icon="visibility" color="primary" flat round
                                @click="openDialog(props.row)" />
                        </q-td>
                    </template>
                </q-table>
            </q-card>
        </div>

        <q-dialog v-model="dialogVisible">
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">Conjuntos vinculados</div>
                </q-card-section>

                <q-separator />

                <q-card-section>
                    <div v-if="selectedHousingComplexes.length">
                        <ul>
                            <li v-for="(hc, index) in selectedHousingComplexes" :key="index">
                                {{ hc.description }}
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        Nenhum conjunto vinculado.
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Fechar" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import lottie from 'lottie-web';
import { useBenefitedPage } from './BenefitedPage';
import type { PersonSummaryType } from 'src/types/personType';
import type { HousingComplexesType } from 'src/types/housingComplexesType';

const registeredRef = ref<HTMLElement | null>(null);
const dialogVisible = ref(false);
const selectedHousingComplexes = ref<HousingComplexesType[]>([]);

const {
    rows,
    columns,
    pagination,
    loading,
    nameFilter,
    cpfFilter,
    onRequest
} = useBenefitedPage();

function openDialog(row: PersonSummaryType) {
    selectedHousingComplexes.value = row.housingComplexesList || [];
    dialogVisible.value = true;
}

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