import { useState } from 'react';
import { ISubNavListItem } from '../../interfaces';
import navListItemStyles from '../../styles/navbar/NavListItem.module.scss';

interface INavListItemProps {
  label: string;
  subListItems: ISubNavListItem[];
}

export default function NavListItem({ label, subListItems }: INavListItemProps) {
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const handleOnMouseEnter = () => {
    setSubMenuOpen(true);
  };

  const handleOnMouseLeave = () => {
    setSubMenuOpen(false);
  };

  return (
    <li
      className={navListItemStyles.listItem}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      <p>{label}</p>
      {subMenuOpen && (
        <div className={navListItemStyles.subMenu}>
          <ul>
            {subListItems?.map((subListItem) => {
              return <li key={subListItem.id}>{subListItem.text}</li>;
            })}
          </ul>
        </div>
      )}
    </li>
  );
}
