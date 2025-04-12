// app.config.js
export default {
  name: "Big Bites",
  slug: "client",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.anonymous.client",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-font",
      {
        "fonts": [
          "./assets/fonts/MadimiOne-Regular.ttf",
        ]
      }
    ]
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    // You can now access environment variables in app.config.js
    OPENCAGE_API_KEY: process.env.OPENCAGE_API_KEY,  // From your .env file
    BACKEND_URL: process.env.BACKEND_URL, 
    PAYMONGO_SECRET_KEY: process.env.PAYMONGO_SECRET_KEY, 
    PAYMONGO_LINK: process.env.PAYMONGO_LINK, 
    eas: {
      projectId: "6848b1a3-1e16-4094-80e8-36a17b150413",
    },
  },
};
