from django.urls import path
from . import views
urlpatterns = [
    path('resources/tmdb/', views.TMDBResourcesAPIView.as_view()),
    path('resources/tmdb/sorted/', views.TMDBSortResourcesAPIView.as_view()),
    path('resources/tmdb/filtered/', views.TMDBFilterResourcesAPIView.as_view()),
    path('search/tmdb/', views.MountedSearchAPIView.as_view()),
    path('search/tmdb/<str:param>/', views.SearchAPIView.as_view()),
    path('movies/tmdb/details/<int:id>/',
         views.TMDBMovieDetailsAPIView.as_view()),
    path('tv/tmdb/details/<int:id>/', views.TMDBTVDetailsAPIView.as_view()),
    path('collections/tmdb/details/<int:id>/', views.TMDBCollectionDetailsAPIView.as_view()),
    path('persons/tmdb/details/<int:id>/', views.TMDBPersonDetailsAPIView.as_view()),
]
