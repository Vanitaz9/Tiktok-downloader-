const form = document.getElementById('downloadForm');
const urlInput = document.getElementById('url');
const result = document.getElementById('result');
const titleEl = document.getElementById('title');
const thumbEl = document.getElementById('thumb');
const statusEl = document.getElementById('status');
const actionsEl = document.getElementById('actions');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = urlInput.value.trim();
  if (!url) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Memproses...';
  result.classList.add('hidden');
  actionsEl.innerHTML = '';
  titleEl.textContent = '';
  thumbEl.src = '';

  try {
    const resp = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const data = await resp.json();
    if (!resp.ok) {
      statusEl.textContent = data.error || 'Gagal memproses URL';
      result.classList.remove('hidden');
      return;
    }

    // Demo provider not configured
    if (data.demo) {
      titleEl.textContent = data.title || 'Demo video';
      thumbEl.src = data.thumbnail || '/placeholder-thumb.jpg';
      statusEl.textContent = data.message || 'Demo mode';
      actionsEl.innerHTML = '<p style="color:#cbd5e1">Provider belum dikonfigurasi. Lihat README.</p>';
      result.classList.remove('hidden');
      return;
    }

    titleEl.textContent = data.title || 'Video TikTok';
    thumbEl.src = data.thumbnail || '';
    statusEl.textContent = 'Siap untuk diunduh';

    // Show actions: Open in new tab (direct video link) and Download
    actionsEl.innerHTML = '';
    if (data.videoUrl) {
      const openBtn = document.createElement('button');
      openBtn.textContent = 'Buka Video';
      openBtn.onclick = () => window.open(data.videoUrl, '_blank');

      const dlBtn = document.createElement('button');
      dlBtn.textContent = 'Download';
      dlBtn.onclick = () => {
        // Create a link element and click it to download
        const a = document.createElement('a');
        a.href = data.videoUrl;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        a.remove();
      };

      actionsEl.appendChild(openBtn);
      actionsEl.appendChild(dlBtn);
    } else {
      actionsEl.innerHTML = '<p style="color:#cbd5e1">Provider tidak mengembalikan link unduh.</p>';
    }

    result.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Kesalahan koneksi atau server.';
    result.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Cek & Download';
  }
});
