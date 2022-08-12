import { useState } from 'react';
import actionStyles from '../../styles/details/Actions.module.scss';

interface IActionProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  toolTip: string;
}

const Action = ({ Icon, toolTip }: IActionProps) => {
  const [hovered, setHovered] = useState(false);

  const handleOnMouseEnter = () => setHovered(true);
  const handleOnMouseLeave = () => setHovered(false);

  return (
    <div className={actionStyles.actionContainer}>
      <div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
        <Icon />
      </div>
      {hovered && (
        <div className={actionStyles.actionToolTip}>
          <p>{toolTip}</p>
        </div>
      )}
    </div>
  );
};

export default Action;
