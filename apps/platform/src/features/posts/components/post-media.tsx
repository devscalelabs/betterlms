import { Dialog, DialogContent } from "@betterlms/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PostMediaProps {
  media: {
    id: string;
    url: string;
    type: "IMAGE" | "VIDEO" | "DOCUMENT";
  }[];
}

export const PostMedia = ({ media }: PostMediaProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!media || media.length === 0) return null;

  const imageMedia = media.filter((m) => m.type === "IMAGE");

  if (imageMedia.length === 0) return null;

  const handleImageClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex(index);
    setIsOpen(true);
  };

  const handleCloseDialog = (open: boolean, event?: Event) => {
    if (event) {
      event.stopPropagation();
    }
    setIsOpen(open);
    if (!open) {
      // Delay clearing the image to allow dialog close animation to complete
      setTimeout(() => {
        setSelectedImageIndex(0);
      }, 200);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) =>
      prev === 0 ? imageMedia.length - 1 : prev - 1,
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) =>
      prev === imageMedia.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <>
      <div className="mt-3 mb-3">
        {imageMedia.length === 1 && imageMedia[0] && (
          <button
            type="button"
            className="rounded overflow-hidden border border-border cursor-pointer w-full text-left p-0"
            onClick={(e) => handleImageClick(0, e)}
          >
            <img
              src={imageMedia[0].url}
              alt="Post media"
              className="w-full h-auto max-h-96 object-cover hover:opacity-90 transition-opacity"
            />
          </button>
        )}

        {imageMedia.length === 2 && (
          <div className="grid grid-cols-2 gap-2 rounded overflow-hidden">
            {imageMedia.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="border border-border rounded overflow-hidden cursor-pointer p-0"
                onClick={(e) => handleImageClick(index, e)}
              >
                <img
                  src={item.url}
                  alt="Post media"
                  className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                />
              </button>
            ))}
          </div>
        )}

        {imageMedia.length === 3 && imageMedia[0] && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="col-span-2 border border-border rounded overflow-hidden cursor-pointer p-0"
              onClick={(e) => handleImageClick(0, e)}
            >
              <img
                src={imageMedia[0].url}
                alt="Post media"
                className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
              />
            </button>
            {imageMedia.slice(1).map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="border border-border rounded overflow-hidden cursor-pointer p-0"
                onClick={(e) => handleImageClick(index + 1, e)}
              >
                <img
                  src={item.url}
                  alt="Post media"
                  className="w-full h-32 object-cover hover:opacity-90 transition-opacity"
                />
              </button>
            ))}
          </div>
        )}

        {imageMedia.length >= 4 && (
          <div className="grid grid-cols-2 gap-2">
            {imageMedia.slice(0, 4).map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="border border-border rounded overflow-hidden relative cursor-pointer p-0"
                onClick={(e) => handleImageClick(index, e)}
              >
                <img
                  src={item.url}
                  alt="Post media"
                  className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                />
                {index === 3 && imageMedia.length > 4 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-white text-2xl font-semibold">
                      +{imageMedia.length - 4}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Image Dialog */}
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent
          className="!max-w-[95vw] !w-auto !h-[90vh] p-0 overflow-hidden"
          onPointerDownOutside={(e) => e.stopPropagation()}
          onInteractOutside={(e) => e.stopPropagation()}
        >
          <div className="w-full h-full flex items-center justify-center relative p-4">
            {imageMedia[selectedImageIndex] && (
              <img
                src={imageMedia[selectedImageIndex].url}
                alt="Fullscreen preview"
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
            )}

            {/* Navigation Controls */}
            {imageMedia.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2  text-white p-3 rounded-full transition-colors z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2  text-white p-3 rounded-full transition-colors z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                  {selectedImageIndex + 1} / {imageMedia.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
