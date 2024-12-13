// Customer Profile Schema
const customerProfileTemplate = {
  // Basic Information
  id: "", // UUID
  email: "",
  phone: "",
  name: "",
  age: "",
  gender: "", // male, female, non-binary
  dateOfBirth: "",
  createdAt: "",
  updatedAt: "",

  // Measurements and Sizing
  measurements: {
    height: "", // in cm
    weight: "", // in kg
    bodyType: "", // hourglass, pear, rectangle, etc.
    generalSize: "", // XS, S, M, L, XL, etc.

    // Specific Sizing
    tops: "", // XS-XXL
    bottoms: "", // Size numbers
    dresses: "", // XS-XXL
    shoes: "", // EU/US/UK size
  },

  // Style Preferences
  stylePreferences: {
    preferredStyles: [], // casual, formal, bohemian, minimalist, etc.
    avoidStyles: [],
    colorPreferences: {
      preferred: [],
      avoid: [],
    },
    patternPreferences: {
      preferred: [], // floral, stripes, solid, etc.
      avoid: [],
    },
    materialPreferences: {
      preferred: [], // cotton, silk, wool, etc.
      avoid: [],
    },
  },

  // Category-specific Preferences
  categoryPreferences: {
    tops: {
      necklines: [], // v-neck, crew, boat, etc.
      sleeveLengths: [], // short, long, 3/4, sleeveless
      fit: [], // fitted, loose, regular
      budget: {
        min: 0,
        max: 0,
      },
      preferredBrands: [],
    },
    overPieces: {
      types: [], // corsets, gilets, spencers, sweaters, etc.
      fit: [],
      budget: {
        min: 0,
        max: 0,
      },
      preferredBrands: [],
    },
    bottoms: {
      types: [], // skirts, trousers, jeans, etc.
      waistRise: [], // high, mid, low
      length: [], // mini, midi, maxi, ankle, etc.
      fit: [], // skinny, straight, wide, etc.
      budget: {
        min: 0,
        max: 0,
      },
      preferredBrands: [],
    },
    dresses: {
      types: [], // casual, formal, cocktail, etc.
      length: [],
      fit: [],
      budget: {
        min: 0,
        max: 0,
      },
      preferredBrands: [],
    },
    shoes: {
      types: [], // sneakers, boots, heels, etc.
      heelHeight: [], // flat, low, mid, high
      budget: {
        min: 0,
        max: 0,
      },
      preferredBrands: [],
    },
    accessories: {
      types: [], // bags, jewelry, scarves, hats
      budget: {
        min: 0,
        max: 0,
      },
      preferredBrands: [],
    },
  },

  // Shopping Preferences
  shoppingPreferences: {
    overallBudget: {
      min: 0,
      max: 0,
    },
    occasionTypes: [], // work, casual, special events
    seasonalPreference: [], // spring, summer, fall, winter
    excludedCategories: [], // categories they don't want
  },

  // Style Box History
  styleBoxHistory: [
    // {
    //   boxId: '',
    //   date: '',
    //   items: [],
    //   feedback: {},
    //   keepItems: []
    // }
  ],

  // Survey Data
  surveyData: {
    heyflowResponseId: "",
    lastSurveyDate: "",
    rawSurveyData: {}, // Store the original survey data
  },
};

export default customerProfileTemplate;
