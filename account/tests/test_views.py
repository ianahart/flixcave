from django.test import TestCase
from rest_framework.test import APIClient
from account.models import CustomUser


class LoginUserTest(TestCase):
    def setUp(self):
        self.credentials = {
            'email': 'johnsmith@gmail.com',
            'password': 'Password123'
        }

    def test_login_active(self):

        client = APIClient()

        extra_fields = {'is_active': True,
                        'first_name': 'john',
                        'last_name': 'smith',
                        }

        CustomUser.objects.create(email=self.credentials['email'],
                                  password=self.credentials['password'],
                                  **extra_fields)

        response = client.post('/api/v1/auth/login/',
                               self.credentials, format='json')

        self.assertEquals(response.data['user']
                          ['email'], self.credentials['email'])
        assert response.status_code == 200

    def test_login_unactive(self):

        client = APIClient()

        extra_fields = {'is_active': False}

        CustomUser.objects.create(email=self.credentials['email'],
                                  password=self.credentials['password'],
                                  **extra_fields)

        response = client.post('/api/v1/auth/login/',
                               self.credentials, format='json')

        assert response.status_code == 401
        self.assertEquals(response.data['errors'],
                          'Please verify your account by clicking the link in the verification email we sent you.')

    def test_login_invalid_credentials(self):

        client = APIClient()

        extra_fields = {'is_active': True}

        CustomUser.objects.create(email=self.credentials['email'],
                                  password=self.credentials['password'],
                                  **extra_fields)

        response = client.post('/api/v1/auth/login/',
                               {'email': self.credentials['email'],
                                   'password': 'Password321'}, format='json')

        assert response.status_code == 401
        self.assertEquals(response.data['errors'], 'Invalid credentials')

    def test_login_user_does_not_exist(self):

        client = APIClient()
        response = client.post('/api/v1/auth/login/',
                               {'email': 'janedoe@gmail.com',
                                   'password': 'Password321'}, format='json')
        assert response.status_code == 404

    def test_register_user(self):

        client = APIClient()
        response = client.post('/api/v1/auth/register/', {
            'email': self.credentials['email'],
            'password': self.credentials['password'],
            'confirm_password': self.credentials['password'],
        }, format='json')

        new_user = CustomUser.objects.all().filter(
            email=self.credentials['email']
        ).first()
        self.assertIsNotNone(new_user)
        assert response.status_code == 200
