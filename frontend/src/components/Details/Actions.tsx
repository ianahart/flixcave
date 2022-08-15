import {
  AiOutlineUnorderedList,
  AiFillHeart,
  AiFillEye,
  AiOutlineHeart,
} from 'react-icons/ai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineRateReview } from 'react-icons/md';
import actionStyles from '../../styles/details/Actions.module.scss';
import Action from './Action';
import { useAppSelector } from '../../app/hooks';
import AddToList from './AddToList';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';

interface IActionProps {
  type: string;
  id: number;
  name: string;
  backdropPath: string;
  favorited: boolean;
  updateFavorite: (favorited: boolean) => void;
}

const Actions = ({
  favorited,
  type,
  id,
  name,
  backdropPath,
  updateFavorite,
}: IActionProps) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.value);
  const [modalOpen, setModalOpen] = useState(false);
  const [listError, setListError] = useState('');

  const handleModalOpen = (isModalOpen: boolean) => {
    setModalOpen(isModalOpen);
  };

  const handleAddFavorite = async () => {
    try {
      redirectIfNotLoggedIn();
      await http.post('/favorites/', {
        resource_id: id,
        type,
        user_id: user.id,
        backdrop_path: `https://image.tmdb.org/t/p/original${backdropPath}`,
        name,
      });
      updateFavorite(true);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const handleUnFavorite = async () => {
    try {
      redirectIfNotLoggedIn();
      await http.delete(`/favorites/${id}`);
      updateFavorite(false);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const redirectIfNotLoggedIn = () => {
    if (!user.logged_in) {
      navigate('/login');
    }
  };

  const handleAddToList = async (listTitle: string) => {
    try {
      redirectIfNotLoggedIn();
      if (listTitle.trim().length === 0) return;
      setListError('');
      await http.post('/lists/', {
        resource_id: id,
        type,
        title: listTitle,
        user_id: user.id,
        backdrop_path: `https://image.tmdb.org/t/p/original${backdropPath}`,
        name,
      });
      handleModalOpen(false);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        if (err.response.status === 400) {
          setListError(err.response.data.title);
        }
      }
    }
  };

  const handleAddWatchList = async () => {
    try {
      redirectIfNotLoggedIn();
      const response = await http.post('/watchlists/', {
        resource_id: id,
        type,
        user_id: user.id,
        backdrop_path: `https://image.tmdb.org/t/p/original${backdropPath}`,
        name,
      });

      console.log(response);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  return (
    <div className={actionStyles.container}>
      <div onClick={() => handleModalOpen(true)}>
        <Action Icon={AiOutlineUnorderedList} toolTip="Add to a list" />
        {modalOpen && (
          <div className={actionStyles.modal}>
            <AddToList
              handleModalOpen={handleModalOpen}
              handleAddToList={handleAddToList}
              listError={listError}
              name={name}
            />
          </div>
        )}
      </div>
      {favorited ? (
        <div onClick={handleUnFavorite}>
          <Action Icon={AiFillHeart} toolTip="Unfavorite" />
        </div>
      ) : (
        <div onClick={handleAddFavorite}>
          <Action Icon={AiOutlineHeart} toolTip="Add to favorites" />
        </div>
      )}
      <div onClick={handleAddWatchList}>
        <Action Icon={AiFillEye} toolTip="Add to watchlist" />
      </div>
      <Action Icon={MdOutlineRateReview} toolTip="Write a review" />
    </div>
  );
};

export default Actions;
