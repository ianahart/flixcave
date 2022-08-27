from django.urls import path
from . import views
urlpatterns = [
    path('reviews/', views.CreateAPIView.as_view()),
    path('reviews/list/', views.ListAPIView.as_view()),
]
