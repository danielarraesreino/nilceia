export const author = {
  name: 'author',
  title: 'Autor(a)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'bio',
      title: 'Mini-Biografia',
      type: 'text',
      description: 'Breve resumo sobre quem é a pessoa.',
      validation: (Rule: any) => Rule.required().max(300),
    },
    {
      name: 'image',
      title: 'Foto / Avatar',
      type: 'image',
      options: { hotspot: true },
    },
  ],
};
