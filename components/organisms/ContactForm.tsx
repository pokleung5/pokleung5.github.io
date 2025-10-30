'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { SectionHeader } from '@/components/molecules';
import { fadeInUp, staggerChildren } from '@/lib/animations';
import { fetchLocalizedJson } from '@/lib/data';
import { getTranslations, type Locale } from '@/lib/i18n';
import type { ContactCopy } from '@/lib/types';

type ContactFormProps = {
  locale?: Locale;
  isLoading?: boolean;
  message?: string;
};

const WEB3FORMS_ENDPOINT = process.env.NEXT_PUBLIC_WEB3FORMS_ENDPOINT ?? 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? '';
const WEB3FORMS_HCAPTCHA_SITEKEY = (process.env.NEXT_PUBLIC_WEB3FORMS_HCAPTCHA_SITEKEY ?? '50b2fe65-b00b-4b9e-ad62-3ba471098be2').trim();
const WEB3FORMS_HCAPTCHA_ENABLED =
  (process.env.NEXT_PUBLIC_WEB3FORMS_ENABLE_HCAPTCHA ?? 'false').trim().toLowerCase() === 'true';
const WEB3FORMS_HCAPTCHA_ACTIVE = WEB3FORMS_HCAPTCHA_ENABLED && WEB3FORMS_HCAPTCHA_SITEKEY.length > 0;

export function ContactForm({ locale = 'en', isLoading: isLoadingOverride = false, message }: ContactFormProps = {}) {
  const [copy, setCopy] = useState<ContactCopy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadContactCopy = async () => {
      setIsLoading(true);
      setCopy(null);
      setError(null);

      const contactTranslations = getTranslations(locale).contact as ContactCopy;

      try {
        const payload = await fetchLocalizedJson<ContactCopy>('contact.json', locale);
        if (!cancelled) {
          setCopy(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(contactTranslations?.error ?? 'Unable to load the contact form copy. Please refresh and try again.');
        }

        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load contact copy', err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadContactCopy();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const feedbackMessage = message ?? error ?? undefined;

  if (isLoadingOverride || isLoading || !copy) {
    return <ContactFormSkeleton message={feedbackMessage} />;
  }

  return <ContactFormShell copy={copy} message={feedbackMessage} />;
}

type ContactFormShellProps = {
  copy: ContactCopy;
  message?: string;
};

type ContactFormSkeletonProps = {
  message?: string;
};

function ContactFormShell({ copy, message }: ContactFormShellProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusText, setStatusText] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<InstanceType<typeof HCaptcha> | null>(null);

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timeout = window.setTimeout(() => {
        setStatus('idle');
        setStatusText(null);
      }, 6000);

      return () => window.clearTimeout(timeout);
    }
  }, [status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setStatusText(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const accessKey = WEB3FORMS_ACCESS_KEY?.trim();

    if (!accessKey) {
      setStatus('error');
      setStatusText(copy.errorMessage ?? 'Contact form is not configured. Please reach out via email.');
      return;
    }

    formData.set('access_key', accessKey);

    if (copy.subject) {
      const subject = copy.subject.trim();
      if (subject) {
        formData.set('subject', subject);
      }
    }

    if (WEB3FORMS_HCAPTCHA_ACTIVE) {
      const token = captchaToken?.trim() ?? '';
      if (!token) {
        setStatus('error');
        setStatusText(
          copy.captchaErrorMessage ??
            copy.errorMessage ??
            'Please verify that you are human by completing the captcha.'
        );
        return;
      }
      formData.set('h-captcha-response', token);
    } else {
      formData.delete('h-captcha-response');
    }

    try {
      const payload = Object.fromEntries(formData.entries()) as Record<string, string>;

      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { success?: boolean; message?: string };

      if (response.ok && result?.success) {
        form.reset();
        if (WEB3FORMS_HCAPTCHA_ACTIVE) {
          captchaRef.current?.resetCaptcha();
          setCaptchaToken(null);
        }
        setStatus('success');
        const successCopy = copy.successMessage
          ? `${copy.successMessage}${copy.statusMessage ? ` ${copy.statusMessage}` : ''}`
          : copy.statusMessage ?? result.message ?? null;
        setStatusText(successCopy);
      } else {
        setStatus('error');
        const fallbackError = copy.errorMessage ?? 'We could not send your message. Please try again soon.';
        const composedError = result?.message ? `${fallbackError} - ${result.message}` : fallbackError;
        setStatusText(composedError);

        if (process.env.NODE_ENV !== 'production') {
          console.error('Web3Forms submission failed', result);
        }
        if (WEB3FORMS_HCAPTCHA_ACTIVE) {
          captchaRef.current?.resetCaptcha();
          setCaptchaToken(null);
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to submit contact form', err);
      }
      setStatus('error');
      const fallbackError = copy.errorMessage ?? 'We could not send your message. Please try again soon.';
      setStatusText(fallbackError);
      if (WEB3FORMS_HCAPTCHA_ACTIVE) {
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
      }
    }
  };

  return (
    <section id="contact" className="relative max-w-4xl">
      <motion.div
        className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-[0_35px_70px_-45px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="pointer-events-none absolute -inset-px rounded-[2.6rem] bg-[radial-gradient(circle_at_top,_rgba(52,52,52,0.55),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(28,28,28,0.45),_transparent_50%)] opacity-60" />
        <div className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-foreground/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-foreground/10 blur-3xl" />
        <div className="relative z-10">
          <motion.div className="mb-10 space-y-4 text-center" variants={fadeInUp}>
            <SectionHeader
              as="div"
              align="center"
              eyebrow={copy.eyebrow}
              title={copy.title}
              titleProps={{ variant: 'gradient' }}
              description={copy.description}
              descriptionProps={{ className: 'mt-4 text-base text-foreground/70 sm:text-base' }}
            />
            {message ? <p className="text-xs text-foreground/50">{message}</p> : null}
          </motion.div>
          <motion.form
            onSubmit={handleSubmit}
            className="grid gap-6"
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.label className="group relative flex flex-col" variants={fadeInUp}>
              <span className="text-sm uppercase tracking-[0.3em] text-foreground/40">{copy.nameLabel}</span>
              <input
                type="text"
                name="name"
                required
                placeholder={copy.namePlaceholder}
                className="mt-2 rounded-2xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.08)] focus:ring-4 focus:ring-foreground/10"
              />
            </motion.label>
            <motion.label className="group relative flex flex-col" variants={fadeInUp}>
              <span className="text-sm uppercase tracking-[0.3em] text-foreground/40">{copy.emailLabel}</span>
              <input
                type="email"
                name="email"
                required
                placeholder={copy.emailPlaceholder}
                className="mt-2 rounded-2xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.08)] focus:ring-4 focus:ring-foreground/10"
              />
            </motion.label>
            <motion.label className="group relative flex flex-col" variants={fadeInUp}>
              <span className="text-sm uppercase tracking-[0.3em] text-foreground/40">{copy.messageLabel}</span>
              <textarea
                name="message"
                rows={4}
                required
                placeholder={copy.messagePlaceholder}
                className="mt-2 rounded-2xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.08)] focus:ring-4 focus:ring-foreground/10"
              />
            </motion.label>
            {WEB3FORMS_HCAPTCHA_ACTIVE ? (
              <motion.div variants={fadeInUp}>
                <HCaptcha
                  sitekey={WEB3FORMS_HCAPTCHA_SITEKEY}
                  theme="dark"
                  onVerify={(token) => {
                    setCaptchaToken(token);
                  }}
                  onExpire={() => {
                    setCaptchaToken(null);
                    captchaRef.current?.resetCaptcha();
                  }}
                  onError={() => {
                    setCaptchaToken(null);
                    captchaRef.current?.resetCaptcha();
                  }}
                  onClose={() => {
                    setCaptchaToken(null);
                  }}
                  ref={captchaRef}
                />
              </motion.div>
            ) : null}
            <motion.button
              type="submit"
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={status === 'submitting'}
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 px-7 text-sm font-semibold text-background shadow-[0_25px_45px_-25px_rgba(0,0,0,0.65)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {status === 'submitting'
                ? copy.submittingLabel ?? 'Sending...'
                : status === 'success'
                  ? copy.submittedLabel
                  : copy.submitLabel}
            </motion.button>
            <motion.div
              role="status"
              aria-live="polite"
              variants={fadeInUp}
              className={`min-h-[1.5rem] text-sm transition-opacity ${status === 'success' || status === 'error' ? 'opacity-100' : 'opacity-0'} ${status === 'error' ? 'text-red-200' : 'text-foreground/70'}`}
            >
              {status === 'success' ? statusText ?? copy.statusMessage : null}
              {status === 'error' ? statusText ?? copy.errorMessage ?? 'We could not send your message. Please try again soon.' : null}
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
}

export function ContactFormSkeleton({ message }: ContactFormSkeletonProps) {
  return (
    <section id="contact" className="relative max-w-4xl">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-[0_35px_70px_-45px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute -inset-px rounded-[2.6rem] bg-[radial-gradient(circle_at_top,_rgba(52,52,52,0.55),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(28,28,28,0.45),_transparent_50%)] opacity-60" />
        <div className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-foreground/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-foreground/10 blur-3xl" />
        <div className="relative z-10">
          <div className="mb-10 space-y-4 text-center">
            <SkeletonBar className="mx-auto h-4 w-32" />
            <SkeletonBar className="mx-auto h-8 w-72 sm:w-96" />
            <SkeletonBlock lines={3} />
            {message ? <p className="text-xs text-foreground/50">{message}</p> : null}
          </div>
          <div className="grid gap-6">
            <SkeletonFormField labelWidth="w-16" fieldHeight="h-12" />
            <SkeletonFormField labelWidth="w-16" fieldHeight="h-12" />
            <SkeletonFormField labelWidth="w-24" fieldHeight="h-32" />
            <div className="flex justify-center">
              <span className="inline-flex h-12 w-48 animate-pulse rounded-full bg-white/10" aria-hidden="true" />
            </div>
            <span className="mx-auto h-4 w-64 animate-pulse rounded-full bg-white/5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SkeletonFormField({ labelWidth, fieldHeight }: { labelWidth: string; fieldHeight: string }) {
  return (
    <div className="flex flex-col gap-2">
      <SkeletonBar className={`h-3 ${labelWidth}`} />
      <span
        className={`block w-full ${fieldHeight} animate-pulse rounded-2xl border border-white/10 bg-white/5`}
        aria-hidden="true"
      />
    </div>
  );
}

function SkeletonBar({ className }: { className?: string }) {
  return <span className={`block animate-pulse rounded-full bg-white/10 ${className ?? ''}`} aria-hidden="true" />;
}

function SkeletonBlock({ lines = 2 }: { lines?: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {Array.from({ length: lines }).map((_, index) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="inline-block h-4 w-full max-w-2xl animate-pulse rounded-full bg-white/5"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
