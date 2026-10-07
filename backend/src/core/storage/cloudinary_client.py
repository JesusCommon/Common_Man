import cloudinary
import cloudinary.uploader
import cloudinary.utils
from src.core.settings.settings import get_settings

settings = get_settings()

cloudinary.config(
    cloud_name=settings.cloudinary.cloud_name,
    api_key=settings.cloudinary.api_key,
    api_secret=settings.cloudinary.api_secret.get_secret_value(),
    secure=True,
)

class CloudinaryStorage:
    def __init__(self):
        self.folder_base = settings.cloudinary.folder

    async def subir_imagen(
        self,
        contenido: bytes,
        carpeta: str,
        public_id: str | None = None,
        transformaciones: dict | None = None,
    ) -> dict:
        folder = f"{self.folder_base}/{carpeta}"

        upload_options = {
            "folder": folder,
            "resource_type": "image",
            "overwrite": True,
        }

        if public_id:
            upload_options["public_id"] = public_id

        resultado = cloudinary.uploader.upload(contenido, **upload_options)

        url_opts = {
            "fetch_format": "auto",
            "quality": "auto",
        }

        if transformaciones:
            url_opts.update(transformaciones)

        url_optimizada = cloudinary.utils.cloudinary_url(
            resultado["public_id"],
            **url_opts,
        )[0]

        return {
            "url": url_optimizada,
            "public_id": resultado["public_id"],
            "width": resultado["width"],
            "height": resultado["height"],
            "format": resultado["format"],
        }

    async def eliminar_imagen(self, public_id: str) -> bool:
        try:
            resultado = cloudinary.uploader.destroy(public_id)
            return resultado.get("result") == "ok"
        except Exception:
            return False

cloudinary_storage = CloudinaryStorage()