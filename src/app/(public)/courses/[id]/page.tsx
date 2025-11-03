
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import {
  Star,
  Clock,
  Users,
  Globe,
  Award,
  PlayCircle,
  BookOpen,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { getCourseByIdServer, getCourseReviewsServer } from "@/lib/server-api";
import { EnrollmentCard } from "@/components/course/enrollment-card";
import { ChapterAccordion } from "@/components/course/chapter-accordion";
import Image from "next/image";
import type { Review } from "@/lib/types";
import { formatDuration, formatTimeAgo } from "@/lib/utils";
import { EmptyState } from "@/components/ui";
import type { Metadata } from "next";
import { getUserDTO } from "@/lib/dto";

/**
 * Course Detail Page - Server Component with Static Generation
 */

// Generate dynamic metadata for course pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const course = await getCourseByIdServer(id);
    
    return {
      title: `${course.title} | CodeTutor LMS`,
      description: course.description || `Learn ${course.title} with CodeTutor. Expert-led course with hands-on projects and practical skills.`,
      keywords: [
        course.title,
        course.category,
        "coding course",
        "programming tutorial",
        "online learning",
        ...(course.stacks || []),
      ],
      openGraph: {
        title: `${course.title} | CodeTutor LMS`,
        description: course.description || `Learn ${course.title} with CodeTutor. Expert-led course with hands-on projects.`,
        images: course.thumbnail?.url ? [
          {
            url: course.thumbnail.url,
            width: 1200,
            height: 630,
            alt: course.title,
          },
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${course.title} | CodeTutor LMS`,
        description: course.description || `Learn ${course.title} with CodeTutor.`,
        images: course.thumbnail?.url ? [course.thumbnail.url] : [],
      },
    };
  } catch {
    return {
      title: "Course | CodeTutor LMS",
      description: "Learn coding skills with CodeTutor LMS",
    };
  }
}

interface CourseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;

  // Check authentication status on server
  const user = await getUserDTO();
  const isAuthenticated = !!user;

  // Fetch course data on the server
  let course: any = null;
  let error = null;
  let reviews: Review[] = [];

  try {
    const data = await getCourseByIdServer(id);
    course = data;
  } catch (err) {
    const errorObj = err as Error;
    error = errorObj.message;
    console.error("Failed to fetch course:", err);
  }

  // Fetch reviews for the course
  if (course) {
    try {
      const reviewsData = await getCourseReviewsServer(id);
      reviews = reviewsData as Review[];
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      // Continue with empty reviews array
    }
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-12">
          <Alert
            variant="error"
            className="bg-red-900/20 border-red-500/50 text-red-400"
          >
            {error || "Course not found"}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 pt-24">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 px-3 py-2 rounded-lg hover:bg-slate-800 hover:border-yellow-500/30 transition-all">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1.5" />
                  <span className="font-semibold mr-1 text-white">
                    {course.averageRating && course.averageRating > 0 ? course.averageRating.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-slate-400">
                    ({course.reviewCount || 0} reviews)
                  </span>
                </div>
                {course.isFeatured && (
                  <Badge className="bg-blue-600 text-white border-0 shadow-lg px-3 py-1">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white leading-tight">
                {course.title}
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 mb-6 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
                <div className="flex items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 px-3 py-2 rounded-lg hover:bg-slate-800 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center mr-2">
                    <Users className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <span className="text-slate-300">
                    {course.enrollmentCount || 0} students
                  </span>
                </div>
                <div className="flex items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 px-3 py-2 rounded-lg hover:bg-slate-800 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center mr-2">
                    <Clock className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  <span className="text-slate-300">
                    {formatDuration(course.totalDuration || 0)}
                  </span>
                </div>
                {course.language && (
                  <div className="flex items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 px-3 py-2 rounded-lg hover:bg-slate-800 transition-all">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center mr-2">
                      <Globe className="h-3.5 w-3.5 text-blue-400" />
                    </div>
                    <span className="text-slate-300">{course.language}</span>
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              {course.stacks && course.stacks.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {course.stacks.map((stack: string) => (
                    <Badge
                      key={stack}
                      className="bg-slate-800/50 text-slate-300 border border-slate-700 backdrop-blur-sm hover:bg-slate-800 transition-colors"
                    >
                      {stack}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Only show instructor if it's an object with details */}
              {typeof course.instructor === "object" &&
                course.instructor?.name && (
                  <div className="flex items-center mt-6">
                    {course.instructor?.avatar?.url ? (
                      <Image
                        src={course.instructor.avatar.url}
                        alt={course.instructor?.name || "Instructor"}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full mr-3 ring-2 ring-slate-700"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3 ring-2 ring-slate-700">
                        <span className="text-white text-lg font-medium">
                          {course.instructor?.name?.charAt(0) || "I"}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-slate-400">Instructor</p>
                      <p className="font-semibold text-white">
                        {course.instructor?.name || "Unknown Instructor"}
                      </p>
                    </div>
                  </div>
                )}
            </div>

            {/* Enrollment Card - Pass auth status from server */}
            <div className="md:col-span-1">
              <EnrollmentCard
                courseId={id}
                price={course.price}
                discount={course.discount}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="md:col-span-2 space-y-8">
            {/* Detailed Description */}
            <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">
                    About This Course
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 leading-relaxed">
                    {course.description}
                  </p>
                  {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-white mb-4">What You&apos;ll Learn</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {course.whatYouWillLearn.map((item: string, index: number) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-blue-400 mr-2 shrink-0 mt-0.5" />
                            <span className="text-slate-300 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <PlayCircle className="h-5 w-5 text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">
                    Course Content
                  </CardTitle>
                </div>
                <CardDescription className="text-slate-400">
                  {course.chapters?.length || 0} chapters • {formatDuration(Math.floor((course.totalDuration || 0)))} total
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ChapterAccordion chapters={course.chapters || []} />
              </CardContent>
            </Card>

            {/* Student Reviews */}
            <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                        <Star className="h-5 w-5 text-yellow-500" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-white">
                        Student Reviews
                      </CardTitle>
                    </div>
                    <CardDescription className="text-slate-400 mt-1">
                      {course.reviewCount || 0} reviews • {course.averageRating ? course.averageRating.toFixed(1) : '0.0'} average rating
                    </CardDescription>
                  </div>
                  {course.averageRating && course.averageRating > 0 && (
                    <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-4 py-3 rounded-xl">
                      <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                      <span className="text-3xl font-bold text-white">{course.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.length > 0 ? (
                  <>
                    {reviews.map((review) => {
                      const userName = review.userName || 'Anonymous';
                      const userAvatar = review.userAvatar?.url;
                      const initials = userName
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .substring(0, 2);
                      
                      const timeAgo = formatTimeAgo(review.createdAt)

                      return (
                        <div key={review._id} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
                          <div className="flex items-start gap-4">
                            {userAvatar ? (
                              <div className="relative h-12 w-12 rounded-full shrink-0 overflow-hidden ring-2 ring-slate-700">
                                <Image
                                  src={userAvatar}
                                  alt={userName}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 ring-2 ring-slate-700">
                                <span className="text-white text-lg font-medium">{initials}</span>
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-white">{userName}</h4>
                                  <p className="text-sm text-slate-500">{timeAgo}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3.5 w-3.5 ${
                                        star <= review.rating
                                          ? "fill-yellow-500 text-yellow-500"
                                          : "fill-slate-700 text-slate-700"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-slate-300 leading-relaxed text-sm">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <EmptyState
                    icon={Star}
                    title="No Reviews Yet"
                    description="Be the first to review this course!"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Side */}
          <div className="md:col-span-1 space-y-6">
            {/* This course includes */}
            <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  This course includes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3">
                    <PlayCircle className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-slate-300">
                    {formatDuration(course.totalDuration || 0)} on-demand video
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center mr-3">
                    <BookOpen className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-slate-300">
                    {course.chapters?.length || 0} chapters
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3">
                    <Globe className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-slate-300">
                    {course.level || "All levels"}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center mr-3">
                    <Award className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-slate-300">
                    Certificate of completion
                  </span>
                </div>
                
              </CardContent>
            </Card>

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {course.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-400 mr-2 mt-0.5">•</span>
                        <span className="text-sm text-slate-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
