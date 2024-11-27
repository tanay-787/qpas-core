import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { firestore } from "../../firebase.config"
import { doc, getDoc, collection, getDocs } from "firebase/firestore"
import { useInstitution } from "../context/InstitutionContext"
import { useAuth } from "../context/AuthContext"
import NavBar from "../shared-components/NavBar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Settings, Users, Clock } from "lucide-react"

export default function AdminDashboard() {
  const { user } = useAuth()
  const { institution } = useInstitution()
  const [isLoading, setIsLoading] = useState(true)
  const [members, setMembers] = useState({ teachers: [], students: [] })
  const [waitingList, setWaitingList] = useState([])
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(firestore, "users", user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const role = userDoc.data().role

            if (role !== "admin") {
              toast({
                title: "Unauthorized Access",
                description: "You do not have access to this page",
                variant: "destructive",
              })
              navigate("/")
            } else if (role === "admin" && !institution) {
              navigate("/admin/create-institution")
            } else {
              await fetchMembers()
              await fetchWaitingList()
              setIsLoading(false)
            }
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to verify user role. Please try again.",
            variant: "destructive",
          })
          console.error("Error fetching user role:", error)
          navigate("/")
        }
      }
    }

    fetchUserRole()
  }, [user, institution])

  const fetchMembers = async () => {
    if (institution) {
      const teachersRef = collection(firestore, `institutions/${institution.id}/teachers`)
      const studentsRef = collection(firestore, `institutions/${institution.id}/students`)

      const [teachersSnapshot, studentsSnapshot] = await Promise.all([
        getDocs(teachersRef),
        getDocs(studentsRef)
      ])

      setMembers({
        teachers: teachersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        students: studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      })
    }
  }

  const fetchWaitingList = async () => {
    if (institution) {
      const waitingRef = collection(firestore, `institutions/${institution.id}/waiting`)
      const waitingSnapshot = await getDocs(waitingRef)
      setWaitingList(waitingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Finding your dashboard...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Institution Profile</TabsTrigger>
            <TabsTrigger value="members">Member Management</TabsTrigger>
            <TabsTrigger value="waiting">Waiting Lobby</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Institution Profile</CardTitle>
                <CardDescription>Overview of the institution's details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={institution?.inst_logo_url} alt={institution?.name} />
                    <AvatarFallback>{institution?.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{institution?.name}</h2>
                    <p className="text-sm text-muted-foreground">Created on: {institution?.createdAt.toDate().toLocaleDateString()}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Member Management</CardTitle>
                <CardDescription>View and manage teachers and students</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="teachers">
                  <TabsList>
                    <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                  </TabsList>
                  <TabsContent value="teachers">
                    <ScrollArea className="h-[300px] w-full">
                      {members.teachers.map(teacher => (
                        <div key={teacher.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <Avatar className="w-10 h-10 mr-2">
                              <AvatarImage src={teacher.photoURL} />
                              <AvatarFallback>{teacher.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{teacher.displayName}</p>
                              <p className="text-sm text-muted-foreground">{teacher.email}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Manage</Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="students">
                    <ScrollArea className="h-[300px] w-full">
                      {members.students.map(student => (
                        <div key={student.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <Avatar className="w-10 h-10 mr-2">
                              <AvatarImage src={student.photoURL} />
                              <AvatarFallback>{student.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.displayName}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Manage</Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="waiting">
            <Card>
              <CardHeader>
                <CardTitle>Waiting Lobby</CardTitle>
                <CardDescription>Review and approve pending applications</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full">
                  {waitingList.map(applicant => (
                    <div key={applicant.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Avatar className="w-10 h-10 mr-2">
                          <AvatarImage src={applicant.photoURL} />
                          <AvatarFallback>{applicant.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{applicant.displayName}</p>
                          <p className="text-sm text-muted-foreground">{applicant.email}</p>
                          <p className="text-xs text-muted-foreground">Role: {applicant.role}</p>
                        </div>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" className="mr-2">Approve</Button>
                        <Button variant="ghost" size="sm">Reject</Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}