import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase';

export const migrateCustomers = async () => {
  const customersRef = collection(db, 'customers');
  const snapshot = await getDocs(customersRef);

  let migrated = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    if (!data.customer) continue;

    const flatData = {
      ...data.customer,
    };

    try {
      const ref = doc(db, 'customers', docSnap.id);
      await updateDoc(ref, flatData);
      console.log(`Migrado: ${docSnap.id}`);
      migrated++;
    } catch (err) {
      console.error(`Error al migrar ${docSnap.id}`, err);
    }
  }

  console.log(`✅ Migración completada. Registros migrados: ${migrated}`);
};
