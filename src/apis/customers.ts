import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CustomerDocument } from '@/types/customers';

const customers = {
  GetCustomersById: async (uid: string): Promise<CustomerDocument | null> => {
    try {
      const customerDocRef = doc(db, 'customers', uid)
      const snapshot = await getDoc(customerDocRef)

      if (!snapshot.exists()) return null;

      return {
        id: snapshot.id,
        ...(snapshot.data() as Omit<CustomerDocument, 'id'>),
      };
    } catch (err) {
      console.error(`GetCustomersById error: ${err}`)
      throw err
    }
  }
}
