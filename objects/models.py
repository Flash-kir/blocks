from django.db import models
from datetime import datetime
from django.utils import timezone

# Create your models here.
class Shape(models.Model):
    type = models.CharField(max_length=32, null=True, blank=True)
    cls = models.CharField(max_length=64, null=True, blank=True)

    def get_style(self):
        res = {}
        for stl in Style.objects.filter(obj=self.id):
            res[str(stl.name)] = str(stl.value)
        return res

    def set_style(self, name, value):
        stl = Style.objects.filter(obj=self.id, name=name).first()
        if stl:
            stl.value = value
            stl.modify = timezone.now()
            stl.save()
        else:
            stl = Style()
            stl.obj = self
            stl.name = name
            stl.value = value
            stl.modify = timezone.now()
            stl.save()

    def set_styles(self, style_str):
        for k, v in style_str.items():
            self.set_style(k, v)

    def to_json(self):
        return {"id": self.id, "class": self.cls, "type": self.type, "style": self.get_style()}

    def from_json(self, data):
        if "class" in data.keys():
            self.cls = data["class"]
        if "type" in data.keys():
            self.type = data["type"]
        self.save()
        self.set_styles(data["style"])


class Style(models.Model):
    obj = models.ForeignKey(Shape)
    name = models.CharField(max_length=64, null=True, blank=True)
    value = models.CharField(max_length=256, null=True, blank=True)
    modify = models.DateTimeField(default=timezone.now(), null=True, blank=True)

    def to_json(self):
        return {"id": self.obj_id, "name": self.name, "value": self.value}
