import { Box } from "@mui/material";
import ehtereumIcon from 'assets/icons/etherium_icon.png';
import bitcoinIcon from 'assets/icons/bitcoin_icon.png';
import usdtIcon from 'assets/icons/usdt_icon.png';
import { OkIcon } from "assets/icons/icons";

export enum CashoutMethod {
    ethereum = 'ethereum',
    bitcoin = 'bitcoin',
    usdtErc = 'usdt-erc-20',
}

const icon = {
    ethereum: ehtereumIcon,
    bitcoin: bitcoinIcon,
    'usdt-erc-20': usdtIcon,
}

const methodName = {
    ethereum: 'Ethereum',
    bitcoin: 'Bitcoin',
    'usdt-erc-20': 'USDT ERC-20',
}

type CashoutMethodProps = {
    selected: CashoutMethod | null;
    method: CashoutMethod;
    width: string;
    onClick: (method: CashoutMethod) => void;
}
export default ({ selected, method, width, onClick }: CashoutMethodProps) => {
    const isSelected = selected === method;

    return (
        <Box
            display='flex' flexDirection='column' alignItems='center'
            position='relative'
            width={width}
            height='94px'
            pt='16px'
            bgcolor='#EAEEF0'
            border='1px solid white'
            sx={{
                cursor: 'pointer',
                opacity: isSelected ? 1 : 0.3,
                '&:hover': {
                    opacity: isSelected ? 1 : 0.7,
                },
            }}
            onClick={() => onClick(method)}
        >
            <img src={icon[method]} width='32px' height='32px' alt='' />
            <Box
                width='100%' height='38px'
                display='flex' justifyContent='center' alignItems='center'
                bgcolor='#EAEEF0'
                fontWeight={600} fontSize='14px' lineHeight='22px'
            >
                {methodName[method]}
            </Box>
            {isSelected &&
                <Box
                    position='absolute' top='9px' right='9px'
                    display='flex'
                >
                    <OkIcon color='#6F2CFF' />
                </Box>
            }
        </Box >
    )
}
