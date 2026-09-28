import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Briefcase } from 'lucide-react';
import { Button, Card, Field, Input, Alert } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register } from '@/store/slices/authSlice';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register({ name, email, password }));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background p-4"
      data-icod-id="src_pages_register_tsx_0b1c">
      <Card
        className="w-full max-w-md p-8"
        data-icod-id="src_pages_register_tsx_615e">
        <div
          className="mb-6 flex flex-col items-center gap-2"
          data-icod-id="src_pages_register_tsx_dc10">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            data-icod-id="src_pages_register_tsx_c7bb">
            <Briefcase className="h-7 w-7" data-icod-id="src_pages_register_tsx_4fa3" />
          </div>
          <h1
            className="text-2xl font-bold text-foreground"
            data-icod-id="src_pages_register_tsx_c15d">Create Account</h1>
          <p
            className="text-sm text-muted-foreground"
            data-icod-id="src_pages_register_tsx_ee38">Join ClientHub CRM</p>
        </div>

        {error && (
          <Alert
            variant="error"
            className="mb-4"
            data-icod-id="src_pages_register_tsx_da0b">
            {error}
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          data-icod-id="src_pages_register_tsx_e56f">
          <Field
            label="Full Name"
            htmlFor="name"
            required
            data-icod-id="src_pages_register_tsx_9604">
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              data-icod-id="src_pages_register_tsx_1e55" />
          </Field>

          <Field
            label="Email"
            htmlFor="email"
            required
            data-icod-id="src_pages_register_tsx_f9ad">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              data-icod-id="src_pages_register_tsx_4bab" />
          </Field>

          <Field
            label="Password"
            htmlFor="password"
            required
            data-icod-id="src_pages_register_tsx_9a0f">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={6}
              data-icod-id="src_pages_register_tsx_b510" />
          </Field>

          <Button
            type="submit"
            loading={status === 'loading'}
            className="mt-2"
            data-icod-id="src_pages_register_tsx_68a5">
            <UserPlus className="h-4 w-4" data-icod-id="src_pages_register_tsx_e44d" />
            Create Account
          </Button>
        </form>

        <div
          className="mt-6 border-t border-border pt-4"
          data-icod-id="src_pages_register_tsx_c41a">
          <p
            className="text-center text-xs text-muted-foreground"
            data-icod-id="src_pages_register_tsx_b4f9">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
              data-icod-id="src_pages_register_tsx_3071">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
