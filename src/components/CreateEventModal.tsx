"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import styles from "../styles/CreateEventModal.module.css";

interface EventData {
  name: string;
  description: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  imageUrl?: string;
}
interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const [draft, setDraft] = useState<EventData>({
    name: "",
    description: "",
    location: "",
    startDateTime: new Date(),
    endDateTime: new Date(),
  });

  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const resetDraft = () => {
    if (draft.imageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(draft.imageUrl);
    }

    setDraft({
      name: "",
      description: "",
      location: "",
      startDateTime: new Date(),
      endDateTime: new Date(),
      imageUrl: undefined,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleSave = async () => {
    try {
      setSubmitting(true);

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: draft.name,
          description: draft.description,
          location: draft.location,
          time: draft.startDateTime,
          // endDateTime: draft.endDateTime,
          // imageUrl: draft.imageUrl,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create event");
      }
      resetDraft();
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Failed to create event:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartTimeChange = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newStart = new Date(draft.startDateTime);
    newStart.setHours(hours, minutes, 0, 0);

    setDraft({
      ...draft,
      startDateTime: newStart,
    });
  };

  const handleEndTimeChange = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newEnd = new Date(draft.endDateTime);
    newEnd.setHours(hours, minutes, 0, 0);

    setDraft({
      ...draft,
      endDateTime: newEnd,
    });
  };

  const handleImageChange = (file: File | null) => {
    if (draft.imageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(draft.imageUrl);
    }

    if (!file) {
      setDraft({ ...draft, imageUrl: undefined });
      return;
    }

    const url = URL.createObjectURL(file);
    setDraft({ ...draft, imageUrl: url });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.headerRow}>
          <h3 className={styles.headerTitle}>Create New Event</h3>
        </div>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <div>
            <span className={styles.detailLabel}>Date:</span>
            <input type="date" className={styles.input} />
          </div>

          <div>
            <span className={styles.detailLabel}>Time:</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input type="time" className={styles.input} onChange={(e) => handleStartTimeChange(e.target.value)} />
              <span style={{ margin: "0 8px" }}>to</span>
              <input type="time" className={styles.input} onChange={(e) => handleEndTimeChange(e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <span className={styles.detailLabel}>Title: </span>
          <div style={{ marginTop: "8px" }}>
            <input
              className={styles.input}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>
        </div>

        <div>
          <span className={styles.detailLabel}>Description: </span>
          <div style={{ marginTop: "8px" }}>
            <textarea
              className={styles.textarea}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>
        </div>

        <div>
          <span className={styles.detailLabel}>Location: </span>
          <div style={{ marginTop: "8px" }}>
            <input
              className={styles.input}
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            />
          </div>
        </div>

        <div style={{ marginTop: "8px", maxWidth: "320px" }}>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            {/* change/upload image */}
            <button type="button" className={styles.imageButton} onClick={() => fileInputRef.current?.click()}>
              {draft.imageUrl ? "Change Image" : "Upload Image"}
            </button>

            {/* remove image */}
            {draft.imageUrl && (
              <button
                type="button"
                className={styles.imageButton}
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  handleImageChange(null);
                }}
              >
                Remove Image
              </button>
            )}
          </div>
          {draft.imageUrl && (
            <div style={{ marginTop: "10px" }}>
              <Image
                src={draft.imageUrl}
                alt="event upload preview"
                width={320}
                height={200}
                className={styles.imagePreview}
                unoptimized
              />
            </div>
          )}
        </div>

        <div className={styles.buttonRow}>
          <button type="button" className={styles.createButton} onClick={handleSave} disabled={submitting}>
            Create
          </button>
          <button type="button" className={styles.createButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
