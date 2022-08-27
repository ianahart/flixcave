from typing import Union
from django.core.paginator import Paginator
from django.db import models
from django.db.utils import DatabaseError
from django.utils import timezone
import logging
logger = logging.getLogger('django')
# pyright: reportGeneralTypeIssues=false


class NotificationManager(models.Manager):
    def create(self, comment, user_id: int):
        try:
            text = None
            if int(user_id) == comment.user.id:
                text = f'You commented on your review of {comment.review.name}'
            else:
                text = f'{comment.user.first_name} {comment.user.last_name} commented on your review of {comment.review.name}.'
            notification = self.model(
                text=text,
                user=comment.user,
                comment=comment,
            )
            notification.save()
            notification.refresh_from_db()

            notification.backdrop_path = notification.comment.review.backdrop_path
            notification.readable_date = notification.created_at.strftime(
                '%m/%d/%Y')

            return notification
        except DatabaseError:
            logger.error('Unable to create notification for a comment.')

    def fetch_notifications(self, page: int, user_id: int):
        objects = Notification.objects.order_by('-id').filter(user_id=user_id)

        notifications_count = objects.count()

        paginator = Paginator(objects, 3)
        cur_page = int(page) + 1

        page = paginator.page(cur_page)

        page.object_list
        notifications = []

        for object in page.object_list:
            object.readable_date = object.created_at.strftime('%m/%d/%Y')
            object.backdrop_path = object.comment.review.backdrop_path
            notifications.append(object)
        return {
            'page': cur_page,
            'has_next': page.has_next(),
            'notifications_count': notifications_count,
            'notifications': notifications}


class CommentManager(models.Manager):

    def fetch_comments(self, review: int, prev_page: int):
        try:
            objects = Comment.objects.order_by('-id').filter(review_id=review)

            paginator = Paginator(objects, 3)
            cur_page = int(prev_page) + 1

            page = paginator.page(cur_page)

            page.object_list
            comments = []

            for object in page.object_list:
                object.readable_date = object.created_at.strftime('%m/%d/%Y')

                comments.append(object)
            return {
                'page': cur_page,
                'has_next': page.has_next(),
                'comments': comments}

        except DatabaseError:
            logger.error(f'Unable to retreive comments for review {review}')

    def create(self, data: dict[str, Union[str, int]]):
        try:
            text, review, user = data.values()

            comment = self.model(
                review=review,
                text=text,
                user=user
            )
            comment.save()
            comment.refresh_from_db()

            return comment
        except DatabaseError:
            logger.error('Unable to create a comment for a review.')


class Comment(models.Model):

    objects: CommentManager = CommentManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    text = models.CharField(max_length=200)
    edited = models.BooleanField(default=False)  # type:ignore
    review = models.ForeignKey(
        'review.Review',
        on_delete=models.CASCADE,
        related_name='review_comments'
    )
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_comments'
    )


class Notification(models.Model):

    objects: NotificationManager = NotificationManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    text = models.CharField(max_length=200, blank=True, null=True)
    comment = models.ForeignKey(
        'notification.Comment',
        on_delete=models.CASCADE,
        related_name='comment_notification'
    )
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_notifications'
    )
