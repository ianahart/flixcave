from django.test import TestCase
from ..models import CustomUser


class CreateUserTestCase(TestCase):
    """Test module for registering a user"""

    def test_create_user(self):
        extra_fields = {
            'first_name': 'john',
            'last_name': 'smith',
            'confirm_password': 'Password123',
            'is_active': False,
        }
        CustomUser.objects.create(
            email='johnsmith@gmail.com',
            password='Password123',
            **extra_fields
        )

        user = CustomUser.objects.all().filter(
            email='johnsmith@gmail.com').first()
        self.assertIsNotNone(user)
