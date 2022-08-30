import { Axios, AxiosError } from 'axios';
import { AiOutlineMail } from 'react-icons/ai';
import { FormEvent, useState } from 'react';
import loginStyles from '../styles/login/Login.module.scss';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { http } from '../helpers/utils';
import { loginState } from '../data/initialState';
import FormInput from '../components/Form/FormInput';
import { ILoginForm, ILoginResponse } from '../interfaces';
import { useAppDispatch } from '../app/hooks';
import { saveUser } from '../features/userSlice';
import { saveTokens } from '../features/tokenSlice';

interface ILoginProps {
  connectToWS: () => void;
}

export default function Login({ connectToWS }: ILoginProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<ILoginForm>(loginState);
  const [error, setError] = useState('');

  const togglePasswordType = (type: string) => {
    if (type === 'text') {
      updateForm('password', 'text', 'type');
      return;
    }
    updateForm('password', 'password', 'type');
  };

  const updateForm = (name: string, value: string, type: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof ILoginForm], [type]: value },
    }));
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await http.post('/auth/verify/', { token });
      console.log(response);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const applyValidationErrors = <T,>(errors: T) => {
    for (const [key, val] of Object.entries(errors)) {
      updateForm(key, val[0], 'error');
    }
  };

  const loginUser = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError('');
      const response = await http.post<ILoginResponse>('/auth/login/', {
        email: form.email.value,
        password: form.password.value,
      });

      if (response === undefined) {
        setError('Invalid credentials or you have not verified your email.');
        return;
      }

      dispatch(saveUser(response.data.user));
      dispatch(saveTokens(response.data.tokens));
      connectToWS();
      navigate('/');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.status !== 400) {
          setError(err.response.data.errors);
          return;
        }
        applyValidationErrors(err.response.data);
      }
    }
  };

  const resendVerification = async () => {
    try {
      setError('');
      const response = await http.post('/auth/resend-verify/', {
        email: form.email.value,
      });
      console.log(response);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  useEffectOnce(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    }
  });

  return (
    <div className={loginStyles.container}>
      <div className={loginStyles.formContainer}>
        <form onSubmit={loginUser} className={loginStyles.form}>
          <header>
            <h1>Login</h1>
          </header>
          {error && (
            <div className={loginStyles.mainError}>
              <p>{error}</p>
            </div>
          )}
          {error?.includes('verification') && (
            <div
              onClick={resendVerification}
              className={loginStyles.verificationBtnContainer}
            >
              <AiOutlineMail />
              <button>Resend verification</button>
            </div>
          )}
          <div className={loginStyles.column}>
            <FormInput
              label="Email"
              name={form.email.name}
              value={form.email.value}
              error={form.email.error}
              type={form.email.type}
              updateForm={updateForm}
              togglePasswordType={togglePasswordType}
            />
          </div>
          <div className={loginStyles.column}>
            <FormInput
              label="Password"
              name={form.password.name}
              value={form.password.value}
              error={form.password.error}
              type={form.password.type}
              updateForm={updateForm}
              togglePasswordType={togglePasswordType}
            />
          </div>
          <div className={loginStyles.btnContainer}>
            <button>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
