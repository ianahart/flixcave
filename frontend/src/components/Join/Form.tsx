import formStyles from '../../styles/join/Form.module.scss';

export default function Form() {
  return (
    <div className={formStyles.container}>
      <header>
        <h1>Sign up for an account</h1>
        <p>Signing up for an account is easy. Fill out the form below to get started.</p>
      </header>
      <div className={formStyles.inputRow}>
        <div className={formStyles.inputColumn}>
          <input type="text" />
        </div>
        <div className={formStyles.inputColumn}>
          <input type="text" />
        </div>
      </div>
    </div>
  );
}
