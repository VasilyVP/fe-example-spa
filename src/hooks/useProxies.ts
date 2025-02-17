import axios from 'axios';
import config from 'config';
import useSWR from 'swr';


export type Proxy = {
    id?: number;
    schema: 'http' | 'https',
    host: string;
    port: number;
    username: string;
    password: string;
    healthy?: boolean;
    createdAt?: Date;
}

export default () => {

    const { data, error, mutate } = useSWR<Proxy[]>(config.backEnd + '/reseller/proxies', {
        refreshInterval: 60 * 1000,
    });

    const deleteProxies = async ({ ids }: { ids: number[] }) => {
        return await axios.put<{ count: number }>(config.backEnd + '/reseller/delete-proxies',
            {
                ids,
            },
            {
                withCredentials: true,
            },
        )
    }

    return {
        proxies: data,
        error,
        loading: !data && !error,
        refresh: mutate,
        deleteProxies,
    }
}
