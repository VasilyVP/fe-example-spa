
import isBtcAddress from 'validator/es/lib/isBtcAddress';
import isEthereumAddress from 'validator/es/lib/isEthereumAddress';
import { CashoutMethod } from 'components/CashoutMethodCard';

export function isCorrectWallet(wallet: string, method: CashoutMethod) {
    if (method === CashoutMethod.bitcoin) return isBtcAddress(wallet) ? true : false;
    if (method === CashoutMethod.ethereum) return isEthereumAddress(wallet) ? true : false;
    if (method === CashoutMethod.usdtErc) return /^T[A-Za-z1-9]{33}$/.test(wallet) ? true : false;
}

export function getMethodSymbol(method: CashoutMethod) {
    if (method === CashoutMethod.bitcoin) return 'BTC';
    if (method === CashoutMethod.ethereum) return 'ETH';
    if (method === CashoutMethod.usdtErc) return 'USDT-ERC20';
}

export function parseProxyStr(str: string) {
    const schema = str.match(/^https?/)?.[0] as 'http' | 'https';
    const host = str.match(/^https?:(.+?):/)?.[1];
    const port = str.match(/^https?:.+:([0-9]{2,5})/)?.[1];
    const username = str.match(/^https?:.+:[0-9]{2,5}:(.+?):/)?.[1] || '';
    const password = str.match(/^https?:.+:[0-9]{2,5}:.+:(.+)/)?.[1] || '';

    if (!schema || !host || !port || !username || !password) throw Error("Can't parse proxy strings");

    return {
        schema,
        host,
        port: Number(port),
        username,
        password,
    }
}
