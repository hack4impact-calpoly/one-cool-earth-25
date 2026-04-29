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
  const [error, setError] = useState<string | null>(null);
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
    if (
      !draft.name.trim() ||
      !draft.location.trim() ||
      !draft.description.trim() ||
      !draft.startDateTime ||
      !draft.endDateTime
    ) {
      setError("Please fill out all fields");
      return;
    }
    if (draft.endDateTime <= draft.startDateTime) {
      setError("End time must be after start time");
      return;
    }
    setError(null);

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
      setError("Something went wrong. Please try again.");
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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalWrap}>
        <div className={styles.container} onClick={(e) => e.stopPropagation()}>
          <div className={styles.headerRow}>
            <h3 className={styles.headerTitle}>Create New Event</h3>
          </div>

          <div className={styles.formRow}>
            <div className={styles.field}>
              <span className={styles.detailLabel}>Date:</span>
              <input type="date" className={styles.input} />
            </div>

            <div className={styles.field}>
              <span className={styles.detailLabel}>Time:</span>
              <div className={styles.timeRow}>
                <input type="time" className={styles.input} onChange={(e) => handleStartTimeChange(e.target.value)} />
                <span className={styles.toText}>to</span>
                <input type="time" className={styles.input} onChange={(e) => handleEndTimeChange(e.target.value)} />
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.detailLabel}>Title:</span>
            <input
              className={styles.input}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.detailLabel}>Description:</span>
            <textarea
              className={styles.textarea}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.detailLabel}>Location:</span>
            <input
              className={styles.input}
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            />
          </div>

          <div className={styles.imageSection}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className={styles.hiddenInput}
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            />

            <div className={styles.imageButtonRow}>
              <button type="button" className={styles.imageButton} onClick={() => fileInputRef.current?.click()}>
                {draft.imageUrl ? "Change Image" : "Upload Image"}
              </button>

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
              <Image
                src={draft.imageUrl}
                alt="event upload preview"
                width={320}
                height={200}
                className={styles.imagePreview}
                unoptimized
              />
            )}
          </div>

          {error && <div className={styles.errorText}>{error}</div>}

          <div className={styles.buttonRow}>
            <button type="button" className={styles.actionButton} onClick={handleSave} disabled={submitting}>
              {submitting ? "Creating..." : "Create"}
            </button>

            <button type="button" className={styles.actionButton} onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
