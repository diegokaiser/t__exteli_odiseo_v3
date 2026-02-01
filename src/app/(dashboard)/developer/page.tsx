'use client';
import { withAuth } from '@/hocs/withAuth';
import { migrateCustomers } from '@/utils/migrations/migrateCustomers';

const DeveloperPage = () => {
  const handleRunMigration = async () => {
    const confirmed = confirm(
      '¿Estás seguro de migrar los registros de clientes? Esta operación es irreversible.'
    );
    if (!confirmed) return;

    await migrateCustomers();
    alert('Migración completada.');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Migrar Clientes</h2>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleRunMigration}>
        Ejecutar migración
      </button>
    </div>
  );
};

export default withAuth(DeveloperPage);
