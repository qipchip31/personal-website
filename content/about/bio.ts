export type SocialLinkLabel =
  "github" | "linkedin" | "instagram" | "twitter/x" | "email";

export type AboutBio = {
  hello: string;
  introduction: string[];
  sections: {
    currently: string;
    findMe: string;
    sayHello: string;
  };
  contact: {
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    missingConfig: string;
    error: string;
  };
  socialLabels: SocialLinkLabel[];
};

export const aboutBio = {
  hello: "hello. i'm chirag.",
  introduction: [
    "i like building things for fun.",
    "most days, that means thinking about product shape, developer tools, ai systems, and the quiet details that most people miss.",
    "i enjoy learning by making small, durable things and then sharpening them until they feel obvious.",
  ],
  sections: {
    currently: "currently",
    findMe: "find me",
    sayHello: "say hello",
  },
  contact: {
    name: "name",
    email: "email",
    message: "message",
    send: "send",
    sending: "sending",
    success: "sent. i'll read it soon.",
    missingConfig:
      "message saved locally in the form. resend is not configured yet.",
    error: "could not send. please email me directly.",
  },
  socialLabels: ["github", "linkedin", "instagram", "twitter/x", "email"],
} satisfies AboutBio;
