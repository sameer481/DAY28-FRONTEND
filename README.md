# Day 28: Client-Side Routing & React Router v6 Master Guide

A comprehensive architectural and practical guide to **Client-Side Routing (SPA vs MPA)**, the **HTML5 History API**, **React Router v6 Core Mechanics**, **Nested Layouts & Outlets**, **Dynamic Route & Query Parameters**, **Protected Route Guards**, and **Data Loaders**.

---

## 📑 Table of Contents
1. [Fundamentals of Web Routing: MPA vs SPA](#1-fundamentals-of-web-routing-mpa-vs-spa)
   - [Traditional Multi-Page Applications (MPA)](#traditional-multi-page-applications-mpa)
   - [Single-Page Applications (SPA) Routing](#single-page-applications-spa-routing)
2. [Under the Hood: The HTML5 History API](#2-under-the-hood-the-html5-history-api)
   - [`pushState()`, `replaceState()`, and `popstate`](#pushstate-replacestate-and-popstate)
   - [Hash Routing (`#`) vs Browser History (`/`)](#hash-routing--vs-browser-history-)
3. [React Router v6 Core Architecture](#3-react-router-v6-core-architecture)
   - [`BrowserRouter`, `Routes`, and `Route`](#browserrouter-routes-and-route)
   - [`Link` vs `NavLink` (Active Styling)](#link-vs-navlink-active-styling)
   - [404 Not Found Catch-All Route](#404-not-found-catch-all-route)
4. [Nested Routing & Layout Architecture (`<Outlet />`)](#4-nested-routing--layout-architecture-outlet-)
5. [Dynamic Routing & Parameters](#5-dynamic-routing--parameters)
   - [Path Parameters with `useParams`](#path-parameters-with-useparams)
   - [Query Strings with `useSearchParams`](#query-strings-with-usesearchparams)
   - [Location State with `useLocation`](#location-state-with-uselocation)
6. [Programmatic Navigation with `useNavigate`](#6-programmatic-navigation-with-usenavigate)
7. [Protected Routes & Authentication Guards](#7-protected-routes--authentication-guards)
8. [React Router v6.4+ Data APIs (`createBrowserRouter`)](#8-react-router-v64-data-apis-createbrowserrouter)
   - [`loader`, `action`, and `<RouterProvider>`](#loader-action-and-routerprovider)
9. [Code-Splitting with `React.lazy()` & `<Suspense />`](#9-code-splitting-with-reactlazy--suspense-)
10. [Summary Cheat Sheet](#10-summary-cheat-sheet)

---

## 1. Fundamentals of Web Routing: MPA vs SPA

### Traditional Multi-Page Applications (MPA)
In traditional web applications (e.g. standard PHP, Django, Rails):
1. User clicks an `<a>` tag pointing to `/about`.
2. Browser makes a synchronous HTTP request to the server for `/about`.
3. Server generates and returns a complete HTML document.
4. Browser discards existing state, flashes white, and re-renders the entire page from scratch.

### Single-Page Applications (SPA) Routing
In an SPA:
1. User clicks a navigation link.
2. The router intercepts the click, preventing the default browser full-page reload (`e.preventDefault()`).
3. The router uses the **HTML5 History API** to update the URL in the address bar.
4. React conditionally unmounts the previous view and mounts the new component corresponding to the route in memory.
5. Result: **Zero page flicker, preserved application state, and instantaneous sub-millisecond view transitions.**

---

## 2. Under the Hood: The HTML5 History API

React Router relies on the browser's native **History API**:

```
Browser History Stack:
[ / ] ──pushState('/products')──► [ /products ] ──pushState('/products/42')──► [ /products/42 ]
                                         │                                            │
                                         ▲                                            │
                                         └─────────── window.history.back() ──────────┘
                                                    (Fires 'popstate' event)
```

### Core Methods:
- `window.history.pushState(state, title, url)`: Pushes a new entry onto the history stack and updates the address bar without reloading.
- `window.history.replaceState(state, title, url)`: Replaces the current history entry without pushing a new history item (great for query parameter updates or login redirects).
- `window.addEventListener('popstate', (e) => { ... })`: Fires when the user clicks the browser **Back** or **Forward** button.

---

## 3. React Router v6 Core Architecture

### Basic Setup
```jsx
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        {/* NavLink provides isActive callback for styling active links */}
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-active" : "nav-link"}
        >
          Home
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => isActive ? "nav-active" : "nav-link"}
        >
          About
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 4. Nested Routing & Layout Architecture (`<Outlet />`)

Nested routes allow child components to render inside a parent component without re-rendering persistent UI like headers, navbars, and sidebars.

```jsx
// App.jsx
<Routes>
  {/* Parent Layout Route */}
  <Route path="/dashboard" element={<DashboardLayout />}>
    {/* Index route renders at exactly /dashboard */}
    <Route index element={<DashboardOverview />} />
    {/* Child routes render inside DashboardLayout's <Outlet /> */}
    <Route path="analytics" element={<AnalyticsView />} />
    <Route path="settings" element={<SettingsView />} />
  </Route>
</Routes>

// DashboardLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <NavLink to="/dashboard" end>Overview</NavLink>
        <NavLink to="/dashboard/analytics">Analytics</NavLink>
        <NavLink to="/dashboard/settings">Settings</NavLink>
      </aside>

      <main className="content-pane">
        {/* <Outlet /> is the placeholder where child routes are injected */}
        <Outlet />
      </main>
    </div>
  );
}
```

---

## 5. Dynamic Routing & Parameters

### Path Parameters (`useParams`)
Match dynamic segments of the URL prefixed with a colon (`:`):

```jsx
// Route Definition:
<Route path="/products/:productId" element={<ProductDetails />} />

// ProductDetails.jsx:
import { useParams } from 'react-router-dom';

function ProductDetails() {
  const { productId } = useParams(); // Extracts { productId: "101" }

  return <div>Viewing Details for Product #{productId}</div>;
}
```

### Query Strings (`useSearchParams`)
Reads and writes URL search parameters (e.g. `/shop?category=shoes&sort=price`):

```jsx
import { useSearchParams } from 'react-router-dom';

function ShopCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'asc';

  const handleFilter = (newCategory) => {
    setSearchParams({ category: newCategory, sort });
  };

  return (
    <div>
      <p>Current Filter: {category} (Sorted: {sort})</p>
      <button onClick={() => handleFilter('electronics')}>Electronics</button>
    </div>
  );
}
```

---

## 6. Programmatic Navigation with `useNavigate`

Navigate imperatively in response to events (e.g. after form submission or timer completion):

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await authenticateUser();

    // Navigate to dashboard and replace history entry (user can't back-button to login)
    navigate('/dashboard', { replace: true });
    
    // Or navigate back: navigate(-1);
  };

  return <form onSubmit={handleLogin}>...</form>;
}
```

---

## 7. Protected Routes & Authentication Guards

Create an auth guard wrapper that intercepts unauthenticated requests and redirects to `/login` while preserving the intended destination:

```jsx
import { Navigate, useLocation, Outlet } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated }) {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and save the attempted location in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render child routes
  return <Outlet />;
}

// In Route Config:
<Routes>
  <Route path="/login" element={<LoginPage />} />
  
  {/* Protected Subtree */}
  <Route element={<ProtectedRoute isAuthenticated={userLoggedIn} />}>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/account" element={<AccountSettings />} />
  </Route>
</Routes>
```

---

## 8. React Router v6.4+ Data APIs (`createBrowserRouter`)

Modern React Router v6.4 introduced **Data Routers** that eliminate the "fetch-on-render" waterfall by fetching data **in parallel while the route component is loading**:

```jsx
import { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router-dom';

// 1. Define loader function
async function userLoader({ params }) {
  const res = await fetch(`/api/users/${params.userId}`);
  if (!res.ok) throw new Response('User Not Found', { status: 404 });
  return res.json();
}

// 2. Configure Router with loader
const router = createBrowserRouter([
  {
    path: '/users/:userId',
    element: <UserProfile />,
    loader: userLoader,
    errorElement: <ErrorDisplay />
  }
]);

// 3. Consume in component
function UserProfile() {
  const user = useLoaderData(); // Pre-fetched data available immediately on render!
  return <h1>{user.name}</h1>;
}

export default function App() {
  return <RouterProvider router={router} />;
}
```

---

## 9. Code-Splitting with `React.lazy()` & `<Suspense />`

Reduce initial bundle size by lazy-loading route components on demand:

```jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load route chunks:
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<div className="page-spinner">Loading Route...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

---

## 10. Summary Cheat Sheet

```
┌──────────────────────┬────────────────────────────────────────────────────────┐
│ React Router Hook    │ Primary Purpose                                        │
├──────────────────────┼────────────────────────────────────────────────────────┤
│ useParams            │ Access dynamic path segments (/users/:id)              │
│ useSearchParams      │ Read & update query strings (?sort=asc&page=2)         │
│ useNavigate          │ Programmatic imperative navigation (navigate('/home')) │
│ useLocation          │ Inspect current URL pathname, search, and state object │
│ useLoaderData        │ Retrieve data loaded by route loader function (v6.4+)  │
│ Outlet               │ Renders matching child route inside parent layout      │
└──────────────────────┴────────────────────────────────────────────────────────┘
```

---

*Author: Sameer Mohammed | 30 Days of Frontend Mastery*
