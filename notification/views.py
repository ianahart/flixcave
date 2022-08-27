from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ParseError

from account.permissions import AccountPermission
from notification.models import Comment, Notification
from notification.serializers import CommentSerializer, NotificationSerializer


class NotificationsDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, pk=None):
        try:
            notification = Notification.objects.get(pk=pk)
            self.check_object_permissions(request, notification.user)
            notification.delete()
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        except ParseError:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)


class ListNotificationsAPIView(APIView):
    def get(self, request):
        try:

            result = Notification.objects.fetch_notifications(
                request.query_params['page'],
                request.user.id,
            )
            if result:

                serializer = NotificationSerializer(
                    result['notifications'], many=True)
                return Response({
                    'message': 'success',
                    'notifications': serializer.data,
                    'page': result['page'],
                    'has_next': result['has_next'],
                    'notifications_count': result['notifications_count']

                }, status=status.HTTP_200_OK)

        except NotFound:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)


class CommentDetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, pk=None):
        try:

            comment = Comment.objects.get(pk=pk)
            self.check_object_permissions(request, comment.user)
            comment.delete()
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        except ParseError:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)


class ListCommentsAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        try:
            result = Comment.objects.fetch_comments(
                request.query_params['review'],
                request.query_params['page']
            )

            if result:
                serializer = CommentSerializer(result['comments'], many=True)

                return Response({
                    'message': 'success',
                    'comments': serializer.data,
                    'page': result['page'],
                    'has_next': result['has_next']
                }, status=status.HTTP_200_OK)
        except NotFound:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)
