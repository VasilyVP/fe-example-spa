import config from 'config';
import useSWR from 'swr';

export enum Period {
    today = 'today',
    thisWeek = 'last_7_days',
    lastMonth = 'last_30_days',
    allTime = 'all',
}

type Discretization = 'hour' | 'day' | 'month';

type Sales = {
    discretization: Discretization;
    values: {
        hourdaymonth: string;
        sold: number;
        earned: number;
    }[];
}

type UseAnalyticProps = {
    period: Period;
}
export default ({ period }: UseAnalyticProps) => {
    const query = config.backEnd + `/reseller/sales?period=${period}`;

    const { data, error, mutate } = useSWR<Sales>(query, { refreshInterval: 60 * 1000 });

    return {
        sales: data,
        error,
        loading: !data && !error,
        refresh: mutate,
    }
}
