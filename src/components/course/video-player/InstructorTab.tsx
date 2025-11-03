import { CheckCircle } from "lucide-react"
import Image from "next/image"

interface InstructorTabProps {
  instructor?: {
    _id?: string
    name?: string
    avatar?: {
      url?: string
    }
    bio?: string
  }
}

export function InstructorTab({ instructor }: InstructorTabProps) {
  return (
    <div className="space-y-6">
      {/* Instructor Profile Card */}
      <div className="bg-linear-to-r from-blue-900/30 to-cyan-900/30 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            {instructor?.avatar?.url ? (
              <Image
                src={instructor.avatar.url}
                alt={instructor.name || "Instructor"}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full ring-4 ring-blue-600/30 object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-3xl font-semibold ring-4 ring-blue-600/30">
                {(instructor?.name || "I").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-linear-to-br from-blue-600 to-blue-500 border-4 border-[#0a0d14] flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </div>
          
          {/* Instructor Info */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold bg-linear-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-1">
              {instructor?.name || "Instructor"}
            </h3>
            <p className="text-sm text-blue-400 font-medium mb-3">🎓 Course Instructor</p>
            {instructor?.bio && instructor.bio.trim() ? (
              <p className="text-slate-300 text-sm leading-relaxed">
                {instructor.bio}
              </p>
            ) : instructor?.name ? (
              <p className="text-slate-500 text-sm leading-relaxed italic">
                {instructor.name} is an experienced instructor committed to providing quality education.
              </p>
            ) : (
              <p className="text-slate-500 text-sm leading-relaxed italic">
                Experienced instructor committed to providing quality education.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Instructor Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white mb-1">Expert</p>
          <p className="text-xs text-slate-400">Instructor Level</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white mb-1">4.8★</p>
          <p className="text-xs text-slate-400">Average Rating</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white mb-1">1000+</p>
          <p className="text-xs text-slate-400">Students Taught</p>
        </div>
      </div>
    </div>
  )
}

