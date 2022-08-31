from datetime import timedelta
import logging
from django.test import TestCase
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import CustomUser
logger = logging.getLogger('django')


class UserTestCase(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            first_name='john',
            last_name='smith',
            email='johnsmith@gmail.com',
            is_active=False,
            logged_in=False,
            password='Password123'
        )

    def test_it_has_information_fields(self):
        self.assertIsInstance(self.user.first_name, str)
        self.assertIsInstance(self.user.last_name, str)
        self.assertIsInstance(self.user.email, str)
        self.assertIsInstance(self.user.password, str)
        self.assertIsInstance(self.user.is_active, bool)
        self.assertIsInstance(self.user.logged_in, bool)

    def test_its_string_representation_is_its_email(self):
        self.assertEquals(str(self.user), self.user.email)

    def test_create_super_user(self):
        super_user = CustomUser.objects.create_superuser(
            'janedoe@gmail.com', 'Password123')
        super_user.refresh_from_db()

        self.assertEquals(CustomUser.objects.count(), 2)
        self.assertEquals(super_user.is_superuser, True)

    def test_it_errors_trying_logout_user(self):

        with self.assertLogs('django', level='ERROR') as cm:

            CustomUser.objects.logout_user(
                {'pk': self.user.id, 'refresh_token': 'abcasd'})
        self.assertIn(
            'ERROR:django:Trouble blacklisting token from logging out.', cm.output)

    def test_it_errors_trying_to_refresh_user(self):

        refresh_token = RefreshToken.for_user(self.user)
        access_token = refresh_token.access_token
        access_token.set_exp(lifetime=timedelta(minutes=0))

        with self.assertLogs('django', level='ERROR') as cm:

            CustomUser.objects.refresh_user(
                'Bearer ' + str('asdasd'))
            self.assertIn(
                'ERROR:django:Unable to decode token to refresh user.', cm.output)
