import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    button: {
      primary: {
        100: "#eeeeee",
      },
      header: {
        100: "#40141c",
      },
      success: {
        100: "green",
      },
    },
    bg: {
      primary: {
        100: "rgb(75, 75, 181)",
      },
      secondary: {
        100: "rgba(4, 175, 84)",
      },
      header: {
        100: "white",
      },
      none: "transparent",
    },
    text: {
      primary: {
        100: "white",
      },
      secondary: {
        100: "#EEEDEC",
      },
      header: {
        100: "rgba(84, 99, 172)",
      },
    },
    icons: {
      100: "#000000",
    },
    status: {
      success: "#008000",
    },
    border: "#E4E4E7",
  },
});

export default theme;
