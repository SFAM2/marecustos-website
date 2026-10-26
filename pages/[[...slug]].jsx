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
  return { props: { title, html, scripts } };
}

export default function Page({ title, html, scripts }) {
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
    if (form) {
      form.querySelector('[name="consent"]').required = true;
      form.appendChild(status);
    }
    async function submit(event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector('[type="submit"]');
      button.disabled = true;
      status.textContent = 'Sending your enquiry...';
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        if (!response.ok) throw new Error('Send failed');
        form.reset();
        status.textContent = 'Thank you. Your enquiry has been sent.';
      } catch {
        status.textContent = 'Your enquiry could not be sent. Please email contact@mare-custos.com or try again later.';
      } finally {
        button.disabled = false;
      }
    }
    form?.addEventListener('submit', submit);
    return () => { cancelled = true; form?.removeEventListener('submit', submit); status.remove(); };
  }, [scripts]);

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
