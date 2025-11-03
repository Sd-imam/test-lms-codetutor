import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, TrendingUp, Award } from "lucide-react"

interface StatsCardsProps {
  totalCourses: number
  inProgress: number
  completed: number
}

/**
 * Stats Cards - Server Component
 * Displays user's learning statistics with modern design
 */
export function StatsCards({ totalCourses, inProgress, completed }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Courses",
      value: totalCourses,
      description: "Enrolled courses",
      icon: BookOpen,
      iconBgSimple: "bg-blue-500/10",
      iconColor: "text-blue-400",
      valueColor: "text-blue-400",
      progressBg: "bg-blue-500",
    },
    {
      title: "In Progress",
      value: inProgress,
      description: "Keep learning",
      icon: TrendingUp,
      iconBgSimple: "bg-purple-500/10",
      iconColor: "text-purple-400",
      valueColor: "text-purple-400",
      progressBg: "bg-purple-500",
    },
    {
      title: "Completed",
      value: completed,
      description: "Courses finished",
      icon: Award,
      iconBgSimple: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-400",
      progressBg: "bg-emerald-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card 
            key={stat.title}
            className="relative overflow-hidden card-glass hover:border-slate-600 card-hover-scale group shadow-lg hover:shadow-xl"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Subtle gradient overlay */}
            <div className="overlay-gradient-blue group-hover:opacity-100"></div>
            
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${stat.iconBgSimple} flex items-center justify-center group-hover:scale-110 transition-smooth`}>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${stat.valueColor} mb-1 sm:mb-2`}>
                {stat.value}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                {stat.description}
              </p>
              
              {/* Progress indicator line */}
              <div className="mt-3 sm:mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${stat.progressBg} rounded-full progress-blue`}
                  style={{
                    width: `${Math.min((stat.value / Math.max(totalCourses, 1)) * 100, 100)}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

