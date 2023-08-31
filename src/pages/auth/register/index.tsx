import * as Yup from "yup";
import { useFormik } from "formik";
import { Box, Button, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      college: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().max(100).required(),
      email: Yup.string().email().max(100).required(),
      phone: Yup.string()
        .matches(/^\d+$/, "Only digits allowed")
        .min(10)
        .max(10)
        .required(),
      address: Yup.string().max(400).required(),
      college: Yup.string().max(100).required(),
      password: Yup.string().min(8).required(),
      passwordConfirmation: Yup.string().oneOf(
        [Yup.ref("password"), ""],
        "Passwords must match"
      ),
    }),
    onSubmit: async (values) => {
      console.log(values);
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        navigate("/auth");
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
        label="Name"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.name}
        helperText={errors.name}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone"
        name="phone"
        value={values.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.phone}
        helperText={errors.phone}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Address"
        name="address"
        value={values.address}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.address}
        helperText={errors.address}
        fullWidth
        margin="normal"
        multiline
      />
      <TextField
        label="College"
        name="college"
        value={values.college}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.college}
        helperText={errors.college}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password Confirmation"
        name="passwordConfirmation"
        type="password"
        value={values.passwordConfirmation}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.passwordConfirmation}
        helperText={errors.passwordConfirmation}
        fullWidth
        margin="normal"
      />
      <LoadingButton
        type="submit"
        variant="contained"
        color="primary"
        loading={isSubmitting}
      >
        Register
      </LoadingButton>
    </Box>
  );
}
