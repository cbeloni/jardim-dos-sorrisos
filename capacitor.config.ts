import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jardimdosorrisos.app',
  appName: 'Jardim dos Sorrisos',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
};

export default config;
