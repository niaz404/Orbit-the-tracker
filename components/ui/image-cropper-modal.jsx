"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Check,
  X,
  Palette,
  Sparkles,
} from "lucide-react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const BORDER_COLOR_PRESETS = [
  { id: "indigo", name: "Neon Indigo", value: "#6366f1", ring: "ring-[#6366f1]" },
  { id: "emerald", name: "Cyber Emerald", value: "#10b981", ring: "ring-[#10b981]" },
  { id: "cyan", name: "Electric Cyan", value: "#06b6d4", ring: "ring-[#06b6d4]" },
  { id: "rose", name: "Neon Rose", value: "#f43f5e", ring: "ring-[#f43f5e]" },
  { id: "amber", name: "Solar Amber", value: "#f59e0b", ring: "ring-[#f59e0b]" },
  { id: "purple", name: "Royal Violet", value: "#a855f7", ring: "ring-[#a855f7]" },
  { id: "gold", name: "Imperial Gold", value: "#eab308", ring: "ring-[#eab308]" },
  { id: "slate", name: "Subtle Glass", value: "rgba(255,255,255,0.25)", ring: "ring-white/30" },
];

export function ImageCropperModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  initialBorderColor = "#6366f1",
  aspectRatio = 1, // 1 for avatar, 3 for banner
  isAvatar = true,
}) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedBorderColor, setSelectedBorderColor] = useState(initialBorderColor);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setSelectedBorderColor(initialBorderColor || "#6366f1");
    }
  }, [isOpen, imageSrc, initialBorderColor]);

  const handleMouseDown = (e) => {
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

  // Generate exact cropped canvas output
  const handleApply = () => {
    if (!imageRef.current) return;

    const canvas = document.createElement("canvas");
    const outputSize = isAvatar ? 320 : 960;
    canvas.width = outputSize;
    canvas.height = isAvatar ? 320 : Math.round(outputSize / 3);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#090b14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = imageRef.current;
    const scale = zoom;

    // Viewport dimensions
    const viewportWidth = isAvatar ? 220 : 360;
    const viewportHeight = isAvatar ? 220 : 120;

    // Scale calculation from viewport to canvas
    const ratio = canvas.width / viewportWidth;

    const drawWidth = (img.naturalWidth || img.width) * (viewportWidth / img.width) * scale * ratio;
    const drawHeight = (img.naturalHeight || img.height) * (viewportHeight / img.height) * scale * ratio;

    const drawX = canvas.width / 2 - drawWidth / 2 + position.x * ratio;
    const drawY = canvas.height / 2 - drawHeight / 2 + position.y * ratio;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    const croppedBase64 = canvas.toDataURL("image/webp", 0.92);
    onCropComplete({
      imageUrl: croppedBase64,
      borderColor: selectedBorderColor,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={isAvatar ? "md" : "lg"}>
      <ModalHeader onClose={onClose}>
        <ModalTitle>
          {isAvatar ? "Customize & Crop Profile Avatar" : "Adjust Banner Image"}
        </ModalTitle>
        <ModalDescription>
          Drag to reposition, adjust scale, and pick your custom border glow.
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
          className="relative w-full h-72 rounded-2xl bg-[#040508] border border-white/[0.1] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        >
          {/* Draggable Image */}
          {imageSrc && (
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transition: isDragging ? "none" : "transform 0.1s ease-out",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
              className="pointer-events-none"
            />
          )}

          {/* Mask & Crop Outline */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {isAvatar ? (
              <div
                style={{ borderColor: selectedBorderColor }}
                className="w-56 h-56 rounded-full border-4 shadow-[0_0_0_9999px_rgba(4,5,8,0.75)] transition-colors duration-200"
              />
            ) : (
              <div
                style={{ borderColor: selectedBorderColor }}
                className="w-full max-w-[90%] h-32 rounded-xl border-2 shadow-[0_0_0_9999px_rgba(4,5,8,0.75)] transition-colors duration-200"
              />
            )}
          </div>

          <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] text-white/70 font-mono pointer-events-none flex items-center gap-1">
            <Move className="w-3 h-3" />
            <span>Drag to center</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5 font-medium">
              <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
              <span>Zoom / Scale</span>
            </span>
            <span className="font-mono text-white">{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/[0.1] rounded-full appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Border Color Selector (If Avatar) */}
        {isAvatar && (
          <div className="space-y-2.5 pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>Avatar Border Glow Color</span>
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
          Save & Apply
        </Button>
      </ModalFooter>
    </Modal>
  );
}
