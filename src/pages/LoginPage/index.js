import React, { useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import UserContext from '../../context/UserContext';
import login from '../../api/login';
import style from './style.module.scss';

const initialValues = { email: '', password: '' };
const validate = values => {
    const errors = {};
    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }
    if (!values.password) {
        errors.password = 'Required';
    }
    return errors;
}

const LoginPage = (props) => {
    const userContext = useContext(UserContext);
    const onSubmit = async (values, { setSubmitting }) => {
        const { history } = props;

        try {
            const { data: { access_token, ...restParams } } = await login(values.email, values.password);
            
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('userData', JSON.stringify(restParams));
            userContext.setLoggedUser(restParams.user);
            history.replace('/');
        }
        catch (e) {
            //
        }
    }

    return (
        <div className={style.wrapper}>
            <h1>Sign in</h1>
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
                            label="Email"
                            name="email"
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
                            value={values.password}
                            error={!!(errors.password && touched.password && errors.password)}
                            variant="outlined"
                            margin="dense"
                            type="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                      
                        <Button 
                            variant="contained" 
                            size="medium"
                            type="submit"
                            disabled={!isValid || !dirty}
                            onClick={handleSubmit}
                        >
                            Sign in
                        </Button>
                        <Link to='/register'>Sign up</Link>
                    </form>
                )}
            </Formik>
        </div>
    )
};

export default withRouter(LoginPage);