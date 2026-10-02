import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from fastapi import UploadFile
from beanie import PydanticObjectId
from src.core.settings.settings import get_settings

settings = get_settings()

class R2Storage:
    def __init__(self):
        self.client = boto3.client(
            "s3",
            endpoint_url=settings.r2.endpoint,
            aws_access_key_id=settings.r2.access_key_id,
            aws_secret_access_key=settings.r2.secret_access_key,
            config=Config(signature_version="s3v4"),
        )
        self.bucket = settings.r2.bucket

    def _key_original(self, libro_id: PydanticObjectId) -> str:
        return f"libros/{libro_id}/original.pdf"

    def _key_personal(self, libro_id: PydanticObjectId, user_id: str) -> str:
        return f"libros/{libro_id}/personal/{user_id}.pdf"

    async def subir_pdf_original(
        self, libro_id: PydanticObjectId, archivo: UploadFile
    ) -> str:
        key = self._key_original(libro_id)
        contenido = await archivo.read()
        self.client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=contenido,
            ContentType="application/pdf",
        )
        return key

    def existe_original(self, libro_id: PydanticObjectId) -> bool:
        key = self._key_original(libro_id)
        try:
            self.client.head_object(Bucket=self.bucket, Key=key)
            return True
        except ClientError:
            return False

    def existe_version_personal(
        self, libro_id: PydanticObjectId, user_id: str
    ) -> bool:
        key = self._key_personal(libro_id, user_id)
        try:
            self.client.head_object(Bucket=self.bucket, Key=key)
            return True
        except ClientError:
            return False

    def obtener_version_personal(
        self, libro_id: PydanticObjectId, user_id: str
    ) -> str:
        return self._key_personal(libro_id, user_id)

    def subir_version_personal(
        self, libro_id: PydanticObjectId, user_id: str, contenido: bytes
    ) -> str:
        key = self._key_personal(libro_id, user_id)
        self.client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=contenido,
            ContentType="application/pdf",
        )
        return key

    def descargar_original(self, libro_id: PydanticObjectId) -> bytes:
        key = self._key_original(libro_id)
        obj = self.client.get_object(Bucket=self.bucket, Key=key)
        return obj["Body"].read()

    def firmar_url_descarga(
        self, key: str, expira_segundos: int = 900
    ) -> str:
        return self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": key},
            ExpiresIn=expira_segundos,
        )

    def eliminar_original(self, libro_id: PydanticObjectId) -> None:
        key = self._key_original(libro_id)
        self.client.delete_object(Bucket=self.bucket, Key=key)

    def eliminar_versiones_personales(
        self, libro_id: PydanticObjectId
    ) -> None:
        prefix = f"libros/{libro_id}/personal/"
        paginator = self.client.get_paginator("list_objects_v2")
        for page in paginator.paginate(Bucket=self.bucket, Prefix=prefix):
            objetos = page.get("Contents", [])
            if objetos:
                self.client.delete_objects(
                    Bucket=self.bucket,
                    Delete={"Objects": [{"Key": obj["Key"]} for obj in objetos]},
                )

storage = R2Storage()