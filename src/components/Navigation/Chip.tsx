import { ReactNode, useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useMobile } from 'utils/styles';

type ChipProps = {
    children: ReactNode;
    parentRect?: DOMRect;
}
export default ({ children, parentRect }: ChipProps) => {
    const ref = useRef<HTMLDivElement>();
    const [ownRect, setOwnRect] = useState<DOMRect>();
    const { isMobile } = useMobile();
    //const { /* ifMobileColumn, */ size } = useContext(NavContext);

    useEffect(() => {
        if (!ref.current) return;
        setOwnRect(ref.current.getBoundingClientRect());
    }, [ref.current, isMobile]); //eslint-disable-line

    if (!parentRect) return null;

    const { /* x, y, width, */ height } = parentRect;

    let right = 0;
    let top = 0;
    if (ownRect) {
        right = isMobile ? -22 : -19;
        top = isMobile ? height - ownRect.width * 0.4: -11;
    }

    return (
        <Box
            ref={ref}
            position='absolute'
            right={right} top={top}
            display='inline-flex' justifyContent='center' alignItems='center'
            color='white'
            bgcolor='#8D00D0'
            borderRadius='22px'
            padding='4px 8px'
            fontWeight={600} fontSize='14px' lineHeight='160%'
            sx={{
                opacity: ownRect ? 1 : 0,
            }}
        >
            {children}
        </Box>
    )
}
