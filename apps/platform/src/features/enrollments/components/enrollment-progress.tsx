import type { CourseEnrollment } from "../types";

interface EnrollmentProgressProps {
  enrollment: CourseEnrollment;
}

export const EnrollmentProgress = ({ enrollment }: EnrollmentProgressProps) => {
  if (!enrollment) return null;

  return (
    <span className="text-green-600 font-medium">
      {Math.round(enrollment.progressPercentage)}% complete
    </span>
  );
};
