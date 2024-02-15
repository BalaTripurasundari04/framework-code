from django.urls import path
from .views import register_api,login_api,employee_details,clockin_api,clockout_api,attendance_api
urlpatterns = [
    path('login', login_api.as_view()),
    path('register', register_api.as_view()),
    path('employee', employee_details.as_view()),
    path('clockin', clockin_api.as_view()),
    path('clockout', clockout_api.as_view()),
    path('attendance/', attendance_api.as_view()),
    path('attendance/<int:employee_id>/', attendance_api.as_view()),
    path('attendance/<int:employee_id>/<str:month>', attendance_api.as_view()),
]