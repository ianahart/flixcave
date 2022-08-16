import WatchListStyles from '../../styles/watchlist/WatchList.module.scss';
import { IWatchListItem } from '../../interfaces';
import { Link as RouterLink } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { useState } from 'react';

interface IWatchListItemProps {
  item: IWatchListItem;
  removeFromWatchlist: (id: number) => void;
  openModal: (id: number, existingNote: string) => void;
}

const WatchListItem = ({ item, removeFromWatchlist, openModal }: IWatchListItemProps) => {
  const [view, setView] = useState('main');

  const showNotes = () => setView('notes');
  const goBack = () => setView('main');

  return (
    <div className={WatchListStyles.listItem} key={item.id}>
      <RouterLink to={`/${item.type}/${item.resource_id}`}>
        {view === 'main' ? (
          <div className={WatchListStyles.content}>
            <img src={item.backdrop_path} alt={item.title} />
            <h3>{item.title}</h3>
          </div>
        ) : (
          <p>{item.note}</p>
        )}
      </RouterLink>
      <div className={WatchListStyles.btnContainer}>
        {view === 'main' ? (
          <p className={WatchListStyles.watchListActions} onClick={showNotes}>
            Notes &raquo;
          </p>
        ) : (
          <p className={WatchListStyles.watchListActions} onClick={goBack}>
            &laquo; Back
          </p>
        )}
        <button onClick={() => removeFromWatchlist(item.resource_id)}>Delete</button>
      </div>
      <div
        onClick={() => openModal(item.id, item.note)}
        className={WatchListStyles.editBtn}
      >
        <AiOutlineEdit />
      </div>
    </div>
  );
};

export default WatchListItem;
