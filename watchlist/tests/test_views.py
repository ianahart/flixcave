# pyright: reportGeneralTypeIssues=false
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from model_bakery.recipe import Recipe, foreign_key
from account.models import CustomUser
from watchlist.models import WatchList


class CreateWatchListItemTestCase(TestCase):

    def it_creates_a_watchlist_item(self):
        user = CustomUser.objects.create('johnsmith@gmail.com', 'Password123')
        tokens = RefreshToken.for_user(user)
        access_token = str(tokens.access_token)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        data = {
            'user': user.id,
            'title': 'some title',
            'type': 'movie',
            'note': 'some note',
            'backdrop_path': 'backdrop_path',
            'resource_id': 1,
        }
        response = client.post('/api/v1/watchlists/', data)

        assert response.status_code == 200
        new_item = WatchList.objects.all().filter(user_id=user.id).first()

        self.assertIsnotNone(new_item)


class GetsAUsersWatchList(TestCase):
    def setUp(self):
        user = Recipe(
            CustomUser,
            email='johnsmith@gmail.com',
            password='Password123'
        )

        self.watchlist = Recipe(
            WatchList,
            note='I am a note',
            user=foreign_key(user),
        ).make(_quantity=3)

    def test_it_gets_all_a_users_watchlist_contents(self):
        tokens = RefreshToken.for_user(self.watchlist[0].user)
        access_token = str(tokens.access_token)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.get('/api/v1/watchlists/?page=0')

        assert response.status_code == 200
        self.assertEquals(len(response.data['watchlist_items']), 2)


class DetailsTestCase(TestCase):

    def setUp(self):
        user = Recipe(
            CustomUser,
            email='johnsmith@gmail.com',
            password='Password123'
        )

        self.watchlist = Recipe(
            WatchList,
            note='I am a note',
            user=foreign_key(user),
            resource_id=1
        ).make()

    def test_it_deletes_from_watchlist(self):
        tokens = RefreshToken.for_user(self.watchlist.user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.delete(

            '/api/v1/watchlists/' + str(self.watchlist.resource_id) + '/')

        assert response.status_code == 204

    def test_it_updates_a_note_on_a_watchlist(self):
        tokens = RefreshToken.for_user(self.watchlist.user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        data = {
            'note': 'I am an updated note'
        }
        response = client.patch(
            '/api/v1/watchlists/' + str(self.watchlist.id) + '/', data)

        assert response.status_code == 200
        note = WatchList.objects.get(pk=self.watchlist.id)
        self.assertEquals('I am an updated note', note.note)
