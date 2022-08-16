from rest_framework import serializers

from watchlist.models import WatchList


class WatchListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchList
        fields = ('id', 'title', 'backdrop_path',
                  'type', 'resource_id', 'note', )


class UpdateWatchListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchList
        fields = ('note', )


    def validate_note(self, value):
        if len(value) > 400:
            raise serializers.ValidationError('Note cannot exceed 400 characters.')

        return value


class CreateWatchListSerializer(serializers.Serializer):
    name = serializers.CharField()
    user_id = serializers.IntegerField()
    backdrop_path = serializers.CharField()
    type = serializers.CharField()
    resource_id = serializers.CharField()

    class Meta:
        model = WatchList
        fields = ('user_id', 'backdrop_path',
                  'name', 'type', 'resource_id', )
