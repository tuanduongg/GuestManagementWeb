import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { Modal } from 'antd';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { setCookie } from 'utils/helper';
import { useNavigate } from 'react-router-dom';
import { ConfigRouter } from 'config_router';
import Loading from 'components/Loading';
import { useTranslation } from 'react-i18next';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
  const { t, i18n } = useTranslation();

  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [language, setLanguage] = React.useState(localStorage.getItem('LANGUAGE') ?? 'en');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string()
            .max(255)
            .required(`${t('errorEmptyUsername')}`),
          password: Yup.string()
            .max(255)
            .required(`${t('errorEmptyPassword')}`)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setStatus({ success: false });
            setSubmitting(false);
            setLoading(true);
            const res = await restApi.post(RouterAPI.login, values);
            setLoading(false);
            if (res?.status === 200) {
              const data = res?.data;
              setCookie('ASSET_TOKEN', data?.accessToken, 1);
              localStorage.setItem('DATA_USER', JSON.stringify(data?.user));
              location.href = ConfigRouter.listGuest.url;
            } else {
              Modal.error({
                title: t('msg_notification'),
                content: t('msg_login_fail'),
                centered: true,
                okText: t('close')
              });
            }
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Loading loading={loading} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">{t('username')}</InputLabel>
                  <OutlinedInput
                    autoFocus
                    type="text"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={t('username') + '...'}
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                  />
                  {touched.username && errors.username && <FormHelperText error>{errors.username}</FormHelperText>}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">{t('password')}</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder={t('password') + '...'}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                {/* <Stack spacing={1}> */}
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">{t('language')}</InputLabel>
                  <Select
                    value={language}
                    label={t('language')}
                    onChange={(event) => {
                      setLanguage(event.target.value);
                      localStorage.setItem('LANGUAGE', event.target.value);
                      i18n.changeLanguage(event.target.value);
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                  >
                    <MenuItem value={'vn'}>Việt Nam</MenuItem>
                    <MenuItem value={'ko'}>Korean</MenuItem>
                    <MenuItem value={'en'}>English</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {t('login')}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
