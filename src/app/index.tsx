import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import {ThemeProvider} from "styled-components";
import App from "./components/app";
import {theme} from "./theme.styles";
import "./index.scss";

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
