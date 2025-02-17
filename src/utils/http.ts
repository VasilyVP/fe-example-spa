import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export class ApiRequestError extends Error {
    info: Partial<AxiosResponse> | null = null;

    constructor(err: AxiosError) {
        super(err.message);

        const { data, status, statusText, headers } = err.response ?? {};

        this.info = {
            data,
            status,
            statusText,
            headers,
        };
    }
}

export type ErrorData = {
    statusCode: number;
    message: string;
    error: string;
}

export async function getFetcher(url: string, config: AxiosRequestConfig = {}) {
    return (await axios.get(url, config)).data;
}
