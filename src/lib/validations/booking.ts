import * as yup from 'yup';

export const bookingRequestSchema = yup.object({
  photographerId: yup
    .string()
    .required('Photographer ID is required'),
  eventType: yup
    .string()
    .oneOf(['wedding', 'portrait', 'event', 'commercial', 'fashion', 'landscape', 'street', 'product', 'real-estate', 'headshots'])
    .required('Event type is required'),
  eventDate: yup
    .date()
    .min(new Date(), 'Event date must be in the future')
    .required('Event date is required'),
  duration: yup
    .number()
    .min(1, 'Duration must be at least 1 hour')
    .max(24, 'Duration cannot exceed 24 hours')
    .required('Duration is required'),
  location: yup.object({
    address: yup
      .string()
      .required('Address is required'),
    city: yup
      .string()
      .required('City is required'),
    state: yup
      .string()
      .optional(),
    country: yup
      .string()
      .required('Country is required'),
    zipCode: yup
      .string()
      .optional(),
  }),
  description: yup
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  requirements: yup
    .array()
    .of(yup.string())
    .optional(),
  budget: yup
    .number()
    .min(1, 'Budget must be greater than 0')
    .required('Budget is required'),
  message: yup
    .string()
    .max(500, 'Message cannot exceed 500 characters')
    .optional(),
});
