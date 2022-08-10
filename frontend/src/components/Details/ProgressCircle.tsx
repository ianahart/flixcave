import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export interface IProgressCircle {
  value: number;
  text: string;
}

const ProgressCircle = ({ value, text }: IProgressCircle) => {
  return (
    <div style={{ color: 'green', width: '75px', height: '75px' }}>
      <CircularProgressbar background={true} value={value} text={text} />
    </div>
  );
};

export default ProgressCircle;
