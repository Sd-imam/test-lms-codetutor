"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, X } from "lucide-react"

interface ChapterFormProps {
  initialTitle?: string
  onSave: (title: string) => Promise<void>
  onCancel: () => void
  mode: "create" | "edit"
}

export function ChapterForm({ initialTitle = "", onSave, onCancel, mode }: ChapterFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) return
    
    try {
      setIsSaving(true)
      await onSave(title.trim())
    } catch (error) {
      console.error("Error saving chapter:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="mb-6 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50">
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Input
            placeholder="Chapter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1"
            autoFocus
          />
          <Button 
            onClick={handleSubmit}
            disabled={!title.trim() || isSaving}
            className="bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : mode === "edit" ? "Update" : "Save"}
          </Button>
          <Button 
            onClick={onCancel}
            variant="outline"
            className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

