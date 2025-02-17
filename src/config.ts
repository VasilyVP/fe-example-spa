import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getFetcher } from "utils/http";

export default {
    backEnd: process.env.REACT_APP_BACK_END,
    environment: process.env.REACT_APP_ENVIRONMENT,
    hostPostfix: process.env.REACT_APP_HOST_POSTFIX,
    swrConfig: {
        fetcher: (resource: string, config: AxiosRequestConfig) => {
            return getFetcher(resource, {
                withCredentials: true,
                ...config,
            })
        },
        onError: (error: AxiosError, key: string) => {
            if (error.response?.status === 403 && !key.includes('/users/me')) {
                setTimeout(async () => {
                    try {
                        await axios.post(process.env.REACT_APP_BACK_END + '/auth/logout', {}, { withCredentials: true });
                    } catch (err) {
                        console.error('Logout error: ', (err as AxiosError).message);
                    } finally {
                        window.location.href = String(window.location.href)
                    }
                }, 2000);
            }
        }
    },
}
