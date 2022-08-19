import { MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ISubNavListItem } from '../../interfaces/index';
import mobileNavListItemStyles from '../../styles/navbar/MobileNavListItem.module.scss';

interface IMobileNavListItemProps {
  label: string;
  link: string;
  subListItems: ISubNavListItem[];
  closeOnLink: (e: MouseEvent<HTMLLIElement>) => void;
}

export default function MobileNavListItem({
  link,
  label,
  subListItems,
  closeOnLink,
}: IMobileNavListItemProps) {
  return (
    <div className={mobileNavListItemStyles.container}>
      <h4>{label}</h4>
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
  );
}
