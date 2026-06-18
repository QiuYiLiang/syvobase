import z from 'zod'

export const textFieldSchema = z.object({
  type: 'text',
  unique: false,
  featureType: 'normal',
  nullable: true,
  data: {
    type: 'text',
    required: false,
    component: 'text',
  },
})
