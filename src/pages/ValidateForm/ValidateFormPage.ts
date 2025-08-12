import axios from 'axios';
import { fetchBenefiteds } from 'src/services/benefitedService';
import { fetchInscriptionsBySpouseAndEventComponent } from 'src/services/inscriptionService';
import keycloak from 'src/services/keycloakService';
import { notifyError, notifyWarning } from 'src/services/messageService';
import { fetchPersonOnlineByFilters, fetchSpouse } from 'src/services/personOnlineService';
import { fetchUser } from 'src/services/userService';
import { useEventStore } from 'src/stores/eventStore';
import { usePersonOnlineStore } from 'src/stores/personOnlineStore';
import { createPersonOnlineForm, type PersonOnlineType } from 'src/types/personOnlineType';
import { isUnder18 } from 'src/util/ageValidator';
import { formatDate } from 'src/util/dateUtil';
import { formatCpfForSearch } from 'src/util/formatUtil';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface FormModel {
    username: string;
    password: string;
}

const initialFilters: FormModel = {
    username: '',
    password: ''
};

export function useValidateFormPage() {

    const ALREADY_EXISTS_CODES = [409, 'ALREADY_EXISTS'];

    const personOnline = ref<PersonOnlineType>(createPersonOnlineForm());
    const form = ref<FormModel>({ ...initialFilters });

    const validate = ref(false);
    const router = useRouter();
    const eventStore = useEventStore();
    const personOnlineStore = usePersonOnlineStore();

    const showUserValidate = ref(false);
    const isBirthDateDisabled = ref(false);
    const isBirthDateValidated = ref(false);
    const showPassword = ref(false);

    async function loadPersonOnline() {
        try {
            const [personOnlineRes] = await Promise.all([
                fetchPersonOnlineByFilters(
                    {
                        name: '',
                        cpf: keycloak.tokenParsed?.cpf ? formatCpfForSearch(keycloak.tokenParsed?.cpf) : keycloak.tokenParsed?.cpf,
                        registrationPassword: ''
                    }
                )
            ]);

            personOnline.value = personOnlineRes;


            if (isBirthDateValidated.value) return;

            if (personOnline.value.birthDate) {
                isBirthDateDisabled.value = true;
                personOnline.value.birthDate = formatDate(personOnline.value.birthDate);
            } else {
                isBirthDateDisabled.value = false;
            }
        } catch (error) {
            let errorMessage = 'Erro ao buscar cadastro.';

            if (axios.isAxiosError(error) && error.response?.data?.message && error.response.data.code) {
                errorMessage = error.response.data.message;
            }

            if (axios.isAxiosError(error) && error.response?.data?.code === 404) {
                personOnline.value.cpf = keycloak.tokenParsed?.cpf;
                personOnline.value.name = keycloak.tokenParsed?.name + ' ' + keycloak.tokenParsed?.lastName
                personOnline.value.email = keycloak.tokenParsed?.email;
                notifyWarning(errorMessage);
            } else {
                notifyError(errorMessage);
            }

            isBirthDateDisabled.value = false;
        }
    }

    async function onSubmit() {
        validate.value = true;
        if (personOnline.value.cpf && personOnline.value.name && personOnline.value.birthDate) {
            console.log('Form válido', personOnline.value);

            if (!personOnline.value.caponl && isUnder18(personOnline.value.birthDate) && !isBirthDateValidated.value) {
                showUserValidate.value = true;
                return;
            }

            const isRegister = window.location.hostname.includes("cadastro");

            if (isRegister) {
                await verifySpouseRegister();
            } else {
                await verifyEvent();
            }

            personOnlineStore.setSelectedPersonOnline(personOnline.value);

            await router.push(isRegister ? '/formulario-cadastro' : '/formulario-evento');
        }
    }

    async function onBack() {
        eventStore.setSelectedEventComponent(null);
        await router.push('/modulo-evento');
    }

    async function onValidate() {
        try {
            const [userRes] = await Promise.all([
                fetchUser(form.value.username, form.value.password)
            ]);

            isBirthDateValidated.value = userRes;
            showUserValidate.value = false;
        } catch (error) {
            isBirthDateValidated.value = false;
            let errorMessage = 'Erro ao buscar usuário.';

            if (axios.isAxiosError(error) && error.response?.data?.message && error.response.data.code) {
                errorMessage = error.response.data.message;
            }

            if (axios.isAxiosError(error) && error.response?.data?.code === 404) {
                notifyWarning(errorMessage);
            } else {
                notifyError(errorMessage);
            }
        }
    }

    function onBackValidate() {
        showUserValidate.value = false;
    }

    async function verifyEvent() {
        if (!eventStore.selectedEventComponent?.id) return;

        try {
            await fetchInscriptionsBySpouseAndEventComponent({
                name: '',
                cpf: keycloak.tokenParsed?.cpf ? formatCpfForSearch(keycloak.tokenParsed?.cpf) : keycloak.tokenParsed?.cpf,
                registrationPassword: ''
            }, eventStore.selectedEventComponent?.id)

            await fetchBenefiteds({
                name: '',
                cpf: keycloak.tokenParsed?.cpf ? formatCpfForSearch(keycloak.tokenParsed?.cpf) : keycloak.tokenParsed?.cpf,
                registrationPassword: ''
            });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.message && error.response.data.code) {
                const isDuplicate = ALREADY_EXISTS_CODES.includes(error.response.data.code);
                if (isDuplicate) {
                    notifyWarning(error.response.data.message);
                } else {
                    notifyError(error.response.data.message);
                }
            } else {
                notifyError('Erro desconhecido.');
            }
        }
    }

    async function verifySpouseRegister() {
        try {
            await fetchSpouse(
                {
                    name: '',
                    cpf: keycloak.tokenParsed?.cpf ? formatCpfForSearch(keycloak.tokenParsed?.cpf) : keycloak.tokenParsed?.cpf,
                    registrationPassword: ''
                });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.message && error.response.data.code) {
                const isDuplicate = ALREADY_EXISTS_CODES.includes(error.response.data.code);
                if (isDuplicate) {
                    notifyWarning(error.response.data.message);
                } else {
                    notifyError(error.response.data.message);
                }
            } else {
                notifyError('Erro desconhecido.');
            }
        }
    }

    function togglePasswordVisibility() {
        showPassword.value = !showPassword.value
    }

    return {
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
    };
}