from rest_framework import serializers
from .models import Employee,Attendance

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['employee_id', 'employee_name', 'employee_email','password', 'employee_photo', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class AttendanceSerializer(serializers.ModelSerializer): 
    class Meta :
        model = Attendance
        fields = ['employee_id','clockin_time','clockout_time','clockin_date','clockout_date','month','year','hour_worked','day_present','leave','status']
