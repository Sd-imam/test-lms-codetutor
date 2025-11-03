"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  ChevronLeft, 
  ChevronDown,
  ChevronRight,
  GripVertical, 
  PlayCircle,
  BookOpen
} from "lucide-react"
import { 
  createChapterAction, 
  updateChapterAction, 
  deleteChapterAction,
  createLectureAction,
  updateLectureAction,
  deleteLectureAction
} from "@/app/actions/course-actions"
import { apiClient } from "@/lib/api-client"
import { extractYouTubeVideoId, extractVideoInfoFromPlayer } from "@/lib/youtube"
import { formatDuration } from "@/lib/utils"
import Link from "next/link"
import { LoadingCard, EmptyState } from "@/components/ui"
import { 
  ChapterForm, 
  QuizForm, 
  LectureForm, 
  ContentStatsCards,
  ChapterHeader,
  ContentList,
  QuizEditModal,
  LectureEditModal
} from "@/components/instructor"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Sortable Chapter Component
function SortableChapter({ 
  chapter, 
  children 
}: { 
  chapter: Chapter
  children: (props: { attributes: any; listeners: any; setActivatorNodeRef: any }) => React.ReactNode 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners, setActivatorNodeRef })}
    </div>
  )
}

interface Question {
  questionText: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface Quiz {
  _id: string
  title: string
  order: number
  duration: number
  questions: Question[]
  type: 'quiz'
}

interface Lecture {
  _id: string
  title: string
  videoUrl: string
  duration: number
  order: number
  isPreview: boolean
  resources?: string
  type: 'lecture'
}

type ContentItem = Lecture | Quiz

interface Chapter {
  _id: string
  title: string
  order: number
  chapterDuration: number
  lectures?: Lecture[]
  quizzes?: Quiz[]
  content?: ContentItem[]  // Mixed lectures and quizzes sorted by order
}

export default function CourseContentPage() {
  const params = useParams()
  const courseId = params.id as string

  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [activeId, setActiveId] = useState<string | null>(null)

  // Chapter form state
  const [isAddingChapter, setIsAddingChapter] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState("")
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null)
  const [editChapterTitle, setEditChapterTitle] = useState("")

  // Content form state
  const [addingLectureToChapter, setAddingLectureToChapter] = useState<string | null>(null)
  const [addingQuizToChapter, setAddingQuizToChapter] = useState<string | null>(null)
  const [newLecture, setNewLecture] = useState({
    title: "",
    videoUrl: "",
    duration: 0,
    isPreview: false,
    resources: ""
  })
  const [isFetchingVideoInfo, setIsFetchingVideoInfo] = useState(false)
  
  // Modal edit states
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)

  // Quiz form state
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    questions: [{ questionText: "", options: ["", ""], correctAnswer: 0, explanation: "" }]
  })

  const fetchChapters = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      // Cookies sent automatically via credentials: "include"
      const response = await apiClient.getCourseChapters(courseId)
      
      // Backend now returns chapters array directly in response.data
      const chaptersArray = Array.isArray(response.data) ? response.data as Chapter[] : []
      setChapters(chaptersArray.sort((a, b) => a.order - b.order))
    } catch (err) {
      console.error("Failed to fetch chapters:", err)
      setError("Failed to load course content. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    fetchChapters()
  }, [fetchChapters])

  // Chapter CRUD operations using Server Actions
  const [, startTransition] = useTransition()

  const handleCreateChapter = async () => {
    if (!newChapterTitle.trim()) return
    
    const order = chapters.length + 1
    const formData = new FormData()
    formData.append('title', newChapterTitle)
    formData.append('order', order.toString())
    
    startTransition(async () => {
      try {
        const result = await createChapterAction(courseId, formData)
        
        if (result.success) {
          setNewChapterTitle("")
          setIsAddingChapter(false)
          await fetchChapters()
          
          // Auto-expand the newly created chapter
          if (result.data && typeof result.data === 'object' && '_id' in result.data) {
            setExpandedChapters(prev => new Set(prev).add((result.data as { _id: string })._id))
          }
        } else {
          alert(result.error || "Failed to create chapter")
        }
      } catch (err) {
        console.error("Failed to create chapter:", err)
        alert("Failed to create chapter")
      }
    })
  }

  const handleUpdateChapter = async (chapterId: string) => {
    if (!editChapterTitle.trim()) return
    
    const formData = new FormData()
    formData.append('title', editChapterTitle)
    
    startTransition(async () => {
      try {
        const result = await updateChapterAction(courseId, chapterId, formData)
        
        if (result.success) {
          setEditingChapterId(null)
          setEditChapterTitle("")
          fetchChapters()
        } else {
          alert(result.error || "Failed to update chapter")
        }
      } catch (err) {
        console.error("Failed to update chapter:", err)
        alert("Failed to update chapter")
      }
    })
  }

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Are you sure? This will delete all lectures in this chapter.")) return
    
    startTransition(async () => {
      try {
        const result = await deleteChapterAction(courseId, chapterId)
        
        if (result.success) {
          fetchChapters()
        } else {
          alert(result.error || "Failed to delete chapter")
        }
      } catch (err) {
        console.error("Failed to delete chapter:", err)
        alert("Failed to delete chapter")
      }
    })
  }

  // Content item operations
  const handleCreateLecture = async (chapterId: string) => {
    if (!newLecture.title.trim() || !newLecture.videoUrl.trim()) {
      alert("Title and video URL are required")
      return
    }
    
    const formData = new FormData()
    formData.append('title', newLecture.title)
    formData.append('videoUrl', newLecture.videoUrl)
    formData.append('duration', newLecture.duration.toString())
    formData.append('isPreview', newLecture.isPreview.toString())
    formData.append('resources', newLecture.resources || '')
    
    startTransition(async () => {
      try {
        const result = await createLectureAction(courseId, chapterId, formData)
        
        if (result.success) {
          setNewLecture({
            title: "",
            videoUrl: "",
            duration: 0,
            isPreview: false,
            resources: ""
          })
          setAddingLectureToChapter(null)
          fetchChapters()
        } else {
          alert(result.error || "Failed to create lecture")
        }
      } catch (err) {
        console.error("Failed to create lecture:", err)
        alert("Failed to create lecture")
      }
    })
  }

  const handleCreateQuiz = async (chapterId: string) => {
    if (!newQuiz.title.trim()) {
      alert("Quiz title is required")
      return
    }
    
    // Validate questions
    const validQuestions = newQuiz.questions.filter(q => 
      q.questionText.trim() && q.options.filter(o => o.trim()).length >= 2
    )
    
    if (validQuestions.length === 0) {
      alert("Please add at least one question with 2 or more options")
      return
    }
    
    try {
      // No need to calculate order - backend handles it automatically
      await apiClient.createQuiz({
        course: courseId,
        chapter: chapterId,
        title: newQuiz.title,
        // order is omitted - backend will auto-calculate
        questions: validQuestions.map(q => ({
          questionText: q.questionText,
          options: q.options.filter(o => o.trim()),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || undefined
        }))
      })
      
      setNewQuiz({
        title: "",
        questions: [{ questionText: "", options: ["", ""], correctAnswer: 0, explanation: "" }]
      })
      setAddingQuizToChapter(null)
      fetchChapters()
    } catch (err) {
      console.error("Failed to create quiz:", err)
      alert("Failed to create quiz")
    }
  }

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return
    
    try {
      // Cookies sent automatically
      await apiClient.deleteQuiz(quizId)
      fetchChapters()
    } catch (err) {
      console.error("Failed to delete quiz:", err)
      alert("Failed to delete quiz")
    }
  }

  const handleUpdateLecture = async (lectureId: string, data: any) => {
    const formData = new FormData()
    if (data.title) formData.append('title', data.title)
    if (data.videoUrl) formData.append('videoUrl', data.videoUrl)
    if (data.duration !== undefined) formData.append('duration', data.duration.toString())
    if (data.isPreview !== undefined) formData.append('isPreview', data.isPreview.toString())
    if (data.resources) formData.append('resources', data.resources)
    
    startTransition(async () => {
      try {
        const result = await updateLectureAction(courseId, lectureId, formData)
        
        if (result.success) {
          setEditingLecture(null)
          fetchChapters()
        } else {
          alert(result.error || "Failed to update lecture")
        }
      } catch (err) {
        console.error("Failed to update lecture:", err)
        alert("Failed to update lecture")
      }
    })
  }

  const handleDeleteLecture = async (lectureId: string) => {
    if (!confirm("Are you sure you want to delete this lecture?")) return
    
    startTransition(async () => {
      try {
        const result = await deleteLectureAction(courseId, lectureId)
        
        if (result.success) {
          fetchChapters()
        } else {
          alert(result.error || "Failed to delete lecture")
        }
      } catch (err) {
        console.error("Failed to delete lecture:", err)
        alert("Failed to delete lecture")
      }
    })
  }

  const startEditingChapter = (chapter: Chapter) => {
    setEditingChapterId(chapter._id)
    setEditChapterTitle(chapter.title)
  }

  const handleUpdateQuiz = async (quizId: string, data: { title: string; questions: Question[] }) => {
    if (!data.title.trim()) {
      alert("Quiz title is required")
      return
    }
    
    // Validate questions
    const validQuestions = data.questions.filter(q => 
      q.questionText.trim() && q.options.filter(o => o.trim()).length >= 2
    )
    
    if (validQuestions.length === 0) {
      alert("Please add at least one question with 2 or more options")
      return
    }
    
    try {
      await apiClient.updateQuiz(
        quizId,
        {
          title: data.title,
          questions: validQuestions.map(q => ({
            questionText: q.questionText,
            options: q.options.filter(o => o.trim()),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || undefined
          }))
        }
      )
      setEditingQuiz(null)
      fetchChapters()
    } catch (err) {
      console.error("Failed to update quiz:", err)
      alert("Failed to update quiz")
    }
  }

  // Toggle chapter expand/collapse
  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId)
      } else {
        newSet.add(chapterId)
      }
      return newSet
    })
  }

  // Expand all chapters
  const expandAll = () => {
    setExpandedChapters(new Set(chapters.map(ch => ch._id)))
  }

  // Collapse all chapters
  const collapseAll = () => {
    setExpandedChapters(new Set())
  }

  // Setup drag and drop sensors with smoother activation
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduced to 3px for smoother drag initiation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Custom collision detection for lectures
  const customCollisionDetection = (args: any) => {
    const activeId = args.active?.id as string
    
    // Check if active item is a lecture
    const isActiveLecture = chapters.some(ch => 
      ch.lectures?.some(lec => lec._id === activeId)
    )
    
    if (isActiveLecture) {
      // For lectures, only detect collisions with other lectures
      const lectureIds = chapters.flatMap(ch => ch.lectures?.map(lec => lec._id) || [])
      const filteredArgs = {
        ...args,
        droppableContainers: args.droppableContainers.filter((container: any) => 
          lectureIds.includes(container.id as string)
        )
      }
      return pointerWithin(filteredArgs) || rectIntersection(filteredArgs)
    }
    
    // For chapters, use default detection
    return closestCenter(args)
  }

  // Unified drag end handler for both chapters and lectures
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    const activeIdStr = active.id as string
    const overIdStr = over.id as string


    // Determine if dragging a chapter or lecture
    const isChapter = chapters.some(ch => ch._id === activeIdStr)

    if (isChapter) {
      // Handle chapter reorder
      const oldIndex = chapters.findIndex(ch => ch._id === activeIdStr)
      const newIndex = chapters.findIndex(ch => ch._id === overIdStr)

      if (oldIndex === -1 || newIndex === -1) return

      const reorderedChapters = arrayMove(chapters, oldIndex, newIndex)
      setChapters(reorderedChapters)

      const orderData = reorderedChapters.map((chapter, index) => ({
        chapterId: chapter._id,
        order: index + 1,
      }))

      try {
        // Cookies sent automatically
        await apiClient.reorderChapters(courseId, orderData)
      } catch (error) {
        console.error('Failed to reorder chapters:', error)
        fetchChapters()
        alert('Failed to save chapter order')
      }
    } else {
      // Handle lecture reorder - find which chapter contains the ACTIVE (dragged) lecture
      let sourceChapter: Chapter | undefined
      for (const chapter of chapters) {
        if (chapter.lectures?.some(lec => lec._id === activeIdStr)) {
          sourceChapter = chapter
          break
        }
      }


      if (!sourceChapter || !sourceChapter.lectures) {
        console.error('❌ No source chapter found or no lectures')
        return
      }

      // Check if the OVER target is also a lecture in the same chapter
      const isOverALecture = sourceChapter.lectures.some(lec => lec._id === overIdStr)
      
      if (!isOverALecture) {
        console.error('❌ Cannot drop lecture on non-lecture item (probably dropped on chapter). Over ID:', overIdStr)
        return
      }

      const oldIndex = sourceChapter.lectures.findIndex(lec => lec._id === activeIdStr)
      const newIndex = sourceChapter.lectures.findIndex(lec => lec._id === overIdStr)
      

      if (oldIndex === -1 || newIndex === -1) {
        console.error('❌ Invalid indexes')
        return
      }

      const reorderedLectures = arrayMove(sourceChapter.lectures, oldIndex, newIndex)
      
      // IMPORTANT: Update the order field in each lecture object
      const lecturesWithUpdatedOrder = reorderedLectures.map((lecture, index) => ({
        ...lecture,
        order: index + 1
      }))
      
      const updatedChapters = chapters.map(ch =>
        ch._id === sourceChapter._id ? { ...ch, lectures: lecturesWithUpdatedOrder } : ch
      )
      setChapters(updatedChapters)

      const reorderData = reorderedLectures.map((lecture, index) => ({
        lectureId: lecture._id,
        newOrder: index + 1,
      }))

      try {
        // Cookies sent automatically
        await apiClient.reorderLectures(sourceChapter._id, reorderData)
      } catch (error) {
        console.error('Failed to reorder lectures:', error)
        fetchChapters()
        alert('Failed to save lecture order')
      }
    }
  }

  const handleDragStart = (event: DragEndEvent) => {
    const id = event.active.id as string
    setActiveId(id)
  }

  // Unified content reorder function (works for both lectures and quizzes)
  const moveContentItem = async (chapterId: string, itemId: string, itemType: 'lecture' | 'quiz', direction: 'up' | 'down') => {
    
    const chapter = chapters.find(ch => ch._id === chapterId)
    if (!chapter || !chapter.content) {
      return
    }

    const currentIndex = chapter.content.findIndex(item => item._id === itemId)
    
    if (currentIndex === -1) return
    if (direction === 'up' && currentIndex <= 0) return
    if (direction === 'down' && currentIndex >= chapter.content.length - 1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    const reorderedContent = arrayMove(chapter.content, currentIndex, newIndex)
    
    // Update order fields
    const contentWithUpdatedOrder = reorderedContent.map((item, index) => ({
      ...item,
      order: index + 1
    }))
    
    // Update UI optimistically
    const updatedChapters = chapters.map(ch => {
      if (ch._id === chapterId) {
        return {
          ...ch,
          content: contentWithUpdatedOrder,
          lectures: contentWithUpdatedOrder.filter(item => item.type === 'lecture') as Lecture[],
          quizzes: contentWithUpdatedOrder.filter(item => item.type === 'quiz') as Quiz[]
        }
      }
      return ch
    })
    setChapters(updatedChapters)

    // Save to backend using UNIFIED API
    const items = contentWithUpdatedOrder.map(item => ({
      itemId: item._id,
      itemType: item.type,
      order: item.order
    }))

    try {
      // Cookies sent automatically
      await apiClient.reorderChapterContent(chapterId, items)
    } catch (error) {
      console.error('❌ Failed to reorder content:', error)
      fetchChapters()
      alert('Failed to save content order')
    }
  }

  // Wrapper functions for easier calling
  const moveLectureUp = (chapterId: string, lectureId: string) => 
    moveContentItem(chapterId, lectureId, 'lecture', 'up')
  
  const moveLectureDown = (chapterId: string, lectureId: string) => 
    moveContentItem(chapterId, lectureId, 'lecture', 'down')
  
  const moveQuizUp = (chapterId: string, quizId: string) => 
    moveContentItem(chapterId, quizId, 'quiz', 'up')
  
  const moveQuizDown = (chapterId: string, quizId: string) => 
    moveContentItem(chapterId, quizId, 'quiz', 'down')


  // Get the currently dragging item for overlay
  const activeLecture = activeId 
    ? chapters.flatMap(ch => ch.lectures || []).find(lec => lec._id === activeId)
    : null
  
  const activeChapter = activeId 
    ? chapters.find(ch => ch._id === activeId)
    : null


  // Handle YouTube URL change and show preview
  const handleVideoUrlChange = (url: string, isEdit = false) => {
    if (!isEdit) {
      setNewLecture({ ...newLecture, videoUrl: url })
    }

    // Check if it's a YouTube URL and extract video ID
    const videoId = extractYouTubeVideoId(url)
    if (videoId) {
      setIsFetchingVideoInfo(true)
    } else {
      setIsFetchingVideoInfo(false)
    }
  }

  // Handle YouTube player ready event to extract video info
  const handleYouTubeReady = (event: any, isEdit = false) => {
    const videoInfo = extractVideoInfoFromPlayer(event)
    
    if (videoInfo && !isEdit) {
      setNewLecture(prev => ({
        ...prev,
        title: videoInfo.title || prev.title,
        duration: videoInfo.duration || prev.duration,
      }))
    }
    
    setIsFetchingVideoInfo(false)
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mt-12">
        <LoadingCard message="Loading course content..." />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mt-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link href={`/instructor/courses/${courseId}`}>
              <Button variant="outline" size="sm" className="mb-4 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Course Content
            </h1>
            <p className="text-slate-400 mt-2">
              Manage chapters and lectures for your course
            </p>
          </div>
          <div className="flex gap-3">
            {chapters.length > 0 && (
              <div className="flex gap-2">
                <Button 
                  onClick={expandAll}
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800"
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Expand All
                </Button>
                <Button 
                  onClick={collapseAll}
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Collapse All
                </Button>
              </div>
            )}
            <Button 
              onClick={() => setIsAddingChapter(true)}
              className="bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg border-0"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Chapter
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <ContentStatsCards chapters={chapters} />

      {/* Add Chapter Form */}
      {isAddingChapter && (
        <ChapterForm
          mode="create"
          onSave={async (title) => {
            setNewChapterTitle(title)
            await handleCreateChapter()
          }}
          onCancel={() => {
            setIsAddingChapter(false)
            setNewChapterTitle("")
          }}
        />
      )}

      {/* Chapters List */}
      {error ? (
        <Card className="relative overflow-hidden border-red-500/20 bg-slate-900/60 backdrop-blur-xl">
          <CardContent className="relative z-10 text-center py-12">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      ) : chapters.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No chapters yet"
          description="Start building your course by adding chapters"
          action={{
            label: "Add Your First Chapter",
            onClick: () => setIsAddingChapter(true)
          }}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapters.map(ch => ch._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {chapters.map((chapter, chapterIndex) => (
                <SortableChapter key={chapter._id} chapter={chapter}>
                  {({ attributes, listeners, setActivatorNodeRef }: any) => (
                    <Card className="relative overflow-hidden border-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
                      
                      {/* Chapter Header */}
                      <ChapterHeader
                        chapter={chapter}
                        chapterIndex={chapterIndex}
                        isExpanded={expandedChapters.has(chapter._id)}
                        isEditing={editingChapterId === chapter._id}
                        editTitle={editChapterTitle}
                        onToggleExpand={() => toggleChapter(chapter._id)}
                        onStartEdit={() => startEditingChapter(chapter)}
                        onSaveEdit={() => handleUpdateChapter(chapter._id)}
                        onCancelEdit={() => setEditingChapterId(null)}
                        onDelete={() => handleDeleteChapter(chapter._id)}
                        onAddLecture={() => {
                          setAddingLectureToChapter(chapter._id)
                          setAddingQuizToChapter(null)
                          if (!expandedChapters.has(chapter._id)) {
                            toggleChapter(chapter._id)
                          }
                        }}
                        onAddQuiz={() => {
                          setAddingQuizToChapter(chapter._id)
                          setAddingLectureToChapter(null)
                          if (!expandedChapters.has(chapter._id)) {
                            toggleChapter(chapter._id)
                          }
                        }}
                        onEditTitleChange={(title) => setEditChapterTitle(title)}
                        dragHandleProps={{
                          ref: setActivatorNodeRef,
                          attributes,
                          listeners
                        }}
                      />

              {/* Content - Only show when expanded */}
              {expandedChapters.has(chapter._id) && (
                <>
                  {/* Add Quiz Form */}
                  {addingQuizToChapter === chapter._id && (
                    <QuizForm
                      mode="create"
                      initialData={newQuiz}
                      onSave={async (data) => {
                        setNewQuiz(data)
                        await handleCreateQuiz(chapter._id)
                      }}
                      onCancel={() => {
                        setAddingQuizToChapter(null)
                        setNewQuiz({ title: "", questions: [{ questionText: "", options: ["", ""], correctAnswer: 0, explanation: "" }] })
                      }}
                    />
                  )}

                  {/* Add Lecture Form */}
                  {addingLectureToChapter === chapter._id && (
                    <LectureForm
                      mode="create"
                      initialData={newLecture}
                      onSave={async (data) => {
                        setNewLecture(data)
                        await handleCreateLecture(chapter._id)
                      }}
                      onCancel={() => {
                        setAddingLectureToChapter(null)
                        setNewLecture({ title: "", videoUrl: "", duration: 0, isPreview: false, resources: "" })
                      }}
                      onVideoUrlChange={(url) => handleVideoUrlChange(url, false)}
                      onPlayerReady={(event) => handleYouTubeReady(event, false)}
                      isFetchingVideoInfo={isFetchingVideoInfo}
                    />
                  )}

                  {/* Mixed Content List (Lectures + Quizzes) */}
                  {chapter.content && chapter.content.length > 0 && (
                    <CardContent className="relative z-10 pt-0">
                      <ContentList
                        lectures={chapter.lectures || []}
                        quizzes={chapter.quizzes || []}
                        chapterId={chapter._id}
                        onEditLecture={(lecture) => setEditingLecture(lecture)}
                        onDeleteLecture={handleDeleteLecture}
                        onEditQuiz={(quiz) => setEditingQuiz(quiz)}
                        onDeleteQuiz={handleDeleteQuiz}
                        onMoveLectureUp={moveLectureUp}
                        onMoveLectureDown={moveLectureDown}
                        onMoveQuizUp={moveQuizUp}
                        onMoveQuizDown={moveQuizDown}
                      />
                    </CardContent>
                  )}
                </>
              )}
            </Card>
          )}
        </SortableChapter>
              ))}
            </div>
          </SortableContext>
          
          {/* Drag Overlay - Shows what you're dragging */}
          <DragOverlay>
            {activeLecture ? (
              <div className="flex items-center gap-3 p-3 bg-blue-500/20 border-2 border-blue-500 rounded-lg shadow-2xl backdrop-blur-xl">
                <GripVertical className="h-5 w-5 text-blue-400" />
                <PlayCircle className="h-5 w-5 text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activeLecture.title}</p>
                  <p className="text-xs text-blue-300">{formatDuration(activeLecture.duration)}</p>
                </div>
              </div>
            ) : activeChapter ? (
              <div className="p-4 bg-purple-500/20 border-2 border-purple-500 rounded-lg shadow-2xl backdrop-blur-xl">
                <p className="text-lg font-bold text-white">📚 {activeChapter.title}</p>
                <p className="text-sm text-purple-300">{activeChapter.lectures?.length || 0} lectures</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Edit Modals */}
      <LectureEditModal
        lecture={editingLecture}
        open={editingLecture !== null}
        onClose={() => setEditingLecture(null)}
        onSave={handleUpdateLecture}
        onVideoUrlChange={(url) => handleVideoUrlChange(url, true)}
        isFetchingVideoInfo={isFetchingVideoInfo}
      />

      <QuizEditModal
        quiz={editingQuiz}
        open={editingQuiz !== null}
        onClose={() => setEditingQuiz(null)}
        onSave={handleUpdateQuiz}
      />
    </div>
  )
}

