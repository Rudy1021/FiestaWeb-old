from flask import Flask, render_template, request, redirect, url_for, send_file
from flask import session, make_response, Response
import datetime
import os
import json
import requests

app = Flask(__name__)
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY


@app.before_request
def make_session_permanet():
    session.permanet = True
    app.permanet_session_lifetime = datetime.timedelta(minutes=10)


@app.route('/.well-known/pki-validation/<id>')
def acme_challenge(id):
    string = '7F372DACD22AD3C9635392BAEED295A4B5AF357A21CA6CA794A4D71CBC6B28F3'
    return string + "\ncomodoca.com\n0d85cbaf4e573c1"


# index
@app.route("/")
def index():
    return render_template('index.html')
# ---------------------------------------------------


@app.route('/success')
def success():
    return render_template('success.html')


@app.route("/Group")
def Group():
    return render_template('Group.html')


@app.route('/CreateEvent')
def CreateEvent():
    return render_template("CreateEvent.html")


@app.route('/MyProfile', methods=['GET'])
def MyProfile():
    return render_template("MyProfile.html")


@app.route('/MyTicket', methods=['GET'])
def MyTicket():
    return render_template("MyTicket.html")


@app.route("/favicon.ico")
def favicon():
    return app.send_static_file("img/favicon.ico")


@app.route('/login', methods=['GET'])
def logintest():
    return render_template("login.html")


@app.route("/check")
def check():
    return render_template("check.html")


@app.route('/signup')
def signup():
    return render_template("signup.html")


@app.route('/forgotpassword/<id>')
def forgotpassword(id):
    return render_template("forgotpassword.html")


@app.route('/Mailsuccess/<id>')
def Mailsuccess(id):
    return render_template("successMail.html")


@app.route('/QRcode')
def QRcode():
    return render_template("QRcode.html")


@app.route('/Activity')
def Activity():
    return render_template("Activity.html")


@app.route('/Activity/<act_Name>/', methods=['GET'])
def showAct(act_Name):
    return render_template("showAct.html", act_Name=act_Name)


@app.route('/editActivity/<act_Name>/', methods=['GET'])
def editAct(act_Name):
    return render_template("editAct.html", act_Name=act_Name)


@app.route('/dashboard')
def dashboard():
    return render_template("dashboard.html")


@app.route('/dashboard/model')
def dashboardId():
    return render_template("dashboard-mod.html")


@app.route("/apple-app-site-association")
def apple():
    response = make_response(
        send_file(".well-known/apple-app-site-association",
                  mimetype='application/pkcs7-mime'))
    return response


@app.route("/policy")
def private():
    return render_template("private.html")


@app.route("/advertising")
def advertising():
    return render_template("advertising.html")


@app.route("/test")
def test():
    return render_template("test.html")


@app.route("/tag")
def tag():
    return render_template("tag.html")


@app.route("/activity-new")
def actnew():
    return render_template("activity-new.html")


@app.route("/create-new")
def createnew():
    return render_template("create-new.html")


@app.route("/review/<actId>")
def newreview(actId):
    return render_template("review.html", actId=actId)


@app.route('/dashboard/survey')
def survey():
    return render_template("survey.html")


# Run App
if __name__ == "__main__":
    app.jinja_env.auto_reload = True
    app.run(
        host='0.0.0.0',
        port=4567,
        debug=True,
    )
