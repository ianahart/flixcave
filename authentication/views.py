from typing import Any, Dict
from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from authentication.serializers import RegisterSerializer
from account.models import CustomUser
from verification_token.models import VerificationToken
from verification_token.serializers import VerificationTokenSerializer


class VerifyAccountAPIView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        try:

            serializer = VerificationTokenSerializer(data=request.data)

            serializer.is_valid(raise_exception=True)

            CustomUser.objects.verify_account(serializer.validated_data)

            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)

        except BadRequest:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)


class RegisterAPIView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data: Dict[str, Any] = serializer.validated_data
            user = CustomUser.objects.create(
                data.pop('email'), data.pop('password'), **data)

            token = VerificationToken.objects.create(user)

            CustomUser.objects.send_verification_email(token=token, user=user)

            return Response({
                'message': 'success',
            }, status=status.HTTP_200_OK)
        except BadRequest as e:
            return Response({
                            'errors': 'Something went wrong.'
                            }, status=status.HTTP_400_BAD_REQUEST)
