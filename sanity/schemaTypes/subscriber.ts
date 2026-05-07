import { defineField, defineType } from 'sanity';

export const subscriber = defineType({
  name: 'subscriber',
  title: 'Assinante Newsletter',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Data de inscrição',
      type: 'datetime',
    }),
    defineField({
      name: 'confirmed',
      title: 'Confirmado',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'source',
      title: 'Origem',
      type: 'string',
      description: 'De onde veio a inscrição (ex: homepage, blog)',
      initialValue: 'homepage',
    }),
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'subscribedAt',
    },
  },
});
