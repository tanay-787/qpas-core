import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, BookOpen, School } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from './context/AuthContext'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { firestore } from '../firebase.config'
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'

const roles = [
  {
    title: "Admin",
    description: "Manage the entire institution",
    icon: <Users className="h-6 w-6" />,
    capabilities: [
      "Create and manage institution profile",
      "Manage teachers waiting lobby",
      "Manage institution members",
      "Create and assign courses",
      "Generate reports and analytics"
    ]
  },
  {
    title: "Teacher",
    description: "Educate and manage students",
    icon: <BookOpen className="h-6 w-6" />,
    capabilities: [
      "Create and manage courses",
      "Assign and grade assignments",
      "Conduct online classes",
      "Track student progress",
      "Communicate with students and parents"
    ]
  },
  {
    title: "Student",
    description: "Learn and grow",
    icon: <School className="h-6 w-6" />,
    capabilities: [
      "Access assigned courses",
      "Submit assignments and projects",
      "Participate in online classes",
      "Track personal progress",
      "Communicate with teachers"
    ]
  }
]

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { user, handleRoleBasedRouting } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()


  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setIsConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!user || !selectedRole) return

    try {
      const userDocRef = doc(firestore, "users", user.uid)
      await updateDoc(userDocRef, {
        role: selectedRole.title.toLowerCase()
      })
      
      toast({
        title: "Role Updated",
        description: `Your role has been set to ${selectedRole.title}`,
      })
      await handleRoleBasedRouting()
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "Failed to update your role. Please try again.",
        variant: "destructive",
      })
    }

    setIsConfirmOpen(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Select Your Role</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {role.icon}
                  <CardTitle>{role.title}</CardTitle>
                </div>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="list-inside space-y-2">
                  {role.capabilities.map((capability, capIndex) => (
                    <li key={capIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button className="w-full" onClick={() => handleRoleSelect(role)}>
                  Select {role.title} Role
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Selection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to select the role of {selectedRole?.title}? 
              This will update your user profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}