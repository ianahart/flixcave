from collections.abc import Sequence
import logging
from core import settings
from movie.tmdb_fields import movie_fields, tv_fields, collection_fields, person_fields, resource_fields
import requests
logger = logging.getLogger('django')


class TMDB():

    def fetch_people(self, page: int):
        response = requests.get(
            f'{settings.TMDB_BASE_URL}/person/popular?api_key={settings.TMDB_API_KEY}&page={page}'
        )

        data = response.json()
        return {

            'page': int(page) + 1,
            'total_pages': data['total_pages'],
            'people': data['results'],
        }

        return

    def fetch_genres(self, link: str):
        response = requests.get(
            f'{settings.TMDB_BASE_URL}/{link}?api_key={settings.TMDB_API_KEY}'
        )

        data = response.json()
        if data:
            return data['genres']

    def filtered_resources(self, genre, main_link, page, with_runtime_lte, with_runtime_gte, vote_average_lte, vote_average_gte):

        response = requests.get(
            f'{settings.TMDB_BASE_URL}/{main_link[1]}?api_key={settings.TMDB_API_KEY}&with_genres={genre[1]}&page={page[1]}&language=en-US&with_runtime.lte={with_runtime_lte[1]}&with_runtime.gte={with_runtime_gte[1]}&vote_average.lte={vote_average_lte[1]}&vote_average.gte={vote_average_gte[1]}'
        )

        data = response.json()
        resources = self.prepare_resources(data)
        return {

            'page': int(page[1]) + 1,
            'resources': resources,
        }

    def sorted_resources(self, main_path: str, page: int, sort_by: str):
        response = requests.get(
            f'{settings.TMDB_BASE_URL}/{main_path}?api_key={settings.TMDB_API_KEY}&page={page}&language=en-US&sort_by={sort_by}'
        )

        data = response.json()
        resources = self.prepare_resources(data)
        return {

            'page': int(page) + 1,
            'resources': resources,
        }

    def prepare_resources(self, data):
        resources = []
        for item in data['results']:
            details = {}
            for key, value in item.items():
                if key in resource_fields:
                    if key == 'vote_average':
                        vote_percent = int(value * 10)
                        details['vote_percent'] = vote_percent
                    details[key] = value
            resources.append(details)

        return resources

    def get_resources(self, main_path: str, page: int):
        try:
            response = requests.get(
                f'{settings.TMDB_BASE_URL}{main_path}?api_key={settings.TMDB_API_KEY}&page={page}'
            )

            data = response.json()
            resources = self.prepare_resources(data)
            return {

                'page': int(page) + 1,
                'resources': resources,
            }

        except Exception:
            logger.error('Unable to fetch resources from TMDB.')

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

            results = self.__organize_results(response.json())

            return {
                'results': results,
                'type': param,
                'page': page,
            }

        except Exception as e:
            print(e)
            logger.error('Unable to fetch resources with parameter from TMDB.')

    def __shorten_overview(self, overview: str):
        string, char_limit = '', 25

        lst = overview.split(' ')

        for index, word in enumerate(lst):
            if index < char_limit:
                if index + 1 == char_limit:
                    string += ' ' + word + '...'
                else:
                    string += ' ' + word

        return string

    def __organize_results(self, response: dict):
        results = []
        page, data, total_pages, total_results = response.values()

        for item in data:
            if 'overview' in item:
                item['overview'] = self.__shorten_overview(
                    item['overview'])
            results.append(item)

        return {
            'page': page,
            'results': results,
            'total_pages': total_pages,
            'total_results': total_results
        }

    def mounted_search(self, query: str, page: int):
        try:
            response = requests.get(
                f'{settings.TMDB_BASE_URL}/search/movie?language=en-US&query={query}&api_key={settings.TMDB_API_KEY}&page={page}')

            types = ['person', 'tv', 'movie', 'collection']
            totals = {}

            for type in types:
                totals[type] = self.get_type_total(type, query, page)

            results = self.__organize_results(response.json())

#
            return {
                'results': results,
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
