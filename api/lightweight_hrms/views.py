import jwt, datetime
from django.db.models import Q
from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import EmployeeSerializer, AttendanceSerializer
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import Employee,Attendance
from rest_framework import status
from datetime import datetime as dt

class register_api(APIView):
    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class login_api(APIView):
    def post(self, request):
        employee_email = request.data['employee_email']
        password = request.data['password']
        

        user = Employee.objects.filter(employee_email=employee_email).first()

        if user is None:
            return Response({'result': False, 'message': 'Invalid Email'})

        if password != user.password:
            return Response({'result': False, 'message': 'Invalid Password'})

        payload = {
            'employee_id': user.employee_id,
            'exp': (datetime.datetime.utcnow() + datetime.timedelta(minutes=60)),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'result':True,
            'jwt': token,
        }
        
        return response

class employee_details(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token!')

        employee_id = payload.get('employee_id')

        if not employee_id:
            raise AuthenticationFailed('Invalid token!')

        user = Employee.objects.filter(employee_id=employee_id).first()

        if not user:
            raise AuthenticationFailed('User not found!')

        serializer = EmployeeSerializer(user)
        response_data = serializer.data

        return Response(response_data)

class clockin_api(APIView):
    def post(self, request):
        serializer = AttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee_id = serializer.validated_data['employee_id']
        clockin_time = serializer.validated_data['clockin_time']
        clockin_date = serializer.validated_data['clockin_date']
        day_present = 1 
        leave = 0
        month = clockin_date.strftime('%B')
        year = clockin_date.year
        status = 'late arrival' if clockin_time.hour > 11 else ''
        serializer.validated_data['day_present'] = day_present
        serializer.validated_data['leave'] = leave
        serializer.validated_data['month'] = month
        serializer.validated_data['year'] = year
        serializer.validated_data['status'] = status
        serializer.save()
        return Response(serializer.data)
    

class clockout_api(APIView):
    def post(self, request):
        serializer = AttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee_id = serializer.validated_data['employee_id']
        clockout_time = serializer.validated_data['clockout_time']
        clockout_date = serializer.validated_data['clockout_date']
        try:
            clockin_record = Attendance.objects.get(employee_id=employee_id, clockin_date=clockout_date)
        except Attendance.DoesNotExist:
            return Response({"error": "Clock-in record not found for the specified date and employee"})
        clockin_datetime = dt.combine(clockin_record.clockin_date, clockin_record.clockin_time)
        clockout_datetime = dt.combine(clockout_date, clockout_time)
        hours_worked_timedelta = clockout_datetime - clockin_datetime
        hours_worked_seconds = int(hours_worked_timedelta.total_seconds())
        hours, remainder = divmod(hours_worked_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        hours_worked_formatted = "{:02}:{:02}:{:02}".format(int(hours), int(minutes), int(seconds))
        serializer.validated_data['hour_worked'] = hours_worked_formatted
        status_values = [clockin_record.status]
        if 17 <= clockout_time.hour < 19 :
            status_values.append('')
        elif clockout_time.hour < 17 :
            status_values.append('Early Departure')
        elif clockout_time.hour >= 19 or not clockin_record.clockout_time:
            status_values.append('Overtime')
        else:
            status_values = ''
        serializer.validated_data['status'] = ', '.join(status_values)
        clockin_record.clockout_time = clockout_time
        clockin_record.hour_worked = hours_worked_formatted
        clockin_record.status = status_values
        clockin_record.save()
        return Response(serializer.data)
    

class attendance_api(APIView):
    def get(self, request, employee_id=None, month=None):
        employee_id = request.query_params.get('employee_id')
        month = request.query_params.get('month')

        attendance_records = Attendance.objects.all()

        filter_conditions = Q()

        if employee_id is not None:
            filter_conditions &= Q(employee_id=employee_id)

        if month is not None:
            filter_conditions &= Q(month=month)

        attendance_records = attendance_records.filter(filter_conditions).order_by('clockin_date')

        serializer = AttendanceSerializer(attendance_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


