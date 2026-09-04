import type { Rule } from 'sanity';

export const product = {
  name: 'product',
  title: 'Produto (Loja)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título do Produto',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Descrição Curta',
      type: 'text',
      validation: (Rule: Rule) => Rule.required().max(200),
    },
    {
      name: 'price',
      title: 'Preço (R$)',
      type: 'number',
      validation: (Rule: Rule) => Rule.required().min(0),
    },
    {
      name: 'type',
      title: 'Tipo de Produto',
      type: 'string',
      options: {
        list: [
          { title: 'E-book', value: 'ebook' },
          { title: 'Planner / Caderno', value: 'planner' },
          { title: 'Curso / Mentoria', value: 'course' },
          { title: 'Outro', value: 'other' },
        ],
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'checkoutUrl',
      title: 'Link de Venda (Hotmart, Kiwify, etc)',
      type: 'url',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Capa / Imagem do Produto',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'featured',
      title: 'Destaque na página inicial?',
      type: 'boolean',
      initialValue: false,
    },
  ],
};
