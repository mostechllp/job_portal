import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../store/slices/authSlice";

export function useAuthInit() {
  const { token, isInitialized } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !isInitialized) {
      dispatch(loadUser());
    }
  }, [dispatch, token, isInitialized]);

  return { token, isInitialized };
}