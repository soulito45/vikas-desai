export default function ImageGallery({ images, altPrefix = 'Property image' }) {
  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <img key={`${altPrefix}-${index}`} src={image} alt={`${altPrefix} ${index + 1}`} loading="lazy" />
      ))}
    </div>
  )
}
