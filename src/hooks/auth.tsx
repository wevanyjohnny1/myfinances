import React, { createContext, ReactNode, useContext, useState } from 'react';

import * as Google from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);

  async function signInWithGoogle() {
    try {
      const result = await Google.logInAsync({
        iosClientId: '1001239958587-t02tnbbve3g9h01qul5thgklsibh23ij.apps.googleusercontent.com',
        androidClientId: '1001239958587-1ltel45mqtlen3q2243b6v7ss6u8tn5d.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      });

      if (result.type === 'success') {
        const userLogged = {
          id: String(result.user.id),
          email: result.user.email!,
          name: result.user.name!,
          photo: result.user.photoUrl!
        };

        setUser(userLogged);
        await AsyncStorage.setItem('@myfinances:user', JSON.stringify(userLogged));

      }

    } catch (error) {
      throw new Error(error)
    }
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      });

      if (credential) {
        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name: credential.fullName!.givenName!,
          photo: undefined
        };

        setUser(userLogged);
        await AsyncStorage.setItem('@myfinances:user', JSON.stringify(userLogged));
      }

    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      signInWithApple
    }}>
      { children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth }

