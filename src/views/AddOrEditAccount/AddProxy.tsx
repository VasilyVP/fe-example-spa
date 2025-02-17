import { useState } from 'react'
import { Updater } from 'use-immer'
import { Box, useTheme } from "@mui/material"
import { CloseIcon } from "assets/icons/icons"
import RainbowButton from "components/Buttons/RainbowButton"
import PaperBlock from "components/Paper/PaperBlock"
import PaperBlockContainer from "components/Paper/PaperBlockContainer"
import TextInput from "components/TextInput"
import { ProxyInput } from ".";


type AddProxyProps = {
    proxy: ProxyInput;
    setProxy: Updater<ProxyInput>;
    handleAddAccount: () => void;
    handleClose: () => void;
}
export default ({ proxy, setProxy, handleAddAccount, handleClose }: AddProxyProps) => {
    const [processing, setProcessing] = useState(false);
    const theme = useTheme();

    return (
        <PaperBlockContainer sx={{ pointerEvents: 'auto' }} >
            <PaperBlock width='340px' /* height='333px' */>
                <Box
                    display='flex' justifyContent='space-between' alignItems='center'
                    fontWeight={600} fontSize='20px' lineHeight='120%'
                    color={theme.palette.common.black}
                >
                    Proxy
                    <CloseIcon onClick={handleClose} />
                </Box>
                <Box
                    mt='16px'
                    display='flex' justifyContent='space-between'
                    fontWeight={600} fontSize='14px' lineHeight='160%'
                    color={theme.palette.common.black}
                >
                    <Box width={138}>
                        IP
                    </Box>
                    <Box width={138}>
                        Port
                    </Box>
                </Box>
                <Box
                    mt='8px'
                    display='flex' justifyContent='space-between'
                >
                    <Box width={138}>
                        <TextInput
                            value={proxy.host}
                            onChange={e => setProxy(proxy => { proxy.host = e.target.value })}
                            placeholder='IP'
                        />
                    </Box>
                    <Box width={138}>
                        <TextInput
                            value={proxy.port}
                            onChange={e => setProxy(proxy => { proxy.port = e.target.value })}
                            placeholder="Port"
                        />
                    </Box>
                </Box>
                <Box
                    mt='16px'
                    fontWeight={600} fontSize='14px' lineHeight='160%'
                    color={theme.palette.common.black}
                >
                    User
                </Box>
                <Box mt='8px'>
                    <TextInput
                        value={proxy.username}
                        onChange={e => setProxy(proxy => { proxy.username = e.target.value })}
                        placeholder='User'
                    />
                </Box>
                <Box
                    mt='16px'
                    fontWeight={600} fontSize='14px' lineHeight='160%'
                    color={theme.palette.common.black}
                >
                    Password
                </Box>
                <Box mt='8px'>
                    <TextInput
                        value={proxy.password}
                        onChange={e => setProxy(proxy => { proxy.password = e.target.value })}
                        placeholder='Password'
                    />
                </Box>
                <Box mt='16px'>
                    <RainbowButton
                        fullWidth
                        onClick={() => {
                            setProcessing(true);
                            handleAddAccount();
                        }}
                        loading={processing}
                    >
                        Proceed
                    </RainbowButton>
                </Box>
            </PaperBlock>
        </PaperBlockContainer>
    )
}
