<script setup lang="ts">
const nuxtApp = useNuxtApp()
const { activeHeadings, updateHeadings } = useScrollspy()

const items = computed(() => [{
  label: 'Challenges',
  to: '#challenges',
  active: activeHeadings.value.includes('challenges')
}, {
  label: 'Efforts',
  to: '#efforts',
  active: activeHeadings.value.includes('efforts') && !activeHeadings.value.includes('challenges')
}, {
  label: 'Agenda',
  to: '#agenda',
  active: activeHeadings.value.includes('agenda') && !activeHeadings.value.includes('efforts')
}, {
  label: 'Related',
  to: '#related',
  active: activeHeadings.value.includes('related') && !activeHeadings.value.includes('agenda')
}])

nuxtApp.hooks.hookOnce('page:finish', () => {
  updateHeadings([
    document.querySelector('#challenges'),
    document.querySelector('#efforts'),
    document.querySelector('#agenda'),
    document.querySelector('#related')
  ].filter(Boolean) as Element[])
})
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-3">
        <AppLogo class="w-auto h-10 shrink-0" />
        <span>SoSy 2026</span>
      </NuxtLink>
    </template>
    <template #right>
      <UNavigationMenu :items="items" variant="link" class="hidden lg:block" />

      <UButton label="Register" variant="subtle" class="hidden lg:block"
        href="https://sosy2026.eu/nGeneral-information/Practical/" target="_blank" rel="noopener noreferrer" />

      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      <UButton class="mt-4" label="Register" variant="subtle" block />
    </template>
  </UHeader>
</template>
