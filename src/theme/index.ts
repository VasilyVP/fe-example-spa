import { createTheme } from "@mui/material/styles";

export default createTheme({
    palette: {
        common: {
            black: '#1D2123',
            gray: '#95A0A7',
        },
        text: {
            primary: '#1D2123',
        },
        /* background: {
            default: "#f2f4f4",
        }, */
    },
    typography: {
        fontFamily: [
            "Inter",
            "Arial",
            /* "Public Sans",
            "sans-serif", */
            "-apple-system",
            "BlinkMacSystemFont",
        ].join(","),
    }
})
