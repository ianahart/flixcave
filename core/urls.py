from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(('account.urls', 'account'))),
    path('api/v1/', include(('authentication.urls', 'authentication'))),
    path('api/v1/', include(('movie.urls', 'movie'))),
    path('api/v1/', include(('list.urls', 'list'))),
    path('api/v1/', include(('favorite.urls', 'favorite'))),
    path('api/v1/', include(('watchlist.urls', 'watchlist'))),

]
