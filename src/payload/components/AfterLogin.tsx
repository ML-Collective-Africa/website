/* Under the sign-in form. There's no email service, so password resets go
   through a super admin rather than Payload's "Forgot password" email. */
export default function AfterLogin() {
  return (
    <p style={{ margin: '20px 0 0', fontSize: 14, lineHeight: 1.5, color: 'var(--mlc-muted)', textAlign: 'center' }}>
      Forgot your password? Ask a super admin to set a temporary one for you.
    </p>
  );
}
