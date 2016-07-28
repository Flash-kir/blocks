from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import JsonResponse
# from django.contrib.sites.models import Site
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import QueryDict
from objects.models import Shape


class HomePageView(TemplateView):
    template_name = "api/index.html"


# REST API Description

# GET /api/shapes - ALL shapes
# GET /api/shapes/%d - ONE shape
# POST /api/shapes - NEW
# PUT /api/shapes/%d => UPDATE
# DELETE /api/shapes/%d - DELETE

@csrf_exempt
def api_shape_get_post(request):
    if request.method == 'GET':
        return JsonResponse([x.to_json() for x in Shape.objects.all()], safe=False)
    elif request.method == 'POST':
        shape = Shape()
        # import ipdb;ipdb.set_trace()
        shape.from_json(json.loads((request.body).decode('utf-8')))
        shape.save()
        return JsonResponse(shape.to_json())


@csrf_exempt
def api_shape_get_put_delete(request, pk):
    if request.method == 'GET':
        shape = Shape.objects.get(pk=pk)
        return JsonResponse(shape.to_json())
    elif request.method == 'PUT':
        shape = Shape.objects.get(pk=pk)
        shape.from_json(json.loads((request.body).decode('utf-8')))
        shape.save()
        return JsonResponse(shape.to_json())
    elif request.method == 'DELETE':
        shape = Shape.objects.filter(pk=pk).first()
        res = {'message': 'not found', 'status': 200}
        if shape:
            res = shape.to_json()
            shape.delete()
        return JsonResponse(res)
