import { Box, Button, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { setUser } from "../../../models/user";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required(),
      password: Yup.string().min(8).required(),
    }),
    onSubmit: async (values) => {
      console.log(values);
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        dispatch(setUser(data.user));
        navigate("/");
      } else {
        const data = await response.json();
        alert(data.message);
      }
    },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        marginX: "auto",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <TextField
        label="Email or Phone"
        name="username"
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.username}
        helperText={errors.username}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
        margin="normal"
        type="password"
      />
      <LoadingButton
        type="submit"
        variant="contained"
        sx={{ marginY: "1rem" }}
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </Box>
  );
}
