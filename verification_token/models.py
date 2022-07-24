from django.db import models
from django.utils import timezone
from rest_framework_simplejwt.backends import TokenBackend
from rest_framework_simplejwt.tokens import RefreshToken
from account.models import CustomUser


class VerificationTokenManager(models.Manager):

    def delete_verify_tokens(self, data: dict[str, str]):
        decoded_token = TokenBackend(
            algorithm='HS256'
        ).decode(data['token'], verify=False)

        tokens = VerificationToken.objects.all().filter(
            user_id=decoded_token['user_id'])

        for token in tokens:
            token.delete()

    def create(self, user: 'CustomUser') -> str:
        token = str(RefreshToken.for_user(user))
        instance = self.model(
            user=user,
            token=token,
            type='verify'
        )

        instance.save()
        instance.refresh_from_db()

        verification_token = instance.token

        return verification_token


class VerificationToken(models.Model):

    objects: VerificationTokenManager = VerificationTokenManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    type = models.CharField(max_length=100, blank=True, null=True)
    token = models.TextField(max_length=400, blank=True, null=True)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_tokens'
    )
