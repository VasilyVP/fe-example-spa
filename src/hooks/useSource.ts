import config from 'config';
import useSWR from 'swr';
import axios, { AxiosError } from 'axios';
import { standardMessages } from './useNotifications';

export type Source = {
    id: string;
    rate: number;
    sourceUrl: string;
    balance: number;
    spent: number;
    status: 'active' | 'paused';
    createdAt: Date;
}

export default () => {
    const { data, error, mutate } = useSWR<Source[]>(config.backEnd + '/reseller/source/list', {
        refreshInterval: 60 * 1000,
    });

    const addSource = async ({ rate, sourceUrl }: { rate: string; sourceUrl: string; }) => {
        try {
            await axios.post(config.backEnd + '/reseller/source/add',
                {
                    rate: Number(rate),
                    sourceUrl,
                },
                { withCredentials: true },
            );
        } catch (err) {
            const error = err as AxiosError<{ message: string | string[] }>;
            console.error("Can't add source: ", (error).message);

            if (error.response && [400, 401, 403].includes(error.response.status)) throw Error(error.response.data.message as string)
            throw Error(standardMessages.error)
        }
    }

    const editSource = async ({ source, rate }: { source: Source; rate: string; }) => {
        try {
            await axios.put(config.backEnd + '/reseller/source/set-rate',
                {
                    sourceId: source.id,
                    rate: Number(rate),
                },
                { withCredentials: true },
            );
        } catch (err) {
            const error = err as AxiosError<{ message: string | string[] }>;
            console.error("Can't add source: ", (error).message);

            if (error.response && [400, 401, 403].includes(error.response.status)) throw Error(error.response.data.message as string)
            throw Error(standardMessages.error)
        }
    }

    const deleteSource = async ({ source }: { source: Source }) => {
        try {
            await axios.put(config.backEnd + '/reseller/source/delete',
                {
                    sourceId: source.id,
                },
                { withCredentials: true },
            )
        } catch (err) {
            const error = err as AxiosError<{ message: string | string[] }>;
            console.error("Can't add source: ", (error).message);
            throw Error(standardMessages.error);
        }
    }

    const switchStatus = async ({ source, status }: { source: Source; status: 'active' | 'paused' }) => {
        if (!data) return;

        const index = data.findIndex(sourceSt => sourceSt.id === source.id);
        const newState = JSON.parse(JSON.stringify(data));
        newState[index].status = status;

        mutate(newState, {
            revalidate: false,
        });

        try {
            await axios.put(config.backEnd + '/reseller/source/switch',
                {
                    sourceId: source.id,
                    status,
                },
                { withCredentials: true },
            )
        } catch (err) {
            const error = err as AxiosError<{ message: string | string[] }>;
            console.error("Can't switch source: ", (error).message);
            throw Error(standardMessages.error);
        }
    }

    return {
        sources: data,
        addSource,
        editSource,
        deleteSource,
        switchStatus,
        error,
        refresh: mutate,
    }
}
