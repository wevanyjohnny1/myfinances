import React, { useContext } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple-icon.svg';
import GoogleSvg from '../../assets/google-icon.svg';
import LogoSvg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import { SignInSocialButton } from '../../components/SignInSocialButton';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles'
import { Alert } from 'react-native';

export function SignIn() {
  const { user, signInWithGoogle, signInWithApple } = useAuth();

  async function handleSignInButtonWithGoogle() {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar com a conta Google')
    }
  }

  async function handleSignInButtonWithApple() {
    try {
      await signInWithApple();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar com a conta Apple')
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <Title>
            Controle suas{'\n'}finanças de forma{'\n'}muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com{'\n'}uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInButtonWithGoogle}
          />

          <SignInSocialButton
            title="Entrar com Apple"
            svg={AppleSvg}
            onPress={handleSignInButtonWithApple}
          />
        </FooterWrapper>
      </Footer>

    </Container>
  )
}
