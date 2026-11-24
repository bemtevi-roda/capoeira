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

/** Wires the share button on each song page. */
export function initShareButtons(): void {
  for (const control of document.querySelectorAll<HTMLElement>('[data-share-control]')) {
    const toggle = control.querySelector<HTMLButtonElement>('[data-share-toggle]')!;
    const options = control.querySelector<HTMLElement>('.share-options')!;
    const copyButton = control.querySelector<HTMLButtonElement>('[data-share-copy]')!;
    const nativeButton = control.querySelector<HTMLButtonElement>('[data-share-native]')!;
    const whatsappLink = control.querySelector<HTMLAnchorElement>('[data-share-whatsapp]')!;
    nativeButton.hidden = typeof navigator.share !== 'function';

    const close = () => {
      options.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      options.hidden = !options.hidden;
      toggle.setAttribute('aria-expanded', String(!options.hidden));
    });

    whatsappLink.addEventListener('click', close);

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyButton.dataset.shareUrl!);
        showFeedback(toggle, copyButton.dataset.shareCopied!);
      } catch (error) {
        console.error('Copy share link:', error);
        showFeedback(toggle, copyButton.dataset.shareFailed!);
      } finally {
        close();
      }
    });

    nativeButton.addEventListener('click', async () => {
      try {
        await navigator.share({
          title: nativeButton.dataset.shareTitle!,
          url: nativeButton.dataset.shareUrl!,
        });
      } catch (error) {
        if (!(error instanceof Error && error.name === 'AbortError')) {
          console.error('Share page:', error);
          showFeedback(toggle, nativeButton.dataset.shareFailed!);
        }
      } finally {
        close();
      }
    });

    document.addEventListener('click', (event) => {
      if (!control.contains(event.target as Node)) close();
    });

    control.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !options.hidden) {
        close();
        toggle.focus();
      }
    });
  }
}
