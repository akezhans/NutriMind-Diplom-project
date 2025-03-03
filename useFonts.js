import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        'Italiana': require('./assets/fonts/Italiana-Regular.ttf'),
      });
      setFontsLoaded(true);
    })();
  }, []);

  return fontsLoaded;
};
