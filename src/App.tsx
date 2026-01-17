import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { RoutesPaths } from "./models/enums/routesPaths";
import { auth } from "./firebase/firebaseConection";
import Login from "./pages/Login";
import Feed from "./pages/Feed";

function App() {
  const navigate = useNavigate();

  const  checkLogin = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate(RoutesPaths.Feed)
      }else {
        navigate(RoutesPaths.Login);
      }
    });
  };

  // Aqui é onde chamamamos uma função quando a tela é renderizada pela primeira vez
  useEffect(() => {
   checkLogin();
  }, []);

  return (
    <>
      <Routes>
        <Route path={RoutesPaths.Login} element={<Login />} />
        <Route path={RoutesPaths.Feed} element={<Feed />} />
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={3500}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
