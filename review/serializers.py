from rest_framework import serializers

from review.models import Review
from account.serializers import MinUserSerializer


class ReviewSerializer(serializers.ModelSerializer):
    user = MinUserSerializer()

    class Meta:
        model = Review
        fields = ('resource_id',
                  'backdrop_path',
                  'id',
                  'name',
                  'body',
                  'user',
                  'rating'
                  )


class CreateReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('resource_id',
                  'backdrop_path',
                  'name',
                  'body',
                  'user',
                  'rating',
                  )

    def validate_rating(self, rating: str):
        if rating == 0:
            raise serializers.ValidationError(
                'Please give this review a rating.')
        return rating
