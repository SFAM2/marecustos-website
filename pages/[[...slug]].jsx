import fs from 'node:fs/promises';
import path from 'node:path';
import Head from 'next/head';
import { useEffect } from 'react';

const names = ['index', 'applications', 'industries', 'about', 'contact', 'privacy', 'terms'];

export async function getStaticPaths() {
  return { paths: names.map((name) => ({ params: { slug: name === 'index' ? [] : [name] } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const name = params.slug?.[0] || 'index';
  const source = await fs.readFile(path.join(process.cwd(), `${name}.html`), 'utf8');
  const title = source.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'Mare Custos';
  const scripts = [...source.matchAll(/<script\s+src="([^"]+)"[^>]*><\/script>/gi)].map((match) => `/${match[1]}`);
  const html = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1]
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/href="index\.html(#[^"]*)?"/g, 'href="/$1"')
    .replace(/href="(about|applications|industries|contact|privacy|terms)\.html/g, 'href="/$1')
    .replace(/(src|poster)="assets\//g, '$1="/assets/');
  return { props: { title, html, scripts, turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '' } };
}

export default function Page({ title, html, scripts, turnstileSiteKey }) {
  useEffect(() => {
    // Native links reload the document, preserving the existing scripts' lifecycle.
    let cancelled = false;
    async function load() {
      for (const src of scripts) {
        if (cancelled) return;
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = resolve;
          document.body.appendChild(script);
        });
      }
    }
    load();
    const form = document.querySelector('.contact-form');
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    status.className = 'contact-status';
    let widgetId;
    let widgetContainer;
    let widgetScript;
    let submitting = false;
    const submitButton = form?.querySelector('[type="submit"]');
    if (form) {
      form.querySelector('[name="consent"]').required = true;
      form.appendChild(status);
      if (turnstileSiteKey) {
        submitButton.disabled = true;
        widgetContainer = document.createElement('div');
        form.insertBefore(widgetContainer, submitButton);
        function renderWidget() {
          if (cancelled || widgetId !== undefined) return;
          window.turnstile.ready(() => {
            if (cancelled || widgetId !== undefined) return;
            widgetId = window.turnstile.render(widgetContainer, {
              sitekey: turnstileSiteKey,
              action: 'contact',
              theme: 'dark',
              size: 'flexible',
              callback: () => { submitButton.disabled = submitting; status.textContent = ''; },
              'expired-callback': () => { submitButton.disabled = true; },
              'error-callback': () => {
                submitButton.disabled = true;
                status.textContent = 'Security verification is unavailable. Please refresh or email contact@mare-custos.com.';
              },
            });
          });
        }
        if (window.turnstile) renderWidget();
        else {
          widgetScript = document.createElement('script');
          widgetScript.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
          widgetScript.async = true;
          widgetScript.onload = renderWidget;
          widgetScript.onerror = () => {
            if (!cancelled) status.textContent = 'Security verification could not load. Please refresh or email contact@mare-custos.com.';
          };
          document.head.appendChild(widgetScript);
        }
      }
    }
    async function submit(event) {
      event.preventDefault();
      if (submitting || !form.reportValidity()) return;
      const payload = Object.fromEntries(new FormData(form));
      if (turnstileSiteKey && !payload['cf-turnstile-response']) {
        status.textContent = 'Please complete the security verification.';
        return;
      }
      submitting = true;
      submitButton.disabled = true;
      status.textContent = 'Sending your enquiry...';
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          if (response.status === 429) throw new Error('Too many submissions. Please wait 10 minutes before trying again.');
          const result = await response.json().catch(() => null);
          throw new Error(result?.error || 'Your enquiry could not be sent. Please try again later.');
        }
        form.reset();
        status.textContent = 'Thank you. Your enquiry has been sent.';
      } catch (error) {
        status.textContent = error.message || 'Your enquiry could not be sent. Please email contact@mare-custos.com or try again later.';
      } finally {
        submitting = false;
        if (turnstileSiteKey) {
          submitButton.disabled = true;
          if (widgetId !== undefined) window.turnstile?.reset(widgetId);
        } else submitButton.disabled = false;
      }
    }
    form?.addEventListener('submit', submit);
    return () => {
      cancelled = true;
      form?.removeEventListener('submit', submit);
      if (widgetId !== undefined) window.turnstile?.remove(widgetId);
      widgetContainer?.remove();
      widgetScript?.remove();
      status.remove();
    };
  }, [scripts, turnstileSiteKey]);

  return <>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/styles.css" />
    </Head>
    <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />
  </>;
}
