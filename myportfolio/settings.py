MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # add this
    "django.contrib.sessions.middleware.SessionMiddleware",
    ...
]

# Add this at the bottom of settings.py
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
