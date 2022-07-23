import { useEffectOnce } from '../hooks/UseEffectOnce';
import { useSearchParams } from 'react-router-dom';
import { http } from '../helpers/utils';
import { AxiosError } from 'axios';

export default function Login() {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('token'));

  const verifyEmail = async (token: string) => {
    try {
      const response = await http.post('/auth/verify/', { token });
      console.log(response);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    }
  });

  return <div>login</div>;
}
