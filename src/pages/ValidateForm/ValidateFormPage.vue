<template>
    <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div class="column items-center">
            <div ref="registerRef" class="q-mb-md" style="width: 120px; max-width: 90vw; height: auto;" />

            <div class="text-h6 q-mt-sm q-mb-md">{{ showUserValidate ? 'Validar Emancipação' : 'Informações Pessoais' }}
            </div>

            <div v-if="loading" class="row justify-center q-my-md">
                <q-spinner color="primary" size="40px" />
            </div>

            <div v-if="personOnline && !showUserValidate && !loading" flat bordered
                style="max-width: 1100px; width: 100%;">
                <div class="row q-col-gutter-md">
                    <q-input v-model="personOnline.cpf" label="CPF" mask="###.###.###-##" filled
                        class="col-12 col-sm-6 col-md-3" :error="validate && !personOnline.cpf"
                        error-message="Campo obrigatório" disable />

                    <q-input v-model="personOnline.name" label="Nome Completo" filled class="col-12 col-sm-6 col-md-6"
                        :error="validate && !personOnline.name" error-message="Campo obrigatório" disable />

                    <q-input v-model="personOnline.birthDate" label="Data de Nascimento" mask="##/##/####" filled
                        class="col-12 col-sm-6 col-md-3" :error="validate && !personOnline.birthDate"
                        error-message="Campo obrigatório" :disable="isBirthDateDisabled">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer" :disable="isBirthDateDisabled">
                                <q-popup-proxy :disable="isBirthDateDisabled">
                                    <q-date v-model="personOnline.birthDate" mask="DD/MM/YYYY"
                                        :disable="isBirthDateDisabled" />
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>

                <q-separator class="q-mt-md" />

                <q-card-actions align="between" class="q-pa-md">
                    <q-btn label="Voltar" color="grey-7" flat @click="onBack" :disable="loading" />
                    <div class="row items-center q-gutter-sm">
                        <q-btn label="Avançar" color="primary" @click="onSubmit" :disable="loading" />
                    </div>
                </q-card-actions>
            </div>

            <div v-if="showUserValidate && !loading" class="column items-center q-mb-md">
                <div class="text-negative text-center text-bold">
                    Procure a emha para realização do seu cadastro, caso você seja Emancipado.
                </div>
                <a href="/termo-documento" class="text-primary text-center text-bold"
                    style="text-decoration: underline; cursor: pointer;">
                    Para validar cadastro clique aqui - Funcionário EMHA DIGIT@L.
                </a>
            </div>

            <div v-if="showUserValidate && !loading" flat bordered style="max-width: 300px; width: 100%;">
                <div class="row q-col-gutter-md justify-center">
                    <q-input v-model.text="form.username" label="Usuário" type="text" filled
                        :error="validate && form.username === ''" error-message="Campo obrigatório"
                        class="col-12 col-sm-6 col-md-12" />

                    <q-input v-model.text="form.password" label="Senha" :type="showPassword ? 'text' : 'password'"
                        filled :error="validate && form.password === ''" error-message="Campo obrigatório"
                        class="col-12 col-sm-6 col-md-12">
                        <template v-slot:append>
                            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="togglePasswordVisibility" />
                        </template>
                    </q-input>
                </div>

                <div class="row q-gutter-md justify-center q-my-lg">
                    <q-btn label="Voltar" flat color="grey-7" @click="onBackValidate" :disable="loading" />
                    <q-btn label="Validar" color="primary" @click="onValidate" :disable="loading" />
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useValidateFormPage } from './ValidateFormPage';
import './ValidateFormPage.scss';
import lottie from 'lottie-web';

const {
    loading,
    personOnline,
    form,
    validate,
    onSubmit,
    onBack,
    onValidate,
    onBackValidate,
    loadPersonOnline,
    showUserValidate,
    isBirthDateDisabled,
    showPassword,
    togglePasswordVisibility
} = useValidateFormPage();
const registerRef = ref<HTMLElement | null>(null);

onMounted(async () => {
    if (registerRef.value) {
        lottie.loadAnimation({
            container: registerRef.value,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/animations/register.json'
        });
    }

    await loadPersonOnline();
});
</script>