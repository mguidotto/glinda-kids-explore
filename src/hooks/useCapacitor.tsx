
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Share } from '@capacitor/share';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);
  const [permissions, setPermissions] = useState({
    camera: false,
    geolocation: false,
  });

  useEffect(() => {
    const checkNative = () => {
      setIsNative(Capacitor.isNativePlatform());
    };
    
    checkNative();
    
    if (Capacitor.isNativePlatform()) {
      initializeNative();
    }
  }, []);

  const initializeNative = async () => {
    try {
      // Configure status bar
      await StatusBar.setStyle({ style: Style.Default });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      
      // Hide splash screen after a delay
      setTimeout(async () => {
        await SplashScreen.hide();
      }, 2000);

      // Request permissions
      await requestPermissions();
    } catch (error) {
      console.error('Error initializing native features:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      // Request geolocation permission
      const geoPermission = await Geolocation.requestPermissions();
      setPermissions(prev => ({
        ...prev,
        geolocation: geoPermission.location === 'granted'
      }));

      // Request camera permission
      const cameraPermission = await Camera.requestPermissions();
      setPermissions(prev => ({
        ...prev,
        camera: cameraPermission.camera === 'granted'
      }));
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const getCurrentPosition = async () => {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return {
        latitude: null,
        longitude: null,
        error: error.message
      };
    }
  };

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });
      
      return {
        dataUrl: image.dataUrl,
        error: null
      };
    } catch (error) {
      console.error('Error taking picture:', error);
      return {
        dataUrl: null,
        error: error.message
      };
    }
  };

  const shareContent = async (title: string, text: string, url?: string) => {
    try {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: 'Condividi su Glinda'
      });
      return { success: true, error: null };
    } catch (error) {
      console.error('Error sharing:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    isNative,
    permissions,
    getCurrentPosition,
    takePicture,
    shareContent,
    requestPermissions
  };
};
