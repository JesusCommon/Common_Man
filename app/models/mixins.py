from datetime import datetime, UTC
from pydantic import Field
from beanie import before_event, Insert, Save, Replace

class TimestampMixim:
    fecha_creacion: datetime = Field(
        default_factory=lambda:datetime.now(UTC),
        description="Fecha de creación"
    )

    fecha_actualizacion: datetime = Field(
        default_factory=lambda:datetime.now(UTC),
        description="Fecha de actualización"
    )

    @before_event(Insert)
    def set_timestamp_insert(self):
        now = datetime.now(UTC)
        self.fecha_creacion = now
        self.fecha_actualizacion = now

    @before_event(Save, Replace)
    def set_fecha_actualizacion(self):
        self.fecha_actualizacion = datetime.now(UTC)

class StatusMixin:
    activo : bool = Field(
        default=True, 
        description="Estado del registro",
        examples=[True]
    )
