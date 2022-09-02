from django.test import TestCase
from ..models import Favorite
from model_bakery import baker


class FavoriteTestCase(TestCase):
    def setUp(self):
        user = baker.make('account.CustomUser')
        data = {
            'type': 'movie',
            'title': 'iron man',
            'backdrop_path': 'https://image.tmdb.org/t/p/original/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg',
            'resource_id': '150',
            'user_id': user.id,

        }
        Favorite.objects.create(data)
        self.favorite = Favorite.objects.get(pk=1)

    def test_it_has_information_fields(self):
        self.assertIsInstance(self.favorite.type, str)
        self.assertIsInstance(self.favorite.title, str)
        self.assertIsInstance(self.favorite.backdrop_path, str)
        self.assertIsInstance(self.favorite.resource_id, int)
        self.assertIsInstance(self.favorite.user.id, int)
