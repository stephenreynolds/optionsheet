import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { Provider as ReduxProvider } from "react-redux";
import App from "./components/app";
import { theme } from "./components/layout/theme";
import configureStore from "./redux/configureStore";

const store = configureStore();

ReactDOM.render(
  <ReduxProvider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </ReduxProvider>,
  document.getElementById("root")
);
