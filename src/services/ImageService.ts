export async function imageUrlToFile(imageUrl: string, filename: string) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}