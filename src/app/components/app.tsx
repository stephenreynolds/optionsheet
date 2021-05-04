import BaseStyles from "./baseStyles";
import Routes from "./routes";
import NormalizeStyles from "./normalize";

const App = (): JSX.Element => (
  <>
    <NormalizeStyles />
    <BaseStyles />
    <Routes />
  </>
);

export default App;
