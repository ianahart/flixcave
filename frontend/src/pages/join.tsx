import joinStyles from '../styles/join/Join.module.scss';
import Marketing from '../components/Join/Marketing';
import Form from '../components/Join/Form';

export default function join() {
  return (
    <div className={joinStyles.container}>
      <div className={joinStyles.row}>
        <Marketing />
        <Form />
      </div>
    </div>
  );
}
