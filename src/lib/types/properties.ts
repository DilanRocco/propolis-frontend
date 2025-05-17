import { z } from 'zod';

const FeeValueSchema = z.object({
  _id: z.string(),
  multiplier: z.string(),
  formula: z.number(),
  valueType: z.string(),
});

const FeeInfoSchema = z.object({
  value: FeeValueSchema,
  lastUpdated: z.string(),
});

const ChannelCommissionSchema = z.object({
  useAccountSettings: z.boolean(),
  _id: z.string(),
  manual: z.array(z.any()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

function TimestampedValueSchema<T extends z.ZodType<any>>(schema: T) {
  return z.object({
    value: schema,
    updatedAt: z.string(),
  });
}

const DescriptionsSchema = z.object({
  summary: z.string(),
  space: z.string(),
  access: z.string(),
  neighborhood: z.string(),
  transit: z.string(),
  notes: z.string(),
  interactionWithGuests: z.string(),
  houseRules: z.string(),
});

const AutoReviewsSchema = z.object({
  templates: z.array(z.string()),
  starRating: z.number(),
  daysBeforeSending: z.number(),
  active: z.boolean(),
});

const AutoPaymentSchema = z.object({
  scheduleTo: z.object({
    timeRelation: z.object({
      relation: z.string(),
      unit: z.string(),
      amount: z.number(),
    }),
    reservationEvent: z.string(),
  }),
  _id: z.string(),
  chargeType: z.string(),
  isAuthorizationHold: z.boolean(),
  useGuestCard: z.boolean(),
});

const PMSConfigSchema = z.object({
  automation: z.object({
    answeringMachine: z.record(z.any()),
    hooks: z.object({ ignoredHooks: z.array(z.any()) }),
    calendarSmartRules: z.object({ blockListings: z.array(z.any()) }),
    autoReviews: AutoReviewsSchema,
    autoPricing: z.object({ rules: z.array(z.any()) }),
  }),
  tasks: z.object({ defaultTasks: z.array(z.any()) }),
  autoPayments: z.array(AutoPaymentSchema),
  active: z.boolean(),
  cleaningStatus: z.object({ active: z.boolean() }),
});

const AddressSchema = z.object({
  full: z.string(),
  lng: z.number(),
  lat: z.number(),
  county: z.string(),
  neighborhood: z.string(),
  apartment: z.string(),
  floor: z.string(),
  street: z.string(),
  city: z.string(),
  country: z.string(),
  zipcode: z.string(),
  state: z.string(),
  buildingName: z.string(),
});

const PictureSchema = z.object({
  _id: z.string(),
  original: z.string().url(),
  thumbnail: z.string().url(),
});

const IntegrationSchema = z.object({
  _id: z.string(),
  platform: z.string(),
  airbnb2: z.object({}).optional(),
  externalUrl: z.string().url(),
});

const BedSchema = z.object({
  _id: z.string(),
  type: z.string(),
  quantity: z.number(),
});

const RoomSchema = z.object({
  _id: z.string(),
  roomNumber: z.number(),
  beds: z.array(BedSchema),
});

const CustomFieldSchema = z.object({
  _id: z.string(),
  fieldId: z.string(),
  value: z.string(),
});

const BusinessModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  activationDate: z.string(),
  version: z.number(),
});

const AccountTaxSchema = z.object({
  _id: z.string(),
  type: z.string(),
  amount: z.number(),
  units: z.string(),
  quantifier: z.string(),
  appliedToAllFees: z.boolean(),
  appliedOnFees: z.array(z.string()),
  isAppliedByDefault: z.boolean(),
  appliedByDefaultOnChannels: z.array(z.string()),
  __v: z.number(),
});

export const ListingSchema = z.object({
  _id: z.string(),
  SaaS: z.object({
    autoRenew: z.boolean(),
    expiresAt: z.string(),
  }),
  financials: z.object({
    cleaningFee: FeeInfoSchema,
    petFee: FeeInfoSchema,
    channelCommission: ChannelCommissionSchema,
  }),
  cleaningStatus: TimestampedValueSchema(z.string()),
  picture: z.object({ thumbnail: z.string().url() }),
  terms: z.object({ minNights: z.number(), maxNights: z.number() }),
  prices: z.object({
    monthlyPriceFactor: z.number(),
    weeklyPriceFactor: z.number(),
    currency: z.string(),
    basePrice: z.number(),
    extraPersonFee: z.number(),
    guestsIncludedInRegularFee: z.number(),
    securityDepositFee: z.number(),
    petFee: z.number(),
    cleaningFee: z.number(),
  }),
  publicDescription: DescriptionsSchema,
  pms: PMSConfigSchema,
  sales: z.object({ salesService: z.object({ atPhones: z.array(z.string()) }) }),
  receptionistsService: z.object({
    receptionDesk: z.object({ atPhones: z.array(z.string()), ittt: z.array(z.any()) }),
    screening: z.object({ checklist: z.array(z.any()) }),
  }),
  calendarRules: z.object({}).passthrough(),
  type: z.string(),
  tags: z.array(z.string()),
  owners: z.array(z.string()),
  amenities: z.array(z.string()),
  amenitiesNotIncluded: z.array(z.string()),
  useAccountRevenueShare: z.boolean(),
  netIncomeFormula: z.string(),
  commissionFormula: z.string(),
  ownerRevenueFormula: z.string(),
  useAccountAdditionalFees: z.boolean(),
  taxes: z.array(z.any()),
  useAccountTaxes: z.boolean(),
  markups: z.any(),
  useAccountMarkups: z.boolean(),
  active: z.boolean(),
  preBooking: z.array(z.any()),
  accommodates: z.number(),
  bathrooms: z.number(),
  defaultCheckInTime: z.string(),
  defaultCheckOutTime: z.string(),
  propertyType: z.string(),
  roomType: z.string(),
  address: AddressSchema,
  pictures: z.array(PictureSchema),
  timezone: z.string(),
  nickname: z.string(),
  title: z.string(),
  accountId: z.string(),
  isListed: z.boolean(),
  createdAt: z.string(),
  lastUpdatedAt: z.string(),
  integrations: z.array(IntegrationSchema),
  pendingTasks: z.array(z.any()),
  listingRooms: z.array(RoomSchema),
  customFields: z.array(CustomFieldSchema),
  offeredServices: z.array(z.any()),
  importedAt: z.string(),
  occupancyStats: z.array(z.any()),
  __v: z.number(),
  otaRoomType: z.string(),
  bedrooms: z.number(),
  checkInInstructions: z.object({ primaryCheckIn: z.string(), alternativeCheckIn: z.string(), notes: z.string() }),
  areaSquareFeet: z.number().nullable(),
  minimumAge: z.number(),
  lastActivityAt: z.string(),
  beds: z.number(),
  sourceOfCreation: z.string(),
  hostName: z.string(),
  houseManual: z.string(),
  parkingInstructions: z.string(),
  trashCollectedOn: z.string(),
  wifiName: z.string(),
  wifiPassword: z.string(),
  complexId: z.string(),
  businessModel: BusinessModelSchema,
  paymentProviderId: z.string(),
  accountTaxes: z.array(AccountTaxSchema),
});

export type Listing = z.infer<typeof ListingSchema>;

export type FilterOptions = {
  search?: string;
  propertyType?: string;
  location?: string;
  status?: string;
}