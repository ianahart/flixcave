from django.urls import path
from . import views
urlpatterns = [
    path('search/', views.MountedSearchAPIView.as_view()),
    path('search/<str:param>/', views.SearchAPIView.as_view()),

]
