// app.config.js
export default {
  name: "client",
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
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
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
  },
};
