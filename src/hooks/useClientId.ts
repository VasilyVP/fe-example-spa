import config from 'config';
import useSWR from 'swr';

export default () => {
    const { data, error } = useSWR<{ clientId: string }>(config.backEnd + '/users/me');

    return {
        clientId: data?.clientId,
        error,
    }
}
