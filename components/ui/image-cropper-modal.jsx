"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  Move,
  Check,
  X,
  Palette,
  RotateCcw,
} from "lucide-react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const BORDER_COLOR_PRESETS = [
  { id: "indigo", name: "Neon Indigo", value: "#6366f1" },
  { id: "emerald", name: "Cyber Emerald", value: "#10b981" },
  { id: "cyan", name: "Electric Cyan", value: "#06b6d4" },
  { id: "rose", name: "Neon Rose", value: "#f43f5e" },
  { id: "amber", name: "Solar Amber", value: "#f59e0b" },
  { id: "purple", name: "Royal Violet", value: "#a855f7" },
  { id: "gold", name: "Imperial Gold", value: "#eab308" },
  { id: "slate", name: "Subtle Glass", value: "rgba(255,255,255,0.3)" },
];

const MASK_SIZE = 260; // Exact preview circle/rectangle size in pixels

export function ImageCropperModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  initialBorderColor = "#6366f1",
  isAvatar = true,
}) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedBorderColor, setSelectedBorderColor] = useState(initialBorderColor);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Measure natural dimensions when new image arrives
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setSelectedBorderColor(initialBorderColor || "#6366f1");

      const img = new Image();
      img.onload = () => {
        setImgDimensions({
          width: img.naturalWidth || 800,
          height: img.naturalHeight || 800,
        });
      };
      img.src = imageSrc;
    }
  }, [isOpen, imageSrc, initialBorderColor]);

  // Compute base display dimensions that fit the mask nicely
  const getBaseDimensions = () => {
    if (!imgDimensions.width || !imgDimensions.height) {
      return { width: MASK_SIZE, height: MASK_SIZE };
    }
    const { width: nw, height: nh } = imgDimensions;
    const scale = Math.max(MASK_SIZE / nw, MASK_SIZE / nh);
    return {
      width: nw * scale,
      height: nh * scale,
    };
  };

  const baseDim = getBaseDimensions();

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(3.5, Math.max(0.8, Number((prev + delta).toFixed(2)))));
  };

  // 100% WYSIWYG, distortion-free canvas export
  const handleApply = () => {
    if (!imageRef.current || !imgDimensions.width) return;

    const canvas = document.createElement("canvas");
    const OUTPUT_SIZE = isAvatar ? 512 : 1200;
    const outputHeight = isAvatar ? 512 : 400;

    canvas.width = OUTPUT_SIZE;
    canvas.height = outputHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Enable premium smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Dark backdrop
    ctx.fillStyle = "#0c0e17";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Coordinate mapping from UI Preview to Canvas
    const K = OUTPUT_SIZE / MASK_SIZE;
    const drawW = baseDim.width * zoom * K;
    const drawH = baseDim.height * zoom * K;
    const drawX = canvas.width / 2 + position.x * K - drawW / 2;
    const drawY = canvas.height / 2 + position.y * K - drawH / 2;

    ctx.drawImage(imageRef.current, drawX, drawY, drawW, drawH);

    const croppedBase64 = canvas.toDataURL("image/webp", 0.95);
    onCropComplete({
      imageUrl: croppedBase64,
      borderColor: selectedBorderColor,
    });
    onClose();
  };

  const handleResetPosition = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={isAvatar ? "md" : "lg"}>
      <ModalHeader onClose={onClose}>
        <ModalTitle>
          {isAvatar ? "Crop & Position Profile Photo" : "Adjust Banner Image"}
        </ModalTitle>
        <ModalDescription>
          Drag the photo to center and use the slider or mouse wheel to adjust zoom.
        </ModalDescription>
      </ModalHeader>

      <ModalContent className="space-y-5">
        {/* Interactive Viewport Area */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          onWheel={handleWheel}
          className="relative w-full h-[320px] rounded-2xl bg-[#040508] border border-white/[0.1] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none"
        >
          {/* Base Image with precise base dimensions and transform */}
          {imageSrc && (
            <div
              style={{
                width: `${baseDim.width * zoom}px`,
                height: `${baseDim.height * zoom}px`,
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? "none" : "transform 0.05s ease-out",
              }}
              className="absolute pointer-events-none flex items-center justify-center shrink-0"
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop target"
                draggable={false}
                className="w-full h-full object-cover pointer-events-none block select-none"
              />
            </div>
          )}

          {/* Mask & Crop Outline */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {isAvatar ? (
              <div
                style={{
                  width: `${MASK_SIZE}px`,
                  height: `${MASK_SIZE}px`,
                  borderColor: selectedBorderColor,
                  boxShadow: "0 0 0 9999px rgba(4, 5, 8, 0.85)",
                }}
                className="rounded-full border-4 transition-colors duration-200"
              />
            ) : (
              <div
                style={{
                  width: "90%",
                  height: "160px",
                  borderColor: selectedBorderColor,
                  boxShadow: "0 0 0 9999px rgba(4, 5, 8, 0.85)",
                }}
                className="rounded-2xl border-4 transition-colors duration-200"
              />
            )}
          </div>

          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] text-white/90 font-mono pointer-events-none flex items-center gap-1.5 shadow-lg border border-white/10">
            <Move className="w-3.5 h-3.5 text-indigo-400" />
            <span>Drag photo to center</span>
          </div>
        </div>

        {/* Zoom Controls & Reset Button */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5 font-medium">
              <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
              <span>Zoom & Scale</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-white text-xs">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={handleResetPosition}
                className="text-[11px] text-[var(--text-muted)] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                title="Reset zoom and position"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
          <input
            type="range"
            min="0.8"
            max="3.5"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/[0.1] rounded-full appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Border Color Selector (If Avatar) */}
        {isAvatar && (
          <div className="space-y-2.5 pt-3 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>Avatar Border Ring Color</span>
              </label>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                {BORDER_COLOR_PRESETS.find((p) => p.value === selectedBorderColor)?.name || "Custom"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {BORDER_COLOR_PRESETS.map((preset) => {
                const isSelected = selectedBorderColor === preset.value;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedBorderColor(preset.value)}
                    style={{ backgroundColor: preset.value }}
                    className={cn(
                      "w-7 h-7 rounded-full transition-all cursor-pointer relative shadow-sm",
                      isSelected
                        ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#090b14]"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    )}
                    title={preset.name}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto drop-shadow-md" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </ModalContent>

      <ModalFooter>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleApply}
          leftIcon={<Check className="w-4 h-4" />}
        >
          Confirm & Save Photo
        </Button>
      </ModalFooter>
    </Modal>
  );
}

