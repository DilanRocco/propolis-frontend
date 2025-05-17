import type { Listing } from "../../lib/types/properties"
export function load() {
    // In a real app, you might fetch this from an API

    const dummyListing: Listing[] = [{
        _id: "1234567890abcdef12345678",
        SaaS: {
            autoRenew: true,
            expiresAt: "2025-12-31T23:59:59.000Z",
        },
        financials: {
            cleaningFee: {
                value: {
                    _id: "fee_clean_001",
                    multiplier: "PER_STAY",
                    formula: 50,
                    valueType: "FIXED",
                },
                lastUpdated: "2025-05-01T10:00:00.000Z",
            },
            petFee: {
                value: {
                    _id: "fee_pet_001",
                    multiplier: "PER_PET_PER_STAY",
                    formula: 25,
                    valueType: "FIXED",
                },
                lastUpdated: "2025-05-02T11:30:00.000Z",
            },
            channelCommission: {
                useAccountSettings: false,
                _id: "comm_001",
                manual: [],
                createdAt: "2025-01-01T08:00:00.000Z",
                updatedAt: "2025-04-01T09:00:00.000Z",
            },
        },
        cleaningStatus: {
            value: "clean",
            updatedAt: "2025-05-10T12:00:00.000Z",
        },
        picture: {
            thumbnail: "https://example.com/images/listing-thumb.jpg",
        },
        terms: {
            minNights: 2,
            maxNights: 30,
        },
        prices: {
            monthlyPriceFactor: 0.8,
            weeklyPriceFactor: 0.9,
            currency: "USD",
            basePrice: 200,
            extraPersonFee: 20,
            guestsIncludedInRegularFee: 2,
            securityDepositFee: 150,
            petFee: 25,
            cleaningFee: 50,
        },
        publicDescription: {
            summary: "A cozy downtown apartment with modern amenities.",
            space: "Two-bedroom, one-bath unit with open living area.",
            access: "Self check-in via smart lock.",
            neighborhood: "Located in the heart of Downtown, steps from cafes.",
            transit: "500 m to the Central subway station.",
            notes: "Please respect quiet hours after 10 PM.",
            interactionWithGuests: "Happy to chat over text or phone.",
            houseRules: "No smoking, no parties, quiet hours 10 PM–7 AM.",
        },
        pms: {
            automation: {
                answeringMachine: {},
                hooks: { ignoredHooks: [] },
                calendarSmartRules: { blockListings: [] },
                autoReviews: {
                    templates: ["Thanks for staying!", "We hope to see you again!"],
                    starRating: 5,
                    daysBeforeSending: 2,
                    active: true,
                },
                autoPricing: { rules: [] },
            },
            tasks: { defaultTasks: [] },
            autoPayments: [
                {
                    scheduleTo: {
                        timeRelation: { relation: "BEFORE", unit: "DAY", amount: 1 },
                        reservationEvent: "CHECK_IN",
                    },
                    _id: "autopay_001",
                    chargeType: "AUTH_ONLY",
                    isAuthorizationHold: true,
                    useGuestCard: true,
                },
            ],
            active: true,
            cleaningStatus: { active: true },
        },
        sales: {
            salesService: {
                atPhones: ["+15551234567", "+15557654321"],
            },
        },
        receptionistsService: {
            receptionDesk: { atPhones: ["+15559876543"], ittt: [] },
            screening: { checklist: [] },
        },
        calendarRules: { customRule: "no-overlap" },  // passthrough
        type: "Apartment",
        tags: ["downtown", "modern"],
        owners: ["owner_001"],
        amenities: ["wifi", "air_conditioning", "kitchen"],
        amenitiesNotIncluded: ["pool", "gym"],
        useAccountRevenueShare: false,
        netIncomeFormula: "basePrice * 0.8 - cleaningFee",
        commissionFormula: "basePrice * 0.1",
        ownerRevenueFormula: "basePrice * 0.7",
        useAccountAdditionalFees: false,
        taxes: [],
        useAccountTaxes: false,
        markups: {},
        useAccountMarkups: false,
        active: true,
        preBooking: [],
        accommodates: 4,
        bathrooms: 1,
        defaultCheckInTime: "15:00",
        defaultCheckOutTime: "11:00",
        propertyType: "Entire place",
        roomType: "Apartment",
        address: {
            full: "123 Main St, Apt 4B, Metropolis, NY 10001, USA",
            lng: -73.9857,
            lat: 40.7484,
            county: "New York County",
            neighborhood: "Midtown",
            apartment: "4B",
            floor: "4",
            street: "123 Main St",
            city: "Metropolis",
            country: "USA",
            zipcode: "10001",
            state: "NY",
            buildingName: "Main Tower",
        },
        pictures: [
            {
                _id: "pic_001",
                original: "https://example.com/images/room1-original.jpg",
                thumbnail: "https://example.com/images/room1-thumb.jpg",
            },
        ],
        timezone: "America/New_York",
        nickname: "Midtown Loft",
        title: "Stylish 2BR Loft in Midtown",
        accountId: "acct_001",
        isListed: true,
        createdAt: "2025-01-15T09:00:00.000Z",
        lastUpdatedAt: "2025-05-10T12:00:00.000Z",
        integrations: [
            {
                _id: "int_001",
                platform: "Airbnb",
                externalUrl: "https://airbnb.com/h/12345",
            },
        ],
        pendingTasks: [],
        listingRooms: [
            {
                _id: "room_001",
                roomNumber: 1,
                beds: [
                    { _id: "bed_001", type: "Queen", quantity: 1 },
                    { _id: "bed_002", type: "Twin", quantity: 1 },
                ],
            },
        ],
        customFields: [
            { _id: "cf_001", fieldId: "floor_pref", value: "High floor" },
        ],
        offeredServices: [],
        importedAt: "2025-01-15T09:01:00.000Z",
        occupancyStats: [],
        __v: 0,
        otaRoomType: "Entire home/apt",
        bedrooms: 2,
        checkInInstructions: {
            primaryCheckIn: "Use keypad code 1234",
            alternativeCheckIn: "Meet host at door",
            notes: "Key is inside lockbox",
        },
        areaSquareFeet: 850,
        minimumAge: 21,
        lastActivityAt: "2025-05-10T12:30:00.000Z",
        beds: 2,
        sourceOfCreation: "API_IMPORT",
        hostName: "John Doe",
        houseManual: "Please leave keys on the table.",
        parkingInstructions: "Street parking only.",
        trashCollectedOn: "Monday",
        wifiName: "Loft_WiFi",
        wifiPassword: "supersecurepassword",
        complexId: "complex_001",
        businessModel: {
            id: "bm_001",
            name: "Standard",
            activationDate: "2024-06-01T00:00:00.000Z",
            version: 1,
        },
        paymentProviderId: "pp_001",
        accountTaxes: [
            {
                _id: "tax_001",
                type: "SALES",
                amount: 8.875,
                units: "PERCENT",
                quantifier: "PER_STAY",
                appliedToAllFees: true,
                appliedOnFees: [],
                isAppliedByDefault: true,
                appliedByDefaultOnChannels: [],
                __v: 0,
            },
        ],
    }];
    return {
        dummyListing
    };


}