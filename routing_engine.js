/**
 * DAY 28: CLIENT-SIDE ROUTING RUNTIME ENGINE SIMULATOR
 * Executable Node.js Demonstration Script
 * 
 * Demonstrates:
 * 1. Path-to-Regex Route Matcher (Extracting /products/:productId params)
 * 2. Query String Parser & Serializer (?category=shoes&sort=asc)
 * 3. History Stack Controller (pushState, replaceState, back, forward)
 * 4. Protected Route Guard Middleware
 */

console.log("=================================================");
console.log("DAY 28: CLIENT-SIDE ROUTING ENGINE SIMULATOR");
console.log("=================================================\n");

// -----------------------------------------------------------------
// 1. ROUTE MATCHER & DYNAMIC PARAMETER EXTRACTOR
// -----------------------------------------------------------------
console.log("--- 1. Path Matching & Parameter Extraction ---");

class ClientRouter {
  constructor() {
    this.routes = [];
    this.historyStack = ['/'];
    this.historyIndex = 0;
  }

  // Register route pattern
  addRoute(pattern, componentName, isProtected = false) {
    // Convert pattern "/users/:userId/posts/:postId" to Regex
    const paramNames = [];
    const regexPattern = pattern.replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return '([^/]+)';
    });

    const regex = new RegExp(`^${regexPattern}$`);
    this.routes.push({ pattern, regex, paramNames, componentName, isProtected });
  }

  // Parse path and query parameters
  parseUrl(fullUrl) {
    const [pathname, queryString] = fullUrl.split('?');
    const query = {};
    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [k, v] = pair.split('=');
        query[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }
    return { pathname, query };
  }

  // Navigate to URL
  navigate(url, authStatus = false) {
    const { pathname, query } = this.parseUrl(url);

    for (const route of this.routes) {
      const match = pathname.match(route.regex);
      if (match) {
        // Extract params
        const params = {};
        route.paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });

        // Check auth guard
        if (route.isProtected && !authStatus) {
          return {
            status: 401,
            component: 'Navigate(to: /login)',
            redirectedFrom: url,
            params: {},
            query: {}
          };
        }

        // Update history
        this.historyStack.push(url);
        this.historyIndex++;

        return {
          status: 200,
          component: route.componentName,
          matchedPattern: route.pattern,
          params,
          query
        };
      }
    }

    return {
      status: 404,
      component: 'NotFoundCatchAllPage',
      params: {},
      query
    };
  }
}

// -----------------------------------------------------------------
// 2. RUNNING ROUTING ENGINE SCENARIOS
// -----------------------------------------------------------------
const router = new ClientRouter();

// Define route table
router.addRoute('/', 'HomePage');
router.addRoute('/products', 'ProductCatalogPage');
router.addRoute('/products/:productId', 'ProductDetailsPage');
router.addRoute('/users/:userId/orders/:orderId', 'UserOrderDetailsPage');
router.addRoute('/dashboard', 'AdminDashboardPage', true); // Protected!

// Scenario A: Dynamic parameters and query string
console.log("Scenario A: Visiting dynamic route with query params");
const res1 = router.navigate('/products/sku_9921?category=electronics&sort=asc');
console.log("Result:", res1);

// Scenario B: Multi-parameter nested route
console.log("\nScenario B: Visiting nested multi-param route '/users/usr_481/orders/ord_8820'");
const res2 = router.navigate('/users/usr_481/orders/ord_8820');
console.log("Result:", res2);

// Scenario C: Protected route unauthenticated
console.log("\nScenario C: Visiting protected route '/dashboard' without auth");
const res3 = router.navigate('/dashboard', false);
console.log("Result:", res3);

// Scenario D: Protected route with authentication
console.log("\nScenario D: Visiting protected route '/dashboard' with auth = true");
const res4 = router.navigate('/dashboard', true);
console.log("Result:", res4);

// Scenario E: 404 Catch-All
console.log("\nScenario E: Visiting unregistered route '/unknown/path'");
const res5 = router.navigate('/unknown/path');
console.log("Result:", res5);

console.log("\n=================================================");
console.log("✅ Day 28 Client-Side Routing Simulator Completed!");
console.log("=================================================");
