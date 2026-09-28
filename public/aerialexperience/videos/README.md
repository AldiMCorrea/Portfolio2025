# Videos de Aerial Experience

Poné acá los videos cortos (≈30 s) para la página. Todo lo que esté en esta
carpeta se publica en `https://www.aldicorrea.com/aerialexperience/videos/<archivo>`.

## Recomendaciones

- **Formato:** `.mp4` (H.264 + AAC) — se reproduce en todos los navegadores y en iPhone.
- **Resolución:** 720p alcanza (1080p como máximo). Vertical 9:16 si salen de Instagram/Reels.
- **Peso:** idealmente menos de 10 MB por video (GitHub rechaza archivos de más de 100 MB).
- **Nombre:** en minúsculas, sin espacios ni tildes, p. ej. `trapecio-giro.mp4`.
- **Portada (opcional):** una imagen con el mismo nombre, p. ej. `trapecio-giro.jpg`.

Para comprimir un video con ffmpeg:

    ffmpeg -i original.mov -vf "scale=-2:720" -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 96k -movflags +faststart trapecio-giro.mp4
