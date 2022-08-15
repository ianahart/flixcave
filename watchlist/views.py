from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ParseError

from account.permissions import AccountPermission
from watchlist.models import WatchList
from watchlist.serializers import CreateWatchListSerializer, WatchListSerializer


class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, id: int):
        try:

            favorite = WatchList.objects.find_watchlist_item(
                id, request.user.id)

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
            results = WatchList.objects.get_watch_list_items(
                request.user.id, request.query_params['page'])
            serializer = WatchListSerializer(
                results['watch_list_items'], many=True)

            return Response({
                'message': 'success',
                'page': results['page'],
                'has_next': results['has_next'],
                'watchlist_items': serializer.data,
            }, status=status.HTTP_200_OK)

        except NotFound:
            return Response({
                'errors': 'You do not have any items in your watchlist.'
            }, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        try:
            serializer = CreateWatchListSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            WatchList.objects.create(serializer.validated_data)
            return Response({
                'message': 'success',
            }, status=status.HTTP_200_OK)
        except ParseError:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)
