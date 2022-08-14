import { AiOutlineUnorderedList, AiFillHeart, AiFillEye } from 'react-icons/ai';
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
}

const Actions = ({ type, id, name, backdropPath }: IActionProps) => {
  const user = useAppSelector((state) => state.user.value);
  const [modalOpen, setModalOpen] = useState(false);
  const [listError, setListError] = useState('');

  const handleModalOpen = (isModalOpen: boolean) => {
    setModalOpen(isModalOpen);
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
      <Action Icon={AiFillHeart} toolTip="Add to favorites" />
      <Action Icon={AiFillEye} toolTip="Add to watchlist" />
      <Action Icon={MdOutlineRateReview} toolTip="Write a review" />
    </div>
  );
};

export default Actions;
