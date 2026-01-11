import { db } from '@/lib/firebase';
import { Company } from '@/types/company';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { addDoc, updateDoc } from 'firebase/firestore/lite';

const company = {
  GetCompany: async (uid: string): Promise<Company | null> => {
    try {
      const ref = doc(db, 'companies', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return {
        id: snap.id,
        ...(snap.data() as Company),
      };
    } catch (err) {
      console.error(`GetCompany error (${uid}): ${err}`);
      return null;
    }
  },
  GetCompanies: async (): Promise<Company[]> => {
    try {
      const companiesRef = collection(db, 'companies');
      const snapshot = await getDocs(companiesRef);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Company),
      }));
    } catch (err) {
      console.error(`GetCompanies error: ${err}`);
      return [];
    }
  },
  PostCompany: async (company: Omit<Company, 'createdAt'>): Promise<void> => {
    try {
      const companiesRef = collection(db, 'companies');
      await addDoc(companiesRef, {
        ...company,
      });
    } catch (err) {
      console.error(`PostCompany error: ${err}`);
      throw err;
    }
  },
  PatchCompany: async (uid: string, company: Omit<Company, 'createdAt'>): Promise<void> => {
    try {
      const companyRef = doc(db, 'companies', uid);
      await updateDoc(companyRef, {
        ...company,
      });
    } catch (err) {
      console.error(`PatchCompany error (${uid}): ${err}`);
      throw err;
    }
  },
  DisableCompany: async (uid: string): Promise<void> => {
    try {
      const companyRef = doc(db, 'companies', uid);
      await updateDoc(companyRef, { status: 'disabled' });
    } catch (err) {
      console.error(`DisableCompany error (${uid}): ${err}`);
      throw err;
    }
  },
};

export default company;
