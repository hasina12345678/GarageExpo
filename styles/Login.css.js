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
    ...Shadows.medium, 
  },
  title: {
    fontSize: Fonts.h2, 
    color: Colors.gray700,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Sizes.xl,
  },
  label: {
    fontSize: Fonts.body, 
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
    fontSize: Fonts.small, 
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
    fontSize: Fonts.body, 
    textDecorationLine: 'underline',
  },
});

export default LoginStyles;