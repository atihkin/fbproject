from django.db import models

class Choice(models.Model):
    winner = models.BigIntegerField()
    contestant1 = models.BigIntegerField()
    contestant2 = models.BigIntegerField()
    voter = models.BigIntegerField()
    pub_date = models.DateTimeField(auto_now_add=True)
