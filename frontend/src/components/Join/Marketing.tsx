import marketingStyles from '../../styles/join/Marketing.module.scss';
import MarketingItem from './MarketingItem';
export default function Marketing() {
  return (
    <div className={marketingStyles.container}>
      <div className={marketingStyles.header}>
        <h3>What you receive as a member</h3>
      </div>
      <MarketingItem label="Make a personal watchlist" />
      <MarketingItem label="Discuss movies and tv shows with other people" />
      <MarketingItem label="Add movies and shows to our database" />
      <MarketingItem label="Review movies and shows" />
      <MarketingItem label="Keep track of the movie and shows you've watched" />
      <MarketingItem label="Get recommendations by watching" />
    </div>
  );
}
