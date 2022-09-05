# pyright: reportGeneralTypeIssues=false
from rest_framework.test import APIClient
from django.test import TestCase
from model_bakery.recipe import Recipe, foreign_key
from model_bakery import baker
from rest_framework_simplejwt.tokens import RefreshToken
from account.models import CustomUser
from notification.models import Comment, Notification
from review.models import Review


class GetAllCommentsTestCase(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            'johnsmith@gmail.com', 'Password123')
        review = Recipe(Review,
                        user=self.user,
                        body='I am a review body'
                        )
        self.comments = Recipe(
            Comment,
            user=self.user,
            text="I am comment text",
            review=foreign_key(review)
        ).make(_quantity=3)

    def test_it_gets_all_comments_for_a_review(self):
        tokens = RefreshToken.for_user(self.user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.get(
            '/api/v1/comments/?page=0&review=' + str(self.comments[0].review.id))

        assert response.status_code == 200
        self.assertEquals(len(response.data['comments']), 3)


class DeleteCommentTestCase(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create(
            'johnsmith@gmail.com', 'Password123')
        review = Recipe(Review,
                        user=self.user,
                        body='I am a review body'
                        )
        self.comment = Recipe(
            Comment,
            user=self.user,
            text="I am comment text",
            review=foreign_key(review)
        ).make()

    def test_it_deletes_a_comment(self):
        tokens = RefreshToken.for_user(self.user)
        access_token = str(tokens.access_token)
        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.delete(
            '/api/v1/comments/' + str(self.comment.id) + '/')
        assert response.status_code == 200
        self.assertEquals(Comment.objects.all().count(), 0)

    def test_it_deletes_a_comment_error(self):
        tokens = RefreshToken.for_user(self.user)
        access_token = str(tokens.access_token)
        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = client.delete(
            '/api/v1/comments/' + '1337' + '/')

        assert response.status_code == 404
        self.assertRaises(Comment.DoesNotExist)


class GetAllNotificationsTestCase(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            'johnsmith@gmail.com', 'Password123')

        text = [
            'I am a notification 1',
            'I am a notification 2',
            'I am a notification 3',
            'I am a notification 4',
            'I am a notification 5',
            'I am a notification 6',
        ]
        for i in range(6):
            baker.make(Notification,
                       user=self.user,
                       text=text[i]
                       )

    def test_it_gets_all_notifications_for_a_user_with_pagination(self):
        tokens = RefreshToken.for_user(self.user)
        access_token = str(tokens.access_token)

        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        page = 0
        counter = 0
        while counter < 2:
            response = client.get('/api/v1/notifications/?page=' + str(page))
            self.assertEquals(
                response.data['notifications_count'], Notification.objects.all().count())
            self.assertEquals(len(response.data['notifications']), 3)
            counter += 1
            page += 1


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
