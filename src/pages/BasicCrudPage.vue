<template>
    <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div class="column items-center">
            <div class="text-h6 text-center q-my-lg">CRUD de Itens</div>

            <div class="row q-col-gutter-md items-center justify-center" style="max-width: 1200px; width: 100%">
                <q-select v-model="form.selectOption" :options="selectOptions" label="Opção" filled emit-value
                    map-options :error="validate && !form.selectOption" error-message="Campo obrigatório"
                    class="col-12 col-sm-6 col-md-3" />

                <q-input v-model="form.text" label="Texto" filled :error="validate && !form.text"
                    error-message="Campo obrigatório" class="col-12 col-sm-6 col-md-3" />

                <q-input v-model="form.date" label="Data" filled mask="##/##/####" :error="validate && !form.date"
                    error-message="Campo obrigatório" class="col-12 col-sm-6 col-md-3">
                    <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy>
                                <q-date v-model="form.date" mask="DD/MM/YYYY" />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>

                <q-input v-model.number="form.number" label="Número" type="number" filled
                    :error="validate && form.number === null" error-message="Campo obrigatório"
                    class="col-12 col-sm-6 col-md-3" />
            </div>

            <div class="row q-gutter-md justify-center q-my-lg">
                <q-btn label="Salvar" color="primary" @click="onSubmit" />
                <q-btn label="Limpar" color="secondary" @click="onClear" />
            </div>

            <q-card class="q-mt-lg" v-if="items.length > 0" style="width: 100%; max-width: 1200px;">
                <q-card-section class="text-subtitle1">Registros</q-card-section>
                <q-separator />
                <q-list>
                    <q-item v-for="(item, index) in items" :key="index" clickable>
                        <q-item-section>
                            <div><strong>Opção:</strong> {{ item.selectOption }}</div>
                            <div><strong>Texto:</strong> {{ item.text }}</div>
                            <div><strong>Data:</strong> {{ item.date }}</div>
                            <div><strong>Número:</strong> {{ item.number }}</div>
                        </q-item-section>
                        <q-item-section side>
                            <q-btn dense icon="delete" color="negative" flat round @click.stop="deleteItem(index)" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { useBasicCrudPage } from './BasicCrudPage';
import './BasicCrudPage.scss';

const {
    form,
    validate,
    selectOptions,
    items,
    onSubmit,
    onClear,
    deleteItem
} = useBasicCrudPage();
</script>