import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { storage, firestore } from '../../firebase.config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { useInstitution } from '../context/InstitutionContext'

export default function CreateInstitution() {
  const [institutionName, setInstitutionName] = useState('')
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { createInstitution, isLoading } = useInstitution();

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setLogoPreview(previewUrl)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!institutionName.trim() || !logo) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })

      return
    }
    await createInstitution(institutionName, logo)
  }
  

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create Institution</CardTitle>
          <CardDescription>
            Create a new institution by providing the required information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="institutionName">Institution Name</Label>
              <Input
                id="institutionName"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Institution Logo</Label>
              <div className="flex flex-col items-center gap-4">
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-32 h-32 object-contain rounded-lg border"
                  />
                )}
                <div className="w-full">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    required
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Create Institution
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}