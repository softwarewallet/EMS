import { FirebaseService } from './src/services/firebaseService';
import { db } from './src/config/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function checkDb() {
  try {
    const tenantsCol = collection(db, 'tenants');
    const snapshot = await getDocs(tenantsCol);
    console.log("=== TENANTS IN FIRESTORE ===");
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`Tenant ID: ${doc.id}`);
      console.log(`  Name: ${data.name}`);
      console.log(`  Code: ${data.code}`);
      console.log(`  Enabled Modules:`, data.enabledModules);
    });

    const usersCol = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCol);
    console.log("\n=== USERS IN FIRESTORE ===");
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`User: ${data.displayName} (${data.email})`);
      console.log(`  Role Assignments:`, data.roleAssignments?.map((ra: any) => `${ra.roleCode} (${ra.tenantId})`));
    });
  } catch (err: any) {
    console.error("Error reading Firestore:", err);
  }
}

checkDb();
