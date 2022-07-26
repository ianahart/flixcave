from django.core.exceptions import BadRequest, ObjectDoesNotExist
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from favorite.models import Favorite
from movie.services import tmdb
from watchlist.models import WatchList


class TMDBPersonAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        try:

            results = tmdb.fetch_people(request.query_params['page'])
            return Response(results, status=status.HTTP_200_OK)

        except NotFound:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)


class TMDBGenresAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        try:
            if 'link' not in request.query_params:
                raise NotFound

            genres = tmdb.fetch_genres(request.query_params['link'])
            return Response({
                'message': 'success',
                'genres': genres,
            }, status=status.HTTP_200_OK)

        except NotFound:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)


class TMDBFilterResourcesAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        try:
            genre, main_link, page, with_runtime_lte, with_runtime_gte, vote_average_lte, vote_average_gte = list(
                request.query_params.items())
            results = tmdb.filtered_resources(
                genre, main_link, page,
                with_runtime_lte, with_runtime_gte, vote_average_lte, vote_average_gte)
            if results:
                return Response({
                    'message': 'success',
                    'page': results['page'],
                    'resources': results['resources']
                }, status=status.HTTP_200_OK)

        except NotFound:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)


class TMDBSortResourcesAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        try:
            sort_by, main_path, page = request.query_params.values()
            results = tmdb.sorted_resources(main_path, page, sort_by)
            if results:
                return Response({
                    'message': 'success',
                    'page': results['page'],
                    'resources': results['resources']
                }, status=status.HTTP_200_OK)

            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)

        except NotFound:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)


class TMDBResourcesAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        try:
            main_path, page = request.query_params.values()
            results = tmdb.get_resources(main_path, page)
            if results:
                return Response({
                    'message': 'success',
                    'page': results['page'],
                    'resources': results['resources']
                }, status=status.HTTP_200_OK)
            else:
                raise NotFound

        except NotFound:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)


class TMDBPersonDetailsAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request, id: int):
        try:

            person_details = tmdb.person_details(id)

            return Response({
                'message': 'success',
                'person_details': person_details,
            }, status=status.HTTP_200_OK)
        except NotFound:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)


class TMDBCollectionDetailsAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request, id: int):
        try:

            collection_details = tmdb.collection_details(id)

            return Response({
                'message': 'success',
                'collection_details': collection_details,
            }, status=status.HTTP_200_OK)
        except NotFound:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)


class TMDBTVDetailsAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request, id: int):
        try:
            tv_details = tmdb.tv_details(id)
            if tv_details:
                is_favorited = Favorite.objects.find_favorite(
                    tv_details['id'], request.user.id)
                if is_favorited is not None:
                    tv_details['favorited'] = True if is_favorited is not None else False

                watchlist = WatchList.objects.find_watchlist_item(
                    tv_details['id'], request.user.id)
                if watchlist is not None:
                    tv_details['watchlist'] = True if watchlist is not None else False

                return Response({
                    'message': 'success',
                    'tv_details': tv_details,
                }, status=status.HTTP_200_OK)
        except NotFound:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)


class TMDBMovieDetailsAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request, id: int):
        try:
            movie_details = tmdb.movie_details(id)
            if movie_details:
                is_favorited = Favorite.objects.find_favorite(
                    movie_details['id'], request.user.id)
                if is_favorited is not None:
                    movie_details['favorited'] = True if is_favorited is not None else False

                watchlist = WatchList.objects.find_watchlist_item(
                    movie_details['id'], request.user.id)
                if watchlist is not None:
                    movie_details['watchlist'] = True if watchlist is not None else False

                return Response({
                    'message': 'success',
                    'movie_details': movie_details,
                }, status=status.HTTP_200_OK)
        except NotFound:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)


class SearchAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request, param: str):
        try:

            direction = ''

            if 'direction' in request.query_params:
                direction = request.query_params['direction']

            page = int(request.query_params['page'])
            query = request.query_params['query']
            results = tmdb.search(query, param, page, direction)
            if results is None:
                raise NotFound

            return Response({
                'message': 'success',
                'results': results['results'],
                'type': results['type'],
                'page': results['page']
            }, status=status.HTTP_200_OK)
        except NotFound as e:
            return Response({
                            'errors': 'Something went wrong.'
                            }, status=status.HTTP_404_NOT_FOUND)


class MountedSearchAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        try:
            page = int(request.query_params['page'])
            query = request.query_params['query']

            results = tmdb.mounted_search(query=query, page=page)

            if results is None:
                raise NotFound

            return Response({
                'message': 'success',
                'results': results['results'],
                'totals': results['totals'],
                'page': results['page'],
            }, status=status.HTTP_200_OK)
        except NotFound as e:
            return Response({
                            'errors': 'Something went wrong.'
                            }, status=status.HTTP_404_NOT_FOUND)
