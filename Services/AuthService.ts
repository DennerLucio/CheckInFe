import api from './Api';

interface LoginResponse {
  statusCode?: number;
  errorMessage?: string;
  accessToken?: string; 
  success: boolean;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/api/account/login', { email, password });

    const { success } = response.data;

    if (success) {
      return {
        success: true,
      }

    } else {

      return {
        success: false,
        errorMessage: "Login não realizado"
      }
    }

  } catch (error: any) {

    throw error;
  }
};
