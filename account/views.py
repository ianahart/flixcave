from django.shortcuts import render

from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.exceptions import NotAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from account.models import CustomUser
from account.serializers import UserSerializer


class RetreiveUserAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            user = CustomUser.objects.refresh_user(
                request.headers['Authorization'])

            serializer = UserSerializer(user)
            return Response({
                'message': 'success',
                'user': serializer.data,
            }, status=status.HTTP_200_OK)
        except NotAuthenticated as e:
            return Response({
                            'errors': 'Something went wrong.'
                            }, status=status.HTTP_401_UNAUTHORIZED)
