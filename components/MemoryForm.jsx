"use client";

import { useMemo, useState } from "react";
import MemoryLyrics, { splitLyricLines } from "./MemoryLyrics";
import WrappedButton from "./WrappedButton";

const NAME_MAX = 80;
const MESSAGE_MAX = 2000;

/**
 * Write a memory like Spotify lyrics — line breaks become lyric lines.
 * Same POST /api/memories contract as before.
 */
export default function MemoryForm({ friendName, onSubmitted }) {
  const [nameValue, setNameValue] = useState(friendName || "");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [activeLine, setActiveLine] = useState(0);

  const previewLines = useMemo(() => {
    const lines = splitLyricLines(message);
    return lines.length ? lines : ["start writing…", "press enter for a new line"];
  }, [message]);

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
        onSubmitted?.({ friendName: trimmedName, message: trimmedMessage });
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
    return (
      <div className="memory-lyrics-done">
        <MemoryLyrics
          credit={`lyrics by ${nameValue || friendName}`}
          lines={splitLyricLines(message)}
          activeIndex={0}
        />
        <p className="memory-form-thanks">added to the track. thank you.</p>
      </div>
    );
  }

  return (
    <form className="memory-lyrics-form" onSubmit={submit} noValidate>
      <p className="memory-lyrics-form-kicker">write it like lyrics</p>

      <label className="sr-only" htmlFor="memory-name">
        your name
      </label>
      <input
        id="memory-name"
        type="text"
        className="memory-lyrics-name"
        placeholder="featuring… (your name)"
        value={nameValue}
        maxLength={NAME_MAX}
        onChange={(event) => setNameValue(event.target.value)}
        aria-invalid={fieldErrors.friendName ? "true" : undefined}
      />
      {fieldErrors.friendName ? <p className="memory-form-error">{fieldErrors.friendName}</p> : null}

      <MemoryLyrics
        credit={nameValue.trim() ? `feat. ${nameValue.trim()}` : "feat. you"}
        lines={previewLines}
        activeIndex={Math.min(activeLine, Math.max(previewLines.length - 1, 0))}
      />

      <label className="sr-only" htmlFor="memory-message">
        your memory as lyrics
      </label>
      <textarea
        id="memory-message"
        className="memory-lyrics-composer"
        rows={5}
        maxLength={MESSAGE_MAX}
        placeholder={"line one\nline two\nline three"}
        value={message}
        onChange={(event) => {
          const next = event.target.value;
          setMessage(next);
          const lines = splitLyricLines(next);
          setActiveLine(Math.max(lines.length - 1, 0));
        }}
        onSelect={(event) => {
          const before = event.currentTarget.value.slice(0, event.currentTarget.selectionStart);
          setActiveLine(before.split(/\n+/).filter(Boolean).length - 1);
        }}
        aria-invalid={fieldErrors.message ? "true" : undefined}
      />
      {fieldErrors.message ? <p className="memory-form-error">{fieldErrors.message}</p> : null}
      {errorMessage ? <p className="memory-form-error memory-form-error-general">{errorMessage}</p> : null}

      <p className="memory-lyrics-hint">press enter for a new lyric line</p>

      <WrappedButton type="submit" variant="primary" disabled={status === "sending"}>
        {status === "sending" ? "saving…" : "add lyrics to the archive"}
      </WrappedButton>
    </form>
  );
}
