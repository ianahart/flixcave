from django.test import TestCase
from ..models import CustomUser
from model_bakery import baker


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
