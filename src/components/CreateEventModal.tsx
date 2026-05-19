"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import styles from "../styles/CreateEventModal.module.css";

interface EventData {
  name: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  imageUrl?: string;
}
interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const getDefaultDraft = (): EventData => ({
  name: "",
  description: "",
  location: "",
  date: "",
  startTime: "",
  endTime: "",
  imageUrl: undefined,
});

export default function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const [draft, setDraft] = useState<EventData>(getDefaultDraft());
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const resetDraft = () => {
    if (draft.imageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(draft.imageUrl);
    }

    setDraft(getDefaultDraft());
    setSelectedImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async () => {
    if (!selectedImageFile) {
      return draft.imageUrl;
    }

    const formData = new FormData();
    formData.append("file", selectedImageFile);

    const response = await fetch("/api/events/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Failed to upload image");
    }

    return data.url as string;
  };

  const handleSave = async () => {
    if (
      !draft.name.trim() ||
      !draft.location.trim() ||
      !draft.description.trim() ||
      !draft.date ||
      !draft.startTime ||
      !draft.endTime
    ) {
      setError("Please fill out all fields.");
      return;
    }
    const startDateTime = new Date(`${draft.date}T${draft.startTime}`);
    const endDateTime = new Date(`${draft.date}T${draft.endTime}`);

    if (endDateTime <= startDateTime) {
      setError("End time must be after start time");
      return;
    }
    setError(null);

    try {
      setSubmitting(true);
      const uploadedImageUrl = await uploadImage();

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: draft.name,
          description: draft.description,
          location: draft.location,
          startTime: startDateTime,
          endTime: endDateTime,
          imageUrl: uploadedImageUrl,
          registeredCount: 0,
          attendanceCount: 0,
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

  const handleImageChange = (file: File | null) => {
    if (draft.imageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(draft.imageUrl);
    }

    if (!file) {
      setDraft({ ...draft, imageUrl: undefined });
      setSelectedImageFile(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setDraft({ ...draft, imageUrl: url });
    setSelectedImageFile(file);
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
              <input
                type="date"
                className={styles.input}
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <span className={styles.detailLabel}>Time:</span>
              <div className={styles.timeRow}>
                <input
                  type="time"
                  className={styles.input}
                  value={draft.startTime}
                  onChange={(e) => setDraft({ ...draft, startTime: e.target.value })}
                />
                <span className={styles.toText}>to</span>
                <input
                  type="time"
                  className={styles.input}
                  value={draft.endTime}
                  onChange={(e) => setDraft({ ...draft, endTime: e.target.value })}
                />
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
              <button type="button" className={styles.actionButton} onClick={() => fileInputRef.current?.click()}>
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
