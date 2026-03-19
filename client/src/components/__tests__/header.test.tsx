/**
 * Unit tests for <Header /> component
 *
 * Mocks:
 *  - next/link          → plain <a> anchor
 *  - next/navigation    → stubbed useRouter
 *  - @/store/authStore  → controllable useAuthStore
 *  - lucide-react icons → lightweight stubs
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../header';

// ── Mock next/link ───────────────────────────────────────────────────────────
jest.mock('next/link', () => {
  const Link = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
  Link.displayName = 'MockLink';
  return Link;
});

// ── Mock next/navigation ─────────────────────────────────────────────────────
const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

// ── Mock Zustand auth store ──────────────────────────────────────────────────
const mockLogout = jest.fn();
let mockUser: { name: string; email: string } | null = null;
const mockCheckAuth = jest.fn();

jest.mock('@/store/authStore', () => ({
  useAuthStore: () => ({
    user: mockUser,
    logout: mockLogout,
    checkAuth: mockCheckAuth,
  }),
}));

// ── Mock Radix UI / shadcn components that are hard to render in jsdom ───────
jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <div onClick={onClick}>{children}</div>
  ),
  DropdownMenuSeparator: () => <hr />,
}));

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AvatarFallback: ({ children }: { children: React.ReactNode }) => <span data-testid="avatar-fallback">{children}</span>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void; [key: string]: unknown }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

// ── Tests ────────────────────────────────────────────────────────────────────
describe('<Header />', () => {
  beforeEach(() => {
    mockUser = null;
    jest.clearAllMocks();
  });

  it('renders the BidBoard brand name', () => {
    render(<Header />);
    expect(screen.getByText('BidBoard')).toBeInTheDocument();
  });

  it('shows Log in and Sign up buttons when no user is logged in', async () => {
    mockUser = null;
    render(<Header />);
    expect((await screen.findAllByText('Log in')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText('Sign up')).length).toBeGreaterThan(0);
  });

  it("shows the user's initials in the Avatar when authenticated", async () => {
    mockUser = { name: 'Alice Smith', email: 'alice@example.com' };
    render(<Header />);
    const avatars = await screen.findAllByTestId('avatar-fallback');
    // First avatar visible on desktop
    expect(avatars[0]).toHaveTextContent('AS');
  });

  it('shows single-word name initial when user has one name', async () => {
    mockUser = { name: 'Alice', email: 'alice@example.com' };
    render(<Header />);
    const avatars = await screen.findAllByTestId('avatar-fallback');
    expect(avatars[0]).toHaveTextContent('A');
  });

  it('calls logout and router.push("/") when Sign out is clicked', async () => {
    mockUser = { name: 'Alice Smith', email: 'alice@example.com' };
    render(<Header />);

    const signOutButton = await screen.findAllByText('Sign out');
    fireEvent.click(signOutButton[0]);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('shows Browse Requests nav link', () => {
    render(<Header />);
    const links = screen.getAllByText('Browse Requests');
    expect(links.length).toBeGreaterThan(0);
  });
});
