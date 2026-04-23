import { defineCollection, z } from '@nuxt/content'

const createEnum = (options: [string, ...string[]]) => z.enum(options)

const createBaseSchema = () => z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty()
})

const createLinkSchema = () => z.object({
  label: z.string().nonempty(),
  to: z.string().nonempty(),
  icon: z.string().optional().editor({ input: 'icon' }),
  size: createEnum(['xs', 'sm', 'md', 'lg', 'xl']),
  trailing: z.boolean().optional(),
  target: createEnum(['_blank', '_self']),
  color: createEnum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info']),
  variant: createEnum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link'])
})

const createChallengeSchema = () => createBaseSchema().extend({
  icon: z.string().editor({ input: 'icon' }),
  ui: z.object({
    leading: z.string().optional()
  }).editor({ hidden: true })
})

export const collections = {
  content: defineCollection({
    source: 'index.yml',
    type: 'page',
    schema: z.object({
      hero: z.object({
        links: z.array(createLinkSchema())
      }),
      section: createBaseSchema().extend({
        headline: z.string().optional()
      }),
      challenges: createBaseSchema().extend({
        challenges: z.array(createChallengeSchema())
      }),
      efforts: createBaseSchema().extend({
        items: z.array(createChallengeSchema().extend({
          id: z.string(),
          start: z.string().datetime(),
          image: z.object({
            light: z.string().editor({ input: 'media' }),
            dark: z.string().editor({ input: 'media' })
          }).optional(),
          users: z.array(
            z.object({
              name: z.string().nonempty(),
              description: z.string().nonempty(),
              to: z.string().nonempty(),
              avatar: z.object({
                src: z.string().editor({ input: 'media' }),
                alt: z.string().optional()
              }),
              target: createEnum(['_blank', '_self'])
            })
          )
        }))
      }),
      related: createBaseSchema().extend({
        items: z.array(
          z.object({
            title: z.string().nonempty(),
            users: z.array(
              z.object({
                name: z.string().nonempty(),
                description: z.string().nonempty(),
                to: z.string().nonempty(),
                avatar: z.object({
                  src: z.string().editor({ input: 'media' }),
                  alt: z.string().optional()
                }),
                target: createEnum(['_blank', '_self'])
              })
            )
          }))
      }),
      agenda: createBaseSchema(),
      cta: createBaseSchema().extend({
        links: z.array(createLinkSchema())
      })
    })
  }),
  agenda: defineCollection({
    source: 'agenda/*.md',
    type: 'data',
    schema: z.object({
      title: z.string().optional()
    })
  })
}
