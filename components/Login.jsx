import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Button, Box, Typography } from "@mui/material";
import CustomTextField from "./CustomTextField";
import "./Login.css";
import GeneralUtil from "../../common/services/util/GeneralUtil";
import AuthenticateService from "../../common/services/authentication.service";
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
  const login = {};
  login.user = {};
  login.as = { user: {} };
  login.showSystemNotice = false;
  login.hideAppLink = false;
  login.env = GeneralUtil.getEnv();
  login.init = () => {
    [login.imagesPath, login.logoImages] = GeneralUtil.getLogoImages();
    AuthenticateService.getSystemNotice()
      .then((response) => {
        if (response.data != null && response.data.keyValue != null) {
          console.log("dsfjhskjdhfkj", response);
          login.showSystemNotice = true;
          login.systemNotice = response.data.keyValue;
        }
      })
      .catch((error) => {
        GeneralUtil.showMessageOnApiCallFailure(error);
      })
      .finally(() => {
        // Mask is not defined till now that why it is commented
        // Mask.hide();
      });
    AuthenticateService.getApkInfo()
      .then((response) => {
        // console.log("response",response)
        if (response.data.length === 0) {
          login.hideAppLink = true;
        }
        if (response.data.length > 0) {
          login.link = response.data[0];
        }
        if (response.data.length > 1) {
          login.version = response.data[1];
        }
        if (response.data.length > 2) {
          login.release_date = response.data[2];
        }
      })
      .catch((error) => {
        GeneralUtil.showMessageOnApiCallFailure(error);
      })
      .finally(() => {
        // Mask is not defined till now that why it is commented
        // Mask.hide();
      });
  };

  const doLoginLocal = (user) => {
    // console.log("user",user)
    AuthenticateService.getKeyAndIV().then(function (res) {
        
        AuthenticateService.login(user.username,user.password,function (data){
            // console.log("logged in data")
            AuthenticateService.getLoggedInUser(true,user.username).then(function(res){
                login.userDetail = res.data;
                console.log(login)
                navigate(`home`, { state: { login:login.userDetail } });
              
            })
        },function (error) {
            // Mask.hide();
            var data = error.data;
            user.hasAuthError = true;
            if (data.message === "Bad credentials") {
                user.errorMessage = "Password Incorrect";
            } else {
                user.errorMessage = data.message;
            }
        })
    });
  };
 

//   console.log(login);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("*Username is required"),
    password: Yup.string()
      .min(6, "Password too short")
      .required("*Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      console.log("Form data", values);
      doLoginLocal({
        username:values.username,
        password:values.password
      })
      
      // Here, you can call your login API
    },
  });

  return (
    <Container maxWidth="sm" className="container-padding">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <CustomTextField
            formik={formik}
            name="username"
            placeholder="Username"
            size="small"
          />
          <CustomTextField
            formik={formik}
            name="password"
            type="password"
            placeholder="Password"
            size="small"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
