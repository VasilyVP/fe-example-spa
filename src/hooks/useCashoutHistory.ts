import { CashoutMethod } from 'components/CashoutMethodCard';
import config from 'config';
import useSWR from 'swr';

type Cashout = {
    publicId: string;
    method: CashoutMethod;
    status: 'requested' | 'paid' | 'rejected';
    createdAt: string;
    value: number;
}

export default () => {
    const { data, error, mutate } = useSWR<Cashout[]>(config.backEnd + '/reseller/cashouts');

    return {
        cashouts: data,
        error,
        loading: !data && !error,
        refresh: mutate,
    }
}
