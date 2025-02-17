import config from "config";
import useSWR from 'swr';

type QueueAnalytic = {
    queue: {
        robuxesInQueue: number;
        queuePlace: number;
        usersInGlobalQueue: number;
    }
    rate: {
        minRate: number;
        amountWithMinRate: number;
    }
}

export default () => {
    const { data, error, mutate } = useSWR<QueueAnalytic>(config.backEnd + `/reseller/queue`, { refreshInterval: 60 * 1000 });

    return {
        queue: data?.queue,
        rate: data?.rate,
        error,
        refresh: mutate,
    }
}
