"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Alert } from "@/components/ui/alert"
import { ArrowLeft, X, Upload } from "lucide-react"
import Link from "next/link"
import { createCourseAction } from "@/app/actions/course-actions"
import { convertToBase64, validateImageFile } from "@/lib/utils"
import Image from "next/image"

export default function CreateCoursePage() {
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState<string>("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "programming",
    level: "beginner",
    price: "",
    discount: "",
    thumbnail: "",
    stacks: [""],
    requirements: [""],
    whatYouWillLearn: [""],
  })

  // Image upload handler - Convert to base64
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate image file using utility function
    const validation = validateImageFile(file, 5)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setIsUploading(true)
    setError("")

    try {
      // Convert image to base64 using utility function
      const base64String = await convertToBase64(file)
      setImagePreview(base64String)
      // Store base64 string in form data - backend will handle upload
      setFormData({ ...formData, thumbnail: base64String })
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to process image')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    setFormData({ ...formData, thumbnail: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Create FormData for server action
    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('category', formData.category)
    data.append('level', formData.level)
    data.append('price', formData.price)
    data.append('discount', formData.discount || '0')
    data.append('thumbnail', formData.thumbnail)
    data.append('stacks', JSON.stringify(formData.stacks.filter(s => s.trim() !== "")))
    data.append('requirements', JSON.stringify(formData.requirements.filter(r => r.trim() !== "")))
    data.append('whatYouWillLearn', JSON.stringify(formData.whatYouWillLearn.filter(w => w.trim() !== "")))

    startTransition(async () => {
      try {
        const result = await createCourseAction(data)
        
        if (!result.success) {
          setError(result.error || "Failed to create course")
        }
        // On success, createCourseAction will redirect automatically to courses list with success message
      } catch (err) {
        const error = err as Error
        // Redirect errors (with digest property) are expected and should propagate
        if (error && typeof error === 'object' && 'digest' in error) {
          throw error
        }
        setError(error.message || "Failed to create course")
      }
    })
  }

  return (
    <div className="max-w-6xl mt-8">
      <div className="mb-8">
        <Link href="/instructor/courses">
          <Button variant="ghost" className="mb-4 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white">Create New Course</h1>
        <p className="text-slate-400 mt-2">Fill in all the details for your course - pricing, requirements, and learning outcomes</p>
      </div>

      <Card className="relative overflow-hidden border-slate-700/50 bg-slate-900/60 backdrop-blur-xl shadow-xl">
        <CardHeader className="relative z-10">
          <CardTitle className="text-white">Course Information</CardTitle>
          <CardDescription className="text-slate-400">
            Provide comprehensive details including pricing, technologies, requirements, and learning outcomes
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert variant="error" className="bg-red-500/10 border-red-500/30 text-red-300">{error}</Alert>}

            <Input
              label="Course Title"
              placeholder="e.g., Complete Web Development Bootcamp"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Textarea
              label="Course Description"
              placeholder="Describe what students will learn in this course..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={5}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={[
                  { value: "programming", label: "Programming" },
                  { value: "web-development", label: "Web Development" },
                  { value: "mobile-development", label: "Mobile Development" },
                  { value: "data-science", label: "Data Science" },
                  { value: "machine-learning", label: "Machine Learning & AI" },
                  { value: "design", label: "Design" },
                  { value: "ui-ux", label: "UI/UX Design" },
                  { value: "graphic-design", label: "Graphic Design" },
                  { value: "business", label: "Business" },
                  { value: "marketing", label: "Marketing" },
                  { value: "finance", label: "Finance & Accounting" },
                  { value: "photography", label: "Photography & Video" },
                  { value: "music", label: "Music" },
                  { value: "health-fitness", label: "Health & Fitness" },
                  { value: "personal-development", label: "Personal Development" },
                  { value: "office-productivity", label: "Office Productivity" },
                  { value: "teaching", label: "Teaching & Academics" },
                  { value: "lifestyle", label: "Lifestyle" },
                ]}
              />

              <Select
                label="Level"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                options={[
                  { value: "beginner", label: "Beginner" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "advanced", label: "Advanced" },
                ]}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Price ($)"
                type="number"
                min="0"
                step="0.01"
                placeholder="29.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />

              <Input
                label="Discount (%)"
                type="number"
                min="0"
                max="100"
                placeholder="10"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              />
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Course Thumbnail
              </label>
              
              {imagePreview || formData.thumbnail ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-slate-700/50 bg-slate-800/30">
                  <Image
                    src={imagePreview || formData.thumbnail}
                    alt="Course thumbnail preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-purple-400" />
                      </div>
                      <p className="mb-2 text-sm text-slate-300">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                      {isUploading && (
                        <div className="mt-4">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                          <p className="text-sm text-purple-400 mt-2">Uploading...</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-slate-950 text-slate-500">OR</span>
                    </div>
                  </div>

                  <Input
                    placeholder="Enter image URL (optional)"
                    type="url"
                    value={formData.thumbnail.startsWith('data:') ? '' : formData.thumbnail}
                    onChange={(e) => {
                      setFormData({ ...formData, thumbnail: e.target.value })
                      if (e.target.value) {
                        setImagePreview(e.target.value)
                      }
                    }}
                  />
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2">
                Upload an image (will be sent as base64 to backend) or enter URL. Leave empty to use default thumbnail.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" isLoading={isPending} disabled={isPending} className="bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg border-0">
                {isPending ? 'Creating...' : 'Create Course'}
              </Button>
              <Link href="/instructor/courses">
                <Button type="button" variant="outline" disabled={isPending} className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
