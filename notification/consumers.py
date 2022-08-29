import json
from typing import Union
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError
from account.models import CustomUser
from notification.models import Comment, Notification
from notification.serializers import CommentSerializer, CreateCommentSerializer, NotificationSerializer
# pyright: reportOptionalMemberAccess=false


class Consumer(AsyncWebsocketConsumer):

    def notifications(self, page: int, user_id: int):
        data = Notification.objects.fetch_notifications(page, user_id)

        objects = NotificationSerializer(data['notifications'], many=True)

        return {
            'page': data['page'],
            'has_next': data['has_next'],
            'notifications': objects.data,
        }

    def save_comment(self, data: dict[str, Union[str, int]]):
        serializer = CreateCommentSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        return Comment.objects.create(serializer.validated_data)

    def save_notification(self, comment: 'Comment'):
        notification = Notification.objects.create(comment, self.room_name)
        serializer = NotificationSerializer(notification)

        return serializer.data

    async def connect(self):
        print('*********CONNECTED**********')
        self.room_name = self.scope['url_route']['kwargs']['user_id']
        self.room_group_name = 'chat_%s' % self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        print('*********DISCONNECTED**********')
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        comment = await database_sync_to_async(self.save_comment)(text_data_json)
        notification = await database_sync_to_async(self.save_notification)(comment)

        notifications = await database_sync_to_async(self.notifications)(0, str(text_data_json['user']))
        # fetch notifications
        # LEFT OFF HERE
        print(notifications)

        comment.readable_date = comment.created_at.strftime('%m/%d/%Y')
        comment_serializer = CommentSerializer(comment)

        sender_group_name = 'chat_' + self.room_name
        receiver_group_name = 'chat_' + str(text_data_json['user'])

        notification['comment_id'] = comment_serializer.data['id']
        await self.channel_layer.group_send(
            receiver_group_name,
            {
                'type': 'notification',
                'message': notifications,
            }
        )

        await self.channel_layer.group_send(
            sender_group_name,
            {
                'type': 'comment',
                'message': comment_serializer.data
            }
        )

    async def comment(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'comment': message
        }))

    async def notification(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'notification': message
        }))
