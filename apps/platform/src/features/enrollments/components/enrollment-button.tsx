import { Button } from "@betterlms/ui";
import { useCourseEnrollment } from "../hooks/use-course-enrollment";

interface EnrollmentButtonProps {
  courseId: string;
  coursePrice?: number | null;
  courseCurrency?: string;
  onEnrollmentChange?: (isEnrolled: boolean) => void;
}

export const EnrollmentButton = ({
  courseId,
  coursePrice,
  courseCurrency = "USD",
  onEnrollmentChange,
}: EnrollmentButtonProps) => {
  const {
    isEnrolled,
    isLoadingEnrollment,
    enroll,
    isEnrolling,
    cancel,
    isCancelling,
  } = useCourseEnrollment(courseId);

  const formatPrice = (price: number | null | undefined, currency: string) => {
    if (!price) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const handleEnroll = () => {
    enroll();
    onEnrollmentChange?.(true);
  };

  const handleCancel = () => {
    cancel();
    onEnrollmentChange?.(false);
  };

  if (isLoadingEnrollment) {
    return (
      <Button size="lg" disabled>
        Loading...
      </Button>
    );
  }

  if (isEnrolled) {
    return (
      <Button
        size="lg"
        variant="outline"
        onClick={handleCancel}
        disabled={isCancelling}
      >
        {isCancelling ? "Cancelling..." : "Cancel Enrollment"}
      </Button>
    );
  }

  return (
    <Button size="lg" onClick={handleEnroll} disabled={isEnrolling}>
      {isEnrolling
        ? "Enrolling..."
        : coursePrice
          ? `Enroll Now - ${formatPrice(coursePrice, courseCurrency)}`
          : "Start Free Course"}
    </Button>
  );
};
