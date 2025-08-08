import { Notify, Dialog } from 'quasar'

export function notifySuccess(message: string) {
    Notify.create({
        type: 'positive',
        message,
        position: 'top-right',
        timeout: 1000,
        icon: 'check_circle'
    })
}

export function notifyWarning(message: string) {
    Notify.create({
        type: 'warning',
        message,
        position: 'top-right',
        timeout: 1000,
        icon: 'warning'
    })
}

export function notifyError(message: string) {
    Notify.create({
        type: 'negative',
        message,
        position: 'top-right',
        timeout: 1000,
        icon: 'error'
    })
}

export function notifyInfo(message: string) {
    Notify.create({
        type: 'info',
        message,
        position: 'top-right',
        timeout: 1000,
        icon: 'info'
    })
}

export function notifyQuestion(message: string) {
    Notify.create({
        color: 'grey-8',
        textColor: 'white',
        icon: 'help_outline',
        message,
        position: 'top-right',
        timeout: 2000
    })
}

export function notifyConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
        Dialog.create({
            title: 'Confirmação',
            message,
            ok: {
                label: 'Sim',
                color: 'positive'
            },
            cancel: 'Cancelar',
            persistent: true
        })
            .onOk(() => resolve(true))
            .onCancel(() => resolve(false))
            .onDismiss(() => resolve(false));
    });
}