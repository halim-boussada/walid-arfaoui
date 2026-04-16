import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AdminLayout from '@/app/admin/dashboard/components/AdminLayout';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/admin/login');
  }

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
