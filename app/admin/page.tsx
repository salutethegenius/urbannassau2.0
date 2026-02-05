import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminBookingsList from '@/components/AdminBookingsList';

async function getStats() {
  const settings = await prisma.fareSettings.findFirst({ where: { id: 1 } });
  const totalFares = await prisma.fareHistory.count();
  const recentFares = await prisma.fareHistory.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  const totalRevenue = await prisma.fareHistory.aggregate({
    _sum: { totalFare: true }
  });
  const pendingBookings = await prisma.booking.count({
    where: { status: 'pending' },
  });
  const bookingsRaw = await prisma.booking.findMany({
    orderBy: [{ bookingDate: 'asc' }, { bookingHour: 'asc' }],
    take: 30,
  });
  // Sort: pending first, then confirmed, then cancelled
  const statusOrder: Record<string, number> = { pending: 0, confirmed: 1, completed: 2, cancelled: 3 };
  const bookings = bookingsRaw.sort(
    (a, b) => (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4)
  );

  return {
    settings,
    totalFares,
    recentFares,
    totalRevenue: totalRevenue._sum.totalFare || 0,
    pendingBookings,
    bookings,
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }

  const { settings, totalFares, recentFares, totalRevenue, pendingBookings, bookings } = await getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-turquoise-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">UN</span>
                </div>
              </Link>
              <span className="text-lg font-bold text-gray-900">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user?.name || session.user?.email}
              </span>
              <Link 
                href="/api/auth/signout"
                className="text-sm text-red-600 hover:text-red-700"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-turquoise-100 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-turquoise-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Quotes</p>
                <p className="text-3xl font-bold text-gray-900">{totalFares}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Quote Value</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{pendingBookings}</p>
                <Link href="/admin#bookings" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                  Review →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings - approve/deny */}
        <div id="bookings" className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Bookings (from WhatsApp)</h2>
          <p className="text-sm text-gray-500 mb-4">
            Customers send booking requests via WhatsApp. Approve to confirm the ride (keeps slot), or Deny to free the slot for others.
          </p>
          <AdminBookingsList bookings={bookings} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Settings */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Current Fare Settings</h2>
              <Link 
                href="/admin/settings" 
                className="btn-outline !py-2 !px-4 text-sm"
              >
                Edit Settings
              </Link>
            </div>
            
            {settings ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Standard Ride</p>
                    <p className="text-2xl font-bold text-turquoise-400">
                      ${settings.rideStandardBase}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Private driver</p>
                    <p className="text-2xl font-bold text-bahamian-gold">
                      ${settings.ridePremiumBase}
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Free Distance</span>
                    <span className="font-medium">{settings.freeDistance} miles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Per Mile Rate</span>
                    <span className="font-medium">${settings.perMileRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Extra Passenger Fee</span>
                    <span className="font-medium">${settings.passengerFee}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Courier Base</span>
                    <span className="font-medium">${settings.courierBase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Errand Base</span>
                    <span className="font-medium">${settings.errandBase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shopping Base</span>
                    <span className="font-medium">${settings.shoppingBase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transport Base</span>
                    <span className="font-medium">${settings.transportBase}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No settings found. Create them in settings.</p>
            )}
          </div>

          {/* Recent Quotes */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Quotes</h2>
            
            {recentFares.length > 0 ? (
              <div className="space-y-4">
                {recentFares.map((fare) => (
                  <div 
                    key={fare.id} 
                    className="bg-gray-50 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-xs">
                        {fare.pickupAddress.split(',')[0]} → {fare.dropoffAddress.split(',')[0]}
                      </p>
                      <p className="text-sm text-gray-500">
                        {fare.distance} mi • {fare.passengers} passenger{fare.passengers > 1 ? 's' : ''} • {fare.serviceType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-turquoise-400">
                        ${fare.totalFare.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(fare.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-500">No quotes yet. They&apos;ll show up here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

