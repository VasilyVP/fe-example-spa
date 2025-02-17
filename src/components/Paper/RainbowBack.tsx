import { Box } from '@mui/material';

type RainbowBackProps = {
    width: number;
    height: number;
    left: number;
    top: number;
}
export default ({ width, height, left, top }: RainbowBackProps) => {
    return (
        <Box
            position='absolute'
            left={left} top={top}
            maxWidth='100vw'
            //maxHeight='100vh'
            overflow='hidden'
            sx={{
                pointerEvents: 'none',
            }}
        >
            <svg /* width="926" height="619" */ width={width} height={height} viewBox="0 0 926 619" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.5" filter="url(#filter0_f_78_1664)">
                    <ellipse cx="191.556" cy="335.409" rx="81.5557" ry="173.591" fill="#399AD1" />
                    <ellipse cx="301.105" cy="283.591" rx="81.5557" ry="173.591" fill="#A939D1" />
                    <ellipse cx="417.968" cy="335.409" rx="81.5557" ry="173.591" fill="#D26739" />
                    <ellipse cx="517.772" cy="283.591" rx="81.5557" ry="173.591" fill="#3C39D1" />
                    <ellipse cx="605.419" cy="335.409" rx="81.5557" ry="173.591" fill="#D2395E" />
                    <ellipse cx="734.444" cy="283.591" rx="81.5557" ry="173.591" fill="#D2CC39" />
                </g>
                <defs>
                    <filter id="filter0_f_78_1664" x="0" y="0" width={width} height={height} /* width="926" height="619" */ filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="55" result="effect1_foregroundBlur_78_1664" />
                    </filter>
                </defs>
            </svg>
        </Box>
    )
}
