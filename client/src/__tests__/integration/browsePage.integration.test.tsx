/**
 * Integration tests: Browse Page
 *
 * Strategy:
 *  - MSW v1 intercepts the real axios GET /requests at the network layer.
 *  - The actual useRequestStore (Zustand) and api.ts/axios run unchanged.
 *  - Tests simulate the full user flow: page mounts → fetch fires → cards appear
 *    → user types in search → filtered results update → urgency checkbox filters.
 *
 * What is covered:
 *  1. Shows loading spinner while fetching
 *  2. Request cards appear after fetch completes
 *  3. Request title, budget, category badge, buyer name render correctly
 *  4. Typing in search box filters results in real time
 *  5. Urgency filter checkboxes filter results correctly
 *  6. "No requests found" empty state when nothing matches
 *  7. "Clear Filters" button resets search and shows all results
 */

import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from './mswServer';
import BrowsePage from '../../app/browse/page';
import { useRequestStore } from '../../store/useRequestStore';

// ── Next.js stubs ─────────────────────────────────────────────────────────────
jest.mock('next/link', () => {
  const Link = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
  return Link;
});
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// ── Heavy component stubs (let the page logic run unchanged) ──────────────────
jest.mock('@/components/header', () => ({
  Header: () => <header data-testid="site-header" />,
}));
jest.mock('@/components/footer', () => ({
  Footer: () => <footer data-testid="site-footer" />,
}));
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));
jest.mock('@/components/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));
jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span data-testid="badge">{children}</span>,
}));
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ id, checked, onCheckedChange }: { id?: string; checked?: boolean; onCheckedChange?: () => void }) => (
    <input type="checkbox" id={id} checked={checked} onChange={onCheckedChange} />
  ),
}));
jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));
jest.mock('@/components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
}));
jest.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('lucide-react', () => ({
  Search: () => <span />,
  Filter: () => <span />,
  Clock: () => <span />,
  DollarSign: () => <span />,
  Tag: () => <span />,
  Grid: () => <span />,
  List: () => <span />,
  SlidersHorizontal: () => <span />,
}));

// ── Constants ─────────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:5000/api';

const MOCK_REQUESTS = [
  {
    id: 1,
    title: 'Need a logo designer',
    description: 'Looking for a professional logo for my startup',
    category: 'Design & Creative',
    budgetRange: '$200-$500',
    urgency: 'urgent',
    offers: [],
    buyerId: 10,
    buyer: { name: 'Bob Buyer', email: 'bob@test.com' },
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Fix my React app bug',
    description: 'Bug in the useEffect hook causing re-renders',
    category: 'Services',
    budgetRange: '$100-$200',
    urgency: 'normal',
    offers: [{ id: 5 }],
    buyerId: 11,
    buyer: { name: 'Carol Client', email: 'carol@test.com' },
    createdAt: '2024-01-14T10:00:00.000Z',
    updatedAt: '2024-01-14T10:00:00.000Z',
  },
  {
    id: 3,
    title: 'Photography for event',
    description: 'Need professional photos for a corporate event',
    category: 'Photography',
    budgetRange: '$500-$1000',
    urgency: 'flexible',
    offers: [],
    buyerId: 12,
    buyer: { name: 'Dave Director', email: 'dave@test.com' },
    createdAt: '2024-01-13T10:00:00.000Z',
    updatedAt: '2024-01-13T10:00:00.000Z',
  },
];

// ── MSW lifecycle ─────────────────────────────────────────────────────────────
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
  server.resetHandlers();
  // Reset the zustand store so each test starts fresh
  useRequestStore.setState({ requests: [], isLoading: false, error: null });
});
afterAll(() => server.close());

// ── Helper ────────────────────────────────────────────────────────────────────
function setupSuccessHandler() {
  server.use(
    rest.get(`${API_BASE}/requests`, (_req, res, ctx) =>
      res(ctx.status(200), ctx.json(MOCK_REQUESTS))
    )
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('BrowsePage – integration', () => {
  it('shows a loading spinner while the API call is in flight', async () => {
    // Use a delayed handler to catch the loading state
    server.use(
      rest.get(`${API_BASE}/requests`, async (_req, res, ctx) => {
        await new Promise((r) => setTimeout(r, 150));
        return res(ctx.status(200), ctx.json(MOCK_REQUESTS));
      })
    );

    render(<BrowsePage />);

    // A spinner element should be visible while loading
    // The page shows a div with animate-spin during loading
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();

    // Wait for data to render
    await waitFor(() => {
      expect(screen.getByText('Need a logo designer')).toBeInTheDocument();
    });
  });

  it('renders all request cards after a successful GET /requests', async () => {
    setupSuccessHandler();
    render(<BrowsePage />);

    // All three titles should appear after load
    await waitFor(() => {
      expect(screen.getByText('Need a logo designer')).toBeInTheDocument();
    });

    expect(screen.getByText('Fix my React app bug')).toBeInTheDocument();
    expect(screen.getByText('Photography for event')).toBeInTheDocument();

    // Count: 3 results text
    expect(screen.getByText('3 requests found')).toBeInTheDocument();
  });

  it('renders key card details: title, buyer name, and budget', async () => {
    setupSuccessHandler();
    render(<BrowsePage />);

    await waitFor(() => {
      expect(screen.getByText('Need a logo designer')).toBeInTheDocument();
    });

    // Buyer names
    expect(screen.getByText('Bob Buyer')).toBeInTheDocument();
    expect(screen.getByText('Carol Client')).toBeInTheDocument();

    // Budgets
    expect(screen.getByText('$200-$500')).toBeInTheDocument();
    expect(screen.getByText('$100-$200')).toBeInTheDocument();
  });

  it('filters results in real time as the user types in the search box', async () => {
    setupSuccessHandler();
    const user = userEvent.setup();
    render(<BrowsePage />);

    // Wait for cards to load
    await waitFor(() => {
      expect(screen.getByText('Need a logo designer')).toBeInTheDocument();
    });

    // Get the search input and type "react"
    const searchInput = screen.getByPlaceholderText(/search requests/i);
    await user.type(searchInput, 'react');

    // Only the React-related card should remain
    expect(screen.getByText('Fix my React app bug')).toBeInTheDocument();
    expect(screen.queryByText('Need a logo designer')).not.toBeInTheDocument();
    expect(screen.queryByText('Photography for event')).not.toBeInTheDocument();

    // Results count updates
    expect(screen.getByText('1 requests found')).toBeInTheDocument();
  });

  it('shows "No requests found" when search matches nothing', async () => {
    setupSuccessHandler();
    const user = userEvent.setup();
    render(<BrowsePage />);

    await waitFor(() => {
      expect(screen.getByText('Need a logo designer')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search requests/i);
    await user.type(searchInput, 'xyznonexistent');

    expect(
      screen.getByText(/no requests found matching your criteria/i)
    ).toBeInTheDocument();
  });

  it('"Clear Filters" button resets search and shows all results again', async () => {
    setupSuccessHandler();
    const user = userEvent.setup();
    render(<BrowsePage />);

    await waitFor(() => {
      expect(screen.getByText('Need a logo designer')).toBeInTheDocument();
    });

    // Filter to nothing
    const searchInput = screen.getByPlaceholderText(/search requests/i);
    await user.type(searchInput, 'zzz-no-match');
    expect(screen.getByText(/no requests found/i)).toBeInTheDocument();

    // Click "Clear Filters"
    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    // All cards should re-appear
    await waitFor(() => {
      expect(screen.getByText('Need a logo designer')).toBeInTheDocument();
      expect(screen.getByText('Fix my React app bug')).toBeInTheDocument();
    });
    expect(screen.getByText('3 requests found')).toBeInTheDocument();
  });

  it('filters by urgency when the "urgent" checkbox is checked', async () => {
    setupSuccessHandler();
    const user = userEvent.setup();
    render(<BrowsePage />);

    await waitFor(() => {
      expect(screen.getByText('Need a logo designer')).toBeInTheDocument();
    });

    // Click the "urgent" checkbox (label id="urgent")
    await user.click(screen.getByLabelText(/urgent/i));

    // Only the urgent request should be visible
    expect(screen.getByText('Need a logo designer')).toBeInTheDocument();
    expect(screen.queryByText('Fix my React app bug')).not.toBeInTheDocument();
    expect(screen.queryByText('Photography for event')).not.toBeInTheDocument();
  });

  it('shows an axios error state when API returns 500', async () => {
    server.use(
      rest.get(`${API_BASE}/requests`, (_req, res, ctx) =>
        res(ctx.status(500), ctx.json({ message: 'Internal server error' }))
      )
    );

    render(<BrowsePage />);

    // After the failed fetch, no cards should be visible
    await waitFor(() => {
      expect(screen.getByText('0 requests found')).toBeInTheDocument();
    });

    // No cards rendered
    expect(screen.queryByTestId('card')).not.toBeInTheDocument();
  });
});
