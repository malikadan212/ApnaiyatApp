"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DraftCampaign } from "../CreateCampaignWizard";
import { StepNav } from "../CreateCampaignWizard";

interface Props {
  draft: DraftCampaign;
  onChange: (partial: Partial<DraftCampaign>) => void;
  onNext: () => void;
  onBack: () => void;
}

const GRADIENTS = [
  { label: "Forest", value: "from-emerald-500 via-teal-600 to-cyan-700" },
  { label: "Sunset", value: "from-orange-400 via-rose-500 to-pink-600" },
  { label: "Ocean", value: "from-blue-400 via-cyan-500 to-teal-600" },
  { label: "Earth", value: "from-amber-500 via-orange-600 to-red-700" },
  { label: "Dusk", value: "from-violet-500 via-purple-600 to-indigo-700" },
  { label: "Sand", value: "from-yellow-400 via-amber-500 to-orange-600" },
  { label: "Pine", value: "from-green-500 via-emerald-600 to-teal-700" },
  { label: "Dawn", value: "from-rose-400 via-pink-500 to-fuchsia-600" },
  { label: "Slate", value: "from-slate-500 via-gray-600 to-zinc-700" },
  { label: "Jade", value: "from-teal-400 via-green-500 to-emerald-600" },
];

export default function Step4Media({ draft, onChange, onNext, onBack }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const hasImage = !!draft.imagePreviewUrl;
  const selectedGradient = draft.gradient ?? GRADIENTS[0].value;

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onChange({ imagePreviewUrl: url, image: null });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function removeImage() {
    onChange({ imagePreviewUrl: undefined, image: null });
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-foreground">Campaign media</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        A strong photo makes your campaign 3× more likely to be shared. If you
        don&apos;t have one, pick a colour theme.
      </p>

      {/* Upload area */}
      <div className="mt-6">
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Campaign photo
        </label>

        {hasImage ? (
          <div className="relative mt-2 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={draft.imagePreviewUrl}
              alt="Preview"
              className="h-52 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
            <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              Your photo
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              "mt-2 flex h-44 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-all",
              dragOver
                ? "border-brand bg-brand/8"
                : "border-border bg-secondary/30 hover:border-brand/50 hover:bg-secondary/50",
            )}
          >
            <ImagePlus
              className={cn(
                "h-8 w-8 transition-colors",
                dragOver ? "text-brand" : "text-muted-foreground",
              )}
            />
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {dragOver ? "Drop it here" : "Upload a photo"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Drag & drop or click — JPG, PNG, WebP (max 10 MB)
              </p>
            </div>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInput}
        />
      </div>

      {/* Gradient picker */}
      <div className="mt-6">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {hasImage ? "Fallback colour theme" : "Colour theme (used instead of photo)"}
          </label>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {GRADIENTS.map((g) => (
            <button
              key={g.value}
              type="button"
              title={g.label}
              onClick={() => onChange({ gradient: g.value })}
              className={cn(
                "group relative h-12 overflow-hidden rounded-xl border-2 transition-all",
                selectedGradient === g.value
                  ? "border-brand scale-105 shadow-md shadow-brand/20"
                  : "border-transparent hover:border-brand/40",
              )}
            >
              <div
                className={cn("absolute inset-0 bg-gradient-to-br", g.value)}
              />
              {selectedGradient === g.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white shadow" />
                </div>
              )}
              <span className="absolute bottom-0 left-0 right-0 bg-black/40 py-0.5 text-center text-[9px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                {g.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview card */}
      <div className="mt-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Card preview
        </p>
        <div className="relative h-36 overflow-hidden rounded-2xl">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={draft.imagePreviewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br",
                selectedGradient,
              )}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-sm font-bold leading-snug text-white line-clamp-2">
              {draft.title || "Your campaign title"}
            </p>
            <p className="mt-0.5 text-[11px] text-white/70">
              {draft.location || "Location"} · {draft.category || "Category"}
            </p>
          </div>
        </div>
      </div>

      <StepNav
        onBack={onBack}
        onNext={onNext}
        nextLabel="Continue to Review →"
      />
    </div>
  );
}
