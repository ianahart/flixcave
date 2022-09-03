# pyright: reportGeneralTypeIssues=false
from django.db.models import ObjectDoesNotExist
from django.test import TestCase
from model_bakery.recipe import Recipe, foreign_key
from model_bakery import baker
from rest_framework.exceptions import ParseError
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from account.models import CustomUser
from list.models import List, ListItem


class GetAllListsTestCase(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create(
            'johnsmith@gmail.com', 'Password123')

        list_names = ['action packed', 'chill', 'fantasy']
        for i in range(3):
            List.objects.create({
                'user_id': self.user.id,
                'title': list_names[i]
            })

    def test_it_gets_all_a_users_lists(self):

        tokens = RefreshToken.for_user(self.user)
        access_token = str(tokens.access_token)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.get('/api/v1/lists/')

        self.assertEquals(len(response.data['lists']), 3)
        assert response.status_code == 200


class PopulateListTestCase(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create(
            email='johnsmith@gmail.com',
            password='Password123',
        )

        self.list = List.objects.create(
            {'user_id': self.user.id, 'title': 'action packed'})

        self.list_items = []
        for i in range(3):
            self.list_items.append(ListItem.objects.create(self.list.id,
                                                           {'user_id': self.user.id,
                                                            'name': 'some title',
                                                            'resource_id': 10,
                                                               'backdrop_path': 'backdrop_path',
                                                               'type': 'movie'
                                                            }))

    def test_it_populates_list_if_list_item_not_in_it_error(self):
        tokens = RefreshToken.for_user(self.user)
        access_token = str(tokens.access_token)

        ListItem.objects.create(self.list.id,
                                {'user_id': self.user.id,
                                 'name': 'DC League of Super-Pets',
                                 'resource_id': 10,
                                 'backdrop_path': 'backdrop_path',
                                 'type': 'movie'
                                 })

        data = {'title': '', 'name': 'DC League of Super-Pets'}

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)

        response = client.post('/api/v1/lists/populate/', data)

        assert response.status_code == 400
        self.assertRaises(ParseError)

    def test_it_populates_list_if_list_item_not_in_it(self):

        tokens = RefreshToken.for_user(self.user)
        access_token = str(tokens.access_token)

        data = {'title': 'action', 'name': 'DC League of Super-Pets'}

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)

        response = client.post('/api/v1/lists/populate/', data)

        self.assertEquals(response.data['results'][0]['name'], 'action packed')
        assert response.status_code == 200


class CreateListTestCase(TestCase):
    def test_it_creates_a_list_error(self):

        user = baker.make(CustomUser)

        data = {
            'resource_id': 1,
            'type': 'movie',
            'title': 'Iron Man',
            'user_id': '',
            'backdrop_path': 'backdrop_path',
            'name': 'action packed'
        }

        tokens = RefreshToken.for_user(user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.post('/api/v1/lists/', data)

        assert response.status_code == 400
        self.assertRaises(ParseError)



    def test_it_creates_a_list(self):

        user = baker.make(CustomUser)

        data = {
            'resource_id': 1,
            'type': 'movie',
            'title': 'Iron Man',
            'user_id': user.id,
            'backdrop_path': 'backdrop_path',
            'name': 'action packed'
        }

        tokens = RefreshToken.for_user(user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.post('/api/v1/lists/', data)

        self.assertEquals(len(user.user_list_items.all()), 1)
        self.assertEquals(len(user.user_list.all()), 1)
        assert response.status_code == 200


class GetListTestCase(TestCase):
    def setUp(self):
        self.user = Recipe(
            CustomUser,
            email='johnsmith@gmail.com',
            password='Password123',
            first_name='john',
            last_name='smith',
        )

        self.list = Recipe(List, id=1, user=foreign_key(self.user)).make()

        baker.make(
            ListItem,
            list_id=self.list.id,
            _quantity=3
        )

    def test_it_gets_a_list_of_items_error(self):
        tokens = RefreshToken.for_user(self.list.user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.get(
            '/api/v1/lists/' + str(1337) + '/?page=0')

        assert response.status_code == 404
        self.assertRaises(ObjectDoesNotExist)

    def test_it_gets_a_list_of_items(self):
        tokens = RefreshToken.for_user(self.list.user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.get(
            '/api/v1/lists/' + str(self.list.id) + '/?page=0')
        self.assertEquals(len(response.data['list_items']), 2)
        assert response.status_code == 200


class DeleteFromListTestCase(TestCase):

    def setUp(self):
        self.user = Recipe(
            CustomUser,
            email='johnsmith@gmail.com',
            password='Password123',
            first_name='john',
            last_name='smith',
        )

        self.list = Recipe(
            List,
            name='action packed'
        )

        self.list_item = Recipe(
            ListItem,
            user=foreign_key(self.user),
            list=foreign_key(self.list)
        ).make()

    def test_it_deletes_item_from_list_error(self):
        tokens = RefreshToken.for_user(self.list_item.user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.delete(
            '/api/v1/lists/' + str(1337) + '/')

        assert response.status_code == 404
        self.assertRaises(ObjectDoesNotExist)

    def test_it_deletes_item_from_list(self):
        tokens = RefreshToken.for_user(self.list_item.user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.delete(
            '/api/v1/lists/' + str(self.list_item.pk) + '/')

        is_deleted = ListItem.objects.all().filter(pk=self.list_item.pk).first()
        self.assertIsNone(is_deleted)

        assert response.status_code == 200
