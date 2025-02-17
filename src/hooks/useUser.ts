import { AxiosError } from 'axios';
import config from 'config';
import useSWRImmutable from 'swr/immutable';

export type User = {
    id: number;
    username: string;
    avatarUrl: string;
    role: 'reseller' | 'reseller_plus';
};

export default () => {
    const { data, error, mutate } = useSWRImmutable<User | null, AxiosError>(config.backEnd + '/users/me');

    return {
        user: data,
        error: error?.response?.status === 403 ? null : error,
        loading: !data && !error,
        refresh: mutate,
    }
}
