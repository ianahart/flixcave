from django.test import TestCase
from rest_framework.exceptions import NotAuthenticated
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from account.models import CustomUser


class TestRefreshUser(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create(
            email='johnsmith@aol.com',
            password='Password123'
        )

    def test_refresh_user_authenticated(self):
        refresh_token = RefreshToken.for_user(self.user)
        access_token = refresh_token.access_token
        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access_token))
        response = client.get('/api/v1/account/refresh/')

        self.assertEquals(self.user.email, response.data['user']['email'])
        assert response.status_code == 200

    def test_refresh_user_unauthenticated(self):

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + 'abc')
        response = client.get('/api/v1/account/refresh/')
        assert response.status_code == 401
        self.assertRaises(NotAuthenticated)
