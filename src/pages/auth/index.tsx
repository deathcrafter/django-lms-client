import { Box, Tab, Tabs } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

function LinkTab({ label, to }: { label: string; to: string }) {
  const navigate = useNavigate();

  return (
    <Tab
      label={label}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    />
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const [value, setValue] = useState(
    window.location.pathname === "/auth" ? 0 : 1
  );

  useEffect(() => {
    switch (window.location.pathname) {
      case "/auth":
        setValue(0);
        break;
      case "/auth/register":
        setValue(1);
        break;
    }
  }, []);

  return (
    <Box>
      <Tabs
        value={value}
        onChange={(_e, value) => {
          switch (value) {
            case 0:
              navigate("/auth");
              break;
            case 1:
              navigate("/auth/register");
              break;
          }
          setValue(value);
        }}
        centered
      >
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
