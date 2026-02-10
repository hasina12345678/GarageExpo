// styles/Login.css.js
import { StyleSheet } from 'react-native';
import { Colors, Sizes, Layout, Components, Fonts, Shadows } from './Common.css'; // AJOUTER Fonts et Shadows

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
    ...Layout.center,
    paddingHorizontal: Sizes.xl,
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Sizes.xl,
    ...Shadows.medium, // UTILISER Shadows
  },
  title: {
    fontSize: Fonts.h2, // UTILISER Fonts
    color: Colors.gray700,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Sizes.xl,
  },
  label: {
    fontSize: Fonts.body, // UTILISER Fonts
    color: Colors.gray600,
    marginBottom: Sizes.xs,
    fontWeight: '500',
  },
  input: {
    ...Components.input,
    marginBottom: Sizes.md,
    width: '100%',
  },
  errorText: {
    color: Colors.danger,
    fontSize: Fonts.small, // UTILISER Fonts
    marginBottom: Sizes.sm,
    textAlign: 'center',
  },
  loginButton: {
    ...Components.button,
    width: '100%',
    marginTop: Sizes.md,
  },
  loginButtonText: {
    ...Components.buttonText,
  },
  linkContainer: {
    marginTop: Sizes.lg,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.blue,
    fontSize: Fonts.body, // UTILISER Fonts
    textDecorationLine: 'underline',
  },
});

export default LoginStyles;