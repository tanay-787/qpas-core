import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { updateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, firestore } from '../../firebase.config'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        }
        setUser(userData)
        await handleRoleBasedRouting()
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      }

      // Check if user exists in Firestore
      const userDocRef = doc(firestore, "users", result.user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          ...userData,
          createdAt: new Date(),
        })
      }
      if (userDoc.data().role) {
        await handleRoleBasedRouting()
      }


      toast({
        title: "Success",
        description: "Successfully signed in with Google",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      })
    }
  }

  const signInWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      //The user's password is NOT the password used to access the user's email account. 
      toast({
        title: "Success",
        description: "Successfully signed in",
      })
      await handleRoleBasedRouting()
    } catch (error) {
      //When Email Enumeration Protection is enabled, this method fails with "auth/invalid-credential" in case of an invalid email/password.
      toast({
        title: "Failed to sign in",
        description: "Please re-check credentials and try again",
        variant: "destructive",
      })
    }
  }

  const createUserWithEmail = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user
  
      // Update the user's profile with the display name
      await updateProfile(user, { displayName })
  
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
      }
  
      // Add new user to Firestore
      const userDocRef = doc(firestore, "users", user.uid)
      await setDoc(userDocRef, {
        ...userData,
        createdAt: new Date(),
      })
  
      setUser(userData)
  
      toast({
        title: "Success",
        description: "Account created successfully",
      })
      navigate('/role-selection')
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        action: <Button onClick={() => navigate("/login")}>Head to Login Page</Button>
      })
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Success",
        description: "Successfully signed out",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }
  
  const handleRoleBasedRouting = async() => {
    try {
      if (!user) {
        toast({
          title: "Routing",
          description: "Make sure you have signed in and please try again.",
          variant: "destructive"
        })
      }
      const userDocRef = doc(firestore, "users", user.uid)
      const userDoc = await getDoc(userDocRef)
      const userData = userDoc.data()
      
      if (userData.role === "admin") {
        navigate("/admin/dashboard")
      } else if (userData.role === "teacher") {
        navigate("/teacher/dashboard")
      } else if (userData.role === "student") {
        navigate("/student/dashboard")
      } else if (!userData.role) {
        navigate("/role-selection")
      }
    } catch (error) {
      toast({
        title: "Routing",
        description: "Unable to route based on role. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        createUserWithEmail,
        logout,
        handleRoleBasedRouting
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}