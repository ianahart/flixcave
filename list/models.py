import logging
from typing import Union

from django.core.paginator import Paginator
from account.models import CustomUser
from core import settings
from django.db import models, DatabaseError
from django.utils import timezone
from datetime import datetime, timedelta, date
logger = logging.getLogger('django')


class ListManager(models.Manager):

    def get_list(self, id: int, page: int):
        list = List.objects.get(pk=id)

        p = Paginator(list.list_list_items.all(), 2)
        next_page = int(page) + 1
        cur_page = p.page(next_page)
        list_items = cur_page.object_list

        return {'page': next_page, 'has_next': cur_page.has_next(), 'list_items': list_items}

    def all_lists(self, user_id: int):
        lists = List.objects.all().order_by('name').filter(user_id=user_id)
        return lists

    def populate(self, data: dict[str, str], user_id: int):
        exclude_lists = []
        name, title = data.values()
        results = List.objects.all().filter(name__icontains=title).filter(user_id=user_id)
        list_item = ListItem.objects.filter(title=name).first()
        if list_item is not None:
            for result in results:
                for item in result.list_list_items.all():
                    if item.title == list_item.title:
                        exclude_lists.append(result.name)

        lists = [list for list in results if list.name not in exclude_lists]

        return lists

    def create(self, data: dict[str, Union[str, int]]):

        exists = List.objects.all().filter(
            name=data['title']).filter(
            user_id=data['user_id']).first()
        if exists is not None:
            return exists

        list = self.model(name=data['title'], user_id=data['user_id'])
        list.save()

        list.refresh_from_db()

        return list


class ListItemManager(models.Manager):
    def create(self, list_id: int, data: dict[str, Union[str, int]]):
        exists = ListItem.objects.all().filter(
            title=data['name']
        ).filter(
            list_id=list_id
        ).filter(
            user_id=data['user_id']
        ).first()

        if exists is not None:
            return

        list_item = self.model(
            title=data['name'],
            backdrop_path=data['backdrop_path'],
            user_id=data['user_id'],
            list_id=list_id,
        )

        list_item.save()


class ListItem(models.Model):

    objects: ListItemManager = ListItemManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=200)
    backdrop_path = models.CharField(max_length=200)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_list_items'
    )
    list = models.ForeignKey(
        'list.List',
        on_delete=models.CASCADE,
        related_name='list_list_items'
    )


class List(models.Model):

    objects: ListManager = ListManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    name = models.CharField(max_length=200)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_list'
    )
