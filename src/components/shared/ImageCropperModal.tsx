"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  Crop,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageCropperModalProps {
  files: File[];
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedFiles: File[]) => void;
  defaultAspect?: number; // e.g. 4/3 or 1/1 (0 for free)
  title?: string;
}

export default function ImageCropperModal({
  files,
  isOpen,
  onClose,
  onCropComplete,
  defaultAspect = 4 / 3,
  title = "Crop Image",
}: ImageCropperModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [croppedFiles, setCroppedFiles] = useState<File[]>([]);

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [aspect, setAspect] = useState<number>(defaultAspect);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Initialize files when modal opens or files prop changes
  useEffect(() => {
    if (isOpen && files.length > 0) {
      setCurrentIndex(0);
      setCroppedFiles([]);
      setAspect(defaultAspect);
    }
  }, [isOpen, files, defaultAspect]);

  // Load current file into image source
  useEffect(() => {
    if (!isOpen || !files[currentIndex]) {
      imgRef.current = null;
      return;
    }

    const file = files[currentIndex];
    const url = URL.createObjectURL(file);
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });

    const img = new Image();
    img.src = url;
    img.onload = () => {
      imgRef.current = img;
    };

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [isOpen, files, currentIndex]);

  // Handle canvas drawing
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const containerWidth = canvas.width;
    const containerHeight = canvas.height;

    ctx.clearRect(0, 0, containerWidth, containerHeight);

    // Dark background for canvas preview
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, containerWidth, containerHeight);

    ctx.save();
    ctx.translate(containerWidth / 2 + offset.x, containerHeight / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate scale to fit container
    const isRotated = rotation % 180 !== 0;
    const imgW = isRotated ? img.height : img.width;
    const imgH = isRotated ? img.width : img.height;

    const fitScale = Math.min(
      (containerWidth * 0.8) / imgW,
      (containerHeight * 0.8) / imgH
    );

    const drawWidth = img.width * fitScale;
    const drawHeight = img.height * fitScale;

    ctx.drawImage(
      img,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );

    ctx.restore();
  }, [offset, rotation, zoom]);

  useEffect(() => {
    let animationFrameId: number;
    const render = () => {
      drawCanvas();
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [drawCanvas]);

  // Mouse / Touch Dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Crop & Export current image
  const cropCurrentImage = (): Promise<File> => {
    return new Promise((resolve) => {
      const currentFile = files[currentIndex];
      const img = imgRef.current;
      if (!img) {
        resolve(currentFile);
        return;
      }

      const exportCanvas = document.createElement("canvas");
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) {
        resolve(currentFile);
        return;
      }

      // Determine output crop dimensions
      let cropWidth = img.width;
      let cropHeight = img.height;

      if (aspect > 0) {
        if (img.width / img.height > aspect) {
          cropWidth = img.height * aspect;
        } else {
          cropHeight = img.width / aspect;
        }
      }

      exportCanvas.width = cropWidth;
      exportCanvas.height = cropHeight;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cropWidth, cropHeight);

      ctx.save();
      ctx.translate(cropWidth / 2, cropHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      ctx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
      );
      ctx.restore();

      exportCanvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(currentFile);
            return;
          }
          const newFile = new File([blob], currentFile.name, {
            type: currentFile.type || "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(newFile);
        },
        currentFile.type || "image/jpeg",
        0.92
      );
    });
  };

  const handleSaveAndNext = async () => {
    const cropped = await cropCurrentImage();
    const nextList = [...croppedFiles, cropped];
    setCroppedFiles(nextList);

    if (currentIndex + 1 < files.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onCropComplete(nextList);
      onClose();
    }
  };

  const handleSkipCurrent = () => {
    const nextList = [...croppedFiles, files[currentIndex]];
    setCroppedFiles(nextList);

    if (currentIndex + 1 < files.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onCropComplete(nextList);
      onClose();
    }
  };

  if (!isOpen || files.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="flex w-full max-w-2xl flex-col rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Crop className="size-5 text-emerald-500" />
            <h3 className="font-semibold text-lg">{title}</h3>
            {files.length > 1 && (
              <span className="rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold px-2.5 py-0.5 ml-2">
                {currentIndex + 1} of {files.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Canvas Workspace */}
        <div className="relative flex flex-col items-center justify-center bg-zinc-950 p-4 min-h-[320px] select-none">
          <canvas
            ref={canvasRef}
            width={520}
            height={320}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="cursor-move rounded-lg border border-zinc-800 shadow-inner"
          />

          {/* Rule of thirds grid overlay */}
          <div className="pointer-events-none absolute inset-4 flex items-center justify-center">
            <div
              className="relative rounded border border-emerald-500/40 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
              style={{
                width: aspect ? (aspect >= 1 ? "360px" : `${360 * aspect}px`) : "360px",
                height: aspect ? (aspect >= 1 ? `${360 / aspect}px` : "360px") : "270px",
              }}
            >
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-white/20" />
                <div className="border-r border-white/20" />
                <div />
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar & Controls */}
        <div className="flex flex-col gap-4 border-t p-4 bg-muted/20">
          {/* Zoom & Rotation */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3">
              <ZoomOut className="size-4 text-muted-foreground" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="h-1.5 w-32 appearance-none rounded-lg bg-muted accent-emerald-500"
              />
              <ZoomIn className="size-4 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground w-8">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
              >
                <RotateCcw className="size-3.5" />
                -90°
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
              >
                <RotateCw className="size-3.5" />
                +90°
              </Button>
            </div>
          </div>

          {/* Aspect Ratio Presets */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-muted-foreground mr-1">Aspect Ratio:</span>
            {[
              { label: "4:3 (Gear)", val: 4 / 3 },
              { label: "1:1 (Square)", val: 1 },
              { label: "16:9 (Wide)", val: 16 / 9 },
              { label: "Free", val: 0 },
            ].map((preset) => (
              <Button
                key={preset.label}
                type="button"
                variant={aspect === preset.val ? "default" : "outline"}
                size="sm"
                className={
                  aspect === preset.val
                    ? "h-7 text-xs bg-emerald-500 text-white hover:bg-emerald-600"
                    : "h-7 text-xs"
                }
                onClick={() => setAspect(preset.val)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSkipCurrent}
              className="text-muted-foreground"
            >
              Skip Cropping
            </Button>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-emerald-500 text-white hover:bg-emerald-600 gap-1.5"
                onClick={handleSaveAndNext}
              >
                <Check className="size-4" />
                {currentIndex + 1 < files.length ? "Crop Next Image" : "Crop & Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
