import { ReactNode, useEffect, useRef, useState } from 'react';
import { Box, BoxProps } from '@mui/material';
import { TlCorner, TrCorner, BlCorner, BrCorner } from './corners';
import RainbowBack from './RainbowBack';
import { useMobile } from 'utils/styles';

const ratioX = 1.4;
const ratioY = 1.56;

type PositionAndSizes = {
    width: number;
    height: number;
    left: number;
    top: number;
}

type PaperProps = {
    children?: ReactNode | ReactNode[];
    width?: string | number;
    height?: string | number;
    rainbowBack?: boolean;
}
export default ({ children, width = '100%', height = '100%', rainbowBack = false, ...props }: PaperProps & BoxProps) => {
    const [rainbowSize, setRainbowSize] = useState<PositionAndSizes>({ width: 0, height: 0, left: 0, top: 0 });

    const { isMobile } = useMobile();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const size = ref.current.getBoundingClientRect();

        const widthR = size.width * ratioX;
        const heightR = size.height * ratioY;

        const left = -(widthR as number - Number(size.width)) / 2;
        const top = -(heightR - Number(size.height)) / 2;

        setRainbowSize({
            width: widthR,
            height: heightR,
            left,
            top,
        });
    }, [ref.current, isMobile]); // eslint-disable-line

    return (
        <Box
            width={width}
            height={height}
            position='relative'
            ref={ref}
            {...props}
        >
            <Box
                padding='8px'
                width='100%' height='100%'
                display='flex' flexDirection='column' justifyContent='space-between'
                borderRadius='16px'
                bgcolor='white'
                position='relative'
                zIndex={10}
            /* sx={{
                opacity: 0,
            }} */
            >
                <Box display='flex' justifyContent='space-between'>
                    <TlCorner />
                    <TrCorner />
                </Box>
                <Box
                    marginX='15px'
                    flexGrow={1}
                //border='1px solid green'
                >
                    {children}
                </Box>
                <Box display='flex' justifyContent='space-between'>
                    <BlCorner />
                    <BrCorner />
                </Box>
            </Box>
            {rainbowBack && rainbowSize.width && !isMobile
                ? <RainbowBack
                    width={rainbowSize.width}
                    height={rainbowSize.height}
                    left={rainbowSize.left}
                    top={rainbowSize.top}
                />
                : null
            }
        </Box>
    )
}
