import React, { useEffect } from "react";
import "./App.scss";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { Main } from "./components/Main/Main";
import { LoaderBackground } from "./components/LoaderBackground/LoaderBackground";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import { StorageType } from "./services/storage";
import { decodeInfo } from "./services/code";
import { signInAPI } from "./api/auth";
import { setUserApp } from "./redux/app";
import { getUsers } from "./screens/Profile/ProfileScreen";

function App() {
  const dispatch = useDispatch();

  const loader = useSelector((state: RootState) => state.app.loading);
  const [cookie, _] = useCookies([StorageType.TOKEN]);

  useEffect(() => {
    if (cookie.TOKEN) {
      const user = JSON.parse(decodeInfo(cookie.TOKEN));

      if (user.email && user.pass)
        signInAPI({
          email: user.email,
          password: user.pass,
          noHash: true,
        }).then((result) => {
          if (result.status) {
            dispatch(setUserApp(result.result));
          }
        });
    }
    getUsers(dispatch);
  }, [cookie]);

  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
      {loader && <LoaderBackground />}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
