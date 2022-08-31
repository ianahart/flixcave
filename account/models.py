import jwt
import logging
from typing import Union

from rest_framework.exceptions import ParseError
from core import settings
from django.core.mail import EmailMessage
from rest_framework_simplejwt.exceptions import TokenBackendError, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from django.template.loader import render_to_string
from django.contrib.auth import hashers
from django.db import models, DatabaseError
from rest_framework_simplejwt.backends import TokenBackend
from django.contrib.auth.models import BaseUserManager, AbstractUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime, timedelta, date

logger = logging.getLogger('django')


class CustomUserManager(BaseUserManager):

    def logout_user(self, data: dict[str, Union[str, int]]):
        pk, refresh_token = data.values()

        user = CustomUser.objects.get(pk=pk)
        user.logged_in = False
        user.save()

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            logger.error('Trouble blacklisting token from logging out.')

    def refresh_user(self, token: str) -> Union['CustomUser', None]:

        decoded_token = None
        try:
            decoded_token = TokenBackend(
                algorithm='HS256'
            ).decode(
                token.split('Bearer ')[1], verify=False
            )
        except TokenBackendError:
            logger.error('Unable to decode token to refresh user.')
        if decoded_token is not None:
            user = CustomUser.objects.get(pk=decoded_token['user_id'])
            setattr(user, 'member_since', user.created_at.strftime('%B %Y'))

            return user

    def verify_account(self, data: dict[str, str]):
        decoded_token = None
        try:
            decoded_token = TokenBackend(
                algorithm='HS256'
            ).decode(data['token'], verify=False)
        except TokenBackendError:
            logger.error('Invalid or malformed token.')
            raise ParseError
        if decoded_token is not None:
            user = CustomUser.objects.get(pk=decoded_token['user_id'])
            user.is_active = True
            user.save()

    def send_verification_email(self, token: str, user: 'CustomUser'):
        ctx = {'token': token, 'email': user.email}
        message = render_to_string('verification-email.html', ctx)

        mail = EmailMessage(
            subject=user.email,
            body=message,
            from_email=settings.EMAIL_SENDER,
            to=[user.email]
        )

        mail.content_subtype = 'html'
        mail.send()

    def login_user(self, data: dict[str, str]):
        email, password = data.values()

        user = CustomUser.objects.all().filter(email=email).first()
        if user is None:
            return {'type': 'error',
                    'msg': 'A user with this email does not exist.',
                    'status_code': '404',
                    }

        if not hashers.check_password(password, user.password):
            return {'type': 'error',
                    'msg': 'Invalid credentials',
                    'status_code': '401',
                    }

        if hashers.check_password(password, user.password) and not user.is_active:
            return {'type': 'error',
                    'msg': 'Please verify your account by clicking the link in the verification email we sent you.',
                    'status_code': '401',
                    }

        user.logged_in = True
        user.save()
        user.refresh_from_db()
        setattr(user, 'member_since', user.created_at.strftime('%B %Y'))

        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token
        access_token.set_exp(lifetime=timedelta(days=3))

        tokens = {
            'access_token': str(access_token),
            'refresh_token': str(refresh_token)
        }

        return {'type': 'ok', 'tokens': tokens, 'user': user}

    def create(self, email: str, password: str, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        extra_fields = {key: val for key, val in extra_fields.items() if key !=
                        'confirm_password'}
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, password=password, **extra_fields)
        user.set_password(password)
        user.save()
        user.refresh_from_db()
        return user

    def create_superuser(self, email: str, password: str, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create(email, password, **extra_fields)


class CustomUser(AbstractUser, PermissionsMixin):
    username = None
    logged_in = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    name = models.CharField(unique=True, max_length=200, blank=True, null=True)
    first_name = models.CharField(max_length=200, blank=True, null=True)
    last_name = models.CharField(max_length=200, blank=True, null=True)
    email = models.EmailField(_(
        'email address'),
        unique=True,
        blank=True,
        null=True,
        error_messages={'unique':
                        'A user with this email already exists.'
                        }
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects: CustomUserManager = CustomUserManager()

    def __str__(self):
        return f"{self.email}"

    @property
    def initials(self):
        return str(self.first_name)[0:1] + str(self.last_name)[0:1]
