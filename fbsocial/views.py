# Create your views here.
from django.shortcuts import render
from fbsocial.models import Choice
from django.db import connection
from django.shortcuts import render_to_response
from urllib2 import urlopen
from simplejson import loads

def login_form(request):
    return render(request, 'login_form.html')

def results(request):
    return render(request, 'results.html')

def vote(request):
    if request.method == 'POST':
        c = Choice(winner=request.POST['winner'], contestant1=request.POST['contestant1'],
                   contestant2=request.POST['contestant2'], voter=request.POST['voter'])
        c.save()
    cursor = connection.cursor()
    # Data retrieval operation - no commit required
    #cursor.execute("select voter, winner, count(winner) from fbsocial_choice group by voter")
    cursor.execute("select voter,winner,count(winner) as count from fbsocial_choice group by winner order by count DESC limit 1")
    data = cursor.fetchall()
    return render_to_response ('results.html',{'data':data})


