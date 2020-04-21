import os
from flask import Flask, jsonify, request, flash
from werkzeug.utils import secure_filename

import cv2
import imutils
import numpy as np

import api

UPLOAD_FOLDER = '/Users/iandavisSSD/programming/tp/TP_App_Backend/fileuploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return jsonify('TP App landing page testing some more letters')
    
@app.route('/measure', methods=['GET', 'POST'])
def measure():
    if request.method == 'POST':

        photoReady = False

        if 'file' not in request.files:
            flash('No file part')
            print('no file part')
            return jsonify('no file part')
        else:
            print('file is present')
        file = request.files['file']

        #check for empty filename
        if file.filename == '':
            flash('no selected file')
            print('no selected file')
            return jsonify('no selected file')
        else:
            print('file is selected')
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            photoReady = True

            #return jsonify('file uploaded succesfully')
        print(f'photoReady?: {photoReady}')

        if photoReady:
            api.measure()
            print('measure called in main thread')
        return jsonify('the measurement')


    else:
        return jsonify('This was a GET request. To recieve a measurement please send a POST request with an image')



if __name__ == '__main__':
    app.run(debug=True)