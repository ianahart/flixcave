from django.core.paginator import Paginator
from django.db import models
from django.utils import timezone
from typing import Union


class FavoriteManager(models.Manager):

    def create(self, data: dict[str, Union[str, int]]):
        favorite = self.model(
            title=data['title'],
            backdrop_path=data['backdrop_path'],
            user_id=data['user_id'],
            type=data['type'],
            resource_id=data['resource_id'],
        )

        favorite.save()

    def find_favorite(self, resource_id: int, user_id: int):
        return Favorite.objects.all().filter(
            resource_id=resource_id).filter(user_id=user_id).first()

    def all_favorites(self, user_id: int, page: int):
        objects = Favorite.objects.all().order_by('id').filter(user_id=user_id)
        p = Paginator(objects, 2)
        next_page = int(page) + 1
        cur_page = p.page(next_page)
        favorites = cur_page.object_list

        return {'page': next_page, 'has_next': cur_page.has_next(), 'favorites': favorites}


class Favorite(models.Model):

    objects: FavoriteManager = FavoriteManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    type = models.CharField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=200)
    backdrop_path = models.CharField(max_length=200)
    resource_id = models.IntegerField(blank=True, null=True)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_favorites'
    )
