export function fillTemplate(template, data) {
  const all = `${template.header_html || ''}${template.body_html || ''}${template.footer_html || ''}`
  return all.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const k = String(key).trim()
    return data[k] ?? ''
  })
}

export function openPrintWindow({ template, data, title = 'طباعة' }) {
  const html = fillTemplate(template, data)
  const css = template.css || ''
  const paper = template.paper_size || 'A4'
  const orientation = template.orientation || 'portrait'

  const doc = `
<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
${css}
@media print {
  .no-print { display:none !important; }
}
@page { size: ${paper} ${orientation}; }
</style>
</head>
<body>
<div class="no-print" style="position:fixed;top:10px;left:10px;z-index:9999;display:flex;gap:8px">
  <button onclick="window.print()" style="padding:10px 16px;border:0;border-radius:8px;background:#2563eb;color:white;font-weight:bold">طباعة</button>
  <button onclick="window.close()" style="padding:10px 16px;border:0;border-radius:8px;background:#111827;color:white;font-weight:bold">إغلاق</button>
</div>
${html}
</body>
</html>`

  const win = window.open('', '_blank')
  win.document.open()
  win.document.write(doc)
  win.document.close()
  setTimeout(() => win.focus(), 300)
}
