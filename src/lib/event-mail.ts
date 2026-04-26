const RESEND = "https://api.resend.com/emails";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeHtmlAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

const brand = (): string => {
  const c = process.env.EVENT_EMAIL_BRAND_COLOR?.trim();
  if (c && /^#[0-9A-Fa-f]{6}$/.test(c)) return c;
  return "#0c4a6e";
};

function buildHtmlBlock(opts: {
  title: string;
  leadHtml: string;
  ctaLabel: string;
  ctaUrl: string;
  footNote?: string;
}): string {
  const c = brand();
  const cta = escapeHtmlAttr(opts.ctaUrl);
  const foot = opts.footNote ? escapeHtml(opts.footNote) : "";
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,system-ui,Segoe UI,sans-serif;font-size:16px;color:#0f172a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 1px 2px rgba(15,23,42,0.06)">
<tr><td style="padding:24px 20px 8px 20px;font-size:20px;font-weight:700;color:#0c4a6e">ACEP Events</td></tr>
<tr><td style="padding:0 20px 16px 20px;border-bottom:1px solid #e2e8f0">
<p style="margin:0 0 12px 0;line-height:1.5">${opts.leadHtml}</p>
<a href="${cta}" style="display:inline-block;margin-top:4px;padding:10px 18px;background:${escapeHtml(
    c
  )};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px">${escapeHtml(opts.ctaLabel)}</a>
${foot ? `<p style="margin:16px 0 0 0;font-size:13px;color:#64748b">${foot}</p>` : ""}
</td></tr>
<tr><td style="padding:14px 20px 20px 20px;font-size:12px;color:#94a3b8;line-height:1.45">
If the button does not work, copy and paste this link into your browser:<br>
<span style="word-break:break-all;color:#64748b">${escapeHtml(opts.ctaUrl)}</span>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

type SendResult = { mode: "resend" | "log" };

async function sendTransactional(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
  logLabel: string;
}): Promise<SendResult> {
  const from = process.env.EVENT_EMAIL_FROM?.trim() || "ACEP Events <onboarding@resend.dev>";
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.log(
      `[event-mail:${opts.logLabel}] To: ${opts.to}\nSubject: ${opts.subject}\n-----\n${opts.text}\n-----`
    );
    return { mode: "log" };
  }
  const res = await fetch(RESEND, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error(`[event-mail:resend:${opts.logLabel}]`, res.status, t);
  }
  return { mode: "resend" };
}

export async function sendEventConfirmationEmail(
  to: string,
  eventTitle: string,
  confirmUrl: string
): Promise<SendResult> {
  const subject = `Confirm your registration: ${eventTitle}`;
  const text = `Thanks for signing up for ${eventTitle}.\n\nConfirm your email (this link is single-use):\n${confirmUrl}\n`;
  const html = buildHtmlBlock({
    title: subject,
    leadHtml: `Thanks for signing up for <strong>${escapeHtml(eventTitle)}</strong>. Confirm your email to receive your check-in code.`,
    ctaLabel: "Confirm registration",
    ctaUrl: confirmUrl,
    footNote: "The confirmation link is private—do not forward it.",
  });
  return sendTransactional({ to, subject, text, html, logLabel: "attendee-confirm" });
}

export async function sendExhibitorConfirmationEmail(
  to: string,
  eventTitle: string,
  confirmUrl: string
): Promise<SendResult> {
  const subject = `Confirm exhibitor registration: ${eventTitle}`;
  const text = `Thanks for registering your organisation for ${eventTitle}.\n\nConfirm your contact email:\n${confirmUrl}\n`;
  const html = buildHtmlBlock({
    title: subject,
    leadHtml: `You registered an exhibitor for <strong>${escapeHtml(
      eventTitle
    )}</strong>. Please confirm the organisation&rsquo;s contact email to finish setup.`,
    ctaLabel: "Confirm exhibitor email",
    ctaUrl: confirmUrl,
  });
  return sendTransactional({ to, subject, text, html, logLabel: "exhibitor-confirm" });
}

export async function sendSpeakerInviteEmail(
  to: string,
  eventTitle: string,
  speakerPortalUrl: string
): Promise<SendResult> {
  const subject = `Your speaker link: ${eventTitle}`;
  const text = `You have been added as a speaker for ${eventTitle}.\n\nYour personal access link (keep it private, like a Zoom join URL):\n${speakerPortalUrl}\n`;
  const html = buildHtmlBlock({
    title: subject,
    leadHtml: `You&rsquo;ve been added as a <strong>speaker</strong> for <strong>${escapeHtml(
      eventTitle
    )}</strong>. Open your personal link below&mdash;it should not be shared publicly. If the organiser sends a new invite, this link will stop working.`,
    ctaLabel: "Open speaker access",
    ctaUrl: speakerPortalUrl,
  });
  return sendTransactional({ to, subject, text, html, logLabel: "speaker-invite" });
}

/** Fire-and-forget when `PORTAL_SUBMISSION_NOTIFY_EMAIL` is set and Resend is configured (or logs in dev). */
export function notifyStaffPortalContributionIfConfigured(opts: { eventTitle: string; contributorEmail: string }) {
  const notify = process.env.PORTAL_SUBMISSION_NOTIFY_EMAIL?.trim();
  if (!notify) return;
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "") || "http://localhost:3100";
  const moderationUrl = `${base}/admin/portal-contributions`;
  void sendStaffPortalContributionSubmitted({
    to: notify,
    eventTitle: opts.eventTitle,
    contributorLabel: opts.contributorEmail,
    moderationUrl,
  });
}

export async function sendStaffPortalContributionSubmitted(opts: {
  to: string;
  eventTitle: string;
  contributorLabel: string;
  moderationUrl: string;
}): Promise<SendResult> {
  const subject = `[Portal] Organiser material pending review: ${opts.eventTitle}`;
  const text = `A participant submitted organiser materials for "${opts.eventTitle}".\n\nContributor: ${opts.contributorLabel}\n\nReview in the admin console:\n${opts.moderationUrl}\n`;
  const html = buildHtmlBlock({
    title: subject,
    leadHtml: `Someone submitted <strong>organiser materials</strong> for <strong>${escapeHtml(
      opts.eventTitle
    )}</strong> (${escapeHtml(opts.contributorLabel)}). Approve or reject in the admin console.`,
    ctaLabel: "Review organiser materials",
    ctaUrl: opts.moderationUrl,
    footNote: "This is separate from News &amp; posts publishing.",
  });
  return sendTransactional({
    to: opts.to,
    subject,
    text,
    html,
    logLabel: "portal-material-pending",
  });
}

export async function sendPublicFormSubmissionStaffEmail(opts: {
  to: string;
  kindLabel: string;
  submissionId: string;
  inboxUrl: string;
}): Promise<SendResult> {
  const subject = `[ACEP Forms] New ${opts.kindLabel}`;
  const text = `A visitor submitted a public form.\n\nKind: ${opts.kindLabel}\nSubmission ID: ${opts.submissionId}\n\nReview in admin:\n${opts.inboxUrl}\n`;
  const html = buildHtmlBlock({
    title: subject,
    leadHtml: `A new <strong>${escapeHtml(opts.kindLabel)}</strong> submission was stored. Open the inbox to read the full payload.`,
    ctaLabel: "Open public form inbox",
    ctaUrl: opts.inboxUrl,
    footNote: `Submission id: ${escapeHtml(opts.submissionId)}`,
  });
  return sendTransactional({
    to: opts.to,
    subject,
    text,
    html,
    logLabel: "public-form-notify",
  });
}

/** Fire-and-forget when `PUBLIC_FORM_NOTIFY_EMAIL` is set (uses Resend / logs like other transactional mail). */
export function notifyStaffPublicFormSubmissionIfConfigured(opts: { kind: string; submissionId: string }) {
  const to = process.env.PUBLIC_FORM_NOTIFY_EMAIL?.trim();
  if (!to) return;
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "") || "http://localhost:3100";
  const inboxUrl = `${base}/admin/public-submissions`;
  const kindLabel =
    opts.kind === "ELECTRICITY_COMPLAINT"
      ? "Electricity complaint"
      : opts.kind === "TAX_WHISTLEBLOWER"
        ? "Tax whistleblower"
        : opts.kind;
  void sendPublicFormSubmissionStaffEmail({
    to,
    kindLabel,
    submissionId: opts.submissionId,
    inboxUrl,
  });
}

export async function sendPortalPasswordResetEmail(to: string, resetUrl: string): Promise<SendResult> {
  const subject = "Reset your ACEP participant portal password";
  const text = `We received a request to reset the password for the ACEP participant portal (speakers, exhibitors, attendees).\n\nIf you made this request, open this link within two hours:\n${resetUrl}\n\nIf you did not request a reset, you can ignore this email.\n`;
  const html = buildHtmlBlock({
    title: subject,
    leadHtml: `We received a request to reset your password for the <strong>participant portal</strong>. If this was you, use the button below. The link expires in two hours.`,
    ctaLabel: "Choose a new password",
    ctaUrl: resetUrl,
    footNote: "If you did not request this, you can ignore this message.",
  });
  return sendTransactional({ to, subject, text, html, logLabel: "portal-password-reset" });
}

/** @internal for unit tests */
export const __testMail = { escapeHtml, escapeHtmlAttr, buildHtmlBlock, brand };
