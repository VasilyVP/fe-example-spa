import { MouseEvent } from "react";
import { Box } from "@mui/system";
import { Dispatch } from "react";

type ButtonProps = {
    onClick?: Dispatch<MouseEvent>;
}
export default ({ onClick }: ButtonProps) => {
    return (
        <Box
            display='inline-flex'
            onClick={onClick}
            sx={{
                cursor: 'pointer',
            }}
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_149_11594)">
                    <path d="M11.5 1L4.5 8L11.5 15" stroke="#95A0A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_149_11594">
                        <rect width="16" height="16" fill="white" transform="translate(16) rotate(90)" />
                    </clipPath>
                </defs>
            </svg>
        </Box>
    )
}
