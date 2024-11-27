import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { firestore } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useInstitution } from "../context/InstitutionContext";
import { useAuth } from "../context/AuthContext";
import NavBar from "../shared-components/NavBar";

export default function AdminDashboard() {
    const { user } = useAuth()
    const { institution } = useInstitution();
    const [isLoading, setIsLoading] = useState(true)
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
                        }
                    }else{
                        throw new Error("User entry not found")
                        navigate("/")
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
    }, [user])

    return (
        <div>
            <NavBar />
            {isLoading ? (<h1>Finding your dashboard .....</h1>) : (
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, {user?.displayName}</p>
                    <p>Institution: {institution?.name}</p>
                    <img src={institution?.inst_logo_url} alt="Institution Logo" />
                </div>
            )}

        </div>
    )
}