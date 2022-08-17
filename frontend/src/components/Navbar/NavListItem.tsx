import { useState } from 'react';
import { ISubNavListItem } from '../../interfaces';
import navListItemStyles from '../../styles/navbar/NavListItem.module.scss';
import { Link as RouterLink } from 'react-router-dom';

interface INavListItemProps {
  label: string;
  link: string;
  subListItems: ISubNavListItem[];
}

export default function NavListItem({ label, link, subListItems }: INavListItemProps) {
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
              return (
                <RouterLink key={subListItem.id} to={`/${link}${subListItem.link}`}>
                  <li>{subListItem.text}</li>
                </RouterLink>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
}
