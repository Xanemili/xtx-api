module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8000,
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
  },
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  api: {
    iex_secret: process.env.NODE_ENV === 'development' ? process.env.IEX_SANDBOX_KEY : process.env.IEX_CLOUD_KEY,
    iex_base_url: process.env.NODE_ENV === 'development' ? 'https://sandbox.iexapis.com/stable' : 'https://cloud.iexapis.com/stable',
    news_secret: process.env.NEWS_API
  } 
};
