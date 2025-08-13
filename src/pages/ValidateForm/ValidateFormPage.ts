import axios from 'axios';
import { fetchBenefiteds } from 'src/services/benefitedService';
import { fetchInscriptionByPersonOnlineAndEventComponent, fetchInscriptionsBySpouseAndEventComponent } from 'src/services/inscriptionService';
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

    const loading = ref(false);
    const showUserValidate = ref(false);
    const isBirthDateDisabled = ref(false);
    const isBirthDateValidated = ref(false);
    const showPassword = ref(false);

    const isRegister = window.location.hostname.includes("cadastro");

    async function loadPersonOnline(): Promise<void> {
        loading.value = true;

        try {
            const cpfFromToken = keycloak.tokenParsed?.cpf ?? '';
            const cpfForSearch = cpfFromToken ? formatCpfForSearch(cpfFromToken) : cpfFromToken;

            const [personOnlineRes] = await Promise.all([
                fetchPersonOnlineByFilters({
                    name: '',
                    cpf: cpfForSearch,
                    registrationPassword: ''
                }),
                sleep(500)
            ]);

            personOnline.value = personOnlineRes;

            if (!isBirthDateValidated.value) {
                if (personOnline.value?.birthDate) {
                    isBirthDateDisabled.value = true;
                    personOnline.value.birthDate = formatDate(personOnline.value.birthDate);
                } else {
                    isBirthDateDisabled.value = false;
                }
            }
        } catch (error) {
            let errorMessage = 'Erro ao buscar cadastro.';

            if (axios.isAxiosError(error) && error.response?.data?.message && error.response.data.code) {
                errorMessage = error.response.data.message;
            }

            if (axios.isAxiosError(error) && error.response?.data?.code === 404) {
                personOnline.value.cpf = keycloak.tokenParsed?.cpf ?? '';
                personOnline.value.name = [keycloak.tokenParsed?.name, keycloak.tokenParsed?.lastName]
                    .filter(Boolean)
                    .join(' ');
                personOnline.value.email = keycloak.tokenParsed?.email ?? '';
                notifyWarning(errorMessage);
            } else {
                notifyError(errorMessage);
            }

            isBirthDateDisabled.value = false;
        } finally {
            loading.value = false;
        }
    }

    async function onSubmit() {
        validate.value = true;

        if (personOnline.value.cpf && personOnline.value.name && personOnline.value.birthDate) {
            loading.value = true;
            await sleep(1500);

            if (!personOnline.value.caponl && isUnder18(personOnline.value.birthDate) && !isBirthDateValidated.value) {
                showUserValidate.value = true;
                loading.value = false;
                return;
            }

            if (isRegister) {
                if (!await verifySpouseRegister()) return;
            } else {
                if (!await verifyEvent()) return;
                if (await verifyInscription()) return;
            }

            personOnlineStore.setSelectedPersonOnline(personOnline.value);

            await router.push(isRegister ? '/formulario-cadastro' : '/formulario-evento');
            loading.value = false;
        }
    }

    async function onBack() {
        eventStore.setSelectedEventComponent(null);
        await router.push('/modulo-evento');
    }

    async function onValidate() {
        try {

            loading.value = true;
            const [userRes] = await Promise.all([
                fetchUser(form.value.username, form.value.password),
                sleep(1000)
            ]);

            loading.value = false;
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

            loading.value = false;
        }
    }

    function onBackValidate() {
        showUserValidate.value = false;
    }

    async function verifyEvent(): Promise<boolean> {
        if (!eventStore.selectedEventComponent?.id) return false;

        loading.value = true;

        await sleep(1500);

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

            loading.value = false;
            return true;
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

            loading.value = false;
            return false;
        }
    }

    async function verifyInscription(): Promise<boolean> {
        const eventComponentId = eventStore.selectedEventComponent?.id;
        if (!eventComponentId) return false;

        const cpfFromToken = keycloak.tokenParsed?.cpf ?? '';
        const cpfForSearch = cpfFromToken ? formatCpfForSearch(cpfFromToken) : cpfFromToken;

        try {
            const [inscriptionRes] = await Promise.all([
                fetchInscriptionByPersonOnlineAndEventComponent(
                    {
                        name: '',
                        cpf: cpfForSearch,
                        registrationPassword: ''
                    },
                    eventComponentId
                ),
                sleep(500)
            ]);

            if (inscriptionRes == null) {
                return false;
            }

            personOnline.value = inscriptionRes.personOnline;

            notifyWarning("Não é possível realizar a inscrição. CPF já inscrito neste evento!");

            return true;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                notifyWarning(error.response.data.message);
            } else {
                throw error;
            }
            return false;
        }
    }

    async function verifySpouseRegister(): Promise<boolean> {
        loading.value = true;

        await sleep(1500);

        try {
            await fetchSpouse(
                {
                    name: '',
                    cpf: keycloak.tokenParsed?.cpf ? formatCpfForSearch(keycloak.tokenParsed?.cpf) : keycloak.tokenParsed?.cpf,
                    registrationPassword: ''
                });

            loading.value = false;

            return true;
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
            loading.value = false;
            return false;
        }
    }

    function togglePasswordVisibility() {
        showPassword.value = !showPassword.value
    }

    function sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return {
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
    };
}