from django.conf.urls import url
from django.views.generic import TemplateView
from api import views

urlpatterns = [
    url(r'^api/shape/(?P<pk>[0-9]+)/$', views.api_shape_get_put_delete, name='api-key'),
    url(r'^api/shape/$', views.api_shape_get_post, name='api-nokey'),
    url(r'^api/style/$', views.api_style_get, name='api-style'),
    # url(r'^$', views.HomePageView.as_view(), name='index'),
    url(r'^$', TemplateView.as_view(template_name='api/index.html'), name='index'),
]