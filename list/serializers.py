from rest_framework import serializers

from list.models import List, ListItem


class ListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListItem
        fields = ('id', 'title', 'backdrop_path', 'type', 'resource_id', )


class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('id', 'name', 'user_id', )


class PopulateSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('id', 'name', )


class CreatePopulateListSerializer(serializers.Serializer):
    name = serializers.CharField()
    title = serializers.CharField()

    class Meta:
        model = List
        fields = ('name', 'title', )


class CreateListSerializer(serializers.Serializer):
    name = serializers.CharField()
    title = serializers.CharField()
    user_id = serializers.IntegerField()
    backdrop_path = serializers.CharField()
    type = serializers.CharField()
    resource_id = serializers.CharField()

    class Meta:
        model = List
        fields = ('title', 'user_id', 'backdrop_path', 'name', 'type', 'resource_id', )

    def validate_title(self, title: str):
        if len(title) == 0:
            raise serializers.ValidationError('Please provide a list title.')
        return title
