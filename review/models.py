import logging
from django.db import models
from django.utils import timezone
from django.core.paginator import Paginator
logger = logging.getLogger('django')


class ReviewManager(models.Manager):

    def fetch_reviews(self, old_page: int, direction: str):
        objects = Review.objects.order_by('-id').all()
        paginator = Paginator(objects, 2)
        new_page = None
        if direction == 'next':
            new_page = int(old_page) + 1

        else:
            new_page = int(old_page) - 1

        if new_page is not None:
            new_page_results = paginator.page(new_page)

            reviews = new_page_results.object_list

            return {
                'reviews': reviews,
                'has_next': new_page_results.has_next(),
                'page': new_page,
            }
    def create(self, data):
        exists = Review.objects.all().filter(name=data['name']).filter(
            user_id=data['user']).first()

        if exists:
            return {'error': 'You have already reviewed this one.'}

        review = self.model(
            resource_id=data['resource_id'],
            backdrop_path=data['backdrop_path'],
            name=data['name'],
            body=data['body'],
            rating=data['rating'],
            user=data['user']
        )

        review.save()


class Review (models.Model):

    objects: ReviewManager = ReviewManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    backdrop_path = models.CharField(max_length=200)
    resource_id = models.IntegerField()
    name = models.CharField(max_length=200)
    body = models.TextField(max_length=400)
    edited = models.BooleanField(default=False)  # type: ignore
    rating = models.IntegerField()
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_reviews'
    )
