import config from 'config';
import useSWR from 'swr';

export default () => {
    const { data, error } = useSWR<{ rates: number[]; minRate: number; }>(config.backEnd + '/reseller/rates', {
        refreshInterval: 60 * 1000,
    });

    return {
        rates: data?.rates,
        minRate: data?.minRate,
        error,
    }
}
