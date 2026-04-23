<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('content').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: agendaDocs } = await useAsyncData('agenda-docs', async () => {
  const docs = await queryCollection('agenda').all()
  return docs
})

const agendaBodiesMap = computed(() => {
  const map: Record<string, any> = {}
  if (!agendaDocs.value) return map
  for (const doc of agendaDocs.value) {
    const stem = doc.stem as string
    const key = stem.replace('agenda/', '')
    map[key] = doc
  }
  return map
})

const agendaItems = computed(() => {
  if (!page.value?.efforts?.items) return []

  const efforts = page.value.efforts.items
    .filter((effort) => effort.start)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  return efforts.map((effort) => ({
    ...effort,
    time: formatTime(effort.start)
  }))
})

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

useSeoMeta({
  title: page.value.seo?.title || page.value.title,
  ogTitle: page.value.seo?.title || page.value.title,
  description: page.value.seo?.description || page.value.description,
  ogDescription: page.value.seo?.description || page.value.description
})
</script>

<template>
  <div v-if="page" class="relative">
    <div class="hidden lg:block">
      <UColorModeImage light="/images/light/line-1.svg" dark="/images/dark/line-1.svg"
        class="absolute pointer-events-none pb-10 left-0 top-0 object-cover h-[650px]" />
    </div>

    <UPageHero :description="page.description" :links="page.hero.links" :ui="{
      container: 'md:pt-18 lg:pt-20',
      title: 'max-w-3xl mx-auto'
    }">
      <template #top>
        <HeroBackground />
      </template>

      <template #title>
        <MDC :value="page.title" unwrap="p" />
      </template>
    </UPageHero>

    <UPageSection :description="page.section.description">
      <template #title>
        <MDC :value="page.section.title" class="sm:*:leading-11" />
      </template>
    </UPageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <UPageSection id="challenges" :description="page.challenges.description" :features="page.challenges.challenges" :ui="{
      title: 'text-left @container relative flex',
      description: 'text-left'
    }" class="relative overflow-hidden">
      <div class="absolute rounded-full -left-10 top-10 size-[300px] z-10 bg-primary opacity-30 blur-[200px]" />
      <div class="absolute rounded-full -right-10 -bottom-10 size-[300px] z-10 bg-primary opacity-30 blur-[200px]" />
      <template #title>
        <MDC :value="page.challenges.title" class="*:leading-9" />
        <div class="hidden @min-[1020px]:block">
          <UColorModeImage light="/images/light/line-2.svg" dark="/images/dark/line-2.svg"
            class="absolute top-0 right-0 size-full transform scale-95 translate-x-[70%]" />
        </div>
      </template>
    </UPageSection>

    <USeparator :ui="{ border: 'border-primary/30' }" />

    <UPageSection id="efforts" :description="page.efforts.description" class="relative overflow-hidden">
      <template #headline>
        <UColorModeImage light="/images/light/line-3.svg" dark="/images/dark/line-3.svg"
          class="absolute -top-10 sm:top-0 right-1/2 h-24" />
      </template>
      <template #title>
        <MDC :value="page.efforts.title" />
      </template>

      <template #features>
        <UPageCard v-for="(effort, index) in page.efforts.items" :key="index" class="group"
          :ui="{ container: 'p-4 sm:p-4', title: 'flex items-center gap-1' }">
          <UColorModeImage v-if="effort.image" :light="effort.image?.light" :dark="effort.image?.dark"
            :alt="effort.title" class="size-full" />

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold">
              {{ effort.title }}
            </span>
            <span class="text-sm text-muted">
              {{ effort.description }}
            </span>
          </div>
          <div class="flex flex-wrap gap-3">
            <UUser v-for="(user, index) in effort.users" :key="index" v-bind="user" size="xl" />
          </div>
        </UPageCard>
      </template>
    </UPageSection>

    <UPageSection id="agenda" :description="page.agenda.description" class="relative overflow-hidden">
      <template #headline>
        <UColorModeImage light="/images/light/line-4.svg" dark="/images/dark/line-4.svg"
          class="absolute -top-10 sm:top-0 right-1/2 h-24" />
      </template>
      <template #title>
        <MDC :value="page.agenda.title" />
      </template>

      <template #features>
        <UPageCard v-for="(item, index) in agendaItems" :key="index" class="group"
          :ui="{ container: 'p-4 sm:p-4', title: 'flex items-center gap-1' }">
          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold">
              {{ item.title }}
            </span>
            <span class="text-sm text-primary font-medium">
              {{ item.time }}
            </span>
            <span class="text-sm text-muted">{{ item.description }}</span>
            <ContentRenderer v-if="agendaBodiesMap[item.id]?.meta?.body" :value="agendaBodiesMap[item.id].meta.body" class="mt-2 text-sm" />
          </div>
          <div class="flex flex-wrap gap-3">
            <UUser v-for="(user, index) in item.users" :key="index" v-bind="user" size="xl" />
          </div>
        </UPageCard>
      </template>
    </UPageSection>

    <UPageSection id="related" :title="page.related.title" :description="page.related.description"
      :items="page.related.items">
      <template #headline>
        <UColorModeImage light="/images/light/line-5.svg" dark="/images/dark/line-5.svg"
          class="absolute -top-10 sm:top-0 right-1/2 h-24" />
      </template>
      <template #title>
        <MDC :value="page.related.title" />
      </template>

      <UContainer>
        <UPageColumns class="xl:columns-3">
          <UPageCard v-for="(rel, index) in page.related.items" :key="index" variant="subtle" :description="rel.title"
            :ui="{ description: 'text-lg italic' }">
            <template #footer>
              <div class="flex flex-wrap gap-3">
                <UUser v-for="(user, index) in rel.users" :key="index" v-bind="user" size="xl" />
              </div>
            </template>
          </UPageCard>
        </UPageColumns>
      </UContainer>
    </UPageSection>

    <USeparator />

    <UPageCTA v-bind="page.cta" variant="naked" class="overflow-hidden @container">
      <template #title>
        <MDC :value="page.cta.title" />

        <div class="@max-[1280px]:hidden">
          <UColorModeImage light="/images/light/line-6.svg" dark="/images/dark/line-6.svg"
            class="absolute left-10 -top-10 sm:top-0 h-full" />
          <UColorModeImage light="/images/light/line-7.svg" dark="/images/dark/line-7.svg"
            class="absolute right-0 bottom-0 h-full" />
        </div>
      </template>

      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
