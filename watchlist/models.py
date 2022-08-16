from django.core.paginator import Paginator
from django.db import models
from django.utils import timezone
from typing import Union


class WatchListManager(models.Manager):

    def update(self, id: int, data: dict[str, str]):
        watchlist = WatchList.objects.get(pk=id)

        watchlist.note = data['note']

        watchlist.save()
        watchlist.refresh_from_db()

        return watchlist

    def create(self, data: dict[str, Union[str, int]]):
        watch_list = self.model(
            title=data['name'],
            backdrop_path=data['backdrop_path'],
            user_id=data['user_id'],
            type=data['type'],
            resource_id=data['resource_id'],
        )

        watch_list.save()

    def find_watchlist_item(self, resource_id: int, user_id: int):
        return WatchList.objects.all().filter(
            resource_id=resource_id).filter(user_id=user_id).first()

    def get_watch_list_items(self, user_id: int, page: int):
        objects = WatchList.objects.all().order_by('id').filter(user_id=user_id)
        p = Paginator(objects, 2)
        next_page = int(page) + 1
        cur_page = p.page(next_page)
        watch_list_items = cur_page.object_list

        return {
            'page': next_page,
            'has_next': cur_page.has_next(),
            'watch_list_items': watch_list_items
        }


class WatchList(models.Model):

    objects: WatchListManager = WatchListManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    note = models.TextField(max_length=400, blank=True, null=True)
    type = models.CharField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=200)
    backdrop_path = models.CharField(max_length=200)
    resource_id = models.IntegerField(blank=True, null=True)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_watchlist'
    )
