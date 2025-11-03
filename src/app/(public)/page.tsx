import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, GraduationCap, ArrowRight, Target, Clock, Sparkles } from "lucide-react"
import { getFeaturedCoursesServer } from "@/lib/server-api"
import type { Course } from "@/lib/types"
import type { Metadata } from "next"
import { FeaturedCourses } from "@/components/home/FeaturedCourses"



export default async function HomePage() {
  let featuredCourses: Course[] = []
  try {
    const data = await getFeaturedCoursesServer()
    featuredCourses = data || []
  } catch (error) {
    console.error("Failed to fetch featured courses:", error)
  }


  return (
    <div className="min-h-screen">
      {/* Hero Section - Modern Gradient Design */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-900/20 via-[#03050a] to-cyan-900/20 pt-32 pb-20 lg:pt-40 lg:pb-32">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb-blue top-20 left-10" />
          <div className="orb-cyan bottom-20 right-10" style={{ animationDelay: '1s' }} />
          <div className="orb-purple top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full px-4 py-2 backdrop-blur-sm shadow-lg shadow-blue-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-xs sm:text-sm font-bold bg-linear-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent uppercase tracking-wider">
                  Trusted by 31,000+ students worldwide
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block text-white mb-2">Unlock Your</span>
                <span className="block text-gradient-blue-cyan mb-2">
                  Coding Potential
                </span>
                <span className="block text-white">with CodeTutor</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed max-w-xl">
                Start your coding journey with expert instructors. Whether you&apos;re a beginner or looking to level up – learn practical skills with a 95% success rate.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto btn-gradient-primary group">
                    Start Learning Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-400/50 transition-smooth">
                    Browse Courses
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 sm:gap-8 pt-4 sm:pt-6">
                <div className="text-center sm:text-left">
                  <p className="text-3xl sm:text-4xl font-bold text-gradient-blue-cyan">95%</p>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Success Rate</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-3xl sm:text-4xl font-bold text-gradient-emerald">31K+</p>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Students</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-3xl sm:text-4xl font-bold text-gradient-purple">24</p>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Weeks Training</p>
                </div>
              </div>
            </div>

            {/* Right Content - Stats Card */}
            <div className="hidden lg:block">
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-smooth-slow"></div>
                <div className="relative card-dark backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-blue-500/30 transition-smooth">
                      <div className="icon-box-blue">
                        <div>
                          <GraduationCap className="w-7 h-7 text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-2xl text-gradient-blue-cyan">31,000+</p>
                        <p className="text-sm text-slate-400 font-medium">Active Students</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-violet-500/30 transition-smooth">
                      <div className="icon-box-purple">
                        <div>
                          <BookOpen className="w-7 h-7 text-violet-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-2xl text-gradient-purple">5,000+</p>
                        <p className="text-sm text-slate-400 font-medium">Expert Courses</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-emerald-500/30 transition-smooth">
                      <div className="icon-box-emerald">
                        <div>
                          <Award className="w-7 h-7 text-emerald-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-2xl text-gradient-emerald">95%</p>
                        <p className="text-sm text-slate-400 font-medium">Job Placement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-wider">Why Choose Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              What We <span className="text-gradient-blue-cyan">Offer</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto">
              Discover a world of coding possibilities with our comprehensive programs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <Card className="group relative overflow-hidden card-dark hover:border-blue-500/40 card-hover-scale">
              <div className="overlay-gradient-blue group-hover:opacity-100"></div>
              <CardHeader className="relative z-10 space-y-4 p-5 sm:p-6">
                <div className="icon-box-blue group-hover:scale-110 transition-smooth">
                  <div>
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl text-white font-bold">Learn from Industry Pros</CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-400">
                  Seasoned experts guide you through coding with real-world insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden card-dark hover:border-violet-500/40 card-hover-scale">
              <div className="overlay-gradient-purple group-hover:opacity-100"></div>
              <CardHeader className="relative z-10 space-y-4 p-5 sm:p-6">
                <div className="icon-box-purple group-hover:scale-110 transition-smooth">
                  <div>
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-violet-400" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl text-white font-bold">Comprehensive Curriculum</CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-400">
                  From basics to advanced topics, build a strong foundation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden card-dark hover:border-emerald-500/40 card-hover-scale">
              <div className="overlay-gradient-emerald group-hover:opacity-100"></div>
              <CardHeader className="relative z-10 space-y-4 p-5 sm:p-6">
                <div className="icon-box-emerald group-hover:scale-110 transition-smooth">
                  <div>
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl text-white font-bold">Hands-On Projects</CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-400">
                  Build impressive applications with real-world experience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden card-dark hover:border-orange-500/40 card-hover-scale">
              <div className="overlay-gradient-orange group-hover:opacity-100"></div>
              <CardHeader className="relative z-10 space-y-4 p-5 sm:p-6">
                <div className="icon-box-orange group-hover:scale-110 transition-smooth">
                  <div>
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl text-white font-bold">Flexible Learning</CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-400">
                  Access courses 24/7, rewind and replay as needed
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <FeaturedCourses courses={featuredCourses} />

      {/* CTA Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-dark rounded-2xl p-12 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start <span className="text-gradient-blue-cyan">Learning</span>?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of students and transform your career with CodeTutor
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto btn-gradient-primary group">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-smooth">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}


// SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://codetutor.com'),
  title: "CodeTutor LMS - Learn Coding from Industry Experts | 31,000+ Students",
  description: "Master coding skills with expert-led courses. Join 31,000+ students learning programming, web development, and more. 95% success rate. Start your coding journey today!",
  keywords: ["coding courses", "programming tutorials", "web development", "online learning", "coding bootcamp", "software development", "learn to code"],
  authors: [{ name: "CodeTutor" }],
  creator: "CodeTutor",
  publisher: "CodeTutor",
  openGraph: {
    title: "CodeTutor LMS - Learn Coding from Industry Experts",
    description: "Master coding skills with expert-led courses. Join 31,000+ students learning programming, web development, and more.",
    url: "https://codetutor.com",
    siteName: "CodeTutor LMS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeTutor LMS - Learn Coding",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeTutor LMS - Learn Coding from Industry Experts",
    description: "Master coding skills with expert-led courses. Join 31,000+ students learning programming, web development, and more.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}