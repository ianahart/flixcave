# pyright: reportGeneralTypeIssues=false
from rest_framework.test import APIClient
from django.test import TestCase
from model_bakery.recipe import Recipe, foreign_key
from model_bakery import baker
from rest_framework_simplejwt.tokens import RefreshToken
from account.models import CustomUser
from notification.models import Comment, Notification


class DeleteNotificationTestCase(TestCase):
    def setUp(self):

        user = Recipe(
            CustomUser,
            email='johnsmith@gmail.com',
            password='Password123'
        )

        comment = Recipe(
            Comment,
            text='Im a comment',
        )

        self.notification = Recipe(
            Notification,
            text='Im a notification',
            user=foreign_key(user),
            comment=foreign_key(comment)
        ).make()

    def test_it_deletes_a_notification_error(self):
        tokens = RefreshToken.for_user(self.notification.user)
        access_token = str(tokens.access_token)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        client.delete(
            '/api/v1/notifications/1337/')
        self.assertRaises(Notification.DoesNotExist)

    def test_it_deletes_a_notification(self):
        tokens = RefreshToken.for_user(self.notification.user)
        access_token = str(tokens.access_token)

        user_two = CustomUser.objects.create(
            'janedoe@gmail.com', 'Password123')

        second_notification = baker.make(Notification, user=user_two)

        notifications = Notification.objects.all()

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.delete(
            '/api/v1/notifications/' + str(self.notification.id) + '/')

        notifications = Notification.objects.all()
        assert response.status_code == 200
        self.assertEquals(len(notifications), 1)
        self.assertEquals(notifications.first().user.id,
                          second_notification.user.id)
