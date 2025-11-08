import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export default async function Home() {
  const [restaurant, categories] = await Promise.all([
    prisma.restaurant.findFirst(),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        items: {
          where: {
            isActive: true,
            isAvailable: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            {restaurant?.logoUrl && (
              <Image
                src={restaurant.logoUrl}
                alt={restaurant.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            )}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900">
                {restaurant?.name || 'Our Restaurant'}
              </h1>
              {restaurant?.description && (
                <p className="text-gray-600 mt-2">{restaurant.description}</p>
              )}
            </div>
          </div>
          {restaurant && (
            <div className="mt-4 text-center text-sm text-gray-600 space-y-1">
              {restaurant.address && <p>{restaurant.address}</p>}
              <div className="flex justify-center gap-4">
                {restaurant.phone && <p>Tel: {restaurant.phone}</p>}
                {restaurant.email && <p>Email: {restaurant.email}</p>}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Menu */}
      <main className="container mx-auto px-4 py-8">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Menu coming soon...
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => (
              <section key={category.id} className="scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-gray-600 mb-6">{category.description}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {item.imageUrl && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <span className="text-lg font-bold text-blue-600">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-gray-600 text-sm">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} {restaurant?.name || 'Restaurant'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
