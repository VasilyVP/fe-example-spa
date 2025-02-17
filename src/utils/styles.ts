import { BoxProps, TypographyProps, useTheme, useMediaQuery, Breakpoint } from "@mui/material";
import { Dispatch } from "react";

export function ellipsed(): TypographyProps & BoxProps {
    return {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    }
}

/* export function prettyScroll(isMobile: boolean) {
    return {
        scrollbarWidth: isMobile ? 'none' : 'thin',
        '&::-webkit-scrollbar': {
            display: isMobile ? 'none' : 'inherit',
            width: '5px',
            color: 'gray'
            //height: '2px'
        },
    }
} */

export function noScrollBar() {
    return {
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    }
}

export function hoverableSvgIcon(onHover: Dispatch<boolean>) {
    return {
        onMouseEnter: () => onHover(true),
        onMouseLeave: () => onHover(false),
    }
}

export function useMobile({ breakpoint = 'sm' }: { breakpoint?: Breakpoint } = {}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(breakpoint));

    return {
        isMobile,
    }
}
