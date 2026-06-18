const fileTypeExtsMap = {
  image: ['jpg', 'jpeg', 'bmp', 'gif', 'png', 'tif'],
  video: ['avi', 'mpg', 'mpeg', 'mov', 'mp4'],
  audio: ['wav', 'ram', 'mp3'],
  word: ['docx', 'doc'],
  excel: ['xlsx', 'xls'],
  ppt: ['ppt', 'pptx'],
  pdf: ['pdf'],
}

const fileExtsMap = Object.keys(fileTypeExtsMap).reduce((ret, fileType) => {
  fileTypeExtsMap[fileType].forEach((ext) => {
    ret[ext] = fileType
  })
  return ret
}, {})

export function getFileType(name: string) {
  return fileExtsMap[name.split('.').pop() as string] ?? 'file'
}

export function getFileIcon(name: string) {
  const fileType = getFileType(name)
  const iconName = {
    image: 'Image',
    video: 'Film',
    audio: 'AudioLines',
    word: 'icon-word',
    excel: 'icon-excel',
    ppt: 'icon-ppt',
    pdf: 'icon-pdf',
    file: 'File',
  }[fileType ?? 'file']
  return iconName
}

export function fileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('')
    }
    const reader = new FileReader()

    reader.onload = function (e: any) {
      resolve(e.target.result)
    }

    reader.onerror = function () {
      reject(reader.error)
    }
    reader.readAsDataURL(file)
  })
}

export function fileToText(file: File) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('')
    }
    const reader = new FileReader()

    reader.onload = function (e: any) {
      resolve(e.target.result)
    }

    reader.onerror = function () {
      reject(reader.error)
    }
    reader.readAsText(file, 'UTF-8')
  })
}

/**
 * 压缩图片文件到指定大小（KB）
 * @param file 原始图片文件
 * @param maxSizeKB 最大文件大小（KB），默认 10KB
 * @param maxWidth 最大宽度，默认 256
 * @param maxHeight 最大高度，默认 256
 * @returns 压缩后的 base64 字符串
 */
export function compressImage(
  file: File,
  maxSizeKB = 10,
  maxWidth = 256,
  maxHeight = 256
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('')
      return
    }

    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(reader.error)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img

      // 计算缩放比例，保持宽高比
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

      // 使用二分法查找合适的压缩质量
      const maxSizeBytes = maxSizeKB * 1024
      let quality = 0.9
      let minQuality = 0.1
      let maxQuality = 1.0
      let result = canvas.toDataURL('image/png')

      // 先尝试 PNG 格式
      if (getBase64Size(result) <= maxSizeBytes) {
        resolve(result)
        return
      }

      // PNG 太大，改用 JPEG 并逐步降低质量
      for (let i = 0; i < 10; i++) {
        quality = (minQuality + maxQuality) / 2
        result = canvas.toDataURL('image/jpeg', quality)
        const size = getBase64Size(result)

        if (size <= maxSizeBytes) {
          minQuality = quality
        } else {
          maxQuality = quality
        }

        // 如果已经接近目标大小，提前退出
        if (Math.abs(size - maxSizeBytes) < 500) {
          break
        }
      }

      // 最终确保不超过限制
      result = canvas.toDataURL('image/jpeg', minQuality)
      resolve(result)
    }

    img.onerror = () => reject(new Error('Failed to load image'))

    reader.readAsDataURL(file)
  })
}

/**
 * 计算 base64 字符串的实际字节大小
 */
function getBase64Size(base64: string): number {
  const base64Data = base64.split(',')[1] || base64
  const padding = (base64Data.match(/=+$/) || [''])[0].length
  return Math.floor((base64Data.length * 3) / 4) - padding
}
