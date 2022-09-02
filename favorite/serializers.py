from rest_framework import serializers

from favorite.models import Favorite


class CreateFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = (
            'title', 'resource_id', 'type',
            'user_id', 'backdrop_path'
        )


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ('id', 'type', 'resource_id',
                  'backdrop_path', 'title', 'user_id', )
