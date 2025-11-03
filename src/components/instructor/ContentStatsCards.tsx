"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Video, FileQuestion, Clock } from "lucide-react"
import { formatDuration } from "@/lib/utils"

interface Chapter {
  lectures?: any[]
  quizzes?: any[]
  chapterDuration?: number
}

interface ContentStatsCardsProps {
  chapters: Chapter[]
}

export function ContentStatsCards({ chapters }: ContentStatsCardsProps) {
  const totalChapters = chapters.length
  const totalLectures = chapters.reduce((acc, ch) => acc + (ch.lectures?.length || 0), 0)
  const totalQuizzes = chapters.reduce((acc, ch) => acc + (ch.quizzes?.length || 0), 0)
  const totalDuration = chapters.reduce((acc, ch) => acc + (ch.chapterDuration || 0), 0)

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="card-glass hover:border-purple-500/30 card-hover-scale shadow-lg hover:shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="icon-sm-purple w-12 h-12">
              <BookOpen className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-400 mb-1">
            {totalChapters}
          </p>
          <p className="text-sm text-slate-400">Total Chapters</p>
        </CardContent>
      </Card>

      <Card className="card-glass hover:border-blue-500/30 card-hover-scale shadow-lg hover:shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="icon-sm-blue w-12 h-12">
              <Video className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary-light mb-1">
            {totalLectures}
          </p>
          <p className="text-sm text-slate-400">Total Lectures</p>
        </CardContent>
      </Card>

      <Card className="card-glass hover:border-yellow-500/30 card-hover-scale shadow-lg hover:shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="icon-sm-orange w-12 h-12">
              <FileQuestion className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-500 mb-1">
            {totalQuizzes}
          </p>
          <p className="text-sm text-slate-400">Total Quizzes</p>
        </CardContent>
      </Card>

      <Card className="card-glass hover:border-emerald-500/30 card-hover-scale shadow-lg hover:shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="icon-sm-emerald w-12 h-12">
              <Clock className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-400 mb-1">
            {formatDuration(totalDuration)}
          </p>
          <p className="text-sm text-slate-400">Total Duration</p>
        </CardContent>
      </Card>
    </div>
  )
}

