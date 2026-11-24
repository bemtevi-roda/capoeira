let feedbackTimer: number | undefined;

function showFeedback(button: HTMLButtonElement, text: string): void {
  let feedback = document.querySelector<HTMLDivElement>('.share-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'share-feedback';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    document.body.append(feedback);
  }

  feedback.lang = button.dataset.shareLocale === 'he' ? 'he' : button.dataset.shareLocale!;
  feedback.dir = button.dataset.shareLocale === 'he' ? 'rtl' : 'ltr';
  feedback.textContent = text;
  feedback.dataset.visible = 'true';
  const buttonRect = button.getBoundingClientRect();
  feedback.style.top = `${buttonRect.bottom + 8}px`;
  const halfWidth = feedback.offsetWidth / 2;
  const center = Math.min(
    window.innerWidth - 16 - halfWidth,
    Math.max(16 + halfWidth, buttonRect.left + buttonRect.width / 2),
  );
  feedback.style.left = `${center}px`;
  if (feedbackTimer !== undefined) window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => feedback?.removeAttribute('data-visible'), 2200);
}

async function share(button: HTMLButtonElement): Promise<void> {
  const title = button.dataset.shareTitle!;
  const url = button.dataset.shareUrl!;

  try {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Share page:', error);
      }
    }

    await navigator.clipboard.writeText(url);
    showFeedback(button, button.dataset.shareCopied!);
  } catch (error) {
    console.error('Copy share link:', error);
    showFeedback(button, button.dataset.shareFailed!);
  }
}

/** Wires the share button on each song page. */
export function initShareButtons(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-share]')) {
    button.addEventListener('click', () => {
      button.disabled = true;
      void share(button).finally(() => {
        button.disabled = false;
      });
    });
  }
}
