import React from 'react';
import { TextField, FormControl, FormHelperText, Box } from '@mui/material';
import './Login.css';

const CustomTextField = ({ formik, name, label, ...props }) => {
  const hasError = formik.touched[name] && Boolean(formik.errors[name]);

  return (
    <FormControl fullWidth margin="normal" sx={{ position: 'relative' }} >
      <TextField
        {...props}
        id={name}
        name={name}
        label={label}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={hasError}
        helperText=""
        fullWidth
      />
      {hasError && (
        <p  className="error-helper-text">
          {formik.errors[name]}
        </p>
      )}
    </FormControl>
  );
};

export default CustomTextField;
