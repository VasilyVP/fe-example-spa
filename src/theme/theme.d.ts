import { CommonColors } from "@mui/material/styles/createPalette"; // eslint-disable-line


/* declare module '@mui/material/styles' {
  interface Palette {
    specific: {
      [k: string]: string;
      model: string;
      pipeline: string;
      benchmark: string;
      dataset: string;
      premium_report: string;
      file: string;
    }
  }
  interface PaletteOptions {
    specific: {
      model: string;
      pipeline: string;
      benchmark: string;
      dataset: string;
      premium_report: string;
      file: string;
    }
  }
} */

declare module "@mui/material/styles/createPalette" {
  interface CommonColors {
    gray: string;
    /* violet: string;
    turquoise: string;
    bgGrey: string;
    blackBlue: string;
    green: string;
    red:string;
    blue:string;
    lightGrey:string; */
  }
}
