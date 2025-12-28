'use client';

import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function FirebaseTest() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'customers'));
        setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div>
      <h1>Firebase Test</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
