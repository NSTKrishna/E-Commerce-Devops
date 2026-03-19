/**
 * Integration tests: Login Page
 *
 * Strategy:
 *  - MSW v1 intercepts the real axios POST /auth/login at the network level.
 *  - No mocking of the authStore, api.ts, or axios — they all run as-is.
 *  - @testing-library/user-event simulates real typing & clicking.
 *
 * What is covered:
 *  1. Form renders correctly (fields, submit button)
 *  2. User fills credentials → submit → axios calls the API → success → store updated
 *  3. User submits → API returns 401 → error message shown in UI
 *  4. Submit button shows "Signing in..." while loading
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from './mswServer';
import LoginPage from '../../app/login/page';
import { useAuthStore } from '../../store/authStore';

// ── Next.js stubs ─────────────────────────────────────────────────────────────
const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));
jest.mock('next/link', () => {
  const Link = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
  return Link;
});

// ── Shadcn/Radix stubs (thin wrappers that still render content) ──────────────
// These pass through children so the form is fully functional.
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock('@/components/ui/input', () => ({
  Input: ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));
jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));
jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ id }: { id?: string }) => <input type="checkbox" id={id} />,
}));
jest.mock('@/components/ui/separator', () => ({
  Separator: () => <hr />,
}));
jest.mock('lucide-react', () => ({
  Eye: () => <span data-testid="eye-icon" />,
  EyeOff: () => <span data-testid="eye-off-icon" />,
}));

// ── Constants ─────────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:5000/api';

const MOCK_USER_RESPONSE = {
  id: 1,
  name: 'Alice Smith',
  email: 'alice@example.com',
  role: 'USER',
  token: 'valid-jwt-token',
};

// ── MSW lifecycle ─────────────────────────────────────────────────────────────
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  mockPush.mockReset();
  mockRefresh.mockReset();
  // Reset zustand store between tests
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  localStorage.clear();
});
afterAll(() => server.close());

// ── Helper ────────────────────────────────────────────────────────────────────
function renderLoginPage() {
  return render(<LoginPage />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('LoginPage – integration', () => {
  it('renders the email and password inputs and the sign-in button', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls POST /auth/login with credentials and redirects to /dashboard on success', async () => {
    const user = userEvent.setup();

    // Register the MSW handler for a successful login
    server.use(
      rest.post(`${API_BASE}/auth/login`, (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(MOCK_USER_RESPONSE))
      )
    );

    renderLoginPage();

    // Simulate user typing
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    // Simulate form submission
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert: router.push was called with the dashboard route
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    // Assert: zustand store was updated with user data
    const { user: storedUser, isAuthenticated } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(storedUser?.email).toBe('alice@example.com');
    expect(storedUser?.name).toBe('Alice Smith');
  });

  it('displays an error message when API returns 401 (invalid credentials)', async () => {
    const user = userEvent.setup();

    server.use(
      rest.post(`${API_BASE}/auth/login`, (_req, res, ctx) =>
        res(
          ctx.status(401),
          ctx.json({ message: 'Invalid email or password' })
        )
      )
    );

    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Error message should appear in the UI
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });

    // Router should NOT have navigated
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows "Signing in..." on the button while the request is in flight', async () => {
    const user = userEvent.setup();

    // Use a delayed response to observe the loading state
    server.use(
      rest.post(`${API_BASE}/auth/login`, async (_req, res, ctx) => {
        await new Promise((r) => setTimeout(r, 200));
        return res(ctx.status(200), ctx.json(MOCK_USER_RESPONSE));
      })
    );

    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert loading state immediately after click
    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();

    // Wait for it to complete
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'));
  });

  it('persists token and user to localStorage after successful login', async () => {
    const user = userEvent.setup();

    server.use(
      rest.post(`${API_BASE}/auth/login`, (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(MOCK_USER_RESPONSE))
      )
    );

    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'));

    expect(localStorage.getItem('token')).toBe('valid-jwt-token');
    expect(JSON.parse(localStorage.getItem('user') || '{}')).toMatchObject({
      email: 'alice@example.com',
      name: 'Alice Smith',
    });
  });
});
