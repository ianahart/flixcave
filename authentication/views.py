from typing import Any, Dict
from django.core.exceptions import BadRequest
from rest_framework.exceptions import AuthenticationFailed, NotAuthenticated, NotFound, ParseError
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from authentication.serializers import LoginSerializer, LogoutSerializer, RegisterSerializer
from account.models import CustomUser
from verification_token.models import VerificationToken
from verification_token.serializers import VerificationTokenSerializer
from account.serializers import UserSerializer


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:

            serializer = LogoutSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            CustomUser.objects.logout_user(serializer.validated_data)

            return Response({
                'message': 'success',
            }, status=status.HTTP_200_OK)

        except ParseError as e:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)


class ResendVerifyAPIView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        try:

            user = CustomUser.objects.all().filter(
                email=request.data['email']).first()

            if user is None:
                raise BadRequest
            token = VerificationToken.objects.create(user)

            CustomUser.objects.send_verification_email(token=token, user=user)

            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)
        except BadRequest as e:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)


class VerifyAccountAPIView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        try:

            serializer = VerificationTokenSerializer(data=request.data)

            serializer.is_valid(raise_exception=True)

            CustomUser.objects.verify_account(serializer.validated_data)

            VerificationToken.objects.delete_verify_tokens(
                serializer.validated_data)

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


class TokenObtainPairView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        try:
            login_serializer = LoginSerializer(data=request.data)
            login_serializer.is_valid(raise_exception=True)
            result = CustomUser.objects.login_user(
                login_serializer.validated_data)
            if result['type'] == 'error':
                match result['status_code']:
                    case '404':
                        raise NotFound(detail=result['msg'],
                                       code=result['status_code'])
                    case '401':
                        raise NotAuthenticated(detail=result['msg'],
                                               code=result['status_code']
                                               )
                    case _:
                        raise ParseError

            user_serializer = UserSerializer(result['user'])
            return Response({
                'message': 'success',
                'tokens': result['tokens'],
                'user': user_serializer.data,
            }, status=status.HTTP_200_OK)
        except (ParseError, NotFound, NotAuthenticated, ) as e:
            return Response({
                'errors': str(e)}, status=e.status_code)
