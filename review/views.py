from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ParseError

from account.permissions import AccountPermission
from review.serializers import CreateReviewSerializer, ReviewSerializer
from review.models import Review


class ListAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        try:

            page, direction = request.query_params.values()
            results = Review.objects.fetch_reviews(
                old_page=page, direction=direction)

            if results:
                serializer = ReviewSerializer(results['reviews'], many=True)
                return Response({
                    'message': 'success',
                    'reviews': serializer.data,
                    'page': results['page'],
                    'has_next': results['has_next'],
                }, status=status.HTTP_200_OK)

        except NotFound:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)


class CreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:

            serializer = CreateReviewSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            exists = Review.objects.create(serializer.validated_data)

            if exists is not None:
                return Response({
                    'error': exists['error']
                }, status=status.HTTP_409_CONFLICT)

            return Response({
                'message': 'success',
            }, status=status.HTTP_200_OK)
        except ParseError:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)
