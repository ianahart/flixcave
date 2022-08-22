from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ParseError

from account.permissions import AccountPermission
from review.serializers import CreateReviewSerializer
from review.models import Review


class ListCreateAPIView(APIView):
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
