import { MouseEvent, useState } from 'react';
import filterBoxStyles from '../../styles/links/movies/FilterBox.module.scss';
import { BiChevronDown, BiChevronRight } from 'react-icons/bi';
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from '@chakra-ui/react';

interface IFilterBoxProps {
  handleFilter: (runTimeRange: number[], voteRange: number[]) => void;
  runTimeRange: number[];
  voteRange: number[];
  handleSetRunTime: (runTimeRange: number[]) => void;
  handleSetVoteRange: (voteRange: number[]) => void;
}
const FilterBox = ({
  handleFilter,
  runTimeRange,
  voteRange,
  handleSetRunTime,
  handleSetVoteRange,
}: IFilterBoxProps) => {
  const [sortOpen, setSortOpen] = useState(false);

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleFilter(runTimeRange, voteRange);
  };

  return (
    <div className={filterBoxStyles.container}>
      <div
        style={{ minHeight: sortOpen ? '600px' : '50px' }}
        className={filterBoxStyles.header}
      >
        <div
          onClick={() => setSortOpen((prevState) => !prevState)}
          className={filterBoxStyles.title}
        >
          <h3>Filter</h3>
          {sortOpen ? <BiChevronDown /> : <BiChevronRight />}
        </div>
        {sortOpen && (
          <div>
            <div className={filterBoxStyles.rangeContainer}>
              <h4>Runtime</h4>
              <p>
                {runTimeRange[0]}min - {runTimeRange[1]}min
              </p>
              <RangeSlider
                aria-label={['min', 'max']}
                defaultValue={[60, 360]}
                onChangeEnd={(val) => handleSetRunTime(val)}
                min={60}
                max={360}
                step={30}
              >
                <RangeSliderTrack bg="teal.100">
                  <RangeSliderFilledTrack bg="teal" />
                </RangeSliderTrack>
                <RangeSliderThumb boxSize={6} index={0} />
                <RangeSliderThumb boxSize={6} index={1} />
              </RangeSlider>
            </div>

            <div>
              <div className={filterBoxStyles.rangeContainer}>
                <h4>User Vote</h4>
                <p>
                  {voteRange[0]} - {voteRange[1]}
                </p>
                <RangeSlider
                  aria-label={['min', 'max']}
                  defaultValue={[1, 10]}
                  onChangeEnd={(val) => handleSetVoteRange(val)}
                  min={1}
                  max={10}
                  step={1}
                >
                  <RangeSliderTrack bg="teal.100">
                    <RangeSliderFilledTrack bg="teal" />
                  </RangeSliderTrack>
                  <RangeSliderThumb boxSize={6} index={0} />
                  <RangeSliderThumb boxSize={6} index={1} />
                </RangeSlider>
              </div>
            </div>
          </div>
        )}
        {sortOpen && (
          <div className={filterBoxStyles.searchBtn}>
            <button onClick={handleOnClick}>Search</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBox;
