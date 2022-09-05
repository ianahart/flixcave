from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from model_bakery.recipe import Recipe, foreign_key
from account.models import CustomUser
from review.models import Review


class GetAllReviewsTestCase(TestCase):

    def setUp(self):
        user = Recipe(
            CustomUser,
            email='johnsmith@gmail.com',
            password='Password123',
        )

        Recipe(
            Review,
            user=foreign_key(user)
        ).make(_quantity=3)

    def test_it_gets_all_reviews(self):
        user = CustomUser.objects.filter(id=2).first()
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get('/api/v1/reviews/list/?page=0&direction=next')
        assert response.status_code == 200

        self.assertEquals(len(response.data['reviews']), 2)


class CreateReviewTestCase(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create(
            'johnsmith@gmail.com', 'Password123')

    def test_it_creates_a_review(self):
        tokens = RefreshToken.for_user(self.user)
        access_token = str(tokens.access_token)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        data = {

            'user': self.user.id,
            'backdrop_path': 'backdrop_path',
            'resource_id': 1,
            'name': 'Iron Man',
            'body': 'This is a review body',
            'rating': 4,
        }
        response = client.post('/api/v1/reviews/', data)
        assert response.status_code == 200
        self.assertEquals(Review.objects.all().count(), 1)
