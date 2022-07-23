from rest_framework import serializers
from verification_token.models import VerificationToken


class VerificationTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationToken
        fields = ('token', )
