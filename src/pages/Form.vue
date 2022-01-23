<script setup>
import * as Sentry from '@sentry/vue'

Sentry.setTag('page', 'form')

function handleClick($event) {
  console.log('handleClick', $event)
  Sentry.addBreadcrumb({
    category: 'upload',
    message: 'click upload',
    level: Sentry.Severity.Info,
  })
}

function handleFileChange($event) {
  console.log('handleFileChange', $event)
  Sentry.addBreadcrumb({
    category: 'upload',
    message: 'file change',
    level: Sentry.Severity.Info,
  })
}

function upload() {
  throw new Error('fake fail upload')
}
</script>

<template>
  <input type="file" @click="handleClick($event)" @change="handleFileChange($event)" />
  <button @click="upload">Submit</button>
</template>
