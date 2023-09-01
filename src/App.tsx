import { NavLink, useNavigate, useRoutes } from "react-router-dom";
import Auth from "./pages/auth";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import { AppBar, Box, Button, Container, Typography } from "@mui/material";
import AutoStories from "@mui/icons-material/AutoStories";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, fetchUser, selectUser } from "./models/user";
import Home from "./pages/home";
import { useEffect } from "react";
import { AnyAction } from "@reduxjs/toolkit";
import Books from "./pages/books";

function Navigation() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      sx={{
        p: 2,
        mb: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          p: 1,
          cursor: "pointer",
        }}
      >
        <NavLink
          to="/"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Box>
            <AutoStories fontSize="medium" />
          </Box>
          <Typography variant="h6">Auctopus Library</Typography>
        </NavLink>
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <NavLink
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
            end
          >
            {({ isActive }) => (
              <Typography variant="h6" color={isActive ? "primary" : "inherit"}>
                Home
              </Typography>
            )}
          </NavLink>
          <NavLink
            to="/books"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {({ isActive }) => (
              <Typography variant="h6" color={isActive ? "primary" : "inherit"}>
                Books
              </Typography>
            )}
          </NavLink>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        {user.id ? (
          <>
            <Typography variant="body1">Welcome, {user.name}</Typography>
            <Button
              variant="contained"
              onClick={() => {
                dispatch(clearUser());
                window.location.reload();
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1">Welcome, Guest</Typography>
            <Button
              variant="contained"
              onClick={() => {
                navigate("/auth");
              }}
            >
              Login
            </Button>
          </>
        )}
      </Box>
    </AppBar>
  );
}

function App() {
  const router = useRoutes([
    {
      path: "",
      element: <Home />,
    },
    {
      path: "books",
      element: <Books />,
    },
    {
      path: "auth",
      element: <Auth />,
      children: [
        {
          path: "",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
      ],
    },
  ]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchUser() as unknown as AnyAction);
    }
  }, []);

  return (
    <Container fixed>
      <Navigation />
      {router}
    </Container>
  );
}

export default App;
