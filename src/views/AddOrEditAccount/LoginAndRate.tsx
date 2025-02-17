import { useMemo, Dispatch, useState, ChangeEvent } from "react"
import { useAppSelector } from "store"
import { ViewState } from "store/slicers/commonSlice"
import { Box, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, useTheme } from "@mui/material"
import { CloseIcon } from "assets/icons/icons"
import RainbowButton from "components/Buttons/RainbowButton"
import VioletButton from "components/Buttons/VioletButton"
import PaperBlock from "components/Paper/PaperBlock"
import PaperBlockContainer from "components/Paper/PaperBlockContainer"
import SelectInput from "components/SelectInput"
import TextInput from "components/TextInput"
import useRates from "hooks/useRates"
import useProxies from "hooks/useProxies"
import useStocks from "hooks/useStocks"

type LoginType = 'credentials' | 'cookie';

type LoginAndRateProps = {
    rate: string;
    setRate: Dispatch<string>;
    cookie: string;
    setCookie: Dispatch<string>;
    proxyId: number | null;
    setProxyId: Dispatch<number>;
    handleAddAccount: (props: { supplierId?: string; }) => void;
    handleAddAccounts: (props: { accountsStr: string; supplierId: string; }) => void;
    handleEditRate: () => void;
    handleClose: () => void;
    adding: boolean;
    updating: boolean;
}
export default ({
    rate, setRate, cookie, setCookie, proxyId, setProxyId, handleAddAccount, handleAddAccounts, handleEditRate, handleClose, adding, updating
}: LoginAndRateProps) => {
    const [loginType, setLoginType] = useState<LoginType>('credentials');
    const [accountsStr, setAccountsStr] = useState('');
    const [supplierId, setSupplierId] = useState('');

    const theme = useTheme();
    const view = useAppSelector(state => state.common.viewState);

    const { rates, minRate } = useRates();
    const ratesList = useMemo(() => rates?.map(rate => (
        <MenuItem key={rate} value={String(rate)}>
            {rate}
        </MenuItem>
    )), [rates]);

    const { proxies } = useProxies();
    const { stocks } = useStocks();
    const freeProxies = useMemo(() => (
        proxies?.filter(proxy => !stocks?.map(account => account.proxy?.id).includes(proxy.id)) || []
    ), [proxies, stocks]);

    const proxiesList = useMemo(() => freeProxies?.map(proxy => (
        <MenuItem key={proxy.id} value={String(proxy.id)}>
            {`${proxy.schema}:${proxy.host}:${proxy.port}`}
        </MenuItem>
    )), [freeProxies]);

    const lowestRate = rates ? minRate || Math.min(...rates) : 0;

    const showSelectProxy = useMemo(() => proxies?.find(proxy => proxy.id === proxyId), [proxies, proxyId]);

    const handleChangeLoginType = (e: ChangeEvent<HTMLInputElement>) => setLoginType((e.target as HTMLInputElement).value as LoginType);

    const handleChangeAccountsStr = (e: ChangeEvent<HTMLInputElement>) => {
        const strArr = e.target.value
            .split('\n')
            .map(el => el.trim())
            .filter(el => el);

        setAccountsStr(strArr.join('\n'));
    }


    return (
        <PaperBlockContainer sx={{ pointerEvents: 'auto' }} >
            <PaperBlock width='340px' /* height='333px' */>
                <Box
                    display='flex' justifyContent='space-between' alignItems='center'
                    fontWeight={600} fontSize='20px' lineHeight='120%'
                    color={theme.palette.common.black}
                >
                    {view === ViewState.addAccount ? 'Login with Roblox' : 'Change rate'}
                    <CloseIcon onClick={handleClose} />
                </Box>
                <Box mt='16px'>
                    <FormControl>
                        <RadioGroup
                            row
                            value={loginType}
                            onChange={handleChangeLoginType}
                        >
                            <FormControlLabel
                                value="credentials"
                                control={
                                    <Radio
                                        size='small'
                                        sx={{
                                            color: '#8D00D0',
                                            '&.Mui-checked': {
                                                color: '#8D00D0',
                                            },
                                        }}
                                    />
                                }
                                label="Credentials"
                            />
                            <FormControlLabel
                                value="cookie"
                                control={
                                    <Radio
                                        size='small'
                                        sx={{
                                            color: '#8D00D0',
                                            '&.Mui-checked': {
                                                color: '#8D00D0',
                                            },
                                        }}
                                    />
                                }
                                label="Cookie"
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>
                {loginType === 'credentials'
                    ? (
                        <>
                            <Box
                                mt='16px'
                                fontWeight={600} fontSize='14px' lineHeight='160%'
                                color={theme.palette.common.black}
                            >
                                Account names
                            </Box>
                            <Box mt='16px'>
                                <TextInput
                                    multiline
                                    fullWidth
                                    maxRows={15}
                                    placeholder='username:password'
                                    autoFocus
                                    value={accountsStr}
                                    onChange={handleChangeAccountsStr}
                                /* sx={{
                                    '& .MuiInputBase-inputMultiline': {
                                        //whiteSpace: 'nowrap',
                                    },
                                }} */
                                />
                                <Box mt='16px'>
                                    <TextInput
                                        fullWidth
                                        placeholder='Supplier ID'
                                        value={supplierId}
                                        onChange={e => setSupplierId(e.target.value.trim())}
                                    />
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box
                                mt='16px'
                                fontWeight={600} fontSize='14px' lineHeight='160%'
                                color={theme.palette.common.black}
                            >
                                Cookie .ROBLOXSECURITY
                            </Box>
                            <Box mt='8px'>
                                <TextInput
                                    value={cookie}
                                    onChange={e => setCookie(e.target.value)}
                                    disabled={view !== ViewState.addAccount}
                                    placeholder="Cookie"
                                />
                            </Box>
                            <Box
                                mt='16px'
                                fontWeight={600} fontSize='14px' lineHeight='160%'
                                color={theme.palette.common.black}
                            >
                                Rate
                            </Box>
                            <Box mt='8px'>
                                <SelectInput
                                    value={rate}
                                    onChange={(e) => setRate(String(e.target.value))}
                                    fullWidth
                                    placeholder='Rate $/k'
                                >
                                    {ratesList}
                                </SelectInput>
                            </Box>
                            {lowestRate ?
                                (
                                    <Box mt='8px'>
                                        <VioletButton
                                            color='#8D00D0'
                                            bgcolor="rgba(141, 0, 208, 0.1)"
                                            onClick={() => setRate(String(lowestRate))}
                                            disabled={!rates?.includes(lowestRate)}
                                        >
                                            Lowest {lowestRate}$/k
                                        </VioletButton>
                                    </Box>
                                ) : null
                            }
                            <Box mt='16px'>
                                <SelectInput
                                    value={proxyId || ''}
                                    onChange={(e) => setProxyId(Number(e.target.value))}
                                    fullWidth
                                    placeholder='Proxy'
                                    showSelected={`${showSelectProxy?.host}:${showSelectProxy?.port}`}
                                    disabled={view !== ViewState.addAccount}
                                >
                                    {proxiesList}
                                </SelectInput>
                            </Box>
                            <Box mt='16px'>
                                <TextInput
                                    fullWidth
                                    placeholder='Supplier ID'
                                    value={supplierId}
                                    onChange={e => setSupplierId(e.target.value.trim())}
                                />
                            </Box>
                        </>
                    )
                }
                <Box mt='16px'>
                    <RainbowButton
                        fullWidth
                        onClick={
                            view === ViewState.addAccount
                                ? (loginType === 'cookie' ? () => handleAddAccount({ supplierId }) : () => handleAddAccounts({ accountsStr, supplierId }))
                                : handleEditRate
                        }
                        disabled={(loginType === 'cookie' && !(rate && cookie)) || updating || (loginType === 'credentials' && !accountsStr)}
                        loading={adding || updating}
                    >
                        Proceed
                    </RainbowButton>
                </Box>
                <Box
                    mt='16px'
                    fontWeight={400} fontSize='14px' lineHeight='160%'
                    color={theme.palette.common.gray}
                >
                    Make sure you have disabled 2FA auth in your account settings
                </Box>
            </PaperBlock >
        </PaperBlockContainer >
    )
}
