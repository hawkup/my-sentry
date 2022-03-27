#!/bin/sh

VERSION=$(sentry-cli releases propose-version)

sentry-cli releases --org "sentry" -p "my-sentry" files "$VERSION" upload ./dist/assets

sentry-cli releases --org "sentry" -p "my-sentry" files "$VERSION" upload-sourcemaps ./dist/assets
