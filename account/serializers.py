from rest_framework import serializers

from account.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    initials = serializers.CharField()
    member_since = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ('logged_in',
                  'first_name',
                  'last_name',
                  'initials',
                  'email',
                  'id',
                  'member_since',
                  )
        extra_kwargs = {'password': {'write_only': True}}
