from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ParseError

from list.models import List, ListItem
from .serializers import CreateListSerializer, CreatePopulateListSerializer, PopulateSerializer
from account.models import CustomUser


class PopulateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:

            create_serializer = CreatePopulateListSerializer(data=request.data)
            create_serializer.is_valid(raise_exception=True)
            lists = List.objects.populate(create_serializer.validated_data, request.user.id)
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

    def post(self, request):
        try:
            print(request.data)
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
