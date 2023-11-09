import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen.jsx";
import OnboardingScreen from "./screens/OnboardingScreen.jsx";
import { RecoilRoot } from "recoil";
import ConfirmUserScreen from "./screens/ConfirmUserScreen.jsx";
import DashBoardScreen from "./screens/DashBoardScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute.jsx";
import BoardsScreen from "./screens/BoardsScreen.jsx";
import { DragDropContext } from "react-beautiful-dnd";
import Cards from "./components/Cards.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />,
  },
  {
    path: "/onboard",
    element: <OnboardingScreen />,
  },
  {
    path: "/confirm",
    element: <ConfirmUserScreen />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashBoardScreen />
      </PrivateRoute>
    ),
    children: [{ path: "boards", element: <Cards /> }],
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
]);

function App() {
  return (
    <RecoilRoot>
      <ToastContainer />
      <RouterProvider router={router} />
    </RecoilRoot>
  );
}

export default App;
