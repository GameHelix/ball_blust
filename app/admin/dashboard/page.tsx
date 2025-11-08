import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const [categoriesCount, menuItemsCount, restaurant] = await Promise.all([
    prisma.category.count(),
    prisma.menuItem.count(),
    prisma.restaurant.findFirst(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-md bg-blue-500 p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Categories
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {categoriesCount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-md bg-green-500 p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Menu Items
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {menuItemsCount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-md bg-purple-500 p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Restaurant Setup
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {restaurant ? 'Complete' : 'Incomplete'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="/admin/dashboard/categories"
            className="block p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Manage Categories</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add, edit, or remove menu categories
            </p>
          </a>
          <a
            href="/admin/dashboard/menu-items"
            className="block p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Manage Menu Items</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add, edit, or remove menu items
            </p>
          </a>
          <a
            href="/admin/dashboard/restaurant"
            className="block p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Restaurant Settings</h3>
            <p className="text-sm text-gray-500 mt-1">
              Update restaurant info and logo
            </p>
          </a>
          <a
            href="/"
            target="_blank"
            className="block p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
            <h3 className="font-medium text-gray-900">View Public Menu</h3>
            <p className="text-sm text-gray-500 mt-1">
              See how your menu looks to customers
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
