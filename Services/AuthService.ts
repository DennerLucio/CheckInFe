import api from './Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginResponse {
  success: boolean;
  message: string;
  infos: {
    token: {
      value: string;
    };
  };
}

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await api.post<LoginResponse>('/api/account/login', { email, password });

    if (response.data.success) {
      const token = response.data.infos.token.value;
      await AsyncStorage.setItem('token', token); // salva o token
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    throw error;
  }
};
