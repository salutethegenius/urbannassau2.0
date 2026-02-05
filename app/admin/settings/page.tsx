import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminSettingsForm from './AdminSettingsForm';

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminSettingsForm />;
}
