import logging
from core import settings
import requests
logger = logging.getLogger('django')


class TMDB():
    def multi_search(self, query: str, page: int):
        try:
            response = requests.get(
                f'{settings.TMDB_BASE_URL}/search/movie?language=en-US&query={query}&api_key={settings.TMDB_API_KEY}&page={page}')

            types = ['person', 'tv', 'movie', 'collection']
            totals = {}

            for type in types:
                totals[type] = self.get_type_total(type, query, page)

            return {'results': response.json(), 'totals': totals}
        except Exception:
            logger.error('Unable to fetch resources from TMDB.')

    def get_type_total(self, type: str, query: str, page: int):
        response = requests.get(
            f'{settings.TMDB_BASE_URL}/search/{type}?language=en-US&query={query}&api_key={settings.TMDB_API_KEY}&page={page}')

        data = response.json()
        return data['total_results']


tmdb = TMDB()
