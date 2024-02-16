from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# Create your models here.


class CustomUserManager(BaseUserManager):
    def create_user(self, employee_id, employee_name, employee_email, password=None, **extra_fields):
        user = self.model(
            employee_id=employee_id,
            employee_name=employee_name,
            employee_email=employee_email,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
class Employee(AbstractBaseUser, PermissionsMixin):
    employee_id = models.CharField(unique=True, max_length=20)
    employee_name = models.CharField(max_length=255)
    employee_email = models.EmailField(unique=True)
    employee_photo = models.ImageField(upload_to='employee_photos/', null=True, blank=True)
    role = models.CharField(max_length=50)
    objects = CustomUserManager()

    USERNAME_FIELD = 'employee_email'
    REQUIRED_FIELDS = ['employee_id', 'employee_name']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

class Attendance(models.Model):
    employee_id = models.CharField(max_length=20)
    clockin_time = models.TimeField(null=True, blank=True, max_length=20)
    clockout_time = models.TimeField(null=True, blank=True, max_length=20)
    clockin_date = models.DateField(null=True, blank=True)
    clockout_date = models.DateField(null=True, blank=True)
    month = models.CharField(null=True, blank=True, max_length=20 )
    year = models.IntegerField(null=True, blank=True)
    hour_worked = models.CharField(max_length=20, default='00:00:00')
    day_present = models.IntegerField(default=0)  
    leave = models.IntegerField(default=1) 
    status = models.CharField(max_length=20, default='')



  



    