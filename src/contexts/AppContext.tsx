'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  AppState, 
  GeneratedImage, 
  User, 
  STORAGE_KEYS, 
  INITIAL_CREDITS,
  CREDITS_PER_GENERATION 
} from '@/types';

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_IMAGE'; payload: GeneratedImage }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_IMAGES'; payload: GeneratedImage[] }
  | { type: 'SET_FAVORITES'; payload: GeneratedImage[] }
  | { type: 'UPDATE_CREDITS'; payload: number }
  | { type: 'RESET_USER' }
  | { type: 'LOAD_DATA' };

const initialState: AppState = {
  images: [],
  favorites: [],
  user: {
    username: 'user',
    credits: INITIAL_CREDITS,
    publicImages: [],
  },
  isLoading: false,
  error: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'ADD_IMAGE':
      const newImages = [action.payload, ...state.images];
      return { 
        ...state, 
        images: newImages,
        user: {
          ...state.user,
          credits: Math.max(0, state.user.credits - CREDITS_PER_GENERATION)
        }
      };
    
    case 'TOGGLE_FAVORITE':
      const imageId = action.payload;
      const updatedImages = state.images.map(img =>
        img.id === imageId ? { ...img, isFavorite: !img.isFavorite } : img
      );
      const updatedFavorites = updatedImages.filter(img => img.isFavorite);
      
      return {
        ...state,
        images: updatedImages,
        favorites: updatedFavorites,
      };
    
    case 'SET_IMAGES':
      return { ...state, images: action.payload };
    
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    
    case 'UPDATE_CREDITS':
      return {
        ...state,
        user: { ...state.user, credits: action.payload }
      };
    
    case 'RESET_USER':
      return {
        ...state,
        user: { ...initialState.user, credits: INITIAL_CREDITS }
      };
    
    case 'LOAD_DATA':
      return state;
    
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addImage: (image: Omit<GeneratedImage, 'id' | 'createdAt' | 'isFavorite' | 'isPublic'>) => void;
  toggleFavorite: (imageId: string) => void;
  canGenerateImage: () => boolean;
  resetCredits: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      const savedImages = localStorage.getItem(STORAGE_KEYS.GENERATED_IMAGES);
      const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (savedImages) {
        const images = JSON.parse(savedImages);
        dispatch({ type: 'SET_IMAGES', payload: images });
      }

      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        dispatch({ type: 'SET_FAVORITES', payload: favorites });
      }

      if (savedUser) {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'UPDATE_CREDITS', payload: user.credits });
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GENERATED_IMAGES, JSON.stringify(state.images));
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites));
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [state.images, state.favorites, state.user]);

  const addImage = (imageData: Omit<GeneratedImage, 'id' | 'createdAt' | 'isFavorite' | 'isPublic'>) => {
    const newImage: GeneratedImage = {
      ...imageData,
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isPublic: false,
    };
    
    dispatch({ type: 'ADD_IMAGE', payload: newImage });
  };

  const toggleFavorite = (imageId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: imageId });
  };

  const canGenerateImage = () => {
    return state.user.credits >= CREDITS_PER_GENERATION;
  };

  const resetCredits = () => {
    dispatch({ type: 'UPDATE_CREDITS', payload: INITIAL_CREDITS });
  };

  const value: AppContextType = {
    state,
    dispatch,
    addImage,
    toggleFavorite,
    canGenerateImage,
    resetCredits,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

