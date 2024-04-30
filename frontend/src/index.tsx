import React from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import App from "./App";
import { Center, createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = createTheme({
  other: {
    green: "#69B82D",
    red: "#E30127",
    blue: "#0069B5",
    yellow: "#FDC43C",
  },
});

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Notifications position='bottom-center' />
      <Center p='md'>
        <App />
      </Center>
    </MantineProvider>
  </React.StrictMode>
);
