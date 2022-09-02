from django.test import TestCase
from model_bakery.recipe import Recipe, foreign_key
from model_bakery import baker
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import NotFound

from account.models import CustomUser
from favorite.models import Favorite


class GetFavoritesTestCase(TestCase):
    def setUp(self):

        self.user = Recipe(CustomUser,
                           first_name='john',
                           last_name='smith',
                           email='johnsmith@gmailcom',
                           password='Password123'
                           )

        self.favorites = Recipe(
            'favorite.Favorite',
            user=foreign_key(self.user)
        ).make(_quantity=3)

    def test_it_retrieves_a_users_favorites(self):
        tokens = RefreshToken.for_user(self.favorites[0].user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.get('/api/v1/favorites/?page=0')

        assert response.status_code == 200
        self.assertEquals(len(response.data['favorites']), 2)


class CreateFavoriteTestCase(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            'johnsmith@gmail.com', 'Password123')

    def test_it_creates_a_favorite_error(self):
        tokens = RefreshToken.for_user(self.user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        body = {
            'resource_id': 1,
            'type': 'movie',
            'user_id': 1,
            'backdrop_path': 'backdrop_path',
            'title': ''
        }
        response = client.post('/api/v1/favorites/', body)
        assert response.status_code == 400

    def test_it_creates_a_favorite(self):
        tokens = RefreshToken.for_user(self.user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        body = {
            'resource_id': 1,
            'type': 'movie',
            'user_id': self.user.id,
            'backdrop_path': 'backdrop_path',
            'title': 'Iron Man'
        }
        response = client.post('/api/v1/favorites/', body)

        assert response.status_code == 200
        self.assertEquals(Favorite.objects.all().count(), 1)


class DeleteFavoriteTestCase(TestCase):

    def setUp(self):
        user = Recipe(CustomUser,
                      first_name='john',
                      last_name='smith',
                      email='johnsmith@gmailcom',
                      password='Password123'
                      )

        self.favorite = Recipe(
            'favorite.Favorite',
            title='Iron Man',
            type='movie',
            id=1,
            resource_id=1,
            user=foreign_key(user)
        ).make()

    def test_it_deletes_a_favorite(self):

        tokens = RefreshToken.for_user(self.favorite.user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.delete(
            '/api/v1/favorites/' + str(self.favorite.resource_id))

        assert response.status_code == 204

        deleted_favorite = Favorite.objects.all().filter(
            id=self.favorite.id).first()

        self.assertIsNone(deleted_favorite)

    def test_it_deletes_a_favorite_error(self):
        tokens = RefreshToken.for_user(self.favorite.user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.delete(
            '/api/v1/favorites/' + '3443')

        assert response.status_code == 404
        self.assertRaises(NotFound)
