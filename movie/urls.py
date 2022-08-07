from django.urls import path
from . import views
urlpatterns = [
    path('search/', views.MultiSearchAPIView.as_view()),

]
