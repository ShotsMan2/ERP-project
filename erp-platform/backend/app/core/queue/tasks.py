from __future__ import annotations

import logging
from typing import Any

from app.core.queue.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_email(
    self: Any,
    to: str,
    subject: str,
    body: str,
    cc: list[str] | None = None,
    bcc: list[str] | None = None,
    attachments: list[dict] | None = None,
) -> dict:
    try:
        logger.info("Sending email to %s with subject '%s'", to, subject)
        from app.config import settings
        import smtplib
        from email.mime.multipart import MIMEMultipart
        from email.mime.text import MIMEText

        msg = MIMEMultipart("alternative")
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        msg["To"] = to
        msg["Subject"] = subject
        if cc:
            msg["Cc"] = ", ".join(cc)
        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            if settings.SMTP_USER:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            recipients = [to] + (cc or [])
            server.sendmail(settings.SMTP_FROM_EMAIL, recipients, msg.as_string())

        return {"success": True, "to": to, "subject": subject}
    except Exception as exc:
        logger.error("Failed to send email to %s: %s", to, exc)
        raise self.retry(exc=exc)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def send_sms(self: Any, phone: str, message: str, provider: str = "twilio") -> dict:
    try:
        logger.info("Sending SMS to %s via %s", phone, provider)
        return {"success": True, "to": phone}
    except Exception as exc:
        logger.error("Failed to send SMS to %s: %s", phone, exc)
        raise self.retry(exc=exc)


@celery_app.task(bind=True, max_retries=2, default_retry_delay=120)
def generate_report(
    self: Any,
    report_type: str,
    params: dict[str, Any],
    output_format: str = "pdf",
) -> dict:
    try:
        logger.info("Generating report '%s' in %s format", report_type, output_format)
        return {
            "success": True,
            "report_type": report_type,
            "format": output_format,
            "file_url": f"/reports/{report_type}_{self.request.id}.{output_format}",
        }
    except Exception as exc:
        logger.error("Failed to generate report %s: %s", report_type, exc)
        raise self.retry(exc=exc)
