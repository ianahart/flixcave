from django.urls import path
from . import views
urlpatterns = [
    path('lists/', views.ListCreateAPIView.as_view()),
    path('lists/<int:pk>/', views.DetailsAPIView.as_view()),
    path('lists/populate/', views.PopulateAPIView.as_view()),
]
