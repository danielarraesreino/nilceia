import type { Rule } from 'sanity';

export const comment = {
  name: 'comment',
  title: 'Comentário',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'email',
      title: 'E-mail',
      type: 'string',
      description: 'E-mail do usuário (opcional para anônimos)',
    },
    {
      name: 'text',
      title: 'Comentário',
      type: 'text',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'post',
      title: 'Postagem',
      type: 'reference',
      to: { type: 'post' },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'approved',
      title: 'Aprovado',
      type: 'boolean',
      description: 'Comentários anônimos precisam ser aprovados para aparecerem no site.',
      initialValue: false,
    },
    {
      name: 'isAnonymous',
      title: 'É anônimo?',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'createdAt',
      title: 'Criado em',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'userImage',
      title: 'Avatar URL',
      type: 'string',
      description: 'URL do avatar do usuário logado via rede social',
    }
  ],
  preview: {
    select: {
      name: 'name',
      comment: 'text',
      post: 'post.title',
      approved: 'approved',
    },
    prepare({ name, comment, post, approved }: { name?: string; comment?: string; post?: string; approved?: boolean }) {
      return {
        title: `${name} em "${post || 'Desconhecido'}"`,
        subtitle: `${approved ? '✅ Aprovado' : '⏳ Pendente'} - ${comment}`,
      };
    },
  },
};
