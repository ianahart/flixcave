import WatchListStyles from '../../styles/watchlist/WatchList.module.scss';
import { AxiosError } from 'axios';
import { useState, MouseEvent, ChangeEvent } from 'react';
import Jumbotron from '../../components/Mixed/Jumbotron';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { IGetWatchlistResponse, IWatchListItem } from '../../interfaces';
import WatchListItem from '../../components/WatchList/WatchListItem';
import { AiOutlineClose } from 'react-icons/ai';

const WatchList = () => {
  const [hasNext, setHasNext] = useState(false);
  const [watchlist, setWatchlist] = useState<IWatchListItem[]>([]);
  const [page, setPage] = useState(1);
  const [modalId, setModalId] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [note, setNote] = useState('');
  const fetchWatchlist = async (endpoint: string) => {
    try {
      const response = await http.get<IGetWatchlistResponse>(endpoint);
      setPage(response.data.page);
      setWatchlist((prevState) => [...prevState, ...response.data.watchlist_items]);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchWatchlist('/watchlists/?page=0');
  });

  const removeFromWatchlist = async (id: number) => {
    try {
      const filteredWatchlist = [...watchlist].filter((item) => item.resource_id !== id);
      setWatchlist(filteredWatchlist);

      await http.delete(`/watchlists/${id}/`);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const openModal = (id: number, existingNote: string) => {
    setModalOpen(true);
    setModalId(id);
    setNote(existingNote === null ? '' : existingNote);
  };

  const closeModal = () => {
    setModalId(0);
    setModalOpen(false);
    setNote('');
  };

  const cancelAddNoteForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    closeModal();
  };

  const updateNotes = (note: string) => {
    const updatedWatchlist = watchlist.map((item) => {
      if (item.id === modalId) {
        item.note = note;
      }
      return item;
    });

    setWatchlist(updatedWatchlist);
  };

  const handleUpdateNotes = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      if (note.length > 400) return;
      const response = await http.patch(`/watchlists/${modalId}/`, {
        note,
      });

      updateNotes(response.data.result.note);

      closeModal();
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  const handleNoteChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };

  return (
    <div className={WatchListStyles.container}>
      {modalOpen && (
        <div className={WatchListStyles.modal}>
          <div className={WatchListStyles.addNoteContainer}>
            <div onClick={closeModal} className={WatchListStyles.addNoteClose}>
              <AiOutlineClose />
            </div>
            <div className={WatchListStyles.addNoteHeader}>
              <h2>Notes</h2>
            </div>
            <div className={WatchListStyles.addNoteBox}>
              <textarea value={note} onChange={handleNoteChange}></textarea>
            </div>
            <div className={WatchListStyles.addNoteBtnContainer}>
              <button onClick={handleUpdateNotes}>Update notes</button>
              <button onClick={cancelAddNoteForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Jumbotron />
      <div className={WatchListStyles.listContainer}>
        {watchlist.map((item) => {
          return (
            <WatchListItem
              openModal={openModal}
              removeFromWatchlist={removeFromWatchlist}
              key={item.id}
              item={item}
            />
          );
        })}
      </div>
      {hasNext && (
        <div className={WatchListStyles.loadMore}>
          <button onClick={() => fetchWatchlist(`/watchlists/?page=${page}`)}>
            See more...
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchList;
