import {
  AiOutlineUnorderedList,
  AiFillHeart,
  AiFillEye,
  AiOutlineHeart,
} from 'react-icons/ai';
import { useState } from 'react';
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
  const user = useAppSelector((state) => state.user.value);
  const [modalOpen, setModalOpen] = useState(false);
  const [listError, setListError] = useState('');

  const handleModalOpen = (isModalOpen: boolean) => {
    setModalOpen(isModalOpen);
  };

  const handleAddFavorite = async () => {
    try {
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
        console.log(err.response);
      }
    }
  };

  const handleUnFavorite = async () => {
    try {
      await http.delete(`/favorites/${id}`);
      updateFavorite(false);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  const handleAddToList = async (listTitle: string) => {
    try {
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
      <Action Icon={AiFillEye} toolTip="Add to watchlist" />
      <Action Icon={MdOutlineRateReview} toolTip="Write a review" />
    </div>
  );
};

export default Actions;
