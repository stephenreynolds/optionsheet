import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { Provider as ReduxProvider } from "react-redux";
import App from "./components/app";
import configureStore from "./redux/configureStore";
import colors from "./components/colors";

const store = configureStore();

ReactDOM.render(
  <ReduxProvider store={store}>
    <ThemeProvider theme={colors}>
      <App />
    </ThemeProvider>
  </ReduxProvider>,
  document.getElementById("root")
);
