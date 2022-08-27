from django.contrib import admin

from notification.models import Comment, Notification

admin.site.register(Comment)
admin.site.register(Notification)
