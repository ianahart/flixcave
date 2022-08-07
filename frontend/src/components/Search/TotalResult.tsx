import totalResultsStyles from '../../styles/search/TotalResults.module.scss';

interface ITotalResultProps {
  handleSetActive: (active: string) => void;
  label: string;
  count: number;
  active: string;
  parameter: string;
}

const TotalResult = ({
  handleSetActive,
  label,
  count,
  active,
  parameter,
}: ITotalResultProps) => {
  const toggleActive =
    active === parameter ? totalResultsStyles['active'] : totalResultsStyles['notActive'];

  return (
    <div
      onClick={() => handleSetActive(parameter)}
      className={` ${totalResultsStyles.totalResult} ${toggleActive}  `}
    >
      <p>{label}</p>
      <p>{count}</p>
    </div>
  );
};

export default TotalResult;
