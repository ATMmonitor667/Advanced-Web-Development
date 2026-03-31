const FEATURE_NAMES = {
  exterior: 'Exterior Color',
  wheels: 'Wheels',
  interior: 'Interior',
  engine: 'Engine',
}

const EXTERIOR_THEMES = {
  Red: {
    body: '#cf4538',
    highlight: '#f7a87e',
    scene: 'linear-gradient(180deg, #ffe0c7 0%, #ffc89a 48%, #1d2430 100%)',
  },
  Blue: {
    body: '#2f5fd0',
    highlight: '#87b5ff',
    scene: 'linear-gradient(180deg, #dff0ff 0%, #b1d1ff 45%, #1d2430 100%)',
  },
  Black: {
    body: '#20242d',
    highlight: '#7f8aa5',
    scene: 'linear-gradient(180deg, #d6dbe6 0%, #aab4c9 45%, #111722 100%)',
  },
  Silver: {
    body: '#a9b2bf',
    highlight: '#ffffff',
    scene: 'linear-gradient(180deg, #f6f7fb 0%, #dce3ef 45%, #1c2533 100%)',
  },
}

const WHEEL_THEMES = {
  Standard: {
    className: 'wheel-standard',
    accent: '#d6dbe6',
    trim: '#6b7382',
  },
  Sport: {
    className: 'wheel-sport',
    accent: '#ff7a59',
    trim: '#2d3139',
  },
  Luxury: {
    className: 'wheel-luxury',
    accent: '#f4cf72',
    trim: '#4b3f2a',
  },
}

const INTERIOR_THEMES = {
  Cloth: {
    seat: '#8f96a3',
    trim: '#d2d8e3',
  },
  Leather: {
    seat: '#4f372e',
    trim: '#b78a61',
  },
  'Premium Leather': {
    seat: '#f2ede4',
    trim: '#cc9354',
  },
}

const ENGINE_THEMES = {
  Standard: {
    badge: 'Standard Drive',
    accent: '#6e7d92',
    detail: 'Balanced daily setup',
  },
  Turbo: {
    badge: 'Turbo Boost',
    accent: '#f06f47',
    detail: 'Sharper acceleration',
  },
  Electric: {
    badge: 'Electric Drive',
    accent: '#3fc6bf',
    detail: 'Quiet instant torque',
  },
}

const DEFAULT_EXTERIOR = EXTERIOR_THEMES.Red
const DEFAULT_WHEELS = WHEEL_THEMES.Standard
const DEFAULT_INTERIOR = INTERIOR_THEMES.Cloth
const DEFAULT_ENGINE = ENGINE_THEMES.Standard

export const buildSelectionsFromForm = (features, selectionMap) =>
  features
    .map((feature) => {
      const option = selectionMap[feature.feature_id]

      if (!option) {
        return null
      }

      return {
        feature_id: feature.feature_id,
        feature_name: feature.feature_name,
        option_id: option.id,
        option_name: option.name,
        option_price: option.price,
      }
    })
    .filter(Boolean)

export const getSelectionMap = (selections = []) =>
  selections.reduce((map, selection) => {
    if (selection?.feature_name && selection?.option_name) {
      map[selection.feature_name] = selection
    }

    return map
  }, {})

export const getCarAppearance = (selections = []) => {
  const selectionMap = getSelectionMap(selections)

  const exteriorLabel = selectionMap[FEATURE_NAMES.exterior]?.option_name || 'Red'
  const wheelsLabel = selectionMap[FEATURE_NAMES.wheels]?.option_name || 'Standard'
  const interiorLabel = selectionMap[FEATURE_NAMES.interior]?.option_name || 'Cloth'
  const engineLabel = selectionMap[FEATURE_NAMES.engine]?.option_name || 'Standard'

  const exterior = EXTERIOR_THEMES[exteriorLabel] || DEFAULT_EXTERIOR
  const wheels = WHEEL_THEMES[wheelsLabel] || DEFAULT_WHEELS
  const interior = INTERIOR_THEMES[interiorLabel] || DEFAULT_INTERIOR
  const engine = ENGINE_THEMES[engineLabel] || DEFAULT_ENGINE

  return {
    exteriorLabel,
    wheelsLabel,
    interiorLabel,
    engineLabel,
    bodyColor: exterior.body,
    bodyHighlight: exterior.highlight,
    stageBackground: exterior.scene,
    wheelClass: wheels.className,
    wheelAccent: wheels.accent,
    wheelTrim: wheels.trim,
    seatColor: interior.seat,
    trimColor: interior.trim,
    engineAccent: engine.accent,
    engineBadge: engine.badge,
    engineDetail: engine.detail,
    isElectric: engineLabel === 'Electric',
    isTurbo: engineLabel === 'Turbo',
  }
}

export const isBlockedCombination = (selections = []) => {
  const selectionMap = getSelectionMap(selections)

  return (
    selectionMap[FEATURE_NAMES.engine]?.option_name === 'Electric' &&
    selectionMap[FEATURE_NAMES.wheels]?.option_name === 'Sport'
  )
}

export const getFeatureOptionName = (selections = [], featureName) =>
  getSelectionMap(selections)[featureName]?.option_name || ''

export const featureNames = FEATURE_NAMES
