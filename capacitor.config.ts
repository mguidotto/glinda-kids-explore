
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0feae17eb3b947f19de780779b6432dc',
  appName: 'glinda-kids-explore',
  webDir: 'dist',
  server: {
    url: 'https://0feae17e-b3b9-47f1-9de7-80779b6432dc.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#8B4A6B',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#ffffff'
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    },
    Camera: {
      permissions: ['camera', 'photos']
    },
    Geolocation: {
      permissions: ['location']
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#ffffff'
  }
};

export default config;
