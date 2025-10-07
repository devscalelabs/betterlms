/* eslint-disable jsx-a11y/media-has-caption */
import { Button } from "@betterlms/ui";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { HeadingBox } from "@/components/shared/heading-box";
import { useProcessedContent } from "@/features/articles/hooks/use-processed-content";
import type { Lesson } from "@/features/courses/types";
import { api } from "@/utils/api-client";

export const LessonDetailPage = () => {
	const extractYouTubeId = (url: string): string => {
		const regExp =
			/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);
		return match?.[2] && match[2].length === 11 ? match[2] : "";
	};
	const navigate = useNavigate();
	const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();

	const {
		data: lessonData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["lesson", lessonId],
		queryFn: () =>
			api.get<{ lesson: Lesson }>(`api/v1/lessons/${lessonId}`).json(),
		enabled: !!lessonId,
	});

	const lesson = lessonData?.lesson;
	const { processedContent } = useProcessedContent({
		content: lesson?.content || "",
	});

	if (!lessonId) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">Lesson ID is required</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<main className="max-w-4xl mx-auto p-6">
				<div className="space-y-6">
					<div className="h-8 bg-muted rounded animate-pulse w-3/4" />
					<div className="space-y-3">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="h-4 bg-muted rounded animate-pulse" />
						))}
					</div>
				</div>
			</main>
		);
	}

	if (error || !lesson) {
		return (
			<main className="max-w-4xl mx-auto p-6">
				<div className="text-center py-8">
					<p className="text-muted-foreground">Lesson not found</p>
				</div>
			</main>
		);
	}

	return (
		<div>
			<HeadingBox>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate(`/courses/${slug}`)}
				>
					Back to Course
				</Button>
				<div></div>
			</HeadingBox>

			<main className="max-w-4xl mx-auto p-6">
				<div className="space-y-6">
					{/* Lesson Header */}
					<div className="space-y-4">
						<h1 className="text-3xl font-bold leading-tight">{lesson.title}</h1>

						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<span>Lesson {lesson.order}</span>
							<span>{lesson.type === "VIDEO" ? "Video" : "Text"}</span>
							{lesson.isFree && (
								<span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
									Free
								</span>
							)}
						</div>
					</div>

					{/* Video */}
					{lesson.videoUrl && (
						<div className="aspect-video bg-muted rounded-lg overflow-hidden">
							{lesson.videoUrl.includes("youtube.com") ||
							lesson.videoUrl.includes("youtu.be") ? (
								<iframe
									src={
										lesson.videoUrl.includes("embed")
											? lesson.videoUrl
											: `https://www.youtube.com/embed/${extractYouTubeId(lesson.videoUrl)}`
									}
									title={lesson.title}
									className="w-full h-full"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							) : (
								<video
									src={lesson.videoUrl}
									controls
									className="w-full h-full object-cover"
									preload="metadata"
								>
									<track kind="captions" srcLang="en" label="English" />
									Your browser does not support the video tag.
								</video>
							)}
						</div>
					)}

					{/* Content */}
					{lesson.content && (
						<div className="text-sm">
							<div className="prose prose-pre:whitespace-pre-line">
								{typeof processedContent === "string" ? (
									<div
										// biome-ignore lint/security/noDangerouslySetInnerHtml: This is intentional for rendering lesson HTML content
										dangerouslySetInnerHTML={{ __html: processedContent }}
									/>
								) : (
									<div>{processedContent}</div>
								)}
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};
