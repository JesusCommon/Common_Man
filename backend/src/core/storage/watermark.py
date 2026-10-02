import pymupdf 
from datetime import datetime
from beanie import PydanticObjectId


def generar_version_personal_wm(
    pdf_bytes: bytes,
    libro_id: PydanticObjectId,
    user_id: str,
    email: str,
) -> bytes:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")

    timestamp = datetime.utcnow().isoformat()
    metadata = {
        "title": doc.metadata.get("title", ""),
        "author": doc.metadata.get("author", ""),
        "subject": f"Purchased by {user_id}",
        "keywords": f"license:{user_id}:{email}:{timestamp}",
        "creator": "Common Man Biblioteca",
    }
    doc.set_metadata(metadata)
    texto_invisible = f"User:{user_id}|Email:{email}|Time:{timestamp}"
    for page in doc:
        page.insert_text(
            (10, 20),
            texto_invisible,
            fontsize=1,
            color=(1, 1, 1),
            overlay=True,
            render_mode=3
        )
        page.insert_text(
            (page.rect.width - 200, page.rect.height - 10),
            texto_invisible,
            fontsize=1,
            color=(1, 1, 1),
            overlay=True,
            render_mode=3,
        )

    output = doc.tobytes()
    doc.close()
    return output