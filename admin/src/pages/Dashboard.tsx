import { useEffect, useState } from 'react';
import { adminListOrders } from '@/api/orders';
import { adminListUsers } from '@/api/users';
import { getProducts } from '@/api/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ShoppingCart, Users, Package, CreditCard } from 'lucide-react';
import type { Order, User, Product } from '@/types';

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminListOrders({ limit: 50 }),
      adminListUsers({ limit: 50 }),
      getProducts({ limit: 50 }),
    ])
      .then(([ordersRes, usersRes, productsRes]) => {
        setOrders(ordersRes.data.orders ?? ordersRes.data);
        setUsers(usersRes.data.users ?? usersRes.data);
        setProducts(productsRes.data.products ?? productsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart },
    { label: 'Total Users', value: users.length, icon: Users },
    { label: 'Total Products', value: products.length, icon: Package },
    { label: 'Revenue', value: formatCurrency(totalRevenue), icon: CreditCard },
  ];

  const recentOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {loading ? '—' : s.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">ID</th>
                  <th className="pb-2 pr-4 font-medium">Amount</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-muted-foreground">
                      Loading…
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-muted-foreground">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr key={o.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">#{o.id}</td>
                      <td className="py-2 pr-4">{formatCurrency(Number(o.totalAmount))}</td>
                      <td className="py-2 pr-4">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="py-2 text-muted-foreground">{formatDate(o.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
