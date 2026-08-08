"use client";

import { useActionState } from "react";
import { aboutBio } from "@/content/about/bio";
import { sendContactMessage, type ContactFormState } from "@/lib/contact";

const initialState: ContactFormState = {
  status: "idle",
  message: "",
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState,
  );

  return (
    <form className="about-contact" action={formAction}>
      <label className="about-field">
        <span>{aboutBio.contact.name}</span>
        <input className="about-input" name="name" type="text" required />
      </label>
      <label className="about-field">
        <span>{aboutBio.contact.email}</span>
        <input className="about-input" name="email" type="email" required />
      </label>
      <label className="about-field">
        <span>{aboutBio.contact.message}</span>
        <textarea
          className="about-input about-input--message"
          name="message"
          required
        />
      </label>
      <div className="about-contact__footer">
        <button className="about-button" type="submit" disabled={isPending}>
          {isPending ? aboutBio.contact.sending : aboutBio.contact.send}
        </button>
        {state.message ? (
          <p className="about-contact__status" role="status" aria-live="polite">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
