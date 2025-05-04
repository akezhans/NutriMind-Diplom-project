import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { useContext } from 'react';
import Constants from 'expo-constants';

export const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute('data-theme', savedTheme);
    }

    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/settings`, {
          withCredentials: true
        });
        
        if (response.data && response.data.theme) {
          setTheme(response.data.theme);
          localStorage.setItem('theme', response.data.theme);
          document.body.setAttribute('data-theme', response.data.theme);
        }
      } catch (error) {
        console.error('Не удалось загрузить настройки:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    try {
      await axios.put(`${API_BASE_URL}/settings`, {
        theme: newTheme
      }, {
        withCredentials: true
      });
      
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.body.setAttribute('data-theme', newTheme);
    } catch (error) {
      console.error('Не удалось обновить настройки темы:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};