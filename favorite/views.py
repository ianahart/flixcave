from django.core.exceptions import BadRequest, ObjectDoesNotExist
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ParseError
from account.permissions import AccountPermission
from favorite.models import Favorite
from favorite.serializers import FavoriteSerializer


class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, id: int):
        try:

            favorite = Favorite.objects.find_favorite(id, request.user.id)

            self.check_object_permissions(request, favorite.user)

            favorite.delete()

            return Response({
            }, status=status.HTTP_204_NO_CONTENT)

        except ParseError:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)


class ListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:

            results = Favorite.objects.all_favorites(
                request.user.id, request.query_params['page'])
            serializer = FavoriteSerializer(results['favorites'], many=True)

            return Response({
                'message': 'success',
                'page': results['page'],
                'has_next': results['has_next'],
                'favorites': serializer.data,
            }, status=status.HTTP_200_OK)

        except NotFound:
            return Response({
                'errors': 'You do not have any favorites.'
            }, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        try:

            Favorite.objects.create(request.data)
            return Response({
                'message': 'success',
            }, status=status.HTTP_200_OK)
        except ParseError:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)
