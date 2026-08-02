"use client";

import { useState } from "react";

const NAME_MAX = 80;
const MESSAGE_MAX = 2000;

/**
 * Lets a friend submit their own memory/message for Ali from their track page.
 * Wired to the now-live `POST /api/memories`:
 *   body: { friendName, message } (both required, trimmed, within length limits)
 *   201 -> { memory: { id, friendName, message, submittedAt } }
 *   400 -> { error: "invalid_json" | "validation_error", message, fieldErrors? }
 *   500 -> { error: "storage_error", message }
 */
export default function MemoryForm({ friendName }) {
  const [nameValue, setNameValue] = useState(friendName || "");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    const trimmedName = nameValue.trim();
    const trimmedMessage = message.trim();

    const nextFieldErrors = {};
    if (!trimmedName) nextFieldErrors.friendName = "your name can't be empty.";
    else if (trimmedName.length > NAME_MAX) nextFieldErrors.friendName = `keep it under ${NAME_MAX} characters.`;
    if (!trimmedMessage) nextFieldErrors.message = "say something first.";
    else if (trimmedMessage.length > MESSAGE_MAX) nextFieldErrors.message = `keep it under ${MESSAGE_MAX} characters.`;

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setStatus("error");
      setErrorMessage("");
      return;
    }

    setStatus("sending");
    setFieldErrors({});
    setErrorMessage("");

    try {
      const response = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendName: trimmedName, message: trimmedMessage }),
      });

      if (response.status === 201) {
        setStatus("done");
        return;
      }

      const payload = await response.json().catch(() => null);

      if (response.status === 400 && payload) {
        setFieldErrors(payload.fieldErrors ?? {});
        setErrorMessage(payload.message || "double check what you wrote and try again.");
        setStatus("error");
        return;
      }

      setErrorMessage(payload?.message || "something went wrong saving that — try again in a bit.");
      setStatus("error");
    } catch {
      setErrorMessage("couldn’t reach the archive — check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return <p className="memory-form-thanks">added to the archive. thank you, {nameValue || friendName}.</p>;
  }

  return (
    <form className="memory-form" onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor="memory-name">
        your name
      </label>
      <input
        id="memory-name"
        type="text"
        className="memory-form-input memory-form-name"
        placeholder="Your name"
        value={nameValue}
        maxLength={NAME_MAX}
        onChange={(event) => setNameValue(event.target.value)}
        aria-invalid={fieldErrors.friendName ? "true" : undefined}
      />
      {fieldErrors.friendName ? <p className="memory-form-error">{fieldErrors.friendName}</p> : null}

      <label className="sr-only" htmlFor="memory-message">
        your message
      </label>
      <textarea
        id="memory-message"
        className="memory-form-input"
        rows={3}
        maxLength={MESSAGE_MAX}
        placeholder="Write your message…"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        aria-invalid={fieldErrors.message ? "true" : undefined}
      />
      {fieldErrors.message ? <p className="memory-form-error">{fieldErrors.message}</p> : null}

      {errorMessage ? <p className="memory-form-error memory-form-error-general">{errorMessage}</p> : null}

      <button type="submit" className="memory-form-submit" disabled={status === "sending"}>
        {status === "sending" ? "sending…" : "Add to the archive"}
      </button>
    </form>
  );
}
