import { MouseEvent } from 'react';
import { ISubNavListItem } from '../../interfaces/index';
import mobileNavListItemStyles from '../../styles/navbar/MobileNavListItem.module.scss';

interface IMobileNavListItemProps {
  label: string;
  subListItems: ISubNavListItem[];
  closeOnLink: (e: MouseEvent<HTMLLIElement>) => void;
}

export default function MobileNavListItem({
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
            <li onClick={closeOnLink} key={subListItem.id}>
              {subListItem.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
