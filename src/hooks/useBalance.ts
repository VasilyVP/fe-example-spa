import { AxiosError } from 'axios';
import config from 'config';
import useSWR from 'swr';

export default () => {
    const { data, error, mutate } = useSWR<{ balance: number }, AxiosError>(config.backEnd + '/reseller/balance', {
        refreshInterval: 60 * 1000,
    });

    return {
        balance: data?.balance,
        error,
        refresh: mutate,
    }
}
