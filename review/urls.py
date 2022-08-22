from django.urls import path
from . import views
urlpatterns = [
    path('reviews/', views.ListCreateAPIView.as_view()),
]

