import { useSnackbar, OptionsObject } from 'notistack';

export default () => {
    const { enqueueSnackbar } = useSnackbar();

    const successMsg = (message: string, options?: OptionsObject) => {
        enqueueSnackbar(message, { variant: 'success', ...options })
    }

    const errorMsg = (message: string, options?: OptionsObject) => {
        enqueueSnackbar(message, { variant: 'error', ...options })
    }

    const infoMsg = (message: string, options?: OptionsObject) => {
        enqueueSnackbar(message, { variant: 'info', ...options })
    }

    const warningMsg = (message: string, options?: OptionsObject) => {
        enqueueSnackbar(message, { variant: 'warning', ...options })
    }

    const defaultMsg = (message: string, options?: OptionsObject) => {
        enqueueSnackbar(message, { variant: 'default', ...options })
    }

    return {
        successMsg,
        errorMsg,
        infoMsg,
        warningMsg,
        defaultMsg,
    }
}

export const standardMessages = {
    error: 'Something went wrong',
}
