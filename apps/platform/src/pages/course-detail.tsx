import { getUserInitials } from "@betterlms/common/strings";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@betterlms/ui";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { HeadingBox } from "@/components/shared/heading-box";
import type { CourseResponse } from "@/features/courses/types";
import { EnrollmentButton } from "@/features/enrollments/components/enrollment-button";
import { EnrollmentProgress } from "@/features/enrollments/components/enrollment-progress";
import { useCourseEnrollment } from "@/features/enrollments/hooks/use-course-enrollment";
import { api } from "@/utils/api-client";

export const CourseDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const {
    data: courseData,
    isLoading: isLoadingCourse,
    error,
  } = useQuery({
    queryKey: ["course", "slug", slug],
    queryFn: () =>
      api.get<CourseResponse>(`api/v1/courses/slug/${slug}`).json(),
    enabled: !!slug,
  });

  const course = courseData?.course;

  // Enrollment hook for progress display
  const {
    enrollment,
    isEnrolled,
  } = useCourseEnrollment(course?.id || "");

  const formatPrice = (price: number | null, currency: string) => {
    if (!price) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const getTotalLessons = () => {
    if (!course) return 0;
    return course.sections.reduce(
      (total, section) => total + section.lessons.length,
      0,
    );
  };

  const getTotalDuration = () => {
    if (!course) return "0m";
    const lessonCount = getTotalLessons();
    const estimatedMinutes = lessonCount * 10; // Rough estimate: 10 minutes per lesson

    if (estimatedMinutes < 60) {
      return `${estimatedMinutes}m`;
    }

    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = estimatedMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  if (!slug) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Course slug is required</p>
      </div>
    );
  }

  if (isLoadingCourse) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Course not found</p>
        </div>
      </main>
    );
  }

  return (
    <div>
      <HeadingBox>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
        <div></div>
      </HeadingBox>

      <main className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Course Header */}
          <div className="space-y-4">
            {/* Thumbnail */}
            <div className="bg-muted rounded-lg overflow-hidden">
              {course.thumbnailUrl ? (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center">
                  <div className="text-6xl text-muted-foreground">📚</div>
                </div>
              )}
            </div>

            {/* Title and Category */}
            <div className="space-y-2">
              {course.category && (
                <span className="inline-block bg-muted text-muted-foreground px-3 py-1 rounded-md text-sm font-medium border">
                  {course.category}
                </span>
              )}
              <h1 className="text-3xl font-bold leading-tight">
                {course.title}
              </h1>
            </div>

            {/* Description */}
            {course.description && (
              <p className="text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            )}

            {/* Instructor */}
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarImage
                  src={course.instructor.imageUrl || ""}
                  alt={course.instructor.name}
                />
                <AvatarFallback>
                  {getUserInitials(course.instructor.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{course.instructor.name}</div>
                <div className="text-sm text-muted-foreground">
                  @{course.instructor.username}
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>{getTotalLessons()} lessons</span>
              <span>{getTotalDuration()}</span>
              <span>{course._count.enrollments} students</span>
              {isEnrolled && enrollment && (
                <EnrollmentProgress enrollment={enrollment} />
              )}
            </div>

            {/* Tags */}
            {course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price and Enroll */}
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-2xl font-bold">
                {formatPrice(course.price, course.currency)}
              </span>
              {course.id && (
                <EnrollmentButton
                  courseId={course.id}
                  coursePrice={course.price}
                  courseCurrency={course.currency}
                />
              )}
            </div>
          </div>

          {/* Course Content */}
          {course.sections.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Course Content</h2>
              <div className="space-y-4">
                {course.sections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">{section.title}</h3>
                    <div className="space-y-2">
                      {section.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          type="button"
                          className="w-full py-2 cursor-pointer hover:bg-muted/50 px-2 transition-colors text-left"
                          onClick={() =>
                            navigate(
                              `/courses/${course.slug}/lessons/${lesson.id}`,
                            )
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">
                                {lesson.order}
                              </span>
                              <span className="text-sm font-medium">
                                {lesson.title}
                              </span>
                              {lesson.isFree && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                  Free
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {lesson.type === "VIDEO" ? "Video" : "Text"}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
