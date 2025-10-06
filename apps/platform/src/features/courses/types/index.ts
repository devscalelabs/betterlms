export type Course = {
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
};

export type Section = {
	id: string;
	title: string;
	order: number;
	courseId: string;
	createdAt: string;
	updatedAt: string;
	lessons: Lesson[];
};

export type Lesson = {
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
};

export type CoursesResponse = {
	courses: Course[];
};

export type CourseResponse = {
	course: Course;
};
