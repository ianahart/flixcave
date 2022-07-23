import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import formStyles from '../../styles/join/Form.module.scss';
import FormInput from '../Form/FormInput';
import { joinState } from '../../data/initialState';
import { IJoinForm } from '../../interfaces';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';
import spinner from '../../images/spinner.svg';

export default function Form() {
  const [form, setForm] = useState<IJoinForm>(joinState);
  const [loaded, setLoaded] = useState(true);
  const navigate = useNavigate();

  const applyErrors = <T,>(errors: T) => {
    for (const [key, val] of Object.entries(errors)) {
      updateForm(key, val[0], 'error');
    }
  };

  const checkForErrors = (): boolean => {
    let errors = false;
    for (const [_, val] of Object.entries(form)) {
      if (val.error) {
        errors = true;
      }
    }
    return errors;
  };

  const createAccount = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (checkForErrors()) return;
      setLoaded(false);
      const response = await http.post('/auth/register/', {
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        email: form.email.value,
        password: form.password.value,
        confirm_password: form.confirm_password.value,
        is_active: false,
      });
      setLoaded(true);
      navigate('/login');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setLoaded(true);
        applyErrors(err.response.data);
      }
    }
  };

  const goHome = () => {
    navigate('/');
  };

  const togglePasswordType = (type: string) => {
    if (type === 'text') {
      updateForm('password', 'text', 'type');
      updateForm('confirm_password', 'text', 'type');
      return;
    }
    updateForm('password', 'password', 'type');
    updateForm('confirm_password', 'password', 'type');
  };

  const updateForm = (name: string, value: string, type: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof IJoinForm], [type]: value },
    }));
  };

  return (
    <div className={formStyles.container}>
      <header>
        <h1>Sign up for an account</h1>
        <p>Signing up for an account is easy. Fill out the form below to get started.</p>
      </header>
      <form onSubmit={createAccount}>
        <div className={formStyles.inputRow}>
          <div className={formStyles.inputRowItem}>
            <FormInput
              label="First Name"
              name={form.first_name.name}
              value={form.first_name.value}
              error={form.first_name.error}
              type={form.first_name.type}
              updateForm={updateForm}
              togglePasswordType={togglePasswordType}
            />
          </div>
          <div className={formStyles.inputRowItem}>
            <FormInput
              label="Last Name"
              name={form.last_name.name}
              value={form.last_name.value}
              error={form.last_name.error}
              type={form.last_name.type}
              updateForm={updateForm}
              togglePasswordType={togglePasswordType}
            />
          </div>
        </div>
        <div className={formStyles.inputColumn}>
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

        <div className={formStyles.inputColumn}>
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

        <div className={formStyles.inputColumn}>
          <FormInput
            label="Confirm Password"
            name={form.confirm_password.name}
            value={form.confirm_password.value}
            error={form.confirm_password.error}
            type={form.confirm_password.type}
            updateForm={updateForm}
            togglePasswordType={togglePasswordType}
          />
        </div>

        {!loaded ? (
          <div className={formStyles.spinnerContainer}>
            <img src={spinner} alt="spinner" />
            <p>Creating account...</p>
          </div>
        ) : (
          <div className={formStyles.btnContainer}>
            <button type="submit">Join</button>
            <p onClick={goHome} role="button">
              Cancel
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
