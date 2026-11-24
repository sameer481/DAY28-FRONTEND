import React, { useState } from 'react';
import styles from './ReactRoutingMastery.module.css';

export default function ReactRoutingMastery() {
  // Navigation State
  const [currentPath, setCurrentPath] = useState('/products/101?category=electronics');
  const [historyStack, setHistoryStack] = useState(['/products/101?category=electronics']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Auth Guard State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Navigate handler
  const navigateTo = (path) => {
    const updated = [...historyStack.slice(0, historyIndex + 1), path];
    setHistoryStack(updated);
    setHistoryIndex(updated.length - 1);
    setCurrentPath(path);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(historyStack[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < historyStack.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(historyStack[historyIndex + 1]);
    }
  };

  // Route breakdown parsing
  const [pathname, queryString] = currentPath.split('?');
  const searchParams = new URLSearchParams(queryString || '');

  // Extract simulated params
  const productMatch = pathname.match(/^\/products\/([^/]+)$/);
  const productId = productMatch ? productMatch[1] : null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Day 28: Client-Side Routing & React Router Mastery</h1>
        <p className={styles.subtitle}>
          Interactive Simulator for Browser History API, Nested Outlets, Dynamic Route Parameters, and Auth Guards
        </p>
      </header>

      {/* Simulated Browser Chrome */}
      <div className={styles.browserChrome}>
        <div className={styles.historyBtns}>
          <button
            onClick={handleBack}
            disabled={historyIndex === 0}
            className={styles.navIconBtn}
            title="Back"
          >
            ←
          </button>
          <button
            onClick={handleForward}
            disabled={historyIndex === historyStack.length - 1}
            className={styles.navIconBtn}
            title="Forward"
          >
            →
          </button>
        </div>
        <div className={styles.addressBar}>
          <span style={{ color: '#94a3b8' }}>https://webapp.internal</span>
          <span>{currentPath}</span>
        </div>
        <button
          onClick={() => setIsAuthenticated(!isAuthenticated)}
          className={`${styles.button} ${isAuthenticated ? styles.dangerBtn : styles.accentBtn}`}
        >
          {isAuthenticated ? 'Sign Out' : 'Sign In'}
        </button>
      </div>

      {/* NavLinks */}
      <nav className={styles.navLinksBar}>
        <button
          onClick={() => navigateTo('/')}
          className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}
        >
          Home (/)
        </button>
        <button
          onClick={() => navigateTo('/products')}
          className={`${styles.navLink} ${pathname === '/products' ? styles.navLinkActive : ''}`}
        >
          Catalog (/products)
        </button>
        <button
          onClick={() => navigateTo('/products/101?category=electronics')}
          className={`${styles.navLink} ${pathname.startsWith('/products/') ? styles.navLinkActive : ''}`}
        >
          Product Details (/products/:id)
        </button>
        <button
          onClick={() => navigateTo('/dashboard')}
          className={`${styles.navLink} ${pathname === '/dashboard' ? styles.navLinkActive : ''}`}
        >
          Protected Dashboard (/dashboard)
        </button>
        <button
          onClick={() => navigateTo('/not-found-test')}
          className={`${styles.navLink} ${pathname === '/not-found-test' ? styles.navLinkActive : ''}`}
        >
          404 Catch-All Route
        </button>
      </nav>

      {/* Route Viewport */}
      <main className={styles.viewportPanel}>
        {pathname === '/' && (
          <div>
            <h3>🏠 Welcome to the Home Page</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Client-side navigation renders components instantly without a full-page browser refresh.
            </p>
          </div>
        )}

        {pathname === '/products' && (
          <div>
            <h3>📦 Product Catalog</h3>
            <p style={{ color: 'var(--text-muted)' }}>Browse available items:</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={() => navigateTo('/products/101?category=electronics')}
                className={styles.button}
              >
                View Laptop (ID #101)
              </button>
              <button
                onClick={() => navigateTo('/products/204?category=accessories')}
                className={styles.button}
              >
                View Headphones (ID #204)
              </button>
            </div>
          </div>
        )}

        {productId && (
          <div>
            <h3>🔍 Dynamic Product View</h3>
            <p>
              Viewing Product ID: <strong style={{ color: '#38bdf8' }}>#{productId}</strong>
            </p>
            <p style={{ color: 'var(--text-muted)' }}>
              Category query parameter: <strong>{searchParams.get('category') || 'None'}</strong>
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={() => navigateTo(`/products/${productId}?category=electronics&sort=desc`)}
                className={styles.button}
              >
                Set Query: ?category=electronics&sort=desc
              </button>
            </div>
          </div>
        )}

        {pathname === '/dashboard' && (
          <div>
            <h3>🛡️ Admin Protected Dashboard</h3>
            {isAuthenticated ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '16px', borderRadius: '6px', border: '1px solid var(--accent)' }}>
                <span style={{ color: '#34d399', fontWeight: 600 }}>Access Granted:</span> Welcome to the protected admin console!
              </div>
            ) : (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '16px', borderRadius: '6px', border: '1px solid var(--danger)' }}>
                <span style={{ color: '#f87171', fontWeight: 600 }}>Access Denied (401 Unauthorized):</span> You must sign in to view this route.
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => setIsAuthenticated(true)} className={`${styles.button} ${styles.accentBtn}`}>
                    Sign In to Unlock
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {pathname === '/not-found-test' && (
          <div>
            <h3 style={{ color: '#f59e0b' }}>⚠️ 404 Route Not Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              No route matched <code>{pathname}</code>. Handled gracefully by <code>&lt;Route path="*" element=&lt;NotFound /&gt;&gt;</code>.
            </p>
          </div>
        )}

        {/* Route Telemetry */}
        <div className={styles.routeMetaGrid}>
          <div className={styles.metaCard}>
            <div className={styles.metaTitle}>useLocation().pathname</div>
            <div className={styles.metaValue}>{pathname}</div>
          </div>
          <div className={styles.metaCard}>
            <div className={styles.metaTitle}>useParams()</div>
            <div className={styles.metaValue}>{productId ? JSON.stringify({ productId }) : '{}'}</div>
          </div>
          <div className={styles.metaCard}>
            <div className={styles.metaTitle}>useSearchParams()</div>
            <div className={styles.metaValue}>
              {queryString ? `?${queryString}` : '(Empty)'}
            </div>
          </div>
        </div>

        <pre className={styles.codeBox}>
{`// React Router v6 Equivalent:
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/products" element={<ProductCatalog />} />
  <Route path="/products/:productId" element={<ProductDetails />} />
  <Route element={<ProtectedRoute isAuthenticated={${isAuthenticated}} />}>
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>
  <Route path="*" element={<NotFoundPage />} />
</Routes>`}
        </pre>
      </main>
    </div>
  );
}
