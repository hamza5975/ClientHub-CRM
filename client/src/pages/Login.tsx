import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Briefcase } from 'lucide-react';
import { Button, Card, Field, Input, Alert } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, clearError } from '@/store/slices/authSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@clienthub.com');
    setPassword('Admin@1234');
    dispatch(clearError());
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background p-4"
      data-icod-id="src_pages_login_tsx_f500">
      <Card className="w-full max-w-md p-8" data-icod-id="src_pages_login_tsx_2968">
        <div
          className="mb-6 flex flex-col items-center gap-2"
          data-icod-id="src_pages_login_tsx_7bd5">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            data-icod-id="src_pages_login_tsx_15c5">
            <Briefcase className="h-7 w-7" data-icod-id="src_pages_login_tsx_ee0b" />
          </div>
          <h1
            className="text-2xl font-bold text-foreground"
            data-icod-id="src_pages_login_tsx_aa9b">ClientHub</h1>
          <p
            className="text-sm text-muted-foreground"
            data-icod-id="src_pages_login_tsx_cc36">Sign in to your CRM account</p>
        </div>

        {error && (
          <Alert variant="error" className="mb-4" data-icod-id="src_pages_login_tsx_f8a2">
            {error}
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          data-icod-id="src_pages_login_tsx_04b4">
          <Field
            label="Email"
            htmlFor="email"
            required
            data-icod-id="src_pages_login_tsx_420f">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              data-icod-id="src_pages_login_tsx_9d26" />
          </Field>

          <Field
            label="Password"
            htmlFor="password"
            required
            data-icod-id="src_pages_login_tsx_3ae8">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              data-icod-id="src_pages_login_tsx_13f3" />
          </Field>

          <Button
            type="submit"
            loading={status === 'loading'}
            className="mt-2"
            data-icod-id="src_pages_login_tsx_9591">
            <LogIn className="h-4 w-4" data-icod-id="src_pages_login_tsx_1f75" />
            Sign In
          </Button>
        </form>

        <div
          className="mt-6 border-t border-border pt-4"
          data-icod-id="src_pages_login_tsx_c1b4">
          <p
            className="mb-3 text-center text-xs text-muted-foreground"
            data-icod-id="src_pages_login_tsx_0502">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
              data-icod-id="src_pages_login_tsx_866d">
              Create one
            </Link>
          </p>

          <div
            className="rounded-lg bg-muted/50 p-3"
            data-icod-id="src_pages_login_tsx_1286">
            <p
              className="mb-2 text-xs font-medium text-muted-foreground"
              data-icod-id="src_pages_login_tsx_9425">Demo login:</p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full cursor-pointer rounded bg-background p-2 text-left text-xs text-foreground transition-colors hover:bg-accent"
              data-icod-id="src_pages_login_tsx_8c51">
              admin@clienthub.com / Admin@1234
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
