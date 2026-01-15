import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { RoutesPaths } from "./models/enums/routesPaths";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path={RoutesPaths.Login} element={<Login />} />
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
