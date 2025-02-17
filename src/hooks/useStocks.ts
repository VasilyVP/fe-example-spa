import axios from 'axios';
import config from 'config';
import useSWR from 'swr';
import { Proxy } from './useProxies';

type AccountStatus = 'active' | 'paused';

export type Account = {
    robloxId: number;
    name: string;
    health: boolean;
    rate: number;
    avatarUrl: string;
    balance: {
        spent: number;
        left: number;
    }
    status: AccountStatus;
    securityCookie: string;
    twoFactorAuthIssue: boolean;
    banned: boolean;
    createdAt: Date;
}

export type StockAccount = Account & {
    proxy: Proxy;
};

export default () => {
    const { data, error, mutate } = useSWR<StockAccount[]>(config.backEnd + '/reseller/stocks', {
        refreshInterval: 60 * 1000,
    });

    const switchActivity = async (switchedAccount: StockAccount, newStatus: AccountStatus) => {
        if (!data) return;

        const index = data.findIndex(account => account.robloxId === switchedAccount.robloxId);
        const newState = JSON.parse(JSON.stringify(data));
        newState[index].status = newStatus;

        mutate(newState, {
            revalidate: false,
        });

        try {
            await axios.put(config.backEnd + '/reseller/switch-account',
                {
                    robloxAccountId: switchedAccount.robloxId,
                    status: newStatus,
                },
                {
                    withCredentials: true,
                },
            )
        } finally {
            mutate();
        }
    }

    return {
        stocks: data,
        error,
        loading: !error && !data,
        refresh: mutate,
        switchActivity,
    }
}
