from django.urls import path
from authentication import views
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('auth/verify/', views.VerifyAccountAPIView.as_view()),
    path('auth/resend-verify/', views.ResendVerifyAPIView.as_view()),
    path('auth/register/', views.RegisterAPIView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/login/', views.TokenObtainPairView.as_view()),
]
