export async function download({
  url,
  fileName,
}: {
  url: string
  fileName: string
}) {
  const downloadEl = document.createElement('a')
  downloadEl.style.display = 'none'
  downloadEl.href = url
  downloadEl.target = '_blank'
  downloadEl.rel = 'noopener noreferrer'
  downloadEl.download = fileName
  document.body.appendChild(downloadEl)
  downloadEl.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(downloadEl)
}
