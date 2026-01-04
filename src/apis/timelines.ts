import { db } from '@/lib/firebase';
import { Line, Timeline } from '@/types/timelines';
import { collection, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';

const timelines = {
  GetLine: async (uid: string): Promise<Line[] | null> => {
    try {
      const lineDocRef = collection(db, 'timelines', uid, 'lines');
      const q = query(lineDocRef, orderBy('createdAt', 'asc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Line),
      }));
    } catch (err) {
      console.error(`GetLine error: ${err}`);
      throw err;
    }
  },
  GetLines: async (): Promise<Timeline[]> => {
    try {
      const linesRef = collection(db, 'lines');
      const snapshot = await getDocs(linesRef);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Timeline),
      }));
    } catch (err) {
      console.error(`GetLines error: ${err}`);
      throw err;
    }
  },
  PostLine: async (
    uid: string,
    line: Omit<Timeline, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; id: string } | null> => {
    try {
      const lineDocRef = doc(collection(db, 'timelines', uid, 'lines'));
      await setDoc(lineDocRef, line);
      return {
        success: true,
        id: lineDocRef.id,
      };
    } catch (err) {
      console.error(`PostLine error: ${err}`);
      throw err;
    }
  },
  PostTimeline: async (timeline: Omit<Timeline, 'updatedAt'>) => {
    try {
      const timelineDocRef = doc(collection(db, 'timelines'));
      //const timelineDocRef = doc(collection(db, 'timelines-test'));
      const timelineUid = timelineDocRef.id;

      const linesDocRef = doc(collection(db, `timelines/${timelineUid}/lines`));
      //const linesDocRef = doc(collection(db, `timelines-test/${timelineUid}/lines`));
      const linesUid = linesDocRef.id;

      await setDoc(linesDocRef, {
        ...timeline,
        uid: linesUid,
      });
      return timelineDocRef;
    } catch (err) {
      console.error(`PostTimeline error: ${err}`);
      throw err;
    }
  },
};

export default timelines;
