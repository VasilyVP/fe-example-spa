import { Dispatch, useContext, useMemo, useRef } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Icon } from 'assets/icons/icons';
import { NavContext } from '.';
import { useMobile } from 'utils/styles';

type NavButtonProps = {
    navIcon?: Icon;
    buttonText: string;
    //chipContent?: string | ReactNode | ReactNode[];
    btnId?: number | string;
    current?: number | string;
    onClick?: Dispatch<string | number>;
}
const NavButton = ({ navIcon, buttonText, /* chipContent, */ current, btnId = -1, onClick }: NavButtonProps) => {
    const { ifMobileColumn } = useContext(NavContext);
    const { isMobile } = useMobile();
    const ref = useRef<HTMLDivElement>(null);

    const NavIcon = navIcon;
    const active = current === btnId;

    const commonProps = useMemo(() => ({
        display: 'flex',
        alignItems: 'center',
        ref,
        height: '38px',
        paddingX: '16px',
        borderRadius: '14px',
        bgcolor: active ? 'white' : 'transparent',
        onClick: () => onClick && onClick(btnId),
        sx: {
            cursor: active ? 'auto' : onClick && 'pointer',
        },
    }), [active]); // eslint-disable-line

    const commonContent = useMemo(() => (
        <>
            {NavIcon ?
                (
                    <Box display='flex' marginRight='9px' color={active ? 'black' : 'gray'}>
                        <NavIcon active={active} />
                    </Box>
                ) : null
            }
            <Typography
                fontWeight={600} fontSize='14px' lineHeight='160%'
                whiteSpace='nowrap'
                color={active ? 'black' : 'gray'}
            >
                {buttonText}
            </Typography>
        </>
    ), [active, isMobile]); // eslint-disable-line

    return (
        isMobile && ifMobileColumn ? (
            <Grid
                item
                width='100%'
                {...commonProps}
            >
                {commonContent}
            </Grid>
        ) : (
            <Box
                {...commonProps}
            >
                {commonContent}
            </Box>
        )

    )
}

export default NavButton;
