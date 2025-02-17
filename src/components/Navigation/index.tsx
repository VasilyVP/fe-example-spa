import { ReactNode, createContext, useRef, useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { useMobile } from 'utils/styles';
import Chip from 'components/Navigation/Chip';

type NavContextT = {
    ifMobileColumn: boolean;
    size?: DOMRect;
}

export const NavContext = createContext<NavContextT>({
    ifMobileColumn: false,
});

type NavigationProps = {
    children: ReactNode[];
    ifMobileColumn?: boolean;
    chipContent?: string | ReactNode | ReactNode[];
}
export default ({ children, ifMobileColumn = false, chipContent }: NavigationProps) => {
    const [size, setSize] = useState<DOMRect>()
    const { isMobile } = useMobile();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        setSize(ref.current.getBoundingClientRect());
    }, [ref.current, isMobile]); // eslint-disable-line

    const context = {
        ifMobileColumn,
        size,
    }

    const commonProps = {
        width: 'fit-content',
        maxWidth: '100%',
        bgcolor: '#EAEEF0',
        padding: '2px',
        overflow: 'auto',
        borderRadius: isMobile && !ifMobileColumn ? '16px 0px 0px 16px' : '16px',
        sx: {
            //position: 'relative',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
    };

    return (
        <NavContext.Provider value={context}>
            {ifMobileColumn
                ? (
                    <Box display='inline-flex' position='relative'>
                        <Grid
                            container
                            ref={ref}
                            {...commonProps}
                        >
                            {children}
                        </Grid>
                        {chipContent && <Chip parentRect={size}>{chipContent}</Chip>}
                    </Box>
                ) : (
                    <Box
                        display='flex'
                        ref={ref}
                        {...commonProps}
                    >
                        {children}
                    </Box>
                )
            }
        </NavContext.Provider>
    )
}
