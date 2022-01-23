<script setup>
import * as Sentry from '@sentry/vue'

Sentry.setTag('page', 'about')

throw new Error('error on about page')
</script>

<template>
  About
</template>
