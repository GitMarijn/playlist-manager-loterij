import React from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import App from "./App";
import { Center, createTheme, MantineProvider } from "@mantine/core";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = createTheme({
  other: {
    green: "#69B82D",
    red: "#E30127",
    blue: "#0069B5",
  },
});

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Center p='md'>
        <App />
      </Center>
    </MantineProvider>
  </React.StrictMode>
);
