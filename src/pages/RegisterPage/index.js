import React from 'react';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import register from '../../api/register';
import style from './style.module.scss';

const initialValues = { 
    name: '',
    email: '', 
    password: '',
    confirmPassword: ''
};
const validate = values => {
    const errors = {};

    if (!values.email) {
        errors.email = 'Required';
    } 
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }
    if (!values.name) {
        errors.name = 'Required';
    }
    if (!values.password) {
        errors.password = 'Required';
    }
    if (!values.confirmPassword) {
        errors.confirmPassword = 'Required';
    }
    else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Password doesn't match";
    }
    return errors;
}

const RegisterPage = (props) => {

    const onSubmit = async ({ name, email, password, confirmPassword }, { setSubmitting }) => {
        const { history } = props;

        try {
            await register({ name, email, password, confirmPassword });
            history.replace('/login');
        }
        catch (e) {
            //
        }
    }

    return (
        <div className={style.wrapper}>
            <h1>Sign up</h1>
            <Formik
                initialValues={initialValues}
                validate={validate}
                onSubmit={onSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isValid,
                    dirty
                }) => (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="name"
                            name="name"
                            required={true}
                            value={values.name}
                            error={!!(errors.name && touched.name && errors.name)}
                            variant="outlined"
                            margin="dense"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            required={true}
                            value={values.email}
                            error={!!(errors.email && touched.email && errors.email)}
                            variant="outlined"
                            margin="dense"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            required={true}
                            value={values.password}
                            error={!!(errors.password && touched.password && errors.password)}
                            variant="outlined"
                            margin="dense"
                            type="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <TextField
                            label="Confirm Password"
                            name="confirmPassword"
                            required={true}
                            value={values.confirmPassword}
                            error={!!(errors.confirmPassword && touched.confirmPassword && errors.confirmPassword)}
                            variant="outlined"
                            margin="dense"
                            type="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                      
                        <Button 
                            variant="contained" 
                            size="medium"
                            disabled={!isValid || !dirty}
                            onClick={handleSubmit}
                        >
                            Sign up
                        </Button>
                        <Link to='/login'>Sign in</Link>
                    </form>
                )}
            </Formik>
        </div>
    )
};

export default RegisterPage;