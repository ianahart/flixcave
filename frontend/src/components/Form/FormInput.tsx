import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { ChangeEvent } from 'react';
import formInputStyles from '../../styles/forms/FormInput.module.scss';

interface IFormInputProps {
  label: string;
  name: string;
  value: string;
  error: string;
  type: string;
  placeholder?: string;
  updateForm: (name: string, value: string, type: string) => void;
  togglePasswordType: (type: string) => void;
}

export default function FormInput({
  label,
  name,
  value,
  error,
  type,
  placeholder,
  updateForm,
  togglePasswordType,
}: IFormInputProps) {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateForm(name, value, 'value');
  };

  const handleOnFocus = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    updateForm(name, '', 'error');
  };

  const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.trim().length === 0 || value.trim().length > 200) {
      const error = `${label} must be between 1 and 200 characters.`;
      updateForm(name, error, 'error');
    }
  };

  return (
    <div className={formInputStyles.container}>
      <div className={formInputStyles.formGroup}>
        <label>{label}:</label>
        <div className={formInputStyles.inputContainer}>
          <input
            onChange={handleOnChange}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            name={name}
            placeholder={placeholder}
            value={value}
            type={type}
          />
          {name === 'password' && (
            <div className={formInputStyles.passwordIconContainer}>
              {type === 'text' ? (
                <div onClick={() => togglePasswordType('password')}>
                  <AiOutlineEyeInvisible />
                </div>
              ) : (
                <div onClick={() => togglePasswordType('text')}>
                  <AiOutlineEye />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
}
