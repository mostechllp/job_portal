import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HomePage } from "./pages/HomePage";
import { loadUser, setInitialized } from "./store/slices/authSlice";

export function App() {
  const dispatch = useDispatch();
  const { token, user, isInitialized } = useSelector((state) => state.auth);;

  useEffect(() => {
    
    // If we have a token but no user data, load the user
    if (token && !user) {
      dispatch(loadUser());
    }
    // If we have no token, mark as initialized
    else if (!token && !isInitialized) {
      dispatch(setInitialized());
    }
  }, [dispatch, token, user, isInitialized]);

  return <HomePage />;
}