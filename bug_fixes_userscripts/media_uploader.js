
(function () {
  'use strict';

  // ─── CONFIG ────────────────────────────────────────────────────────────────
  const UPLOAD_URL = 'https://i.nuuls.com/upload';
  const FIELD_NAME = 'file'; // multipart field name

  // ─── STATE ─────────────────────────────────────────────────────────────────
  let popupEl = null;

  // ─── INJECT GLOBAL CSS (spinner keyframe + shared styles) ──────────────────
  (function injectStyles() {
    if (document.getElementById('__nuuls-styles')) return;
    const s = document.createElement('style');
    s.id = '__nuuls-styles';
    s.textContent = `
 @keyframes __nuuls-spin {
        to { transform: rotate(360deg); }
      }
      @keyframes __nuuls-fadein {
        from { opacity: 0; transform: translateY(8px);
             }
        to   { opacity: 1; transform: translateY(0); 
             }
      }
      #__nuuls-popup { 
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 490px;
        background: #0b1423;
        border: 1px solid #38939c  !important;
        border-radius: 10px;
        padding: 14px;
        z-index: 99999;
        font-family: Inter, Roobert, "Helvetica Neue", sans-serif;
        color: #5c8af0;
        box-shadow: 0 8px 32px rgba(0,0,0,.65);
        animation: __nuuls-fadein .18s ease;
      }
      #__nuuls-popup .nu-title {
        font-size: 12px;
        font-weight: 600;
        color: #adadb8;
        text-transform: uppercase;
        letter-spacing: .06em;
        margin-bottom: 10px;
      }
      #__nuuls-popup .nu-preview {
        position: relative;
        width: 100%;
        height: 155px;
        border-radius: 6px;
        overflow: hidden;
        background: #060b0e  !important;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #__nuuls-popup .nu-preview img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 4px;
      }
      /* ── Loading overlay ── */
      #__nuuls-popup .nu-overlay {
        position: absolute;
        inset: 0;
        background: rgb(19 47 68 / 80%)  !important;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 9px;
        transition: opacity .2s;
      }
      #__nuuls-popup .nu-overlay.hidden { opacity: 0; pointer-events: none; }
      #__nuuls-popup .nu-spinner {
        width: 34px; height: 34px;
        border: 3px solid #329d84;
        border-top-color: #9147ff;
        border-radius: 50%;
        animation: __nuuls-spin .75s linear infinite;
      }
      #__nuuls-popup .nu-overlay-text {
        font-size: 16px !important;
        color: #38939c  !important;
      }
      /* ── URL row ── */
      #__nuuls-popup .nu-url-row {
        display: flex;
        gap: 6px;
        align-items: center;
        margin-bottom: 8px;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity .2s, transform .2s;
      }
      #__nuuls-popup .nu-url-row.visible {
        opacity: 1;
        transform: translateY(0);
      }
      #__nuuls-popup .nu-url-input {
        flex: 1;
        min-width: 0;
        background: #081b0d  !important;
        border: 1px solid #38939c  !important;
        border-radius: 5px;
        color: #5fb9c2 !important;
        padding: 6px 8px;
        font-size: 14px  !important;
        outline: none;
        cursor: text;
        user-select: all;
      }
      #__nuuls-popup .nu-btn {
        border: none;
        border-radius: 5px;
        font-size: 16px !important;
        font-weight: 600;
        padding: 6px 13px;
        cursor: pointer;
        white-space: nowrap;
        transition: filter .15s;
      }
      #__nuuls-popup .nu-btn:hover { filter: brightness(1.15); }
      #__nuuls-popup .nu-btn-send {
        background: #38939c !important;
        color: #0b2822 !important;
      }
      #__nuuls-popup .nu-btn-copy {
        background: #0b1423  !important;
        color: #efeff1;
        border: 1px solid #38939c  !important;
      }
      #__nuuls-popup .nu-btn-close {
        width: 100%;
        margin-top: 2px;
        background: transparent  !important;
        border: 1px solid #38939c  !important;
        color: #38939c  !important;
      }
      #__nuuls-popup .nu-error {
         font-size: 16px !important;
        color: #f87171  !important;
        margin-bottom: 6px;
        display: none;
      }

      /* ─ Upload button injected next to chat ─ */
      #__nuuls-trigger-btn {
        background: #373db7  !important;
        border: none;
        cursor: pointer;
        padding: 4px 6px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background .15s;
        color: #adadb8;
      }
      #__nuuls-trigger-btn:hover {
        background: rgb(88 18 18)  !important;
        color: #030c0b  !important;
       }
    `;
    document.head.appendChild(s);
  })();

  // ─── HELPERS ───────────────────────────────────────────────────────────────

  /** Insert text into Twitch React-controlled textarea */
  function insertToChat(text) {
    const ta = document.querySelector('textarea[data-a-target="chat-input"]');
    if (!ta) return;
    const nativeSetter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype, 'value'
    ).set;
    const val = ta.value ? ta.value + ' ' + text : text;
    nativeSetter.call(ta, val);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.focus();
    // Move cursor to end
    ta.selectionStart = ta.selectionEnd = ta.value.length;
  }

  function removePopup() {
    popupEl?.remove();
    popupEl = null;
  }

  // ─── UPLOAD ────────────────────────────────────────────────────────────────

  async function uploadFile(file) {
    const fd = new FormData();
    fd.append(FIELD_NAME, file, file.name || 'screenshot.png');
    const res = await fetch(UPLOAD_URL, { method: 'POST', body: fd });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.text()).trim();
  }

  // ─── POPUP UI ──────────────────────────────────────────────────────────────

  function buildPopup(file) {
    removePopup(); // only one at a time
      removePopup();
      const isVideo = file.type.startsWith('video/');  // ← определяем тип

    popupEl = document.createElement('div');
    popupEl.id = '__nuuls-popup';

    // Title
    const title = document.createElement('div');
    title.className = 'nu-title';
    title.textContent = '📤 Uploading to nuuls.com…';

    // Preview container
    const preview = document.createElement('div');
    preview.className = 'nu-preview';

const mediaEl = isVideo
    ? (() => {
        const v = document.createElement('video');
        v.src = URL.createObjectURL(file);
        v.controls = true;
        v.muted = true;
        v.style.cssText = 'max-width:100%;max-height:100%;border-radius:4px;';
        return v;
      })()
    : (() => {
        const i = document.createElement('img');
        i.src = URL.createObjectURL(file);
        i.alt = 'preview';
        return i;
      })();
  preview.appendChild(mediaEl);

    // Loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'nu-overlay';

    const spinner = document.createElement('div');
    spinner.className = 'nu-spinner';

    const overlayText = document.createElement('div');
    overlayText.className = 'nu-overlay-text';
    overlayText.textContent = 'Uploading…';

    overlay.append(spinner, overlayText);
    preview.appendChild(overlay);

    // Error line
    const errorEl = document.createElement('div');
    errorEl.className = 'nu-error';

    // URL row (shown after upload)
    const urlRow = document.createElement('div');
    urlRow.className = 'nu-url-row';

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.readOnly = true;
    urlInput.className = 'nu-url-input';
    urlInput.placeholder = 'Link will appear here…';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'nu-btn nu-btn-copy';
    copyBtn.textContent = 'Copy link📋';
    copyBtn.title = 'Copy link';
    copyBtn.onclick = () => {
      navigator.clipboard?.writeText(urlInput.value).catch(() => {});
      copyBtn.textContent = '✅';
      setTimeout(() => (copyBtn.textContent = '📋'), 1500);
    };

    const sendBtn = document.createElement('button');
    sendBtn.className = 'nu-btn nu-btn-send';
    sendBtn.textContent = 'Send to chat';
    sendBtn.onclick = () => {
      if (urlInput.value) {
        insertToChat(urlInput.value);
        removePopup();
      }
    };

    urlRow.append(urlInput, copyBtn, sendBtn);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'nu-btn nu-btn-close';
    closeBtn.textContent = '✕ Close';
    closeBtn.onclick = removePopup;

    popupEl.append(title, preview, errorEl, urlRow, closeBtn);
    document.body.appendChild(popupEl);

    // ── Return refs so we can mutate after upload ──
    return { title, overlay, overlayText, urlRow, urlInput, errorEl };
  }

  // ─── MAIN HANDLER ──────────────────────────────────────────────────────────

  async function handleFile(file) {
      const isImage = file?.type.startsWith('image/');
      const isVideo = file?.type.startsWith('video/');
      if (!isImage && !isVideo) return;


    const refs = buildPopup(file);

    try {
      const url = await uploadFile(file);

      // ── Success ──
      refs.title.textContent = '✅ Uploaded!';
      refs.overlay.classList.add('hidden');

      refs.urlInput.value = url;
      refs.urlRow.classList.add('visible');

      // Auto-select the input text
      refs.urlInput.focus();
      refs.urlInput.select();
    } catch (err) {
      // ── Error ──
      refs.overlay.classList.add('hidden');
      refs.title.textContent = '❌ Upload failed';
      refs.errorEl.style.display = 'block';
      refs.errorEl.textContent = `Error: ${err.message}`;
      console.error('[NuulsUploader]', err);
    }
  }

  // ─── PASTE LISTENER (Ctrl+V with image) ────────────────────────────────────

  function onPaste(e) {
    const items = Array.from(e.clipboardData?.items ?? []);
    const imgItem = items.find(i => i.type.startsWith('image/'));
    if (!imgItem) return;

    e.preventDefault();      // don't paste raw data into textarea
    e.stopImmediatePropagation();

    const file = imgItem.getAsFile();
    if (file) handleFile(file);
  }

  document.addEventListener('paste', onPaste, true); // capture phase — runs before Twitch handlers

  // ─── UPLOAD BUTTON next to chat input ──────────────────────────────────────
  //     Injects a small 🖼 button into the chat toolbar

  function injectTriggerButton() {
    if (document.getElementById('__nuuls-trigger-btn')) return;

    const toolbar = document.querySelector(
      '[data-a-target="chat-input-buttons-container"],' +
      '.chat-input__textarea-container,' +
      'form[data-a-target="chat-form"]'
    );
    if (!toolbar) return;

    const btn = document.createElement('button');
    btn.id = '__nuuls-trigger-btn';
    btn.title = 'Upload image to nuuls.com';
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/>
        <path d="m21 15-5-5L5 21"/>
      </svg>
    `;

    const picker = document.createElement('input');
    picker.type = 'file';
   picker.accept = 'image/*,video/*'; 
    picker.style.display = 'none';
    picker.onchange = () => {
      const f = picker.files?.[0];
      if (f) handleFile(f);
      picker.value = '';
    };

    btn.onclick = () => picker.click();
    toolbar.prepend(btn, picker);
  }

  // Retry injection until chat toolbar appears (Twitch is a SPA)
  const obsToolbar = new MutationObserver(() => injectTriggerButton());
  obsToolbar.observe(document.body, { childList: true, subtree: true });
  injectTriggerButton(); // attempt immediately too

  // ─── DRAG & DROP over chat area ────────────────────────────────────────────

  document.addEventListener('dragover', e => {
    if ([...e.dataTransfer.items].some(i => i.type.startsWith('image/'))) {
      e.preventDefault();
    }
  });

    document.addEventListener('drop', e => {
    const f = [...e.dataTransfer.files].find(
      f => f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    if (!f) return;
    e.preventDefault();
    handleFile(f);
  });


  console.log('[NuulsUploader] ✅ Ready — paste / drag an image or use the 🖼 button');
})(); 