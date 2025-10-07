export type EnrollmentStatus =
	| "ACTIVE"
	| "COMPLETED"
	| "CANCELLED"
	| "SUSPENDED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type CourseEnrollment = {
	id: string;
	userId: string;
	courseId: string;
	status: EnrollmentStatus;
	paymentStatus: PaymentStatus;
	enrolledAt: string;
	startedAt: string | null;
	completedAt: string | null;
	lastAccessedAt: string | null;
	progressPercentage: number;
	currentLessonId: string | null;
	amountPaid: number | null;
	currency: string;
	paymentMethod: string | null;
	transactionId: string | null;
	certificateIssued: boolean;
	certificateUrl: string | null;
	certificateIssuedAt: string | null;
	createdAt: string;
	updatedAt: string;
	user: {
		id: string;
		name: string;
		username: string;
		imageUrl: string | null;
	};
	course: {
		id: string;
		title: string;
		slug: string;
		thumbnailUrl: string | null;
		instructor: {
			id: string;
			name: string;
			username: string;
		};
	};
	currentLesson: {
		id: string;
		title: string;
		order: number;
	} | null;
};

export type CreateEnrollmentRequest = {
	courseId: string;
	amountPaid?: number;
	currency?: string;
	paymentMethod?: string;
	transactionId?: string;
};

export type UpdateEnrollmentProgressRequest = {
	progressPercentage?: number;
	currentLessonId?: string;
};

export type EnrollmentsResponse = {
	enrollments: CourseEnrollment[];
};

export type EnrollmentResponse = {
	enrollment: CourseEnrollment;
};
