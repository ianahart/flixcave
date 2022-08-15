from django.urls import path
from . import views
urlpatterns = [
    path('watchlists/', views.ListCreateAPIView.as_view()),
    path('watchlists/<int:id>/', views.DetailsAPIView.as_view()),
]

