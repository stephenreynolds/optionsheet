import { useEffect } from "react";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

const LoadingProgress = () => {
  nprogress.configure({ showSpinner: false });
  
  useEffect(() => {
    nprogress.start();

    return () => {
      nprogress.done();
    };
  }, []);

  return null;
};

export default LoadingProgress;