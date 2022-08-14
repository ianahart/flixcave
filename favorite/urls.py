from favorite import views
from django.urls import path
urlpatterns = [
    path('favorites/', views.ListCreateAPIView.as_view()),
    path('favorites/<int:id>', views.DetailsAPIView.as_view()),
]
