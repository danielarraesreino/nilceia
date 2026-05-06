import { defineField, defineType } from 'sanity';

export const appointment = defineType({
  name: 'appointment',
  title: 'Agendamentos',
  type: 'document',
  fields: [
    defineField({
      name: 'clientName',
      title: 'Nome do Paciente',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'clientEmail',
      title: 'E-mail do Paciente',
      type: 'string',
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'sessionType',
      title: 'Tipo de Sessão',
      type: 'string',
      options: {
        list: [
          { title: 'Online', value: 'online' },
          { title: 'Presencial', value: 'presencial' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Data',
      type: 'date',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Horário',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pendente', value: 'pending' },
          { title: 'Confirmado', value: 'confirmed' },
          { title: 'Cancelado', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'notes',
      title: 'Observações (opcional)',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'clientName',
      date: 'date',
      time: 'startTime',
      status: 'status',
    },
    prepare(selection) {
      const { title, date, time, status } = selection;
      return {
        title: title as string,
        subtitle: `${date} às ${time} - Status: ${status}`,
      };
    },
  },
});
