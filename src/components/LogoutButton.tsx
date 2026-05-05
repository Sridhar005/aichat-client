import { Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button color="inherit" onClick={logout}>
      Logout
    </Button>
  );
};

export default LogoutButton;