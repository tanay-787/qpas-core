import React, { createContext, useContext, useEffect, useState } from 'react';
import { firestore, storage } from '../../firebase.config';
import { useAuth } from './AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const InstitutionContext = createContext();

export function useInstitution() {
  return useContext(InstitutionContext);
}

export function InstitutionProvider({ children }) {
  const [institution, setInstitution] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // Track the user's role here
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user's role and institution if a user is logged in
    const fetchUserRoleAndInstitution = async () => {
      if (user) {
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const role = userDoc.data().role;
            setUserRole(role);

            // If the user is an admin, proceed with fetching institution data
            if (role === 'admin') {
              const institutionsRef = collection(firestore, 'institutions');
              const q = query(institutionsRef, where('created_by', '==', user.uid));
              const querySnapshot = await getDocs(q);

              if (!querySnapshot.empty) {
                setInstitution(querySnapshot.docs[0].data());
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user role or institution:", error);
        }
      }
      setIsLoading(false);
    };

    fetchUserRoleAndInstitution();
  }, [user]);

  const createInstitution = async (institutionName, logo) => {
    if (!institutionName.trim() || !logo || !user || userRole !== 'admin') {
      toast({
        title: "Error",
        description: "Please fill in all fields or ensure you have admin access.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (institution) {
        toast({
          title: "Error",
          description: "An institution created by this user already exists.",
          variant: "destructive",
        });
        navigate('/admin/dashboard');
      }

      const logoRef = ref(storage, `institution-logos/${Date.now()}-${logo.name}`);
      const uploadResult = await uploadBytes(logoRef, logo);
      const logoUrl = await getDownloadURL(uploadResult.ref);

      const institutionData = {
        created_by: user.uid,
        inst_name: institutionName.trim(),
        inst_logo_url: logoUrl,
        teacherList: [],
        studentList: [],
        qpList: [],
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(firestore, 'institutions'), institutionData);
      setInstitution({ id: docRef.id, ...institutionData });

      toast({
        title: "Success",
        description: "Institution created successfully",
      });

      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Error creating institution:", error);
      toast({
        title: "Error",
        description: "Failed to create institution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InstitutionContext.Provider value={{ institution, userRole, isLoading, createInstitution }}>
      {children}
    </InstitutionContext.Provider>
  );
}
