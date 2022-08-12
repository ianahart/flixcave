import { ChangeEvent, useState, MouseEvent, useCallback, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { debounce } from 'lodash';
import addToListStyles from '../../styles/details/AddToList.module.scss';
import { Axios, AxiosError } from 'axios';
import { http } from '../../helpers/utils';
import { IPopulateList, IPopulateListResponse } from '../../interfaces';

interface IAddToListProps {
  listError: string;
  name: string;
  handleAddToList: (listTitle: string) => void;
  handleModalOpen: (modalOpen: boolean) => void;
}

const AddToList = ({
  listError,
  name,
  handleAddToList,
  handleModalOpen,
}: IAddToListProps) => {
  const [input, setInput] = useState('');
  const [listNames, setListNames] = useState<IPopulateList[]>([]);

  const [populateBox, setPopulateBox] = useState(false);
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    debouncedSearch(e.target.value);
    if (!populateBox) {
      setPopulateBox(true);
    }
    if (e.target.value.trim().length === 0) {
      setPopulateBox(false);
    }
  };

  useEffect(() => {
    if (listNames.length === 0) {
      setPopulateBox(false);
    }
  }, [listNames.length]);

  const closeModal = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleModalOpen(false);
  };

  const debouncedSearch = useCallback(
    debounce((value) => populateInput(value), 200),
    []
  );

  const populateInput = async (value: string) => {
    try {
      const response = await http.post<IPopulateListResponse>('/lists/populate/', {
        title: value,
        name,
      });
      setListNames(response.data.results);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setListNames([]);
      }
    }
  };

  const updateInput = (newInput: string) => {
    setPopulateBox(false);
    setInput(newInput);
  };

  return (
    <div className={addToListStyles.container}>
      <div className={addToListStyles.trim}>
        <div onClick={closeModal}>
          <AiOutlineClose />
        </div>
      </div>
      <header className={addToListStyles.header}>
        <h3>Add to a list</h3>
      </header>
      <div className={addToListStyles.formGroup}>
        {listError && <p className={addToListStyles.error}>{listError}</p>}
        <label htmlFor="list">Name of list:</label>
        <input
          onChange={handleOnChange}
          id="list"
          type="text"
          value={input}
          placeholder="List name..."
          autoComplete="off"
        />
        {populateBox && listNames.length > 0 && (
          <div className={addToListStyles.populateBox}>
            {listNames.map((listName) => {
              return (
                <p
                  onClick={() => updateInput(listName.name)}
                  className={addToListStyles.listName}
                  key={listName.id}
                >
                  {listName.name}
                </p>
              );
            })}
          </div>
        )}
      </div>
      <div className={addToListStyles.btnContainer}>
        <button onClick={() => handleAddToList(input)}>Add List</button>
      </div>
    </div>
  );
};

export default AddToList;
