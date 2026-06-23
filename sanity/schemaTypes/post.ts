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
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Título H2', value: 'h2' },
            { title: 'Subtítulo H3', value: 'h3' },
            { title: 'Seção H4', value: 'h4' },
            { title: 'Citação', value: 'blockquote' },
          ],
          lists: [
            { title: 'Lista com marcadores', value: 'bullet' },
            { title: 'Lista numerada', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Negrito', value: 'strong' },
              { title: 'Itálico', value: 'em' },
              { title: 'Sublinhado', value: 'underline' },
              { title: 'Riscado', value: 'strike-through' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule: any) =>
                      Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Abrir em nova aba',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          title: 'Imagem',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto alternativo (acessibilidade)',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Legenda',
            },
          ],
        },
        {
          type: 'object',
          name: 'youtube',
          title: 'Vídeo do YouTube',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'URL do YouTube',
              description: 'Cole o link do vídeo (ex: https://www.youtube.com/watch?v=...)',
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: { url: 'url' },
            prepare({ url }: any) {
              return { title: '▶ YouTube', subtitle: url };
            },
          },
        },
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
