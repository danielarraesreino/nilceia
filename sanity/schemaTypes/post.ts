export const post = {
  name: 'post',
  title: 'Postagem (Blog)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Autor(a)',
      type: 'reference',
      to: { type: 'author' },
      description: 'Quem escreveu este texto? (Para permitir convidadas/parceiras)',
    },
    {
      name: 'category',
      title: 'Categoria / Tema',
      type: 'string',
      options: {
        list: [
          { title: 'Espiritualidade', value: 'Espiritualidade' },
          { title: 'Cura Emocional', value: 'Cura Emocional' },
          { title: 'Contos', value: 'Contos' },
          { title: 'Justiça Social', value: 'Justiça Social' },
          { title: 'Assédio Moral', value: 'Assédio Moral' },
          { title: 'Mulheres - Lutas Sociais', value: 'Mulheres - Lutas Sociais' },
          { title: 'Poesia', value: 'Poesia' },
          { title: 'Reflexões', value: 'Reflexões' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Resumo (Para Buscadores/Google)',
      type: 'text',
      description: 'Aparece nos cartões do blog e nos resultados do Google.',
      validation: (Rule: any) => Rule.required().max(200),
    },
    {
      name: 'mainImage',
      title: 'Imagem de Capa',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'readingTime',
      title: 'Tempo de Leitura (Minutos)',
      type: 'number',
      initialValue: 3,
    },
    {
      name: 'publishedAt',
      title: 'Data de Publicação',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'body',
      title: 'Corpo do Texto',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } }
      ],
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection: any) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `por ${author}`,
      });
    },
  },
};
