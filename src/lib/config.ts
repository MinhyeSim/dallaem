const isProd = process.env.NODE_ENV === 'production'

export const BASE_URL = isProd
  ? process.env.API_URI_PROD
  : process.env.API_URI_DEV

export const TEAM_ID = isProd
  ? process.env.TEAM_ID_PROD
  : process.env.TEAM_ID_DEV
