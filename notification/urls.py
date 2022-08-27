from django.urls import path
from . import views
urlpatterns = [
    path('notifications/', views.ListNotificationsAPIView.as_view()),
    path('notifications/<int:pk>/', views.NotificationsDetailAPIView.as_view()),
    path('comments/', views.ListCommentsAPIView.as_view()),
    path('comments/<int:pk>/', views.CommentDetailsAPIView.as_view()),
]
