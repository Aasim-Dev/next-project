import * as yup from 'yup';

export const userProfileSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .required('Name is required'),
  bio: yup
    .string()
    .max(500, 'Bio cannot exceed 500 characters')
    .optional(),
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional(),
  location: yup
    .string()
    .max(100, 'Location cannot exceed 100 characters')
    .optional(),
  website: yup
    .string()
    .url('Please enter a valid URL')
    .optional(),
});

export const photographerProfileSchema = userProfileSchema.concat(
  yup.object({
    businessName: yup
      .string()
      .max(100, 'Business name cannot exceed 100 characters')
      .optional(),
    specialties: yup
      .array()
      .of(yup.string())
      .min(1, 'Please select at least one specialty')
      .required('Specialties are required'),
    experience: yup
      .number()
      .min(0, 'Experience cannot be negative')
      .max(50, 'Experience cannot exceed 50 years')
      .required('Experience is required'),
    priceRange: yup.object({
      min: yup
        .number()
        .min(0, 'Minimum price cannot be negative')
        .required('Minimum price is required'),
      max: yup
        .number()
        .min(yup.ref('min'), 'Maximum price must be greater than minimum')
        .required('Maximum price is required'),
      currency: yup
        .string()
        .oneOf(['USD', 'EUR', 'GBP', 'INR'], 'Please select a valid currency')
        .required('Currency is required'),
      per: yup
        .string()
        .oneOf(['hour', 'day', 'event', 'photo'], 'Please select a valid unit')
        .required('Price unit is required'),
    }),
    serviceAreas: yup
      .array()
      .of(yup.string())
      .min(1, 'Please add at least one service area')
      .required('Service areas are required'),
    equipment: yup
      .array()
      .of(yup.string())
      .optional(),
  })
);