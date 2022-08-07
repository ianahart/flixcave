from django.shortcuts import render

from django.core.exceptions import BadRequest, ObjectDoesNotExist
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from movie.services import tmdb


class MultiSearchAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        try:
            page = int(request.query_params['page'])
            query = request.query_params['query']

            results = tmdb.multi_search(query=query, page=page)

            if results is None:
                raise NotFound

            return Response({
                'message': 'success',
                'results': results['results'],
                'totals': results['totals'],
            }, status=status.HTTP_200_OK)
        except NotFound as e:
            return Response({
                            'errors': 'Something went wrong.'
                            }, status=status.HTTP_404_NOT_FOUND)
