import { Select } from '@chakra-ui/react';
import sortBoxStyles from '../../styles/links/movies/SortBox.module.scss';
import { BiChevronDown, BiChevronRight } from 'react-icons/bi';
import { ChangeEvent, useState } from 'react';

interface ISortBoxProps {
  filterLink: string;
  handleSort: (sort: string, link: string) => void;
  resetPage: () => void;
  resetResources: () => void;
}

const SortBox = ({
  filterLink,
  handleSort,
  resetPage,
  resetResources,
}: ISortBoxProps) => {
  const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    resetPage();
    resetResources();
  };

  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('');
  return (
    <div className={sortBoxStyles.container}>
      <div className={sortBoxStyles.content}>
        <div
          onClick={() => setSortOpen((prevState) => !prevState)}
          className={sortBoxStyles.header}
        >
          <h3>Sort</h3>
          {sortOpen ? <BiChevronDown /> : <BiChevronRight />}
        </div>
        {sortOpen && (
          <div className={sortBoxStyles.select}>
            <Select value={sortBy} onChange={handleOnChange} placeholder="Select a sort">
              <option value="original_title.asc">Title(A-Z) ascending</option>
              <option value="original_title.desc">Title(Z-A) descending</option>
              <option value="popularity.asc">Popularity ascending</option>
              <option value="popularity.desc">Popularity descending</option>
              <option value="vote_average.asc">Rating ascending</option>
              <option value="vote_average.desc">Rating descending</option>
            </Select>
          </div>
        )}
      </div>
      {sortBy.length > 0 && (
        <div className={sortBoxStyles.searchBtn}>
          <button onClick={() => handleSort(sortBy, filterLink)}>Search</button>
        </div>
      )}
    </div>
  );
};

export default SortBox;
