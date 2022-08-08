import { useParams } from 'react-router-dom';

const MovieDetails = () => {
  const params = useParams();
  console.log(params.id);

  return <div>sdfsd</div>;
};

export default MovieDetails;
