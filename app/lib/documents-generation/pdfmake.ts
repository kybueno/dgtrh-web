export async function getImageDataUrl(path: string) {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`No se pudo cargar la imagen: ${path}`)
  }

  const blob = await response.blob()
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
