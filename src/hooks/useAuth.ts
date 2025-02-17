import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import config from 'config';
import useUser, { User } from './useUser';

export default () => {
    const [error, setError] = useState<AxiosError | null>(null);
    const { user, error: userError, loading, refresh } = useUser();

    const getClienId = async () => {
        try {
            return (await axios.get<{ clientId: string }>(config.backEnd + '/auth/discord-client-id')).data.clientId
        } catch (err) {
            console.error((err as AxiosError).message);
            setError(err as AxiosError);
            return null;
        }
    }

    const requestDiscordCode = async () => {
        const state = Date.now().toString();
        sessionStorage.setItem('discord-auth-state', state);

        const clientId = await getClienId();
        window.location.href = `https://discord.com/oauth2/authorize?response_type=code&scope=identify&client_id=${clientId}&state=${state}&redirect_uri=${window.location.href}`;
    }

    const loginWithDiscord = async (code: string) => {
        try {
            const { user } = (
                await axios.post<{ user: User }>(
                    config.backEnd + '/auth/discord-auth',
                    {
                        code,
                        redirectUri: window.location.origin + window.location.pathname,
                    },
                    {
                        withCredentials: true,
                    },
                )).data;

            if (user) refresh(user);
        } catch (err) {
            console.error((err as AxiosError).message);
            setError(error);
            return null;
        }
    }

    const logout = async () => {
        await axios.post(config.backEnd + '/auth/logout',
            {},
            {
                withCredentials: true,
            },
        );
        refresh(null);
    }

    return {
        user,
        requestDiscordCode,
        loginWithDiscord,
        logout,
        error: error || userError,
        loading,
    }
}
