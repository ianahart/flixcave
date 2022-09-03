from django.db.models import ObjectDoesNotExist
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ParseError

from list.models import List, ListItem
from .serializers import CreateListSerializer, ListSerializer, ListItemSerializer, CreatePopulateListSerializer, PopulateSerializer
from account.permissions import AccountPermission


class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, pk: int):
        try:
            list_item = ListItem.objects.get(pk=pk)
            if list_item is None:
                raise ObjectDoesNotExist
            self.check_object_permissions(request, list_item.user)
            list_item.delete()

            return Response({

            }, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({
                'errors': {},
            }, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk: int):
        try:

            list = List.objects.get(pk=pk)
            if list is None:
                raise ObjectDoesNotExist

            self.check_object_permissions(request, list.user)

            results = List.objects.get_list(
                pk, request.query_params['page'])

            serializer = ListItemSerializer(results['list_items'], many=True)

            return Response({
                'message': 'success',
                'has_next': results['has_next'],
                'list_items': serializer.data,
                'page': results['page'],
            }, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)


class PopulateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:

            create_serializer = CreatePopulateListSerializer(data=request.data)
            create_serializer.is_valid(raise_exception=True)
            lists = List.objects.populate(
                create_serializer.validated_data, request.user.id)
            serializer = PopulateSerializer(lists, many=True)
            return Response({
                'message': 'success',
                'results': serializer.data,
            }, status=status.HTTP_200_OK)
        except ParseError:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)


class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            lists = List.objects.all_lists(request.user.id)
            serializer = ListSerializer(lists, many=True)
            return Response({
                'message': 'success',
                'lists': serializer.data,
            }, status=status.HTTP_200_OK)
        except NotFound:
            return Response({
                'errors': {},
            }, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        try:
            serializer = CreateListSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            list = List.objects.create(serializer.validated_data)

            ListItem.objects.create(list.id, serializer.validated_data)

            return Response({
                'message': 'success',
            }, status=status.HTTP_200_OK)
        except ParseError:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)
