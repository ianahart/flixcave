from django.contrib import admin

from verification_token.models import VerificationToken
admin.site.register(VerificationToken)
