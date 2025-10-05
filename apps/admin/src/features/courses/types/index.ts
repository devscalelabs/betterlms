export interface Course {
	id: string;
	title: string;
	description: string | null;
	slug: string;
	thumbnailUrl: string | null;
	isPublished: boolean;
	isPrivate: boolean;
	price: number | null;
	currency: string;
	tags: string[];
	category: string | null;
	instructorId: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string | null;
	instructor: {
		id: string;
		name: string;
		username: string;
		imageUrl: string | null;
	};
	sections: Section[];
	_count: {
		enrollments: number;
	};
}

export interface Section {
	id: string;
	title: string;
	order: number;
	courseId: string;
	createdAt: string;
	updatedAt: string;
	lessons: Lesson[];
}

export interface Lesson {
	id: string;
	title: string;
	content: string | null;
	order: number;
	type: "VIDEO" | "TEXT";
	sectionId: string;
	videoUrl: string | null;
	isFree: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CoursesResponse {
	courses: Course[];
}

export interface CourseResponse {
	course: Course;
}

export interface CreateCourseRequest {
	title: string;
	description?: string;
	slug: string;
	thumbnailUrl?: string;
	isPublished?: boolean;
	isPrivate?: boolean;
	price?: number;
	currency?: string;
	tags?: string[];
	category?: string;
}

export interface CreateCourseResponse {
	course: Course;
}

export interface CreateSectionRequest {
	title: string;
	order?: number;
}

export interface CreateSectionResponse {
	section: Section;
}

export interface CreateLessonRequest {
	title: string;
	content?: string;
	order?: number;
	type?: "VIDEO" | "TEXT";
	videoUrl?: string;
	isFree?: boolean;
}

export interface CreateLessonResponse {
	lesson: Lesson;
}
