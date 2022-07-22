import { AiOutlineCheck } from 'react-icons/ai';
import marketingItemStyles from '../../styles/join/MarketingItem.module.scss';

interface IMarketingItemProps {
  label: string;
}

export default function MarketingItem({ label }: IMarketingItemProps) {
  return (
    <div className={marketingItemStyles.container}>
      <AiOutlineCheck />
      <p>{label}</p>
    </div>
  );
}
