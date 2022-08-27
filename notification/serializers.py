from rest_framework import serializers
from account.serializers import MinUserSerializer

from notification.models import Comment, Notification
from review.serializers import ReviewSerializer


class CommentSerializer(serializers.ModelSerializer):
    readable_date = serializers.CharField()
    user = MinUserSerializer()

    class Meta:
        model = Comment
        fields = ('readable_date', 'text', 'user', 'id', )


class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('text', 'review', 'user', )


class NotificationSerializer(serializers.ModelSerializer):
    readable_date = serializers.CharField()
    backdrop_path = serializers.CharField()
    user = MinUserSerializer()

    class Meta:
        model = Notification
        fields = ('text', 'user', 'readable_date', 'id', 'backdrop_path', )
