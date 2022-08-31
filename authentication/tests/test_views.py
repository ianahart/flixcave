from django.core.exceptions import BadRequest
from django.test import TestCase
from rest_framework.exceptions import ParseError
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from account.models import CustomUser
from verification_token.models import VerificationToken


class VerifyAccountTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            email='johnsmith@gmail.com',
            password='Password123',
            is_active=False
        )

    def test_verify_account(self):
        verification_token = VerificationToken.objects.create(self.user)

        client = APIClient()
        response = client.post('/api/v1/auth/verify/',
                               {'token': verification_token}, format='json')

        assert response.status_code == 200
        db_verification_token = VerificationToken.objects.all().filter(
            token=verification_token).first()
        self.assertIsNone(db_verification_token)

        self.user.refresh_from_db()
        self.assertEquals(self.user.is_active, True)

    def test_verify_account_fail(self):
        VerificationToken.objects.create(self.user)

        client = APIClient()
        response = client.post('/api/v1/auth/verify/',
                               {'token': 123}, format='json')

        assert response.status_code == 400

        self.assertRaises(BadRequest)

    def test_resend_verify_account(self):

        client = APIClient()
        response = client.post('/api/v1/auth/resend-verify/',
                               {'email': 'johnsmith@gmail.com'})

        assert response.status_code == 200

    def test_resend_verify_account_fail(self):

        client = APIClient()
        response = client.post('/api/v1/auth/resend-verify/',
                               {'email': ''})

        assert response.status_code == 400


class LogoutUserTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            email='johnsmith@gmail.com',
            password='Password123',
            is_active=True,
            logged_in=True
        )

    def test_logout_authenticated_user(self):
        refresh_token = RefreshToken.for_user(self.user)
        access_token = refresh_token.access_token
        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access_token))
        response = client.post('/api/v1/auth/logout/', {
            'pk': self.user.id,
            'refresh_token': str(refresh_token)
        }, format='json')

        self.user.refresh_from_db()

        self.assertEquals(self.user.logged_in, False)
        assert response.status_code == 200

    def test_logout_unauthenticated_user(self):
        refresh_token = RefreshToken.for_user(self.user)
        access_token = refresh_token.access_token

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access_token))

        response = client.post('/api/v1/auth/logout/', {
            'pk': 'abcdef',
            'refresh_token': 324,
        }, format='json')

        assert response.status_code == 400
        self.assertRaises(ParseError)


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

    def test_login_wrong_data_types(self):

        client = APIClient()

        response = client.post('/api/v1/auth/login/',
                               {'email': self.credentials['email'],
                                   'password': ''}, format='json')

        assert response.status_code == 400

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


class RegisterUserTest(TestCase):

    def setUp(self):

        self.credentials = {
            'email': 'johnsmith@gmail.com',
            'password': 'Password123',
            'confirm_password': 'Password123',
        }

    def test_register_user_invalid_fields(self):

        client = APIClient()
        response = client.post('/api/v1/auth/register/', {
            'email': 'asdasdsadsdsadsdsasdasdsadsdsadsdsasdasdsadsdsadsdsasdasdsadsdsadsdsasdasdsadsdsadsdsasdasdsadsdsadsdsasdasdsadsdsadsdsasdasdsadsdsadsdsasdasdsadsdsadsdsasdasdsadsdsadsdsasdasdsadsdsadsds',
            'password': self.credentials['password'],
            'confirm_password': self.credentials['password'],
        }, format='json')

        assert response.status_code == 400

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
