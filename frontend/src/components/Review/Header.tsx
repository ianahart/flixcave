import { useState } from 'react';
import headerStyles from '../../styles/review/Header.module.scss';

interface IHeaderProps {
  id: number;
  name: string;
  backdropPath: string;
}

const Header = ({ id, name, backdropPath }: IHeaderProps) => {
  const [overlay, setOverlay] = useState(true);

  const handleOnMouseEnter = () => {
    if (overlay) {
      setOverlay(false);
    }
  };

  const handleOnMouseLeave = () => {
    if (!overlay) {
      setOverlay(true);
    }
  };

  return (
    <div onMouseLeave={handleOnMouseLeave} className={headerStyles.title}>
      <img src={`https://image.tmdb.org/t/p/w500${backdropPath}`} alt={name} />
      {overlay && (
        <div onMouseEnter={handleOnMouseEnter} className={headerStyles.overlay}>
          <header className={headerStyles.header}>
            <h1>Review for {name}</h1>
          </header>
        </div>
      )}
    </div>
  );
};

export default Header;
