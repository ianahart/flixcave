import logging
from core import settings
from movie.tmdb_fields import movie_fields, tv_fields, collection_fields, person_fields
import requests
logger = logging.getLogger('django')


class TMDB():

    def person_details(self, id: int):
        try:
            response = requests.get(
                f'{settings.TMDB_BASE_URL}/person/{id}?api_key={settings.TMDB_API_KEY}'
            )
            details = {}
            data = response.json()
            for key, value in data.items():
                if key in person_fields:
                    details[key] = value

            return details

        except Exception:
            logger.error('Unable to fetch collection details from TMDB.')

    def collection_details(self, id: int):
        try:
            response = requests.get(
                f'{settings.TMDB_BASE_URL}/tv/{id}?api_key={settings.TMDB_API_KEY}'
            )
            details = {}
            data = response.json()
            for key, value in data.items():
                if key in collection_fields:
                    details[key] = value

            return details

        except Exception:
            logger.error('Unable to fetch collection details from TMDB.')

    def tv_details(self, id: int):
        try:

            response = requests.get(
                f'{settings.TMDB_BASE_URL}/tv/{id}?api_key={settings.TMDB_API_KEY}'
            )

            data = response.json()
            vote_percent, details = 0, {}

            for key, value in data.items():
                if key in tv_fields:

                    if key == 'vote_average':
                        vote_percent = int(value * 10)
                        details['vote_percent'] = vote_percent

                    details[key] = value

            return details

        except Exception:
            logger.error('Unable to fetch tv details from TMDB')

    def movie_details(self, id: int):
        try:
            response = requests.get(
                f'{settings.TMDB_BASE_URL}/movie/{id}?api_key={settings.TMDB_API_KEY}'
            )
            data = response.json()
            vote_percent, details = 0, {}

            for key, value in data.items():
                if key in movie_fields:
                    if key == 'vote_average':
                        vote_percent = int(value * 10)
                        details['vote_percent'] = vote_percent
                    if key == 'release_date':
                        details['date'] = value.split('-')[0]
                    details[key] = value

            return details
        except Exception:
            logger.error('Unable to fetch movie details from TMDB.')

    def search(self, query: str, param: str, page: int, direction='next'):
        try:
            response = requests.get(
                f'{settings.TMDB_BASE_URL}/search/{param}?language=en-US&query={query}&api_key={settings.TMDB_API_KEY}&page={page}')

            return {
                'results': response.json(),
                'type': param,
                'page': page,
            }

        except Exception:
            logger.error('Unable to fetch resources with parameter from TMDB.')

    def mounted_search(self, query: str, page: int):
        try:
            response = requests.get(
                f'{settings.TMDB_BASE_URL}/search/movie?language=en-US&query={query}&api_key={settings.TMDB_API_KEY}&page={page}')

            types = ['person', 'tv', 'movie', 'collection']
            totals = {}

            for type in types:
                totals[type] = self.get_type_total(type, query, page)

            return {
                'results': response.json(),
                'totals': totals,
                'page': page,
            }
        except Exception:
            logger.error('Unable to fetch resources from TMDB.')

    def get_type_total(self, type: str, query: str, page: int):
        response = requests.get(
            f'{settings.TMDB_BASE_URL}/search/{type}?language=en-US&query={query}&api_key={settings.TMDB_API_KEY}&page={page}')

        data = response.json()
        return data['total_results']


tmdb = TMDB()
