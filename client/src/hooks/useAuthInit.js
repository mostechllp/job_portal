import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, setInitialized } from "../store/slices/authSlice";

export function useAuthInit() {
  const { token, isInitialized, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // If we have a token but no user and not initialized, load the user
    if (token && !user && !isInitialized) {
      dispatch(loadUser());
    }
    // If we have no token and not initialized, mark as initialized
    else if (!token && !isInitialized) {
      dispatch(setInitialized());
    }
  }, [dispatch, token, user, isInitialized]);

  return { token, isInitialized, user };
}